import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, UtensilsCrossed, BarChart2, Zap, LogOut, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Today' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/nutrition', icon: UtensilsCrossed, label: 'Diet & Pantry' },
  { to: '/progress', icon: BarChart2, label: 'Progress' },
];

export default function Navbar({ user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-black text-xl tracking-tight text-white group-hover:text-brand-400 transition-colors">
              Fit<span className="text-brand-400">Sync</span>
            </span>
          </NavLink>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all
                  ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`
                }
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right side stats & profile */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              {user.calorieTarget && (
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-full border border-slate-800 text-xs">
                  <Flame size={14} className="text-brand-400" />
                  <span className="text-slate-400">Goal:</span>
                  <span className="font-bold text-white">{user.calorieTarget} kcal</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                  {(user.name || 'A')[0].toUpperCase()}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-white leading-tight">{user.name || 'Athlete'}</p>
                  <p className="text-[10px] text-slate-400 leading-tight capitalize">
                    {user.fitnessLevel || 'Active'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/20 transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

