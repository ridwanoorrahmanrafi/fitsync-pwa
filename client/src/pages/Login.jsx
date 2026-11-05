import { useAuth } from '../context/AuthContext.jsx';
import { Zap, ShieldCheck, Dumbbell, Sparkles, Flame } from 'lucide-react';

export default function Login() {
  const { login, loginAsDemo } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-slate-900/60 p-6 sm:p-10 lg:p-12 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
        {/* Left Side: Product Hero Pitch */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <Zap size={14} className="fill-brand-400" /> Mobile-First Intelligent Fitness PWA
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Adaptive Fitness.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">
                Culturally Adapted.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg">
              Dynamic workout routines and meal plans tailored to your biometrics, available equipment, religious dietary laws, and household pantry.
            </p>
          </div>

          {/* Key Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-800">
              <Dumbbell size={18} className="text-brand-400" />
              <div>
                <p className="text-xs font-bold text-white">Split Routine Engine</p>
                <p className="text-[10px] text-slate-400">Full Body · Upper/Lower · PPL</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-800">
              <Sparkles size={18} className="text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-white">Gemini AI Nutrition</p>
                <p className="text-[10px] text-slate-400">Pantry matching & instant macros</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-800">
              <Flame size={18} className="text-orange-400" />
              <div>
                <p className="text-xs font-bold text-white">Balance Boost</p>
                <p className="text-[10px] text-slate-400">Gentle non-punitive energy balance</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-800">
              <ShieldCheck size={18} className="text-blue-400" />
              <div>
                <p className="text-xs font-bold text-white">Dietary Laws Compliant</p>
                <p className="text-[10px] text-slate-400">Halal · Kosher · Vegetarian · Vegan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Box */}
        <div className="lg:col-span-5 flex flex-col items-center text-center p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Zap size={32} className="text-white" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Get Started</h2>
            <p className="text-xs text-slate-400">
              Sign in to generate your customized plans
            </p>
          </div>

          <button
            onClick={login}
            className="btn-primary w-full py-3.5 text-sm sm:text-base font-bold shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2.5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9c-.2-.7-.4-1.5-.4-2.4z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={loginAsDemo}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Zap size={14} className="text-amber-400 fill-amber-400" />
            Continue as Demo Athlete (Alex Rivera)
          </button>

          <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
            Instant guest mode available when developing locally. By continuing you agree to terms.
          </p>
        </div>
      </div>
    </div>
  );
}
