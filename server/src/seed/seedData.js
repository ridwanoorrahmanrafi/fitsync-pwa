/**
 * FitSync - Complete Database Seeder (Section 7 Compliant)
 * File: /server/src/seed/seedData.js
 * Usage: npm run seed --workspace=server
 */

import 'dotenv/config';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Exercise from '../models/Exercise.model.js';
import FoodItem from '../models/FoodItem.model.js';
import User from '../models/User.model.js';
import WorkoutPlan from '../models/WorkoutPlan.model.js';
import DietPlan from '../models/DietPlan.model.js';
import DailyLog from '../models/DailyLog.model.js';
import { computeTargets } from '../services/biometrics.service.js';
import { generateWorkoutPlan } from '../services/workoutGen.service.js';
import { generateDietPlan } from '../services/dietGen.service.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if custom DNS cannot be set
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exercises = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'exercisesData.json'), 'utf-8')
);

const foods = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'foodsData.json'), 'utf-8')
);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitsync';

export async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB:', MONGODB_URI);

    // 1. Seed Exercises
    await Exercise.deleteMany({});
    const insertedExercises = await Exercise.insertMany(exercises);
    console.log(`💪 Seeded ${insertedExercises.length} Exercises (Target muscles & MET values).`);

    // 2. Seed Foods
    await FoodItem.deleteMany({});
    const insertedFoods = await FoodItem.insertMany(foods);
    console.log(`🍲 Seeded ${insertedFoods.length} Cultural Foods (Strict Vegan & Jain rules).`);

    // 3. Seed Demo Athlete Profile (dev-user-001)
    const targets = computeTargets({
      age: 26,
      gender: 'male',
      heightCm: 178,
      weightKg: 78,
      workoutDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      goal: 'weight_loss',
    });

    const user = await User.findOneAndUpdate(
      { firebaseUid: 'dev-user-001' },
      {
        $set: {
          firebaseUid: 'dev-user-001',
          email: 'dev-user-001@dev.local',
          name: 'Alex Rivera',
          age: 26,
          gender: 'male',
          heightCm: 178,
          weightKg: 78,
          targetWeightKg: 72,
          goal: 'weight_loss',
          fitnessLevel: 'intermediate',
          equipment: ['none_home', 'dumbbells'],
          workoutDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          sessionDurationMins: 45,
          preferences: {
            goal: 'weight_loss',
            fitnessLevel: 'intermediate',
            equipment: ['none_home', 'dumbbells'],
            workoutDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            sessionDurationMins: 45,
            countryRegion: 'Western',
            religionDietary: ['Halal'],
            pantryInventory: ['eggs', 'chicken', 'rice', 'oats', 'spinach', 'olive oil'],
          },
          biometrics: {
            age: 26,
            gender: 'male',
            heightCm: 178,
            weightKg: 78,
            targetWeightKg: 72,
            bmi: targets.bmi,
            bmiCategory: targets.bmiCategory,
            bmr: targets.bmr,
            tdee: targets.tdee,
            targetCalories: targets.calorieTarget,
          },
          ...targets,
          onboarded: true,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Eagerly generate tailored plans
    await Promise.all([
      WorkoutPlan.deleteMany({ userId: user._id }),
      DietPlan.deleteMany({ userId: user._id }),
      DailyLog.deleteMany({ userId: user._id }),
    ]);

    await Promise.all([
      generateWorkoutPlan(user),
      generateDietPlan(user),
    ]);

    // Seed recent 7 days of logs
    const today = new Date().toISOString().slice(0, 10);
    await DailyLog.insertOne({
      userId: user._id,
      date: today,
      meals: [
        { foodName: 'Oatmeal with Blueberries & Almonds', calories: 420, proteinG: 18, carbsG: 62, fatsG: 11, loggedAt: new Date() },
        { foodName: 'Grilled Chicken Bowl with Quinoa', calories: 650, proteinG: 52, carbsG: 58, fatsG: 18, loggedAt: new Date() },
        { foodName: 'Greek Yogurt & Honey', calories: 240, proteinG: 22, carbsG: 28, fatsG: 4, loggedAt: new Date() }
      ],
      mealsEaten: [
        { foodName: 'Oatmeal with Blueberries & Almonds', calories: 420, proteinG: 18, carbsG: 62, fatsG: 11, loggedAt: new Date() },
        { foodName: 'Grilled Chicken Bowl with Quinoa', calories: 650, proteinG: 52, carbsG: 58, fatsG: 18, loggedAt: new Date() },
        { foodName: 'Greek Yogurt & Honey', calories: 240, proteinG: 22, carbsG: 28, fatsG: 4, loggedAt: new Date() }
      ],
      caloriesConsumed: 1310,
      totalCalories: 1310,
      totalProteinG: 92,
      totalCarbsG: 148,
      totalFatsG: 33,
      waterMl: 1750,
      workoutCompleted: false,
      caloriesBurned: 0,
      weightKg: 78,
      loggedWeightKg: 78,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    for (let i = 1; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      await DailyLog.insertOne({
        userId: user._id,
        date: dateStr,
        totalCalories: 2100 + (i * 35),
        caloriesConsumed: 2100 + (i * 35),
        totalProteinG: 130,
        totalCarbsG: 210,
        totalFatsG: 60,
        waterMl: 2250,
        workoutCompleted: i % 2 !== 0,
        caloriesBurned: i % 2 !== 0 ? 320 : 0,
        weightKg: Number((78.5 - i * 0.1).toFixed(1)),
        createdAt: d,
        updatedAt: d
      });
    }

    console.log('🎉 Seeded Demo Athlete (Alex Rivera) with active plans and 7-day progress!');
    console.log('✅ Database seeding completed successfully!');
    if (process.env.NODE_ENV !== 'test') {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Database Seeding Failed:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
}

if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  seedDatabase();
}
