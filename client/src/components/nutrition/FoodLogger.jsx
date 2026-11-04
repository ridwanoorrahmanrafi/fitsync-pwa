import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchFoods, estimateFoodAI } from '../../api/client.js';
import { useOfflineSync } from '../../hooks/useOfflineSync.js';
import { Search, Plus, Wifi, Sparkles, Loader2 } from 'lucide-react';

export default function FoodLogger({ onLogged }) {
  const [query, setQuery] = useState('');
  const [custom, setCustom] = useState({ foodName: '', calories: '', proteinG: '', carbsG: '', fatsG: '' });
  const [isAiEstimating, setIsAiEstimating] = useState(false);
  const [aiError, setAiError] = useState('');
  const { enqueueMeal } = useOfflineSync();
  const queryClient = useQueryClient();

  const { data: foods = [] } = useQuery({
    queryKey: ['food-search', query],
    queryFn: () => searchFoods(query),
    enabled: query.length > 1,
  });

  const logMutation = useMutation({
    mutationFn: enqueueMeal,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['today-log'] });
      setCustom({ foodName: '', calories: '', proteinG: '', carbsG: '', fatsG: '' });
      setAiError('');
      onLogged?.(data);
    },
  });

  const handleLog = (entry) => logMutation.mutate(entry);

  const handleAiEstimate = async () => {
    if (!custom.foodName.trim()) return;
    setIsAiEstimating(true);
    setAiError('');
    try {
      const data = await estimateFoodAI(custom.foodName.trim());
      setCustom((prev) => ({
        ...prev,
        calories: String(data.calories || ''),
        proteinG: String(data.proteinG || ''),
        carbsG: String(data.carbsG || ''),
        fatsG: String(data.fatsG || ''),
      }));
    } catch {
      setAiError('AI estimate failed. Please enter values manually.');
    } finally {
      setIsAiEstimating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-9"
          placeholder="Search foods…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {foods.length > 0 && (
        <ul className="card divide-y divide-slate-700 max-h-48 overflow-y-auto">
          {foods.map((f) => (
            <li
              key={f._id}
              className="flex items-center justify-between py-2 px-1"
            >
              <div>
                <p className="font-medium text-sm">{f.name}</p>
                <p className="text-xs text-slate-400">{f.calories || f.caloriesPer100g} kcal</p>
              </div>
              <button
                className="btn-primary text-sm px-3 py-1.5"
                onClick={() =>
                  handleLog({
                    foodName: f.name,
                    calories: f.calories || f.caloriesPer100g,
                    proteinG: f.proteinG,
                    carbsG: f.carbsG,
                    fatsG: f.fatsG,
                  })
                }
              >
                <Plus size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Manual & AI-Assisted Entry */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-300">Custom Meal</h3>
          <button
            type="button"
            onClick={handleAiEstimate}
            disabled={!custom.foodName.trim() || isAiEstimating}
            className="flex items-center gap-1.5 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg transition disabled:opacity-40"
          >
            {isAiEstimating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
            AI Estimate
          </button>
        </div>

        <input
          className="input text-sm"
          placeholder="Food name (e.g. Chicken Shawarma Bowl)"
          value={custom.foodName}
          onChange={(e) => setCustom((p) => ({ ...p, foodName: e.target.value }))}
        />

        <div className="grid grid-cols-2 gap-2">
          {['calories', 'proteinG', 'carbsG', 'fatsG'].map((field) => (
            <input
              key={field}
              className="input text-sm"
              placeholder={field === 'calories' ? 'Calories (kcal)' : `${field.replace('G', '')} (g)`}
              value={custom[field]}
              onChange={(e) => setCustom((p) => ({ ...p, [field]: e.target.value }))}
              type="number"
            />
          ))}
        </div>

        {aiError && <p className="text-xs text-rose-400">{aiError}</p>}

        <button
          className="btn-primary w-full"
          disabled={!custom.foodName || !custom.calories || logMutation.isPending}
          onClick={() =>
            handleLog({
              foodName: custom.foodName,
              calories: Number(custom.calories),
              proteinG: Number(custom.proteinG) || 0,
              carbsG: Number(custom.carbsG) || 0,
              fatsG: Number(custom.fatsG) || 0,
            })
          }
        >
          {logMutation.isPending ? 'Logging…' : 'Log Meal'}
        </button>
        {!navigator.onLine && (
          <p className="text-xs text-yellow-400 flex items-center gap-1">
            <Wifi size={12} /> Offline — will sync when connected
          </p>
        )}
      </div>
    </div>
  );
}
