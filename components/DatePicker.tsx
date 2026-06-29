'use client';

import React from 'react';

interface DatePickerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) {
  // Static array of dates matching our mock data set, relative to current time 2026-06-29
  const dateTabs = [
    { label: 'Yesterday', value: '2026-06-28' },
    { label: '🔴 LIVE NOW', value: '2026-06-29' },
    { label: 'Tomorrow', value: '2026-06-30' },
    { label: 'Jul 01', value: '2026-07-01' },
    { label: 'Jul 02', value: '2026-07-02' }
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar border-b border-[#20242e] pb-1">
      <div className="flex space-x-2 md:space-x-4 min-w-max py-2">
        {dateTabs.map((tab) => {
          const isActive = selectedDate === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onSelectDate(tab.value)}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 shadow-[0_0_10px_rgba(0,255,102,0.08)]'
                  : 'bg-[#12141a] text-slate-400 border border-[#20242e] hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
