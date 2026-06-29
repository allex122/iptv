'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ScratchCardWidgetProps {
  matchId: string;
}

const REWARDS = [
  { code: 'SCRATCH-VIP-7D', desc: '🎁 7-Day Free Premium VIP Pass!' },
  { code: 'CYBER-LUCKY-40', desc: '🎉 40% Off Discount Voucher!' },
  { code: 'GOLD-TICKET-CYBER2', desc: '🎟️ VIP Gold Match Ticket Code!' },
  { code: 'BONUS-COIN-100', desc: '🪙 100 Cyber2 Coins Bonus!' }
];

export default function ScratchCardWidget({ matchId }: ScratchCardWidgetProps) {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes (900 seconds)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [revealedPrize, setRevealedPrize] = useState<{ code: string; desc: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize countdown timer
  useEffect(() => {
    if (isUnlocked) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          unlockCard();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isUnlocked]);

  const unlockCard = () => {
    setIsUnlocked(true);
    setScratchProgress(0);
    // Select a random reward
    const randomReward = REWARDS[Math.floor(Math.random() * REWARDS.length)];
    setRevealedPrize(randomReward);
  };

  // Setup canvas drawing overlay when card unlocks
  useEffect(() => {
    if (!isUnlocked || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 300;
    canvas.height = 130;

    // Draw premium gold-gradient scratch overlay
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#1e293b'); // Slate 800
    grad.addColorStop(0.5, '#334155'); // Slate 700
    grad.addColorStop(1, '#0f172a'); // Slate 900
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw card borders and text instructions
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    ctx.font = 'black 10px system-ui';
    ctx.fillStyle = '#00ff66';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡ LUCKY SCRATCH CARD ⚡', canvas.width / 2, canvas.height / 2 - 12);

    ctx.font = 'bold 9px system-ui';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('SCRATCH WITH MOUSE OR FINGER TO REVEAL', canvas.width / 2, canvas.height / 2 + 12);
  }, [isUnlocked]);

  // Handle scratch gestures (mouse + touch support)
  const startScratching = () => setIsDrawing(true);
  const stopScratching = () => setIsDrawing(false);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Increment scratch count to trigger automatic full reveal
    setScratchProgress((prev) => {
      const next = prev + 1;
      // After ~45 scratch inputs, we auto-clear the canvas to reveal full reward
      if (next >= 45) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return next;
    });
  };

  const handleClaim = () => {
    // Reset state and restart countdown for next scratch card
    setIsUnlocked(false);
    setRevealedPrize(null);
    setCopied(false);
    setTimeLeft(900); // Reset to 15 minutes
  };

  const copyToClipboard = () => {
    if (!revealedPrize) return;
    navigator.clipboard.writeText(revealedPrize.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#12141a] border border-[#20242e] rounded-3xl p-5 shadow-xl mt-6">
      
      {/* Header and skip control */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">🎁</span>
          <h4 className="text-[11px] font-black text-white uppercase tracking-wider">
            Lucky Scratch Rewards
          </h4>
        </div>
        
        {/* Test Mode Skip Button */}
        {!isUnlocked && (
          <button
            onClick={() => setTimeLeft(5)}
            className="text-[8px] bg-slate-800 text-slate-400 hover:text-white px-2 py-0.5 rounded border border-slate-700/50 cursor-pointer transition-colors"
          >
            ⚙️ Fast Test (5s)
          </button>
        )}
      </div>

      {!isUnlocked ? (
        /* COUNTDOWN INTERFACE */
        <div className="bg-[#08090a]/50 border border-[#20242e] rounded-2xl p-4 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">
            Keep watching to get a Lucky Scratch Card
          </p>
          <div className="text-2xl font-black text-emerald-400 font-mono tracking-wider animate-pulse">
            {formatTime(timeLeft)}
          </div>
          <p className="text-[9px] text-slate-500 mt-1 leading-normal max-w-xs mx-auto">
            Stay active on this page. Every 15 minutes of watch time unlocks a scratch card to win VIP passes and premium codes!
          </p>
        </div>
      ) : (
        /* INTERACTIVE SCRATCH CANVAS INTERFACE */
        <div className="relative w-full h-[130px] rounded-2xl border border-slate-700/40 bg-[#08090a] overflow-hidden flex flex-col items-center justify-center text-center p-4">
          
          {/* Underlay: The Hidden Reward */}
          {revealedPrize && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-0">
              <span className="text-[10px] text-[#00ff66] font-black uppercase tracking-widest animate-bounce">
                🎉 Reward Unlocked!
              </span>
              <span className="text-[11px] text-white font-extrabold uppercase mt-1">
                {revealedPrize.desc}
              </span>
              
              <div className="flex items-center space-x-2 mt-3 w-full max-w-[240px]">
                <span className="bg-[#12141a] border border-[#20242e] text-white font-mono text-[11px] font-bold py-1 px-3 rounded-lg text-center flex-grow select-all">
                  {revealedPrize.code}
                </span>
                <button
                  onClick={copyToClipboard}
                  className={`text-[9px] font-black px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    copied 
                      ? 'bg-emerald-500/10 text-[#00ff66] border-emerald-500/30' 
                      : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {scratchProgress >= 45 && (
                <button
                  onClick={handleClaim}
                  className="mt-2 text-[8px] text-[#00ff66] hover:text-white font-black tracking-wider uppercase underline cursor-pointer"
                >
                  Start Next Timer ⏰
                </button>
              )}
            </div>
          )}

          {/* Overlay: Canvas Scratch Area */}
          <canvas
            ref={canvasRef}
            onMouseDown={startScratching}
            onMouseUp={stopScratching}
            onMouseLeave={stopScratching}
            onMouseMove={scratch}
            onTouchStart={startScratching}
            onTouchEnd={stopScratching}
            onTouchMove={scratch}
            className={`absolute inset-0 z-10 cursor-pointer transition-opacity duration-500 ${
              scratchProgress >= 45 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />
        </div>
      )}
    </div>
  );
}
