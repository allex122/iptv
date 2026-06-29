'use client';

import React, { useState, useEffect } from 'react';

interface MatchStatsProps {
  homeTeam: string;
  awayTeam: string;
  sport: string;
}

interface StatRow {
  name: string;
  home: number;
  away: number;
  type: 'percentage' | 'number';
}

export default function MatchStats({ homeTeam, awayTeam, sport }: MatchStatsProps) {
  const [stats, setStats] = useState<StatRow[]>([]);

  // Generate realistic-looking stats based on the sport type
  useEffect(() => {
    let mockStats: StatRow[] = [];

    if (sport.toLowerCase() === 'basketball') {
      mockStats = [
        { name: 'Field Goal %', home: 48, away: 45, type: 'percentage' },
        { name: '3-Point %', home: 36, away: 39, type: 'percentage' },
        { name: 'Free Throw %', home: 82, away: 79, type: 'percentage' },
        { name: 'Total Rebounds', home: 44, away: 41, type: 'number' },
        { name: 'Assists', home: 24, away: 26, type: 'number' },
        { name: 'Turnovers', home: 12, away: 14, type: 'number' },
        { name: 'Steals', home: 8, away: 7, type: 'number' }
      ];
    } else if (sport.toLowerCase() === 'cricket') {
      mockStats = [
        { name: 'Run Rate', home: 8.2, away: 7.8, type: 'number' },
        { name: 'Powerplay Score', home: 54, away: 48, type: 'number' },
        { name: 'Boundaries (4s/6s)', home: 22, away: 18, type: 'number' },
        { name: 'Dot Balls bowled', home: 38, away: 42, type: 'number' },
        { name: 'Extras', home: 9, away: 6, type: 'number' }
      ];
    } else if (sport.toLowerCase() === 'wwe') {
      mockStats = [
        { name: 'Offensive Control', home: 55, away: 45, type: 'percentage' },
        { name: 'Signature Moves Hit', home: 3, away: 2, type: 'number' },
        { name: 'Near Falls (2-Counts)', home: 4, away: 3, type: 'number' },
        { name: 'Submissions Applied', home: 1, away: 2, type: 'number' }
      ];
    } else {
      // Default: Football / Soccer / Tennis
      mockStats = [
        { name: 'Possession', home: 56, away: 44, type: 'percentage' },
        { name: 'Total Shots', home: 14, away: 9, type: 'number' },
        { name: 'Shots on Target', home: 6, away: 3, type: 'number' },
        { name: 'Corner Kicks', home: 7, away: 4, type: 'number' },
        { name: 'Fouls Committed', home: 11, away: 13, type: 'number' },
        { name: 'Yellow Cards', home: 1, away: 2, type: 'number' }
      ];
    }

    setStats(mockStats);
  }, [sport]);

  return (
    <div className="bg-[#12141a] border border-[#20242e] rounded-2xl p-5 h-[400px] overflow-y-auto">
      {/* Header Info */}
      <div className="flex justify-between items-center pb-3 border-b border-[#20242e] mb-4">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
          {homeTeam}
        </span>
        <span className="text-xs font-black text-white uppercase tracking-widest text-center">
          Match Statistics
        </span>
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider text-right">
          {awayTeam}
        </span>
      </div>

      {/* Stats List */}
      <div className="space-y-4">
        {stats.map((stat, i) => {
          // Calculate percentages for bar rendering
          const total = stat.home + stat.away;
          const homePercent = total > 0 ? (stat.home / total) * 100 : 50;
          const awayPercent = total > 0 ? (stat.away / total) * 100 : 50;

          return (
            <div key={i} className="flex flex-col space-y-1.5">
              {/* Labels & Numbers Row */}
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-white">
                  {stat.home}
                  {stat.type === 'percentage' && '%'}
                </span>
                <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wide">
                  {stat.name}
                </span>
                <span className="text-white">
                  {stat.away}
                  {stat.type === 'percentage' && '%'}
                </span>
              </div>

              {/* Progress Bars */}
              <div className="flex h-2 bg-[#08090a] rounded-full overflow-hidden border border-[#1b1e26]">
                {/* Home Bar (Fill left to right, color green) */}
                <div 
                  style={{ width: `${homePercent}%` }} 
                  className="bg-[#00ff66] h-full rounded-l-full border-r border-[#08090a]/50 shadow-[0_0_5px_rgba(0,255,102,0.5)]"
                ></div>
                {/* Away Bar (Fill right to left, color slate/slate-light) */}
                <div 
                  style={{ width: `${awayPercent}%` }} 
                  className="bg-slate-700 h-full rounded-r-full"
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
