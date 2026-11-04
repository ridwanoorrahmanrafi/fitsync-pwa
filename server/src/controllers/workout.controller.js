import WorkoutPlan from '../models/WorkoutPlan.model.js';
import DailyLog from '../models/DailyLog.model.js';
import User from '../models/User.model.js';
import { generateWorkoutPlan } from '../services/workoutGen.service.js';
import { todayString } from '../utils/date.js';

export async function generatePlan(req, res) {
  try {
    const plan = await generateWorkoutPlan(req.user);
    res.json({ plan });
  } catch (err) {
    console.error('[generatePlan]', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getPlan(req, res) {
  try {
    const plan = await WorkoutPlan.findOne({ userId: req.user._id }).lean();
    if (!plan) return res.status(404).json({ error: 'No workout plan found. Generate one first.' });
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getToday(req, res) {
  try {
    const { day } = req.query; // e.g. "Mon" or "Monday"
    const plan = await WorkoutPlan.findOne({ userId: req.user._id }).lean();
    if (!plan) return res.status(404).json({ error: 'No plan found' });

    const scheduleList = plan.schedule || plan.days || [];
    const searchPrefix = day ? day.toLowerCase().slice(0, 3) : '';

    const todayDay = scheduleList.find((d) =>
      d.dayOfWeek && d.dayOfWeek.toLowerCase().startsWith(searchPrefix)
    );

    res.json({
      day: todayDay || null,
      daySchedule: todayDay || null,
      exercises: todayDay?.exercises || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function completeWorkout(req, res) {
  try {
    const { date, caloriesBurned = 0, durationMins } = req.body || {};
    const today = date || todayString();

    const updateOps = {
      $set: { workoutCompleted: true },
    };

    if (caloriesBurned > 0) {
      updateOps.$inc = { caloriesBurned };
    }

    const log = await DailyLog.findOneAndUpdate(
      { userId: req.user._id, date: today },
      updateOps,
      { upsert: true, new: true }
    );

    // Update streak (idempotent — only advance once per calendar date)
    const user = req.user;
    let newStreak = user.streakCount || user.currentStreakDays || 0;

    if (user.lastWorkoutDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);

      newStreak = user.lastWorkoutDate === yStr ? newStreak + 1 : 1;

      await User.updateOne(
        { _id: user._id },
        {
          currentStreakDays: newStreak,
          streakCount: newStreak,
          lastWorkoutDate: today,
        }
      );
    }

    res.json({
      log,
      updatedDailyLog: log,
      streakCount: newStreak,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
