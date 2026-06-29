import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#08090a] border-t border-[#1a1e26] mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-[#00ff66] font-black text-xl tracking-wider">CYBER2 SPORTS</span>
            </Link>
            <p className="mt-4 text-xs text-slate-400 max-w-sm leading-relaxed">
              Cyber2 Sports is a high-performance sports aggregator script. Fully automated indexing, optimized player containers, and built-in premium banner slots for maximum CPC/CPA monetization.
            </p>
            <div className="mt-4 text-[10px] text-slate-500 font-bold">
              © {new Date().getFullYear()} CYBER2 SPORTS INC. All rights reserved.
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest border-l-2 border-[#00ff66] pl-2.5 mb-4">
              Categories
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/?sport=football" className="hover:text-[#00ff66] transition-colors">Football Streams</Link></li>
              <li><Link href="/?sport=basketball" className="hover:text-[#00ff66] transition-colors">NBA & Basketball</Link></li>
              <li><Link href="/?sport=cricket" className="hover:text-[#00ff66] transition-colors">IPL & Cricket</Link></li>
              <li><Link href="/?sport=wwe" className="hover:text-[#00ff66] transition-colors">WWE Wrestling</Link></li>
              <li><Link href="/?sport=tennis" className="hover:text-[#00ff66] transition-colors">Tennis Matches</Link></li>
            </ul>
          </div>

          {/* Legal / Info Col */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest border-l-2 border-[#00ff66] pl-2.5 mb-4">
              Disclaimer
            </h3>
            <p className="text-[10px] text-slate-500 leading-normal">
              Cyber2 Sports is an aggregator of publicly available video stream links. We do not host or upload any media files. If you have legal issues, please contact appropriate media file owners/hosters.
            </p>
            <div className="mt-4">
              <span className="inline-block bg-[#12141a] text-[#00ff66] text-[10px] font-bold px-2.5 py-1 rounded border border-[#20242e]">
                SaaS Ready v1.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
