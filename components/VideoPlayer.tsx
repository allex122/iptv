'use client';

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  url: string;
  type: 'hls' | 'iframe';
  serverName: string;
}

export default function VideoPlayer({ url, type, serverName }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstanceRef = useRef<Hls | null>(null);

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
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      hlsInstanceRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log('Auto-play blocked:', err));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
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
      video.addEventListener('loadedmetadata', () => {
        video.play().catch((err) => console.log('Auto-play blocked:', err));
      });
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
