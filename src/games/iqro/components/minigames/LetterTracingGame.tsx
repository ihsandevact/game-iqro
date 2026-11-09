import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, RotateCcw, Sparkles, Check } from 'lucide-react';
import { Question } from '../../../../core/types/gameTypes';
import { soundManager } from '../../../../core/audio/soundManager';
import { ttsNarrator } from '../../../../core/audio/ttsNarrator';

interface LetterTracingGameProps {
  question: Question;
  onCorrect: () => void;
  childName?: string;
}

interface TargetZone {
  x: number;
  y: number;
  covered: boolean;
}

const PASSING_TRACE_RATIO = 0.90;
const PASSING_TRACE_PERCENT = 90;
const STROKE_COLOR = '#10B981';

export const LetterTracingGame: React.FC<LetterTracingGameProps> = ({ question, onCorrect, childName = 'Faqih' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [traceProgress, setTraceProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const targetZonesRef = useRef<TargetZone[]>([]);
  const fallbackPointsRef = useRef(0);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Extract letter silhouette target zones whenever targetLetter changes
  useEffect(() => {
    setIsCompleted(false);
    setTraceProgress(0);
    fallbackPointsRef.current = 0;
    lastPosRef.current = null;
    clearCanvas();

    // Generate accurate target points from the actual Arabic letter glyph
    try {
      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = 320;
      sampleCanvas.height = 320;
      const sCtx = sampleCanvas.getContext('2d');
      if (sCtx) {
        sCtx.fillStyle = '#000000';
        const rawLength = (question.targetLetter || '').replace(/[\u064B-\u065F]/g, '').length;
        const fontSize = rawLength > 2 ? 95 : rawLength > 1 ? 125 : 155;
        sCtx.font = `bold ${fontSize}px Amiri, "Traditional Arabic", serif`;
        sCtx.textAlign = 'center';
        sCtx.textBaseline = 'middle';
        sCtx.fillText(question.targetLetter, 160, 160);

        const imgData = sCtx.getImageData(0, 0, 320, 320).data;
        const zones: TargetZone[] = [];
        const STEP = 12; // Grid sample step

        for (let y = 20; y < 300; y += STEP) {
          for (let x = 20; x < 300; x += STEP) {
            const idx = (y * 320 + x) * 4;
            const alpha = imgData[idx + 3];
            if (alpha > 50) {
              zones.push({ x, y, covered: false });
            }
          }
        }
        targetZonesRef.current = zones;
      }
    } catch {
      targetZonesRef.current = [];
    }

    const timer = setTimeout(() => {
      soundManager.playPop();
      ttsNarrator.askTraceLetter(question.targetName || question.targetLetter, undefined, question.id);
    }, 300);

    return () => clearTimeout(timer);
  }, [question.id, question.targetLetter, childName]);

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

  const checkZoneCoverage = (x: number, y: number, prevPos?: { x: number; y: number } | null) => {
    const zones = targetZonesRef.current;

    // Fallback if zones couldn't be extracted
    if (zones.length === 0) {
      fallbackPointsRef.current += 1;
      const fallbackRatio = Math.min(1, fallbackPointsRef.current / 45);
      setTraceProgress(Math.round(fallbackRatio * 100));
      if (fallbackRatio >= PASSING_TRACE_RATIO && !isCompleted) {
        handleSuccess();
      }
      return;
    }

    let newlyCovered = false;
    const TOLERANCE_RADIUS = 24;
    const radiusSq = TOLERANCE_RADIUS * TOLERANCE_RADIUS;

    // Interpolasi titik sepanjang garis agar goresan cepat tidak melompati zona huruf
    const pointsToCheck: Array<{ x: number; y: number }> = [{ x, y }];
    if (prevPos) {
      const dist = Math.hypot(x - prevPos.x, y - prevPos.y);
      const steps = Math.min(12, Math.floor(dist / 6));
      for (let s = 1; s <= steps; s++) {
        const t = s / (steps + 1);
        pointsToCheck.push({
          x: prevPos.x + (x - prevPos.x) * t,
          y: prevPos.y + (y - prevPos.y) * t,
        });
      }
    }

    for (let i = 0; i < zones.length; i++) {
      if (!zones[i].covered) {
        for (let p = 0; p < pointsToCheck.length; p++) {
          const dx = zones[i].x - pointsToCheck[p].x;
          const dy = zones[i].y - pointsToCheck[p].y;
          if (dx * dx + dy * dy <= radiusSq) {
            zones[i].covered = true;
            newlyCovered = true;
            break;
          }
        }
      }
    }

    if (newlyCovered) {
      const coveredCount = zones.filter((z) => z.covered).length;
      const ratio = coveredCount / zones.length;
      const percent = Math.min(100, Math.round(ratio * 100));
      setTraceProgress(percent);

      // Syarat Lulus Tulis Huruf: >= 90% benar!
      if (ratio >= PASSING_TRACE_RATIO && !isCompleted) {
        handleSuccess();
      }
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isCompleted) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    lastPosRef.current = { x, y };

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = STROKE_COLOR;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    checkZoneCoverage(x, y, null);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isCompleted) return;
    const { x, y } = getCoordinates(e);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Goresan kuas 1 warna bersih (#10B981)
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = STROKE_COLOR;

    const prevPos = lastPosRef.current;
    if (prevPos) {
      ctx.beginPath();
      ctx.moveTo(prevPos.x, prevPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    lastPosRef.current = { x, y };

    checkZoneCoverage(x, y, prevPos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const handleSuccess = () => {
    setIsCompleted(true);
    setIsDrawing(false);
    lastPosRef.current = null;
    soundManager.playCorrect();

    let hasAdvanced = false;
    const advance = () => {
      if (!hasAdvanced) {
        hasAdvanced = true;
        onCorrect();
      }
    };

    // Fallback timer: advances in 2.5s if device sound is muted or TTS stalls
    const fallbackTimer = setTimeout(advance, 2500);

    // Wait until narrator finishes speaking praise fully before advancing
    ttsNarrator.speakPraise(childName, () => {
      clearTimeout(fallbackTimer);
      advance();
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    targetZonesRef.current.forEach((z) => {
      z.covered = false;
    });
    setTraceProgress(0);
    fallbackPointsRef.current = 0;
    lastPosRef.current = null;
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
          ttsNarrator.askTraceLetter(question.targetName || question.targetLetter, undefined, question.id);
        }}
        className="flex items-center gap-3 bg-duo-green hover:bg-duo-greenDark text-white px-5 py-2.5 rounded-2xl shadow-duo-green active:translate-y-1 mb-3 transition"
      >
        <Volume2 className="w-6 h-6 animate-pulse" />
        <span className="font-extrabold text-sm sm:text-base">
          Dengarkan Suara
        </span>
      </motion.button>

      <h2 className="text-lg sm:text-xl font-black text-slate-800 text-center mb-3">
        {question.promptText}
      </h2>

      {/* Tracing Progress Bar */}
      <div className="w-full max-w-[320px] mb-2 flex items-center gap-2 px-1">
        <span className="text-xs font-black text-slate-600 flex items-center gap-1 shrink-0">
          <span>✏️</span>
          <span>{traceProgress}%</span>
        </span>
        <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <motion.div
            className="h-full bg-duo-green rounded-full transition-all duration-150"
            style={{ width: `${traceProgress}%` }}
          />
        </div>
        {traceProgress >= PASSING_TRACE_PERCENT ? (
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-0.5 shrink-0 animate-pulse">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Utuh!</span>
          </span>
        ) : (
          <span className="text-[10px] font-bold text-slate-400 shrink-0">
            Target 90%
          </span>
        )}
      </div>

      {/* Tracing Canvas Area */}
      <div className="relative w-full aspect-square max-w-[320px] bg-white rounded-3xl border-4 border-emerald-200 shadow-xl overflow-hidden flex items-center justify-center select-none touch-none">
        {/* Ghost Arabic Letter (Guide outline behind canvas) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="font-arabic font-bold text-slate-200/90 leading-none select-none"
            style={{
              fontSize:
                (question.targetLetter || '').replace(/[\u064B-\u065F]/g, '').length > 2
                  ? '95px'
                  : (question.targetLetter || '').replace(/[\u064B-\u065F]/g, '').length > 1
                  ? '125px'
                  : '165px',
            }}
          >
            {question.targetLetter}
          </span>
        </div>

        {/* Start Point Guide Hint */}
        {!isCompleted && traceProgress === 0 && (
          <div className="absolute top-3 text-center pointer-events-none animate-bounce z-10 bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-black px-3 py-1 rounded-full shadow-sm">
            👇 Usap jarimu mengikuti bentuk huruf!
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
            <span className="text-xl font-black text-emerald-800 bg-white/95 px-5 py-2 rounded-2xl shadow-lg mt-2 border-2 border-emerald-300">
              Bagus Sekali!
            </span>
          </motion.div>
        )}
      </div>

      {/* Action Bar (Hapus & Ulangi) */}
      <div className="flex items-center gap-3 mt-3">
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
