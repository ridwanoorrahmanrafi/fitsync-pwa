/**
 * Firebase Cloud Messaging client-side setup.
 * Only runs when VITE_FIREBASE_VAPID_KEY is set.
 */
export async function requestPushPermission() {
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey) return null;

  try {
    const { getMessaging, getToken } = await import('firebase/messaging');
    const { firebaseConfigured } = await import('./firebase.config.js');
    if (!firebaseConfigured) return null;

    const messaging = getMessaging();
    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch (err) {
    console.warn('[Push] Could not get FCM token:', err.message);
    return null;
  }
}

