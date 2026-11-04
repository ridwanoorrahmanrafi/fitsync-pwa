import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logWater } from '../../api/client.js';
import { Droplets, Plus } from 'lucide-react';

const PRESETS = [250, 500, 750];

export default function WaterTracker({ waterMl = 0, goal = 2500 }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: logWater,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['today-log'] }),
  });

  const pct = Math.min((waterMl / goal) * 100, 100).toFixed(0);

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2">
        <Droplets size={18} className="text-blue-400" />
        <h3 className="font-semibold">Water</h3>
        <span className="ml-auto text-sm text-slate-400">{waterMl} / {goal} ml</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-blue-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex gap-2">
        {PRESETS.map((ml) => (
          <button
            key={ml}
            className="flex-1 btn-outline text-sm py-2"
            onClick={() => mutation.mutate(ml)}
            disabled={mutation.isPending}
          >
            +{ml}ml
          </button>
        ))}
      </div>
    </div>
  );
}

