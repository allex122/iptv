'use client';

import React from 'react';
import Link from 'next/link';
import { Match } from '../types/match';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status === 'LIVE';
  const isUpcoming = match.status === 'UPCOMING';
  const isFinished = match.status === 'FINISHED';

  // Helper to generate a consistent gradient color based on team initials
  const getAvatarGradient = (initials: string) => {
    const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
    const gradients = [
      'from-blue-600 to-indigo-800',
      'from-red-600 to-rose-800',
      'from-amber-500 to-orange-700',
      'from-emerald-600 to-teal-800',
      'from-purple-600 to-violet-800',
      'from-pink-600 to-rose-700',
      'from-cyan-500 to-blue-700'
    ];
    return gradients[code % gradients.length];
  };

  return (
    <div className="bg-[#12141a] border border-[#20242e] hover:border-[#00ff66]/40 rounded-2xl p-5 hover:bg-[#151821] transition-all duration-300 group flex flex-col justify-between h-[230px] relative overflow-hidden">
      {/* Top Banner / Card Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#20242e] mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm" role="img" aria-label="league badge">
            {match.leagueBadge}
          </span>
          <span className="text-xs font-bold text-slate-400 truncate max-w-[150px]">
            {match.league}
          </span>
        </div>

        {/* Status Badge */}
        <div>
          {isLive && (
            <span className="inline-flex items-center space-x-1.5 bg-[#00ff66]/10 text-[#00ff66] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#00ff66]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] live-pulse-dot"></span>
              <span>{match.time}</span>
            </span>
          )}
          {isUpcoming && (
            <span className="inline-flex items-center bg-slate-800/40 text-slate-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-slate-800">
              {match.time}
            </span>
          )}
          {isFinished && (
            <span className="inline-flex items-center bg-slate-900/60 text-slate-500 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-slate-900">
              FT
            </span>
          )}
        </div>
      </div>

      {/* Card Content: Teams and Score */}
      <div className="flex items-center justify-between flex-grow px-2 mb-4">
        {/* Home Team */}
        <div className="flex flex-col items-center flex-1 text-center max-w-[90px]">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(match.homeLogo)} flex items-center justify-center text-white font-extrabold text-sm shadow-md border border-slate-700/30 group-hover:scale-105 transition-transform duration-300`}>
            {match.homeLogo}
          </div>
          <span className="text-xs font-bold text-slate-200 mt-2 truncate w-full">
            {match.homeTeam}
          </span>
        </div>

        {/* Score or VS Circle */}
        <div className="flex flex-col items-center justify-center px-4">
          {(isLive || isFinished) && match.scores ? (
            <div className="flex items-center space-x-2 bg-[#08090a] px-3.5 py-1.5 rounded-xl border border-[#20242e]">
              <span className={`text-lg font-black ${isLive ? 'text-[#00ff66]' : 'text-slate-400'}`}>
                {match.scores.home}
              </span>
              <span className="text-xs text-slate-600 font-bold">-</span>
              <span className={`text-lg font-black ${isLive ? 'text-[#00ff66]' : 'text-slate-400'}`}>
                {match.scores.away}
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#08090a] border border-[#20242e] flex items-center justify-center text-[10px] text-slate-500 font-bold">
              VS
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1 text-center max-w-[90px]">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(match.awayLogo)} flex items-center justify-center text-white font-extrabold text-sm shadow-md border border-slate-700/30 group-hover:scale-105 transition-transform duration-300`}>
            {match.awayLogo}
          </div>
          <span className="text-xs font-bold text-slate-200 mt-2 truncate w-full">
            {match.awayTeam}
          </span>
        </div>
      </div>

      {/* Watch Button / Action */}
      <div className="w-full">
        {isFinished ? (
          <button 
            disabled 
            className="w-full text-center py-2.5 bg-slate-900 text-slate-600 rounded-xl text-xs font-extrabold cursor-not-allowed border border-slate-950"
          >
            Match Ended
          </button>
        ) : (
          <Link
            href={`/watch/${match.id}`}
            className="block w-full text-center py-2.5 bg-[#1a1c24] hover:bg-[#00ff66] text-[#00ff66] hover:text-black rounded-xl text-xs font-black transition-all border border-[#262a36] group-hover:border-[#00ff66]/30"
          >
            {isLive ? 'Watch Live Stream ➜' : 'Pre-Stream Available ➜'}
          </Link>
        )}
      </div>
    </div>
  );
}
