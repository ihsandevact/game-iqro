import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Star, Gem, ArrowRight } from 'lucide-react';
import { soundManager } from '../../../core/audio/soundManager';
import { ttsNarrator } from '../../../core/audio/ttsNarrator';
import { BoniMascot } from '../../../components/mascot/BoniMascot';

interface CelebrationModalProps {
  starsEarned: number;
  gemsEarned: number;
  stageTitle: string;
  onContinue: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  starsEarned,
  gemsEarned,
  stageTitle,
  onContinue,
}) => {
  useEffect(() => {
    // Play celebratory fanfare
    soundManager.playFanfare();
    ttsNarrator.speak('Luar biasa! Pelajaran selesai, kamu hebat sekali!');

    // Trigger colorful confetti explosion
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#58CC02', '#FFC800', '#1CB0F6', '#FF9600', '#CE82FF'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center p-4 max-w-sm mx-auto"
    >
      {/* Animated Boni celebrating */}
      <div className="mb-2">
        <BoniMascot mood="cheering" size="lg" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">
        Pelajaran Selesai!
      </h2>
      <p className="text-xs sm:text-sm font-bold text-slate-400 mb-6">
        {stageTitle}
      </p>

      {/* Glowing Gold Stars Card */}
      <div className="flex items-center justify-center gap-2 mb-6 bg-amber-50 border-2 border-amber-200 px-6 py-3 rounded-2xl shadow-sm">
        {[1, 2, 3].map((starIdx) => (
          <motion.div
            key={starIdx}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2 + starIdx * 0.15, type: 'spring' }}
          >
            <Star
              className={`w-10 h-10 ${
                starIdx <= starsEarned
                  ? 'fill-duo-yellow text-amber-500 drop-shadow-md'
                  : 'fill-slate-200 text-slate-300'
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Rewards Row */}
      <div className="grid grid-cols-2 gap-3 w-full mb-8">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 flex items-center justify-center gap-2">
          <Gem className="w-6 h-6 fill-duo-blue text-duo-blue" />
          <div className="text-left">
            <div className="text-xs font-bold text-slate-400 uppercase">Permata</div>
            <div className="text-lg font-black text-duo-blue">+{gemsEarned}</div>
          </div>
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 flex items-center justify-center gap-2">
          <Star className="w-6 h-6 fill-duo-green text-duo-green" />
          <div className="text-left">
            <div className="text-xs font-bold text-slate-400 uppercase">Bintang</div>
            <div className="text-lg font-black text-emerald-600">+{starsEarned}</div>
          </div>
        </div>
      </div>

      {/* Big Chunky Next Adventure Button */}
      <button
        onClick={() => {
          soundManager.playPop();
          onContinue();
        }}
        className="w-full py-4 rounded-2xl bg-duo-green hover:bg-duo-greenDark active:translate-y-1 text-white font-black text-lg tracking-wide shadow-duo-green transition flex items-center justify-center gap-2"
      >
        <span>Lanjut Petualangan!</span>
        <ArrowRight className="w-6 h-6" />
      </button>
    </motion.div>
  );
};
