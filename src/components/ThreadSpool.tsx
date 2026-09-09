import React from 'react';
import { ColorId } from '../types';
import { SPOOL_COLORS } from '../constants/colors';

interface ThreadSpoolProps {
  color: ColorId;
  size?: 'sm' | 'md' | 'lg';
  isTop?: boolean;
  isClickable?: boolean;
  isTargeted?: boolean;
  className?: string;
  countLabel?: number;
}

export const ThreadSpool: React.FC<ThreadSpoolProps> = ({
  color,
  size = 'md',
  isTop = false,
  isClickable = false,
  isTargeted = false,
  className = '',
  countLabel,
}) => {
  const colorInfo = SPOOL_COLORS[color] || SPOOL_COLORS.mint;

  // Dimensions based on size
  const dimensions = {
    sm: { width: 'w-10', height: 'h-6', flangeH: 'h-1.5', flangeW: 'w-11', text: 'text-[9px]' },
    md: { width: 'w-14 sm:w-16', height: 'h-9 sm:h-10', flangeH: 'h-2', flangeW: 'w-15 sm:w-18', text: 'text-xs' },
    lg: { width: 'w-20', height: 'h-12', flangeH: 'h-2.5', flangeW: 'w-22', text: 'text-sm' },
  }[size];

  return (
    <div
      className={`relative flex flex-col items-center justify-center transition-transform select-none ${
        isClickable ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${isTargeted ? 'animate-pulse ring-4 ring-rose-400 ring-offset-2 rounded-lg' : ''} ${className}`}
    >
      {/* Top Wood/Plastic Flange Rim (3D bevel) */}
      <div
        className={`${dimensions.flangeW} ${dimensions.flangeH} rounded-full z-10 shadow-sm border border-black/10`}
        style={{
          background: 'linear-gradient(180deg, #f7f1e5 0%, #d8caa9 60%, #b3a078 100%)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
        }}
      >
        {/* Inner spindle hole */}
        <div className="w-2.5 h-1 mx-auto mt-0.5 rounded-full bg-stone-700/60 shadow-inner" />
      </div>

      {/* Main Spool Body with Thread Strands */}
      <div
        className={`${dimensions.width} ${dimensions.height} relative -my-1 rounded-sm overflow-hidden flex items-center justify-center shadow-md transition-shadow`}
        style={{
          backgroundColor: colorInfo.mainColor,
          backgroundImage: `
            linear-gradient(90deg, 
              ${colorInfo.darkColor} 0%, 
              ${colorInfo.lightColor} 25%, 
              ${colorInfo.mainColor} 50%, 
              ${colorInfo.lightColor} 75%, 
              ${colorInfo.darkColor} 100%
            ),
            ${colorInfo.stripes}
          `,
          boxShadow: isTop
            ? `0 4px 10px ${colorInfo.glowColor}, inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.25)`
            : 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
          borderLeft: `2px solid ${colorInfo.borderColor}`,
          borderRight: `2px solid ${colorInfo.borderColor}`,
        }}
      >
        {/* Horizontal Thread Strand Lines */}
        <div className="absolute inset-0 opacity-40 flex flex-col justify-between py-1 pointer-events-none">
          <div className="w-full h-px bg-white/60" />
          <div className="w-full h-px bg-black/20" />
          <div className="w-full h-px bg-white/50" />
          <div className="w-full h-px bg-black/25" />
          <div className="w-full h-px bg-white/40" />
        </div>

        {/* Specular 3D Highlight Beam */}
        <div
          className="absolute inset-y-0 left-1/4 w-3 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
        />

        {/* Optional Count or Badge */}
        {countLabel !== undefined && countLabel > 0 && (
          <span
            className={`relative z-10 font-black px-1.5 py-0.5 rounded-full bg-black/40 text-white shadow-sm ${dimensions.text}`}
          >
            {countLabel}
          </span>
        )}
      </div>

      {/* Bottom Wood/Plastic Flange Rim (3D bevel) */}
      <div
        className={`${dimensions.flangeW} ${dimensions.flangeH} rounded-full z-10 shadow-sm border border-black/15`}
        style={{
          background: 'linear-gradient(180deg, #d8caa9 0%, #b3a078 60%, #877452 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
};
