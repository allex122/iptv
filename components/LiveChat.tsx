'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  username: string;
  avatarColor: string;
  message: string;
  time: string;
  badge?: string;
}

export default function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Pool of mock message data
  const mockUsernames = ['CR7_G.O.A.T', 'SportzManiac', 'Gooner4Life', 'MessiMagic', 'BounceBaller', 'RunN_Gun', 'KevIn_O', 'WweFanBoy', 'PitchMaster', 'NetRattler'];
  const mockColors = [
    'text-red-400 bg-red-500/10',
    'text-blue-400 bg-blue-500/10',
    'text-[#00ff66] bg-[#00ff66]/10',
    'text-purple-400 bg-purple-500/10',
    'text-amber-400 bg-amber-500/10',
    'text-pink-400 bg-pink-500/10',
    'text-cyan-400 bg-cyan-500/10'
  ];
  const mockTexts = [
    'What a match! Real Madrid looks sluggish today.',
    'Is the server buffering for anyone else? Server 2 is fast for me!',
    'GOAAAALLLLLLLL!!!! What a strike!! 🔥⚽',
    'Defense is completely sleeping. Coach needs to make changes.',
    'Referee is blind! That was a clear penalty 😡',
    'This stream is crystal clear! Best script ever.',
    'Lakers in 6! Celtics don\'t stand a chance tonight.',
    'Unbelievable play! Highlight of the week for sure.',
    'Can\'t believe Cody actually hit the Cross Rhodes there!! ⚡⚡',
    'Awesome HLS quality. Thanks admin for the links!',
  ];
  const mockBadges = ['MOD', 'Vip User', '💎 Premier', '👑 Admin', ''];

  // Seed initial messages
  useEffect(() => {
    const initialMsgs: ChatMessage[] = [];
    for (let i = 0; i < 8; i++) {
      initialMsgs.push({
        id: `seed-${i}`,
        username: mockUsernames[Math.floor(Math.random() * mockUsernames.length)],
        avatarColor: mockColors[Math.floor(Math.random() * mockColors.length)],
        message: mockTexts[Math.floor(Math.random() * mockTexts.length)],
        time: new Date(Date.now() - (8 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: mockBadges[Math.floor(Math.random() * mockBadges.length)]
      });
    }
    setMessages(initialMsgs);
  }, []);

  // Auto-scroll to bottom of chat container internally
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Simulate incoming live messages
  useEffect(() => {
    const interval = setInterval(() => {
      const newMsg: ChatMessage = {
        id: `live-${Date.now()}`,
        username: mockUsernames[Math.floor(Math.random() * mockUsernames.length)],
        avatarColor: mockColors[Math.floor(Math.random() * mockColors.length)],
        message: mockTexts[Math.floor(Math.random() * mockTexts.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: Math.random() > 0.7 ? mockBadges[Math.floor(Math.random() * mockBadges.length)] : ''
      };
      setMessages((prev) => [...prev.slice(-30), newMsg]); // Keep last 30
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      username: 'You (Visitor)',
      avatarColor: 'text-[#00ff66] bg-[#00ff66]/20 border border-[#00ff66]/40',
      message: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: '💎 VIP'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
  };

  return (
    <div className="flex flex-col h-[400px] bg-[#12141a] border border-[#20242e] rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#151821] border-b border-[#20242e]">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]"></span>
          </span>
          <span className="text-xs font-black text-white uppercase tracking-wider">
            Live Stream Chat
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-bold bg-[#08090a] px-2 py-0.5 rounded border border-[#20242e]">
          1,482 online
        </span>
      </div>

      {/* Messages Feed */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-0"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col text-xs">
            <div className="flex items-center space-x-1.5 flex-wrap">
              {msg.badge && (
                <span className="text-[8px] font-black bg-[#161a24] text-[#00ff66] border border-[#00ff66]/30 px-1 rounded uppercase tracking-wide">
                  {msg.badge}
                </span>
              )}
              <span className={`font-black tracking-tight px-1.5 py-0.5 rounded-md ${msg.avatarColor}`}>
                {msg.username}
              </span>
              <span className="text-[9px] text-slate-500 font-bold">
                {msg.time}
              </span>
            </div>
            <p className="text-slate-300 font-medium leading-relaxed mt-1 pl-1">
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-[#151821] border-t border-[#20242e] flex gap-2">
        <input
          type="text"
          placeholder="Send message to stream chat..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-grow bg-[#08090a] border border-[#20242e] focus:border-[#00ff66]/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          className="bg-[#00ff66] hover:bg-[#00e059] text-black font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center justify-center cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  );
}
