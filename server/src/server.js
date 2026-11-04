import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { globalRateLimiter } from './middlewares/rateLimiter.js';
import router from './routes/index.js';
import { startCron } from './jobs/reminder.cron.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));

// Strip MongoDB operator keys from request body (NoSQL injection defence)
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    const strip = (obj) => {
      for (const key of Object.keys(obj)) {
        if (key.startsWith('$')) delete obj[key];
        else if (typeof obj[key] === 'object' && obj[key] !== null) strip(obj[key]);
      }
    };
    strip(req.body);
  }
  next();
});

app.use(express.json({ limit: '50kb' }));
app.use(globalRateLimiter);
app.use('/api/v1', router);

app.get('/health', (_req, res) => res.json({ ok: true }));

// Only connect and start cron when not imported by tests
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`FitSync server → http://localhost:${port}`));
    startCron();
  });
}

export default app;

