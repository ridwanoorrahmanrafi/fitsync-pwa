import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { requireOnboarded } from '../middlewares/requireOnboarded.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import {
  onboardSchema,
  mealLogSchema,
  weightLogSchema,
  waterLogSchema,
  burnTaskUpdateSchema,
  fcmTokenSchema,
} from '../utils/schemas.js';

import * as userCtrl from '../controllers/user.controller.js';
import * as workoutCtrl from '../controllers/workout.controller.js';
import * as dietCtrl from '../controllers/diet.controller.js';
import * as logCtrl from '../controllers/log.controller.js';
import * as aiCtrl from '../controllers/ai.controller.js';

const router = Router();

// All routes require a valid token
router.use(verifyToken);

// ── Users ──────────────────────────────────────────────────────────────────
router.post('/users/onboard', validateSchema(onboardSchema), userCtrl.onboard);
router.get('/users/me', requireOnboarded, userCtrl.getMe);
router.patch('/users/me/fcm-token', validateSchema(fcmTokenSchema), userCtrl.updateFcmToken);

// ── Workouts ───────────────────────────────────────────────────────────────
router.post('/workouts/generate', requireOnboarded, workoutCtrl.generatePlan);
router.get('/workouts/plan', requireOnboarded, workoutCtrl.getPlan);
router.get('/workouts/today', requireOnboarded, workoutCtrl.getToday);
router.post('/workouts/complete', requireOnboarded, workoutCtrl.completeWorkout);

// ── Diet ───────────────────────────────────────────────────────────────────
router.post('/diet/generate', requireOnboarded, dietCtrl.generatePlan);
router.get('/diet/plan', requireOnboarded, dietCtrl.getPlan);
router.post('/diet/swap/:mealType', requireOnboarded, dietCtrl.swap);
router.put('/diet/pantry', requireOnboarded, dietCtrl.updatePantry);

// ── Logs ───────────────────────────────────────────────────────────────────
router.post('/logs/meal', requireOnboarded, validateSchema(mealLogSchema), logCtrl.logMeal);
router.patch('/logs/burn-task/:id', requireOnboarded, validateSchema(burnTaskUpdateSchema), logCtrl.updateBurnTask);
router.get('/logs/today', requireOnboarded, logCtrl.getToday);
router.post('/logs/weight', requireOnboarded, validateSchema(weightLogSchema), logCtrl.logWeight);
router.post('/logs/water', requireOnboarded, validateSchema(waterLogSchema), logCtrl.logWater);
router.get('/logs/foods', requireOnboarded, logCtrl.searchFoods);
router.get('/logs/progress', requireOnboarded, logCtrl.getProgress);

// ── Gemini AI ──────────────────────────────────────────────────────────────
router.post('/ai/estimate-food', requireOnboarded, aiCtrl.estimateFood);
router.post('/ai/pantry-recipe', requireOnboarded, aiCtrl.generateRecipe);
router.post('/ai/balance-advice', requireOnboarded, aiCtrl.getBalanceAdvice);

export default router;

