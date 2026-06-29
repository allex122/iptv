'use client';

import React from 'react';
import { StreamServer } from '../types/match';

interface ServerSwitcherProps {
  servers: StreamServer[];
  activeServerId: string;
  onSelectServer: (serverId: string) => void;
}

export default function ServerSwitcher({ 
  servers, 
  activeServerId, 
  onSelectServer 
}: ServerSwitcherProps) {
  if (servers.length === 0) {
    return (
      <div className="bg-[#12141a] border border-[#20242e] rounded-2xl p-4 text-center text-xs text-slate-500 font-bold">
        ⚠️ No streaming links are currently active for this match.
      </div>
    );
  }

  return (
    <div className="w-full bg-[#12141a] border border-[#20242e] rounded-2xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Title block */}
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4 text-[#00ff66]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
        <span className="text-xs font-black text-white uppercase tracking-wider">
          Stream Sources
        </span>
      </div>

      {/* Server Grid / Buttons */}
      <div className="flex flex-wrap gap-2">
        {servers.map((server, index) => {
          const isActive = activeServerId === server.id;
          return (
            <button
              key={server.id}
              onClick={() => onSelectServer(server.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                isActive
                  ? 'bg-[#00ff66] text-black border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.2)]'
                  : 'bg-[#08090a] text-slate-400 border-[#20242e] hover:text-white hover:border-[#2e3545]'
              }`}
            >
              {/* Play symbol on button */}
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>{server.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
