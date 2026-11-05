import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../api/client.js';
import Navbar from './Navbar.jsx';
import BottomNav from './BottomNav.jsx';

export default function Layout() {
  const { data: user } = useQuery({ queryKey: ['user'], queryFn: getMe });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative antialiased selection:bg-brand-500/30 selection:text-brand-300">
      <Navbar user={user} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* Compliance & Medical Disclaimer Footer (FitSync Plan Section 10) */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-4 px-4 sm:px-6 lg:px-8 text-center text-[11px] text-slate-500 hidden md:block">
        <p className="max-w-3xl mx-auto leading-relaxed">
          <span className="font-semibold text-slate-400">Notice:</span> FitSync provides general fitness, biometric and nutritional guidance for educational purposes only, not medical advice. Always consult a healthcare professional before beginning any new training regimen or calorie deficit program.
        </p>
        <p className="mt-1 text-slate-600">
          FitSync v1.0 · Strict Dietary Privacy & GDPR/CCPA Compliant · All Health Data Encrypted
        </p>
      </footer>
      <BottomNav />
    </div>
  );
}
