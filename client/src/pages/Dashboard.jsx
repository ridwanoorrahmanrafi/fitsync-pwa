import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getMe, getTodayLog, getWorkoutToday, logWeight, updateBurnTask } from '../api/client.js';
import CalorieRing from '../components/nutrition/CalorieRing.jsx';
import WaterTracker from '../components/nutrition/WaterTracker.jsx';
import FoodLogger from '../components/nutrition/FoodLogger.jsx';
import RingTimer from '../components/workout/RingTimer.jsx';
import { useBeep } from '../hooks/useBeep.js';
import { useWakeLock } from '../hooks/useWakeLock.js';
import { Flame, Zap, CheckCircle2, Dumbbell, Trophy, Scale, Timer, X, Play, Pause, Utensils } from 'lucide-react';

const DAY_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const beep = useBeep();
  useWakeLock();

  const [weightInput, setWeightInput] = useState('');
  const [showLogger, setShowLogger] = useState(false);
  const [activeBurnTimer, setActiveBurnTimer] = useState(null);

  const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery({
    queryKey: ['user'],
    queryFn: getMe,
    retry: 1,
  });
  const { data: log } = useQuery({
    queryKey: ['today-log'],
    queryFn: getTodayLog,
    refetchInterval: 30000,
    enabled: !!user?.onboarded,
  });
  const todayKey = DAY_MAP[new Date().getDay()];
  const { data: todayWorkout } = useQuery({
    queryKey: ['today-workout', todayKey],
    queryFn: () => getWorkoutToday(todayKey),
    enabled: !!user?.onboarded,
  });

  const weightMutation = useMutation({
    mutationFn: logWeight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-log'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setWeightInput('');
    },
  });

  const burnMutation = useMutation({
    mutationFn: ({ id, status }) => updateBurnTask(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-log'] });
      setActiveBurnTimer(null);
    },
  });

  // Burn Timer countdown effect
  useEffect(() => {
    if (!activeBurnTimer || activeBurnTimer.isPaused) return;

    const interval = setInterval(() => {
      setActiveBurnTimer((prev) => {
        if (!prev) return null;
        if (prev.secondsLeft <= 1) {
          beep(880, 400);
          burnMutation.mutate({ id: log._id, status: 'done' });
          return null;
        }
        if (prev.secondsLeft <= 4) beep(440, 80);
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeBurnTimer, log, burnMutation, beep]);

  if (isUserLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isUserError || !user?.onboarded) {
    navigate('/onboarding', { replace: true });
    return null;
  }

  const consumed = log?.totalCalories || 0;
  const target = user.calorieTarget || 2000;
  const burned = (log?.workoutCompleted ? (todayWorkout?.estimatedBurnKcal || 250) : 0) +
    (log?.burnTask?.status === 'done' ? (log.burnTask.caloriesToBurn || 0) : 0);
  const burnTask = log?.burnTask;
  const streak = user.currentStreakDays || user.streakCount || 0;

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 p-5 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Good {getTimeOfDay()}, {user.name || 'Athlete'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · Ready for today's targets?
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-2xl px-3.5 py-1.5 shadow-sm">
              <Trophy size={16} className="text-orange-400" />
              <span className="text-xs font-bold text-orange-300">{streak}-Day Streak</span>
            </div>
          )}

          {user.bmi && (
            <div className="bg-slate-800 px-3.5 py-1.5 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">BMI</p>
              <p className="text-xs font-bold text-slate-200">
                {user.bmi} <span className="text-slate-400 font-normal">({user.bmiCategory || 'Normal'})</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Grid: Left Column (Nutrition & Balance) | Right Column (Routine & Logging) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Nutrition / Balance Boost / Water / Weight) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Calorie Balance Card */}
          <div className="card border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm sm:text-base flex items-center gap-2 text-slate-200">
                <Flame size={18} className="text-brand-500" /> Daily Caloric Balance
              </h2>
              <span className="text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                Target: {target} kcal
              </span>
            </div>

            <div className="flex justify-center py-2">
              <CalorieRing consumed={consumed} target={target} burned={burned} />
            </div>

            {/* Macro Breakdown */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-700/60 text-center">
              {[
                ['Protein', log?.totalProteinG || 0, user.proteinTargetG, 'g'],
                ['Carbs', log?.totalCarbsG || 0, user.carbsTargetG, 'g'],
                ['Fats', log?.totalFatsG || 0, user.fatsTargetG, 'g'],
              ].map(([label, val, tgt, unit]) => (
                <div key={label} className="bg-slate-900/80 py-2.5 px-3 rounded-2xl border border-slate-800/80">
                  <p className="text-base sm:text-lg font-black text-white">
                    {Math.round(val)}
                    <span className="text-xs text-slate-400 font-normal ml-0.5">{unit}</span>
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {label} ({tgt}{unit})
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Burn Task Banner */}
          {burnTask && burnTask.status === 'pending' && (
            <div className="card border-2 border-orange-500/50 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950/40 p-5 rounded-3xl space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-orange-500/20 rounded-2xl text-orange-400">
                    <Zap size={20} />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-orange-300">⚡ Optional Balance Boost</h3>
                    <p className="text-xs text-slate-400">Energy surplus detected</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                  +{burnTask.caloriesToBurn} kcal
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                A quick <strong>{burnTask.durationMins} mins of {burnTask.exerciseName}</strong> balances your energy intake. This is completely optional — rest is equally valuable.
              </p>

              <div className="flex gap-3 pt-1">
                <button
                  className="btn-primary flex-1 text-xs sm:text-sm py-2.5 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20"
                  onClick={() =>
                    setActiveBurnTimer({
                      durationMins: burnTask.durationMins,
                      exerciseName: burnTask.exerciseName,
                      secondsLeft: burnTask.durationMins * 60,
                      totalSeconds: burnTask.durationMins * 60,
                      isPaused: false,
                    })
                  }
                >
                  <Timer size={16} /> Start Burn Timer
                </button>
                <button
                  className="btn-outline flex-1 text-xs sm:text-sm py-2.5"
                  onClick={() => burnMutation.mutate({ id: log._id, status: 'skipped' })}
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {/* Water Tracker & Weight Logger Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WaterTracker waterMl={log?.waterMl || 0} />

            <div className="card border border-slate-800 p-4 space-y-3 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Scale size={18} className="text-slate-400" />
                <h3 className="font-semibold text-sm text-slate-200">Track Body Weight</h3>
              </div>
              <p className="text-xs text-slate-400">Log weigh-in to keep target calories accurate.</p>
              <div className="flex gap-2">
                <input
                  className="input text-xs py-2 flex-1"
                  type="number"
                  step="0.1"
                  placeholder={`Current: ${user.weightKg} kg`}
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                />
                <button
                  className="btn-primary text-xs px-4 py-2 font-semibold"
                  disabled={!weightInput || weightMutation.isPending}
                  onClick={() => weightMutation.mutate(Number(weightInput))}
                >
                  Log
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Workout Routine & Food Logging) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Today's Workout Routine Card */}
          {todayWorkout ? (
            <div className="card border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-brand-500/10 rounded-2xl text-brand-400">
                    <Dumbbell size={20} />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-200">Today's Workout</h3>
                    <p className="text-xs text-slate-400 capitalize">
                      {todayWorkout.focusArea?.replace('_', ' ')} · {todayWorkout.totalDurationMins} mins
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  ~{todayWorkout.estimatedBurnKcal || 250} kcal
                </span>
              </div>

              {/* Routine Exercises list preview */}
              {todayWorkout.exercises && todayWorkout.exercises.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Planned Exercises ({todayWorkout.exercises.length})</p>
                  <ul className="divide-y divide-slate-800/80 bg-slate-900/50 rounded-2xl p-2 border border-slate-800/60 max-h-48 overflow-y-auto">
                    {todayWorkout.exercises.slice(0, 5).map((ex, idx) => (
                      <li key={idx} className="flex items-center justify-between py-1.5 px-2 text-xs">
                        <span className="font-medium text-slate-300">{ex.name}</span>
                        <span className="text-slate-500">{ex.sets || 3} sets × {ex.workSeconds || 40}s</span>
                      </li>
                    ))}
                    {todayWorkout.exercises.length > 5 && (
                      <li className="text-[11px] text-center text-slate-500 py-1">
                        + {todayWorkout.exercises.length - 5} more exercises
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {log?.workoutCompleted ? (
                <div className="flex items-center justify-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-3 px-4 rounded-2xl">
                  <CheckCircle2 size={18} />
                  <span className="text-xs sm:text-sm font-bold">Session Completed Today! Great job!</span>
                </div>
              ) : (
                <button
                  className="btn-primary w-full text-xs sm:text-sm py-3.5 font-bold shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
                  onClick={() => navigate('/workout')}
                >
                  <Play size={16} fill="currentColor" /> Launch Workout Player
                </button>
              )}
            </div>
          ) : (
            <div className="card text-slate-400 text-xs sm:text-sm text-center py-8 border border-dashed border-slate-800 rounded-3xl">
              <Dumbbell size={32} className="mx-auto mb-2 text-slate-600" />
              No workout scheduled for today — enjoy your rest & recovery!
            </div>
          )}

          {/* Meals Logged Today List */}
          {log?.meals && log.meals.length > 0 && (
            <div className="card border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils size={16} className="text-brand-400" />
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-200">Meals Logged ({log.meals.length})</h3>
                </div>
                <span className="text-xs text-brand-400 font-bold">{log.totalCalories} kcal</span>
              </div>
              <ul className="divide-y divide-slate-800 max-h-48 overflow-y-auto">
                {log.meals.map((m, idx) => (
                  <li key={idx} className="flex items-center justify-between py-2 text-xs">
                    <div>
                      <p className="font-medium text-slate-200">{m.foodName}</p>
                      <p className="text-[10px] text-slate-400">{m.proteinG}g P · {m.carbsG}g C · {m.fatsG}g F</p>
                    </div>
                    <span className="font-bold text-slate-300">{m.calories} kcal</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Food Logger Card with Gemini AI */}
          <div className="card border border-slate-800 p-5 space-y-3">
            <button
              className="w-full text-left font-semibold text-sm flex items-center justify-between text-slate-200"
              onClick={() => setShowLogger((v) => !v)}
            >
              <span className="flex items-center gap-2">
                <Flame size={18} className="text-brand-500" /> Quick Food Logger & AI
              </span>
              <span className="text-xs text-brand-400 font-medium">
                {showLogger ? 'Hide ▲' : 'Open Logger ▼'}
              </span>
            </button>
            {showLogger && <FoodLogger onLogged={() => setShowLogger(false)} />}
          </div>
        </div>
      </div>

      {/* Live Burn Timer Modal (Responsive Centered Dialog) */}
      {activeBurnTimer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                ⚡ Balance Boost Active
              </span>
              <button
                className="text-slate-400 hover:text-white p-1 rounded-lg"
                onClick={() => setActiveBurnTimer(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">{activeBurnTimer.exerciseName}</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Keep a steady pace · breathe deeply</p>
            </div>

            <div className="flex justify-center py-2">
              <RingTimer
                remaining={activeBurnTimer.secondsLeft}
                totalSeconds={activeBurnTimer.totalSeconds}
                label="Burn"
              />
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 btn-outline py-3 text-xs sm:text-sm flex items-center justify-center gap-1.5"
                onClick={() =>
                  setActiveBurnTimer((p) => ({ ...p, isPaused: !p.isPaused }))
                }
              >
                {activeBurnTimer.isPaused ? <Play size={16} /> : <Pause size={16} />}
                <span>{activeBurnTimer.isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                className="flex-1 btn-primary py-3 text-xs sm:text-sm flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20"
                onClick={() => burnMutation.mutate({ id: log._id, status: 'done' })}
              >
                <CheckCircle2 size={16} /> Mark Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
