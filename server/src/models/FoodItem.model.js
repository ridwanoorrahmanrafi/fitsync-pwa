import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    localNames: [{ type: String }],
    regions: [{
      type: String,
      enum: ['South_Asia', 'Middle_East', 'East_Asia', 'Europe', 'North_America', 'Western', 'Latin_America', 'Africa', 'Global'],
      index: true,
    }],
    dietaryTags: [{
      type: String,
      enum: ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Jain', 'No_Beef', 'Hindu_No_Beef', 'No_Pork', 'Gluten_Free', 'None'],
      index: true,
    }],
    pantryKeywords: [{ type: String, lowercase: true }],
    mealTypes: [{ type: String, enum: ['breakfast', 'lunch', 'snack', 'dinner'] }],
    servingSizeGrams: { type: Number, default: 100 },
    servingDescription: { type: String, default: '1 medium bowl (100g)' },
    calories: { type: Number },
    proteinG: { type: Number },
    carbsG: { type: Number },
    fatsG: { type: Number },
    nutrition: {
      calories: { type: Number },
      proteinG: { type: Number },
      carbsG: { type: Number },
      fatsG: { type: Number },
      fiberG: { type: Number, default: 0 },
    },
    // Backwards compatibility convenience fields:
    caloriesPer100g: Number,
    keywords: [String],
    region: [String],
  },
  { timestamps: true }
);

function syncFoodFields(doc) {
  if (doc.calories != null && (!doc.nutrition || doc.nutrition.calories == null)) {
    doc.nutrition = {
      calories: doc.calories,
      proteinG: doc.proteinG || 0,
      carbsG: doc.carbsG || 0,
      fatsG: doc.fatsG || 0,
      fiberG: 0,
    };
  } else if (doc.nutrition?.calories != null && doc.calories == null) {
    doc.calories = doc.nutrition.calories;
    doc.proteinG = doc.nutrition.proteinG;
    doc.carbsG = doc.nutrition.carbsG;
    doc.fatsG = doc.nutrition.fatsG;
  }
  if (!doc.caloriesPer100g && doc.calories) {
    doc.caloriesPer100g = doc.calories;
  }
  if (!doc.regions?.length && doc.region?.length) doc.regions = doc.region;
  if (!doc.region?.length && doc.regions?.length) doc.region = doc.regions;
  if (!doc.pantryKeywords?.length && doc.keywords?.length) doc.pantryKeywords = doc.keywords;
  if (!doc.keywords?.length && doc.pantryKeywords?.length) doc.keywords = doc.pantryKeywords;
}

foodItemSchema.pre('validate', function (next) {
  syncFoodFields(this);
  next();
});

foodItemSchema.pre('save', function (next) {
  syncFoodFields(this);
  next();
});

foodItemSchema.pre('insertMany', function (next, docs) {
  if (Array.isArray(docs)) {
    docs.forEach(syncFoodFields);
  }
  next();
});

foodItemSchema.index({ mealTypes: 1 });
foodItemSchema.index({ pantryKeywords: 1 });

export default mongoose.model('FoodItem', foodItemSchema);
