import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { getDietPlan, swapMeal, getMe, updatePantry, generateDiet } from '../api/client.js';
import FoodLogger from '../components/nutrition/FoodLogger.jsx';
import { RefreshCw, Leaf, Plus, Sparkles, ChevronDown, ChevronUp, Globe2, ShieldCheck, Flame } from 'lucide-react';

const MEAL_LABELS = {
  breakfast: '🌅 Breakfast (25%)',
  lunch: '☀️ Lunch (35%)',
  snack: '🍎 Snack (15%)',
  dinner: '🌙 Dinner (25%)',
};

const COMMON_PANTRY_ITEMS = [
  'rice', 'lentils', 'eggs', 'chicken', 'oats', 'milk',
  'spinach', 'potatoes', 'paneer', 'beans', 'bread', 'yogurt',
  'tomatoes', 'onions', 'garlic', 'peanut butter', 'olive oil'
];

function MealCard({ mealType, meal, onSwap, swapping }) {
  if (!meal) {
    return (
      <div className="card border border-dashed border-slate-800 text-center py-8 p-4 flex flex-col justify-center items-center h-full">
        <p className="text-slate-400 text-xs">No food matched your dietary rules for {mealType}.</p>
      </div>
    );
  }

  return (
    <div className="card space-y-3 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-xs tracking-wider uppercase text-slate-300">
            {MEAL_LABELS[mealType]}
          </h3>
          {meal.isFromPantry && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <Leaf size={11} /> Pantry
            </span>
          )}
        </div>
        <p className="font-black text-base text-white leading-snug">{meal.name}</p>
        <p className="text-xs text-slate-400 leading-relaxed">{meal.portionDescription}</p>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div className="grid grid-cols-4 gap-1 text-center bg-slate-900/80 py-1.5 px-2 rounded-xl border border-slate-800">
          <div>
            <p className="font-bold text-xs text-brand-400">{meal.calories}</p>
            <p className="text-[9px] text-slate-500">kcal</p>
          </div>
          <div>
            <p className="font-medium text-xs text-slate-200">{meal.proteinG}g</p>
            <p className="text-[9px] text-slate-500">Prot</p>
          </div>
          <div>
            <p className="font-medium text-xs text-slate-200">{meal.carbsG}g</p>
            <p className="text-[9px] text-slate-500">Carb</p>
          </div>
          <div>
            <p className="font-medium text-xs text-slate-200">{meal.fatsG}g</p>
            <p className="text-[9px] text-slate-500">Fat</p>
          </div>
        </div>

        <button
          className="w-full flex items-center justify-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors py-2 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800 font-semibold"
          onClick={onSwap}
          disabled={swapping}
        >
          <RefreshCw size={12} className={swapping ? 'animate-spin' : ''} />
          {swapping ? 'Swapping…' : 'Swap Meal'}
        </button>
      </div>
    </div>
  );
}

