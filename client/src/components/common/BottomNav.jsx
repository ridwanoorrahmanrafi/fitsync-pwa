import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, UtensilsCrossed, BarChart2 } from 'lucide-react';

const tabs = [
  { to: '/dashboard', icon: Home, label: 'Today' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/nutrition', icon: UtensilsCrossed, label: 'Diet & Pantry' },
  { to: '/progress', icon: BarChart2, label: 'Progress' },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-safe">
      <div className="flex max-w-md mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center min-h-[58px] gap-0.5 text-[11px] font-semibold transition-colors
               ${isActive ? 'text-brand-400' : 'text-slate-400 hover:text-slate-200'}`
            }
          >
            <Icon size={20} className={({ isActive }) => (isActive ? 'stroke-[2.5]' : 'stroke-[1.8]')} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
