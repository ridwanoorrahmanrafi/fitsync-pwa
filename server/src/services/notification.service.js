import { getFirebaseAdmin } from '../config/firebaseAdmin.js';
import { sendMail } from '../config/mailer.js';

export async function sendPushNotification(fcmToken, title, body) {
  const firebase = getFirebaseAdmin();
  if (!firebase) {
    console.log('[PUSH] Firebase not configured — skipping push notification');
    return;
  }

  try {
    await firebase.messaging().send({
      token: fcmToken,
      notification: { title, body },
      webpush: {
        fcmOptions: { link: '/' },
      },
    });
  } catch (err) {
    console.error('[PUSH] Failed to send push:', err.message);
  }
}

export async function sendBurnTaskNotification(user, task, netSurplus) {
  const subject = '⚡ Optional Balance Boost: Daily Calorie Surplus Alert';
  const text =
    `Hi ${user.name || 'there'},\n\n` +
    `You are currently +${netSurplus} kcal over your daily target. ` +
    `If you'd like to balance your intake, we suggest: ${task.taskDescription || `${task.durationMins} mins of ${task.exerciseName}`}.\n\n` +
    `This is completely optional. Rest and recovery are just as important!\n\n` +
    `FitSync Team`;

  const emailPromise = user.email
    ? sendMail({ to: user.email, subject, text }).catch((err) =>
        console.error('[Notification] Email error:', err.message)
      )
    : Promise.resolve();

  const pushPromise = user.fcmToken
    ? sendPushNotification(user.fcmToken, subject, text)
    : Promise.resolve();

  await Promise.all([emailPromise, pushPromise]);
}
