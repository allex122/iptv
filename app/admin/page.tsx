'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface StreamServerConfig {
  id: string;
  name: string;
  url: string;
}

interface AdConfig {
  header: string;
  sidebar: string;
  square: string;
  banner: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'ads' | 'streams'>('ads');
  const [ads, setAds] = useState<AdConfig>({
    header: '',
    sidebar: '',
    square: '',
    banner: ''
  });
  const [streams, setStreams] = useState<StreamServerConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch current configs on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          if (data.ads) {
            setAds({
              header: data.ads.header || '',
              sidebar: data.ads.sidebar || '',
              square: data.ads.square || '',
              banner: data.ads.banner || ''
            });
          }
          if (data.streams) {
            setStreams(data.streams);
          }
        }
      } catch (err) {
        console.error("Failed to load configurations:", err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleAdChange = (key: keyof AdConfig, value: string) => {
    setAds((prev) => ({ ...prev, [key]: value }));
  };

  const handleStreamChange = (id: string, value: string) => {
    setStreams((prev) =>
      prev.map((srv) => (srv.id === id ? { ...srv, url: value } : srv))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ads, streams })
      });
      
      if (res.ok) {
        setStatusMsg({ type: 'success', text: '🎉 Settings saved successfully! Changes are now live.' });
        setTimeout(() => setStatusMsg(null), 5000);
      } else {
        setStatusMsg({ type: 'error', text: '❌ Failed to save configurations. Please try again.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: '❌ An error occurred while saving configurations.' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#08090a] text-slate-100 font-sans selection:bg-[#00ff66]/30 selection:text-white">
      <Header />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Title */}
        <div className="mb-8 border-l-4 border-[#00ff66] pl-4">
          <h1 className="text-3xl font-black uppercase tracking-wider text-white">
            ⚙️ Control Console
          </h1>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">
            Manage site advertisements and stream links in real-time.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-[#00ff66] animate-spin"></div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Loading console panel...</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Status Alert Bar */}
            {statusMsg && (
              <div className={`p-4 rounded-2xl border text-xs font-bold uppercase tracking-wider ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {statusMsg.text}
              </div>
            )}

            {/* Tab Controller Buttons */}
            <div className="flex bg-[#12141a] border border-[#20242e] p-1.5 rounded-2xl gap-2 w-full sm:max-w-md">
              <button
                type="button"
                onClick={() => setActiveTab('ads')}
                className={`flex-1 text-center py-2.5 text-xs font-black uppercase rounded-xl transition-all cursor-pointer ${
                  activeTab === 'ads'
                    ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📣 Advertisements
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('streams')}
                className={`flex-1 text-center py-2.5 text-xs font-black uppercase rounded-xl transition-all cursor-pointer ${
                  activeTab === 'streams'
                    ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📡 Live Streams
              </button>
            </div>

            {/* TAB CARD CONTENTS */}
            <div className="bg-[#12141a] border border-[#20242e] rounded-3xl p-6 shadow-xl">
              
              {/* 1. ADVERTISEMENTS TAB */}
              {activeTab === 'ads' && (
                <div className="space-y-6">
                  <div className="border-b border-[#20242e] pb-3">
                    <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">
                      Ad Slot Injector (Paste HTML/Iframe)
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Paste iframe tags or direct script snippets here. Leave empty to display our default mock ads.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Header Slot */}
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                        Header Banner (728x90)
                      </label>
                      <textarea
                        value={ads.header}
                        onChange={(e) => handleAdChange('header', e.target.value)}
                        placeholder="<iframe src='...' width='728' height='90'></iframe>"
                        className="w-full h-28 p-3 bg-[#08090a] border border-[#20242e] focus:border-[#00ff66]/50 rounded-xl text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Sidebar Slot */}
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                        Sidebar Skyscraper (300x600)
                      </label>
                      <textarea
                        value={ads.sidebar}
                        onChange={(e) => handleAdChange('sidebar', e.target.value)}
                        placeholder="<iframe src='...' width='300' height='600'></iframe>"
                        className="w-full h-28 p-3 bg-[#08090a] border border-[#20242e] focus:border-[#00ff66]/50 rounded-xl text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Sponsor Box Slot */}
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                        Sponsor Box (160x200)
                      </label>
                      <textarea
                        value={ads.square}
                        onChange={(e) => handleAdChange('square', e.target.value)}
                        placeholder="<iframe src='...' width='160' height='200'></iframe>"
                        className="w-full h-28 p-3 bg-[#08090a] border border-[#20242e] focus:border-[#00ff66]/50 rounded-xl text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Bottom Leaderboard Slot */}
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                        Leaderboard Banner (800x250)
                      </label>
                      <textarea
                        value={ads.banner}
                        onChange={(e) => handleAdChange('banner', e.target.value)}
                        placeholder="<iframe src='...' width='800' height='250'></iframe>"
                        className="w-full h-28 p-3 bg-[#08090a] border border-[#20242e] focus:border-[#00ff66]/50 rounded-xl text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. STREAMS TAB */}
              {activeTab === 'streams' && (
                <div className="space-y-6">
                  <div className="border-b border-[#20242e] pb-3">
                    <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">
                      Live Stream Server Links
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Update the URLs for the 10 streaming servers. The watch page player will override defaults with these links instantly.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {streams.map((srv) => (
                      <div key={srv.id} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#08090a] border border-[#1b1e26] p-3 rounded-xl">
                        <div className="sm:w-1/3">
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                            {srv.id}
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-200 uppercase mt-1 truncate">
                            {srv.name}
                          </h4>
                        </div>
                        <div className="flex-grow">
                          <input
                            type="text"
                            value={srv.url}
                            onChange={(e) => handleStreamChange(srv.id, e.target.value)}
                            placeholder="Paste stream link (m3u8, mp4, etc.)"
                            className="w-full p-2 bg-[#0c0e12] border border-[#20242e] focus:border-[#00ff66]/50 rounded-lg text-xs text-slate-300 font-mono focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Glowing Save Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="btn-neon-glow bg-[#00ff66] text-black hover:bg-[#00ff66]/90 font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.2)] active:scale-95 cursor-pointer"
              >
                💾 Save site configuration
              </button>
            </div>

          </form>
        )}

      </main>

      <Footer />
    </div>
  );
}
