import React from 'react';
import { Play, Sparkles, Feather } from 'lucide-react';
import { BirdSkin, DifficultyMode } from '../constants/flappy';
import { Translations } from '../utils/i18n';

interface FlappyStartOverlayProps {
  isOpen: boolean;
  activeSkin: BirdSkin;
  difficulty: DifficultyMode;
  t: Translations;
  onStartGame: () => void;
  onOpenSkins: () => void;
}

export const FlappyStartOverlay: React.FC<FlappyStartOverlayProps> = ({
  isOpen,
  activeSkin,
  difficulty,
  t,
  onStartGame,
  onOpenSkins,
}) => {
  if (!isOpen) return null;

  const diffLabel =
    difficulty === 'easy'
      ? t.diffEasy
      : difficulty === 'normal'
      ? t.diffNormal
      : t.diffHard;

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-between p-6 pointer-events-auto cursor-pointer"
      onClick={onStartGame}
    >
      {/* Title Header */}
      <div className="mt-8 flex flex-col items-center text-center animate-bounce">
        <div className="px-6 py-2.5 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 border-4 border-slate-950 shadow-[0_6px_0_0_#0f172a] transform -rotate-1">
          <h1
            className="text-2xl sm:text-3xl font-black text-white tracking-widest uppercase drop-shadow-[0_2px_0_#000]"
            style={{ fontFamily: '"Press Start 2P", sans-serif' }}
          >
            {t.gameTitle}
          </h1>
        </div>
        <span className="mt-2 text-xs font-black text-slate-800 bg-white/85 px-3 py-1 rounded-full border border-slate-900/40 shadow-xs">
          {diffLabel}
        </span>
      </div>

      {/* Center "GET READY" & Tap prompt */}
      <div className="flex flex-col items-center text-center my-auto">
        <div className="px-5 py-2 rounded-2xl bg-sky-500 border-3 border-slate-950 shadow-[0_4px_0_0_#0f172a] text-white font-black text-sm mb-6 animate-pulse">
          <span style={{ fontFamily: '"Press Start 2P", sans-serif', fontSize: '12px' }}>
            {t.getReady}
          </span>
        </div>

        {/* Animated Tap Graphic */}
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white/30 border-2 border-white/60 flex items-center justify-center animate-ping absolute -top-2" />
          <div className="w-16 h-16 rounded-full bg-white/90 border-3 border-slate-950 shadow-md flex items-center justify-center text-slate-900 z-10">
            <Play className="w-7 h-7 fill-slate-900 ml-1 text-slate-900" />
          </div>
          <div className="mt-4 px-4 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-bold shadow-lg border border-slate-700 uppercase tracking-wide">
            {t.tapToFly}
          </div>
        </div>
      </div>

      {/* Bottom Skin Pill */}
      <div
        className="mb-8 z-30 flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-700 text-white text-xs font-bold shadow-xl transition-transform active:scale-95 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onOpenSkins();
        }}
      >
        <div
          className="w-4 h-4 rounded-full border border-slate-500"
          style={{ backgroundColor: activeSkin.bodyColor }}
        />
        <span>
          {t.changeSkin}: {activeSkin.name}
        </span>
        <Feather className="w-3.5 h-3.5 text-amber-400" />
      </div>
    </div>
  );
};
