/**
 * Google Gemini AI Service for FitSync
 * Cultural nutrition analysis, smart pantry recipe generation,
 * and compassionate fitness coaching.
 */

const FALLBACK_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

function extractJson(text) {
  if (!text) return null;
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Could not parse JSON from Gemini response: ' + text.slice(0, 100));
  }
}

/**
 * Call Gemini GenerateContent API with automatic failover.
 */
async function callGemini(prompt, systemInstruction = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment.');
  }

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  const modelsToTry = [primaryModel, ...FALLBACK_MODELS.filter((m) => m !== primaryModel)];

  let lastError = null;

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const parts = [];
    if (systemInstruction) {
      parts.push({ text: `System instruction: ${systemInstruction}\n\n` });
    }
    parts.push({ text: prompt + '\nIMPORTANT: Return ONLY valid JSON.' });

    const payload = {
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.2,
      },
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return extractJson(rawText);
        }
      } else if (res.status === 503 || res.status === 429) {
        lastError = new Error(`Model ${model} returned ${res.status}`);
        continue; // Fallback to next model
      } else {
        const errorText = await res.text();
        lastError = new Error(`Gemini API error (${res.status}): ${errorText.slice(0, 100)}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed to respond.');
}

/**
 * Estimate nutrition values for an unknown food item or custom meal.
 */
export async function estimateFoodNutrition(foodName, portion = '1 standard serving') {
  const prompt = `Analyze this food item and return estimated nutritional information in JSON format:
Food: "${foodName}"
Portion: "${portion}"

Return JSON matching this exact schema:
{
  "name": "${foodName}",
  "servingDescription": "description of standard serving",
  "calories": number,
  "proteinG": number,
  "carbsG": number,
  "fatsG": number
}`;

  return await callGemini(
    prompt,
    'You are a certified sports nutritionist. Always return realistic nutritional data strictly in the requested JSON structure.'
  );
}

/**
 * Generate a culturally adapted meal utilizing kitchen pantry inventory.
 */
export async function generatePantryMeal(user, mealType, targetCalories) {
  const region = user?.preferences?.countryRegion || user?.countryRegion || 'Global';
  const dietaryLaws = user?.preferences?.religionDietary || user?.religionDietary || ['None'];
  const pantry = user?.preferences?.pantryInventory || user?.pantryInventory || [];

  const prompt = `Generate a culturally authentic ${mealType} recipe for a user with these constraints:
- Cultural Region: ${region}
- Religious / Dietary Laws: ${dietaryLaws.join(', ')}
- Available Pantry Items to prioritize: ${pantry.join(', ')}
- Target Calories: approx ${targetCalories} kcal (±50 kcal)

Return JSON with this schema:
{
  "name": "Recipe title with local cultural name",
  "servingDescription": "Serving size e.g. 1 bowl (250g)",
  "calories": number,
  "proteinG": number,
  "carbsG": number,
  "fatsG": number,
  "ingredientsUsed": ["ingredient 1", "ingredient 2"],
  "briefCookingSteps": ["Step 1", "Step 2", "Step 3"]
}`;

  return await callGemini(
    prompt,
    'You are an expert culturally adaptive chef and sports dietitian. Always respect religious dietary laws strictly (e.g. Halal, Kosher, Vegetarian).'
  );
}

/**
 * Provide an encouraging, non-punitive "Balance Boost" message.
 */
export async function getBalanceBoostAdvice(user, surplusKcal, exerciseName, durationMins) {
  const prompt = `A fitness app user ate ${surplusKcal} kcal above their daily target today.
Their optional Balance Boost task is ${durationMins} minutes of ${exerciseName}.
Write a warm, supportive, 2-sentence message in JSON format explaining that one meal does not derail progress and that this movement is purely optional to feel energized.
Return JSON: { "message": "your 2-sentence encouraging message" }`;

  return await callGemini(
    prompt,
    'You are a body-positive, evidence-based fitness coach. Never frame exercise as a punishment for eating.'
  );
}
