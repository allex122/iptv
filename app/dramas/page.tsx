'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface Episode {
  ep: number;
  title: string;
  videoUrl: string;
  isFree: boolean;
  coinCost?: number;
}

interface Drama {
  id: string;
  title: string;
  originalCreator: string;
  coverUrl: string;
  description: string;
  episodes: Episode[];
}

export default function DramasPage() {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [selectedDrama, setSelectedDrama] = useState<Drama | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [unlockedEpisodes, setUnlockedEpisodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);

  // Fetch dramas and load unlocked episode statuses from localStorage
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dramas');
        const data = await res.json();
        setDramas(data);
        if (data.length > 0) {
          setSelectedDrama(data[0]);
          setActiveEpisode(data[0].episodes[0]);
        }
      } catch (err) {
        console.error('Failed to load dramas:', err);
      } finally {
        setLoading(false);
      }
    }

    const storedUnlocked = localStorage.getItem('cyber2-unlocked-episodes');
    if (storedUnlocked) {
      setUnlockedEpisodes(JSON.parse(storedUnlocked));
    }

    loadData();
  }, []);

  const isEpisodePlayable = (episode: Episode) => {
    if (episode.isFree) return true;
    if (!selectedDrama) return false;
    const unlockKey = `${selectedDrama.id}-ep${episode.ep}`;
    return unlockedEpisodes.includes(unlockKey);
  };

  const handleUnlock = (episode: Episode) => {
    if (!selectedDrama) return;
    const cost = episode.coinCost || 5;
    const walletBalance = localStorage.getItem('cyber2-coins');
    const currentCoins = walletBalance ? parseInt(walletBalance) : 100;

    if (currentCoins < cost) {
      setUnlockMessage('❌ Insufficient coins! Watch streams and claim scratch cards to earn more coins.');
      setTimeout(() => setUnlockMessage(null), 4000);
      return;
    }

    // Deduct coins and update storage
    const newBalance = currentCoins - cost;
    localStorage.setItem('cyber2-coins', newBalance.toString());
    
    // Add to unlocked episodes list
    const unlockKey = `${selectedDrama.id}-ep${episode.ep}`;
    const newUnlocked = [...unlockedEpisodes, unlockKey];
    setUnlockedEpisodes(newUnlocked);
    localStorage.setItem('cyber2-unlocked-episodes', JSON.stringify(newUnlocked));

    // Dispatch global events to sync header coin display
    window.dispatchEvent(new Event('cyber2-coins-updated'));

    setUnlockMessage('✅ Episode unlocked successfully!');
    setTimeout(() => setUnlockMessage(null), 3000);
    setActiveEpisode(episode);
  };

  const selectEpisode = (episode: Episode) => {
    if (isEpisodePlayable(episode)) {
      setActiveEpisode(episode);
    } else {
      setActiveEpisode(episode); // Show the lock overlay
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#08090a] text-slate-100 font-sans selection:bg-[#00ff66]/30 selection:text-white">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8 border-l-4 border-[#00ff66] pl-4">
          <h1 className="text-3xl font-black uppercase tracking-wider text-white">
            🎭 Micro Drama Theater
          </h1>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">
            Watch short bite-sized thrillers. Unlock premium episodes with coins!
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-[#00ff66] animate-spin"></div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Loading Cinema Arena...</span>
          </div>
        ) : selectedDrama && activeEpisode ? (
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Middle Columns: Video Player & Drama Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* VIDEO PLAYER ARENA */}
              <div className="relative aspect-video bg-black rounded-3xl border border-[#20242e] overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                {isEpisodePlayable(activeEpisode) ? (
                  activeEpisode.videoUrl.includes('youtube.com') || activeEpisode.videoUrl.includes('youtu.be') || activeEpisode.videoUrl.includes('/embed/') ? (
                    <iframe
                      key={activeEpisode.videoUrl}
                      src={activeEpisode.videoUrl}
                      className="w-full h-full object-contain border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={activeEpisode.videoUrl}
                      src={activeEpisode.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  /* Premium Lock Screen */
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#08090a]/95 text-center p-6 z-20">
                    <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse">
                      🔒
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">
                      Premium Episode locked
                    </h3>
                    <p className="text-slate-400 text-xs max-w-sm mt-2 leading-relaxed">
                      Episode {activeEpisode.ep}: &ldquo;{activeEpisode.title}&rdquo; is premium. Unlock this episode using your coins!
                    </p>

                    <button
                      onClick={() => handleUnlock(activeEpisode)}
                      className="mt-6 inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 cursor-pointer"
                    >
                      <span>🪙 Unlock for {activeEpisode.coinCost || 5} Coins</span>
                    </button>
                    
                    {unlockMessage && (
                      <p className="mt-4 text-xs font-semibold px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200">
                        {unlockMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Title and Action Panel */}
              <div className="bg-[#12141a] border border-[#20242e] rounded-3xl p-6">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                      Now Playing
                    </span>
                    <h2 className="text-2xl font-black text-white uppercase mt-2">
                      {selectedDrama.title}
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">
                      Creator: <span className="text-slate-300 font-bold">{selectedDrama.originalCreator}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-[#08090a] px-3 py-1.5 rounded-xl border border-[#1b1e26]">
                      Ep {activeEpisode.ep}: {activeEpisode.title}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                      activeEpisode.isFree
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {activeEpisode.isFree ? 'Free' : 'Premium'}
                    </span>
                  </div>
                </div>

                <p className="text-slate-400 text-xs mt-4 leading-relaxed border-t border-[#1d212a] pt-4">
                  {selectedDrama.description}
                </p>
              </div>

            </div>

            {/* Right Column: Episodes Playlist & Side Ads */}
            <div className="space-y-6">
              
              {/* Episodes Playlist Box */}
              <div className="bg-[#12141a] border border-[#20242e] rounded-3xl p-5">
                <h3 className="text-white font-extrabold text-xs uppercase tracking-wider border-l-2 border-[#00ff66] pl-2 mb-4">
                  Episode List
                </h3>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {selectedDrama.episodes.map((ep) => {
                    const isPlayable = isEpisodePlayable(ep);
                    const isActive = activeEpisode.ep === ep.ep;
                    return (
                      <button
                        key={ep.ep}
                        onClick={() => selectEpisode(ep)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                          isActive
                            ? 'bg-[#00ff66]/10 border-[#00ff66] text-white'
                            : 'bg-[#08090a] border-[#1b1e26] hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <span className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center ${
                            isActive
                              ? 'bg-[#00ff66] text-black'
                              : 'bg-slate-800 text-slate-400 group-hover:bg-[#00ff66]/20 group-hover:text-[#00ff66]'
                          }`}>
                            {ep.ep}
                          </span>
                          <span className="text-xs font-bold truncate group-hover:text-white">
                            {ep.title}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {!ep.isFree && !isPlayable && (
                            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center space-x-0.5">
                              <span>🪙</span>
                              <span>{ep.coinCost || 5}</span>
                            </span>
                          )}
                          <span className="text-slate-500 text-xs">
                            {ep.isFree ? (
                              '🔓'
                            ) : isPlayable ? (
                              '🔓'
                            ) : (
                              '🔒'
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Coins Farming Helper Card */}
              <div className="bg-gradient-to-br from-[#12141a] to-[#18120d] border border-amber-500/20 rounded-3xl p-5 shadow-lg">
                <div className="flex items-center space-x-2 text-amber-400 mb-2">
                  <span className="text-lg">💡</span>
                  <h4 className="text-xs font-black uppercase tracking-wider">How to earn Coins?</h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Earn more coins to unlock premium episodes! Every 15 minutes of watching live sports matches unlocks a <span className="text-amber-400 font-bold">Lucky Scratch Card</span>. Scratch the cards to receive coupon codes and up to <span className="text-amber-400 font-bold">100 free coins</span> instantly credited to your wallet balance.
                </p>
                <div className="mt-4">
                  <Link
                    href="/"
                    className="block text-center py-2 bg-slate-900 border border-slate-800 hover:border-amber-500/30 rounded-xl text-[10px] font-black uppercase text-amber-400 transition-colors"
                  >
                    📺 Go to Live Watch Arena
                  </Link>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 font-bold text-xs uppercase tracking-widest">
            No drama shows available at the moment.
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
