'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  url: string;
  type: 'hls' | 'iframe';
  serverName: string;
}

export default function VideoPlayer({ url, type, serverName }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstanceRef = useRef<Hls | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [showInsecurePopup, setShowInsecurePopup] = useState(false);

  // Reset errors when source URL swaps
  useEffect(() => {
    setHasError(false);
    setErrorCount(0);
    setShowInsecurePopup(false);
  }, [url]);

  // Handle HLS stream loading and cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (type === 'iframe' || !url) return;

    const video = videoRef.current;
    if (!video) return;

    let hls: Hls;

    // Reset video state
    video.pause();

    // Determine if we need to proxy the URL or pass it directly.
    let finalUrl = url;
    const isPrivateIP = url.includes('//10.') || url.includes('//192.168.') || url.includes('//172.') || url.includes('localhost') || url.includes('127.0.0.1');
    const hasCustomPort = /:([0-9]{4,5})/.test(url.replace(/^https?:\/\//, ''));
    const isHttpOnHttps = window.location.protocol === 'https:' && url.startsWith('http://');

    if (isHttpOnHttps && !isPrivateIP) {
      if (hasCustomPort) {
        // Vercel serverless blocks outbound requests to custom ports (e.g., 8095).
        // So we CANNOT proxy it. We must load it directly. 
        // This will trigger a Mixed Content block which we will catch and show a popup.
        finalUrl = url;
      } else {
        // Proxy it since standard ports are allowed by Vercel
        finalUrl = `/api/stream-proxy?url=${encodeURIComponent(url)}`;
      }
    }

    // Check if browser supports HLS.js (Chrome, Firefox, Edge, etc.)
    if (Hls.isSupported()) {
      hls = new Hls({
        maxMaxBufferLength: 10,
        manifestLoadingTimeOut: 12000,
        levelLoadingTimeOut: 12000
      });
      hls.loadSource(finalUrl);
      hls.attachMedia(video);
      hlsInstanceRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log('Auto-play blocked:', err));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setErrorCount((prev) => {
            const nextCount = prev + 1;
            if (nextCount >= 3) {
              setHasError(true);
            }
            return nextCount;
          });

          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // If we attempted to load a raw http:// URL on https://, network error usually means Mixed Content block.
              if (finalUrl.startsWith('http://') && window.location.protocol === 'https:') {
                setShowInsecurePopup(true);
              } else {
                hls.startLoad();
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              break;
          }
        }
      });
    } 
    // Check if browser supports HLS natively (Safari / iOS)
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = finalUrl;
      
      const handleLoadedMetadata = () => {
        video.play().catch((err) => console.log('Auto-play blocked:', err));
      };

      const handleNativeError = () => {
        if (finalUrl.startsWith('http://') && window.location.protocol === 'https:') {
          setShowInsecurePopup(true);
        } else {
          setHasError(true);
        }
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('error', handleNativeError);

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleNativeError);
      };
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [url, type]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-3xl border border-[#20242e] overflow-hidden shadow-2xl">
      
      {/* INSECURE CONTENT POPUP OVERLAY */}
      {showInsecurePopup && type !== 'iframe' && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center">
          <div className="p-3 bg-yellow-500/10 rounded-full border border-yellow-500/30 text-yellow-500 mb-4 animate-pulse">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-white font-extrabold text-lg uppercase tracking-wider mb-2">Security Permission Required</h3>
          <p className="text-slate-300 text-sm max-w-md leading-relaxed mb-6">
            This stream ({serverName}) requires <strong className="text-white">Insecure Content</strong> permission to play on this secure site. 
            <br/><br/>
            To watch it, click the <strong className="text-white">Lock (🔒) icon</strong> in your browser's top address bar, go to <strong className="text-white">Site Settings</strong>, and set <strong>Insecure Content</strong> to <strong className="text-emerald-400">Allow</strong>.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(234,179,8,0.4)]"
          >
            I have Allowed it (Reload Player)
          </button>
        </div>
      )}

      {/* OFFLINE / BUFFERING ERROR STATE OVERLAY */}
      {hasError && !showInsecurePopup && type !== 'iframe' && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
          <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20 text-red-500 mb-3 animate-bounce">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">Stream Offline / Buffering</h3>
          <p className="text-slate-400 text-[11px] mt-1.5 max-w-xs leading-relaxed">
            This stream source ({serverName}) is currently offline or unreachable. Please try selecting **Server 1** or **Server 2** for active feeds.
          </p>
        </div>
      )}

      {/* RENDER METHOD: IFRAME EMBED */}
      {type === 'iframe' ? (
        <div className="w-full h-full">
          <iframe
            src={url}
            title={`Live Match Stream - ${serverName}`}
            className="w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        /* RENDER METHOD: HTML5 VIDEO PLAYER WITH CONTROLS */
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            controls
            playsInline
            muted // Muted to bypass autoplay restrictions on Chrome
          />
          
          {/* HD LIVE Pulsing Badge */}
          <div className="absolute top-4 right-4 bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md shadow animate-pulse z-10">
            HD LIVE
          </div>
          
          {/* Quick Server Info Toast */}
          <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff66] live-pulse-dot"></span>
            <span className="text-[10px] text-white font-bold tracking-wider uppercase">
              {serverName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
