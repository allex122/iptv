'use client';

import React, { useState, useEffect } from 'react';

interface MatchVotingProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}

export default function MatchVoting({ matchId, homeTeam, awayTeam }: MatchVotingProps) {
  const [votedOption, setVotedOption] = useState<'home' | 'draw' | 'away' | null>(null);
  const [voteData, setVoteData] = useState({ home: 0, draw: 0, away: 0 });

  // Generate deterministic seed votes based on matchId
  useEffect(() => {
    let hash = 0;
    for (let i = 0; i < matchId.length; i++) {
      hash = matchId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seedHome = Math.abs((hash % 45) + 30); // 30 - 75
    const seedAway = Math.abs(((hash >> 2) % 35) + 20); // 20 - 55
    const seedDraw = Math.abs(((hash >> 4) % 15) + 5); // 5 - 20

    // Retrieve previous user vote from localStorage
    const savedVote = localStorage.getItem(`cyber2-vote-${matchId}`);
    if (savedVote === 'home' || savedVote === 'draw' || savedVote === 'away') {
      setVotedOption(savedVote);
      setVoteData({
        home: seedHome + (savedVote === 'home' ? 1 : 0),
        draw: seedDraw + (savedVote === 'draw' ? 1 : 0),
        away: seedAway + (savedVote === 'away' ? 1 : 0)
      });
    } else {
      setVoteData({ home: seedHome, draw: seedDraw, away: seedAway });
    }
  }, [matchId]);

  const handleVote = (option: 'home' | 'draw' | 'away') => {
    if (votedOption) return; // Prevent double voting

    localStorage.setItem(`cyber2-vote-${matchId}`, option);
    setVotedOption(option);
    setVoteData((prev) => ({
      ...prev,
      [option]: prev[option] + 1
    }));
  };

  const totalVotes = voteData.home + voteData.draw + voteData.away;
  const pctHome = totalVotes > 0 ? Math.round((voteData.home / totalVotes) * 100) : 0;
  const pctDraw = totalVotes > 0 ? Math.round((voteData.draw / totalVotes) * 100) : 0;
  const pctAway = totalVotes > 0 ? Math.round((voteData.away / totalVotes) * 100) : 0;

  return (
    <div className="mt-6 pt-5 border-t border-[#20242e] w-full">
      <div className="flex items-center space-x-2 mb-4">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]"></span>
        </span>
        <h4 className="text-[11px] font-black text-white uppercase tracking-wider">
          Match Outcome Predictor
        </h4>
      </div>

      {!votedOption ? (
        /* VOTE SELECTION BUTTONS */
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => handleVote('home')}
            className="bg-[#08090a] hover:bg-[#00ff66]/10 border border-[#20242e] hover:border-[#00ff66]/50 py-3 px-2 rounded-xl text-center cursor-pointer transition-all duration-300 group"
          >
            <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-tight block truncate">
              {homeTeam}
            </span>
            <span className="text-[9px] font-bold text-slate-600 group-hover:text-[#00ff66] uppercase mt-0.5 block tracking-widest">
              Predict Win
            </span>
          </button>

          <button
            onClick={() => handleVote('draw')}
            className="bg-[#08090a] hover:bg-slate-800/40 border border-[#20242e] hover:border-slate-700 py-3 px-2 rounded-xl text-center cursor-pointer transition-all duration-300 group"
          >
            <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-tight block">
              Draw
            </span>
            <span className="text-[9px] font-bold text-slate-600 group-hover:text-slate-400 uppercase mt-0.5 block tracking-widest">
              Predict Tie
            </span>
          </button>

          <button
            onClick={() => handleVote('away')}
            className="bg-[#08090a] hover:bg-[#ff3b30]/10 border border-[#20242e] hover:border-[#ff3b30]/50 py-3 px-2 rounded-xl text-center cursor-pointer transition-all duration-300 group"
          >
            <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-tight block truncate">
              {awayTeam}
            </span>
            <span className="text-[9px] font-bold text-slate-600 group-hover:text-[#ff3b30] uppercase mt-0.5 block tracking-widest">
              Predict Win
            </span>
          </button>
        </div>
      ) : (
        /* VOTE PERCENTAGE RESULTS SHOWCASE */
        <div className="space-y-3 bg-[#08090a]/50 p-4 rounded-2xl border border-[#20242e]">
          {/* Home Win Bar */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
              <span className="text-white flex items-center space-x-1.5">
                <span className="truncate max-w-[120px]">{homeTeam} Win</span>
                {votedOption === 'home' && (
                  <span className="text-[8px] bg-[#00ff66]/10 text-[#00ff66] px-1.5 py-0.5 rounded border border-[#00ff66]/20">
                    Your Vote
                  </span>
                )}
              </span>
              <span className="text-[#00ff66] font-black">{pctHome}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                style={{ width: `${pctHome}%` }}
              />
            </div>
          </div>

          {/* Draw Bar */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
              <span className="text-white flex items-center space-x-1.5">
                <span>Draw</span>
                {votedOption === 'draw' && (
                  <span className="text-[8px] bg-slate-700/20 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/40">
                    Your Vote
                  </span>
                )}
              </span>
              <span className="text-slate-400 font-black">{pctDraw}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${pctDraw}%` }}
              />
            </div>
          </div>

          {/* Away Win Bar */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
              <span className="text-white flex items-center space-x-1.5">
                <span className="truncate max-w-[120px]">{awayTeam} Win</span>
                {votedOption === 'away' && (
                  <span className="text-[8px] bg-[#ff3b30]/10 text-[#ff3b30] px-1.5 py-0.5 rounded border border-[#ff3b30]/20">
                    Your Vote
                  </span>
                )}
              </span>
              <span className="text-[#ff3b30] font-black">{pctAway}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                style={{ width: `${pctAway}%` }}
              />
            </div>
          </div>

          <div className="text-[9px] text-slate-500 font-bold text-center pt-1 uppercase tracking-wider">
            Total {totalVotes} predictions submitted by visitors
          </div>
        </div>
      )}
    </div>
  );
}
