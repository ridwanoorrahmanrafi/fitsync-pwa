/**
 * Diet Generator Service
 *
 * Meal calorie split: breakfast 25%, lunch 35%, snack 15%, dinner 25%
 * Foods must carry every dietary tag the user selected.
 * Pantry-matched foods are ranked first.
 * Portion multiplier clamped to 0.5–3.0.
 */

import FoodItem from '../models/FoodItem.model.js';
import DietPlan from '../models/DietPlan.model.js';

const MEAL_SPLIT = { breakfast: 0.25, lunch: 0.35, snack: 0.15, dinner: 0.25 };

function buildPortionDescription(multiplier, food) {
  if (food.servingDescription) {
    return `${multiplier.toFixed(1)} x (${food.servingDescription})`;
  }
  const grams = Math.round((food.servingSizeGrams || 100) * multiplier);
  return `~${grams}g of ${food.name}`;
}

function selectBestFood(candidates, targetCalories, pantrySet) {
  if (!candidates.length) return null;

  // Score: pantry match count * 10 + calorie closeness
  const scored = candidates.map((food) => {
    const calories = food.nutrition?.calories || food.calories || food.caloriesPer100g || 100;
    const diff = Math.abs(calories - targetCalories);
    const keywords = (food.pantryKeywords || food.keywords || []).map((k) => k.toLowerCase());
    const pantryMatchCount = keywords.filter((kw) => pantrySet.has(kw)).length;
    const pantryScore = pantryMatchCount * 100;
    return { food, score: pantryScore - diff };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].food;
}

export async function generateDietPlan(user) {
  const calorieTarget =
    user.calorieTarget ||
    user.targetCalories ||
    user.biometrics?.targetCalories ||
    2000;

  const countryRegion =
    user.preferences?.countryRegion ||
    user.countryRegion ||
    'Western';

  const religionDietary =
    user.preferences?.religionDietary ||
    user.religionDietary ||
    [];

  const pantryInventory =
    user.preferences?.pantryInventory ||
    user.pantryInventory ||
    [];

  const userId = user._id;
  const pantrySet = new Set(pantryInventory.map((s) => s.toLowerCase()));

  // Active tags, omitting 'None'
  const activeTags = religionDietary.filter((t) => t && t !== 'None');

  const meals = {};

  for (const [mealType, fraction] of Object.entries(MEAL_SPLIT)) {
    const slotCalories = Math.round(calorieTarget * fraction);

    const query = {
      $or: [
        { regions: { $in: [countryRegion, 'Global'] } },
        { region: { $in: [countryRegion, 'Global'] } },
      ],
      mealTypes: mealType,
    };

    if (activeTags.length) {
      query.dietaryTags = { $all: activeTags };
    }

    const candidates = await FoodItem.find(query).lean();

    if (!candidates.length) {
      // Slot intentionally empty if no foods match
      continue;
    }

    const food = selectBestFood(candidates, slotCalories, pantrySet);
    const baseCal = food.nutrition?.calories || food.calories || food.caloriesPer100g || 100;
    const baseP = food.nutrition?.proteinG ?? food.proteinG ?? 0;
    const baseC = food.nutrition?.carbsG ?? food.carbsG ?? 0;
    const baseF = food.nutrition?.fatsG ?? food.fatsG ?? 0;

    const rawMultiplier = slotCalories / baseCal;
    const multiplier = Math.min(3.0, Math.max(0.5, rawMultiplier));

    const keywords = (food.pantryKeywords || food.keywords || []).map((k) => k.toLowerCase());
    const isPantry = keywords.some((k) => pantrySet.has(k)) || pantrySet.has(food.name.toLowerCase());

    meals[mealType] = {
      foodId: food._id,
      name: food.name,
      portionDescription: buildPortionDescription(multiplier, food),
      calories: Math.round(baseCal * multiplier),
      proteinG: Math.round(baseP * multiplier * 10) / 10,
      carbsG: Math.round(baseC * multiplier * 10) / 10,
      fatsG: Math.round(baseF * multiplier * 10) / 10,
      isFromPantry: isPantry,
      fromPantry: isPantry,
    };
  }

  await DietPlan.deleteOne({ userId });
  const plan = await DietPlan.create({ userId, meals });
  return plan;
}

export const generateCulturalDietPlan = generateDietPlan;

export async function swapMeal(user, mealType, excludeName) {
  const calorieTarget =
    user.calorieTarget ||
    user.targetCalories ||
    user.biometrics?.targetCalories ||
    2000;

  const countryRegion =
    user.preferences?.countryRegion ||
    user.countryRegion ||
    'Western';

  const religionDietary =
    user.preferences?.religionDietary ||
    user.religionDietary ||
    [];

  const pantryInventory =
    user.preferences?.pantryInventory ||
    user.pantryInventory ||
    [];

  const pantrySet = new Set(pantryInventory.map((s) => s.toLowerCase()));
  const activeTags = religionDietary.filter((t) => t && t !== 'None');
  const slotCalories = Math.round(calorieTarget * MEAL_SPLIT[mealType]);

  const query = {
    $or: [
      { regions: { $in: [countryRegion, 'Global'] } },
      { region: { $in: [countryRegion, 'Global'] } },
    ],
    mealTypes: mealType,
    name: { $ne: excludeName },
  };
  if (activeTags.length) query.dietaryTags = { $all: activeTags };

  const candidates = await FoodItem.find(query).lean();
  if (!candidates.length) return null;

  const food = selectBestFood(candidates, slotCalories, pantrySet);
  const baseCal = food.nutrition?.calories || food.calories || food.caloriesPer100g || 100;
  const baseP = food.nutrition?.proteinG ?? food.proteinG ?? 0;
  const baseC = food.nutrition?.carbsG ?? food.carbsG ?? 0;
  const baseF = food.nutrition?.fatsG ?? food.fatsG ?? 0;

  const rawMultiplier = slotCalories / baseCal;
  const multiplier = Math.min(3.0, Math.max(0.5, rawMultiplier));

  const keywords = (food.pantryKeywords || food.keywords || []).map((k) => k.toLowerCase());
  const isPantry = keywords.some((k) => pantrySet.has(k)) || pantrySet.has(food.name.toLowerCase());

  return {
    foodId: food._id,
    name: food.name,
    portionDescription: buildPortionDescription(multiplier, food),
    calories: Math.round(baseCal * multiplier),
    proteinG: Math.round(baseP * multiplier * 10) / 10,
    carbsG: Math.round(baseC * multiplier * 10) / 10,
    fatsG: Math.round(baseF * multiplier * 10) / 10,
    isFromPantry: isPantry,
    fromPantry: isPantry,
  };
}
