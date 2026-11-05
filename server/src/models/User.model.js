import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    name: { type: String, default: '' },

    // Biometrics Subdocument
    biometrics: {
      age: Number,
      gender: { type: String, enum: ['male', 'female'] },
      heightCm: Number,
      weightKg: Number,
      targetWeightKg: Number,
      bmi: Number,
      bmiCategory: String,
      bmr: Number,
      tdee: Number,
      targetCalories: Number,
    },

    // Preferences Subdocument
    preferences: {
      goal: { type: String, enum: ['weight_loss', 'lose_weight', 'maintenance', 'maintain', 'muscle_gain', 'build_muscle'] },
      fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
      equipment: [{ type: String, enum: ['none_home', 'dumbbells', 'resistance_bands', 'full_gym'] }],
      workoutDays: [{ type: String }],
      sessionDurationMins: { type: Number, default: 45 },
      countryRegion: {
        type: String,
        enum: ['South_Asia', 'Middle_East', 'East_Asia', 'Europe', 'North_America', 'Western', 'Latin_America', 'Africa', 'Global'],
      },
      country: String,
      religion: String,
      activityDaysPerWeek: Number,
      typicalFoods: [String],
      religionDietary: [String],
      pantryInventory: [String],
    },

    // Top-level aliases for direct access
    age: Number,
    gender: { type: String, enum: ['male', 'female'] },
    heightCm: Number,
    weightKg: Number,
    targetWeightKg: Number,
    bmi: Number,
    bmiCategory: String,
    goal: { type: String },
    fitnessLevel: { type: String },
    equipment: [{ type: String }],
    workoutDays: [{ type: String }],
    sessionDurationMins: { type: Number, default: 45 },

    bmr: Number,
    tdee: Number,
    calorieTarget: Number,
    targetCalories: Number,
    proteinTargetG: Number,
    carbsTargetG: Number,
    fatsTargetG: Number,

    // Streak count
    streakCount: { type: Number, default: 0 },
    currentStreakDays: { type: Number, default: 0 },
    lastWorkoutDate: String, // YYYY-MM-DD

    // Push notification
    fcmToken: String,
    onboarded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Virtual alias for user.profile
userSchema.virtual('profile').get(function () {
  return {
    weightKg: this.weightKg || this.biometrics?.weightKg,
    heightCm: this.heightCm || this.biometrics?.heightCm,
    age: this.age || this.biometrics?.age,
    gender: this.gender || this.biometrics?.gender,
    fitnessLevel: this.fitnessLevel || this.preferences?.fitnessLevel,
    targetCalories: this.calorieTarget || this.targetCalories || this.biometrics?.targetCalories,
    bmi: this.bmi || this.biometrics?.bmi,
    bmr: this.bmr || this.biometrics?.bmr,
    tdee: this.tdee || this.biometrics?.tdee,
  };
});

// Sync top-level and nested biometrics/preferences on save
userSchema.pre('save', function (next) {
  if (!this.streakCount && this.currentStreakDays) this.streakCount = this.currentStreakDays;
  if (!this.currentStreakDays && this.streakCount) this.currentStreakDays = this.streakCount;
  if (!this.targetCalories && this.calorieTarget) this.targetCalories = this.calorieTarget;
  if (!this.calorieTarget && this.targetCalories) this.calorieTarget = this.targetCalories;

  if (!this.biometrics) this.biometrics = {};
  if (this.age) this.biometrics.age = this.age;
  if (this.gender) this.biometrics.gender = this.gender;
  if (this.heightCm) this.biometrics.heightCm = this.heightCm;
  if (this.weightKg) this.biometrics.weightKg = this.weightKg;
  if (this.targetWeightKg) this.biometrics.targetWeightKg = this.targetWeightKg;
  if (this.bmi) this.biometrics.bmi = this.bmi;
  if (this.bmiCategory) this.biometrics.bmiCategory = this.bmiCategory;
  if (this.bmr) this.biometrics.bmr = this.bmr;
  if (this.tdee) this.biometrics.tdee = this.tdee;
  if (this.calorieTarget) this.biometrics.targetCalories = this.calorieTarget;

  next();
});

export default mongoose.model('User', userSchema);
