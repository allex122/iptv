'use client';

import React from 'react';

interface AdPlaceholderProps {
  type: 'header' | 'sidebar' | 'overlay' | 'banner' | 'square';
  className?: string;
}

export default function AdPlaceholder({ type, className = '' }: AdPlaceholderProps) {
  // 1. Sidebar Ad Skyscraper (300x600)
  if (type === 'sidebar') {
    return (
      <div className={`flex flex-col items-center justify-center bg-[#12141a] border border-[#20242e] rounded-2xl p-2.5 w-full max-w-[320px] mx-auto overflow-hidden ${className}`}>
        <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 self-start pl-1">
          Sponsored Skyscraper Ad
        </span>
        <div className="w-[300px] h-[600px] bg-black rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
          <iframe
            scrolling="no"
            frameBorder="0"
            style={{ padding: '0px', margin: '0px', border: '0px', borderStyle: 'none' }}
            width="300"
            height="600"
            src="https://refbanners.com/I?tag=d_245495m_62435c_&site=245495&ad=62435"
          ></iframe>
        </div>
      </div>
    );
  }

  // 2. Smaller Square Ad (160x200)
  if (type === 'square') {
    return (
      <div className={`flex flex-col items-center justify-center bg-[#12141a] border border-[#20242e] rounded-2xl p-2 w-full max-w-[180px] mx-auto overflow-hidden ${className}`}>
        <span className="text-[7px] uppercase tracking-widest text-slate-500 font-bold mb-1">
          Sponsor Box
        </span>
        <div className="w-[160px] h-[200px] bg-black rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
          <iframe
            scrolling="no"
            frameBorder="0"
            style={{ padding: '0px', margin: '0px', border: '0px', borderStyle: 'none' }}
            width="160"
            height="200"
            src="https://refbanners.com/I?tag=d_245495m_62433c_&site=245495&ad=62433"
          ></iframe>
        </div>
      </div>
    );
  }

  // 3. Main Wide Banner (800x250)
  if (type === 'banner') {
    return (
      <div className={`flex flex-col items-center justify-center bg-[#12141a] border border-[#20242e] rounded-3xl p-3 w-full max-w-[840px] mx-auto overflow-hidden ${className}`}>
        <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 self-start pl-2">
          Sponsored Leaderboard Banner
        </span>
        <div className="w-full max-w-[800px] h-[250px] bg-black rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
          <iframe
            scrolling="no"
            frameBorder="0"
            style={{ padding: '0px', margin: '0px', border: '0px', borderStyle: 'none' }}
            width="800"
            height="250"
            src="https://refbanners.com/I?tag=d_245495m_62437c_&site=245495&ad=62437"
          ></iframe>
        </div>
      </div>
    );
  }

  // Fallback for header / overlay placements
  return (
    <div className={`flex flex-col items-center justify-center bg-[#12141a] border border-[#20242e] rounded-3xl p-3 w-full max-w-[840px] mx-auto overflow-hidden ${className}`}>
      <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 self-start pl-2">
        Sponsored Advertisement
      </span>
      <div className="w-full max-w-[800px] h-[250px] bg-black rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
        <iframe
          scrolling="no"
          frameBorder="0"
          style={{ padding: '0px', margin: '0px', border: '0px', borderStyle: 'none' }}
          width="800"
          height="250"
          src="https://refbanners.com/I?tag=d_245495m_62437c_&site=245495&ad=62437"
        ></iframe>
      </div>
    </div>
  );
}
