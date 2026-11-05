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

function selectBestFood(candidates, targetCalories, pantrySet, typicalSet = new Set()) {
  if (!candidates.length) return null;

  // Score = pantry matches x 10 + familiar daily-food matches x 4 (max 3) - |portion multiplier - 1| x 4 + small random tie-break
  const scored = candidates.map((food) => {
    const baseCal = food.nutrition?.calories || food.calories || food.caloriesPer100g || 100;
    const rawMultiplier = targetCalories / baseCal;
    const portionMultiplier = Math.round(Math.min(3.0, Math.max(0.5, rawMultiplier)) * 10) / 10;

    const keywords = (food.pantryKeywords || food.keywords || []).map((k) => k.toLowerCase());
    const pantryMatches = keywords.filter((kw) => pantrySet.has(kw)).length + (pantrySet.has(food.name.toLowerCase()) ? 1 : 0);
    const familiarMatches = Math.min(3, keywords.filter((kw) => typicalSet.has(kw)).length + (typicalSet.has(food.name.toLowerCase()) ? 1 : 0));

    const score =
      (pantryMatches * 10) +
      (familiarMatches * 4) -
      (Math.abs(portionMultiplier - 1) * 4) +
      (Math.random() * 0.1);

    return { food, score, portionMultiplier };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0];
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

  const typicalFoods =
    user.preferences?.typicalFoods ||
    user.typicalFoods ||
    [];

  const userId = user._id;
  const pantrySet = new Set(pantryInventory.map((s) => s.toLowerCase()));
  const typicalSet = new Set(typicalFoods.map((s) => s.toLowerCase()));

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

    const match = selectBestFood(candidates, slotCalories, pantrySet, typicalSet);
    if (!match) continue;
    const { food, portionMultiplier: multiplier } = match;

    const baseCal = food.nutrition?.calories || food.calories || food.caloriesPer100g || 100;
    const baseP = food.nutrition?.proteinG ?? food.proteinG ?? 0;
    const baseC = food.nutrition?.carbsG ?? food.carbsG ?? 0;
    const baseF = food.nutrition?.fatsG ?? food.fatsG ?? 0;

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

  const typicalFoods =
    user.preferences?.typicalFoods ||
    user.typicalFoods ||
    [];

  const pantrySet = new Set(pantryInventory.map((s) => s.toLowerCase()));
  const typicalSet = new Set(typicalFoods.map((s) => s.toLowerCase()));
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

  const match = selectBestFood(candidates, slotCalories, pantrySet, typicalSet);
  if (!match) return null;
  const { food, portionMultiplier: multiplier } = match;

  const baseCal = food.nutrition?.calories || food.calories || food.caloriesPer100g || 100;
  const baseP = food.nutrition?.proteinG ?? food.proteinG ?? 0;
  const baseC = food.nutrition?.carbsG ?? food.carbsG ?? 0;
  const baseF = food.nutrition?.fatsG ?? food.fatsG ?? 0;

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
