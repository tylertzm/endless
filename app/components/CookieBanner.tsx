"use client";

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent');
      return !consent;
    }
    return false;
  });

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    // Enable analytics here when you add Vercel Analytics
    if (typeof window !== 'undefined') {
      const w = window as Window & { va?: (event: string, name: string, data: object) => void };
      if (w.va) {
        w.va('event', 'cookie_consent', { action: 'accepted' });
      }
    }
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 border-t border-white/10 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-gray-300">
          <p>
            Wir verwenden Vercel Analytics, um die Nutzung unserer Website zu analysieren und zu verbessern. 
            Durch Klicken auf &quot;Akzeptieren&quot; stimmen Sie der Verwendung von Cookies zu. 
            Weitere Informationen finden Sie in unserem{' '}
            <a href="/impressum" className="text-orange-500 hover:text-orange-400 underline">
              Impressum
            </a>.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm"
          >
            Ablehnen
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors text-sm font-semibold"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
