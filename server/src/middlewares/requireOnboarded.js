export function requireOnboarded(req, res, next) {
  if (!req.user?.onboarded) {
    return res.status(403).json({ error: 'Complete onboarding first' });
  }
  next();
}

