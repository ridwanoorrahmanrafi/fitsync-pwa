/**
 * Unit Tests — FitSync Server
 * Tests the pure logic in biometrics.service.js and burnTask.service.js.
 * Run: npm test (from /server)
 */

import { calcBMI, calcBMR, calcTDEE, calcCalorieTarget, calcMacros, computeTargets } from '../src/services/biometrics.service.js';
import { shouldTriggerBurnTask, buildBurnTask } from '../src/services/burnTask.service.js';

// ── BMI ──────────────────────────────────────────────────────────────────────

test('BMI calculation: normal weight', () => {
  const result = calcBMI(70, 175);
  expect(result.bmi).toBe(22.9);
  expect(result.category).toBe('Normal');
});

test('BMI calculation: overweight classification', () => {
  const result = calcBMI(85, 175);
  expect(result.bmi).toBe(27.8);
  expect(result.category).toBe('Overweight');
});

// ── BMR ──────────────────────────────────────────────────────────────────────

test('BMR male: Mifflin-St Jeor reference values', () => {
  // 30yo male, 75kg, 175cm → (10×75 + 6.25×175 − 5×30 + 5) = 1698.75
  const result = calcBMR({ gender: 'male', weightKg: 75, heightCm: 175, age: 30 });
  expect(result).toBeCloseTo(1698.75, 1);
});

test('BMR female: Mifflin-St Jeor reference values', () => {
  // 25yo female, 60kg, 165cm → (10×60 + 6.25×165 − 5×25 − 161) = 1345.25
  const result = calcBMR({ gender: 'female', weightKg: 60, heightCm: 165, age: 25 });
  expect(result).toBeCloseTo(1345.25, 1);
});

// ── TDEE ─────────────────────────────────────────────────────────────────────

test('TDEE multiplier 1.2 for 0 days (sedentary baseline)', () => {
  const bmr = 1600;
  expect(calcTDEE(bmr, 0)).toBe(Math.round(bmr * 1.2));
  expect(calcTDEE(bmr, [])).toBe(Math.round(bmr * 1.2));
});

test('TDEE multiplier 1.35 for 1–2 days', () => {
  const bmr = 1600;
  expect(calcTDEE(bmr, ['Mon'])).toBe(Math.round(bmr * 1.35));
  expect(calcTDEE(bmr, ['Mon', 'Wed'])).toBe(Math.round(bmr * 1.35));
});

test('TDEE multiplier 1.5 for 3–4 days', () => {
  const bmr = 1600;
  expect(calcTDEE(bmr, ['Mon', 'Tue', 'Wed'])).toBe(Math.round(bmr * 1.5));
  expect(calcTDEE(bmr, ['Mon', 'Tue', 'Wed', 'Thu'])).toBe(Math.round(bmr * 1.5));
});

test('TDEE multiplier 1.7 for 5+ days', () => {
  const bmr = 1600;
  expect(calcTDEE(bmr, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])).toBe(Math.round(bmr * 1.7));
});

// ── Calorie target ───────────────────────────────────────────────────────────

test('Calorie target: weight loss = TDEE − 500', () => {
  expect(calcCalorieTarget(2200, 'weight_loss', 'male')).toBe(1700);
});

test('Calorie target: muscle gain = TDEE + 300', () => {
  expect(calcCalorieTarget(2000, 'muscle_gain', 'male')).toBe(2300);
});

test('Calorie target: maintenance = TDEE', () => {
  expect(calcCalorieTarget(2000, 'maintenance', 'male')).toBe(2000);
});

test('Calorie target: floor 1500 for male', () => {
  expect(calcCalorieTarget(1800, 'weight_loss', 'male')).toBe(1500);
});

test('Calorie target: floor 1200 for female', () => {
  expect(calcCalorieTarget(1600, 'weight_loss', 'female')).toBe(1200);
});

// ── Macros ───────────────────────────────────────────────────────────────────

test('Macros sum to approximately calorieTarget', () => {
  const target = 2000;
  const { proteinTargetG, carbsTargetG, fatsTargetG } = calcMacros(target);
  const total = proteinTargetG * 4 + carbsTargetG * 4 + fatsTargetG * 9;
  // Allow ±30 kcal rounding tolerance
  expect(Math.abs(total - target)).toBeLessThan(30);
});

// ── Burn task ────────────────────────────────────────────────────────────────

test('shouldTriggerBurnTask: true when surplus > threshold', () => {
  expect(shouldTriggerBurnTask(2200, 2000)).toBe(true);
});

test('shouldTriggerBurnTask: false when surplus ≤ threshold', () => {
  expect(shouldTriggerBurnTask(2100, 2000)).toBe(false);
});

test('buildBurnTask: durationMins ≤ 45', () => {
  const task = buildBurnTask(1000, 70);
  expect(task.durationMins).toBeGreaterThan(0);
  expect(task.durationMins).toBeLessThanOrEqual(45);
});

test('buildBurnTask: has required fields', () => {
  const task = buildBurnTask(300, 80);
  expect(task).toHaveProperty('taskTitle', 'Balance Boost');
  expect(task).toHaveProperty('exerciseName');
  expect(task).toHaveProperty('durationMins');
  expect(task).toHaveProperty('caloriesToBurn');
  expect(task).toHaveProperty('status', 'pending');
  expect(task).toHaveProperty('emailSent', false);
});

