import React from 'react';
import { X, Lock, Check, Sparkles, Play } from 'lucide-react';
import { BIRD_SKINS, BirdSkin } from '../constants/flappy';
import { Translations } from '../utils/i18n';

interface SkinSelectModalProps {
  isOpen: boolean;
  activeSkinId: string;
  bestScore: number;
  unlockedSkinIds: string[];
  t: Translations;
  onClose: () => void;
  onSelectSkin: (skin: BirdSkin) => void;
  onWatchAdUnlockSkin: (skinId: string) => void;
}

export const SkinSelectModal: React.FC<SkinSelectModalProps> = ({
  isOpen,
  activeSkinId,
  bestScore,
  unlockedSkinIds,
  t,
  onClose,
  onSelectSkin,
  onWatchAdUnlockSkin,
}) => {
  if (!isOpen) return null;

  const getLocalizedSkinName = (id: string, defaultName: string) => {
    switch (id) {
      case 'yellow':
        return t.skinYellow;
      case 'red':
        return t.skinRed;
      case 'blue':
        return t.skinBlue;
      case 'emerald':
        return t.skinEmerald;
      case 'pink':
        return t.skinPink;
      case 'shadow':
        return t.skinShadow;
      default:
        return defaultName;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border-4 border-slate-950 rounded-3xl p-5 text-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3
              className="text-sm font-black uppercase tracking-wider text-amber-400"
              style={{ fontFamily: '"Press Start 2P", sans-serif' }}
            >
              {t.changeSkin}
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

        {/* Skins Grid */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
          {BIRD_SKINS.map((skin) => {
            const isUnlockedByScore = bestScore >= skin.requiredScore;
            const isUnlockedByAd = unlockedSkinIds.includes(skin.id);
            const isUnlocked = isUnlockedByScore || isUnlockedByAd;
            const isSelected = activeSkinId === skin.id;
            const localizedName = getLocalizedSkinName(skin.id, skin.name);

            return (
              <div
                key={skin.id}
                className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-950/40'
                    : isUnlocked
                    ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-950/60 border-slate-800 opacity-80'
                }`}
              >
                {/* Bird Preview Avatar */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center border-2 border-slate-900 relative shadow-inner overflow-hidden"
                    style={{ backgroundColor: skin.bodyColor }}
                  >
                    {/* Simplified Bird Icon */}
                    <div className="relative w-8 h-6">
                      {/* Body */}
                      <div
                        className="w-7 h-5 rounded-full border border-slate-900 absolute left-0 top-0.5"
                        style={{ backgroundColor: skin.bodyColor }}
                      />
                      {/* Wing */}
                      <div
                        className="w-3.5 h-2.5 rounded-full border border-slate-900 absolute left-1 top-2"
                        style={{ backgroundColor: skin.wingColor }}
                      />
                      {/* Beak */}
                      <div
                        className="w-2.5 h-2 rounded-sm border border-slate-900 absolute -right-1 top-1.5"
                        style={{ backgroundColor: skin.beakColor }}
                      />
                      {/* Eye */}
                      <div
                        className="w-2.5 h-3 rounded-full border border-slate-900 absolute left-4 top-0.5"
                        style={{ backgroundColor: skin.eyeColor }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full absolute right-0.5 top-0.5"
                          style={{ backgroundColor: skin.pupilColor }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skin Info */}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white">
                        {localizedName}
                      </span>
                      {isSelected && (
                        <span className="px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 text-[9px] font-black">
                          {t.inUse}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{skin.badge}</p>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  {isUnlocked ? (
                    <button
                      type="button"
                      disabled={isSelected}
                      onClick={() => onSelectSkin(skin)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95 ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 cursor-default'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-white'
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4 inline" /> : t.select}
                    </button>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <button
                        type="button"
                        onClick={() => onWatchAdUnlockSkin(skin.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white text-[10px] font-black flex items-center gap-1 shadow-md active:scale-95 transition-all"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>{t.unlockWithAd}</span>
                      </button>
                      <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        {t.scoreRequired.replace('{score}', String(skin.requiredScore))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            {t.yourRecord.replace('{score}', String(bestScore))}
          </p>
        </div>
      </div>
    </div>
  );
};
