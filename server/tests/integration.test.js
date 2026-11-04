/**
 * Integration Tests — FitSync API
 * Uses supertest against a real MongoDB instance.
 * Set TEST_MONGODB_URI env var before running, e.g.:
 *   TEST_MONGODB_URI=mongodb+srv://... npm test
 *
 * Tests are skipped if TEST_MONGODB_URI is not set.
 */

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import Exercise from '../src/models/Exercise.model.js';
import FoodItem from '../src/models/FoodItem.model.js';
import User from '../src/models/User.model.js';
import WorkoutPlan from '../src/models/WorkoutPlan.model.js';
import DietPlan from '../src/models/DietPlan.model.js';
import DailyLog from '../src/models/DailyLog.model.js';

const RUN = !!process.env.TEST_MONGODB_URI;

const onboardBody = {
  name: 'Test User',
  age: 28,
  gender: 'male',
  heightCm: 175,
  weightKg: 75,
  goal: 'weight_loss',
  fitnessLevel: 'beginner',
  equipment: ['none_home'],
  workoutDays: ['Mon', 'Wed', 'Fri'],
  sessionDurationMins: 45,
  countryRegion: 'Western',
  religionDietary: [],
  pantryInventory: [],
};

beforeAll(async () => {
  if (!RUN) return;
  process.env.DEV_AUTH_BYPASS = 'true';
  await connectDB(process.env.TEST_MONGODB_URI);
  // Seed minimal data
  await Exercise.deleteMany({});
  await FoodItem.deleteMany({});
  await User.deleteMany({});
  await WorkoutPlan.deleteMany({});
  await DietPlan.deleteMany({});
  await DailyLog.deleteMany({});

  await Exercise.insertMany([
    { name: 'Push-Up', muscleGroups: ['chest'], equipment: ['none_home'], difficulty: 'beginner', focusAreas: ['full_body'], sets: 3, workSeconds: 40, restSeconds: 20, metValue: 5 },
    { name: 'Squat', muscleGroups: ['legs'], equipment: ['none_home'], difficulty: 'beginner', focusAreas: ['full_body'], sets: 3, workSeconds: 40, restSeconds: 20, metValue: 5 },
  ]);

  await FoodItem.insertMany([
    { name: 'Oatmeal', region: ['Western', 'Global'], dietaryTags: ['Vegetarian', 'Vegan'], caloriesPer100g: 100, proteinG: 3, carbsG: 20, fatsG: 1.5, keywords: ['oat'], mealTypes: ['breakfast'] },
    { name: 'Chicken Salad', region: ['Western', 'Global'], dietaryTags: ['Halal'], caloriesPer100g: 150, proteinG: 18, carbsG: 5, fatsG: 6, keywords: ['chicken'], mealTypes: ['lunch'] },
    { name: 'Protein Smoothie', region: ['Western', 'Global'], dietaryTags: ['Vegetarian'], caloriesPer100g: 80, proteinG: 8, carbsG: 10, fatsG: 1, keywords: ['protein'], mealTypes: ['snack'] },
    { name: 'Grilled Salmon', region: ['Western', 'Global'], dietaryTags: ['Gluten_Free'], caloriesPer100g: 206, proteinG: 22, carbsG: 0, fatsG: 13, keywords: ['salmon'], mealTypes: ['dinner'] },
  ]);
});

afterAll(async () => {
  if (!RUN) return;
  await disconnectDB();
});

const skip = RUN ? describe : describe.skip;

skip('POST /api/v1/users/onboard', () => {
  test('creates user and returns targets', async () => {
    const res = await request(app).post('/api/v1/users/onboard').send(onboardBody);
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('calorieTarget');
    expect(res.body.user.onboarded).toBe(true);
  });

  test('rejects invalid body', async () => {
    const res = await request(app).post('/api/v1/users/onboard').send({ age: -5 });
    expect(res.status).toBe(400);
  });
});

skip('GET /api/v1/users/me', () => {
  test('returns onboarded user', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('email');
  });
});

skip('GET /api/v1/workouts/plan', () => {
  test('returns generated workout plan', async () => {
    const res = await request(app).get('/api/v1/workouts/plan');
    expect(res.status).toBe(200);
    expect(res.body.plan.days.length).toBeGreaterThan(0);
  });
});

skip('GET /api/v1/diet/plan', () => {
  test('returns generated diet plan', async () => {
    const res = await request(app).get('/api/v1/diet/plan');
    expect(res.status).toBe(200);
    expect(res.body.plan).toHaveProperty('meals');
  });
});

skip('POST /api/v1/logs/meal', () => {
  test('logs a meal and returns daily log', async () => {
    const res = await request(app).post('/api/v1/logs/meal').send({
      foodName: 'Oatmeal',
      calories: 300,
      proteinG: 9,
      carbsG: 60,
      fatsG: 4,
    });
    expect(res.status).toBe(200);
    expect(res.body.dailyLog.totalCalories).toBeGreaterThan(0);
  });

  test('triggers burn task when surplus > 150', async () => {
    // Log a very large meal to exceed target
    const res = await request(app).post('/api/v1/logs/meal').send({
      foodName: 'Big Feast',
      calories: 2000,
      proteinG: 50,
      carbsG: 200,
      fatsG: 80,
    });
    expect(res.status).toBe(200);
    expect(res.body.surplusTriggered).toBe(true);
    expect(res.body.assignedBurnTask).not.toBeNull();
    expect(res.body.assignedBurnTask.durationMins).toBeLessThanOrEqual(45);
  });
});

skip('GET /api/v1/logs/today', () => {
  test('returns today log', async () => {
    const res = await request(app).get('/api/v1/logs/today');
    expect(res.status).toBe(200);
  });
});

skip('GET /api/v1/logs/progress', () => {
  test('returns progress data', async () => {
    const res = await request(app).get('/api/v1/logs/progress?range=7d');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.logs)).toBe(true);
  });
});

skip('POST /api/v1/logs/water', () => {
  test('logs water intake', async () => {
    const res = await request(app).post('/api/v1/logs/water').send({ waterMl: 500 });
    expect(res.status).toBe(200);
    expect(res.body.waterMl).toBeGreaterThanOrEqual(500);
  });
});

skip('POST /api/v1/workouts/complete', () => {
  test('marks workout complete and updates streak', async () => {
    const res = await request(app).post('/api/v1/workouts/complete');
    expect(res.status).toBe(200);
    expect(res.body.log.workoutCompleted).toBe(true);
  });
});

