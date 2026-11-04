import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    targetMuscle: {
      type: String,
      enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio_full', 'full_body'],
    },
    muscleGroups: [String],
    equipmentRequired: mongoose.Schema.Types.Mixed,
    equipment: mongoose.Schema.Types.Mixed,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    focusAreas: [{
      type: String,
      enum: ['full_body', 'upper', 'lower', 'push', 'pull', 'legs', 'core'],
    }],
    defaultSets: { type: Number, default: 3 },
    defaultWorkSeconds: { type: Number, default: 40 },
    defaultRestSeconds: { type: Number, default: 20 },
    sets: { type: Number },
    workSeconds: { type: Number },
    restSeconds: { type: Number },
    metValue: { type: Number, default: 5 },
    animationUrl: String,
    instructions: mongoose.Schema.Types.Mixed, // string or string array
  },
  { timestamps: true }
);

const TARGET_TO_FOCUS = {
  chest: ['upper', 'push', 'full_body'],
  back: ['upper', 'pull', 'full_body'],
  shoulders: ['upper', 'push', 'full_body'],
  arms: ['upper', 'push', 'pull', 'full_body'],
  legs: ['lower', 'legs', 'full_body'],
  core: ['core', 'full_body', 'upper', 'lower'],
  cardio_full: ['full_body', 'upper', 'lower', 'push', 'pull', 'legs'],
  full_body: ['full_body', 'upper', 'lower', 'push', 'pull', 'legs'],
};

function syncExerciseFields(doc) {
  if (doc.equipmentRequired && !doc.equipment) {
    doc.equipment = Array.isArray(doc.equipmentRequired) ? doc.equipmentRequired : [doc.equipmentRequired];
  } else if (doc.equipment && !doc.equipmentRequired) {
    doc.equipmentRequired = doc.equipment;
  }
  if (doc.defaultSets && !doc.sets) doc.sets = doc.defaultSets;
  if (!doc.defaultSets && doc.sets) doc.defaultSets = doc.sets;
  if (doc.defaultWorkSeconds && !doc.workSeconds) doc.workSeconds = doc.defaultWorkSeconds;
  if (!doc.defaultWorkSeconds && doc.workSeconds) doc.defaultWorkSeconds = doc.workSeconds;
  if (doc.defaultRestSeconds && !doc.restSeconds) doc.restSeconds = doc.defaultRestSeconds;
  if (!doc.defaultRestSeconds && doc.restSeconds) doc.defaultRestSeconds = doc.restSeconds;

  if (!doc.sets) doc.sets = doc.defaultSets || 3;
  if (!doc.workSeconds) doc.workSeconds = doc.defaultWorkSeconds || 40;
  if (!doc.restSeconds) doc.restSeconds = doc.defaultRestSeconds || 20;

  if ((!doc.focusAreas || !doc.focusAreas.length) && doc.targetMuscle) {
    doc.focusAreas = TARGET_TO_FOCUS[doc.targetMuscle] || [doc.targetMuscle];
  }
}

exerciseSchema.pre('validate', function (next) {
  syncExerciseFields(this);
  next();
});

exerciseSchema.pre('save', function (next) {
  syncExerciseFields(this);
  next();
});

exerciseSchema.pre('insertMany', function (next, docs) {
  if (Array.isArray(docs)) {
    docs.forEach(syncExerciseFields);
  }
  next();
});

export default mongoose.model('Exercise', exerciseSchema);
