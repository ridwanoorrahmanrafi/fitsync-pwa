import mongoose from 'mongoose';

const mealSlotSchema = new mongoose.Schema(
  {
    name: String,
    portionDescription: String,
    calories: Number,
    proteinG: Number,
    carbsG: Number,
    fatsG: Number,
    isFromPantry: Boolean,
  },
  { _id: false }
);

const dietPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    meals: {
      breakfast: mealSlotSchema,
      lunch: mealSlotSchema,
      snack: mealSlotSchema,
      dinner: mealSlotSchema,
    },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('DietPlan', dietPlanSchema);

