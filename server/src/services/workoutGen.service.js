/**
 * Workout Generator Service
 *
 * Split rules:
 *   1-3 days  → Full_Body
 *   4 days    → Upper_Lower
 *   5-6 days  → Push_Pull_Legs
 */

import Exercise from '../models/Exercise.model.js';
import WorkoutPlan from '../models/WorkoutPlan.model.js';

const SPLIT_MAP = {
  1: ['full_body'],
  2: ['full_body', 'full_body'],
  3: ['full_body', 'full_body', 'full_body'],
  4: ['upper', 'lower', 'upper', 'lower'],
  5: ['push', 'pull', 'legs', 'push', 'pull'],
  6: ['push', 'pull', 'legs', 'push', 'pull', 'legs'],
  7: ['push', 'pull', 'legs', 'push', 'pull', 'legs', 'full_body'],
};

const TARGET_TO_FOCUS = {
  chest: ['upper', 'push', 'full_body'],
  back: ['upper', 'pull', 'full_body'],
  shoulders: ['upper', 'push', 'full_body'],
  arms: ['upper', 'push', 'pull', 'full_body'],
  legs: ['lower', 'legs', 'full_body'],
  core: ['core', 'full_body', 'upper', 'lower'],
  cardio_full: ['full_body', 'upper', 'lower', 'push', 'pull', 'legs'],
  full_body: ['full_body', 'upper', 'lower', 'push', 'pull', 'legs'],
};

/** Duration (seconds) consumed by a single exercise */
function exerciseDuration(ex) {
  const work = ex.workSeconds || ex.defaultWorkSeconds || 40;
  const rest = ex.restSeconds || ex.defaultRestSeconds || 20;
  const sets = ex.sets || ex.defaultSets || 3;
  return sets * (work + rest);
}

/** Estimated kcal burned for one exercise slot */
function estimateBurn(ex, weightKg) {
  const durationMins = exerciseDuration(ex) / 60;
  const met = ex.metValue || 5;
  return (met * 3.5 * weightKg * durationMins) / 200;
}

export async function generateWorkoutPlan(user) {
  const workoutDays = user.preferences?.workoutDays || user.workoutDays || ['Mon', 'Wed', 'Fri'];
  const equipment = user.preferences?.equipment || user.equipment || ['none_home'];
  const fitnessLevel = user.preferences?.fitnessLevel || user.fitnessLevel || 'beginner';
  const sessionDurationMins = user.preferences?.sessionDurationMins || user.sessionDurationMins || 45;
  const weightKg = user.weightKg || user.biometrics?.weightKg || 70;
  const userId = user._id;

  const numDays = workoutDays.length;
  const splitType =
    numDays <= 3 ? 'Full_Body' : numDays === 4 ? 'Upper_Lower' : 'Push_Pull_Legs';

  const focusSequence = SPLIT_MAP[numDays] || SPLIT_MAP[3];
  const budgetSeconds = sessionDurationMins * 60;
  const bufferSeconds = 5 * 60;

  // Difficulty levels the user can do
  const levelOrder = ['beginner', 'intermediate', 'advanced'];
  const allowedLevels = levelOrder.slice(0, levelOrder.indexOf(fitnessLevel) + 1);

  // Fetch all eligible exercises once
  const allExercises = await Exercise.find({
    $or: [
      { equipment: { $in: [...equipment, 'none_home'] } },
      { equipmentRequired: { $in: [...equipment, 'none_home'] } },
    ],
    difficulty: { $in: allowedLevels.length ? allowedLevels : ['beginner'] },
  }).lean();

  const days = workoutDays.map((dayOfWeek, i) => {
    const focusArea = focusSequence[i % focusSequence.length];

    // Prefer exact focus; fall back to mapped target muscles or full_body
    const pool = allExercises.filter((ex) => {
      if (ex.focusAreas && ex.focusAreas.includes(focusArea)) return true;
      if (ex.targetMuscle) {
        if (ex.targetMuscle === focusArea || ex.targetMuscle === 'full_body') return true;
        const mapped = TARGET_TO_FOCUS[ex.targetMuscle];
        if (mapped && mapped.includes(focusArea)) return true;
      }
      return false;
    });

    // Shuffle for variety
    const shuffled = (pool.length ? pool : allExercises).sort(() => Math.random() - 0.5);

    let remaining = budgetSeconds - bufferSeconds;
    const chosen = [];

    for (const ex of shuffled) {
      const cost = exerciseDuration(ex);
      if (cost > remaining) continue;
      chosen.push(ex);
      remaining -= cost;
    }

    const totalDurationMins = Math.round((budgetSeconds - bufferSeconds - remaining) / 60);
    const estimatedBurnKcal = Math.round(
      chosen.reduce((sum, ex) => sum + estimateBurn(ex, weightKg), 0)
    );

    const exerciseList = chosen.map((ex) => ({
      exerciseId: ex._id,
      name: ex.name,
      animationUrl: ex.animationUrl || '',
      instructions: ex.instructions || '',
      sets: ex.sets || ex.defaultSets || 3,
      workSeconds: ex.workSeconds || ex.defaultWorkSeconds || 40,
      durationSeconds: ex.workSeconds || ex.defaultWorkSeconds || 40,
      restSeconds: ex.restSeconds || ex.defaultRestSeconds || 20,
      metValue: ex.metValue || 5,
    }));

    return {
      dayOfWeek,
      focusArea,
      totalDurationMins,
      estimatedDurationMins: totalDurationMins,
      estimatedBurnKcal,
      exercises: exerciseList,
    };
  });

  await WorkoutPlan.deleteOne({ userId });
  const plan = await WorkoutPlan.create({
    userId,
    splitType,
    days,
    schedule: days,
  });
  return plan;
}
