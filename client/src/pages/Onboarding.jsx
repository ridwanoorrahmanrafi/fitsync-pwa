import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { onboard } from '../api/client.js';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  Dumbbell,
  Flame,
  Scale,
  Activity,
  Heart,
  Globe,
  Utensils,
  ShoppingBag,
} from 'lucide-react';

const COUNTRY_TO_REGION = {
  // South Asia
  'Bangladesh': 'South_Asia',
  'India': 'South_Asia',
  'Pakistan': 'South_Asia',
  'Nepal': 'South_Asia',
  'Sri Lanka': 'South_Asia',
  // Middle East
  'Saudi Arabia': 'Middle_East',
  'United Arab Emirates': 'Middle_East',
  'Egypt': 'Middle_East',
  'Turkey': 'Middle_East',
  'Jordan': 'Middle_East',
  'Lebanon': 'Middle_East',
  // East Asia
  'China': 'East_Asia',
  'Japan': 'East_Asia',
  'South Korea': 'East_Asia',
  'Vietnam': 'East_Asia',
  'Thailand': 'East_Asia',
  'Indonesia': 'East_Asia',
  // Western
  'United States': 'Western',
  'United Kingdom': 'Western',
  'Canada': 'Western',
  'Australia': 'Western',
  'Germany': 'Western',
  'France': 'Western',
  'Italy': 'Western',
  // Latin America
  'Mexico': 'Latin_America',
  'Brazil': 'Latin_America',
  'Argentina': 'Latin_America',
  'Colombia': 'Latin_America',
  // Africa
  'Nigeria': 'Africa',
  'Kenya': 'Africa',
  'South Africa': 'Africa',
  'Ghana': 'Africa',
  'Ethiopia': 'Africa',
};

const COUNTRIES = Object.keys(COUNTRY_TO_REGION).sort();

const REGIONS = [
  'South_Asia',
  'Middle_East',
  'East_Asia',
  'Western',
  'Latin_America',
  'Africa',
];

const RELIGIONS = [
  'None',
  'Islam',
  'Hinduism',
  'Christianity',
  'Judaism',
  'Buddhism',
  'Jainism',
  'Sikhism',
  'Other',
];

const EXTRA_RULES = ['Vegetarian', 'Vegan'];

const COMMON_DAILY_FOODS = [
  'rice',
  'roti',
  'bread',
  'dal',
  'eggs',
  'chicken',
  'fish',
  'milk',
  'oats',
  'paneer',
  'tofu',
  'potatoes',
  'pasta',
  'yogurt',
  'spinach',
  'beef',
  'beans',
  'olive oil',
];

const COMMON_PANTRY_ITEMS = [
  'rice',
  'oats',
  'eggs',
  'chicken',
  'olive oil',
  'salt',
  'black pepper',
  'turmeric',
  'lentils',
  'tuna',
  'spinach',
  'chickpeas',
  'garlic',
  'onions',
  'peanut butter',
];

