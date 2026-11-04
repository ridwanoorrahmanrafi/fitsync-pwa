import DailyLog from '../models/DailyLog.model.js';
import FoodItem from '../models/FoodItem.model.js';
import User from '../models/User.model.js';
import {
  shouldTriggerBurnTask,
  buildBurnTask,
  dispatchBurnTaskNotification,
  evaluateCalorieSurplus,
} from '../services/burnTask.service.js';
import { todayString } from '../utils/date.js';

export async function logMeal(req, res) {
  try {
    const { foodName, calories, proteinG = 0, carbsG = 0, fatsG = 0, date } = req.body;
    const logDate = date || todayString();
    const user = req.user;

    const mealEntry = { foodName, calories, proteinG, carbsG, fatsG, loggedAt: new Date() };

    // Upsert today's log and accumulate totals
    let log = await DailyLog.findOneAndUpdate(
      { userId: user._id, date: logDate },
      {
        $push: { meals: mealEntry, mealsEaten: mealEntry },
        $inc: {
          totalCalories: calories,
          caloriesConsumed: calories,
          totalProteinG: proteinG,
          totalCarbsG: carbsG,
          totalFatsG: fatsG,
        },
      },
      { upsert: true, new: true }
    );

    // Check burn task trigger
    const targetCalories =
      user.calorieTarget ||
      user.targetCalories ||
      user.biometrics?.targetCalories ||
      2000;

    let surplusTriggered = false;
    let assignedBurnTask = null;

    if (
      (!log.burnTask || log.burnTask.status !== 'pending') &&
      shouldTriggerBurnTask(log.totalCalories, targetCalories)
    ) {
      const surplus = log.totalCalories - targetCalories;
      const weight = user.weightKg || user.biometrics?.weightKg || 70;
      const burnTask = buildBurnTask(surplus, weight);

      log = await DailyLog.findOneAndUpdate(
        { userId: user._id, date: logDate },
        {
          $set: { burnTask },
          $push: { extraBurnTasks: burnTask },
        },
        { new: true }
      );

      surplusTriggered = true;
      assignedBurnTask = burnTask;

      // Asynchronously dispatch notifications without blocking response
      dispatchBurnTaskNotification(user, burnTask).catch(console.error);
    }

    res.json({ dailyLog: log, surplusTriggered, assignedBurnTask });
  } catch (err) {
    console.error('[logMeal]', err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateBurnTask(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const today = todayString();

    const normalizedStatus = status === 'completed' ? 'done' : status;

    const existingLog = await DailyLog.findOne({ userId: req.user._id, date: today });
    const burnKcal = existingLog?.burnTask?.caloriesToBurn || 0;

    const updateFields = {
      'burnTask.status': normalizedStatus,
    };

    const updateOps = { $set: updateFields };
    if (normalizedStatus === 'done' && burnKcal > 0) {
      updateOps.$inc = { caloriesBurned: burnKcal };
    }

    const log = await DailyLog.findOneAndUpdate(
      { userId: req.user._id, date: today },
      updateOps,
      { new: true }
    );

    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json({ dailyLog: log, burnTask: log.burnTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getToday(req, res) {
  try {
    const today = todayString();
    const log = await DailyLog.findOne({ userId: req.user._id, date: today }).lean();
    res.json({ log: log || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function logWeight(req, res) {
  try {
    const { weightKg } = req.body;
    const today = todayString();

    const log = await DailyLog.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { $set: { weightKg, loggedWeightKg: weightKg } },
      { upsert: true, new: true }
    );

    // Also update user's profile weight
    await User.updateOne(
      { _id: req.user._id },
      { weightKg, 'biometrics.weightKg': weightKg }
    );

    res.json({ log, dailyLog: log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function logWater(req, res) {
  try {
    const { waterMl } = req.body;
    const today = todayString();

    const log = await DailyLog.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { $inc: { waterMl } },
      { upsert: true, new: true }
    );

    res.json({ waterMl: log.waterMl, dailyLog: log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function searchFoods(req, res) {
  try {
    const { q = '' } = req.query;
    const regex = new RegExp(q, 'i');
    const foods = await FoodItem.find({ name: regex }).limit(20).lean();
    res.json({ foods });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProgress(req, res) {
  try {
    const { range = '30d' } = req.query;
    const days = parseInt(range) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().slice(0, 10);

    const logs = await DailyLog.find({
      userId: req.user._id,
      date: { $gte: sinceStr },
    })
      .sort({ date: 1 })
      .select('date totalCalories caloriesConsumed totalProteinG totalCarbsG totalFatsG waterMl workoutCompleted weightKg loggedWeightKg caloriesBurned')
      .lean();

    const completedCount = logs.filter((l) => l.workoutCompleted).length;
    const completionRate = logs.length > 0 ? Math.round((completedCount / logs.length) * 100) : 0;

    res.json({
      logs,
      weightHistory: logs.filter((l) => l.weightKg).map((l) => ({ date: l.date, weight: l.weightKg })),
      calorieHistory: logs.map((l) => ({ date: l.date, calories: l.totalCalories || l.caloriesConsumed })),
      completionRate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
