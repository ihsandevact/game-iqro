import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles } from 'lucide-react';
import { Question } from '../../../../core/types/gameTypes';
import { soundManager } from '../../../../core/audio/soundManager';
import { ttsNarrator } from '../../../../core/audio/ttsNarrator';

interface BubblePopGameProps {
  question: Question;
  onCorrect: () => void;
}

const BUBBLE_COLORS = [
  'from-pink-400 to-rose-500 border-pink-300 shadow-pink-200',
  'from-sky-400 to-blue-500 border-sky-300 shadow-sky-200',
  'from-emerald-400 to-green-500 border-emerald-300 shadow-emerald-200',
  'from-amber-400 to-yellow-500 border-amber-300 shadow-amber-200',
  'from-purple-400 to-indigo-500 border-purple-300 shadow-purple-200',
];

export const BubblePopGame: React.FC<BubblePopGameProps> = ({ question, onCorrect }) => {
  const [poppedLetters, setPoppedLetters] = useState<Record<string, boolean>>({});
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setPoppedLetters({});
    setIsDone(false);

    const timer = setTimeout(() => {
      soundManager.playPop();
      ttsNarrator.speak(question.promptText);
    }, 300);

    return () => clearTimeout(timer);
  }, [question.id]);

  const handlePop = (letter: string, isCorrect: boolean) => {
    if (poppedLetters[letter] || isDone) return;

    soundManager.playBubblePop();
    setPoppedLetters((prev) => ({ ...prev, [letter]: true }));

    if (isCorrect) {
      setIsDone(true);
      soundManager.playCorrect();
      ttsNarrator.speakPraise(() => {
        onCorrect();
      });
    } else {
      soundManager.playGentleWrong();
      ttsNarrator.speakEncourage();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-2">
      {/* Speaker Prompt */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          soundManager.playPop();
          ttsNarrator.speak(question.promptText);
        }}
        className="flex items-center gap-3 bg-duo-purple hover:bg-duo-purpleDark text-white px-5 py-3 rounded-2xl shadow-duo-purple active:translate-y-1 mb-4 transition"
      >
        <Volume2 className="w-7 h-7 animate-pulse" />
        <span className="font-extrabold text-base sm:text-lg">
          Dengarkan Suara
        </span>
      </motion.button>

      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-6">
        {question.promptText}
      </h2>

      {/* Floating Bubbles Arena */}
      <div className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-sky-50 to-indigo-50/40 rounded-3xl border-2 border-sky-100 p-4 flex items-center justify-center overflow-hidden">
        {/* Soft floating clouds in background */}
        <div className="absolute top-3 left-4 w-16 h-8 bg-white/70 rounded-full blur-[1px]" />
        <div className="absolute top-10 right-6 w-20 h-10 bg-white/70 rounded-full blur-[1px]" />

        <div className="grid grid-cols-2 gap-6 w-full max-w-xs relative z-10">
          {question.options.map((opt, idx) => {
            const isPopped = poppedLetters[opt.letter];
            const colorClass = BUBBLE_COLORS[idx % BUBBLE_COLORS.length];

            return (
              <div key={opt.letter} className="flex justify-center items-center">
                <AnimatePresence>
                  {!isPopped ? (
                    <motion.button
                      initial={{ scale: 0, y: 30 }}
                      animate={{
                        scale: 1,
                        y: [0, -12, 0],
                        rotate: [-3, 3, -3],
                      }}
                      exit={{
                        scale: [1, 1.4, 0],
                        opacity: [1, 0.8, 0],
                      }}
                      transition={{
                        y: { duration: 2.2 + idx * 0.3, repeat: Infinity, ease: 'easeInOut' },
                        rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                        scale: { duration: 0.25 },
                        opacity: { duration: 0.25 },
                      }}
                      onClick={() => handlePop(opt.letter, opt.isCorrect)}
                      className={`
                        w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${colorClass}
                        border-4 shadow-lg text-white flex flex-col items-center justify-center relative
                        active:scale-95 transition-transform cursor-pointer select-none
                      `}
                    >
                      {/* Bubble Gloss Highlight */}
                      <div className="absolute top-2 left-3 w-5 h-2.5 bg-white/60 rounded-full rotate-[-30deg]" />

                      {/* Arabic Letter */}
                      <span className="font-arabic text-4xl sm:text-5xl font-bold leading-none drop-shadow-md">
                        {opt.letter}
                      </span>
                      <span className="text-xs font-black tracking-wider uppercase opacity-95">
                        {opt.name}
                      </span>
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 0] }}
                      transition={{ duration: 0.4 }}
                      className="w-24 h-24 flex items-center justify-center text-amber-400"
                    >
                      <Sparkles className="w-12 h-12" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
