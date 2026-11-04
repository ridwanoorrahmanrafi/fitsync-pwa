import DietPlan from '../models/DietPlan.model.js';
import User from '../models/User.model.js';
import { generateDietPlan, swapMeal } from '../services/dietGen.service.js';

const VALID_MEAL_TYPES = ['breakfast', 'lunch', 'snack', 'dinner'];

export async function generatePlan(req, res) {
  try {
    const plan = await generateDietPlan(req.user);
    res.json({ plan });
  } catch (err) {
    console.error('[diet generatePlan]', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getPlan(req, res) {
  try {
    const plan = await DietPlan.findOne({ userId: req.user._id }).lean();
    if (!plan) return res.status(404).json({ error: 'No diet plan found. Generate one first.' });
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function swap(req, res) {
  try {
    const { mealType } = req.params;
    if (!VALID_MEAL_TYPES.includes(mealType)) {
      return res.status(400).json({ error: 'Invalid meal type' });
    }

    // Find current meal name to exclude it from the swap
    const plan = await DietPlan.findOne({ userId: req.user._id });
    const currentName = plan?.meals?.[mealType]?.name;

    const newMeal = await swapMeal(req.user, mealType, currentName);
    if (!newMeal) return res.status(404).json({ error: 'No alternative found' });

    await DietPlan.updateOne(
      { userId: req.user._id },
      { $set: { [`meals.${mealType}`]: newMeal } }
    );

    res.json({ meal: newMeal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updatePantry(req, res) {
  try {
    const { pantryInventory } = req.body;
    if (!Array.isArray(pantryInventory)) {
      return res.status(400).json({ error: 'pantryInventory must be an array' });
    }

    await User.updateOne(
      { _id: req.user._id },
      { 'preferences.pantryInventory': pantryInventory }
    );

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

