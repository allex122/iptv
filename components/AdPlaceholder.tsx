'use client';

import React from 'react';

interface AdPlaceholderProps {
  type: 'header' | 'sidebar' | 'overlay' | 'banner' | 'square';
  className?: string;
}

export default function AdPlaceholder({ type, className = '' }: AdPlaceholderProps) {
  // 1. Header Banner Placeholder (Leaderboard 728x90)
  if (type === 'header') {
    return (
      <div className={`hidden md:flex flex-col items-center justify-center bg-[#0d0f14] border border-[#20242e] rounded-md py-2 px-4 text-center max-w-[728px] h-[45px] mx-auto overflow-hidden ${className}`}>
        <div className="flex items-center justify-center w-full h-full border border-dashed border-[#2e3545] bg-[#12141c] text-[#00ff66] text-[10px] font-black hover:bg-[#161a24] transition-colors cursor-pointer rounded">
          <span className="animate-pulse mr-2">⚡</span> ADVERTISING PARTNER — SPONSORSHIP SLOT (728x90)
        </div>
      </div>
    );
  }

  // 2. Sidebar Skyscraper Placeholder (No Iframes)
  if (type === 'sidebar') {
    return (
      <div className={`flex flex-col bg-[#12141a] border border-[#20242e] rounded-2xl p-4 text-center w-full max-w-[320px] min-h-[300px] mx-auto justify-between ${className}`}>
        <div className="flex justify-between items-center border-b border-[#20242e] pb-2 mb-3">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
            Sponsored Ad
          </span>
          <span className="text-[9px] text-[#00ff66] font-semibold bg-[#00ff66]/10 px-1.5 py-0.5 rounded">
            300x600 Slot
          </span>
        </div>
        <div className="flex flex-col items-center justify-center flex-grow border border-dashed border-[#2e3545] bg-[#0c0e12] rounded-xl p-6 text-slate-400 hover:text-[#00ff66] transition-all cursor-pointer">
          <span className="text-3xl mb-2">💰</span>
          <span className="text-xs font-black text-slate-300">PREMIUM SPONSOR SLOT</span>
          <span className="text-[10px] text-slate-500 mt-1">Get 100% Match Bonus on Sign Up!</span>
        </div>
      </div>
    );
  }

  // 3. Small Box Placeholder (No Iframes)
  if (type === 'square') {
    return (
      <div className={`flex flex-col bg-[#12141a] border border-[#20242e] rounded-xl p-3 text-center w-full max-w-[180px] mx-auto justify-between ${className}`}>
        <div className="flex justify-between items-center border-b border-[#20242e] pb-1 mb-2">
          <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">
            Sponsor Box
          </span>
          <span className="text-[8px] text-slate-500 font-bold">160x200</span>
        </div>
        <div className="flex flex-col items-center justify-center py-6 border border-dashed border-[#2e3545] bg-[#0c0e12] rounded-xl text-slate-500 text-[10px]">
          <span className="text-lg">📣</span>
          <span className="font-bold mt-1">Advertise Here</span>
        </div>
      </div>
    );
  }

  // 4. Wide Leaderboard Banner Placeholder (No Iframes)
  return (
    <div className={`flex flex-col items-center justify-center bg-[#12141a] border border-[#20242e] rounded-3xl p-4 w-full max-w-[840px] mx-auto overflow-hidden ${className}`}>
      <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-2 self-start pl-2">
        Sponsored Leaderboard Banner (800x250)
      </span>
      <div className="flex items-center justify-center w-full min-h-[100px] border border-dashed border-[#2e3545] bg-[#0c0e12] text-xs font-bold text-slate-500 hover:text-[#00ff66] transition-colors cursor-pointer rounded-2xl">
        📣 CLICK TO ADVERTISE HERE — HIGH CTR PLACEMENT
      </div>
    </div>
  );
}
