/**
 * Burn Task Service
 *
 * Triggers when logged intake exceeds calorieTarget by more than SURPLUS_THRESHOLD (default 150 kcal).
 * Duration formula: ceil(surplus × 200 / (MET × 3.5 × weightKg)), capped at 45 minutes.
 * Framed as an optional "Balance Boost" — non-punitive language.
 */

import Exercise from '../models/Exercise.model.js';
import { sendMail } from '../config/mailer.js';
import { sendPushNotification, sendBurnTaskNotification } from './notification.service.js';

const BURN_EXERCISES = [
  { name: 'Brisk Walk', metValue: 3.5 },
  { name: 'Light Jog', metValue: 7 },
  { name: 'Cycling', metValue: 8 },
  { name: 'Jump Rope', metValue: 10 },
  { name: 'Swimming', metValue: 6 },
];

const SURPLUS_THRESHOLD = Number(process.env.SURPLUS_THRESHOLD) || 150;

export function shouldTriggerBurnTask(totalCalories, calorieTarget) {
  return totalCalories - calorieTarget > SURPLUS_THRESHOLD;
}

export function buildBurnTask(surplus, weightKg) {
  const exercise = BURN_EXERCISES[Math.floor(Math.random() * BURN_EXERCISES.length)];
  const rawMins = Math.ceil((surplus * 200) / (exercise.metValue * 3.5 * weightKg));
  const durationMins = Math.min(45, Math.max(5, rawMins));
  const caloriesToBurn = Math.round(
    (exercise.metValue * 3.5 * weightKg * durationMins) / 200
  );

  return {
    taskTitle: 'Balance Boost',
    taskDescription: `${durationMins} mins of ${exercise.name}`,
    exerciseName: exercise.name,
    durationMins,
    caloriesToBurn,
    targetCaloriesToBurn: caloriesToBurn,
    status: 'pending',
    emailSent: false,
    notifiedViaEmail: false,
  };
}

export async function evaluateCalorieSurplus(user, dailyLog) {
  const target = user.calorieTarget || user.targetCalories || user.biometrics?.targetCalories || 2000;
  const consumed = dailyLog.caloriesConsumed || dailyLog.totalCalories || 0;
  const netSurplus = consumed - target;

  if (netSurplus <= SURPLUS_THRESHOLD) {
    return { triggered: false, task: null };
  }

  // Avoid duplicate tasks if one is already pending
  const pendingTasks = (dailyLog.extraBurnTasks || []).filter((t) => t.status === 'pending');
  const alreadyAssigned = pendingTasks.reduce(
    (sum, t) => sum + (t.targetCaloriesToBurn || t.caloriesToBurn || 0),
    0
  );

  const unaccountedSurplus = netSurplus - alreadyAssigned;
  if (unaccountedSurplus < 100 && dailyLog.burnTask?.status === 'pending') {
    return { triggered: false, task: null };
  }

  const weight = user.weightKg || user.biometrics?.weightKg || 70;
  const task = buildBurnTask(unaccountedSurplus > 0 ? unaccountedSurplus : netSurplus, weight);

  dailyLog.burnTask = task;
  if (!dailyLog.extraBurnTasks) dailyLog.extraBurnTasks = [];
  dailyLog.extraBurnTasks.push(task);
  await dailyLog.save();

  sendBurnTaskNotification(user, task, netSurplus).catch((err) =>
    console.error('[BurnTask] Notification Error:', err)
  );

  return { triggered: true, task };
}

export async function dispatchBurnTaskNotification(user, burnTask) {
  const subject = '⚡ Optional Balance Boost for Today';
  const text =
    `Hi ${user.name || 'there'},\n\n` +
    `You're doing great today! If you feel like it, a ${burnTask.durationMins}-minute ` +
    `${burnTask.exerciseName} could help balance your energy — no pressure at all.\n\n` +
    `This is purely optional. Rest is just as important as movement.\n\nFitSync Team`;

  const emailPromise = sendMail({ to: user.email, subject, text }).catch((err) =>
    console.error('[BurnTask] Email error:', err.message)
  );

  const pushPromise = user.fcmToken
    ? sendPushNotification(user.fcmToken, subject, text).catch((err) =>
        console.error('[BurnTask] Push error:', err.message)
      )
    : Promise.resolve();

  await Promise.all([emailPromise, pushPromise]);
}
