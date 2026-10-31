import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, RotateCcw, Sparkles } from 'lucide-react';
import { Question } from '../../../../core/types/gameTypes';
import { soundManager } from '../../../../core/audio/soundManager';
import { ttsNarrator } from '../../../../core/audio/ttsNarrator';

interface LetterTracingGameProps {
  question: Question;
  onCorrect: () => void;
  childName?: string;
}

interface Particle {
  x: number;
  y: number;
  color: string;
  size: number;
  alpha: number;
}

export const LetterTracingGame: React.FC<LetterTracingGameProps> = ({ question, onCorrect, childName = 'Faqih' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tracedPointsCount, setTracedPointsCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const particlesRef = useRef<Particle[]>([]);

  const SPARKLE_COLORS = ['#FFC800', '#58CC02', '#1CB0F6', '#FF9600', '#CE82FF', '#FFFFFF'];

  useEffect(() => {
    setIsCompleted(false);
    setTracedPointsCount(0);
    clearCanvas();

    const timer = setTimeout(() => {
      soundManager.playPop();
      ttsNarrator.speak(`Ayo tulis huruf ${question.targetName}! Telusuri garisnya dengan jarimu ${childName}!`);
    }, 300);

    return () => clearTimeout(timer);
  }, [question.id, childName]);

  // Canvas drawing loop for magical sparkling particles
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Fade particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.alpha -= 0.03;
        p.y -= 0.5; // float up slightly
        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const addSparkle = (x: number, y: number) => {
    const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
    particlesRef.current.push({
      x: x + (Math.random() - 0.5) * 16,
      y: y + (Math.random() - 0.5) * 16,
      color,
      size: 4 + Math.random() * 5,
      alpha: 1,
    });
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isCompleted) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    addSparkle(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isCompleted) return;
    const { x, y } = getCoordinates(e);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Golden sparkling brush
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#58CC02';
    ctx.lineTo(x, y);
    ctx.stroke();

    addSparkle(x, y);

    setTracedPointsCount((prev) => {
      const next = prev + 1;
      // When child traces enough points (~30 points)
      if (next >= 35 && !isCompleted) {
        handleSuccess();
      }
      return next;
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSuccess = () => {
    setIsCompleted(true);
    setIsDrawing(false);
    soundManager.playCorrect();

    ttsNarrator.speakPraise(childName, () => {
      onCorrect();
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = [];
    setTracedPointsCount(0);
    setIsCompleted(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-2">
      {/* Audio Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          soundManager.playPop();
          ttsNarrator.speak(`Ayo tulis huruf ${question.targetName}! Telusuri garisnya!`);
        }}
        className="flex items-center gap-3 bg-duo-green hover:bg-duo-greenDark text-white px-5 py-3 rounded-2xl shadow-duo-green active:translate-y-1 mb-4 transition"
      >
        <Volume2 className="w-7 h-7 animate-pulse" />
        <span className="font-extrabold text-base sm:text-lg">
          Dengarkan Suara
        </span>
      </motion.button>

      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-4">
        {question.promptText}
      </h2>

      {/* Tracing Canvas Area */}
      <div className="relative w-full aspect-square max-w-[320px] bg-white rounded-3xl border-4 border-emerald-200 shadow-xl overflow-hidden flex items-center justify-center select-none touch-none">
        {/* Ghost Arabic Letter (Guide outline behind canvas) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-arabic text-[180px] font-bold text-slate-200/90 leading-none select-none">
            {question.targetLetter}
          </span>
        </div>

        {/* Start Point Guide Hint */}
        {!isCompleted && tracedPointsCount === 0 && (
          <div className="absolute top-3 text-center pointer-events-none animate-bounce z-10 bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-black px-3 py-1 rounded-full shadow-sm">
            👇 Usap jarimu di kanvas ini!
          </div>
        )}

        {/* Interactive Tracing Canvas */}
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="relative z-10 w-full h-full cursor-crosshair"
        />

        {/* Completed Glowing Stars Overlay */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 pointer-events-none"
          >
            <Sparkles className="w-20 h-20 text-duo-yellow animate-spin" />
            <span className="text-xl font-black text-emerald-800 bg-white/90 px-4 py-1.5 rounded-full shadow-md mt-2">
              Bagus Sekali!
            </span>
          </motion.div>
        )}
      </div>

      {/* Action Bar (Hapus & Ulangi) */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => {
            soundManager.playPop();
            clearCanvas();
          }}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs active:scale-95 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Hapus & Ulangi</span>
        </button>
      </div>
    </div>
  );
};
