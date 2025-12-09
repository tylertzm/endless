"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';
const FluidBackground = dynamic(() => import("./FluidBackground"), { ssr: false });
import { useUser, SignIn, SignUp } from '@stackframe/stack';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function Home() {
  const user = useUser();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  // Redirect authenticated users straight to dashboard
  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (user === undefined) {
    return (
      <>
        <FluidBackground />
        <div className="h-screen flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </>
    );
  }

  // If user exists, we already redirected; render nothing to avoid flash
  if (user) return null;

  return (
    <>
      <FluidBackground />
      <div className="h-screen flex items-center justify-center p-4">
        <Tooltip.TooltipProvider>
          <div className="bg-black/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/10">
            <div className="text-center mb-6">
              <img src="/endless.webp" alt="Endless Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to Endless</h1>
              <p className="text-gray-300">Create and share your digital business cards</p>
            </div>
            <div className="space-y-6">
              <div className="flex justify-center space-x-1 bg-gray-800 p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    !isSignUp ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    isSignUp ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
              <div className="space-y-4 stack-auth-container">
                <style jsx global>{`
                  /* Hide the "last" text badge */
                  .stack-auth-container .absolute.-top-2.-right-2,
                  .stack-auth-container span[class*="absolute"][class*="-top-2"][class*="-right-2"],
                  .stack-auth-container span[class*="bg-blue-500"],
                  .stack-auth-container .bg-blue-500 {
                    display: none !important;
                  }
                  
                  /* Hide all loading spinners */
                  .stack-auth-container [role="status"],
                  .stack-auth-container [data-loading="true"],
                  .stack-auth-container [data-state="loading"],
                  .stack-auth-container .loading,
                  .stack-auth-container .spinner,
                  .stack-auth-container svg[class*="spin"],
                  .stack-auth-container svg[class*="animate-spin"],
                  .stack-auth-container svg.animate-spin,
                  .stack-auth-container *[aria-busy="true"],
                  .stack-auth-container *[class*="rotating"],
                  .stack-auth-container div[class*="loading"],
                  .stack-auth-container div[class*="spinner"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                  }
                `}</style>
                {isSignUp ? <SignUp /> : <SignIn />}
              </div>
            </div>
          </div>
        </Tooltip.TooltipProvider>
      </div>
    </>
  );
}
