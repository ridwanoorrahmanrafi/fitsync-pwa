/**
 * Biometrics Service
 * Implements BMI, Mifflin-St Jeor BMR, TDEE, calorie target, and macro splits.
 */

/** BMI calculation and classification */
export function calcBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
  let category = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  return { bmi, category };
}

/** Mifflin-St Jeor BMR (kcal/day) */
export function calcBMR({ gender, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

/** TDEE = BMR × activity multiplier based on current workout days/week (0 -> 1.2, 1-2 -> 1.35, 3-4 -> 1.5, 5-7 -> 1.7) */
export function calcTDEE(bmr, workoutDaysOrCount = 3) {
  const days = Array.isArray(workoutDaysOrCount)
    ? workoutDaysOrCount.length
    : (Number(workoutDaysOrCount) || 0);
  const multiplier = days === 0 ? 1.2 : days <= 2 ? 1.35 : days <= 4 ? 1.5 : 1.7;
  return Math.round(bmr * multiplier);
}

/** Calorie target with safety floor */
export function calcCalorieTarget(tdee, goal, gender) {
  const floor = gender === 'male' ? 1500 : 1200;
  let target;
  if (goal === 'weight_loss' || goal === 'lose_weight') target = tdee - 500;
  else if (goal === 'muscle_gain' || goal === 'build_muscle') target = tdee + 300;
  else target = tdee;
  return Math.max(target, floor);
}

/** Macro split: 30% protein, 45% carbs, 25% fats */
export function calcMacros(calorieTarget) {
  return {
    proteinTargetG: Math.round((calorieTarget * 0.30) / 4),
    carbsTargetG: Math.round((calorieTarget * 0.45) / 4),
    fatsTargetG: Math.round((calorieTarget * 0.25) / 9),
  };
}

/** Compute all targets for a user and return the fields to save */
export function computeTargets(userData) {
  const { bmi, category: bmiCategory } = calcBMI(userData.weightKg, userData.heightCm);
  const bmr = calcBMR(userData);
  const activityDays = userData.activityDaysPerWeek !== undefined ? userData.activityDaysPerWeek : userData.workoutDays;
  const tdee = calcTDEE(bmr, activityDays);
  const calorieTarget = calcCalorieTarget(tdee, userData.goal, userData.gender);
  const macros = calcMacros(calorieTarget);
  return { bmi, bmiCategory, bmr: Math.round(bmr), tdee, calorieTarget, ...macros };
}

