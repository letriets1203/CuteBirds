import React, { useEffect, useRef, useState } from 'react';
import { GOOGLE_ADS_CLIENT_ID } from '../services/googleAds';

interface GoogleAdBannerProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

export const GoogleAdBanner: React.FC<GoogleAdBannerProps> = ({
  slotId = '1234567890',
  format = 'horizontal',
  className = '',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const adsQueue = window.adsbygoogle || [];
        adsQueue.push({});
        setAdLoaded(true);
      }
    } catch (e) {
      setAdError(true);
    }
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-slate-900/60 border border-slate-700/50 p-1 flex flex-col items-center justify-center text-center ${className}`}
    >
      {/* Google Ads Brand Label */}
      <div className="w-full flex items-center justify-between px-2 py-0.5 text-[9px] font-semibold text-slate-400 border-b border-slate-800/80 mb-1">
        <div className="flex items-center gap-1">
          {/* Official Google 4-color mini-dot indicator */}
          <span className="flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
          </span>
          <span className="tracking-wider">Google AdSense</span>
        </div>
        <span className="text-slate-500 hover:text-slate-400 cursor-pointer">
          Quảng cáo Google
        </span>
      </div>

      {/* Official AdSense <ins> Tag */}
      <ins
        ref={adRef}
        className="adsbygoogle block w-full"
        style={{ display: 'block', minHeight: format === 'horizontal' ? '50px' : '90px' }}
        data-ad-client={GOOGLE_ADS_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />

      {/* Fallback Display if Google Ad is waiting or in sandboxed preview */}
      {(!adLoaded || adError) && (
        <div className="w-full py-2 px-3 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-lg">
          <div className="flex items-center gap-2 text-left">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-bold text-xs">
              G
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-200 leading-tight">
                Google Ads Network
              </div>
              <div className="text-[9px] text-slate-400 leading-tight">
                Banner quảng cáo tự động từ Google AdSense
              </div>
            </div>
          </div>

          <span className="text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-md">
            Xem ngay
          </span>
        </div>
      )}
    </div>
  );
};
