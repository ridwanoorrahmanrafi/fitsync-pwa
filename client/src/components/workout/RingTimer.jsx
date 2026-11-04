/**
 * Circular SVG countdown timer for the workout player.
 * Props:
 *   remaining    - current seconds remaining
 *   totalSeconds - total duration for the current phase
 *   label        - "Prepare" | "Work" | "Rest"
 */
export default function RingTimer({ remaining = 0, totalSeconds = 40, label = 'Work' }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSeconds > 0 ? Math.max(0, Math.min(1, remaining / totalSeconds)) : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const isWork = label.toLowerCase() === 'work';
  const isPrepare = label.toLowerCase() === 'prepare';
  const strokeColor = isPrepare ? '#f59e0b' : isWork ? '#6366f1' : '#10b981';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="150" height="150" className="-rotate-90">
        <circle cx="75" cy="75" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle
          cx="75"
          cy="75"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.8s linear' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-black tabular-nums">{remaining}s</span>
        <span className="text-xs uppercase font-bold tracking-wider" style={{ color: strokeColor }}>
          {label}
        </span>
      </div>
    </div>
  );
}
