import { useEffect, useRef } from 'react';

/**
 * Acquires a WakeLock to keep the screen on during workout sessions.
 * Automatically releases when the component unmounts.
 */
export function useWakeLock() {
  const lockRef = useRef(null);

  useEffect(() => {
    let active = true;

    const acquire = async () => {
      if (!('wakeLock' in navigator)) return;
      try {
        lockRef.current = await navigator.wakeLock.request('screen');
        lockRef.current.addEventListener('release', () => {
          if (active) acquire(); // re-acquire on visibility change
        });
      } catch {
        // WakeLock not supported or denied — silently skip
      }
    };

    acquire();
    return () => {
      active = false;
      lockRef.current?.release().catch(() => {});
    };
  }, []);
}

