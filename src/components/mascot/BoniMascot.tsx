import React from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../../core/audio/soundManager';
import { ttsNarrator } from '../../core/audio/ttsNarrator';

interface BoniMascotProps {
  mood?: 'idle' | 'happy' | 'cheering' | 'thinking';
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: boolean;
  speechText?: string;
  onClick?: () => void;
}

export const BoniMascot: React.FC<BoniMascotProps> = ({
  mood = 'idle',
  size = 'md',
  showSpeechBubble = false,
  speechText = 'Ayo belajar mengaji bersama Boni!',
  onClick,
}) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-44 h-44',
  };

  const handleTap = () => {
    soundManager.playPop();
    ttsNarrator.speak('Halo! Boni siap menemanimu!');
    onClick?.();
  };

  return (
    <div className="relative inline-flex flex-col items-center select-none cursor-pointer" onClick={handleTap}>
      {/* Optional Speech Bubble */}
      {showSpeechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 max-w-[200px] bg-white border-2 border-duo-green/40 shadow-duo-card rounded-2xl p-2.5 text-center text-xs md:text-sm font-bold text-slate-700 relative"
        >
          {speechText}
          {/* Bubble beak pointing down */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
        </motion.div>
      )}

      {/* Mascot Animated Character (Boni: Burung Bulbul Hijau Berpeci Hitam Emas) */}
      <motion.div
        animate={
          mood === 'happy' || mood === 'cheering'
            ? {
                y: [0, -18, 0],
                rotate: [0, -4, 4, 0],
                scale: [1, 1.08, 1],
              }
            : {
                y: [0, -6, 0],
              }
        }
        transition={{
          duration: mood === 'happy' || mood === 'cheering' ? 0.6 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`${sizeMap[size]} relative filter drop-shadow-lg`}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* Shadow underneath */}
          <ellipse cx="60" cy="112" rx="36" ry="7" fill="rgba(0,0,0,0.12)" />

          {/* Wings Left & Right */}
          <motion.ellipse
            cx="25"
            cy="70"
            rx="12"
            ry="20"
            fill="#46A302"
            transform="rotate(-25 25 70)"
            animate={
              mood === 'cheering'
                ? { rotate: [-25, -60, -25], y: [-5, -12, -5] }
                : { rotate: [-25, -15, -25] }
            }
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <motion.ellipse
            cx="95"
            cy="70"
            rx="12"
            ry="20"
            fill="#46A302"
            transform="rotate(25 95 70)"
            animate={
              mood === 'cheering'
                ? { rotate: [25, 60, 25], y: [-5, -12, -5] }
                : { rotate: [25, 15, 25] }
            }
            transition={{ duration: 0.8, repeat: Infinity }}
          />

          {/* Main Body (Plump Cute Round Green Bird) */}
          <circle cx="60" cy="68" r="42" fill="#58CC02" />

          {/* Belly (Light Yellow/Cream) */}
          <ellipse cx="60" cy="78" rx="28" ry="24" fill="#FFFBEB" />

          {/* Cheeks (Blushing Pink) */}
          <circle cx="36" cy="74" r="6" fill="#FCA5A5" opacity="0.7" />
          <circle cx="84" cy="74" r="6" fill="#FCA5A5" opacity="0.7" />

          {/* Big Big Eyes for Toddler Appeal */}
          <circle cx="44" cy="56" r="10" fill="#FFFFFF" />
          <circle cx="44" cy="56" r="6" fill="#1E293B" />
          <circle cx="42" cy="53" r="2.5" fill="#FFFFFF" />

          <circle cx="76" cy="56" r="10" fill="#FFFFFF" />
          <circle cx="76" cy="56" r="6" fill="#1E293B" />
          <circle cx="74" cy="53" r="2.5" fill="#FFFFFF" />

          {/* Cute Orange Beak */}
          <polygon points="60,60 52,69 68,69" fill="#FF9600" />
          <polygon points="60,74 54,69 66,69" fill="#E08500" />

          {/* Peci / Songkok Hitam Islami with Golden Border on Top of Head */}
          <path
            d="M 40 32 C 40 20, 80 20, 80 32 Z"
            fill="#1E293B"
          />
          <rect x="39" y="30" width="42" height="5" rx="2" fill="#FFC800" />

          {/* Little Feet */}
          <ellipse cx="48" cy="107" rx="6" ry="4" fill="#FF9600" />
          <ellipse cx="72" cy="107" rx="6" ry="4" fill="#FF9600" />
        </svg>
      </motion.div>
    </div>
  );
};