const EQUIPMENT = ['none_home', 'dumbbells', 'resistance_bands', 'full_gym'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SESSION_LENGTHS = [20, 30, 45, 60];

const STEP_LABELS = [
  'About You',
  'Current Activity',
  'Workout Plan',
  'Origin & Dietary',
  'Daily Foods',
  'Kitchen Pantry',
];

const initial = {
  name: 'Alex Rivera',
  age: 26,
  gender: 'male',
  heightCm: 175,
  weightKg: 75,
  targetWeightKg: '',
  goal: 'lose_weight',
  activityDaysPerWeek: 3,
  fitnessLevel: 'beginner',
  equipment: ['none_home'],
  workoutDays: ['Mon', 'Wed', 'Fri'],
  sessionDurationMins: 45,
  country: 'United States',
  countryRegion: 'Western',
  religion: 'None',
  extraRules: [],
  typicalFoods: ['rice', 'chicken', 'eggs'],
  pantryInventory: ['rice', 'eggs', 'olive oil'],
};

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold border transition-all min-h-[42px] capitalize flex items-center gap-1.5
        ${
          active
            ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/25'
            : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:text-white'
        }`}
    >
      {active && <Check size={14} />}
      {label}
    </button>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initial);
  const [customPantryInput, setCustomPantryInput] = useState('');
  const [resultsData, setResultsData] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleCountryChange = (countryName) => {
    const region = COUNTRY_TO_REGION[countryName] || 'Western';
    setForm((p) => ({ ...p, country: countryName, countryRegion: region }));
  };

  const mutation = useMutation({
    mutationFn: () => {
      // Map goal synonyms
      const goal = form.goal === 'lose_weight' ? 'weight_loss' : form.goal === 'build_muscle' ? 'muscle_gain' : 'maintenance';
      return onboard({
        ...form,
        goal,
        age: Number(form.age),
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        targetWeightKg: form.targetWeightKg ? Number(form.targetWeightKg) : undefined,
        activityDaysPerWeek: Number(form.activityDaysPerWeek),
        sessionDurationMins: Number(form.sessionDurationMins),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['today-log'] });
      queryClient.invalidateQueries({ queryKey: ['today-workout'] });
      queryClient.invalidateQueries({ queryKey: ['diet-plan'] });
      setResultsData(data);
    },
  });

  // Results Screen after Plan Generation
  if (resultsData) {
    const metrics = resultsData.metrics || {};
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold">
            <Sparkles size={14} /> Plans Successfully Generated!
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Your Biometric Baseline</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Calculated according to the Mifflin-St Jeor equation and your personal activity level.
          </p>
        </div>

        <div className="card border border-slate-800 p-6 sm:p-8 rounded-3xl bg-slate-900/90 shadow-2xl space-y-6">
          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">BMI</p>
              <p className="text-2xl font-black text-white">{metrics.bmi || form.weightKg}</p>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">
                {metrics.bmiCategory || 'Normal'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">BMR</p>
              <p className="text-2xl font-black text-white">{metrics.bmr || 1700}</p>
              <span className="text-[10px] text-slate-500 font-medium">kcal at rest</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">TDEE</p>
              <p className="text-2xl font-black text-white">{metrics.tdee || 2400}</p>
              <span className="text-[10px] text-slate-500 font-medium">kcal burned/day</span>
            </div>

            <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 space-y-1">
              <p className="text-[11px] text-brand-300 uppercase font-semibold">Daily Target</p>
              <p className="text-2xl font-black text-brand-400">{metrics.targetCalories || 1900}</p>
              <span className="text-[10px] text-brand-300 font-medium">kcal/day</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Check size={16} className="text-emerald-400" /> Plan Summary:
            </div>
            <p>
              • <strong>Workout Split:</strong> Configured for <strong>{form.workoutDays.join(', ')}</strong> ({form.sessionDurationMins} min sessions) using <strong>{form.equipment.map((e) => e.replace('_', ' ')).join(', ')}</strong>.
            </p>
            <p>
              • <strong>Cultural Diet:</strong> Tailored to <strong>{form.countryRegion.replace('_', ' ')}</strong> cuisine with <strong>{form.religion !== 'None' ? form.religion : 'standard'}</strong> adherence and your selected pantry staples.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            className="btn-primary w-full py-4 text-sm sm:text-base font-black shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2"
          >
            See My Plan →
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    // Step 0 — About you (Biometrics)
    <div key="0" className="space-y-4">
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
          <label className="label">Age (13–100 years)</label>
          <input
            className="input"
            placeholder="e.g. 26"
            type="number"
            min={13}
            max={100}
            value={form.age}
            onChange={(e) => set('age', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label">Biological Sex (for Mifflin-St Jeor formula)</label>
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
          <label className="label">Target Weight (optional)</label>
          <input
            className="input"
            placeholder="e.g. 70"
            type="number"
            value={form.targetWeightKg}
            onChange={(e) => set('targetWeightKg', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label">Your Primary Goal</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            ['lose_weight', 'Lose Weight', 'Deficit (-500 kcal)'],
            ['maintain', 'Maintain', 'Balanced Energy (TDEE)'],
            ['build_muscle', 'Build Muscle', 'Surplus (+300 kcal)'],
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
    </div>,

    // Step 1 — Current Activity
    <div key="1" className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="label mb-0">How many days do you work out currently?</label>
          <span className="text-sm font-bold text-brand-400">{form.activityDaysPerWeek} days / week</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Determines your baseline activity multiplier (0 days: 1.2, 1-2: 1.35, 3-4: 1.5, 5-7: 1.7).
        </p>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => set('activityDaysPerWeek', num)}
              className={`flex-1 py-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all ${
                form.activityDaysPerWeek === num
                  ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Current Experience Level</label>
        <div className="grid grid-cols-3 gap-3">
          {['beginner', 'intermediate', 'advanced'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              className={`py-3.5 rounded-2xl text-xs sm:text-sm font-bold border capitalize transition-all ${
                form.fitnessLevel === lvl
                  ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
              onClick={() => set('fitnessLevel', lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 2 — Workout Plan Preferences
    <div key="2" className="space-y-6">
      <div>
        <label className="label">Available Equipment (Multi-select)</label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT.map((eq) => (
            <Chip
              key={eq}
              label={eq === 'none_home' ? 'Bodyweight Only (Home)' : eq.replace('_', ' ')}
              active={form.equipment.includes(eq)}
              onClick={() => set('equipment', toggle(form.equipment, eq))}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="label">Training Days (Mon–Sun)</label>
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
        <p className="text-[11px] text-slate-400 mt-2">
          Split assigned: {form.workoutDays.length <= 3 ? 'Full Body' : form.workoutDays.length === 4 ? 'Upper / Lower' : 'Push / Pull / Legs'}
        </p>
      </div>

      <div>
        <label className="label">Session Length</label>
        <div className="grid grid-cols-4 gap-2">
          {SESSION_LENGTHS.map((min) => (
            <button
              key={min}
              type="button"
              className={`py-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all ${
                form.sessionDurationMins === min
                  ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
              onClick={() => set('sessionDurationMins', min)}
            >
              {min} mins
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 3 — Origin & Religion (Cultural Cuisine)
    <div key="3" className="space-y-6">
      <div>
        <label className="label">Your Country</label>
        <select
          className="input capitalize"
          value={form.country}
          onChange={(e) => handleCountryChange(e.target.value)}
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c} className="bg-slate-900 text-white">
              {c}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-slate-400 mt-1">
          Auto-mapped cuisine region: <strong className="text-brand-300">{form.countryRegion.replace('_', ' ')}</strong>
        </p>
      </div>

      <div>
        <label className="label">Food Region (Cuisine Filter)</label>
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
        <label className="label">Religious Dietary Law</label>
        <div className="flex flex-wrap gap-2">
          {RELIGIONS.map((rel) => (
            <Chip
              key={rel}
              label={rel}
              active={form.religion === rel}
              onClick={() => set('religion', rel)}
            />
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Islam implies Halal · Judaism implies Kosher · Hinduism implies No Beef · Jainism implies Vegetarian & No Roots
        </p>
      </div>

      <div>
        <label className="label">Extra Dietary Restrictions</label>
        <div className="flex flex-wrap gap-2">
          {EXTRA_RULES.map((rule) => (
            <Chip
              key={rule}
              label={rule}
              active={form.extraRules.includes(rule)}
              onClick={() => set('extraRules', toggle(form.extraRules, rule))}
            />
          ))}
        </div>
      </div>
    </div>,

    // Step 4 — What you eat daily (Familiar Foods)
    <div key="4" className="space-y-4">
      <div>
        <label className="label">What do you eat daily? (Multi-select)</label>
        <p className="text-xs text-slate-400 mb-3">
          Meals using your familiar staples will be ranked higher in your weekly plan:
        </p>
        <div className="flex flex-wrap gap-2">
          {COMMON_DAILY_FOODS.map((food) => (
            <Chip
              key={food}
              label={food}
              active={form.typicalFoods.includes(food)}
              onClick={() => set('typicalFoods', toggle(form.typicalFoods, food))}
            />
          ))}
        </div>
      </div>
    </div>,

    // Step 5 — Kitchen Pantry (Highest Rank)
    <div key="5" className="space-y-4">
      <div>
        <label className="label">Your Kitchen Pantry (Optional)</label>
        <p className="text-xs text-slate-400 mb-3">
          Meals matching items in your kitchen right now will receive top priority:
        </p>
        <div className="flex flex-wrap gap-2">
          {COMMON_PANTRY_ITEMS.map((item) => (
            <Chip
              key={item}
              label={item}
              active={form.pantryInventory.includes(item)}
              onClick={() => set('pantryInventory', toggle(form.pantryInventory, item))}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-xs text-slate-400 font-medium">Add custom pantry ingredient:</label>
        <div className="flex gap-2">
          <input
            className="input flex-1 text-xs"
            placeholder="e.g. olive oil, black beans, quinoa…"
            value={customPantryInput}
            onChange={(e) => setCustomPantryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (customPantryInput.trim()) {
                  set('pantryInventory', [...form.pantryInventory, customPantryInput.trim().toLowerCase()]);
                  setCustomPantryInput('');
                }
              }
            }}
          />
          <button
            type="button"
            className="btn-primary text-xs px-4"
            onClick={() => {
              if (customPantryInput.trim()) {
                set('pantryInventory', [...form.pantryInventory, customPantryInput.trim().toLowerCase()]);
                setCustomPantryInput('');
              }
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 min-h-[50px]">
        {form.pantryInventory.length === 0 ? (
          <span className="text-xs text-slate-500 self-center">No pantry items selected.</span>
        ) : (
          form.pantryInventory.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-slate-200 text-xs border border-slate-700 capitalize"
            >
              {item}
              <button
                type="button"
                className="text-slate-400 hover:text-rose-400 font-bold"
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
          <Sparkles size={12} /> Personalized Onboarding Wizard
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Let's Build Your Routine</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Step {step + 1} of {steps.length} — {STEP_LABELS[step]}
        </p>
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
              className={`text-[10px] hidden sm:block font-medium truncate max-w-[80px] text-center ${
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
              {mutation.isPending ? 'Generating Plans…' : 'Generate My Plans 🚀'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
