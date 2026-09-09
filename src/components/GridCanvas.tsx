import React from 'react';
import { SpoolStack } from '../types';
import { ThreadSpool } from './ThreadSpool';

interface GridCanvasProps {
  stacks: SpoolStack[];
  onStackClick: (stackId: string, event: React.MouseEvent) => void;
  onSpoolClickInHammerMode?: (stackId: string, spoolIndex: number) => void;
  isHammerMode: boolean;
  highlightedStackId?: string | null;
}

export const GridCanvas: React.FC<GridCanvasProps> = ({
  stacks,
  onStackClick,
  onSpoolClickInHammerMode,
  isHammerMode,
  highlightedStackId,
}) => {
  return (
    <div className="relative w-full flex-1 min-h-[320px] max-h-[500px] rounded-3xl overflow-hidden shadow-inner border-2 border-sky-200/60 bg-gradient-to-b from-sky-100/90 via-sky-50 to-blue-50/80 p-4 flex flex-col justify-center">
      {/* Subtle Grid Canvas Mesh Lines (Blueprint / Textile Grid pattern) */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, #38bdf8 1.5px, transparent 0)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative Textile Subtle Ruler Markers */}
      <div className="absolute top-2 left-4 right-4 flex justify-between opacity-30 text-[9px] font-mono text-sky-800 pointer-events-none">
        <span>0cm</span>
        <span>•</span>
        <span>5cm</span>
        <span>•</span>
        <span>10cm</span>
        <span>•</span>
        <span>15cm</span>
        <span>•</span>
        <span>20cm</span>
      </div>

      {/* Hammer Mode Alert Banner */}
      {isHammerMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce flex items-center gap-1.5">
          <span>🔨 Chạm vào ống chỉ bạn muốn phá hủy!</span>
        </div>
      )}

      {/* Spool Stacks Grid Layout */}
      <div
        className={`relative z-10 w-full h-full overflow-y-auto no-scrollbar grid gap-y-4 gap-x-2 sm:gap-x-4 items-center justify-items-center py-3 px-1 sm:px-2 ${
          stacks.length <= 4
            ? 'grid-cols-2'
            : stacks.length <= 6
            ? 'grid-cols-3'
            : 'grid-cols-3 sm:grid-cols-4'
        }`}
      >
        {stacks.map((stack) => {
          const isEmpty = stack.spools.length === 0;
          const isHighlighted = highlightedStackId === stack.id;
          const isCrowded = stacks.length > 6 || stack.spools.length > 4;

          return (
            <div
              key={stack.id}
              id={`stack-${stack.id}`}
              onClick={(e) => !isEmpty && !isHammerMode && onStackClick(stack.id, e)}
              className={`relative flex flex-col items-center justify-end min-h-[130px] sm:min-h-[145px] p-1.5 sm:p-2 rounded-2xl transition-all duration-200 ${
                isCrowded ? 'w-20 sm:w-24' : 'w-24 sm:w-28'
              } ${
                isEmpty
                  ? 'opacity-25 pointer-events-none'
                  : isHammerMode
                  ? 'cursor-crosshair'
                  : 'cursor-pointer hover:bg-white/40 active:scale-95'
              } ${
                isHighlighted ? 'ring-4 ring-amber-400 bg-amber-100/40' : ''
              }`}
            >
              {/* Spool Pedestal / Wooden Base */}
              <div
                className={`absolute bottom-1 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 rounded-full border border-amber-400/60 shadow-md ${
                  isCrowded ? 'w-14 sm:w-18 h-3.5' : 'w-16 sm:w-20 h-4'
                }`}
              >
                {/* Spindle Rod (Vertical Peg) */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-28 bg-gradient-to-r from-stone-400 to-stone-500 rounded-t-full shadow-inner opacity-40 -z-10" />
              </div>

              {/* Stacked Spools (drawn bottom to top, with vertical overlap) */}
              <div className="relative flex flex-col-reverse items-center mb-1.5 z-10">
                {stack.spools.map((spool, idx) => {
                  const isTop = idx === stack.spools.length - 1;
                  return (
                    <div
                      key={spool.id}
                      id={`spool-${spool.id}`}
                      onClick={(e) => {
                        if (isHammerMode && onSpoolClickInHammerMode) {
                          e.stopPropagation();
                          onSpoolClickInHammerMode(stack.id, idx);
                        }
                      }}
                      className={`relative transition-transform duration-200 ${
                        idx > 0
                          ? stack.spools.length > 5
                            ? '-mb-4 sm:-mb-5'
                            : stack.spools.length > 3
                            ? '-mb-3.5 sm:-mb-4'
                            : '-mb-3'
                          : ''
                      } ${
                        isTop && !isHammerMode
                          ? 'hover:-translate-y-1'
                          : ''
                      } ${
                        isHammerMode ? 'hover:scale-110 cursor-pointer' : ''
                      }`}
                      style={{
                        zIndex: idx + 1,
                      }}
                    >
                      <ThreadSpool
                        color={spool.color}
                        size={isCrowded ? 'sm' : 'md'}
                        isTop={isTop}
                        isTargeted={isHammerMode}
                        isClickable={isTop && !isHammerMode}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Stack Count Indicator Pill */}
              {!isEmpty && (
                <div className="absolute -top-1 bg-sky-600/90 text-white font-extrabold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                  {stack.spools.length}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
