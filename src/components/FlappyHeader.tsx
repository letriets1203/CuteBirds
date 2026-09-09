import React from 'react';
import {
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Feather,
  Settings,
  Trophy,
  Globe,
} from 'lucide-react';
import { BirdSkin } from '../constants/flappy';
import { LanguageCode, SUPPORTED_LANGUAGES, Translations } from '../utils/i18n';

interface FlappyHeaderProps {
  score: number;
  bestScore: number;
  isMuted: boolean;
  isNight: boolean;
  activeSkin: BirdSkin;
  currentLanguage: LanguageCode;
  t: Translations;
  onToggleSound: () => void;
  onToggleNight: () => void;
  onOpenSkins: () => void;
  onOpenSettings: () => void;
}

export const FlappyHeader: React.FC<FlappyHeaderProps> = ({
  score,
  bestScore,
  isMuted,
  isNight,
  activeSkin,
  currentLanguage,
  t,
  onToggleSound,
  onToggleNight,
  onOpenSkins,
  onOpenSettings,
}) => {
  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <header className="w-full max-w-[420px] mx-auto px-3 py-2 flex items-center justify-between text-white z-20 select-none">
      {/* High Score Badge */}
      <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border-2 border-slate-800 shadow-md">
        <Trophy className="w-4 h-4 text-amber-400" />
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
            {t.best}:
          </span>
          <span
            className="text-xs font-black text-amber-400"
            style={{ fontFamily: '"Press Start 2P", sans-serif' }}
          >
            {bestScore}
          </span>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-1.5">
        {/* Language Quick Switch / Indicator */}
        <button
          type="button"
          onClick={onOpenSettings}
          title={t.chooseLanguage}
          className="h-9 px-2 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border-2 border-slate-800 flex items-center gap-1 text-slate-300 hover:text-white active:scale-95 transition-all shadow-md"
        >
          <span className="text-base leading-none">{currentLangObj.flag}</span>
          <span className="text-[10px] font-black uppercase text-slate-300">
            {currentLanguage.toUpperCase()}
          </span>
        </button>

        {/* Day/Night Toggle */}
        <button
          type="button"
          onClick={onToggleNight}
          title={isNight ? t.dayMode : t.nightMode}
          className="w-9 h-9 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border-2 border-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shadow-md"
        >
          {isNight ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-300" />}
        </button>

        {/* Sound FX Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          title={isMuted ? t.soundOn : t.soundOff}
          className="w-9 h-9 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border-2 border-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shadow-md"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Skins modal trigger */}
        <button
          type="button"
          onClick={onOpenSkins}
          title={t.changeSkin}
          className="h-9 px-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border-2 border-slate-800 flex items-center gap-1.5 text-slate-300 hover:text-white active:scale-95 transition-all shadow-md"
        >
          <div
            className="w-4 h-4 rounded-full border border-slate-700 shadow-2xs"
            style={{ backgroundColor: activeSkin.bodyColor }}
          />
          <Feather className="w-3.5 h-3.5 text-sky-400" />
        </button>

        {/* Settings & Language modal trigger */}
        <button
          type="button"
          onClick={onOpenSettings}
          title={t.settings}
          className="w-9 h-9 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border-2 border-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shadow-md"
        >
          <Settings className="w-4 h-4 text-sky-400" />
        </button>
      </div>
    </header>
  );
};