export default function DietPlanPage() {
  const queryClient = useQueryClient();
  const [swappingType, setSwappingType] = useState(null);
  const [showLogger, setShowLogger] = useState(false);
  const [showPantryDrawer, setShowPantryDrawer] = useState(true);
  const [customPantryItem, setCustomPantryItem] = useState('');

  const { data: user, isLoading: isUserLoading } = useQuery({ queryKey: ['user'], queryFn: getMe });
  const { data: plan, isLoading: isPlanLoading } = useQuery({
    queryKey: ['diet-plan'],
    queryFn: getDietPlan,
    enabled: !!user?.onboarded,
  });

  const swapMutation = useMutation({
    mutationFn: swapMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diet-plan'] });
      setSwappingType(null);
    },
    onError: () => setSwappingType(null),
  });

  const pantryMutation = useMutation({
    mutationFn: updatePantry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const regenMutation = useMutation({
    mutationFn: generateDiet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diet-plan'] });
    },
  });

  const handleSwap = (mealType) => {
    setSwappingType(mealType);
    swapMutation.mutate(mealType);
  };

  const userPantry = user?.preferences?.pantryInventory || [];

  const togglePantryItem = (item) => {
    const lower = item.toLowerCase();
    const updated = userPantry.includes(lower)
      ? userPantry.filter((i) => i !== lower)
      : [...userPantry, lower];
    pantryMutation.mutate(updated);
  };

  const addCustomPantry = () => {
    if (!customPantryItem.trim()) return;
    const lower = customPantryItem.trim().toLowerCase();
    if (!userPantry.includes(lower)) {
      pantryMutation.mutate([...userPantry, lower]);
    }
    setCustomPantryItem('');
  };

  if (isUserLoading || (user?.onboarded && isPlanLoading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.onboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  const meals = plan?.meals || {};

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 p-5 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Cultural Meal Plan</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
            <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
              <Globe2 size={12} className="text-brand-400" />
              {user?.preferences?.countryRegion?.replace('_', ' ') || 'Global'}
            </span>
            {user?.preferences?.religionDietary?.map((tag) => (
              <span key={tag} className="flex items-center gap-1 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700 text-slate-300">
                <ShieldCheck size={12} className="text-emerald-400" /> {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.calorieTarget && (
            <div className="flex items-center gap-2 bg-slate-800 px-3.5 py-2 rounded-2xl border border-slate-700">
              <Flame size={16} className="text-brand-400" />
              <div className="text-left text-xs">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Daily Budget</p>
                <p className="font-bold text-white">{user.calorieTarget} kcal</p>
              </div>
            </div>
          )}

          <button
            className="btn-primary text-xs sm:text-sm px-4 py-2.5 flex items-center gap-2 shadow-md shadow-brand-500/20"
            onClick={() => regenMutation.mutate()}
            disabled={regenMutation.isPending}
            title="Regenerate whole plan"
          >
            <Sparkles size={14} className={regenMutation.isPending ? 'animate-spin' : ''} />
            {regenMutation.isPending ? 'Building…' : 'Regenerate Plan'}
          </button>
        </div>
      </div>

      {/* 4-Meal Responsive Grid: 1 col on mobile, 2 col on tablet, 4 col on desktop */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Today's Adapted Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.keys(MEAL_LABELS).map((mealType) => (
            <MealCard
              key={mealType}
              mealType={mealType}
              meal={meals[mealType]}
              swapping={swappingType === mealType}
              onSwap={() => handleSwap(mealType)}
            />
          ))}
        </div>
      </div>

      {/* 2-Column Responsive Layout for Pantry Manager and Food Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pantry Inventory Manager (7 cols on lg) */}
        <div className="lg:col-span-7 card border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm sm:text-base flex items-center gap-2 text-emerald-400">
              <Leaf size={18} /> Kitchen Pantry Staples ({userPantry.length} items active)
            </h2>
            <button
              className="text-xs text-slate-400 hover:text-white"
              onClick={() => setShowPantryDrawer((v) => !v)}
            >
              {showPantryDrawer ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {showPantryDrawer && (
            <div className="space-y-3.5 pt-1">
              <p className="text-xs text-slate-400">
                Click ingredients you currently have at home. The diet generator automatically prioritizes them in recipes:
              </p>

              <div className="flex flex-wrap gap-2">
                {COMMON_PANTRY_ITEMS.map((item) => {
                  const active = userPantry.includes(item);
                  return (
                    <button
                      key={item}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-all capitalize font-medium ${
                        active
                          ? 'bg-emerald-600/90 border-emerald-500 text-white shadow-sm shadow-emerald-600/20'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                      onClick={() => togglePantryItem(item)}
                    >
                      {active ? '✓ ' : '+ '}
                      {item}
                    </button>
                  );
                })}
              </div>

              {/* Custom Pantry Input */}
              <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                <input
                  className="input text-xs py-2"
                  placeholder="Add custom ingredient (e.g. tofu, salmon, quinoa)…"
                  value={customPantryItem}
                  onChange={(e) => setCustomPantryItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomPantry()}
                />
                <button
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 whitespace-nowrap"
                  onClick={addCustomPantry}
                >
                  <Plus size={14} /> Add to Pantry
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Food Logger with AI (5 cols on lg) */}
        <div className="lg:col-span-5 card border border-slate-800 p-5 space-y-3">
          <button
            className="w-full text-left font-semibold text-sm flex items-center justify-between text-slate-200"
            onClick={() => setShowLogger((v) => !v)}
          >
            <span className="flex items-center gap-2">
              <Flame size={18} className="text-brand-500" /> Log Meal Eaten
            </span>
            <span className="text-xs text-brand-400 font-medium">
              {showLogger ? 'Hide ▲' : 'Open Logger ▼'}
            </span>
          </button>
          {showLogger && <FoodLogger onLogged={() => setShowLogger(false)} />}
        </div>
      </div>
    </div>
  );
}
