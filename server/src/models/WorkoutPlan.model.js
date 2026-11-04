import mongoose from 'mongoose';

const exerciseEntrySchema = new mongoose.Schema(
  {
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    name: String,
    animationUrl: String,
    instructions: mongoose.Schema.Types.Mixed,
    sets: Number,
    reps: Number,
    durationSeconds: Number,
    workSeconds: Number,
    restSeconds: Number,
    metValue: Number,
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    dayOfWeek: String,
    focusArea: String,
    totalDurationMins: Number,
    estimatedDurationMins: Number,
    estimatedBurnKcal: Number,
    exercises: [exerciseEntrySchema],
  },
  { _id: false }
);

const workoutPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isActive: { type: Boolean, default: true },
    splitType: { type: String, enum: ['Full_Body', 'Upper_Lower', 'Push_Pull_Legs'] },
    days: [daySchema],
    schedule: [daySchema],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

workoutPlanSchema.pre('save', function (next) {
  if (!this.schedule?.length && this.days?.length) this.schedule = this.days;
  if (!this.days?.length && this.schedule?.length) this.days = this.schedule;
  next();
});

export default mongoose.model('WorkoutPlan', workoutPlanSchema);
