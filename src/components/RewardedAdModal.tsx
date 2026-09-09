import React, { useEffect, useState, useRef } from 'react';
import { Play, Sparkles, CheckCircle2, ExternalLink } from 'lucide-react';
import { AdModalState } from '../types';
import { GOOGLE_ADS_CLIENT_ID } from '../services/googleAds';
import { Translations } from '../utils/i18n';

interface RewardedAdModalProps {
  adState: AdModalState;
  t?: Translations;
  onClose: () => void;
  onRewardClaimed: (purpose: 'revive' | 'unlockSkin' | 'reward', targetId?: string) => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  adState,
  t,
  onClose,
  onRewardClaimed,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isCompleted, setIsCompleted] = useState(false);
  const adInsRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!adState.isOpen) {
      setSecondsLeft(4);
      setIsCompleted(false);
      return;
    }

    setSecondsLeft(adState.durationSeconds || 4);
    setIsCompleted(false);

    // Try to trigger adsbygoogle push for this rewarded container
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch {
      // Ignored in preview or when already pushed
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [adState.isOpen, adState.durationSeconds]);

  if (!adState.isOpen) return null;

  const claimLabel = isCompleted
    ? t?.claimReward || 'NHẬN PHẦN THƯỞNG'
    : (t?.watchingAd || 'Đang phát quảng cáo ({sec}s)...').replace(
        '{sec}',
        String(secondsLeft)
      );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/40 text-white flex flex-col items-center">
        {/* Google Ad Header Bar */}
        <div className="w-full bg-slate-800/90 px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-1.5">
            {/* Google 4-Color Dots */}
            <span className="flex items-center gap-0.5">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
              <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white leading-none">Google AdSense</span>
              <span className="text-[9px] text-amber-300 font-medium">Rewarded Ad</span>
            </div>
          </div>

          <div className="text-xs font-mono font-bold bg-slate-700 px-2.5 py-1 rounded-full text-slate-200 border border-slate-600">
            {isCompleted ? '✓' : `${secondsLeft}s`}
          </div>
        </div>

        {/* Google Ads Placement & Visual Presentation */}
        <div className="w-full min-h-[200px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Official Google Ads <ins> element */}
          <ins
            ref={adInsRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '60px' }}
            data-ad-client={GOOGLE_ADS_CLIENT_ID}
            data-ad-slot="9876543210"
            data-ad-format="rectangle"
            data-full-width-responsive="true"
          />

          {/* Animated decorative graphics */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center shadow-lg mb-2.5 animate-bounce">
            <Sparkles className="w-7 h-7 text-white" />
          </div>

          <h4 className="text-base font-black tracking-tight text-white mb-1">
            {t?.googleAdTitle || 'GOOGLE REWARDED VIDEO AD'}
          </h4>
          <p className="text-[11px] text-sky-200/80 max-w-[240px] leading-relaxed">
            {isCompleted
              ? t?.claimReward || 'Hoàn tất! Bấm để nhận thưởng ngay'
              : (t?.watchingAd || 'Đang phát quảng cáo ({sec}s)...').replace(
                  '{sec}',
                  String(secondsLeft)
                )}
          </p>

          <div className="mt-3 px-3 py-1 rounded-full bg-amber-400/20 text-[11px] font-semibold text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
            <span>
              {adState.purpose === 'revive'
                ? '❤️ Cute Birds - ' + (t?.reviveSuccess || 'Hồi sinh')
                : adState.purpose === 'unlockSkin'
                ? '✨ ' + (t?.skinUnlocked || 'Mở khóa skin chim')
                : '🎁 ' + (t?.claimReward || 'Nhận thưởng')}
            </span>
          </div>

          {/* Google Ads Badge */}
          <div className="absolute bottom-1 right-2 text-[8px] text-slate-400 flex items-center gap-0.5">
            <span>Ads by Google</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Reward Confirmation Footer */}
        <div className="w-full p-4 bg-slate-950 flex flex-col items-center gap-2">
          {isCompleted ? (
            <button
              type="button"
              id="claim-rewarded-ad-btn"
              onClick={() => {
                onRewardClaimed(adState.purpose, adState.skinId);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 font-black text-sm text-white shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 active:scale-98 transition-transform"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t?.claimReward || 'NHẬN PHẦN THƯỞNG'}</span>
            </button>
          ) : (
            <div className="w-full py-3 rounded-2xl bg-slate-800 text-slate-400 text-xs font-bold text-center flex items-center justify-center gap-2">
              <Play className="w-3.5 h-3.5 fill-slate-400 animate-pulse" />
              <span>{claimLabel}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors mt-1"
          >
            {t?.close || 'Bỏ qua'}
          </button>
        </div>
      </div>
    </div>
  );
};
