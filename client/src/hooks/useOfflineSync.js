import { useEffect, useRef } from 'react';
import { logMeal } from '../api/client.js';

const QUEUE_KEY = 'fitsync_offline_meal_queue';

function loadQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function useOfflineSync() {
  const flushRef = useRef(null);

  // Flush queued meals when back online
  const flush = async () => {
    const queue = loadQueue();
    if (!queue.length) return;

    const failed = [];
    for (const entry of queue) {
      try {
        await logMeal(entry);
      } catch {
        failed.push(entry);
      }
    }
    saveQueue(failed);
  };

  useEffect(() => {
    flushRef.current = flush;
    window.addEventListener('online', flush);
    // Try once on mount in case we're already online
    if (navigator.onLine) flush();
    return () => window.removeEventListener('online', flush);
  }, []);

  /** Queue a meal for later sync when offline, or send immediately when online */
  const enqueueMeal = async (mealData) => {
    if (navigator.onLine) {
      return logMeal(mealData);
    }
    const queue = loadQueue();
    queue.push(mealData);
    saveQueue(queue);
    return { queued: true };
  };

  return { enqueueMeal };
}

