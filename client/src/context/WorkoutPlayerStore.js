import { create } from 'zustand';

export const useWorkoutPlayerStore = create((set, get) => ({
  exercises: [],
  currentExIndex: 0,
  currentSet: 1,
  phase: 'prepare', // 'prepare' | 'work' | 'rest' | 'completed'
  secondsRemaining: 10,
  isPaused: false,
  totalBurnedKcal: 0,

  initRoutine: (exercises) => {
    set({
      exercises,
      currentExIndex: 0,
      currentSet: 1,
      phase: 'prepare',
      secondsRemaining: 10,
      isPaused: false,
      totalBurnedKcal: 0,
    });
  },

  tick: (onComplete) => {
    const { phase, secondsRemaining, isPaused, exercises, currentExIndex, currentSet } = get();
    if (isPaused || phase === 'completed') return;

    if (secondsRemaining > 1) {
      set({ secondsRemaining: secondsRemaining - 1 });
      return;
    }

    // Transition state
    const currentEx = exercises[currentExIndex];
    if (!currentEx) return;

    if (phase === 'prepare') {
      set({
        phase: 'work',
        secondsRemaining: currentEx.workSeconds || 40,
      });
    } else if (phase === 'work') {
      const isLastSet = currentSet >= (currentEx.sets || 3);
      const isLastEx = currentExIndex >= exercises.length - 1;

      if (isLastSet && isLastEx) {
        set({ phase: 'completed', secondsRemaining: 0 });
        if (onComplete) onComplete();
      } else {
        set({
          phase: 'rest',
          secondsRemaining: currentEx.restSeconds || 20,
        });
      }
    } else if (phase === 'rest') {
      const isLastSet = currentSet >= (currentEx.sets || 3);
      if (isLastSet) {
        set({
          currentExIndex: currentExIndex + 1,
          currentSet: 1,
          phase: 'work',
          secondsRemaining: exercises[currentExIndex + 1]?.workSeconds || 40,
        });
      } else {
        set({
          currentSet: currentSet + 1,
          phase: 'work',
          secondsRemaining: currentEx.workSeconds || 40,
        });
      }
    }
  },

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

  addRest: (seconds = 15) => {
    const { phase, secondsRemaining } = get();
    if (phase === 'rest' || phase === 'prepare') {
      set({ secondsRemaining: secondsRemaining + seconds });
    }
  },

  nextExercise: (onComplete) => {
    const { exercises, currentExIndex } = get();
    if (currentExIndex < exercises.length - 1) {
      set({
        currentExIndex: currentExIndex + 1,
        currentSet: 1,
        phase: 'work',
        secondsRemaining: exercises[currentExIndex + 1]?.workSeconds || 40,
      });
    } else {
      set({ phase: 'completed', secondsRemaining: 0 });
      if (onComplete) onComplete();
    }
  },

  reset: () => {
    set({
      exercises: [],
      currentExIndex: 0,
      currentSet: 1,
      phase: 'prepare',
      secondsRemaining: 10,
      isPaused: false,
    });
  },
}));

