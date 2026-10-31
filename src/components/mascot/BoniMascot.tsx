import React from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../../core/audio/soundManager';
import { ttsNarrator } from '../../core/audio/ttsNarrator';

interface BoniMascotProps {
  characterName?: string;
  mood?: 'idle' | 'happy' | 'cheering' | 'thinking';
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: boolean;
  speechText?: string;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedCape?: string;
  onClick?: () => void;
}

export const BoniMascot: React.FC<BoniMascotProps> = ({
  characterName = 'Faqih',
  mood = 'idle',
  size = 'md',
  showSpeechBubble = false,
  speechText,
  equippedHat = 'hat-default',
  equippedGlasses = 'glasses-none',
  equippedCape = 'cape-none',
  onClick,
}) => {
  const effectiveSpeechText = speechText || `Ayo belajar mengaji bersama ${characterName}!`;

  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-44 h-44',
  };

  const handleTap = () => {
    soundManager.playPop();
    ttsNarrator.speak(`Halo! ${characterName} siap menemanimu!`);
    onClick?.();
  };

  return (
    <div className="relative inline-flex flex-col items-center select-none cursor-pointer" onClick={handleTap}>
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 max-w-[200px] bg-white border-2 border-duo-green/40 shadow-duo-card rounded-2xl p-2.5 text-center text-xs md:text-sm font-bold text-slate-700 relative z-20"
        >
          {effectiveSpeechText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
        </motion.div>
      )}

      {/* Mascot Animated Character */}
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
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="25%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="75%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>

          {/* Shadow underneath */}
          <ellipse cx="60" cy="112" rx="36" ry="7" fill="rgba(0,0,0,0.12)" />

          {/* CAPE: Behind the body */}
          {equippedCape === 'cape-hero' && (
            <motion.path
              d="M 36 65 Q 20 105 32 110 Q 60 102 88 110 Q 100 105 84 65 Z"
              fill="#10B981"
              stroke="#047857"
              strokeWidth="2"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          {equippedCape === 'cape-rainbow' && (
            <motion.path
              d="M 36 65 Q 18 105 30 112 Q 60 104 90 112 Q 102 105 84 65 Z"
              fill="url(#rainbowGrad)"
              stroke="#A855F7"
              strokeWidth="2"
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

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

          {/* Main Body */}
          <circle cx="60" cy="68" r="42" fill="#58CC02" />

          {/* Belly */}
          <ellipse cx="60" cy="78" rx="28" ry="24" fill="#FFFBEB" />

          {/* Cheeks */}
          <circle cx="36" cy="74" r="6" fill="#FCA5A5" opacity="0.7" />
          <circle cx="84" cy="74" r="6" fill="#FCA5A5" opacity="0.7" />

          {/* Big Eyes */}
          <circle cx="44" cy="56" r="10" fill="#FFFFFF" />
          <circle cx="44" cy="56" r="6" fill="#1E293B" />
          <circle cx="42" cy="53" r="2.5" fill="#FFFFFF" />

          <circle cx="76" cy="56" r="10" fill="#FFFFFF" />
          <circle cx="76" cy="56" r="6" fill="#1E293B" />
          <circle cx="74" cy="53" r="2.5" fill="#FFFFFF" />

          {/* GLASSES: Over the eyes */}
          {equippedGlasses === 'glasses-round' && (
            <g stroke="#1E293B" strokeWidth="3" fill="none">
              <circle cx="44" cy="56" r="12" stroke="#1E293B" fill="rgba(255,255,255,0.2)" />
              <circle cx="76" cy="56" r="12" stroke="#1E293B" fill="rgba(255,255,255,0.2)" />
              <path d="M 56 56 Q 60 52 64 56" />
            </g>
          )}
          {equippedGlasses === 'glasses-star' && (
            <g fill="#F59E0B" stroke="#D97706" strokeWidth="1.5">
              <polygon points="44,45 47,53 55,54 49,60 51,68 44,63 37,68 39,60 33,54 41,53" opacity="0.85" />
              <polygon points="76,45 79,53 87,54 81,60 83,68 76,63 69,68 71,60 65,54 73,53" opacity="0.85" />
              <line x1="55" y1="56" x2="65" y2="56" stroke="#D97706" strokeWidth="3" />
            </g>
          )}

          {/* Cute Orange Beak */}
          <polygon points="60,60 52,69 68,69" fill="#FF9600" />
          <polygon points="60,74 54,69 66,69" fill="#E08500" />

          {/* HAT / HEADWEAR */}
          {equippedHat === 'hat-default' && (
            <g>
              <path d="M 40 32 C 40 20, 80 20, 80 32 Z" fill="#1E293B" />
              <rect x="39" y="30" width="42" height="5" rx="2" fill="#FFC800" />
            </g>
          )}
          {equippedHat === 'hat-red' && (
            <g>
              <path d="M 40 32 C 40 18, 80 18, 80 32 Z" fill="#EF4444" />
              <rect x="39" y="30" width="42" height="5" rx="2" fill="#FFFFFF" />
              <circle cx="60" cy="24" r="3" fill="#FFFFFF" />
            </g>
          )}
          {equippedHat === 'hat-gold' && (
            <g>
              {/* Crown */}
              <polygon points="38,32 38,16 48,24 60,12 72,24 82,16 82,32" fill="#FFC800" stroke="#D97706" strokeWidth="1.5" />
              <circle cx="60" cy="14" r="2.5" fill="#EF4444" />
              <circle cx="48" cy="23" r="2" fill="#3B82F6" />
              <circle cx="72" cy="23" r="2" fill="#3B82F6" />
              <rect x="37" y="30" width="46" height="4" rx="1.5" fill="#D97706" />
            </g>
          )}
          {equippedHat === 'hat-turban' && (
            <g>
              {/* White Turban */}
              <ellipse cx="60" cy="28" rx="24" ry="12" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
              <circle cx="60" cy="24" r="9" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <circle cx="60" cy="26" r="3.5" fill="#10B981" />
            </g>
          )}

          {/* Little Feet */}
          <ellipse cx="48" cy="107" rx="6" ry="4" fill="#FF9600" />
          <ellipse cx="72" cy="107" rx="6" ry="4" fill="#FF9600" />
        </svg>
      </motion.div>
    </div>
  );
};
