import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Volume2, X, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../core/audio/soundManager';
import { ttsNarrator } from '../../core/audio/ttsNarrator';
import { BoniMascot } from '../mascot/BoniMascot';

interface WelcomeModalProps {
  onComplete: (name: string) => void;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedCape?: string;
}

const POPULAR_NAMES = ['Faqih', 'Aisyah', 'Zaid', 'Fatimah', 'Rayyan', 'Hafiz'];

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  onComplete,
  equippedHat = 'hat-default',
  equippedGlasses = 'glasses-none',
  equippedCape = 'cape-none',
}) => {
  const [nameInput, setNameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Play natural authentic greeting audio on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      ttsNarrator.speakIntroduction();
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleReplayGreeting = () => {
    soundManager.playPop();
    ttsNarrator.speakIntroduction();
  };

  const handleSelectPreset = (presetName: string) => {
    soundManager.playPop();
    setNameInput(presetName);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    soundManager.playPop();
    setNameInput('');
    inputRef.current?.focus();
  };

  const cleanName = nameInput.trim();
  const canSubmit = cleanName.length >= 2 && !isSubmitting;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);

    // Trigger joyful confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#58CC02', '#FFC800', '#1CB0F6', '#FF4B4B', '#CE82FF'],
      });
    } catch {
      // Ignore if confetti fails
    }

    soundManager.playCorrect();
    ttsNarrator.speakIntroductionSuccess();

    // Give a brief moment for celebration animation before proceeding
    setTimeout(() => {
      onComplete(cleanName);
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-3xl sm:rounded-4xl border-3 border-emerald-400 p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center my-auto overflow-hidden"
        >
          {/* Decorative Sparkles & Header Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-duo-green fill-duo-green" />
            <span>✨ Assalamu'alaikum! ✨</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mb-1">
            Kenalan dengan Iqro, yuk!
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-xs leading-relaxed mb-4">
            Iqro siap jadi sahabat setia menemani langkahmu belajar membaca Al-Qur'an.
          </p>

          {/* Interactive Mascot Presentation */}
          <div className="relative mb-3 flex flex-col items-center">
            <BoniMascot
              mood="cheering"
              size="md"
              characterName="Sahabat"
              equippedHat={equippedHat}
              equippedGlasses={equippedGlasses}
              equippedCape={equippedCape}
              showSpeechBubble={true}
              speechText="Namaku Iqro! Siapa namamu?"
              onClick={handleReplayGreeting}
            />

            {/* Replay voice audio pill */}
            <button
              type="button"
              onClick={handleReplayGreeting}
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-duo-green bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 transition active:scale-95 shadow-xs"
              title="Dengarkan suara Iqro"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Dengar Sapaan Iqro</span>
            </button>
          </div>

          {/* Form Input Name */}
          <form onSubmit={handleSubmit} className="w-full mt-2 flex flex-col gap-3.5">
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Ketik namamu di sini..."
                maxLength={20}
                className="w-full py-3.5 px-4 pr-10 bg-slate-50 border-2 border-slate-200 focus:border-duo-green focus:bg-white focus:ring-4 focus:ring-emerald-100/70 rounded-2xl text-center text-lg sm:text-xl font-black text-slate-800 placeholder:text-slate-400 placeholder:font-bold outline-none transition shadow-inner"
              />
              {nameInput.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition"
                  title="Hapus"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Name Suggestions Chips */}
            <div className="w-full">
              <div className="text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider text-center">
                Atau pilih nama cepat:
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {POPULAR_NAMES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSelectPreset(name)}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition active:scale-95 ${
                      cleanName.toLowerCase() === name.toLowerCase()
                        ? 'bg-duo-green text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Submit Button: Chunky 3D Duolingo Style */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`
                w-full mt-2 py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider transition active:translate-y-1 flex items-center justify-center gap-2
                ${
                  canSubmit
                    ? 'bg-duo-green hover:bg-duo-greenDark text-white shadow-duo-green cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }
              `}
            >
              <Heart className="w-4 h-4 fill-white shrink-0" />
              <span>Ayo Mulai Petualangan! 🚀</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
