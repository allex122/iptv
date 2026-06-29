'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import ServerSwitcher from '@/components/ServerSwitcher';
import LiveChat from '@/components/LiveChat';
import MatchStats from '@/components/MatchStats';
import AdPlaceholder from '@/components/AdPlaceholder';
import MatchVoting from '@/components/MatchVoting';
import { Match, StreamServer } from '@/types/match';
import Link from 'next/link';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;

  const [match, setMatch] = useState<Match | null>(null);
  const [otherMatches, setOtherMatches] = useState<Match[]>([]);
  const [activeServer, setActiveServer] = useState<StreamServer | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'stats'>('chat');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch match details and other live matches client-side
  useEffect(() => {
    async function loadWatchData() {
      setLoading(true);
      setError(false);
      try {
        // Fetch all matches to find current match and other sidebar matches
        const res = await fetch('/api/matches');
        if (res.ok) {
          const allMatches: Match[] = await res.json();
          const current = allMatches.find((m) => m.id === matchId);
          
          if (current) {
            setMatch(current);
            // Default to first stream server source if available
            if (current.servers && current.servers.length > 0) {
              setActiveServer(current.servers[0]);
            }
            
            // Set other live matches for sidebar recommendations
            const others = allMatches.filter((m) => m.id !== matchId && m.status !== 'FINISHED');
            setOtherMatches(others);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching watch page data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (matchId) {
      loadWatchData();
    }
  }, [matchId]);

  const handleSelectServer = (serverId: string) => {
    if (!match) return;
    const selected = match.servers.find((s) => s.id === serverId);
    if (selected) {
      setActiveServer(selected);
    }
  };

  // Helper to generate initials avatar gradient
  const getAvatarGradient = (initials: string) => {
    const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
    const gradients = [
      'from-blue-600 to-indigo-800',
      'from-red-600 to-rose-800',
      'from-amber-500 to-orange-700',
      'from-emerald-600 to-teal-800',
      'from-purple-600 to-violet-800'
    ];
    return gradients[code % gradients.length];
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#08090a]">
        <Header />
        <div className="flex-grow max-w-7xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center">
          {/* Shimmer / Spinner loading state */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#00ff66]/20 border-t-[#00ff66] animate-spin"></div>
            <p className="text-slate-400 font-extrabold text-xs uppercase tracking-widest animate-pulse">
              Buffering stream data...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex flex-col min-h-screen bg-[#08090a]">
        <Header />
        <div className="flex-grow max-w-md w-full mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-[#12141a] rounded-full border border-red-500/30 text-red-400 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-white font-extrabold text-lg uppercase">Stream Not Found</h2>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            The stream link might have expired, or the match ID is invalid. Return to the homepage to select another active sport broadcast.
          </p>
          <Link
            href="/"
            className="mt-6 bg-[#00ff66] text-black font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-[#00e059] transition-all"
          >
            ➜ Return to Dashboard
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isLive = match.status === 'LIVE';

  return (
    <div className="flex flex-col min-h-screen bg-[#08090a]">
      {/* Premium Header with navigation and top banner */}
      <Header />

      {/* Watch Arena Main Section */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-bold mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#00ff66]">{match.sport}</span>
          <span>/</span>
          <span className="text-slate-300 max-w-[150px] truncate">{match.league}</span>
        </div>

        {/* 2-Column Responsive Stream Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          
          {/* LEFT COLUMN: Player, Server Switcher, Match Details (70% on lg) */}
          <div className="lg:col-span-7 flex flex-col space-y-5">
            
            {/* The HLS/Iframe Video Player container */}
            <VideoPlayer
              url={activeServer ? activeServer.url : ''}
              type={activeServer ? activeServer.type : 'hls'}
              serverName={activeServer ? activeServer.name : 'No Server'}
            />

            {/* Server Switcher tabs immediately below the player */}
            <ServerSwitcher
              servers={match.servers}
              activeServerId={activeServer ? activeServer.id : ''}
              onSelectServer={handleSelectServer}
            />

            {/* Match Information and Scoreboard */}
            <div className="bg-[#12141a] border border-[#20242e] rounded-3xl p-5 md:p-6">
              
              {/* Top row: League and Venue info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-[#20242e] mb-5">
                <div className="flex items-center space-x-2">
                  <span className="text-sm bg-slate-800/40 p-1.5 rounded-lg border border-slate-700/50">
                    {match.leagueBadge}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">{match.league}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{match.round}</span>
                  </div>
                </div>
                
                {/* Stadium details */}
                <div className="text-[10px] text-slate-500 font-bold flex items-center space-x-1">
                  <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate max-w-[200px]">{match.venue}</span>
                </div>
              </div>

              {/* Middle row: Team logos & Live Scores */}
              <div className="flex items-center justify-between px-2 md:px-8 py-3">
                {/* Home Team */}
                <div className="flex flex-col items-center text-center max-w-[120px] md:max-w-[150px] flex-1">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${getAvatarGradient(match.homeLogo)} flex items-center justify-center text-white font-extrabold text-base md:text-lg shadow-lg border border-slate-700/30`}>
                    {match.homeLogo}
                  </div>
                  <span className="text-xs md:text-sm font-extrabold text-white mt-3 truncate w-full">
                    {match.homeTeam}
                  </span>
                </div>

                {/* Score & Time Display */}
                <div className="flex flex-col items-center justify-center px-4">
                  {match.scores ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-3 bg-[#08090a] px-4 md:px-6 py-2 md:py-3 rounded-2xl border border-[#20242e] shadow-inner">
                        <span className={`text-xl md:text-3xl font-black ${isLive ? 'text-[#00ff66]' : 'text-slate-400'}`}>
                          {match.scores.home}
                        </span>
                        <span className="text-slate-600 font-extrabold text-sm">-</span>
                        <span className={`text-xl md:text-3xl font-black ${isLive ? 'text-[#00ff66]' : 'text-slate-400'}`}>
                          {match.scores.away}
                        </span>
                      </div>
                      
                      {/* Live Flashing status indicator */}
                      <span className="mt-3 inline-flex items-center space-x-1 text-[10px] font-extrabold tracking-widest text-[#00ff66] bg-[#00ff66]/10 px-2.5 py-1 rounded-full uppercase border border-[#00ff66]/20">
                        {isLive && <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] live-pulse-dot mr-1"></span>}
                        {match.status} {isLive && `• ${match.time}`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-slate-500 font-bold text-xs uppercase tracking-widest bg-[#08090a] px-4 py-2 border border-[#20242e] rounded-xl">
                        VS
                      </span>
                      <span className="mt-3 text-[10px] text-slate-400 font-black uppercase bg-[#1d212a] px-2.5 py-1 rounded-full border border-[#20242e]">
                        Starts at {match.time}
                      </span>
                    </div>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center text-center max-w-[120px] md:max-w-[150px] flex-1">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${getAvatarGradient(match.awayLogo)} flex items-center justify-center text-white font-extrabold text-base md:text-lg shadow-lg border border-slate-700/30`}>
                    {match.awayLogo}
                  </div>
                  <span className="text-xs md:text-sm font-extrabold text-white mt-3 truncate w-full">
                    {match.awayTeam}
                  </span>
                </div>
              </div>
              <MatchVoting matchId={match.id} homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
            </div>

            {/* Monetization space below details */}
            <div className="bg-[#12141a]/40 border border-dashed border-[#2e3545] p-3 rounded-2xl">
              <AdPlaceholder type="banner" />
            </div>

          </div>

          {/* RIGHT COLUMN: Chat/Stats widget, Advertising, Other streams (30% on lg) */}
          <div className="lg:col-span-3 flex flex-col space-y-6">
            
            {/* Tabbed Side Panel: Live Chat / Stats */}
            <div className="flex flex-col">
              
              {/* Tab Selector Buttons */}
              <div className="flex bg-[#12141a] border border-[#20242e] p-1.5 rounded-t-2xl border-b-0 gap-1.5">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 text-center py-2 text-xs font-black uppercase rounded-xl transition-all cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💬 Live Chat
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex-1 text-center py-2 text-xs font-black uppercase rounded-xl transition-all cursor-pointer ${
                    activeTab === 'stats'
                      ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📊 Match Stats
                </button>
              </div>

              {/* Tab Content Panels */}
              {activeTab === 'chat' ? (
                <LiveChat />
              ) : (
                <MatchStats 
                  homeTeam={match.homeTeam} 
                  awayTeam={match.awayTeam} 
                  sport={match.sport} 
                />
              )}
            </div>

            {/* Sidebar Sticky Ad Banner (300x250 Placement) */}
            <div className="sticky top-24">
              <AdPlaceholder type="sidebar" className="mb-6" />

              {/* Other Live Matches list */}
              <div className="bg-[#12141a] border border-[#20242e] rounded-2xl p-4">
                <h3 className="text-white font-extrabold text-xs uppercase tracking-wider border-l-2 border-[#00ff66] pl-2 mb-3">
                  Other Live Arenas
                </h3>
                
                {otherMatches.length > 0 ? (
                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                    {otherMatches.map((m) => (
                      <Link 
                        key={m.id}
                        href={`/watch/${m.id}`}
                        className="block p-2.5 bg-[#08090a] border border-[#1b1e26] hover:border-[#00ff66]/40 hover:bg-[#12141a]/60 rounded-xl transition-all group"
                      >
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-1.5">
                          <span>{m.league}</span>
                          <span className="text-[#00ff66] animate-pulse">🔴 {m.time}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-slate-200 group-hover:text-white truncate max-w-[80px]">
                            {m.homeTeam}
                          </span>
                          {m.scores ? (
                            <span className="text-slate-400 font-black px-1.5 py-0.5 bg-[#12141a] rounded border border-slate-800">
                              {m.scores.home} - {m.scores.away}
                            </span>
                          ) : (
                            <span className="text-[9px] text-slate-500 font-bold">vs</span>
                          )}
                          <span className="font-extrabold text-slate-200 group-hover:text-white truncate max-w-[80px] text-right">
                            {m.awayTeam}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 font-bold text-center py-4">
                    No other live matches streaming.
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
