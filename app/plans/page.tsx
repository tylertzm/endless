/* eslint-disable @next/next/no-img-element */
'use client';

import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import AppHeader from '../components/AppHeader';
const FluidBackground = dynamic(() => import('../FluidBackground'), { ssr: false });

export default function PlansPage() {
  const user = useUser();
  const router = useRouter();
  const [cardCount, setCardCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.push('/');
      return;
    }
    loadCardCount();
  }, [user, router]);

  const loadCardCount = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cards/my-cards');
      if (res.ok) {
        const data = await res.json();
        setCardCount(data.cards?.length || 0);
      }
    } catch (error) {
      console.error('Failed to load card count:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user === undefined || loading) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center">
        <FluidBackground />
        <div className="absolute inset-0 grid place-items-center z-10">
          <img
            src="/endless.webp"
            alt="Endless"
            className="w-12 h-12 md:w-16 md:h-16 object-contain animate-spin animate-pulse"
            style={{ animationDuration: '1.25s' }}
          />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-black">
      <FluidBackground />
      <div className="relative z-10">
        <AppHeader />
      </div>
      
      <div className="relative z-0 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Plans & Usage</h1>
            <p className="text-white/70 text-lg">Choose the plan that works for you</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  CURRENT PLAN
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Free</h2>
                <div className="text-4xl font-bold text-white mb-2">$0</div>
                <p className="text-white/60 text-sm">Forever free</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-white font-medium">Up to 2 business cards</p>
                    <p className="text-white/60 text-sm">Current usage: {cardCount}/2</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white">Unlimited card views</p>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white">Export as vCard & QR code</p>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white">Save unlimited contacts</p>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white">Custom design & branding</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="w-full h-12 bg-white/5 rounded-full flex items-center justify-center text-white/50 font-medium">
                  Current Plan
                </div>
              </div>
            </div>

            {/* Pro Plan - Coming Soon */}
            <div className="bg-gradient-to-br from-orange-600/20 to-orange-900/20 backdrop-blur-md rounded-2xl p-8 border border-orange-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  COMING SOON
                </span>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Pro</h2>
                <div className="text-4xl font-bold text-white mb-2">TBA</div>
                <p className="text-white/60 text-sm">Pricing to be announced</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white font-medium">Everything in Free</p>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white">Unlimited business cards</p>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white">Advanced analytics</p>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white">Priority support</p>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white">Custom domains</p>
                </div>
              </div>

              <div className="pt-6 border-t border-orange-500/20">
                <div className="w-full h-12 bg-white/5 rounded-full flex items-center justify-center text-white/50 font-medium cursor-not-allowed">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="btn btn-ghost"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
