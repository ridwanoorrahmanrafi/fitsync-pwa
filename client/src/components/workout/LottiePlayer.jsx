import { useState } from 'react';
import Lottie from 'lottie-react';
import { Dumbbell } from 'lucide-react';

/**
 * Renders a Lottie animation from a URL, with an icon fallback on error.
 */
export default function LottiePlayer({ url, className = '' }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  // Fetch the Lottie JSON only once per URL
  useState(() => {
    if (!url) { setError(true); return; }
    fetch(url)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(true));
  });

  if (error || !url) {
    return (
      <div className={`flex items-center justify-center bg-slate-700 rounded-2xl ${className}`}>
        <Dumbbell size={48} className="text-brand-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`flex items-center justify-center bg-slate-700 rounded-2xl ${className}`}>
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <Lottie animationData={data} loop className={className} />;
}

