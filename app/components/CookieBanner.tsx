"use client";

import { useEffect, useRef } from 'react';

export default function CookieBanner() {
  const bannerRef = useRef<HTMLDivElement | null>(null);

  // Imperatively hide the banner if consent already exists to avoid setState in effects
  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (consent && bannerRef.current) {
        bannerRef.current.style.display = 'none';
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  const acceptCookies = () => {
    try {
      localStorage.setItem('cookie-consent', 'accepted');
    } catch {}
    if (bannerRef.current) {
      bannerRef.current.style.display = 'none';
    }
    // Enable analytics here when you add Vercel Analytics
    if (typeof window !== 'undefined') {
      const w = window as Window & { va?: (event: string, name: string, data: object) => void };
      if (w.va) {
        w.va('event', 'cookie_consent', { action: 'accepted' });
      }
    }
  };

  const declineCookies = () => {
    try {
      localStorage.setItem('cookie-consent', 'declined');
    } catch {}
    if (bannerRef.current) {
      bannerRef.current.style.display = 'none';
    }
  };

  return (
    <div ref={bannerRef} className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 border-t border-white/10 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-gray-300">
          <p>
            We use Vercel Analytics to analyze and improve the usage of our website. 
            By clicking &quot;Accept&quot; you agree to the use of cookies. 
            For more information, please see our{' '}
            <a href="/impressum" className="text-orange-500 hover:text-orange-400 underline">
              Imprint
            </a>.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors text-sm font-semibold"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
