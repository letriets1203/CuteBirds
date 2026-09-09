import React, { useEffect } from 'react';
import {
  Trophy,
  Star,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Coins,
  Play,
  Sparkles,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleAdBanner } from './GoogleAdBanner';

interface WinModalProps {
  isOpen: boolean;
  levelNumber: number;
  stars: number;
  rewardCoins: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onClaimRewards: () => void;
  isRewardClaimed: boolean;
}

export const LevelWinModal: React.FC<WinModalProps> = ({
  isOpen,
  levelNumber,
  stars,
  rewardCoins,
  onNextLevel,
  onReplay,
  onClaimRewards,
  isRewardClaimed,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#48cfad', '#ff7fa2', '#4fc1e9', '#f7d354', '#ac92ec'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-sky-50 to-white rounded-3xl overflow-hidden shadow-2xl border-4 border-sky-300 p-6 flex flex-col items-center text-center">
        {/* Glowing Trophy Badge */}
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center shadow-lg border-4 border-white animate-bounce">
            <Trophy className="w-12 h-12 text-amber-900" />
          </div>

          {/* 3 Stars */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
            {[1, 2, 3].map((starIdx) => (
              <div
                key={starIdx}
                className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md ${
                  starIdx <= stars
                    ? 'bg-amber-400 text-amber-950 border border-white'
                    : 'bg-slate-300 text-slate-500'
                }`}
              >
                <Star className="w-4 h-4 fill-current" />
              </div>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black tracking-tight text-slate-800 mt-3">
          LEVEL COMPLETE!
        </h3>
        <p className="text-xs font-semibold text-sky-600 mb-4">
          Chúc mừng! Bạn đã hoàn thành Màn {levelNumber}
        </p>

        {/* Coins Reward Card */}
        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-sm text-amber-950">
              <Coins className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-amber-900">Phần Thưởng</div>
              <div className="text-[11px] text-amber-700">+{rewardCoins} Xu vàng</div>
            </div>
          </div>

          {!isRewardClaimed ? (
            <button
              type="button"
              onClick={onClaimRewards}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs shadow-md active:scale-95 transition-transform"
            >
              NHẬN
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
              ✓ Đã nhận
            </span>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onNextLevel}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-transform"
          >
            <span>MÀN TIẾP THEO</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onReplay}
            className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>CHƠI LẠI MÀN NÀY</span>
          </button>
        </div>

        {/* Google Ads Placement */}
        <div className="w-full mt-4">
          <GoogleAdBanner slotId="5566778899" format="horizontal" />
        </div>
      </div>
    </div>
  );
};

interface LoseModalProps {
  isOpen: boolean;
  reason?: string;
  levelNumber?: number;
  onWatchAdRevive?: () => void;
  onRestartLevel?: () => void;
  onRetry?: () => void;
  onLevelSelect?: () => void;
}

export const GameOverModal: React.FC<LoseModalProps> = ({
  isOpen,
  reason = 'Slot tạm thời đã đầy vượt mức yêu cầu!',
  levelNumber = 1,
  onWatchAdRevive,
  onRestartLevel,
  onRetry,
  onLevelSelect,
}) => {
  if (!isOpen) return null;

  const handleRestart = onRestartLevel || onRetry || (() => {});

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900/95 rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-500/50 p-6 flex flex-col items-center text-center text-white">
        {/* Glow effect behind warning badge */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600/30 to-amber-500/30 border border-rose-500/60 flex items-center justify-center text-rose-400 animate-pulse shadow-lg shadow-rose-950">
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black tracking-tight text-rose-400 mb-1">
          GAME OVER!
        </h3>

        {/* Current level badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-sky-300 mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Màn {levelNumber}</span>
        </div>

        {/* Reason explanation */}
        <div className="w-full bg-rose-950/40 border border-rose-800/60 rounded-2xl p-3 mb-5 text-left">
          <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wide mb-1 flex items-center gap-1">
            <span>Nguyên nhân thua cuộc</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {reason}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          {/* Option 1: Watch Ad to Continue / Revive */}
          {onWatchAdRevive && (
            <button
              type="button"
              id="gameover-watch-ad-revive-btn"
              onClick={onWatchAdRevive}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-400 hover:via-rose-400 hover:to-pink-400 text-white font-black shadow-xl shadow-rose-950/50 flex items-center justify-between group active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shadow-xs">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black tracking-wide leading-tight">
                    COI QUẢNG CÁO ĐỂ TIẾP TỤC
                  </div>
                  <div className="text-[10px] text-amber-100 font-normal leading-tight">
                    Dọn trống ô tạm & tiếp tục tiến độ
                  </div>
                </div>
              </div>

              <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
            </button>
          )}

          {/* Option 2: Restart from current level */}
          <button
            type="button"
            id="gameover-restart-level-btn"
            onClick={handleRestart}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 hover:border-slate-600 text-white shadow-md flex items-center justify-between active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-extrabold tracking-wide text-slate-100 leading-tight">
                  CHƠI LẠI LEVEL HIỆN TẠI
                </div>
                <div className="text-[10px] text-slate-400 font-normal leading-tight">
                  Bắt đầu lại Màn {levelNumber} từ đầu
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Option 3: Select Level (Secondary) */}
          {onLevelSelect && (
            <button
              type="button"
              id="gameover-select-level-btn"
              onClick={onLevelSelect}
              className="w-full py-2 rounded-xl text-slate-400 hover:text-slate-200 font-semibold text-xs transition-colors"
            >
              Chọn màn chơi khác
            </button>
          )}
        </div>

        {/* Google Ads Placement */}
        <div className="w-full mt-4">
          <GoogleAdBanner slotId="4433221100" format="horizontal" />
        </div>
      </div>
    </div>
  );
};
