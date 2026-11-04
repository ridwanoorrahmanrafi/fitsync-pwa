/**
 * FitSync PWA - Complete Database Seeder
 * File: /server/src/seed/seedData.js
 * Usage: node src/seed/seedData.js or npm run seed
 */

import 'dotenv/config';
import dns from 'dns';
import mongoose from 'mongoose';
import Exercise from '../models/Exercise.model.js';
import FoodItem from '../models/FoodItem.model.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if custom DNS cannot be set
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitsync';

// ============================================================================
// 1. 30 EXERCISES (Home Bodyweight, Dumbbells, Resistance Bands, Full Gym)
// ============================================================================
const exercises = [
  // --- NONE / HOME BODYWEIGHT (12 Exercises) ---
  {
    name: 'Standard Push-Ups',
    targetMuscle: 'chest',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Start in a high plank position with hands slightly wider than shoulder-width.',
      'Keep your core tight and back flat.',
      'Lower your chest until it hovers just above the floor.',
      'Push explosively back up to the starting position.'
    ],
    metValue: 3.8,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Incline Knee Push-Ups',
    targetMuscle: 'chest',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Place knees on a mat and hands shoulder-width apart on the floor.',
      'Lower your torso while keeping elbows at a 45-degree angle.',
      'Press through your palms to return to the top.'
    ],
    metValue: 3.0,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Diamond Push-Ups',
    targetMuscle: 'arms',
    equipmentRequired: 'none_home',
    difficulty: 'advanced',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Form a diamond shape under your chest with your thumbs and index fingers.',
      'Keep elbows tucked close to your ribs as you lower down.',
      'Press back up, squeezing the triceps at the top.'
    ],
    metValue: 4.5,
    defaultSets: 4,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Bodyweight Air Squats',
    targetMuscle: 'legs',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_vxnelydc.json',
    instructions: [
      'Stand with feet shoulder-width apart and toes slightly pointed out.',
      'Push your hips back and bend your knees until thighs are parallel to the floor.',
      'Keep your chest up and drive through your heels to stand.'
    ],
    metValue: 5.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Alternating Reverse Lunges',
    targetMuscle: 'legs',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_vxnelydc.json',
    instructions: [
      'Stand tall with feet hip-width apart.',
      'Step backward with one leg and lower until both knees are at 90-degree angles.',
      'Push off the front foot to return to standing and switch legs.'
    ],
    metValue: 4.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Explosive Jump Squats',
    targetMuscle: 'legs',
    equipmentRequired: 'none_home',
    difficulty: 'advanced',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_vxnelydc.json',
    instructions: [
      'Perform a standard squat down to parallel.',
      'Explode upward into a vertical jump, swinging arms for momentum.',
      'Land softly on the balls of your feet and immediately sink into the next squat.'
    ],
    metValue: 8.5,
    defaultSets: 4,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 35
  },
  {
    name: 'Forearm Plank Hold',
    targetMuscle: 'core',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_c9miik7h.json',
    instructions: [
      'Rest on your forearms with elbows directly beneath your shoulders.',
      'Maintain a straight line from head to heels.',
      'Brace your abs and glutes without letting your hips sag.'
    ],
    metValue: 3.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 25
  },
  {
    name: 'Bicycle Crunches',
    targetMuscle: 'core',
    equipmentRequired: 'none_home',
    difficulty: 'intermediate',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_c9miik7h.json',
    instructions: [
      'Lie flat on your back with hands lightly behind your head.',
      'Bring knees up to a 90-degree angle.',
      'Alternate touching your right elbow to your left knee while extending the right leg.'
    ],
    metValue: 4.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 25
  },
  {
    name: 'Mountain Climbers',
    targetMuscle: 'cardio_full',
    equipmentRequired: 'none_home',
    difficulty: 'intermediate',
    animationUrl: 'https://assets10.lottiefiles.com/packages/lf20_abqysclq.json',
    instructions: [
      'Begin in a strong high plank position.',
      'Drive one knee toward your chest, then rapidly switch legs in a running motion.',
      'Keep your hips level and core engaged throughout.'
    ],
    metValue: 8.0,
    defaultSets: 4,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 25
  },
  {
    name: 'Full Burpees',
    targetMuscle: 'cardio_full',
    equipmentRequired: 'none_home',
    difficulty: 'advanced',
    animationUrl: 'https://assets10.lottiefiles.com/packages/lf20_abqysclq.json',
    instructions: [
      'Drop into a squat and place hands on the floor.',
      'Kick feet back into a push-up position and perform one push-up.',
      'Jump feet back to your hands and explode upward with hands overhead.'
    ],
    metValue: 10.0,
    defaultSets: 4,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 40
  },
  {
    name: 'Jumping Jacks',
    targetMuscle: 'cardio_full',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets4.lottiefiles.com/packages/lf20_u4jjb9bd.json',
    instructions: [
      'Stand upright with legs together and arms at your sides.',
      'Jump feet out wide while raising arms overhead.',
      'Jump immediately back to starting position at a brisk pace.'
    ],
    metValue: 7.5,
    defaultSets: 3,
    defaultWorkSeconds: 50,
    defaultRestSeconds: 20
  },
  {
    name: 'High Knees Sprint in Place',
    targetMuscle: 'cardio_full',
    equipmentRequired: 'none_home',
    difficulty: 'intermediate',
    animationUrl: 'https://assets4.lottiefiles.com/packages/lf20_u4jjb9bd.json',
    instructions: [
      'Run in place while driving your knees up to waist level.',
      'Pump your arms rapidly and stay on the balls of your feet.'
    ],
    metValue: 9.0,
    defaultSets: 4,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 25
  },

  // --- DUMBBELLS (8 Exercises) ---
  {
    name: 'Dumbbell Goblet Squats',
    targetMuscle: 'legs',
    equipmentRequired: 'dumbbells',
    difficulty: 'beginner',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_vxnelydc.json',
    instructions: [
      'Hold one dumbbell vertically against your chest with both hands.',
      'Squat down keeping elbows inside your knees.',
      'Drive up through your heels to full extension.'
    ],
    metValue: 5.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 35
  },
  {
    name: 'Dumbbell Romanian Deadlifts (RDL)',
    targetMuscle: 'legs',
    equipmentRequired: 'dumbbells',
    difficulty: 'intermediate',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_vxnelydc.json',
    instructions: [
      'Hold a pair of dumbbells in front of your thighs.',
      'Hinge at the hips with a slight knee bend, lowering weights along your shins.',
      'Stop when you feel a deep hamstring stretch, then squeeze glutes to stand.'
    ],
    metValue: 6.0,
    defaultSets: 4,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 35
  },
  {
    name: 'Standing Dumbbell Overhead Press',
    targetMuscle: 'shoulders',
    equipmentRequired: 'dumbbells',
    difficulty: 'intermediate',
    animationUrl: 'https://assets7.lottiefiles.com/packages/lf20_p1qiuawe.json',
    instructions: [
      'Stand with dumbbells at shoulder height, palms facing forward.',
      'Brace your core and press weights directly overhead until arms lock out.',
      'Lower slowly back to shoulder level.'
    ],
    metValue: 5.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Bent-Over Dumbbell Rows',
    targetMuscle: 'back',
    equipmentRequired: 'dumbbells',
    difficulty: 'intermediate',
    animationUrl: 'https://assets7.lottiefiles.com/packages/lf20_p1qiuawe.json',
    instructions: [
      'Hinge forward at a 45-degree angle with a flat back.',
      'Pull dumbbells toward your hip crease, squeezing shoulder blades together.',
      'Lower weights under control.'
    ],
    metValue: 5.5,
    defaultSets: 4,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Dumbbell Floor or Bench Chest Press',
    targetMuscle: 'chest',
    equipmentRequired: 'dumbbells',
    difficulty: 'beginner',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Lie on a bench or floor holding dumbbells above your chest.',
      'Lower weights until upper arms touch the floor or parallel to the bench.',
      'Press weights back together at the top.'
    ],
    metValue: 5.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 35
  },
  {
    name: 'Alternating Dumbbell Bicep Curls',
    targetMuscle: 'arms',
    equipmentRequired: 'dumbbells',
    difficulty: 'beginner',
    animationUrl: 'https://assets7.lottiefiles.com/packages/lf20_p1qiuawe.json',
    instructions: [
      'Stand tall holding dumbbells at your sides with palms facing forward.',
      'Keep elbows pinned to your torso and curl weights up toward your shoulders.',
      'Lower slowly to maximize tension.'
    ],
    metValue: 4.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 25
  },
  {
    name: 'Dumbbell Lateral Raises',
    targetMuscle: 'shoulders',
    equipmentRequired: 'dumbbells',
    difficulty: 'intermediate',
    animationUrl: 'https://assets7.lottiefiles.com/packages/lf20_p1qiuawe.json',
    instructions: [
      'Hold light dumbbells at your sides with a slight bend in your elbows.',
      'Raise arms out to the sides until parallel with the floor.',
      'Pause briefly at the top and lower slowly.'
    ],
    metValue: 4.2,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 25
  },
  {
    name: 'Dumbbell Thrusters (Squat to Press)',
    targetMuscle: 'cardio_full',
    equipmentRequired: 'dumbbells',
    difficulty: 'advanced',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_vxnelydc.json',
    instructions: [
      'Hold dumbbells at shoulder height and squat down to parallel.',
      'Drive explosively out of the squat and use the momentum to press weights overhead.',
      'Lower weights back to shoulders and repeat.'
    ],
    metValue: 8.5,
    defaultSets: 4,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 40
  },

  // --- RESISTANCE BANDS (4 Exercises) ---
  {
    name: 'Resistance Band Seated or Standing Rows',
    targetMuscle: 'back',
    equipmentRequired: 'resistance_bands',
    difficulty: 'beginner',
    animationUrl: 'https://assets7.lottiefiles.com/packages/lf20_p1qiuawe.json',
    instructions: [
      'Anchor the band around your feet or a sturdy post.',
      'Pull handles back toward your lower ribcage while squeezing your back.',
      'Release slowly without letting the band snap back.'
    ],
    metValue: 4.2,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Banded Front Squats',
    targetMuscle: 'legs',
    equipmentRequired: 'resistance_bands',
    difficulty: 'beginner',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_vxnelydc.json',
    instructions: [
      'Stand on the band with feet shoulder-width apart and loop the top over your shoulders.',
      'Perform a full squat against the band tension.',
      'Stand tall and squeeze glutes at the top.'
    ],
    metValue: 5.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Resistance Band Chest Press',
    targetMuscle: 'chest',
    equipmentRequired: 'resistance_bands',
    difficulty: 'intermediate',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Wrap the band behind your upper back and hold both ends at chest level.',
      'Press forward until arms are fully extended.',
      'Return slowly to starting position.'
    ],
    metValue: 4.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Resistance Band Face Pulls',
    targetMuscle: 'shoulders',
    equipmentRequired: 'resistance_bands',
    difficulty: 'beginner',
    animationUrl: 'https://assets7.lottiefiles.com/packages/lf20_p1qiuawe.json',
    instructions: [
      'Anchor the band at eye level.',
      'Pull the band toward your forehead while flaring elbows high and wide.',
      'Squeeze rear delts for 1 second before returning.'
    ],
    metValue: 3.8,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 25
  },

  // --- FULL GYM (6 Exercises) ---
  {
    name: 'Barbell Bench Press',
    targetMuscle: 'chest',
    equipmentRequired: 'full_gym',
    difficulty: 'intermediate',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Lie flat on the bench with eyes under the barbell.',
      'Unrack the bar and lower it slowly to mid-chest.',
      'Drive feet into the floor and press the bar back to lockout.'
    ],
    metValue: 6.0,
    defaultSets: 4,
    defaultWorkSeconds: 50,
    defaultRestSeconds: 60
  },
  {
    name: 'Barbell Back Squat',
    targetMuscle: 'legs',
    equipmentRequired: 'full_gym',
    difficulty: 'intermediate',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_vxnelydc.json',
    instructions: [
      'Rest the barbell across your upper traps and unrack safely.',
      'Take a deep breath, brace your core, and squat down below parallel.',
      'Drive upward while keeping knees tracking over your toes.'
    ],
    metValue: 6.5,
    defaultSets: 4,
    defaultWorkSeconds: 50,
    defaultRestSeconds: 60
  },
  {
    name: 'Wide-Grip Lat Pulldown',
    targetMuscle: 'back',
    equipmentRequired: 'full_gym',
    difficulty: 'beginner',
    animationUrl: 'https://assets7.lottiefiles.com/packages/lf20_p1qiuawe.json',
    instructions: [
      'Sit at the pulldown station with thighs secured under the pads.',
      'Grip the bar wider than shoulder-width and pull down to your upper chest.',
      'Control the bar all the way back up to a full lat stretch.'
    ],
    metValue: 5.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 40
  },
  {
    name: 'Conventional Barbell Deadlift',
    targetMuscle: 'back',
    equipmentRequired: 'full_gym',
    difficulty: 'advanced',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_vxnelydc.json',
    instructions: [
      'Stand with mid-foot under the barbell and grip just outside your shins.',
      'Flatten your back, pull the slack out of the bar, and drive the floor away.',
      'Lock out hips and knees together at the top.'
    ],
    metValue: 7.0,
    defaultSets: 4,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 60
  },
  {
    name: 'Cable Rope Tricep Pushdowns',
    targetMuscle: 'arms',
    equipmentRequired: 'full_gym',
    difficulty: 'beginner',
    animationUrl: 'https://assets7.lottiefiles.com/packages/lf20_p1qiuawe.json',
    instructions: [
      'Attach a rope to a high pulley and keep elbows tucked at your sides.',
      'Extend your forearms downward and pull the rope ends apart at the bottom.',
      'Return slowly to 90 degrees.'
    ],
    metValue: 4.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Hanging Leg Raises',
    targetMuscle: 'core',
    equipmentRequired: 'full_gym',
    difficulty: 'advanced',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_c9miik7h.json',
    instructions: [
      'Hang from a pull-up bar with an overhand grip.',
      'Without swinging, curl your pelvis upward and raise your legs to 90 degrees.',
      'Lower slowly to prevent momentum.'
    ],
    metValue: 5.0,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 35
  }
];

