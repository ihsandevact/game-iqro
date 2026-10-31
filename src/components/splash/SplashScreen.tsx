import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen } from 'lucide-react';
import { soundManager } from '../../core/audio/soundManager';

interface SplashScreenProps {
  onComplete: () => void;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedCape?: string;
}

const FUN_TIPS = [
  'Boni sedang merapikan peci...',
  'Menyiapkan kartu huruf hijaiyah...',
  'Tahukah kamu? Huruf BA punya mangkok dan 1 bakso di bawah!',
  'Tahukah kamu? Huruf TA punya 2 mata tersenyum!',
  'Bismillah, ayo siap bertualang!',
];

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  equippedHat = 'hat-default',
  equippedGlasses = 'glasses-none',
  equippedCape = 'cape-none',
}) => {
  const [progress, setProgress] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  // Smoothly increment progress bar to 100% over ~2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleFinish();
          return 100;
        }
        // Random friendly increments
        const increment = Math.floor(Math.random() * 14) + 8;
        return Math.min(100, prev + increment);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Rotate fun tips every 1.4 seconds
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % FUN_TIPS.length);
    }, 1400);

    return () => clearInterval(tipInterval);
  }, []);

  const handleFinish = () => {
    if (isFinishing) return;
    setIsFinishing(true);
    soundManager.playAppLaunch();
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isFinishing ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.96 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between py-10 px-6 bg-gradient-to-b from-[#58CC02] via-[#46A302] to-[#3B8C01] text-white select-none overflow-hidden touch-none"
      onClick={handleFinish}
    >
      {/* Decorative Floating Clouds in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [-40, 40, -40] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 -left-10 w-44 h-20 bg-white/15 rounded-full blur-[2px]"
        />
        <motion.div
          animate={{ x: [40, -40, 40] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 -right-12 w-56 h-24 bg-white/15 rounded-full blur-[2px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 right-1/4 text-amber-200"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-36 left-1/4 text-amber-200"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
      </div>

      {/* Top Header Logo */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="flex flex-col items-center z-10"
      >
        <div className="flex items-center gap-2.5 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border-2 border-white/30 shadow-lg mb-2">
          <BookOpen className="w-6 h-6 text-duo-yellow" />
          <span className="text-xl sm:text-2xl font-black tracking-wide text-white drop-shadow-md">
            Petualangan Iqro
          </span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-emerald-100 tracking-wider uppercase">
          Belajar Mengaji Ceria untuk Balita
        </p>
      </motion.div>

      {/* Center: Playful Moving Mascot Boni (Walk & Bounce Cycle) */}
      <div className="flex flex-col items-center justify-center my-auto relative z-10">
        <motion.div
          animate={{
            y: [0, -24, 0, -14, 0],
            rotate: [-4, 4, -3, 3, 0],
            scale: [1, 1.06, 0.98, 1.04, 1],
          }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-48 h-48 sm:w-56 sm:h-56 relative filter drop-shadow-2xl"
        >
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="splashRainbow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="25%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="75%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>

            {/* Dynamic Ground Shadow */}
            <motion.ellipse
              cx="60"
              cy="114"
              rx="38"
              ry="7"
              fill="rgba(0,0,0,0.18)"
              animate={{
                scale: [1, 0.75, 1, 0.85, 1],
                opacity: [0.25, 0.1, 0.25, 0.15, 0.25],
              }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Cape (Behind) */}
            {equippedCape === 'cape-hero' && (
              <motion.path
                d="M 36 65 Q 16 108 30 114 Q 60 106 90 114 Q 104 108 84 65 Z"
                fill="#10B981"
                stroke="#047857"
                strokeWidth="2"
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
            {equippedCape === 'cape-rainbow' && (
              <motion.path
                d="M 36 65 Q 16 108 30 114 Q 60 106 90 114 Q 104 108 84 65 Z"
                fill="url(#splashRainbow)"
                stroke="#A855F7"
                strokeWidth="2"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              />
            )}

            {/* Flapping Wings */}
            <motion.ellipse
              cx="22"
              cy="68"
              rx="13"
              ry="21"
              fill="#46A302"
              transform="rotate(-25 22 68)"
              animate={{ rotate: [-20, -55, -20], y: [-2, -10, -2] }}
              transition={{ duration: 0.55, repeat: Infinity }}
            />
            <motion.ellipse
              cx="98"
              cy="68"
              rx="13"
              ry="21"
              fill="#46A302"
              transform="rotate(25 98 68)"
              animate={{ rotate: [20, 55, 20], y: [-2, -10, -2] }}
              transition={{ duration: 0.55, repeat: Infinity }}
            />

            {/* Plump Round Body */}
            <circle cx="60" cy="68" r="42" fill="#58CC02" />

            {/* Cream Belly */}
            <ellipse cx="60" cy="78" rx="28" ry="24" fill="#FFFBEB" />

            {/* Pink Cheeks */}
            <circle cx="36" cy="74" r="6" fill="#FCA5A5" opacity="0.8" />
            <circle cx="84" cy="74" r="6" fill="#FCA5A5" opacity="0.8" />

            {/* Big Expressive Blinking Eyes */}
            <circle cx="44" cy="56" r="10" fill="#FFFFFF" />
            <motion.circle
              cx="44"
              cy="56"
              r="6"
              fill="#1E293B"
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
            <circle cx="42" cy="53" r="2.5" fill="#FFFFFF" />

            <circle cx="76" cy="56" r="10" fill="#FFFFFF" />
            <motion.circle
              cx="76"
              cy="56"
              r="6"
              fill="#1E293B"
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
            <circle cx="74" cy="53" r="2.5" fill="#FFFFFF" />

            {/* Glasses */}
            {equippedGlasses === 'glasses-round' && (
              <g stroke="#1E293B" strokeWidth="3" fill="none">
                <circle cx="44" cy="56" r="12" stroke="#1E293B" fill="rgba(255,255,255,0.2)" />
                <circle cx="76" cy="56" r="12" stroke="#1E293B" fill="rgba(255,255,255,0.2)" />
                <path d="M 56 56 Q 60 52 64 56" />
              </g>
            )}
            {equippedGlasses === 'glasses-star' && (
              <g fill="#F59E0B" stroke="#D97706" strokeWidth="1.5">
                <polygon points="44,45 47,53 55,54 49,60 51,68 44,63 37,68 39,60 33,54 41,53" opacity="0.9" />
                <polygon points="76,45 79,53 87,54 81,60 83,68 76,63 69,68 71,60 65,54 73,53" opacity="0.9" />
                <line x1="55" y1="56" x2="65" y2="56" stroke="#D97706" strokeWidth="3" />
              </g>
            )}

            {/* Cheerful Beak */}
            <polygon points="60,60 52,69 68,69" fill="#FF9600" />
            <polygon points="60,74 54,69 66,69" fill="#E08500" />

            {/* Headwear / Peci */}
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
                <polygon points="38,32 38,16 48,24 60,12 72,24 82,16 82,32" fill="#FFC800" stroke="#D97706" strokeWidth="1.5" />
                <circle cx="60" cy="14" r="2.5" fill="#EF4444" />
                <circle cx="48" cy="23" r="2" fill="#3B82F6" />
                <circle cx="72" cy="23" r="2" fill="#3B82F6" />
                <rect x="37" y="30" width="46" height="4" rx="1.5" fill="#D97706" />
              </g>
            )}
            {equippedHat === 'hat-turban' && (
              <g>
                <ellipse cx="60" cy="28" rx="24" ry="12" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
                <circle cx="60" cy="24" r="9" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                <circle cx="60" cy="26" r="3.5" fill="#10B981" />
              </g>
            )}

            {/* Pacing Feet */}
            <motion.ellipse
              cx="48"
              cy="107"
              rx="6"
              ry="4"
              fill="#FF9600"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.55, repeat: Infinity }}
            />
            <motion.ellipse
              cx="72"
              cy="107"
              rx="6"
              ry="4"
              fill="#FF9600"
              animate={{ y: [-6, 0, -6] }}
              transition={{ duration: 0.55, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Bottom: Chunky Duolingo Progress Bar & Rotating Fun Tips */}
      <div className="w-full max-w-sm flex flex-col items-center z-10 space-y-4">
        {/* Rotating Fun Tips Box */}
        <div className="h-10 flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xs sm:text-sm font-extrabold text-white/95 px-4 drop-shadow"
            >
              {FUN_TIPS[currentTipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Chunky Duolingo Progress Bar */}
        <div className="w-full h-6 bg-black/25 rounded-full p-1 border-2 border-white/40 shadow-inner relative overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-duo-yellow to-amber-400 rounded-full relative transition-all duration-200"
            style={{ width: `${progress}%` }}
          >
            {/* Top Gloss Highlight */}
            <div className="absolute top-0.5 left-2 right-2 h-1.5 bg-white/50 rounded-full" />
          </motion.div>
        </div>

        {/* Percentage or Skip Prompt */}
        <div className="flex items-center justify-between w-full px-2 text-xs font-black text-emerald-100">
          <span>Memuat Petualangan...</span>
          <span className="text-duo-yellow font-black text-sm">{progress}%</span>
        </div>

        {/* Subtle tap to skip prompt */}
        <span className="text-[11px] font-bold text-white/60 hover:text-white transition cursor-pointer">
          (Ketuk di mana saja untuk mulai)
        </span>
      </div>
    </motion.div>
  );
};
