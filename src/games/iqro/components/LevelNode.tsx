import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Check, Sparkles, Gift } from 'lucide-react';
import { Stage } from '../../../core/types/gameTypes';
import { soundManager } from '../../../core/audio/soundManager';

interface LevelNodeProps {
  stage: Stage;
  isUnlocked: boolean;
  isCompleted: boolean;
  isActive: boolean;
  starsEarned: number;
  offsetPercent: number; // for serpentine curve (-30 to +30%)
  onSelect: (stage: Stage) => void;
}

export const LevelNode: React.FC<LevelNodeProps> = ({
  stage,
  isUnlocked,
  isCompleted,
  isActive,
  starsEarned,
  offsetPercent,
  onSelect,
}) => {
  const isChest = stage.type === 'boss-challenge';

  const handleClick = () => {
    if (!isUnlocked) {
      soundManager.playGentleWrong();
      return;
    }
    soundManager.playPop();
    onSelect(stage);
  };

  return (
    <div
      className="relative flex flex-col items-center my-5 select-none transition-all duration-300"
      style={{
        transform: `translateX(${offsetPercent}px)`,
      }}
    >
      {/* Active Stage Floating Marker / Mascot Indicator */}
      {isActive && (
        <motion.div
          initial={{ y: -8 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-12 z-20 flex flex-col items-center pointer-events-none"
        >
          <div className="bg-duo-yellow text-slate-900 text-xs font-black px-2.5 py-1 rounded-xl shadow-md border-2 border-amber-500 whitespace-nowrap uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
            MULAI
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-amber-500" />
        </motion.div>
      )}

      {/* Main 3D Node Button */}
      <div className="relative">
        {/* Active Pulse Glow Ring */}
        {isActive && (
          <div className="absolute -inset-2 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />
        )}

        <button
          onClick={handleClick}
          disabled={!isUnlocked}
          title={stage.title}
          className={`
            w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center relative
            transition-transform duration-100 outline-none
            ${
              !isUnlocked
                ? 'bg-slate-200 border-4 border-slate-300 text-slate-400 cursor-not-allowed shadow-[0_6px_0_#CBD5E1]'
                : isCompleted
                ? 'bg-duo-yellow hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#D97706] border-4 border-amber-300 text-white shadow-[0_7px_0_#D97706]'
                : isActive
                ? 'bg-duo-green hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#46A302] border-4 border-emerald-300 text-white shadow-[0_8px_0_#46A302] active-pulse-node'
                : 'bg-emerald-500 hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#059669] border-4 border-emerald-300 text-white shadow-[0_7px_0_#059669]'
            }
          `}
        >
          {/* Inner Content Icon or Hijaiyah Letter */}
          {!isUnlocked ? (
            <Lock className="w-7 h-7 text-slate-400" />
          ) : isChest ? (
            <Gift className="w-9 h-9 text-purple-700 fill-purple-200 animate-bounce" />
          ) : isCompleted ? (
            <Check className="w-9 h-9 text-amber-800 stroke-[3]" />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full py-1">
              <span className="font-arabic text-3xl font-bold leading-normal select-none">
                {stage.lettersCovered[0] || 'أ'}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-1.5 py-0.2 rounded-full leading-tight opacity-90">
                Lvl {stage.stageNumber}
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Stars Badge Row (Underneath completed node) */}
      {isCompleted && (
        <div className="flex items-center gap-1 mt-3.5 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-amber-200 shadow-sm">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-3.5 h-3.5 ${
                starIdx <= starsEarned
                  ? 'fill-duo-yellow text-amber-500'
                  : 'fill-slate-200 text-slate-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Stage Title for Toddlers / Parents */}
      <div className={`${isCompleted ? 'mt-2' : 'mt-3.5'} text-center max-w-[160px] px-1`}>
        <p className={`text-xs font-bold leading-snug line-clamp-2 ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
          {stage.title}
        </p>
      </div>
    </div>
  );
};
