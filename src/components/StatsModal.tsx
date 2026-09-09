import React from 'react';
import { X, Trophy, Zap, RefreshCw, BarChart2, CheckCircle } from 'lucide-react';
import { DifficultyMode, DIFFICULTY_CONFIGS } from '../constants/flappy';
import { FlappyStats } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  stats: FlappyStats;
  difficulty: DifficultyMode;
  onClose: () => void;
  onChangeDifficulty: (mode: DifficultyMode) => void;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  stats,
  difficulty,
  onClose,
  onChangeDifficulty,
  onResetStats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border-4 border-slate-950 rounded-3xl p-5 text-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-sky-400" />
            <h3
              className="text-sm font-black uppercase tracking-wider text-sky-400"
              style={{ fontFamily: '"Press Start 2P", sans-serif' }}
            >
              THỐNG KÊ & CÀI ĐẶT
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

        {/* Stats Grid */}
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Kỷ lục cao nhất</span>
              </div>
              <div
                className="text-2xl font-black text-white"
                style={{ fontFamily: '"Press Start 2P", sans-serif' }}
              >
                {stats.bestScore}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <RefreshCw className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Số trận đã chơi</span>
              </div>
              <div
                className="text-2xl font-black text-white"
                style={{ fontFamily: '"Press Start 2P", sans-serif' }}
              >
                {stats.totalGames}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-sky-400 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Lần vỗ cánh</span>
              </div>
              <div className="text-xl font-black text-white">
                {stats.totalFlaps.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Tổng điểm tích lũy</span>
              </div>
              <div className="text-xl font-black text-white">
                {stats.totalScore.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Mức độ khó
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['easy', 'normal', 'hard'] as DifficultyMode[]).map((mode) => {
                const config = DIFFICULTY_CONFIGS[mode];
                const isActive = difficulty === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onChangeDifficulty(mode)}
                    className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-md scale-102'
                        : 'bg-slate-700/80 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    <span>{mode === 'easy' ? 'DỄ' : mode === 'normal' ? 'CHUẨN' : 'KHÓ'}</span>
                    <span className="text-[8px] font-semibold opacity-80">
                      {mode === 'easy' ? 'Khe rộng' : mode === 'normal' ? 'Kinh điển' : 'Tốc độ cao'}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              {DIFFICULTY_CONFIGS[difficulty].description}
            </p>
          </div>
        </div>

        {/* Footer with Reset Button */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn đặt lại toàn bộ kỷ lục và số liệu?')) {
                onResetStats();
              }
            }}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold underline"
          >
            Đặt lại kỷ lục
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
