import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkoutToday, completeWorkout } from '../api/client.js';
import LottiePlayer from '../components/workout/LottiePlayer.jsx';
import RingTimer from '../components/workout/RingTimer.jsx';
import { useWakeLock } from '../hooks/useWakeLock.js';
import { useBeep } from '../hooks/useBeep.js';
import { useWorkoutPlayerStore } from '../context/WorkoutPlayerStore.js';
import { CheckCircle2, Dumbbell, Play, Pause, SkipForward, PlusCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DAY_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WorkoutSession() {
  useWakeLock();
  const beep = useBeep();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const todayKey = DAY_MAP[new Date().getDay()];

  const { data: todayDay, isLoading } = useQuery({
    queryKey: ['today-workout', todayKey],
    queryFn: () => getWorkoutToday(todayKey),
  });

  const {
    exercises,
    currentExIndex,
    currentSet,
    phase,
    secondsRemaining,
    isPaused,
    initRoutine,
    tick,
    togglePause,
    addRest,
    nextExercise,
    reset,
  } = useWorkoutPlayerStore();

  const completeMutation = useMutation({
    mutationFn: completeWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-log'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Load routine into store
  useEffect(() => {
    if (todayDay?.exercises?.length && exercises.length === 0) {
      initRoutine(todayDay.exercises);
    }
  }, [todayDay, exercises.length, initRoutine]);

  // Audio countdown cue and ticking interval
  useEffect(() => {
    if (phase === 'completed' || isPaused || exercises.length === 0) return;

    const timer = setInterval(() => {
      if (secondsRemaining <= 4 && secondsRemaining > 1) {
        beep(440, 80); // 3, 2, 1 countdown beeps
      } else if (secondsRemaining === 1) {
        beep(880, 250); // High pitch phase change chime
      }
      tick();
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isPaused, exercises.length, secondsRemaining, tick, beep]);

  // Auto-complete workout once all exercises finish
  useEffect(() => {
    if (phase === 'completed') {
      completeMutation.mutate();
    }
  }, [phase]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!todayDay || !todayDay.exercises || todayDay.exercises.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 gap-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center border border-slate-700">
          <Dumbbell size={36} className="text-brand-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Rest & Recovery Day</h2>
        <p className="text-slate-400 text-sm max-w-sm">
          No workout scheduled for today. Rest is vital for muscle growth and central nervous system recovery!
        </p>
        <button className="btn-primary mt-2" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (phase === 'completed') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 gap-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 size={56} className="text-emerald-400" />
        </div>
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Workout Finished!</h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-md">
            You completed all {exercises.length} exercises · Burned ~{todayDay.estimatedBurnKcal || 250} kcal 🔥
          </p>
        </div>
        <button
          className="btn-primary w-full max-w-xs mt-4 py-3.5 text-base font-bold shadow-lg shadow-brand-500/25"
          onClick={() => {
            reset();
            navigate('/dashboard');
          }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentEx = exercises[currentExIndex] || todayDay.exercises[0];
  const totalPhaseSeconds =
    phase === 'prepare'
      ? 10
      : phase === 'work'
      ? currentEx?.workSeconds || 40
      : currentEx?.restSeconds || 20;

  return (
    <div className="w-full space-y-6 pb-6 select-none">
      {/* Top Header & Exercise Stepper */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm text-slate-200">
              Exercise {currentExIndex + 1} of {exercises.length}
            </span>
            <span className="bg-slate-800 text-brand-400 text-xs px-2.5 py-0.5 rounded-full border border-slate-700 font-semibold">
              Set {currentSet} of {currentEx?.sets || 3}
            </span>
          </div>
        </div>

        {/* Multi-step progress bar */}
        <div className="w-full flex gap-1.5">
          {exercises.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i < currentExIndex
                  ? 'bg-emerald-400'
                  : i === currentExIndex
                  ? 'bg-brand-500 shadow-sm shadow-brand-500/50'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Studio Arena: 2-Column Responsive Grid on Tablet / Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Animation & Form Technique */}
        <div className="lg:col-span-6 flex flex-col items-center text-center space-y-4">
          <div className="w-full max-w-[340px] sm:max-w-[400px] aspect-square rounded-3xl bg-slate-900/80 p-4 flex items-center justify-center border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-3 left-3 bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-semibold text-slate-300 border border-slate-700 capitalize">
              {currentEx?.targetMuscle || 'Full Body'}
            </div>
            <LottiePlayer url={currentEx?.animationUrl} className="w-full h-full" />
          </div>

          <div className="space-y-1.5 px-4 max-w-md">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{currentEx?.name}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {Array.isArray(currentEx?.instructions)
                ? currentEx.instructions.join(' · ')
                : currentEx?.instructions || 'Maintain strict core brace and smooth tempo.'}
            </p>
          </div>
        </div>

        {/* Right Column: Timer & Studio Controls */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-6">
          <div className="relative flex items-center justify-center scale-110 sm:scale-125 my-4">
            <RingTimer
              remaining={secondsRemaining}
              totalSeconds={totalPhaseSeconds}
              label={phase.toUpperCase()}
            />
          </div>

          {/* Phase Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                phase === 'work'
                  ? 'bg-brand-500/20 text-brand-400 border-brand-500/40 animate-pulse'
                  : phase === 'rest'
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}
            >
              {phase === 'work' ? '🔥 Work Period' : phase === 'rest' ? '💨 Rest & Recover' : '⚡ Get Ready'}
            </span>
          </div>

          {/* Action Control Buttons */}
          <div className="w-full max-w-md flex items-center justify-center gap-3 px-4">
            <button
              className="flex-1 btn-outline flex items-center justify-center gap-2 text-xs sm:text-sm py-3 font-semibold rounded-2xl"
              onClick={addRest}
            >
              <PlusCircle size={18} /> +15s Rest
            </button>

            <button
              className={`flex-1 btn-primary flex items-center justify-center gap-2 text-xs sm:text-sm py-3 font-bold rounded-2xl shadow-lg transition-all ${
                isPaused
                  ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                  : 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/20'
              }`}
              onClick={togglePause}
            >
              {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>

            <button
              className="btn-outline px-4 py-3 text-xs sm:text-sm rounded-2xl"
              onClick={nextExercise}
              title="Skip to next exercise"
            >
              <SkipForward size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Routine Playlist Queue Preview */}
      <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 space-y-3 mt-4">
        <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
          Full Workout Queue ({exercises.length} Exercises)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {exercises.map((ex, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                i === currentExIndex
                  ? 'bg-brand-500/10 border-brand-500/40 text-brand-300 shadow-sm'
                  : i < currentExIndex
                  ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold flex items-center justify-center text-slate-400">
                  {i < currentExIndex ? '✓' : i + 1}
                </span>
                <span className="text-xs font-semibold truncate max-w-[150px]">{ex.name}</span>
              </div>
              <span className="text-[11px] text-slate-400">
                {ex.sets || 3} sets × {ex.workSeconds || 40}s
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
