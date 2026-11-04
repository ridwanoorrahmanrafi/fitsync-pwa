import mongoose from 'mongoose';

const burnTaskSchema = new mongoose.Schema(
  {
    taskTitle: String,
    taskDescription: String,
    exerciseName: String,
    durationMins: Number,
    caloriesToBurn: Number,
    targetCaloriesToBurn: Number,
    status: {
      type: String,
      enum: ['pending', 'completed', 'done', 'skipped'],
      default: 'pending',
    },
    emailSent: { type: Boolean, default: false },
    notifiedViaEmail: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const mealLogSchema = new mongoose.Schema(
  {
    foodName: String,
    calories: Number,
    proteinG: Number,
    carbsG: Number,
    fatsG: Number,
    loggedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const dailyLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD

    // Nutrition
    meals: [mealLogSchema],
    mealsEaten: [mealLogSchema],
    caloriesConsumed: { type: Number, default: 0 },
    totalCalories: { type: Number, default: 0 },
    totalProteinG: { type: Number, default: 0 },
    totalCarbsG: { type: Number, default: 0 },
    totalFatsG: { type: Number, default: 0 },
    waterMl: { type: Number, default: 0 },

    // Exercise & Burn
    workoutCompleted: { type: Boolean, default: false },
    caloriesBurned: { type: Number, default: 0 },
    burnTask: burnTaskSchema,
    extraBurnTasks: [burnTaskSchema],

    // Weight
    weightKg: Number,
    loggedWeightKg: Number,
  },
  { timestamps: true }
);

dailyLogSchema.pre('save', function (next) {
  if (!this.caloriesConsumed && this.totalCalories) this.caloriesConsumed = this.totalCalories;
  if (!this.totalCalories && this.caloriesConsumed) this.totalCalories = this.caloriesConsumed;
  if (!this.loggedWeightKg && this.weightKg) this.loggedWeightKg = this.weightKg;
  if (!this.weightKg && this.loggedWeightKg) this.weightKg = this.loggedWeightKg;
  if (!this.mealsEaten?.length && this.meals?.length) this.mealsEaten = this.meals;
  if (!this.meals?.length && this.mealsEaten?.length) this.meals = this.mealsEaten;
  next();
});

dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyLog', dailyLogSchema);
