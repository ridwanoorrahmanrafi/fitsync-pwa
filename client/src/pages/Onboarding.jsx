import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { onboard } from '../api/client.js';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';

const REGIONS = [
  'South_Asia',
  'Middle_East',
  'East_Asia',
  'Western',
  'Europe',
  'North_America',
  'Latin_America',
  'Africa',
];

const DIETARY = [
  'Halal',
  'Kosher',
  'Vegetarian',
  'Vegan',
  'Jain',
  'Hindu_No_Beef',
  'Gluten_Free',
  'None',
];

const EQUIPMENT = ['none_home', 'dumbbells', 'resistance_bands', 'full_gym'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const STEP_LABELS = ['Biometrics', 'Goal', 'Training', 'Cuisine', 'Pantry'];

const initial = {
  name: '',
  age: '',
  gender: 'male',
  heightCm: '',
  weightKg: '',
  targetWeightKg: '',
  goal: 'weight_loss',
  fitnessLevel: 'beginner',
  equipment: ['none_home'],
  workoutDays: ['Mon', 'Wed', 'Fri'],
  sessionDurationMins: 45,
  countryRegion: 'Western',
  religionDietary: [],
  pantryInventory: [],
};

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold border transition-all min-h-[44px] capitalize
        ${
          active
            ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/20'
            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white'
        }`}
    >
      {active && <span className="mr-1">✓</span>}
      {label}
    </button>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initial);
  const [pantryInput, setPantryInput] = useState('');
  const navigate = useNavigate();

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const mutation = useMutation({
    mutationFn: () =>
      onboard({
        ...form,
        age: Number(form.age),
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        targetWeightKg: form.targetWeightKg ? Number(form.targetWeightKg) : undefined,
        sessionDurationMins: Number(form.sessionDurationMins),
      }),
    onSuccess: () => navigate('/dashboard', { replace: true }),
  });

  const steps = [
    // Step 0 — Biometrics
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Your Name</label>
          <input
            className="input"
            placeholder="Athlete Name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Age (years)</label>
          <input
            className="input"
            placeholder="e.g. 28"
            type="number"
            min={12}
            value={form.age}
            onChange={(e) => set('age', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label">Biological Sex (for Mifflin-St Jeor BMR)</label>
        <div className="grid grid-cols-2 gap-3">
          {['male', 'female'].map((g) => (
            <button
              key={g}
              type="button"
              className={`py-3 rounded-2xl font-bold border capitalize transition-all ${
                form.gender === g
                  ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
              onClick={() => set('gender', g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Height (cm)</label>
          <input
            className="input"
            placeholder="e.g. 175"
            type="number"
            value={form.heightCm}
            onChange={(e) => set('heightCm', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Current Weight (kg)</label>
          <input
            className="input"
            placeholder="e.g. 75"
            type="number"
            value={form.weightKg}
            onChange={(e) => set('weightKg', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Target Weight (kg)</label>
          <input
            className="input"
            placeholder="e.g. 70"
            type="number"
            value={form.targetWeightKg}
            onChange={(e) => set('targetWeightKg', e.target.value)}
          />
        </div>
      </div>
    </div>,

    // Step 1 — Goals & Level
    <div className="space-y-6">
      <div>
        <label className="label">Primary Fitness Goal</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            ['weight_loss', 'Weight Loss', 'Deficit (-500 kcal)'],
            ['maintenance', 'Maintenance', 'Balanced Energy (TDEE)'],
            ['muscle_gain', 'Muscle Gain', 'Surplus (+300 kcal)'],
          ].map(([val, label, sub]) => (
            <button
              key={val}
              type="button"
              className={`p-4 rounded-2xl text-left border transition-all ${
                form.goal === val
                  ? 'bg-brand-500/15 border-brand-500 text-white shadow-md'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
              }`}
              onClick={() => set('goal', val)}
            >
              <p className="font-bold text-sm text-white">{label}</p>
              <p className="text-xs text-slate-400 mt-1">{sub}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Experience Level</label>
        <div className="grid grid-cols-3 gap-3">
          {['beginner', 'intermediate', 'advanced'].map((l) => (
            <button
              key={l}
              type="button"
              className={`py-3 rounded-2xl text-xs sm:text-sm font-bold border capitalize transition-all ${
                form.fitnessLevel === l
                  ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
              onClick={() => set('fitnessLevel', l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 2 — Schedule & Equipment
    <div className="space-y-6">
      <div>
        <label className="label">Available Equipment</label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT.map((e) => (
            <Chip
              key={e}
              label={e.replace('_', ' ')}
              active={form.equipment.includes(e)}
              onClick={() => set('equipment', toggle(form.equipment, e))}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="label">Preferred Training Days</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => (
            <Chip
              key={d}
              label={d}
              active={form.workoutDays.includes(d)}
              onClick={() => set('workoutDays', toggle(form.workoutDays, d))}
            />
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          {form.workoutDays.length <= 3
            ? '1-3 days: Full Body Split'
            : form.workoutDays.length === 4
            ? '4 days: Upper / Lower Split'
            : '5-6 days: Push / Pull / Legs Split'}
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="label mb-0">Session Duration</label>
          <span className="text-sm font-bold text-brand-400">{form.sessionDurationMins} minutes</span>
        </div>
        <input
          className="w-full accent-brand-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          type="range"
          min={15}
          max={90}
          step={5}
          value={form.sessionDurationMins}
          onChange={(e) => set('sessionDurationMins', Number(e.target.value))}
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>15 min (quick)</span>
          <span>45 min (standard)</span>
          <span>90 min (extended)</span>
        </div>
      </div>
    </div>,

    // Step 3 — Cuisine & Religion
    <div className="space-y-6">
      <div>
        <label className="label">Your Region / Cultural Cuisine</label>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <Chip
              key={r}
              label={r.replace('_', ' ')}
              active={form.countryRegion === r}
              onClick={() => set('countryRegion', r)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="label">Religious & Ethical Dietary Laws</label>
        <div className="flex flex-wrap gap-2">
          {DIETARY.map((d) => (
            <Chip
              key={d}
              label={d.replace('_', ' ')}
              active={form.religionDietary.includes(d)}
              onClick={() => set('religionDietary', toggle(form.religionDietary, d))}
            />
          ))}
        </div>
      </div>
    </div>,

    // Step 4 — Pantry
    <div className="space-y-4">
      <p className="text-xs sm:text-sm text-slate-400">
        Add staple ingredients currently inside your kitchen. FitSync will prioritize them in your meal plan:
      </p>

      <div className="flex gap-2">
        <input
          className="input flex-1 text-sm"
          placeholder="e.g. chicken, oats, lentils, rice, eggs…"
          value={pantryInput}
          onChange={(e) => setPantryInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (pantryInput.trim()) {
                set('pantryInventory', [...form.pantryInventory, pantryInput.trim()]);
                setPantryInput('');
              }
            }
          }}
        />
        <button
          type="button"
          className="btn-primary px-5 text-sm"
          onClick={() => {
            if (pantryInput.trim()) {
              set('pantryInventory', [...form.pantryInventory, pantryInput.trim()]);
              setPantryInput('');
            }
          }}
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[60px] p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        {form.pantryInventory.length === 0 ? (
          <span className="text-xs text-slate-500 self-center">No pantry items added yet (optional).</span>
        ) : (
          form.pantryInventory.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-slate-200 text-xs border border-slate-700"
            >
              {item}
              <button
                type="button"
                className="text-slate-400 hover:text-rose-400"
                onClick={() => set('pantryInventory', form.pantryInventory.filter((x) => x !== item))}
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>
    </div>,
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles size={12} /> Personalized Onboarding
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Let's Build Your Routine</h1>
        <p className="text-xs sm:text-sm text-slate-400">Step {step + 1} of {steps.length} — {STEP_LABELS[step]}</p>
      </div>

      {/* Responsive Visual Stepper */}
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {STEP_LABELS.map((label, idx) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                idx < step
                  ? 'bg-emerald-400'
                  : idx === step
                  ? 'bg-brand-500 shadow-sm shadow-brand-500/50'
                  : 'bg-slate-800'
              }`}
            />
            <span
              className={`text-[10px] hidden sm:block font-medium ${
                idx === step ? 'text-brand-400' : 'text-slate-500'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Step Card */}
      <div className="card border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl bg-slate-900/90 backdrop-blur-sm space-y-6">
        {steps[step]}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 gap-3">
          {step > 0 ? (
            <button
              type="button"
              className="btn-outline flex items-center gap-1.5 text-xs sm:text-sm px-4 py-2.5"
              onClick={() => setStep((s) => s - 1)}
            >
              <ChevronLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < steps.length - 1 ? (
            <button
              type="button"
              className="btn-primary flex items-center gap-1.5 text-xs sm:text-sm px-6 py-2.5 font-bold shadow-md shadow-brand-500/20"
              onClick={() => setStep((s) => s + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary flex items-center gap-2 text-xs sm:text-sm px-6 py-2.5 font-black bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Generating…' : 'Generate My Plans 🚀'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
