import React, { useEffect, useState } from 'react';
import { RotateCcw, Award, Play, Sparkles, Feather, Settings } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MedalType } from '../types';
import { Translations } from '../utils/i18n';
import { GoogleAdBanner } from './GoogleAdBanner';

interface FlappyScoreboardProps {
  isOpen: boolean;
  score: number;
  bestScore: number;
  isNewRecord: boolean;
  canRevive: boolean;
  t: Translations;
  onRestart: () => void;
  onWatchAdRevive: () => void;
  onOpenSkins: () => void;
  onOpenSettings: () => void;
}

export const FlappyScoreboard: React.FC<FlappyScoreboardProps> = ({
  isOpen,
  score,
  bestScore,
  isNewRecord,
  canRevive,
  t,
  onRestart,
  onWatchAdRevive,
  onOpenSkins,
  onOpenSettings,
}) => {
  const [displayedScore, setDisplayedScore] = useState(0);

  // Calculate medal type
  let medal: MedalType = 'none';
  if (score >= 40) medal = 'platinum';
  else if (score >= 30) medal = 'gold';
  else if (score >= 20) medal = 'silver';
  else if (score >= 10) medal = 'bronze';

  useEffect(() => {
    if (!isOpen) {
      setDisplayedScore(0);
      return;
    }

    // Trigger confetti on new high score or big scores
    if (isNewRecord && score > 0) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#facc15', '#38bdf8', '#4ade80', '#f43f5e'],
        });
      } catch {
        // Confetti optional
      }
    }

    // Number roll-up effect
    let start = 0;
    const duration = Math.min(600, Math.max(200, score * 30));
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const val = Math.floor(progress * score);
      setDisplayedScore(val);

      if (progress >= 1) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isOpen, score, isNewRecord]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xs flex flex-col items-center">
        {/* GAME OVER Retro Headline */}
        <div className="mb-3 transform -rotate-1 animate-bounce">
          <div className="px-6 py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 border-4 border-slate-950 shadow-[0_6px_0_0_#0f172a] text-center">
            <h2
              className="text-2xl font-black text-white tracking-widest uppercase drop-shadow-[0_2px_0_#000]"
              style={{ fontFamily: '"Press Start 2P", sans-serif' }}
            >
              {t.gameOver}
            </h2>
          </div>
        </div>

        {/* Retro Brass Scoreboard */}
        <div className="w-full bg-[#ded895] border-4 border-[#543847] rounded-2xl shadow-[0_8px_0_0_#0f172a] p-4 relative mb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Medal Section */}
            <div className="flex flex-col items-center justify-center w-28 h-28 bg-[#d0c87d] border-2 border-[#b5a755] rounded-xl p-2 relative shadow-inner">
              <span className="text-[10px] font-black text-[#543847] uppercase tracking-wider mb-1">
                {t.medal}
              </span>

              {medal === 'platinum' && (
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-200 via-sky-300 to-indigo-100 border-3 border-cyan-500 shadow-md flex items-center justify-center relative animate-pulse">
                  <Award className="w-8 h-8 text-cyan-800" />
                  <Sparkles className="w-4 h-4 text-cyan-500 absolute -top-1 -right-1" />
                </div>
              )}

              {medal === 'gold' && (
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border-3 border-amber-600 shadow-md flex items-center justify-center relative">
                  <Award className="w-8 h-8 text-amber-900" />
                  <Sparkles className="w-4 h-4 text-amber-500 absolute -top-1 -right-1" />
                </div>
              )}

              {medal === 'silver' && (
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-200 via-white to-slate-300 border-3 border-slate-400 shadow-md flex items-center justify-center">
                  <Award className="w-8 h-8 text-slate-700" />
                </div>
              )}

              {medal === 'bronze' && (
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-800 border-3 border-amber-900 shadow-md flex items-center justify-center">
                  <Award className="w-8 h-8 text-amber-200" />
                </div>
              )}

              {medal === 'none' && (
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#b5a755] flex flex-col items-center justify-center text-center p-1">
                  <span className="text-[9px] font-bold text-[#7d6f46]">
                    {t.needPoints}
                  </span>
                </div>
              )}
            </div>

            {/* Right: Scores */}
            <div className="flex-1 flex flex-col justify-between h-28 py-1 text-right">
              {/* Score */}
              <div>
                <span className="text-[10px] font-black text-[#543847] uppercase tracking-wider block">
                  {t.score}
                </span>
                <span
                  className="text-2xl font-black text-[#e86100] drop-shadow-[0_1px_0_#000]"
                  style={{ fontFamily: '"Press Start 2P", sans-serif' }}
                >
                  {displayedScore}
                </span>
              </div>

              {/* Divider line */}
              <div className="h-0.5 bg-[#b5a755] w-full" />

              {/* Best Score */}
              <div className="relative">
                <div className="flex items-center justify-end gap-1.5">
                  {isNewRecord && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[8px] font-black animate-bounce">
                      {t.newRecord}
                    </span>
                  )}
                  <span className="text-[10px] font-black text-[#543847] uppercase tracking-wider">
                    {t.best}
                  </span>
                </div>
                <span
                  className="text-2xl font-black text-[#2e7d32] drop-shadow-[0_1px_0_#000]"
                  style={{ fontFamily: '"Press Start 2P", sans-serif' }}
                >
                  {bestScore}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Watch Ad Revive (Continue) */}
          {canRevive && (
            <button
              type="button"
              id="flappy-revive-btn"
              onClick={onWatchAdRevive}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 border-3 border-slate-950 shadow-[0_4px_0_0_#0f172a] text-white font-black text-xs flex items-center justify-between active:translate-y-1 active:shadow-none transition-all group"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="tracking-wide">{t.reviveWithAd}</span>
              </div>
              <Sparkles
                className="w-4 h-4 text-yellow-200 animate-spin"
                style={{ animationDuration: '6s' }}
              />
            </button>
          )}

          {/* Restart Button */}
          <button
            type="button"
            id="flappy-restart-btn"
            onClick={onRestart}
            className="w-full py-3.5 px-4 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] border-3 border-slate-950 shadow-[0_4px_0_0_#0f172a] text-white font-black text-sm flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span style={{ fontFamily: '"Press Start 2P", sans-serif', fontSize: '11px' }}>
              {t.playAgain}
            </span>
          </button>

          {/* Secondary Buttons Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="flappy-skins-btn"
              onClick={onOpenSkins}
              className="py-2.5 px-3 rounded-xl bg-[#38bdf8] hover:bg-[#0284c7] border-3 border-slate-950 shadow-[0_3px_0_0_#0f172a] text-white font-bold text-xs flex items-center justify-center gap-1.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Feather className="w-4 h-4" />
              <span>{t.changeSkin}</span>
            </button>

            <button
              type="button"
              id="flappy-settings-btn"
              onClick={onOpenSettings}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border-3 border-slate-950 shadow-[0_3px_0_0_#0f172a] text-white font-bold text-xs flex items-center justify-center gap-1.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Settings className="w-4 h-4 text-sky-400" />
              <span>{t.settings.split('&')[0].trim()}</span>
            </button>
          </div>
        </div>

        {/* Google Ad Banner integration */}
        <div className="w-full mt-3">
          <GoogleAdBanner slotId="8877665544" format="horizontal" />
        </div>
      </div>
    </div>
  );
};
