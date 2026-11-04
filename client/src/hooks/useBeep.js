import { useCallback } from 'react';

/**
 * Returns a beep() function that plays a short tone using the Web Audio API.
 * Used by the workout timer to signal set transitions.
 */
export function useBeep() {
  const beep = useCallback((frequency = 880, durationMs = 120) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = frequency;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Audio context not available (e.g. SSR or locked browser) — silently skip
    }
  }, []);

  return beep;
}

