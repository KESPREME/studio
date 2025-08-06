
// src/components/app-footer.tsx
"use client";

import { useState, useEffect } from 'react';

export function AppFooter() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  if (!isMounted) {
    return <div className="h-10" />;
  }

  return (
    <footer className="relative py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20 border-t border-slate-200/50 dark:border-slate-800/50">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-950/10 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-green-950/20 opacity-50"></div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Enhanced logo section */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative p-2 bg-gradient-to-br from-blue-500/15 to-green-500/15 rounded-xl border border-blue-500/20 dark:border-green-500/20 group-hover:border-blue-400/40 dark:group-hover:border-green-400/40 transition-all duration-500 backdrop-blur-sm">
              <div className="text-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                🛡️
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent group-hover:from-green-600 group-hover:to-blue-600 transition-all duration-500">
                AlertFront
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Community Safety Network
              </span>
            </div>
          </div>

          {/* Enhanced copyright */}
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              &copy; {currentYear} AlertFront. All rights reserved.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Building safer communities through technology and collaboration.
            </p>
          </div>

          {/* Subtle decorative elements */}
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-1 h-1 bg-blue-400/60 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-purple-400/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-1 h-1 bg-green-400/60 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
