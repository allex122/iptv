'use client';

import React, { useState, useEffect } from 'react';

interface LiveFanZoneProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  left: number;
}

export default function LiveFanZone({ matchId, homeTeam, awayTeam }: LiveFanZoneProps) {
  const [cheerTaps, setCheerTaps] = useState({ home: 120, away: 110 });
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);

  // Generate seed taps based on matchId
  useEffect(() => {
    let hash = 0;
    for (let i = 0; i < matchId.length; i++) {
      hash = matchId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seedHome = Math.abs((hash % 100) + 150);
    const seedAway = Math.abs(((hash >> 3) % 100) + 150);
    setCheerTaps({ home: seedHome, away: seedAway });
  }, [matchId]);

  // Simulate other "live fans" tapping in the background to make the battle feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      setCheerTaps((prev) => {
        // Randomly add 1 to 3 taps to a random team
        const homeAdd = Math.floor(Math.random() * 3);
        const awayAdd = Math.floor(Math.random() * 3);
        return {
          home: prev.home + homeAdd,
          away: prev.away + awayAdd
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleCheer = (team: 'home' | 'away') => {
    setCheerTaps((prev) => ({
      ...prev,
      [team]: prev[team] + 3
    }));

    // Trigger floating cheering emoji
    triggerFloatingEmoji(team === 'home' ? '📣' : '🥁');
  };

  const triggerFloatingEmoji = (emoji: string) => {
    const newEmoji: FloatingEmoji = {
      id: Date.now() + Math.random(),
      emoji,
      left: Math.random() * 80 + 10 // Random horizontal offset (10% to 90%)
    };

    setFloatingEmojis((prev) => [...prev, newEmoji]);
    
    // Automatically clean up emoji after animation completes
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
    }, 1400);
  };

  const totalTaps = cheerTaps.home + cheerTaps.away;
  const pctHome = totalTaps > 0 ? Math.round((cheerTaps.home / totalTaps) * 100) : 50;
  const pctAway = 100 - pctHome;

  return (
    <div className="relative mt-4 bg-[#12141a] border border-[#20242e] rounded-3xl p-4 overflow-hidden shadow-xl">
      
      {/* Dynamic Keyframe Injection for self-contained smooth floating animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes emojiFloatUp {
          0% {
            transform: translateY(0) scale(0.8) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-15px) scale(1.2) rotate(-5deg);
          }
          100% {
            transform: translateY(-160px) scale(1.5) rotate(15deg);
            opacity: 0;
          }
        }
        .emoji-float {
          position: absolute;
          bottom: 20px;
          animation: emojiFloatUp 1.4s cubic-bezier(0.08, 0.82, 0.17, 1) forwards;
          pointer-events: none;
          z-index: 30;
          font-size: 24px;
        }
      `}} />

      {/* Floating Emojis Canvas Overlay */}
      {floatingEmojis.map((e) => (
        <div 
          key={e.id} 
          className="emoji-float"
          style={{ left: `${e.left}%` }}
        >
          {e.emoji}
        </div>
      ))}

      {/* Title */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3b30] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff3b30]"></span>
          </span>
          <h4 className="text-[10px] font-black text-white uppercase tracking-wider">
            Live Fan Zone: Cheer Battle
          </h4>
        </div>
        <span className="text-[8px] bg-slate-800 text-slate-400 border border-slate-700/50 px-2 py-0.5 rounded font-black tracking-widest uppercase">
          {totalTaps} Cheers
        </span>
      </div>

      {/* 1. CHEER BATTLE TAP BUTTONS & DUELING METER */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Home Cheer */}
        <button
          onClick={() => handleCheer('home')}
          className="relative bg-emerald-950/20 hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl py-2.5 px-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 group"
        >
          <span className="text-[10px] font-black text-white uppercase tracking-tight block truncate max-w-full">
            Cheer {homeTeam}
          </span>
          <span className="text-[9px] font-bold text-emerald-400 mt-0.5 block tracking-widest">
            TAP 📣 +3
          </span>
          <span className="absolute -top-1 -right-1 text-[8px] bg-emerald-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded-full shadow opacity-0 group-active:opacity-100 transition-opacity">
            +3
          </span>
        </button>

        {/* Away Cheer */}
        <button
          onClick={() => handleCheer('away')}
          className="relative bg-red-950/20 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 rounded-2xl py-2.5 px-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 group"
        >
          <span className="text-[10px] font-black text-white uppercase tracking-tight block truncate max-w-full">
            Cheer {awayTeam}
          </span>
          <span className="text-[9px] font-bold text-red-400 mt-0.5 block tracking-widest">
            TAP 🥁 +3
          </span>
          <span className="absolute -top-1 -right-1 text-[8px] bg-red-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded-full shadow opacity-0 group-active:opacity-100 transition-opacity">
            +3
          </span>
        </button>
      </div>

      {/* Dueling Percentage Progress Bar */}
      <div className="relative h-6 w-full bg-slate-800/40 rounded-full overflow-hidden border border-slate-700/30 flex text-[9px] font-black">
        {/* Home Share */}
        <div
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 flex items-center pl-3 text-white transition-all duration-500 ease-out shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          style={{ width: `${pctHome}%` }}
        >
          {pctHome >= 20 && `${pctHome}%`}
        </div>
        {/* Split line */}
        <div className="w-[1.5px] h-full bg-slate-950 z-10"></div>
        {/* Away Share */}
        <div
          className="h-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-end pr-3 text-white transition-all duration-500 ease-out shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          style={{ width: `${pctAway}%` }}
        >
          {pctAway >= 20 && `${pctAway}%`}
        </div>
      </div>

      {/* 2. FLOATING EMOJI REACTIONS PANEL */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#20242e]/60">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          TAP REACTIONS:
        </span>
        <div className="flex space-x-1.5">
          {['⚽', '🔥', '😮', '😂', '👏'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                triggerFloatingEmoji(emoji);
                setActiveReaction(emoji);
                setTimeout(() => setActiveReaction(null), 150);
              }}
              className={`w-8 h-8 rounded-full bg-[#08090a] border border-[#20242e] hover:border-slate-500 flex items-center justify-center text-sm cursor-pointer hover:bg-slate-800 transition-all duration-100 transform active:scale-75 ${
                activeReaction === emoji ? 'scale-125 border-emerald-500 bg-emerald-950/20' : ''
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
