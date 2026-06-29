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

  // Reset errors when source URL swaps
  useEffect(() => {
    setHasError(false);
    setErrorCount(0);
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

    // Check if browser supports HLS.js (Chrome, Firefox, Edge, etc.)
    if (Hls.isSupported()) {
      hls = new Hls({
        maxMaxBufferLength: 10, // Optimized for lower buffering latency
        manifestLoadingTimeOut: 8000,
        levelLoadingTimeOut: 8000
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      hlsInstanceRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log('Auto-play blocked:', err));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setErrorCount((prev) => {
            const nextCount = prev + 1;
            // If the stream fails to load 3 consecutive times, mark it as offline
            if (nextCount >= 3) {
              setHasError(true);
            }
            return nextCount;
          });

          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad(); // Auto-reload HLS feed on dropouts
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
      video.src = url;
      
      const handleLoadedMetadata = () => {
        video.play().catch((err) => console.log('Auto-play blocked:', err));
      };

      const handleNativeError = () => {
        setHasError(true);
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
      
      {/* OFFLINE / BUFFERING ERROR STATE OVERLAY */}
      {hasError && type !== 'iframe' && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
          <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20 text-red-500 mb-3 animate-bounce">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">Stream Offline / Buffering</h3>
          <p className="text-slate-400 text-[11px] mt-1.5 max-w-xs leading-relaxed">
            This stream source ({serverName}) is currently offline or unreachable. Please try selecting **Server 4** or **Server 5** for active feeds.
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
