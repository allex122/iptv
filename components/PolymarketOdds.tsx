'use client';

import React, { useState, useEffect } from 'react';

interface PolymarketOddsProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}

export default function PolymarketOdds({ matchId, homeTeam, awayTeam }: PolymarketOddsProps) {
  const [prices, setPrices] = useState({ home: 0.55, away: 0.45 });
  const [trends, setTrends] = useState({ home: 'up', away: 'down' });
  const [volume, setVolume] = useState(25000);

  // Initialize deterministic starting prices based on matchId
  useEffect(() => {
    let hash = 0;
    for (let i = 0; i < matchId.length; i++) {
      hash = matchId.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Home price between 0.40 and 0.75
    const seedHome = ((Math.abs(hash) % 35) + 40) / 100;
    const seedAway = parseFloat((1 - seedHome).toFixed(2));
    const seedVol = Math.abs(hash % 90000) + 15000;

    setPrices({ home: seedHome, away: seedAway });
    setVolume(seedVol);
  }, [matchId]);

  // Simulate real-time Polymarket orderbook trades & price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => {
        // Random price fluctuation (-0.02 to +0.02)
        const change = parseFloat(((Math.random() * 0.04) - 0.02).toFixed(2));
        let nextHome = parseFloat((prev.home + change).toFixed(2));
        
        // Boundaries (0.10 to 0.90)
        if (nextHome < 0.15) nextHome = 0.15;
        if (nextHome > 0.85) nextHome = 0.85;

        const nextAway = parseFloat((1 - nextHome).toFixed(2));

        // Determine trends
        setTrends({
          home: nextHome > prev.home ? 'up' : nextHome < prev.home ? 'down' : 'flat',
          away: nextAway > prev.away ? 'up' : nextAway < prev.away ? 'down' : 'flat'
        });

        // Add to total volume
        setVolume((v) => v + Math.floor(Math.random() * 15) + 5);

        return { home: nextHome, away: nextAway };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#12141a] border border-[#20242e] rounded-3xl p-5 shadow-xl mt-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#20242e] mb-4">
        <div className="flex items-center space-x-2">
          {/* Polymarket Blue Logo Emblem */}
          <div className="w-5 h-5 rounded-full bg-[#0072f5] flex items-center justify-center text-white text-[9px] font-black tracking-tighter">
            P
          </div>
          <h4 className="text-[11px] font-black text-white uppercase tracking-wider">
            Polymarket Sentiment Ticker
          </h4>
        </div>
        <span className="text-[8px] bg-[#0072f5]/10 text-[#0072f5] border border-[#0072f5]/20 px-2 py-0.5 rounded font-black tracking-widest uppercase animate-pulse">
          Live Orderbook
        </span>
      </div>

      {/* Main Trade Prices */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Home Team Odds Card */}
        <div className="bg-[#08090a]/50 border border-[#20242e] p-3.5 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">
              {homeTeam} Shares
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-lg font-black text-white font-mono">
                {prices.home.toFixed(2)} USDC
              </span>
              
              {trends.home === 'up' && (
                <span className="text-[9px] text-[#00ff66] font-bold">▲ +{(prices.home * 100).toFixed(0)}%</span>
              )}
              {trends.home === 'down' && (
                <span className="text-[9px] text-[#ff3b30] font-bold">▼ -{(prices.home * 100).toFixed(0)}%</span>
              )}
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-800/40 rounded-full overflow-hidden mt-3">
            <div 
              className="h-full bg-[#0072f5] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${prices.home * 100}%` }}
            />
          </div>
        </div>

        {/* Away Team Odds Card */}
        <div className="bg-[#08090a]/50 border border-[#20242e] p-3.5 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">
              {awayTeam} Shares
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-lg font-black text-white font-mono">
                {prices.away.toFixed(2)} USDC
              </span>
              
              {trends.away === 'up' && (
                <span className="text-[9px] text-[#00ff66] font-bold">▲ +{(prices.away * 100).toFixed(0)}%</span>
              )}
              {trends.away === 'down' && (
                <span className="text-[9px] text-[#ff3b30] font-bold">▼ -{(prices.away * 100).toFixed(0)}%</span>
              )}
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-800/40 rounded-full overflow-hidden mt-3">
            <div 
              className="h-full bg-slate-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${prices.away * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Market Metrics */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#20242e]/60 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
        <span>Volume: <strong className="text-white font-mono">${volume.toLocaleString()} USDC</strong></span>
        <a 
          href="https://polymarket.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#0072f5] hover:underline flex items-center space-x-1"
        >
          <span>View on Polymarket</span>
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
