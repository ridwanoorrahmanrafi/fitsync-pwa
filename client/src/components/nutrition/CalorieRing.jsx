/**
 * CalorieRing — donut chart showing today's calorie balance:
 * Target vs. Consumed vs. Burned.
 * Props:
 *   consumed - total kcal eaten today
 *   target   - daily target kcal
 *   burned   - kcal burned through workouts & burn tasks
 */
export default function CalorieRing({ consumed = 0, target = 2000, burned = 0 }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0;
  const offset = circumference * (1 - pct);
  const over = consumed > target;
  const net = consumed - burned;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center w-44 h-44 mx-auto">
        <svg width="176" height="176" className="-rotate-90">
          <circle cx="88" cy="88" r={radius} fill="none" stroke="#1e293b" strokeWidth="12" />
          <circle
            cx="88"
            cy="88"
            r={radius}
            fill="none"
            stroke={over ? '#ef4444' : '#6366f1'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center text-center">
          <span className="text-3xl font-black tabular-nums">{consumed}</span>
          <span className="text-xs text-slate-400">/ {target} kcal</span>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
            Consumed
          </span>
        </div>
      </div>

      {/* Summary Row */}
      <div className="flex items-center justify-around w-full mt-3 pt-3 border-t border-slate-700/60 text-center">
        <div>
          <p className="text-xs text-slate-400">Target</p>
          <p className="text-sm font-bold text-slate-200">{target} <span className="text-[10px] text-slate-400">kcal</span></p>
        </div>
        <div className="h-6 w-px bg-slate-700" />
        <div>
          <p className="text-xs text-emerald-400">Burned</p>
          <p className="text-sm font-bold text-emerald-300">-{burned} <span className="text-[10px] text-slate-400">kcal</span></p>
        </div>
        <div className="h-6 w-px bg-slate-700" />
        <div>
          <p className="text-xs text-slate-400">Net Intake</p>
          <p className={`text-sm font-bold ${net > target ? 'text-rose-400' : 'text-slate-200'}`}>
            {net} <span className="text-[10px] text-slate-400">kcal</span>
          </p>
        </div>
      </div>
    </div>
  );
}
