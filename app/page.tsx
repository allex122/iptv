'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryFilters from '@/components/CategoryFilters';
import DatePicker from '@/components/DatePicker';
import MatchCard from '@/components/MatchCard';
import AdPlaceholder from '@/components/AdPlaceholder';
import { Match } from '@/types/match';

export default function Home() {
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedDate, setSelectedDate] = useState('2026-06-29'); // Defaults to Live Now date
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch matches from local API route
  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedSport && selectedSport !== 'all') {
          queryParams.append('sport', selectedSport);
        }
        if (selectedDate) {
          queryParams.append('date', selectedDate);
        }
        
        const response = await fetch(`/api/matches?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setMatches(data);
        }
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [selectedSport, selectedDate]);

  // Client-side search filtering on loaded data
  const filteredMatches = matches.filter((match) => {
    const matchesSearch = 
      match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.league.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate quick stats
  const liveCount = matches.filter(m => m.status === 'LIVE').length;
  const upcomingCount = matches.filter(m => m.status === 'UPCOMING').length;

  return (
    <div className="flex flex-col min-h-screen bg-[#08090a]">
      {/* Sticky Premium Header */}
      <Header />

      {/* Main Page Layout Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section / Hero Stats Banner */}
        <section className="mb-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#12141a] to-[#161b26] border border-[#20242e] rounded-3xl p-6 md:p-8">
            {/* Athletic Background Neon Glow Accent */}
            <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#00ff66]/5 blur-[80px] pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <span className="text-[10px] bg-[#00ff66]/10 text-[#00ff66] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-[#00ff66]/20">
                  ⚡ HIGH SPEED STREAMING
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white mt-3 uppercase tracking-tight">
                  Premium Live Match Center
                </h1>
                <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
                  Watch live sports streams in full HD with multiple backup servers, zero lag, and instant real-time live score updates.
                </p>
              </div>

              {/* Stats Widgets */}
              <div className="flex space-x-3 sm:space-x-4">
                <div className="bg-[#08090a]/80 border border-[#20242e] px-4 py-3 rounded-2xl min-w-[100px] sm:min-w-[120px] text-center">
                  <span className="block text-2xl font-black text-[#00ff66] leading-none">
                    {liveCount}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5">
                    Live Now
                  </span>
                </div>
                <div className="bg-[#08090a]/80 border border-[#20242e] px-4 py-3 rounded-2xl min-w-[100px] sm:min-w-[120px] text-center">
                  <span className="block text-2xl font-black text-white leading-none">
                    {upcomingCount}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5">
                    Upcoming
                  </span>
                </div>
                <div className="hidden sm:block bg-[#08090a]/80 border border-[#20242e] px-4 py-3 rounded-2xl min-w-[120px] text-center">
                  <span className="block text-2xl font-black text-slate-400 leading-none">
                    HD / 4K
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5">
                    Stream Quality
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Filters Area */}
        <section className="bg-[#12141a] border border-[#20242e] rounded-3xl p-5 mb-8">
          <div className="flex flex-col space-y-4">
            
            {/* Row 1: Date tabs and Search Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <DatePicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              
              {/* Responsive Search Input */}
              <div className="relative w-full lg:max-w-xs">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Filter by team or league..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#08090a] border border-[#20242e] focus:border-[#00ff66]/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Row 2: Category Filter Buttons */}
            <CategoryFilters selectedSport={selectedSport} onSelectSport={setSelectedSport} />
          </div>
        </section>

        {/* Matches Grid Dashboard */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] live-pulse-dot"></span>
              <span>Available Match Streams</span>
            </h2>
            <span className="text-xs text-slate-400 font-bold">
              Showing {filteredMatches.length} matches
            </span>
          </div>

          {/* Shimmer Loader Skeletons */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#12141a] border border-[#20242e] rounded-2xl p-5 h-[230px] animate-pulse flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-28 bg-slate-800 rounded"></div>
                    <div className="h-6 w-16 bg-slate-800 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center my-6">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-800"></div>
                      <div className="h-3 w-16 bg-slate-800 rounded"></div>
                    </div>
                    <div className="h-6 w-12 bg-slate-800 rounded"></div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-800"></div>
                      <div className="h-3 w-16 bg-slate-800 rounded"></div>
                    </div>
                  </div>
                  <div className="h-10 w-full bg-slate-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : filteredMatches.length > 0 ? (
            /* Main Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            /* Empty State Container */
            <div className="bg-[#12141a] border border-[#20242e] rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="p-4 bg-[#08090a] rounded-full border border-[#20242e] text-slate-500 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 className="text-white font-extrabold text-base uppercase">No Streams Scheduled</h3>
              <p className="text-slate-400 text-xs mt-1.5 max-w-sm">
                We couldn't find any match broadcasts matching this category or date. Try selecting another date tab or checking back soon.
              </p>
            </div>
          )}
        </section>

        {/* Dynamic Mid-Page Banner space (High CTR Placement) */}
        <section className="mb-10">
          <AdPlaceholder type="banner" />
        </section>

      </main>

      {/* Global Minimal Footer */}
      <Footer />
    </div>
  );
}
