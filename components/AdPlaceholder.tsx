'use client';

import React, { useState } from 'react';

interface AdPlaceholderProps {
  type: 'header' | 'sidebar' | 'overlay' | 'banner';
  className?: string;
}

export default function AdPlaceholder({ type, className = '' }: AdPlaceholderProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  // Header Billboard / Leaderboard (728x90)
  if (type === 'header') {
    return (
      <div className={`hidden md:flex flex-col items-center justify-center bg-[#0d0f14] border border-[#20242e] rounded-md py-2 px-4 text-center max-w-[728px] h-[90px] mx-auto overflow-hidden ${className}`}>
        <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-1">
          Sponsored Link — High CPC/CPA Slot
        </span>
        <div className="flex items-center justify-center w-full h-full border border-dashed border-[#2e3545] bg-[#12141c] text-[#00ff66] text-sm font-semibold hover:bg-[#161a24] transition-colors cursor-pointer">
          <span className="animate-pulse mr-2">⚡</span> ADVERTISEMENT PARTNER (728x90)
        </div>
      </div>
    );
  }

  // Sidebar Ad (300x250)
  if (type === 'sidebar') {
    return (
      <div className={`flex flex-col bg-[#12141a] border border-[#20242e] rounded-xl p-3 text-center w-full max-w-[300px] min-h-[250px] mx-auto justify-between ${className}`}>
        <div className="flex justify-between items-center border-b border-[#20242e] pb-1.5 mb-2">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
            Sponsored Ad
          </span>
          <span className="text-[9px] text-[#00ff66] font-semibold bg-[#00ff66]/10 px-1.5 py-0.5 rounded">
            300x250
          </span>
        </div>
        <div className="flex flex-col items-center justify-center flex-grow border border-dashed border-[#2e3545] bg-[#0c0e12] rounded-lg p-4 text-slate-400 hover:text-[#00ff66] hover:border-[#00ff66]/40 transition-all cursor-pointer group">
          <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">💰</span>
          <span className="text-xs font-bold text-slate-300 group-hover:text-[#00ff66]">PREMIUM SPONSOR SLOT</span>
          <span className="text-[10px] text-slate-500 mt-1">Get 100% Match Bonus on Sign Up!</span>
        </div>
        <div className="text-[8px] text-slate-500 mt-2">
          Place your AdSense, PropellerAds or Affiliate script here.
        </div>
      </div>
    );
  }

  // Video Player Overlay
  if (type === 'overlay') {
    return (
      <div className={`absolute inset-0 flex items-center justify-center bg-black/85 z-20 p-4 transition-all ${className}`}>
        <div className="relative bg-[#0d0f14] border border-[#20242e] hover:border-[#00ff66]/50 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
          <button 
            onClick={() => setVisible(false)} 
            className="absolute top-3 right-3 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-all"
            title="Close Ad"
          >
            ✕
          </button>
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
            Pre-Roll / Overlay Sponsorship
          </span>
          <h4 className="text-white font-bold text-base mb-2">🎁 Spin the Wheel & Win 100x!</h4>
          <p className="text-slate-400 text-xs mb-4">
            Partner platform offer. Instant cash withdrawals. 18+ gamble responsibly.
          </p>
          <a 
            href="#join-now" 
            onClick={() => setVisible(false)}
            className="inline-block w-full py-2.5 px-4 bg-[#00ff66] hover:bg-[#00e059] text-black font-bold rounded-lg text-sm transition-all transform hover:translate-y-[-1px] active:translate-y-[1px]"
          >
            Claim Bonus & Stream Now
          </a>
          <button 
            onClick={() => setVisible(false)}
            className="block text-center w-full mt-3 text-[10px] text-slate-500 hover:text-slate-300 underline"
          >
            Skip ad in 3 seconds...
          </button>
        </div>
      </div>
    );
  }

  // Standard Banner (468x60 / Responsive)
  return (
    <div className={`flex flex-col items-center justify-center bg-[#12141a] border border-[#20242e] rounded-lg py-2 px-3 text-center w-full overflow-hidden ${className}`}>
      <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-1">
        ADVERTISEMENT SPACE
      </span>
      <div className="flex items-center justify-center w-full min-h-[50px] border border-dashed border-[#2e3545] bg-[#0c0e12] text-xs font-bold text-slate-400 hover:text-[#00ff66] transition-colors cursor-pointer rounded">
        📣 CLICK TO ADVERTISE HERE — 468x60 / RESPONSIVE
      </div>
    </div>
  );
}
