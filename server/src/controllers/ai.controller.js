import * as geminiService from '../services/gemini.service.js';

export async function estimateFood(req, res) {
  try {
    const { foodName, portion } = req.body;
    if (!foodName) {
      return res.status(400).json({ error: 'foodName is required' });
    }

    const result = await geminiService.estimateFoodNutrition(foodName, portion);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[AIController] estimateFood error:', err.message);
    res.status(500).json({ error: 'Failed to estimate nutrition using AI' });
  }
}

export async function generateRecipe(req, res) {
  try {
    const { mealType = 'lunch', targetCalories = 500 } = req.body;
    const recipe = await geminiService.generatePantryMeal(req.user, mealType, targetCalories);
    res.json({ success: true, data: recipe });
  } catch (err) {
    console.error('[AIController] generateRecipe error:', err.message);
    res.status(500).json({ error: 'Failed to generate pantry recipe using AI' });
  }
}

export async function getBalanceAdvice(req, res) {
  try {
    const { surplusKcal = 200, exerciseName = 'Brisk Walk', durationMins = 20 } = req.body;
    const advice = await geminiService.getBalanceBoostAdvice(req.user, surplusKcal, exerciseName, durationMins);
    res.json({ success: true, data: advice });
  } catch (err) {
    console.error('[AIController] getBalanceAdvice error:', err.message);
    res.status(500).json({ error: 'Failed to generate balance advice using AI' });
  }
}

