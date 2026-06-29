'use client';

import React, { useState, useEffect } from 'react';

interface MatchVotingProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  status: 'LIVE' | 'UPCOMING' | 'FINISHED';
  scores?: { home: number; away: number };
}

const PRIZES = [
  { code: 'VIP-FREE-7DAYS', desc: '7 Days Free Premium VIP Pass (Ad-Free HD Streams)' },
  { code: 'CYBER-50OFF', desc: '50% Discount Coupon for Cyber2 Shop' },
  { code: 'WINNER-GOLD-30', desc: 'Gold Ticket Access code to Premium Channels' },
  { code: 'NFT-CARD-CLAIM', desc: 'Exclusive Winner Digital Badge NFT' }
];

// Seed winner alerts for the scrolling marquee ticker
const WINNER_ALERTS = [
  "🏆 [User_902] predicted correctly and won a 7-Day VIP Pass!",
  "🔥 [Gooner_Boy] predicted Draw and won a 50% Discount Code!",
  "💎 [MessiMagic] predicted correctly and won a Gold Ticket Voucher!",
  "⚡ [CR7_G.O.A.T] predicted Home win and won a 7-Day VIP Pass!",
  "🎟️ [Visitor_403] predicted Draw and won a Gold Ticket Voucher!",
  "👑 [Admin_Test] predicted Away win and won an Exclusive Badge NFT!"
];

