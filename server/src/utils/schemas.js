import { z } from 'zod';

export const onboardSchema = z.object({
  name: z.string().optional(),
  age: z.number().int().min(10).max(120),
  gender: z.enum(['male', 'female']),
  heightCm: z.number().min(50).max(300),
  weightKg: z.number().min(20).max(500),
  targetWeightKg: z.number().min(20).max(500).optional(),
  goal: z.enum([
    'weight_loss',
    'lose_weight',
    'maintenance',
    'maintain',
    'muscle_gain',
    'build_muscle',
  ]),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  equipment: z
    .array(z.enum(['none_home', 'dumbbells', 'resistance_bands', 'full_gym', 'bodyweight']))
    .min(1),
  workoutDays: z.array(z.string()).min(1).max(7),
  sessionDurationMins: z.number().int().min(15).max(180),
  countryRegion: z
    .enum([
      'South_Asia',
      'Middle_East',
      'East_Asia',
      'Western',
      'Europe',
      'North_America',
      'Latin_America',
      'Africa',
      'Global',
    ])
    .optional(),
  country: z.string().optional(),
  religionDietary: z.array(z.string()).default([]),
  pantryInventory: z.array(z.string()).default([]),
});

export const mealLogSchema = z.object({
  foodName: z.string().min(1),
  calories: z.number().min(0),
  proteinG: z.number().min(0).default(0),
  carbsG: z.number().min(0).default(0),
  fatsG: z.number().min(0).default(0),
  date: z.string().optional(),
});

export const weightLogSchema = z.object({
  weightKg: z.number().min(20).max(500),
});

export const waterLogSchema = z.object({
  waterMl: z.number().min(50).max(5000),
});

export const burnTaskUpdateSchema = z.object({
  status: z.enum(['done', 'skipped', 'completed']),
});

export const fcmTokenSchema = z.object({
  fcmToken: z.string().min(1),
});
