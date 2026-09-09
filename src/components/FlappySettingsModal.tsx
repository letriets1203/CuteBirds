import React, { useState } from 'react';
import {
  X,
  Globe,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  RotateCcw,
  Trophy,
  Zap,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  Translations,
} from '../utils/i18n';
import { DifficultyMode, DIFFICULTY_CONFIGS } from '../constants/flappy';
import { FlappyStats } from '../types';

interface FlappySettingsModalProps {
  isOpen: boolean;
  t: Translations;
  currentLanguage: LanguageCode;
  isMuted: boolean;
  isNight: boolean;
  difficulty: DifficultyMode;
  stats: FlappyStats;
  onClose: () => void;
  onSelectLanguage: (lang: LanguageCode) => void;
  onToggleSound: () => void;
  onToggleNight: () => void;
  onChangeDifficulty: (mode: DifficultyMode) => void;
  onResetStats: () => void;
}

export const FlappySettingsModal: React.FC<FlappySettingsModalProps> = ({
  isOpen,
  t,
  currentLanguage,
  isMuted,
  isNight,
  difficulty,
  stats,
  onClose,
  onSelectLanguage,
  onToggleSound,
  onToggleNight,
  onChangeDifficulty,
  onResetStats,
}) => {
  const [showLanguagesList, setShowLanguagesList] = useState(false);

  if (!isOpen) return null;

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border-4 border-slate-950 rounded-3xl p-5 text-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-400" />
            <h3
              className="text-sm font-black uppercase tracking-wider text-sky-400"
              style={{ fontFamily: '"Press Start 2P", sans-serif' }}
            >
              {t.settings}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {/* 1. LANGUAGE SELECTOR */}
          <div className="bg-slate-800/80 border-2 border-slate-700/80 rounded-2xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                {t.language}
              </span>
              <button
                type="button"
                onClick={() => setShowLanguagesList((prev) => !prev)}
                className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 underline"
              >
                {showLanguagesList ? t.close : t.chooseLanguage}
              </button>
            </div>

            {/* Current Active Language Pill */}
            <div
              onClick={() => setShowLanguagesList((prev) => !prev)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 cursor-pointer hover:border-slate-500 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentLangObj.flag}</span>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-extrabold text-white">
                    {currentLangObj.nativeName}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {currentLangObj.name}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-800/50">
                {showLanguagesList ? '▲' : '▼'}
              </span>
            </div>

            {/* Expanded Language Options Grid */}
            {showLanguagesList && (
              <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2.5 border-t border-slate-700 max-h-48 overflow-y-auto">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isCurrent = lang.code === currentLanguage;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setShowLanguagesList(false);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                          : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className="text-base shrink-0">{lang.flag}</span>
                        <span className="text-[11px] truncate">
                          {lang.nativeName}
                        </span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. AUDIO & DAY/NIGHT TOGGLES */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${
                !isMuted
                  ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-md'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}
            >
              {!isMuted ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-rose-400" />
              )}
              <span className="text-xs font-bold">
                {!isMuted ? t.soundOn : t.soundOff}
              </span>
            </button>

            {/* Day / Night Toggle */}
            <button
              type="button"
              onClick={onToggleNight}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${
                isNight
                  ? 'bg-indigo-500/15 border-indigo-400 text-indigo-300 shadow-md'
                  : 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-md'
              }`}
            >
              {isNight ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
              <span className="text-xs font-bold">
                {isNight ? t.nightMode : t.dayMode}
              </span>
            </button>
          </div>

          {/* 3. DIFFICULTY SELECTOR */}
          <div className="bg-slate-800/80 border-2 border-slate-700/80 rounded-2xl p-3">
            <div className="text-xs font-bold text-slate-300 mb-2">
              {t.difficulty}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['easy', 'normal', 'hard'] as DifficultyMode[]).map((mode) => {
                const isActive = difficulty === mode;
                const label =
                  mode === 'easy'
                    ? t.diffEasy
                    : mode === 'normal'
                    ? t.diffNormal
                    : t.diffHard;

                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onChangeDifficulty(mode)}
                    className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-md scale-102 font-black'
                        : 'bg-slate-700/80 hover:bg-slate-600 text-slate-300 font-bold'
                    }`}
                  >
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              {difficulty === 'easy'
                ? t.diffEasyDesc
                : difficulty === 'normal'
                ? t.diffNormalDesc
                : t.diffHardDesc}
            </p>
          </div>

          {/* 4. STATISTICS CARDS */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3">
            <div className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.statistics}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">
                  {t.statsBestScore}
                </div>
                <div
                  className="text-lg font-black text-amber-400 mt-0.5"
                  style={{ fontFamily: '"Press Start 2P", sans-serif' }}
                >
                  {stats.bestScore}
                </div>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">
                  {t.statsTotalGames}
                </div>
                <div
                  className="text-lg font-black text-emerald-400 mt-0.5"
                  style={{ fontFamily: '"Press Start 2P", sans-serif' }}
                >
                  {stats.totalGames}
                </div>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">
                  {t.statsTotalFlaps}
                </div>
                <div className="text-sm font-black text-sky-400 mt-0.5">
                  {stats.totalFlaps.toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">
                  {t.statsTotalScore}
                </div>
                <div className="text-sm font-black text-purple-400 mt-0.5">
                  {stats.totalScore.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(t.confirmReset)) {
                onResetStats();
              }
            }}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold underline"
          >
            {t.resetStats}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
