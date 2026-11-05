/**
 * FitSync Seed Coverage & Dietary Tag Integrity Test
 * Verifies Section 7:
 * "A unit test must prove every region x single dietary rule x meal slot has at least 2 foods."
 * Rules:
 * - No dairy, egg, meat, fish or honey keywords on Vegan foods.
 * - No onion, garlic, potato, ginger, carrot or sweet potato keywords on Jain foods.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const foods = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/seed/foodsData.json'), 'utf-8')
);

const exercises = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/seed/exercisesData.json'), 'utf-8')
);

describe('Seed Catalog Volume Requirements (Section 7)', () => {
  test('Contains at least 50 exercises with valid MET and Lottie URLs', () => {
    expect(exercises.length).toBeGreaterThanOrEqual(50);
    for (const ex of exercises) {
      expect(ex.name).toBeTruthy();
      expect(ex.targetMuscle).toBeTruthy();
      expect(ex.equipmentRequired).toBeTruthy();
      expect(ex.metValue).toBeGreaterThan(0);
      expect(ex.animationUrl).toMatch(/^https?:\/\//);
      expect(ex.instructions.length).toBeGreaterThan(0);
    }
  });

  test('Contains at least 50 foods', () => {
    expect(foods.length).toBeGreaterThanOrEqual(50);
  });
});

describe('Strict Dietary Law Compliance (Section 7)', () => {
  const prohibitedVeganKeywords = [
    'dairy', 'milk', 'cheese', 'yogurt', 'paneer', 'ghee', 'butter',
    'egg', 'meat', 'chicken', 'beef', 'lamb', 'pork', 'fish', 'tuna', 'salmon', 'honey'
  ];

  const prohibitedJainKeywords = [
    'onion', 'garlic', 'potato', 'ginger', 'carrot', 'sweet potato'
  ];

  test('Vegan foods contain no animal, dairy, egg, fish, or honey keywords', () => {
    for (const food of foods) {
      if (food.dietaryTags.includes('Vegan')) {
        for (const kw of food.pantryKeywords) {
          expect(prohibitedVeganKeywords).not.toContain(kw.toLowerCase());
        }
      }
    }
  });

  test('Jain foods contain no root vegetable keywords', () => {
    for (const food of foods) {
      if (food.dietaryTags.includes('Jain')) {
        for (const kw of food.pantryKeywords) {
          expect(prohibitedJainKeywords).not.toContain(kw.toLowerCase());
        }
      }
    }
  });
});

describe('Combinatorial Matrix Coverage (Section 7)', () => {
  const regions = ['South_Asia', 'Middle_East', 'East_Asia', 'Western', 'Latin_America', 'Africa'];
  const rules = ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'];
  const slots = ['breakfast', 'lunch', 'snack', 'dinner'];

  test('Every region x single dietary rule x meal slot has at least 2 foods', () => {
    for (const r of regions) {
      for (const d of rules) {
        for (const m of slots) {
          const eligible = foods.filter((f) => {
            const regionMatch = f.regions.includes(r) || f.regions.includes('Global');
            const dietaryMatch = d === 'None' ? true : f.dietaryTags.includes(d);
            const slotMatch = f.mealTypes.includes(m);
            return regionMatch && dietaryMatch && slotMatch;
          });
          expect(eligible.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });
});

