import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Sparkles } from 'lucide-react';
import { Question } from '../../../../core/types/gameTypes';
import { soundManager } from '../../../../core/audio/soundManager';
import { ttsNarrator } from '../../../../core/audio/ttsNarrator';

interface ListenTapGameProps {
  question: Question;
  onCorrect: () => void;
}

export const ListenTapGame: React.FC<ListenTapGameProps> = ({ question, onCorrect }) => {
  const [disabledOptions, setDisabledOptions] = useState<Record<string, boolean>>({});
  const [wigglingOption, setWigglingOption] = useState<string | null>(null);
  const [selectedCorrect, setSelectedCorrect] = useState<string | null>(null);

  // Play audio prompt automatically when question loads
  useEffect(() => {
    setDisabledOptions({});
    setWigglingOption(null);
    setSelectedCorrect(null);

    // Give a brief delay for dialog transition
    const timer = setTimeout(() => {
      playPromptAudio();
    }, 300);

    return () => clearTimeout(timer);
  }, [question.id]);

  const playPromptAudio = () => {
    soundManager.playPop();
    ttsNarrator.speak(question.promptText);
  };

  const handleSelect = (letter: string, isCorrect: boolean) => {
    if (disabledOptions[letter] || selectedCorrect) return;

    if (isCorrect) {
      setSelectedCorrect(letter);
      soundManager.playCorrect();
      ttsNarrator.speakPraise(() => {
        onCorrect();
      });
    } else {
      // Frustration-free error handling: gentle wobble, soften card, supportive audio
      soundManager.playGentleWrong();
      setWigglingOption(letter);
      setTimeout(() => {
        setDisabledOptions((prev) => ({ ...prev, [letter]: true }));
        setWigglingOption(null);
      }, 500);
      ttsNarrator.speakEncourage();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-2">
      {/* Big Replay Speaker Button for Voice-First Toddlers */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={playPromptAudio}
        className="flex items-center gap-3 bg-duo-blue hover:bg-duo-blueDark text-white px-5 py-3 rounded-2xl shadow-duo-blue active:translate-y-1 mb-6 transition"
      >
        <Volume2 className="w-7 h-7 animate-pulse" />
        <span className="font-extrabold text-base sm:text-lg tracking-wide">
          Dengarkan Suara
        </span>
      </motion.button>

      {/* Spoken Prompt Subtitle */}
      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-6 px-4">
        {question.promptText}
      </h2>

      {/* Big Chunky 3D Hijaiyah Letter Cards */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full px-2">
        {question.options.map((opt) => {
          const isDisabled = disabledOptions[opt.letter];
          const isSelected = selectedCorrect === opt.letter;
          const isWiggling = wigglingOption === opt.letter;

          return (
            <motion.button
              key={opt.letter}
              onClick={() => handleSelect(opt.letter, opt.isCorrect)}
              disabled={isDisabled || !!selectedCorrect}
              animate={
                isWiggling
                  ? { x: [-10, 10, -8, 8, 0] }
                  : isSelected
                  ? { scale: [1, 1.08, 1.04] }
                  : {}
              }
              transition={{ duration: 0.4 }}
              className={`
                h-36 sm:h-44 rounded-3xl flex flex-col items-center justify-center p-4 relative select-none
                border-4 transition-all duration-150 outline-none
                ${
                  isSelected
                    ? 'bg-duo-green border-emerald-400 text-white shadow-[0_8px_0_#46A302]'
                    : isDisabled
                    ? 'bg-slate-100 border-slate-200 text-slate-300 opacity-40 cursor-not-allowed shadow-[0_3px_0_#E2E8F0]'
                    : 'bg-white hover:bg-emerald-50/50 active:translate-y-1.5 border-slate-200 hover:border-duo-green text-slate-800 shadow-[0_8px_0_#E2E8F0] active:shadow-[0_2px_0_#E2E8F0]'
                }
              `}
            >
              {/* Star sparkles badge on correct */}
              {isSelected && (
                <div className="absolute top-3 right-3 text-amber-300">
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
              )}

              {/* Big Arabic Letter */}
              <span className="font-arabic text-6xl sm:text-7xl font-bold leading-none mb-1">
                {opt.letter}
              </span>

              {/* Latin Transliteration for Parents */}
              <span className={`text-sm sm:text-base font-extrabold tracking-wider ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                {opt.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Helpful Hint */}
      {question.hint && (
        <p className="mt-6 text-xs sm:text-sm font-semibold text-slate-400 text-center px-4 bg-slate-50 py-2 rounded-xl border border-slate-200">
          💡 {question.hint}
        </p>
      )}
    </div>
  );
};