export default function MatchVoting({ matchId, homeTeam, awayTeam, status: initialStatus, scores }: MatchVotingProps) {
  const [votedOption, setVotedOption] = useState<'home' | 'draw' | 'away' | null>(null);
  const [voteData, setVoteData] = useState({ home: 0, draw: 0, away: 0 });
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [prize, setPrize] = useState<{ code: string; desc: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync status on load
  useEffect(() => {
    setCurrentStatus(initialStatus);
  }, [initialStatus]);

  // Generate deterministic seed votes based on matchId
  useEffect(() => {
    let hash = 0;
    for (let i = 0; i < matchId.length; i++) {
      hash = matchId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seedHome = Math.abs((hash % 45) + 30);
    const seedAway = Math.abs(((hash >> 2) % 35) + 20);
    const seedDraw = Math.abs(((hash >> 4) % 15) + 5);

    // Retrieve previous user vote from localStorage
    const savedVote = localStorage.getItem(`cyber2-vote-${matchId}`);
    if (savedVote === 'home' || savedVote === 'draw' || savedVote === 'away') {
      setVotedOption(savedVote);
      setVoteData({
        home: seedHome + (savedVote === 'home' ? 1 : 0),
        draw: seedDraw + (savedVote === 'draw' ? 1 : 0),
        away: seedAway + (savedVote === 'away' ? 1 : 0)
      });

      // Retrieve saved prize if already unlocked
      const savedPrizeCode = localStorage.getItem(`cyber2-prize-${matchId}`);
      if (savedPrizeCode) {
        const found = PRIZES.find(p => p.code === savedPrizeCode);
        if (found) setPrize(found);
      }
    } else {
      setVoteData({ home: seedHome, draw: seedDraw, away: seedAway });
    }
  }, [matchId]);

  const handleVote = (option: 'home' | 'draw' | 'away') => {
    // If the match is already finished before voting, block votes completely
    if (initialStatus === 'FINISHED') return;
    if (votedOption) return;

    localStorage.setItem(`cyber2-vote-${matchId}`, option);
    setVotedOption(option);
    setVoteData((prev) => ({
      ...prev,
      [option]: prev[option] + 1
    }));
  };

  const handleClaimPrize = () => {
    if (prize) return;
    // Select a random prize
    const randomPrize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
    localStorage.setItem(`cyber2-prize-${matchId}`, randomPrize.code);
    setPrize(randomPrize);
  };

  const copyToClipboard = () => {
    if (!prize) return;
    navigator.clipboard.writeText(prize.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine actual winner based on final scores
  let winner: 'home' | 'draw' | 'away' = 'draw';
  if (scores) {
    if (scores.home > scores.away) winner = 'home';
    else if (scores.home < scores.away) winner = 'away';
  }

  const isPredictionCorrect = votedOption === winner;
  const totalVotes = voteData.home + voteData.draw + voteData.away;
  const pctHome = totalVotes > 0 ? Math.round((voteData.home / totalVotes) * 100) : 0;
  const pctDraw = totalVotes > 0 ? Math.round((voteData.draw / totalVotes) * 100) : 0;
  const pctAway = totalVotes > 0 ? Math.round((voteData.away / totalVotes) * 100) : 0;

  // Render winner alerts twice to enable seamless looping marquee scrolling
  const marqueeItems = [...WINNER_ALERTS, ...WINNER_ALERTS];

  return (
    <div className="mt-6 pt-5 border-t border-[#20242e] w-full">
      
      {/* 1. SCROLLING WINNERS TICKER MARQUEE */}
      <div className="w-full overflow-hidden bg-[#08090a] border border-[#20242e] py-1.5 px-3 rounded-xl mb-4 flex items-center space-x-3">
        <span className="flex-shrink-0 text-[8px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
          Winner Alert
        </span>
        <div className="relative flex overflow-x-hidden text-[9px] text-slate-400 font-extrabold uppercase tracking-wider w-full">
          <div className="animate-marquee-scroll whitespace-nowrap flex space-x-12">
            {marqueeItems.map((item, idx) => (
              <span key={idx} className="flex-shrink-0 flex items-center space-x-1">
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]"></span>
          </span>
          <h4 className="text-[11px] font-black text-white uppercase tracking-wider">
            Match Outcome Predictor
          </h4>
        </div>
        
        {/* Test Mode Switcher - only show if the match is not finished yet */}
        {initialStatus !== 'FINISHED' && currentStatus !== 'FINISHED' && votedOption && (
          <button 
            onClick={() => setCurrentStatus('FINISHED')}
            className="text-[8px] bg-slate-800 text-slate-400 hover:text-white px-2 py-0.5 rounded border border-slate-700/50 cursor-pointer transition-colors"
          >
            ⚙️ Test Match End
          </button>
        )}
      </div>

      {initialStatus === 'FINISHED' ? (
        /* BLOCKED SCREEN: MATCH ALREADY FINISHED BEFORE VOTE */
        <div className="bg-[#08090a]/50 p-4 rounded-2xl border border-[#20242e] text-center">
          <div className="text-xl mb-1">🔒</div>
          <h5 className="text-slate-400 text-xs font-black uppercase tracking-wider">Predictions Closed</h5>
          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed max-w-xs mx-auto">
            This match is already finished. Outcome predictions are only available for live or upcoming fixtures.
          </p>
        </div>
      ) : !votedOption ? (
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
        /* VOTE PERCENTAGE RESULTS SHOWCASE & REWARDS */
        <div className="space-y-4">
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
          </div>

          {/* PRIZE DISPLAY SECTION - ONLY EVALUATE IF THE MATCH IS ENDED (simulated or real status) */}
          {currentStatus === 'FINISHED' ? (
            isPredictionCorrect ? (
              /* Correct Prediction Screen */
              <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-2xl text-center flex flex-col items-center">
                <div className="text-xl mb-1">🎉</div>
                <h5 className="text-[#00ff66] text-xs font-black uppercase tracking-wider">Correct Prediction!</h5>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed max-w-xs">
                  Your prediction was correct! Claim your random winner code below.
                </p>

                {!prize ? (
                  <button
                    onClick={handleClaimPrize}
                    className="mt-3 bg-[#00ff66] hover:bg-[#00e059] text-black font-extrabold text-[10px] uppercase tracking-wider px-5 py-2 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.15)]"
                  >
                    🎁 Unlock Random Reward
                  </button>
                ) : (
                  /* Revealed Reward Code */
                  <div className="mt-3.5 w-full bg-[#08090a] border border-[#20242e] p-3 rounded-xl flex flex-col items-center">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">{prize.desc}</span>
                    <div className="flex items-center space-x-2 mt-2 w-full max-w-[220px]">
                      <span className="bg-[#12141a] border border-[#20242e] text-white font-mono text-xs font-bold py-1.5 px-3 rounded-lg text-center flex-grow select-all">
                        {prize.code}
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className={`text-[10px] font-black px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          copied 
                            ? 'bg-emerald-500/10 text-[#00ff66] border-emerald-500/30' 
                            : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Incorrect Prediction Screen */
              <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-2xl text-center flex flex-col items-center">
                <div className="text-xl mb-1">😢</div>
                <h5 className="text-slate-400 text-xs font-black uppercase tracking-wider">Prediction Incorrect</h5>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed max-w-xs">
                  Your prediction did not match the final outcome. Better luck next time!
                </p>
              </div>
            )
          ) : (
            /* Live/Upcoming Info Display */
            <div className="bg-[#12141a]/40 border border-dashed border-[#20242e] p-3 rounded-2xl text-center">
              <p className="text-[10px] text-slate-500 font-bold leading-normal">
                Prediction locked! Return here once the match ends. Correct predictions will unlock a random reward code!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
