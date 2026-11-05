import fs from 'fs';

const foods = [
  // --- SOUTH ASIA (Regional & Global) ---
  {
    name: 'Spiced Masala Oats with Chia & Turmeric',
    regions: ['South_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['oats', 'chia seeds', 'turmeric', 'black pepper', 'cumin'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '1 warm bowl (70g rolled oats + water + chia seeds)',
    calories: 320,
    proteinG: 12,
    carbsG: 54,
    fatsG: 6
  },
  {
    name: 'Yellow Moong Dal Khichdi with Cumin',
    regions: ['South_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['rice', 'lentils', 'moong dal', 'cumin', 'turmeric', 'olive oil'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 medium bowl (150g cooked rice and lentils)',
    calories: 410,
    proteinG: 17,
    carbsG: 68,
    fatsG: 6
  },
  {
    name: 'Steamed Basmati Rice with Spinach Dal',
    regions: ['South_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['rice', 'basmati', 'lentils', 'spinach', 'cumin'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 plate (150g rice + 120g spinach dal)',
    calories: 450,
    proteinG: 18,
    carbsG: 78,
    fatsG: 5
  },
  {
    name: 'Roasted Turmeric Chana Chickpeas',
    regions: ['South_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['chickpeas', 'chana', 'turmeric', 'cumin'],
    mealTypes: ['snack'],
    servingDescription: '1 cup roasted chana (80g)',
    calories: 260,
    proteinG: 14,
    carbsG: 40,
    fatsG: 4
  },
  {
    name: 'Spiced Paneer Bhurji with Whole Wheat Roti',
    regions: ['South_Asia'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['paneer', 'milk', 'flour', 'roti', 'tomatoes', 'cumin'],
    mealTypes: ['breakfast', 'dinner'],
    servingDescription: '120g scrambled paneer + 2 whole wheat rotis',
    calories: 480,
    proteinG: 26,
    carbsG: 44,
    fatsG: 22
  },
  {
    name: 'Tandoori Spiced Chicken Breast with Basmati Rice',
    regions: ['South_Asia'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['chicken', 'rice', 'basmati', 'yogurt', 'paprika', 'cumin'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '180g grilled spiced chicken + 150g basmati rice',
    calories: 520,
    proteinG: 48,
    carbsG: 54,
    fatsG: 10
  },
  {
    name: 'Bengali Spiced Mustard Fish with Rice',
    regions: ['South_Asia'],
    dietaryTags: ['Halal', 'Kosher', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['fish', 'rice', 'mustard', 'turmeric', 'chilies'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '160g fish fillet in light mustard gravy + 150g rice',
    calories: 470,
    proteinG: 38,
    carbsG: 52,
    fatsG: 11
  },
  {
    name: 'Puffed Rice Bhel with Roasted Peanuts & Lemon',
    regions: ['South_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['puffed rice', 'peanuts', 'lemon', 'cumin'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '1 bowl puffed rice flakes + peanuts + lemon',
    calories: 240,
    proteinG: 8,
    carbsG: 36,
    fatsG: 7
  },

  // --- MIDDLE EAST (Regional & Global) ---
  {
    name: 'Mediterranean Shakshuka with Poached Eggs',
    regions: ['Middle_East', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['eggs', 'tomatoes', 'olive oil', 'bell pepper', 'cumin'],
    mealTypes: ['breakfast', 'dinner'],
    servingDescription: '2 poached eggs in simmered tomato pepper sauce',
    calories: 360,
    proteinG: 20,
    carbsG: 24,
    fatsG: 20
  },
  {
    name: 'Creamy Chickpea Hummus with Warm Olive Oil',
    regions: ['Middle_East', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['chickpeas', 'tahini', 'olive oil', 'lemon', 'cumin'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '150g blended chickpeas with 1 tbsp extra virgin olive oil',
    calories: 330,
    proteinG: 12,
    carbsG: 34,
    fatsG: 16
  },
  {
    name: 'Middle Eastern Mujaddara Lentils & Brown Rice',
    regions: ['Middle_East', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['lentils', 'rice', 'brown rice', 'olive oil', 'cumin'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 hearty bowl (120g lentils + 120g rice + spices)',
    calories: 460,
    proteinG: 20,
    carbsG: 74,
    fatsG: 8
  },
  {
    name: 'Grilled Chicken Shish Tawook Plate',
    regions: ['Middle_East'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['chicken', 'rice', 'olive oil', 'yogurt', 'paprika'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '180g marinated chicken skewer + 150g rice + salad',
    calories: 540,
    proteinG: 50,
    carbsG: 52,
    fatsG: 12
  },
  {
    name: 'Baked Chickpea & Herb Falafel with Tahini',
    regions: ['Middle_East', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['chickpeas', 'tahini', 'parsley', 'coriander', 'olive oil'],
    mealTypes: ['lunch', 'snack'],
    servingDescription: '4 baked falafel patties + 2 tbsp sesame tahini',
    calories: 380,
    proteinG: 16,
    carbsG: 42,
    fatsG: 18
  },
  {
    name: 'Medjool Dates with Crushed Walnuts',
    regions: ['Middle_East', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['dates', 'walnuts'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '4 medjool dates + 30g raw walnut halves',
    calories: 310,
    proteinG: 6,
    carbsG: 54,
    fatsG: 12
  },
  {
    name: 'Lean Beef Kofta Kebab with Bulgur Pilaf',
    regions: ['Middle_East'],
    dietaryTags: ['Halal', 'Kosher', 'None'],
    pantryKeywords: ['beef', 'bulgur', 'wheat', 'parsley', 'cumin'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '160g spiced minced beef kebab + 120g bulgur',
    calories: 560,
    proteinG: 44,
    carbsG: 46,
    fatsG: 20
  },
  {
    name: 'Greek Style Labneh with Zaatar & Olive Oil',
    regions: ['Middle_East', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['yogurt', 'milk', 'olive oil', 'thyme', 'sesame'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '150g strained whole milk yogurt + zaatar + olive oil',
    calories: 270,
    proteinG: 15,
    carbsG: 9,
    fatsG: 19
  },

  // --- EAST ASIA (Regional & Global) ---
  {
    name: 'Silken Tofu Scramble with Bok Choy & Jasmine Rice',
    regions: ['East_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['tofu', 'soy sauce', 'rice', 'sesame oil', 'bok choy'],
    mealTypes: ['breakfast', 'lunch'],
    servingDescription: '200g firm tofu + greens + 120g steamed jasmine rice',
    calories: 380,
    proteinG: 24,
    carbsG: 46,
    fatsG: 10
  },
  {
    name: 'Teriyaki Wild Salmon with Brown Rice & Broccoli',
    regions: ['East_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['salmon', 'fish', 'rice', 'soy sauce', 'broccoli'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '170g grilled salmon + 140g brown rice + steamed broccoli',
    calories: 530,
    proteinG: 42,
    carbsG: 48,
    fatsG: 16
  },
  {
    name: 'Steamed Salted Edamame Soy Pods',
    regions: ['East_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['edamame', 'soybeans', 'sea salt'],
    mealTypes: ['snack'],
    servingDescription: '150g steamed edamame in pods with coarse sea salt',
    calories: 190,
    proteinG: 18,
    carbsG: 14,
    fatsG: 7
  },
  {
    name: 'Miso Broth Soup with Seaweed & Diced Tofu',
    regions: ['East_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['miso', 'tofu', 'seaweed', 'sesame'],
    mealTypes: ['breakfast', 'snack', 'dinner'],
    servingDescription: '1 large bowl miso soup with 100g soft tofu cubes',
    calories: 180,
    proteinG: 14,
    carbsG: 12,
    fatsG: 7
  },
  {
    name: 'Sesame Chicken Stir-Fry with Steamed Rice',
    regions: ['East_Asia'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['chicken', 'rice', 'sesame oil', 'soy sauce', 'cabbage'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '180g lean chicken breast + 150g steamed white rice',
    calories: 510,
    proteinG: 46,
    carbsG: 52,
    fatsG: 10
  },
  {
    name: 'Vegan Mapo Tofu with Steamed Jasmine Rice',
    regions: ['East_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['tofu', 'soybeans', 'rice', 'sesame oil', 'chili'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '220g braised spiced tofu in bean paste + 140g rice',
    calories: 440,
    proteinG: 26,
    carbsG: 54,
    fatsG: 12
  },
  {
    name: 'Jasmine Rice Porridge Congee with Mushrooms',
    regions: ['East_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['rice', 'mushrooms', 'sesame oil', 'soy sauce'],
    mealTypes: ['breakfast', 'dinner'],
    servingDescription: '1 comforting warm bowl slow-cooked rice congee',
    calories: 310,
    proteinG: 9,
    carbsG: 62,
    fatsG: 3
  },
  {
    name: 'Toasted Sesame Rice Onigiri Triangles',
    regions: ['East_Asia', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['rice', 'nori', 'seaweed', 'sesame seeds'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '2 pressed rice balls wrapped in toasted nori',
    calories: 270,
    proteinG: 6,
    carbsG: 54,
    fatsG: 3
  },

  // --- WESTERN (Regional & Global) ---
  {
    name: 'Rolled Oatmeal with Blueberries, Almonds & Soy Milk',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['oats', 'almonds', 'soy milk', 'blueberries'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '1 bowl (80g rolled oats + 150ml soy milk + berries)',
    calories: 360,
    proteinG: 15,
    carbsG: 58,
    fatsG: 8
  },
  {
    name: 'Avocado & Poached Eggs on Toasted Sourdough',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['eggs', 'bread', 'sourdough', 'avocado', 'olive oil'],
    mealTypes: ['breakfast', 'dinner'],
    servingDescription: '2 poached eggs + half smashed avocado + 2 slices bread',
    calories: 430,
    proteinG: 21,
    carbsG: 38,
    fatsG: 21
  },
  {
    name: 'Herb-Grilled Chicken Breast with Steamed Quinoa & Broccoli',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['chicken', 'quinoa', 'broccoli', 'olive oil'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '190g grilled chicken breast + 140g cooked quinoa',
    calories: 520,
    proteinG: 54,
    carbsG: 46,
    fatsG: 11
  },
  {
    name: 'Solid White Tuna Salad with Greens & Sourdough',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['tuna', 'fish', 'bread', 'olive oil', 'lemon'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 can tuna in olive oil (140g) + greens + 2 slices bread',
    calories: 460,
    proteinG: 42,
    carbsG: 36,
    fatsG: 14
  },
  {
    name: 'Plain Greek Yogurt Bowl with Walnuts & Maple Syrup',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['yogurt', 'milk', 'walnuts', 'maple syrup'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '200g fat-free Greek yogurt + 25g walnuts',
    calories: 310,
    proteinG: 24,
    carbsG: 18,
    fatsG: 14
  },
  {
    name: 'Lean Grass-Fed Beef Sirloin with Green Beans',
    regions: ['Western'],
    dietaryTags: ['Halal', 'Kosher', 'None'],
    pantryKeywords: ['beef', 'olive oil', 'green beans', 'black pepper'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '180g sirloin steak + 150g steamed green beans',
    calories: 490,
    proteinG: 50,
    carbsG: 12,
    fatsG: 24
  },
  {
    name: 'Hearty Brown Lentil Stew with Whole Wheat Roll',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['lentils', 'bread', 'tomatoes', 'olive oil', 'thyme'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 large bowl brown lentil stew (150g lentils) + 1 roll',
    calories: 450,
    proteinG: 24,
    carbsG: 72,
    fatsG: 6
  },
  {
    name: 'Peanut Butter on Whole Grain Toast with Sliced Banana',
    regions: ['Western', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['bread', 'peanut butter', 'peanuts', 'banana'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '2 slices whole grain bread + 2 tbsp natural peanut butter',
    calories: 380,
    proteinG: 14,
    carbsG: 48,
    fatsG: 16
  },

  // --- LATIN AMERICA (Regional & Global) ---
  {
    name: 'Cuban Style Black Beans and Rice with Bell Peppers',
    regions: ['Latin_America', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['black beans', 'beans', 'rice', 'olive oil', 'bell pepper', 'cumin'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 generous plate (140g black beans + 140g white rice)',
    calories: 440,
    proteinG: 19,
    carbsG: 76,
    fatsG: 6
  },
  {
    name: 'Grilled Chicken Tinga with Brown Rice & Guacamole',
    regions: ['Latin_America'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['chicken', 'rice', 'avocado', 'tomatoes', 'cumin'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '180g shredded spiced chicken + 140g brown rice + avocado',
    calories: 540,
    proteinG: 48,
    carbsG: 48,
    fatsG: 14
  },
  {
    name: 'Huevos Rancheros with Warm Corn Tortillas',
    regions: ['Latin_America', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['eggs', 'corn', 'tortillas', 'tomatoes', 'chilies'],
    mealTypes: ['breakfast', 'dinner'],
    servingDescription: '2 fried eggs over 2 corn tortillas with tomato salsa',
    calories: 380,
    proteinG: 18,
    carbsG: 34,
    fatsG: 19
  },
  {
    name: 'Fresh Guacamole Dip with Baked Corn Tortilla Chips',
    regions: ['Latin_America', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['avocado', 'corn', 'tortillas', 'lemon', 'sea salt'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '1 cup fresh avocado dip + 40g baked corn chips',
    calories: 320,
    proteinG: 5,
    carbsG: 32,
    fatsG: 20
  },
  {
    name: 'Carne Asada Grilled Flank Steak with Black Beans',
    regions: ['Latin_America'],
    dietaryTags: ['Halal', 'Kosher', 'None'],
    pantryKeywords: ['beef', 'black beans', 'beans', 'lime', 'cumin'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '170g grilled marinated beef steak + 120g black beans',
    calories: 520,
    proteinG: 52,
    carbsG: 30,
    fatsG: 18
  },
  {
    name: 'Roasted Sweet Plantains with Black Beans',
    regions: ['Latin_America', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['plantains', 'black beans', 'beans', 'olive oil'],
    mealTypes: ['lunch', 'snack', 'dinner'],
    servingDescription: '1 large sliced roasted plantain + 100g spiced black beans',
    calories: 390,
    proteinG: 12,
    carbsG: 78,
    fatsG: 4
  },
  {
    name: 'Warm Corn Arepa with Melted Cheese & Avocado',
    regions: ['Latin_America'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['corn', 'cheese', 'milk', 'avocado'],
    mealTypes: ['breakfast', 'dinner'],
    servingDescription: '1 grilled white corn arepa + 40g cheese + avocado',
    calories: 390,
    proteinG: 16,
    carbsG: 44,
    fatsG: 16
  },
  {
    name: 'Tropical Chia Pudding with Mango & Coconut Milk',
    regions: ['Latin_America', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['chia seeds', 'coconut milk', 'mango'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '1 jar (35g chia seeds soaked in light coconut milk + mango)',
    calories: 280,
    proteinG: 7,
    carbsG: 34,
    fatsG: 13
  },

  // --- AFRICA (Regional & Global) ---
  {
    name: 'Moroccan Chickpea & Tomato Tagine with Couscous',
    regions: ['Africa', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['chickpeas', 'couscous', 'wheat', 'tomatoes', 'cumin', 'cinnamon'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 hearty bowl (140g chickpeas in spiced sauce + 120g couscous)',
    calories: 460,
    proteinG: 18,
    carbsG: 80,
    fatsG: 6
  },
  {
    name: 'West African Jollof Rice with Roasted Chicken Breast',
    regions: ['Africa'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['rice', 'chicken', 'tomatoes', 'bell pepper', 'thyme'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 plate (150g fragrant jollof rice + 180g roasted chicken)',
    calories: 550,
    proteinG: 48,
    carbsG: 58,
    fatsG: 12
  },
  {
    name: 'East African Coconut Spiced Lentils with Flatbread',
    regions: ['Africa', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['lentils', 'coconut milk', 'flour', 'bread', 'cumin'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 bowl green lentils in coconut cream + 1 flatbread',
    calories: 470,
    proteinG: 22,
    carbsG: 68,
    fatsG: 11
  },
  {
    name: 'Roasted African Groundnuts Peanuts & Dried Fruit',
    regions: ['Africa', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['peanuts', 'dates', 'raisins'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '50g roasted peanuts + 20g sun-dried dates',
    calories: 320,
    proteinG: 13,
    carbsG: 28,
    fatsG: 18
  },
  {
    name: 'Spiced Millet Porridge with Almonds & Dried Figs',
    regions: ['Africa', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['millet', 'almonds', 'figs', 'cinnamon'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '1 bowl warm cooked millet porridge with crushed almonds',
    calories: 340,
    proteinG: 11,
    carbsG: 58,
    fatsG: 7
  },
  {
    name: 'Egyptian Koshari Rice, Lentils & Macaroni Bowl',
    regions: ['Africa', 'Middle_East', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['rice', 'lentils', 'pasta', 'chickpeas', 'tomatoes', 'cumin'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 authentic bowl (rice, lentils, pasta, tomato cumin dressing)',
    calories: 490,
    proteinG: 20,
    carbsG: 88,
    fatsG: 6
  },
  {
    name: 'Nigerian Suya Spiced Chicken Skewers',
    regions: ['Africa'],
    dietaryTags: ['Halal', 'Hindu_No_Beef', 'None'],
    pantryKeywords: ['chicken', 'peanuts', 'paprika', 'chilies'],
    mealTypes: ['dinner', 'snack'],
    servingDescription: '180g lean chicken breast skewers rubbed in peanut suya spices',
    calories: 420,
    proteinG: 46,
    carbsG: 10,
    fatsG: 19
  },
  {
    name: 'Ghanaian Red Red (Spiced Black-Eyed Peas with Plantains)',
    regions: ['Africa', 'Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['black-eyed peas', 'beans', 'plantains', 'tomatoes', 'palm oil'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 bowl stewed black-eyed peas + 1 roasted plantain',
    calories: 460,
    proteinG: 18,
    carbsG: 82,
    fatsG: 7
  },

  // --- UNIVERSAL JAIN & VEGAN STAPLES (Guarantees every meal slot has >= 2 foods) ---
  {
    name: 'Steamed White Jasmine Rice with Golden Turmeric & Cumin',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['rice', 'jasmine rice', 'turmeric', 'cumin', 'olive oil'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '150g fluffy steamed jasmine rice with cumin and turmeric',
    calories: 310,
    proteinG: 6,
    carbsG: 66,
    fatsG: 3
  },
  {
    name: 'Steamed Quinoa Bowl with Sliced Avocado & Olive Oil',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['quinoa', 'avocado', 'olive oil', 'sea salt'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '140g cooked organic quinoa + half ripe avocado',
    calories: 410,
    proteinG: 12,
    carbsG: 50,
    fatsG: 18
  },
  {
    name: 'Crisp Toasted Rice Flakes (Poha) with Peanuts',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['rice flakes', 'peanuts', 'turmeric', 'lemon', 'mustard seeds'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '1 warm bowl roasted flattened rice flakes with peanuts',
    calories: 290,
    proteinG: 9,
    carbsG: 46,
    fatsG: 8
  },
  {
    name: 'Sweet Cinnamon Oatmeal with Golden Raisins',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['oats', 'raisins', 'cinnamon', 'flaxseed'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '70g rolled oats cooked in water with raisins and cinnamon',
    calories: 310,
    proteinG: 10,
    carbsG: 60,
    fatsG: 4
  },
  {
    name: 'Yellow Split Pea Dal with Steamed Rice',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['split peas', 'lentils', 'rice', 'turmeric', 'cumin'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '140g split pea dal + 130g steamed rice',
    calories: 420,
    proteinG: 19,
    carbsG: 74,
    fatsG: 4
  },
  {
    name: 'Firm Tofu Cubes with Tamari Soy Sauce & Sesame',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['tofu', 'soy sauce', 'sesame seeds', 'sesame oil'],
    mealTypes: ['breakfast', 'snack', 'lunch', 'dinner'],
    servingDescription: '180g steamed firm tofu cubes seasoned with sesame and tamari',
    calories: 260,
    proteinG: 24,
    carbsG: 8,
    fatsG: 14
  },
  {
    name: 'Whole Grain Flatbread with Sunflower Seed Butter',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['flour', 'bread', 'sunflower seeds'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '1 toasted flatbread + 2 tbsp sunflower butter',
    calories: 330,
    proteinG: 11,
    carbsG: 36,
    fatsG: 16
  },
  {
    name: 'Spiced Green Moong Sprout Salad with Lemon',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['moong sprouts', 'lentils', 'lemon', 'black pepper', 'cumin'],
    mealTypes: ['breakfast', 'snack', 'lunch'],
    servingDescription: '150g fresh sprouted green moong with lemon and cumin',
    calories: 210,
    proteinG: 16,
    carbsG: 32,
    fatsG: 2
  },
  {
    name: 'Baked Paprika Chickpeas Snack Bowl',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['chickpeas', 'olive oil', 'paprika', 'sea salt'],
    mealTypes: ['snack'],
    servingDescription: '80g crunchy oven-roasted chickpeas with sea salt',
    calories: 250,
    proteinG: 13,
    carbsG: 36,
    fatsG: 5
  },
  {
    name: 'Warm Banana & Crushed Walnut Porridge',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['oats', 'banana', 'walnuts', 'cinnamon'],
    mealTypes: ['breakfast', 'dinner'],
    servingDescription: '60g rolled oats + 1 sliced ripe banana + 20g walnuts',
    calories: 350,
    proteinG: 10,
    carbsG: 58,
    fatsG: 10
  },
  {
    name: 'Steamed Green Peas & Paneer with Cumin Basmati',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['paneer', 'milk', 'green peas', 'rice', 'basmati', 'cumin'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '100g paneer + 80g sweet green peas + 120g rice',
    calories: 460,
    proteinG: 24,
    carbsG: 54,
    fatsG: 16
  },
  {
    name: 'Crisp Apple Slices with Pure Almond Butter',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['apple', 'almond butter', 'almonds'],
    mealTypes: ['breakfast', 'snack'],
    servingDescription: '1 large crisp apple + 2 tbsp natural almond butter',
    calories: 280,
    proteinG: 7,
    carbsG: 34,
    fatsG: 15
  },
  {
    name: 'Toasted Sourdough Bread with Sliced Tomatoes & Olive Oil',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['bread', 'sourdough', 'tomatoes', 'olive oil'],
    mealTypes: ['breakfast', 'dinner'],
    servingDescription: '2 slices sourdough bread + fresh ripe tomatoes + 1 tbsp olive oil',
    calories: 310,
    proteinG: 8,
    carbsG: 44,
    fatsG: 12
  },
  {
    name: 'Steamed Broccoli, Green Beans & Toasted Sesame Brown Rice',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['rice', 'brown rice', 'broccoli', 'green beans', 'sesame seeds'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '150g brown rice + 150g steamed green vegetables',
    calories: 360,
    proteinG: 11,
    carbsG: 68,
    fatsG: 5
  },
  {
    name: 'Toasted Mixed Pumpkin & Sunflower Seeds',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['pumpkin seeds', 'sunflower seeds', 'sea salt'],
    mealTypes: ['snack'],
    servingDescription: '45g dry roasted pumpkin and sunflower seed kernels',
    calories: 250,
    proteinG: 11,
    carbsG: 8,
    fatsG: 20
  },
  {
    name: 'Red Lentil Soup with Diced Tomatoes & Cumin Flatbread',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['lentils', 'red lentils', 'bread', 'tomatoes', 'cumin'],
    mealTypes: ['lunch', 'dinner'],
    servingDescription: '1 warm bowl red lentil soup + 1 whole wheat flatbread',
    calories: 430,
    proteinG: 22,
    carbsG: 70,
    fatsG: 5
  },
  {
    name: 'Cucumber & Tomato Salad with Cold-Pressed Olive Oil',
    regions: ['Global'],
    dietaryTags: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'],
    pantryKeywords: ['cucumber', 'tomatoes', 'olive oil', 'lemon'],
    mealTypes: ['snack', 'dinner'],
    servingDescription: '1 fresh bowl sliced cucumbers & vine tomatoes with olive oil',
    calories: 160,
    proteinG: 3,
    carbsG: 12,
    fatsG: 12
  }
];

console.log('Total foods compiled:', foods.length);

// Strict Validation
const prohibitedVeganKeywords = ['dairy', 'milk', 'cheese', 'yogurt', 'paneer', 'ghee', 'butter', 'egg', 'meat', 'chicken', 'beef', 'lamb', 'pork', 'fish', 'tuna', 'salmon', 'honey'];
const prohibitedJainKeywords = ['onion', 'garlic', 'potato', 'ginger', 'carrot', 'sweet potato'];

for (const f of foods) {
  if (f.dietaryTags.includes('Vegan')) {
    for (const kw of f.pantryKeywords) {
      if (prohibitedVeganKeywords.includes(kw.toLowerCase())) {
        throw new Error(`Vegan violation in ${f.name}: prohibited keyword "${kw}"`);
      }
    }
  }
  if (f.dietaryTags.includes('Jain')) {
    for (const kw of f.pantryKeywords) {
      if (prohibitedJainKeywords.includes(kw.toLowerCase())) {
        throw new Error(`Jain violation in ${f.name}: prohibited root vegetable keyword "${kw}"`);
      }
    }
  }
}
console.log('✅ Passed strict Vegan and Jain keyword validation!');

// Matrix Coverage Verification
const regions = ['South_Asia', 'Middle_East', 'East_Asia', 'Western', 'Latin_America', 'Africa'];
const rules = ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Hindu_No_Beef', 'Jain', 'None'];
const slots = ['breakfast', 'lunch', 'snack', 'dinner'];

let failedCombinations = 0;
for (const r of regions) {
  for (const d of rules) {
    for (const m of slots) {
      const eligible = foods.filter((f) => {
        const regionMatch = f.regions.includes(r) || f.regions.includes('Global');
        const dietaryMatch = d === 'None' ? true : f.dietaryTags.includes(d);
        const slotMatch = f.mealTypes.includes(m);
        return regionMatch && dietaryMatch && slotMatch;
      });
      if (eligible.length < 2) {
        console.error(`❌ Deficit for (${r}, ${d}, ${m}): only ${eligible.length} foods`);
        failedCombinations++;
      }
    }
  }
}

if (failedCombinations === 0) {
  console.log(`✅ All ${regions.length * rules.length * slots.length} combinations have at least 2 matching foods!`);
} else {
  throw new Error(`${failedCombinations} combinations had fewer than 2 foods`);
}

fs.writeFileSync('server/src/seed/foodsData.json', JSON.stringify(foods, null, 2));
console.log('Saved to server/src/seed/foodsData.json');
