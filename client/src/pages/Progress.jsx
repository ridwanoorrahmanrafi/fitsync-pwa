import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getProgress, getMe } from '../api/client.js';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar, CartesianGrid,
} from 'recharts';
import { TrendingDown, Flame, Droplets, Trophy, Calendar, Scale } from 'lucide-react';

const RANGES = ['7d', '14d', '30d'];

/** Build a simple streak calendar from progress logs */
function StreakCalendar({ logs }) {
  const dateSet = new Set(logs.filter((l) => l.workoutCompleted).map((l) => l.date));
  const today = new Date();
  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (34 - i));
    const str = d.toISOString().slice(0, 10);
    return { str, done: dateSet.has(str) };
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-2">
        {cells.map(({ str, done }) => (
          <div
            key={str}
            title={str}
            className={`aspect-square rounded-xl transition-all flex items-center justify-center text-[10px] font-bold ${
              done
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
                : 'bg-slate-800/80 text-slate-500 border border-slate-800'
            }`}
          >
            {str.slice(8)}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-brand-500 inline-block" /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-slate-800 inline-block" /> Rest day
        </span>
      </div>
    </div>
  );
}

const tooltipStyle = {
  contentStyle: { backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 16, padding: '10px 14px' },
  labelStyle: { color: '#94a3b8', fontSize: 12, marginBottom: 4 },
  itemStyle: { fontSize: 13, fontWeight: 600 },
};

export default function Progress() {
  const navigate = useNavigate();
  const [range, setRange] = useState('30d');

  const { data: user, isLoading: isUserLoading } = useQuery({ queryKey: ['user'], queryFn: getMe });
  const { data: logs = [], isLoading: isLogsLoading } = useQuery({
    queryKey: ['progress', range],
    queryFn: () => getProgress(range),
    enabled: !!user?.onboarded,
  });

  if (isUserLoading || (user?.onboarded && isLogsLoading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.onboarded) {
    navigate('/onboarding', { replace: true });
    return null;
  }

  const calorieData = logs.map((l) => ({ date: l.date.slice(5), kcal: l.totalCalories, target: user?.calorieTarget }));
  const weightData = logs.filter((l) => l.weightKg).map((l) => ({ date: l.date.slice(5), weight: l.weightKg }));
  const waterData = logs.map((l) => ({ date: l.date.slice(5), ml: l.waterMl || 0 }));

  const avgCalories = logs.length ? Math.round(logs.reduce((s, l) => s + (l.totalCalories || 0), 0) / logs.length) : 0;
  const workoutsLogged = logs.filter((l) => l.workoutCompleted).length;
  const avgWater = logs.length ? Math.round(logs.reduce((s, l) => s + (l.waterMl || 0), 0) / logs.length) : 0;
  const latestWeight = weightData.length ? weightData[weightData.length - 1].weight : user?.weightKg || 70;

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 p-5 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Fitness Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your biometrics, calorie adherence, and workout streaks over time.
          </p>
        </div>

        {/* Range Selector Pill */}
        <div className="flex bg-slate-800/90 p-1 rounded-2xl border border-slate-700 w-fit">
          {RANGES.map((r) => (
            <button
              key={r}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                range === r
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setRange(r)}
            >
              Last {r}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Metric KPI Cards (2 cols on mobile, 4 cols on tablet/desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card border border-slate-800 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Flame size={14} className="text-orange-400" /> Avg Intake
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">{avgCalories}</p>
          <p className="text-[11px] text-slate-400">kcal / day</p>
        </div>

        <div className="card border border-slate-800 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Trophy size={14} className="text-emerald-400" /> Workouts
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">{workoutsLogged}</p>
          <p className="text-[11px] text-slate-400">completed</p>
        </div>

        <div className="card border border-slate-800 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Scale size={14} className="text-amber-400" /> Latest Weight
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">{latestWeight}</p>
          <p className="text-[11px] text-slate-400">kg recorded</p>
        </div>

        <div className="card border border-slate-800 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Droplets size={14} className="text-blue-400" /> Avg Water
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">{avgWater}</p>
          <p className="text-[11px] text-slate-400">ml / day</p>
        </div>
      </div>

      {/* Row 1 Charts: Side-by-Side Responsive Grid on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Trend Chart */}
        <div className="card border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-2 text-slate-200">
              <Flame size={16} className="text-brand-500" /> Daily Calories vs Target
            </h3>
            <span className="text-xs text-slate-400">Target: {user?.calorieTarget || 2000} kcal</span>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calorieData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="kcal"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10b981' }}
                  name="Calories Consumed"
                />
                {user?.calorieTarget && (
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Calorie Goal"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Trend Chart */}
        <div className="card border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-2 text-slate-200">
              <Scale size={16} className="text-amber-400" /> Body Weight Progression
            </h3>
            <span className="text-xs text-slate-400">Target: {user?.targetWeightKg || user?.weightKg} kg</span>
          </div>

          <div className="w-full h-64 pt-2">
            {weightData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={['auto', 'auto']} />
                  <Tooltip {...tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#38bdf8' }}
                    name="Weight (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Log weight check-ins on the Dashboard to see your curve.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Hydration & Workout Streak Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Intake History */}
        <div className="card border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-2 text-slate-200">
              <Droplets size={16} className="text-blue-400" /> Daily Water Intake
            </h3>
            <span className="text-xs text-slate-400">Goal: 2500 ml</span>
          </div>

          <div className="w-full h-56 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="ml" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Water (ml)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workout Streak Calendar */}
        <div className="card border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-2 text-slate-200">
              <Calendar size={16} className="text-brand-400" /> Workout Consistency (Last 35 Days)
            </h3>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {workoutsLogged} Sessions Completed
            </span>
          </div>

          <StreakCalendar logs={logs} />
        </div>
      </div>
    </div>
  );
}
