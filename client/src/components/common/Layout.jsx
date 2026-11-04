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
      <BottomNav />
    </div>
  );
}
