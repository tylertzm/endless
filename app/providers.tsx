/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from 'react';
import { StackProvider } from '@stackframe/stack';
import { stackClientApp } from '../lib/stack-client';

function SplashOverlay({ ready }: { ready: boolean }) {
  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[99998] flex items-center justify-center bg-black transition-opacity duration-500 ${
        ready ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <img
        src="/endless.webp"
        alt="Endless"
        className="w-16 h-16 md:w-24 md:h-24 object-contain animate-spin animate-pulse"
        style={{ animationDuration: '1.25s' }}
      />
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const waitForWindow =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((res) => {
            const handler = () => {
              window.removeEventListener('load', handler);
              res();
            };
            window.addEventListener('load', handler);
          });

    const docFonts = (document as unknown as { fonts?: { ready: Promise<void> } }).fonts;
    const waitForFonts = docFonts?.ready ?? Promise.resolve();

    // Lock scroll while splash is visible
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    Promise.all([waitForWindow, waitForFonts])
      .then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
      .then(() => {
        if (mounted) setReady(true);
        // release scroll a bit after fade
        setTimeout(() => {
          document.body.style.overflow = prevOverflow;
        }, 600);
      });

    return () => {
      mounted = false;
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <StackProvider app={stackClientApp}>
      <SplashOverlay ready={ready} />
      {children}
    </StackProvider>
  );
}