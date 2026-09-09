import React from 'react';
import { X, Lock, Star, Play } from 'lucide-react';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  maxUnlockedLevel: number;
  starsPerLevel: Record<number, number>;
  onSelectLevel: (levelNum: number) => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  maxUnlockedLevel,
  starsPerLevel,
  onSelectLevel,
}) => {
  if (!isOpen) return null;

  const totalLevels = 12;
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-sky-50 to-white rounded-3xl overflow-hidden shadow-2xl border-2 border-sky-300 p-5 text-slate-800 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-100 mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              CHỌN MÀN CHƠI
            </h3>
            <p className="text-[11px] text-sky-600 font-semibold">
              Đã mở khóa: Màn {maxUnlockedLevel}/{totalLevels}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-3 gap-3 overflow-y-auto p-1 no-scrollbar">
          {levels.map((lvl) => {
            const isUnlocked = lvl <= maxUnlockedLevel;
            const isCurrent = lvl === currentLevel;
            const stars = starsPerLevel[lvl] || 0;

            return (
              <button
                key={lvl}
                type="button"
                disabled={!isUnlocked}
                onClick={() => {
                  onSelectLevel(lvl);
                  onClose();
                }}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 ${
                  isCurrent
                    ? 'border-sky-500 bg-sky-500 text-white shadow-lg scale-105 ring-4 ring-sky-200'
                    : isUnlocked
                    ? 'border-sky-200 bg-white hover:border-sky-400 hover:bg-sky-50 shadow-sm'
                    : 'border-slate-200 bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Level Number or Lock */}
                {isUnlocked ? (
                  <span className={`text-xl font-black ${isCurrent ? 'text-white' : 'text-slate-800'}`}>
                    {lvl}
                  </span>
                ) : (
                  <Lock className="w-5 h-5 text-slate-400 my-1" />
                )}

                {/* Stars */}
                {isUnlocked && (
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3 h-3 ${
                          starIdx <= stars
                            ? isCurrent
                              ? 'text-amber-300 fill-amber-300'
                              : 'text-amber-400 fill-amber-400'
                            : isCurrent
                            ? 'text-sky-300'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
