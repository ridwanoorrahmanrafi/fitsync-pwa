import cron from 'node-cron';
import User from '../models/User.model.js';
import { sendMail } from '../config/mailer.js';
import { sendPushNotification } from '../services/notification.service.js';

/**
 * Daily reminder cron — fires at 7:00 AM every day.
 * Sends a gentle workout/meal reminder to all onboarded users.
 */
const task = cron.schedule(
  '0 7 * * *',
  async () => {
    try {
      const users = await User.find({ onboarded: true }).lean();
      console.log(`[CRON] Sending reminders to ${users.length} users`);

      for (const user of users) {
        const subject = '🌅 Your FitSync Daily Check-in';
        const text =
          `Good morning${user.name ? `, ${user.name}` : ''}!\n\n` +
          `Your workout plan and meal suggestions are ready. ` +
          `Keep up the great work!\n\nFitSync Team`;

        await sendMail({ to: user.email, subject, text }).catch((err) =>
          console.error(`[CRON] Mail error for ${user.email}:`, err.message)
        );

        if (user.fcmToken) {
          await sendPushNotification(user.fcmToken, subject, text).catch((err) =>
            console.error(`[CRON] Push error:`, err.message)
          );
        }
      }
    } catch (err) {
      console.error('[CRON] Reminder job failed:', err);
    }
  },
  { scheduled: false } // started manually in server.js
);

export function startCron() {
  task.start();
  console.log('[CRON] Daily reminder scheduled at 07:00');
}

export default task;

