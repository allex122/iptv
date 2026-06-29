'use client';

import React from 'react';
import Link from 'next/link';
import AdPlaceholder from './AdPlaceholder';

export default function Header() {
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

          {/* Center Search / Stats bar */}
          <div className="hidden lg:flex flex-1 max-w-sm mx-10">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Search leagues, teams, or sports..." 
                className="w-full pl-10 pr-4 py-2 bg-[#12141a] border border-[#20242e] focus:border-[#00ff66]/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Navigation Links & Action Buttons */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6 text-sm font-semibold">
              <Link href="/" className="text-[#00ff66] hover:text-[#00ff66] transition-colors">
                Streams
              </Link>
              <a href="#stats" className="text-slate-300 hover:text-white transition-colors">
                Live Scores
              </a>
              <a href="#schedule" className="text-slate-300 hover:text-white transition-colors">
                Schedule
              </a>
            </nav>
            
            {/* CTA Buy/Demo button (perfect for CodeCanyon product) */}
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline-flex items-center space-x-1 bg-[#12141a] border border-[#20242e] px-3 py-1.5 rounded-lg text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#00ff66] live-pulse-dot mr-1"></span>
                <span>24 streams active</span>
              </span>
              
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
