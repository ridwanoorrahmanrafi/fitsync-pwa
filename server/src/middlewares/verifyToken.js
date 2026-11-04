import { getFirebaseAdmin } from '../config/firebaseAdmin.js';
import User from '../models/User.model.js';

export async function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  const firebase = getFirebaseAdmin();

  // If a real Firebase token was passed and Firebase Admin is configured, verify it
  if (token && token !== 'dev-token' && firebase) {
    try {
      const decoded = await firebase.auth().verifyIdToken(token);
      req.uid = decoded.uid;
      req.user = await User.findOne({ firebaseUid: decoded.uid });
      return next();
    } catch {
      if (process.env.DEV_AUTH_BYPASS !== 'true') {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    }
  }

  // Dev bypass mode fallback for seamless local testing
  if (process.env.DEV_AUTH_BYPASS === 'true') {
    req.uid = 'dev-user-001';
    req.user = await User.findOne({ firebaseUid: 'dev-user-001' });
    return next();
  }

  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  return res.status(401).json({ error: 'Unauthorized' });
}
