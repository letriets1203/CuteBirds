import React from 'react';
import { Plus, Sparkles, Trash2, Hammer, Play } from 'lucide-react';
import { PowerUpType } from '../types';

interface PowerUpBarProps {
  freeUses: Record<PowerUpType, number>;
  onUsePowerUp: (type: PowerUpType) => void;
  isHammerActive: boolean;
}

export const PowerUpBar: React.FC<PowerUpBarProps> = ({
  freeUses,
  onUsePowerUp,
  isHammerActive,
}) => {
  const items: {
    type: PowerUpType;
    labelVi: string;
    icon: React.ReactNode;
    colorClasses: string;
    hoverClasses: string;
  }[] = [
    {
      type: 'addSlot',
      labelVi: '+ Slot Tạm',
      icon: <Plus className="w-5 h-5 stroke-[2.5]" />,
      colorClasses: 'from-blue-500 to-indigo-600 text-white shadow-blue-400/50',
      hoverClasses: 'hover:from-blue-400 hover:to-indigo-500',
    },
    {
      type: 'broom',
      labelVi: 'Chổi Dọn',
      icon: <Sparkles className="w-5 h-5 stroke-[2.5]" />,
      colorClasses: 'from-emerald-500 to-teal-600 text-white shadow-emerald-400/50',
      hoverClasses: 'hover:from-emerald-400 hover:to-teal-500',
    },
    {
      type: 'hammer',
      labelVi: 'Búa Phá',
      icon: <Hammer className="w-5 h-5 stroke-[2.5]" />,
      colorClasses: isHammerActive
        ? 'from-rose-600 to-red-700 ring-4 ring-rose-300 text-white shadow-rose-500/60 animate-pulse'
        : 'from-purple-500 to-violet-600 text-white shadow-purple-400/50',
      hoverClasses: 'hover:from-purple-400 hover:to-violet-500',
    },
  ];

  return (
    <div className="w-full max-w-md flex items-center justify-around gap-2 px-2 py-1">
      {items.map((item) => {
        const count = freeUses[item.type] || 0;
        const isAdRequired = count <= 0;

        return (
          <button
            key={item.type}
            id={`powerup-btn-${item.type}`}
            type="button"
            onClick={() => onUsePowerUp(item.type)}
            className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-gradient-to-b shadow-lg transition-all duration-200 active:scale-95 ${item.colorClasses} ${item.hoverClasses}`}
          >
            {/* Top Badge: Free count OR Rewarded Ad badge */}
            <div className="absolute -top-2 right-1.5 flex items-center shadow-md">
              {isAdRequired ? (
                <span className="flex items-center gap-0.5 bg-amber-400 text-amber-950 font-black text-[9px] px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  <Play className="w-2.5 h-2.5 fill-amber-950" />
                  <span>Ad</span>
                </span>
              ) : (
                <span className="bg-white text-slate-800 font-extrabold text-[10px] px-1.5 py-0.2 rounded-full ring-2 ring-white/60">
                  {count}
                </span>
              )}
            </div>

            {/* Icon */}
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-1">
              {item.icon}
            </div>

            {/* Label */}
            <span className="text-[11px] font-bold tracking-tight whitespace-nowrap">
              {item.labelVi}
            </span>
          </button>
        );
      })}
    </div>
  );
};