// ============================================================================
// 2. 40 CULTURAL & RELIGIOUS FOOD ITEMS (With Pantry Keywords)
// ============================================================================
const foodItems = [
  // --- SOUTH ASIA (12 Items) ---
  {
    name: 'Masoor Dal Tadka with Steamed Basmati Rice',
    regions: ['South_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['lentils', 'dal', 'rice', 'turmeric', 'garlic', 'onion', 'tomatoes'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 bowl dal (200g) + 1 cup rice (150g)',
    calories: 410,
    proteinG: 16,
    carbsG: 72,
    fatsG: 6
  },
  {
    name: 'Tandoori Grilled Chicken Breast with Mint Chutney & Salad',
    regions: ['South_Asia', 'Middle_East'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['chicken', 'yogurt', 'curd', 'lemon', 'garlic', 'ginger', 'cucumber'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '200g grilled chicken breast + side salad',
    calories: 340,
    proteinG: 46,
    carbsG: 8,
    fatsG: 12
  },
  {
    name: 'Moong Dal Khichdi with Ghee',
    regions: ['South_Asia'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['lentils', 'moong dal', 'rice', 'ghee', 'cumin', 'turmeric'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 large comforting bowl (300g)',
    calories: 380,
    proteinG: 14,
    carbsG: 62,
    fatsG: 9
  },
  {
    name: 'Palak Paneer with 2 Whole Wheat Rotis',
    regions: ['South_Asia'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['paneer', 'spinach', 'wheat flour', 'atta', 'roti', 'onion', 'tomatoes'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 bowl Palak Paneer (200g) + 2 Rotis',
    calories: 490,
    proteinG: 22,
    carbsG: 50,
    fatsG: 21
  },
  {
    name: 'Chana Masala (Spiced Chickpea Curry) with Brown Rice',
    regions: ['South_Asia', 'Middle_East', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['chickpeas', 'chana', 'rice', 'tomatoes', 'onion', 'garlic', 'spices'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 bowl chickpeas (200g) + 1 cup rice',
    calories: 430,
    proteinG: 15,
    carbsG: 74,
    fatsG: 8
  },
  {
    name: 'Vegetable Poha with Peanuts & Curry Leaves',
    regions: ['South_Asia'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['poha', 'flattened rice', 'peanuts', 'peas', 'potatoes', 'onion', 'lemon'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '1 medium plate (220g)',
    calories: 310,
    proteinG: 8,
    carbsG: 52,
    fatsG: 8
  },
  {
    name: 'Spiced Egg Bhurji (3 Eggs) with 2 Whole Wheat Toast/Roti',
    regions: ['South_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['eggs', 'bread', 'wheat flour', 'roti', 'onion', 'tomatoes', 'chili'],
    mealTypes: ['breakfast', 'dinner'],
    servingDescription: '3 scrambled eggs + 2 slices toast/roti',
    calories: 390,
    proteinG: 24,
    carbsG: 30,
    fatsG: 19
  },
  {
    name: 'Steamed Idli (3 pcs) with Sambar & Coconut Chutney',
    regions: ['South_Asia'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['rice', 'lentils', 'urad dal', 'coconut', 'sambar'],
    mealTypes: ['breakfast'],
    servingDescription: '3 Idlis + 1 bowl Sambar',
    calories: 320,
    proteinG: 11,
    carbsG: 58,
    fatsG: 5
  },
  {
    name: 'Bengali Fish Jhol (Light Rohu/Tilapia Stew) with Steamed Rice',
    regions: ['South_Asia'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['fish', 'rice', 'potatoes', 'tomatoes', 'mustard oil', 'turmeric'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '150g fish curry + 1 cup steamed rice',
    calories: 420,
    proteinG: 32,
    carbsG: 48,
    fatsG: 11
  },
  {
    name: 'Roasted Makhana (Fox Nuts) & Mixed Almonds/Walnuts',
    regions: ['South_Asia'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['makhana', 'almonds', 'walnuts', 'nuts', 'ghee'],
    mealTypes: ['snack'],
    servingDescription: '1 bowl roasted makhana (40g) + 10 almonds',
    calories: 210,
    proteinG: 7,
    carbsG: 22,
    fatsG: 10
  },
  {
    name: 'Roasted Chana (Black Gram) & Cucumber Chaat',
    regions: ['South_Asia'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['chickpeas', 'roasted chana', 'cucumber', 'tomatoes', 'lemon'],
    mealTypes: ['snack'],
    servingDescription: '1 bowl (150g)',
    calories: 220,
    proteinG: 11,
    carbsG: 34,
    fatsG: 4
  },
  {
    name: 'Jain Moong Dal Chilla (Savory Lentil Pancakes) with Paneer Stuffing',
    regions: ['South_Asia'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['moong dal', 'lentils', 'paneer', 'cumin', 'ginger', 'coriander'],
    mealTypes: ['breakfast', 'dinner'],
    servingDescription: '2 stuffed chillas with mint chutney',
    calories: 350,
    proteinG: 21,
    carbsG: 38,
    fatsG: 12
  },

  // --- MIDDLE EAST (7 Items) ---
  {
    name: 'Shakshuka (Poached Eggs in Spiced Tomato Sauce) with Whole Wheat Pita',
    regions: ['Middle_East', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['eggs', 'tomatoes', 'onion', 'bell pepper', 'pita', 'bread', 'olive oil'],
    mealTypes: ['breakfast', 'dinner'],
    servingDescription: '2 eggs in sauce + 1 whole wheat pita',
    calories: 380,
    proteinG: 19,
    carbsG: 36,
    fatsG: 17
  },
  {
    name: 'Chicken Shish Tawook Skewers with Tabbouleh & Hummus',
    regions: ['Middle_East'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['chicken', 'chickpeas', 'hummus', 'parsley', 'tomatoes', 'olive oil', 'lemon', 'garlic'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '200g grilled chicken + 2 tbsp hummus + salad',
    calories: 440,
    proteinG: 44,
    carbsG: 24,
    fatsG: 18
  },
  {
    name: 'Mujadara (Middle Eastern Lentils & Rice with Caramelized Onions)',
    regions: ['Middle_East'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['lentils', 'rice', 'onion', 'olive oil', 'cumin', 'yogurt'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 hearty plate (300g)',
    calories: 410,
    proteinG: 15,
    carbsG: 68,
    fatsG: 9
  },
  {
    name: 'Foul Medames (Stewed Fava Beans with Olive Oil, Lemon & Tahini)',
    regions: ['Middle_East', 'Africa'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['fava beans', 'beans', 'olive oil', 'lemon', 'garlic', 'pita'],
    mealTypes: ['breakfast', 'lunch'],
    servingDescription: '1 bowl (250g) + half pita',
    calories: 360,
    proteinG: 16,
    carbsG: 49,
    fatsG: 11
  },
  {
    name: 'Baked Falafel Bowl with Quinoa, Tahini & Cucumber Salad',
    regions: ['Middle_East', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['chickpeas', 'quinoa', 'cucumber', 'tomatoes', 'sesame', 'olive oil'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '4 baked falafels + salad bowl',
    calories: 450,
    proteinG: 17,
    carbsG: 56,
    fatsG: 17
  },
  {
    name: 'Labneh & Zaatar Bowl with Cucumber, Olives & Whole Grain Pita',
    regions: ['Middle_East'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['yogurt', 'labneh', 'olive oil', 'cucumber', 'olives', 'bread', 'pita'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '150g Labneh + veggies + half pita',
    calories: 280,
    proteinG: 12,
    carbsG: 26,
    fatsG: 14
  },
  {
    name: 'Medjool Dates Stuffed with Walnuts & Greek Yogurt Dip',
    regions: ['Middle_East', 'South_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['dates', 'walnuts', 'almonds', 'yogurt', 'milk'],
    mealTypes: ['snack'],
    servingDescription: '3 dates + 4 walnut halves + 100g yogurt',
    calories: 250,
    proteinG: 11,
    carbsG: 34,
    fatsG: 8
  },

  // --- EAST ASIA (6 Items) ---
  {
    name: 'Steamed Tofu, Bok Choy & Mushroom Stir-Fry with Jasmine Rice',
    regions: ['East_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['tofu', 'rice', 'mushrooms', 'cabbage', 'spinach', 'soy sauce', 'garlic', 'ginger'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '200g tofu & greens + 1 cup rice',
    calories: 390,
    proteinG: 21,
    carbsG: 52,
    fatsG: 11
  },
  {
    name: 'Teriyaki Glazed Salmon Fillet with Edamame & Brown Rice',
    regions: ['East_Asia', 'Western'],
    dietaryTags: ['Halal', 'Kosher', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['salmon', 'fish', 'rice', 'edamame', 'soy sauce', 'ginger'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '150g salmon + 1 cup brown rice + edamame',
    calories: 480,
    proteinG: 38,
    carbsG: 46,
    fatsG: 16
  },
  {
    name: 'Savoury Chicken & Ginger Congee (Rice Porridge) with Soft-Boiled Egg',
    regions: ['East_Asia'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['rice', 'chicken', 'eggs', 'ginger', 'garlic', 'green onion'],
    mealTypes: ['breakfast', 'dinner'],
    servingDescription: '1 large bowl (350g) with shredded chicken & 1 egg',
    calories: 330,
    proteinG: 26,
    carbsG: 38,
    fatsG: 8
  },
  {
    name: 'Miso Soup with Wakame, Silken Tofu & Steamed Edamame Pods',
    regions: ['East_Asia'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['tofu', 'edamame', 'soybeans', 'miso'],
    mealTypes: ['snack', 'breakfast'],
    servingDescription: '1 bowl soup + 150g edamame pods',
    calories: 210,
    proteinG: 18,
    carbsG: 16,
    fatsG: 8
  },
  {
    name: 'Chicken Breast & Broccoli Garlic Stir-Fry',
    regions: ['East_Asia', 'Western', 'Global'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['chicken', 'broccoli', 'rice', 'garlic', 'soy sauce', 'carrots'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '200g chicken & broccoli + 100g steamed rice',
    calories: 410,
    proteinG: 42,
    carbsG: 38,
    fatsG: 9
  },
  {
    name: 'Buckwheat Soba Noodles with Cucumber, Sesame & Soft Boiled Eggs',
    regions: ['East_Asia'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['noodles', 'eggs', 'cucumber', 'sesame', 'soy sauce'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 bowl noodles (250g) + 2 boiled eggs',
    calories: 400,
    proteinG: 22,
    carbsG: 54,
    fatsG: 11
  },

  // --- WESTERN / GLOBAL (8 Items) ---
  {
    name: 'High-Protein Rolled Oats with Whey/Milk, Banana & Peanut Butter',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['oats', 'milk', 'banana', 'peanut butter', 'chia seeds', 'honey'],
    mealTypes: ['breakfast'],
    servingDescription: '60g oats + 200ml milk + 1 banana + 1 tbsp peanut butter',
    calories: 430,
    proteinG: 19,
    carbsG: 62,
    fatsG: 12
  },
  {
    name: 'Avocado & Poached Egg Sourdough Toast with Cherry Tomatoes',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['eggs', 'bread', 'avocado', 'tomatoes', 'olive oil'],
    mealTypes: ['breakfast'],
    servingDescription: '2 poached eggs + half avocado + 2 slices whole grain toast',
    calories: 410,
    proteinG: 20,
    carbsG: 34,
    fatsG: 22
  },
  {
    name: 'Herb-Grilled Chicken Breast with Roasted Sweet Potato & Broccoli',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['chicken', 'sweet potato', 'potatoes', 'broccoli', 'olive oil', 'garlic'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '180g chicken breast + 150g sweet potato + greens',
    calories: 440,
    proteinG: 45,
    carbsG: 42,
    fatsG: 9
  },
  {
    name: 'Greek Yogurt Parfait with Mixed Berries & Chia Seeds',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['yogurt', 'berries', 'apple', 'banana', 'chia seeds', 'almonds', 'oats'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '200g Greek yogurt + berries + 1 tbsp chia seeds',
    calories: 240,
    proteinG: 20,
    carbsG: 24,
    fatsG: 6
  },
  {
    name: 'Mediterranean Tuna, White Bean & Olive Salad',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['tuna', 'fish', 'beans', 'cucumber', 'tomatoes', 'olive oil', 'lemon'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 can tuna in water + 100g white beans + greens',
    calories: 370,
    proteinG: 38,
    carbsG: 28,
    fatsG: 11
  },
  {
    name: 'Lean Beef Sirloin Stir-Fry with Bell Peppers & Quinoa',
    regions: ['Western', 'Latin_America', 'East_Asia'],
    dietaryTags: ['Halal', 'Kosher', 'None'], // Excluded from Hindu_No_Beef & Vegetarian
    pantryKeywords: ['beef', 'bell pepper', 'onion', 'quinoa', 'rice', 'garlic'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '160g lean beef + 1 cup cooked quinoa + peppers',
    calories: 470,
    proteinG: 43,
    carbsG: 40,
    fatsG: 15
  },
  {
    name: 'Cottage Cheese (or Paneer) Bowl with Apple Slices & Cinnamon',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['cottage cheese', 'paneer', 'apple', 'walnuts', 'cinnamon'],
    mealTypes: ['snack'],
    servingDescription: '150g cottage cheese + 1 medium apple',
    calories: 230,
    proteinG: 18,
    carbsG: 26,
    fatsG: 5
  },
  {
    name: 'Vegan Lentil & Sweet Potato Shepherd’s Bowl',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['lentils', 'sweet potato', 'potatoes', 'peas', 'carrots', 'onion'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 large baked bowl (320g)',
    calories: 390,
    proteinG: 16,
    carbsG: 66,
    fatsG: 6
  },

  // --- LATIN AMERICA & AFRICA (7 Items) ---
  {
    name: 'Black Bean, Corn & Avocado Burrito Bowl with Brown Rice',
    regions: ['Latin_America', 'Western', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['black beans', 'beans', 'rice', 'corn', 'avocado', 'tomatoes', 'lime'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 bowl (320g)',
    calories: 450,
    proteinG: 16,
    carbsG: 68,
    fatsG: 13
  },
  {
    name: 'Pollo Asado (Citrus Grilled Chicken) with Black Beans & Salsa',
    regions: ['Latin_America'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['chicken', 'black beans', 'beans', 'tomatoes', 'onion', 'lemon', 'garlic'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '180g grilled chicken + 150g black beans',
    calories: 420,
    proteinG: 46,
    carbsG: 36,
    fatsG: 10
  },
  {
    name: 'Huevos Rancheros with Corn Tortillas & Refried Pinto Beans',
    regions: ['Latin_America'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['eggs', 'beans', 'corn', 'tomatoes', 'onion', 'chili'],
    mealTypes: ['breakfast'],
    servingDescription: '2 eggs + 2 corn tortillas + 100g beans',
    calories: 380,
    proteinG: 21,
    carbsG: 42,
    fatsG: 14
  },
  {
    name: 'Ceviche de Pescado (Lime-Marinated White Fish) with Sweet Potato',
    regions: ['Latin_America'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['fish', 'sweet potato', 'potatoes', 'corn', 'lemon', 'onion'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '200g fish ceviche + 100g boiled sweet potato',
    calories: 340,
    proteinG: 36,
    carbsG: 35,
    fatsG: 5
  },
  {
    name: 'West African Jollof Rice with Grilled Tilapia & Steamed Greens',
    regions: ['Africa'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['rice', 'fish', 'tomatoes', 'onion', 'bell pepper', 'spinach', 'garlic'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 cup Jollof rice + 180g grilled tilapia',
    calories: 460,
    proteinG: 39,
    carbsG: 52,
    fatsG: 10
  },
  {
    name: 'African Peanut & Chickpea Sweet Potato Stew',
    regions: ['Africa', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['peanut butter', 'peanuts', 'chickpeas', 'sweet potato', 'spinach', 'tomatoes'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 rich bowl (300g)',
    calories: 430,
    proteinG: 16,
    carbsG: 48,
    fatsG: 19
  },
  {
    name: 'Roasted Plantain & Spiced Black-Eyed Peas Bowl',
    regions: ['Africa', 'Latin_America'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['banana', 'plantain', 'beans', 'tomatoes', 'onion', 'garlic'],
    mealTypes: ['breakfast', 'snack', 'lunch'],
    servingDescription: '1 roasted plantain + 150g spiced beans',
    calories: 350,
    proteinG: 13,
    carbsG: 64,
    fatsG: 5
  }
];

// ============================================================================
// 3. EXECUTION SCRIPT
// ============================================================================
async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB:', MONGODB_URI);

    await Exercise.deleteMany({});
    await FoodItem.deleteMany({});
    console.log('🧹 Cleared existing Exercises and FoodItems collections.');

    const insertedExercises = await Exercise.insertMany(exercises);
    console.log(`💪 Seeded ${insertedExercises.length} Exercises with MET values & Lottie URLs.`);

    const insertedFoods = await FoodItem.insertMany(foodItems);
    console.log(`🍲 Seeded ${insertedFoods.length} Cultural/Religious Food Items with Pantry Keywords.`);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Seeding Failed:', error);
    process.exit(1);
  }
}

seedDatabase();