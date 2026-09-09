import React from 'react';
import { Lock, Play, Sparkles } from 'lucide-react';
import { RollerSegment, TempSlot } from '../types';
import { SPOOL_COLORS } from '../constants/colors';
import { ThreadSpool } from './ThreadSpool';

interface RollerBarProps {
  segments: RollerSegment[];
  tempSlots: TempSlot[];
  onUnlockWithAd: (segmentId: string) => void;
  onTempSlotClick?: (slotId: string) => void;
  burstingSegmentId: string | null;
}

export const RollerBar: React.FC<RollerBarProps> = ({
  segments,
  tempSlots,
  onUnlockWithAd,
  onTempSlotClick,
  burstingSegmentId,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Main Roller Mechanical Assembly */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-sky-900/80 via-slate-800 to-sky-950 p-2 sm:p-3 rounded-2xl shadow-xl border-2 border-sky-400/40 backdrop-blur-md">
        {/* Metallic Roller Axel Highlights */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 via-sky-200 to-slate-400 opacity-40 pointer-events-none -translate-y-1/2" />
        
        {/* Roller Left & Right Mechanical End Caps */}
        <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-10 bg-gradient-to-r from-amber-400 to-amber-600 rounded-l-md shadow-md border border-amber-300/50" />
        <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-10 bg-gradient-to-l from-amber-400 to-amber-600 rounded-r-md shadow-md border border-amber-300/50" />

        {/* Segments Container */}
        <div
          id="roller-segments-container"
          className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-1 px-2 no-scrollbar"
        >
          {segments.map((segment) => {
            const colorInfo = SPOOL_COLORS[segment.color] || SPOOL_COLORS.mint;
            const isFull = segment.currentCount >= segment.capacity;
            const isBursting = burstingSegmentId === segment.id;

              const isCompleted = segment.isCompleted || (segment.totalCollected >= segment.totalRequired && segment.totalRequired > 0);

            return (
              <div
                key={segment.id}
                id={`roller-segment-${segment.id}`}
                className={`relative flex-1 min-w-[70px] max-w-[100px] flex flex-col items-center justify-between p-2 rounded-xl transition-all duration-300 ${
                  segment.isLocked
                    ? 'bg-slate-800/90 border border-dashed border-slate-600'
                    : isCompleted
                    ? 'bg-emerald-950/80 border border-emerald-500/60 shadow-lg'
                    : isBursting
                    ? 'scale-110 ring-4 ring-yellow-400 shadow-2xl bg-white/20'
                    : 'bg-slate-900/90 border border-slate-700 shadow-inner'
                }`}
                style={{
                  boxShadow: segment.isLocked
                    ? 'none'
                    : isCompleted
                    ? '0 0 14px rgba(16, 185, 129, 0.4), inset 0 1px 3px rgba(0,0,0,0.5)'
                    : `0 0 12px ${colorInfo.glowColor}, inset 0 2px 4px rgba(0,0,0,0.5)`,
                }}
              >
                {/* Segment Color Header Pill */}
                <div className="flex flex-col items-center gap-0.5 mb-1 w-full">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-sm shrink-0"
                      style={{ backgroundColor: colorInfo.mainColor }}
                    />
                    <span className="text-[10px] sm:text-xs font-bold text-slate-200">
                      {isCompleted ? 'XONG' : `${segment.currentCount}/${segment.capacity}`}
                    </span>
                  </div>
                  {segment.totalRequired > 0 && !segment.isLocked && (
                    <span className="text-[8px] font-semibold text-slate-400">
                      {Math.min(segment.totalRequired, segment.totalCollected + segment.currentCount)}/{segment.totalRequired}
                    </span>
                  )}
                </div>

                {/* Segment Slot Body */}
                <div className="relative w-full h-16 flex flex-col items-center justify-center rounded-lg overflow-hidden">
                  {segment.isLocked ? (
                    // Locked Segment State
                    <div className="flex flex-col items-center justify-center w-full h-full gap-1">
                      <div className="w-7 h-7 rounded-full bg-slate-700/80 border border-slate-500 flex items-center justify-center text-amber-300 shadow">
                        <Lock className="w-3.5 h-3.5" />
                      </div>

                      {/* Small Rewarded Ad Unlock Button (▶️) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUnlockWithAd(segment.id);
                        }}
                        title="Xem quảng cáo mở khóa ngay"
                        className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-[9px] font-black text-white shadow-md active:scale-95 transition-transform"
                      >
                        <Play className="w-2.5 h-2.5 fill-white" />
                        <span>MỞ</span>
                      </button>
                    </div>
                  ) : isCompleted ? (
                    // Completed Color State
                    <div className="flex flex-col items-center justify-center w-full h-full text-emerald-400 gap-1 animate-in fade-in zoom-in-75">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shadow-inner">
                        <Sparkles className="w-4 h-4 fill-emerald-300 text-emerald-200" />
                      </div>
                      <span className="text-[9px] font-extrabold text-emerald-300 tracking-wider">ĐÃ HẾT</span>
                    </div>
                  ) : (
                    // Unlocked Segment Active State
                    <div className="flex flex-col items-center justify-center w-full h-full relative">
                      {/* Visual indicator of stacked spools */}
                      {segment.currentCount === 0 ? (
                        <div
                          className="w-10 h-7 rounded-md border-2 border-dashed flex items-center justify-center opacity-40 text-[9px] font-bold"
                          style={{ borderColor: colorInfo.mainColor, color: colorInfo.mainColor }}
                        >
                          Trống
                        </div>
                      ) : (
                        <div className="relative flex flex-col items-center justify-center">
                          <ThreadSpool
                            color={segment.color}
                            size="sm"
                            isTop={true}
                            countLabel={segment.currentCount}
                          />
                          {isFull && (
                            <div className="absolute -top-1 -right-1 text-amber-300 animate-bounce">
                              <Sparkles className="w-4 h-4 fill-amber-300" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress Mini Bar at bottom of segment */}
                <div className="w-full h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${
                        isCompleted
                          ? 100
                          : Math.min(100, (segment.currentCount / segment.capacity) * 100)
                      }%`,
                      backgroundColor: isCompleted ? '#10b981' : colorInfo.mainColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Temporary Slots (Slots chứa tạm từ Power-up '+') */}
      {tempSlots.length > 0 && (
        <div className="flex items-center justify-center gap-2 bg-sky-900/40 p-2 rounded-xl border border-sky-300/30 backdrop-blur-sm">
          <span className="text-[11px] font-bold text-sky-800 bg-sky-200/90 px-2 py-0.5 rounded-md shadow-xs">
            Slot tạm thời:
          </span>
          <div className="flex items-center gap-2">
            {tempSlots.map((slot) => (
              <div
                key={slot.id}
                id={`temp-slot-${slot.id}`}
                onClick={() => onTempSlotClick && onTempSlotClick(slot.id)}
                className={`w-12 h-12 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                  slot.spool
                    ? 'border-sky-400 bg-sky-100/80 shadow-md cursor-pointer hover:scale-105'
                    : 'border-sky-300/70 bg-white/40 text-sky-400 text-xs font-bold'
                }`}
              >
                {slot.spool ? (
                  <ThreadSpool color={slot.spool.color} size="sm" isClickable={true} />
                ) : (
                  <span className="opacity-60">+</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
