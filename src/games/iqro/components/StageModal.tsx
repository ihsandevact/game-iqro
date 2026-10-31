import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Stage } from '../../../core/types/gameTypes';
import { soundManager } from '../../../core/audio/soundManager';
import { ListenTapGame } from './minigames/ListenTapGame';
import { BubblePopGame } from './minigames/BubblePopGame';
import { CelebrationModal } from './CelebrationModal';

interface StageModalProps {
  stage: Stage | null;
  onClose: () => void;
  onComplete: (stageId: string, stars: number) => void;
}

export const StageModal: React.FC<StageModalProps> = ({ stage, onClose, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!stage) return null;

  const totalQuestions = stage.questions.length || 1;
  const progressPercent = Math.min(100, Math.round(((currentQuestionIndex) / totalQuestions) * 100));
  const currentQuestion = stage.questions[currentQuestionIndex];

  const handleQuestionCorrect = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      onComplete(stage.id, 3); // 3 stars
    }
  };

  const handleExit = () => {
    soundManager.playPop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-slate-100 flex flex-col overflow-hidden max-h-[92dvh]"
      >
        {/* Stage Header with Duolingo Progress Bar */}
        <div className="p-4 sm:p-5 flex items-center gap-3 border-b-2 border-slate-100">
          <button
            onClick={handleExit}
            className="p-2 rounded-2xl hover:bg-slate-100 active:scale-95 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Duolingo Progress Bar */}
          <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <motion.div
              className="h-full bg-duo-green rounded-full transition-all duration-300 relative"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Highlight bar reflection */}
              <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/40 rounded-full" />
            </motion.div>
          </div>

          <div className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentQuestionIndex + 1}/{totalQuestions}</span>
          </div>
        </div>

        {/* Question Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!isCompleted && currentQuestion ? (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                {currentQuestion.type === 'bubble-pop' ? (
                  <BubblePopGame
                    question={currentQuestion}
                    onCorrect={handleQuestionCorrect}
                  />
                ) : (
                  <ListenTapGame
                    question={currentQuestion}
                    onCorrect={handleQuestionCorrect}
                  />
                )}
              </motion.div>
            ) : isCompleted ? (
              <CelebrationModal
                starsEarned={3}
                gemsEarned={30}
                stageTitle={stage.title}
                onContinue={onClose}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
