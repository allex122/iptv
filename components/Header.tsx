'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdPlaceholder from './AdPlaceholder';

export default function Header() {
  const [coins, setCoins] = useState<number | null>(null);

  // Sync wallet balance securely on mount (and listen for updates)
  useEffect(() => {
    const fetchBalance = () => {
      const stored = localStorage.getItem('cyber2-coins');
      if (stored !== null) {
        setCoins(parseInt(stored));
      } else {
        localStorage.setItem('cyber2-coins', '100'); // Start users with 100 free coins
        setCoins(100);
      }
    };

    fetchBalance();

    // Listen to changes from scratch cards or drama unlock events
    window.addEventListener('storage', fetchBalance);
    window.addEventListener('cyber2-coins-updated', fetchBalance);

    return () => {
      window.removeEventListener('storage', fetchBalance);
      window.removeEventListener('cyber2-coins-updated', fetchBalance);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-header">
      {/* Upper Header: Navigation and Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative flex items-center justify-center bg-[#00ff66]/10 border border-[#00ff66]/30 p-2 rounded-xl group-hover:border-[#00ff66] transition-all duration-300">
                {/* SVG Logo: Trophy/Ball outline */}
                <svg className="w-6 h-6 text-[#00ff66]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {/* Flashing Dot Overlay */}
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00ff66]"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-lg tracking-wider uppercase leading-none group-hover:text-[#00ff66] transition-colors">
                  CYBER2 SPORTS
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
                  Live Stream Arena
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links & Action Buttons */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6 text-sm font-semibold">
              <Link href="/" className="text-slate-300 hover:text-[#00ff66] transition-colors">
                Streams
              </Link>
              <Link href="/dramas" className="text-[#00ff66] hover:text-[#00ff66] transition-colors flex items-center space-x-1">
                <span>🎭</span>
                <span>Micro Dramas</span>
              </Link>
              <Link href="/#stats" className="text-slate-300 hover:text-white transition-colors">
                Live Scores
              </Link>
              <Link href="/#schedule" className="text-slate-300 hover:text-white transition-colors">
                Schedule
              </Link>
            </nav>
            
            {/* Wallet Coin Balance and Refresh Action */}
            <div className="flex items-center space-x-3">
              {coins !== null && (
                <div className="inline-flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs text-amber-400 font-black animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                  <span>🪙</span>
                  <span>{coins} Coins</span>
                </div>
              )}
              
              <Link
                href="/"
                className="btn-neon-glow bg-transparent border border-[#20242e] hover:bg-[#00ff66] text-[#00ff66] hover:text-black font-extrabold text-xs px-4 py-2 rounded-xl transition-all"
              >
                Refresh Board
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header Banner Space (High CPC/CPA Slot) */}
      <div className="bg-[#0b0c0e]/90 border-t border-b border-[#1d212a] py-2.5">
        <div className="max-w-7xl mx-auto px-4">
          <AdPlaceholder type="header" />
        </div>
      </div>
    </header>
  );
}
