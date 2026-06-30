'use client';

import { useEffect, useRef } from 'react';

interface AdProviderProps {
  adCode: string; // The raw script code pasted from the dashboard
}

export default function AdProvider({ adCode }: AdProviderProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adCode || !adRef.current) return;

    // Clean up any previously loaded ad contents
    adRef.current.innerHTML = '';

    // Execute scripts dynamically by building a contextual fragment from the raw ad code
    try {
      const range = document.createRange();
      const documentFragment = range.createContextualFragment(adCode);
      adRef.current.appendChild(documentFragment);
    } catch (err) {
      console.error("Error executing dynamic ad script:", err);
    }
  }, [adCode]);

  if (!adCode) {
    // If no ad code is set, show a simple fallback placeholder
    return (
      <div className="w-full h-24 bg-slate-900 border border-dashed border-slate-700 rounded-lg flex items-center justify-center text-xs text-slate-500">
        SPONSOR AD PLACEHOLDER
      </div>
    );
  }

  return <div ref={adRef} className="w-full flex justify-center items-center overflow-hidden" />;
}
