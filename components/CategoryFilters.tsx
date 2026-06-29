'use client';

import React from 'react';

interface CategoryFiltersProps {
  selectedSport: string;
  onSelectSport: (sport: string) => void;
}

export default function CategoryFilters({ selectedSport, onSelectSport }: CategoryFiltersProps) {
  const categories = [
    {
      id: 'all',
      name: 'All Sports',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'football',
      name: 'Football',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V8a2 2 0 00-2-2h-.5A2 2 0 0115 4V3.065M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'basketball',
      name: 'Basketball',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M5.314 5.314a9 9 0 0113.372 0M5.314 18.686a9 9 0 0013.372 0" />
        </svg>
      )
    },
    {
      id: 'cricket',
      name: 'Cricket',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 3l4 4L9 20H5v-4L18 3z M14 7l3 3 M6 6a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      )
    },
    {
      id: 'wwe',
      name: 'WWE Wrestling',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'tennis',
      name: 'Tennis',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M5.6 12A6.4 6.4 0 0 1 12 5.6 M12 18.4A6.4 6.4 0 0 0 18.4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-4">
      <div className="flex space-x-3 min-w-max">
        {categories.map((cat) => {
          const isActive = selectedSport.toLowerCase() === cat.id.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => onSelectSport(cat.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00ff66] text-black shadow-[0_0_20px_rgba(0,255,102,0.25)] border border-[#00ff66]'
                  : 'bg-[#12141a] text-slate-300 border border-[#20242e] hover:border-[#2e3545] hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-black' : 'text-[#00ff66]'}>
                {cat.icon}
              </span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
