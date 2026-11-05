import User from '../models/User.model.js';
import { computeTargets } from '../services/biometrics.service.js';
import { generateWorkoutPlan } from '../services/workoutGen.service.js';
import { generateDietPlan } from '../services/dietGen.service.js';

export async function onboard(req, res) {
  try {
    const {
      name, age, gender, heightCm, weightKg, targetWeightKg,
      goal, fitnessLevel, equipment, workoutDays, sessionDurationMins,
      countryRegion, country, religionDietary = [], pantryInventory = [],
    } = req.body;

    const normalizedRegion = countryRegion || country || 'Western';
    const normalizedEquipment = equipment.map((eq) => (eq === 'bodyweight' ? 'none_home' : eq));

    const targets = computeTargets({ age, gender, heightCm, weightKg, workoutDays, goal });

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.uid },
      {
        $set: {
          firebaseUid: req.uid,
          email: req.user?.email || `${req.uid}@dev.local`,
          name: name || '',
          age,
          gender,
          heightCm,
          weightKg,
          targetWeightKg,
          goal,
          fitnessLevel,
          equipment: normalizedEquipment,
          workoutDays,
          sessionDurationMins,
          preferences: {
            goal,
            fitnessLevel,
            equipment: normalizedEquipment,
            workoutDays,
            sessionDurationMins,
            countryRegion: normalizedRegion,
            religionDietary,
            pantryInventory,
          },
          biometrics: {
            age,
            gender,
            heightCm,
            weightKg,
            targetWeightKg,
            bmi: targets.bmi,
            bmiCategory: targets.bmiCategory,
            bmr: targets.bmr,
            tdee: targets.tdee,
            targetCalories: targets.calorieTarget,
          },
          ...targets,
          onboarded: true,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Eagerly generate plans
    const [workoutPlan, dietPlan] = await Promise.all([
      generateWorkoutPlan(user),
      generateDietPlan(user),
    ]);

    res.status(201).json({
      user,
      metrics: {
        bmi: targets.bmi,
        bmiCategory: targets.bmiCategory,
        bmr: targets.bmr,
        tdee: targets.tdee,
        targetCalories: targets.calorieTarget,
      },
      workoutPlanId: workoutPlan._id,
      dietPlanId: dietPlan._id,
    });
  } catch (err) {
    console.error('[onboard]', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getMe(req, res) {
  try {
    if (!req.user) {
      return res.json({
        user: {
          firebaseUid: req.uid,
          email: `${req.uid}@dev.local`,
          name: '',
          onboarded: false,
        },
      });
    }
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateFcmToken(req, res) {
  try {
    const { fcmToken } = req.body;
    await User.updateOne({ firebaseUid: req.uid }, { fcmToken });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
