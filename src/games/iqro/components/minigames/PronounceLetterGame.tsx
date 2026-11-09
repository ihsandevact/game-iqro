import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  Volume2,
  Sparkles,
  Check,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Question } from '../../../../core/types/gameTypes';
import { soundManager } from '../../../../core/audio/soundManager';
import { ttsNarrator } from '../../../../core/audio/ttsNarrator';
import {
  acousticPronunciationEngine,
  AcousticEvaluationResult,
} from '../../../../core/speech/acousticPronunciationEngine';

interface PronounceLetterGameProps {
  question: Question;
  onCorrect: () => void;
  childName?: string;
}

type CaptureStage = 'idle' | 'waiting' | 'capturing' | 'evaluating';

const DEFAULT_BARS = [10, 10, 10, 10, 10, 10, 10, 10, 10];

export const PronounceLetterGame: React.FC<PronounceLetterGameProps> = ({
  question,
  onCorrect,
  childName = 'Faqih',
}) => {
  const [stage, setStage] = useState<CaptureStage>('idle');
  const [isSuccess, setIsSuccess] = useState(false);
  const [spectrumBars, setSpectrumBars] = useState<number[]>(DEFAULT_BARS);
  const [speechProgressMs, setSpeechProgressMs] = useState<number>(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [micErrorMsg, setMicErrorMsg] = useState<string | null>(null);

  const isAdvancingRef = useRef(false);
  const isMountedRef = useRef(true);
  const attemptCountRef = useRef(0);
  const lastVolumeUpdateRef = useRef(0);
  const autoStartTimerRef = useRef<any>(null);
  const retryListenTimerRef = useRef<any>(null);

  const isListening = stage === 'waiting' || stage === 'capturing';

  useEffect(() => {
    isMountedRef.current = true;
    acousticPronunciationEngine.ensureAudioContextUnlocked();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Inisialisasi & reset setiap kali soal berganti
  useEffect(() => {
    stopAllEngines();

    setStage('idle');
    setIsSuccess(false);
    setSpectrumBars(DEFAULT_BARS);
    setSpeechProgressMs(0);
    setLastScore(null);
    setFeedbackMsg('Dengarkan instruksi dulu ya...');
    setFailedAttempts(0);
    setMicErrorMsg(null);
    isAdvancingRef.current = false;
    attemptCountRef.current = 0;

    // Preload profil akustik file MP3 huruf target
    acousticPronunciationEngine.preloadReferenceProfile(
      question.targetName,
      question.targetLetter
    );

    // Mainkan instruksi narator dan tunggu SAMPAI SELESAI + 400ms baru nyalakan mikrofon
    let micStartedForQuestion = false;
    const triggerMicAfterPrompt = () => {
      if (micStartedForQuestion || !isMountedRef.current || isAdvancingRef.current) return;
      micStartedForQuestion = true;
      if (autoStartTimerRef.current) clearTimeout(autoStartTimerRef.current);
      autoStartTimerRef.current = setTimeout(() => {
        if (isMountedRef.current && !isAdvancingRef.current) {
          startAcousticListening();
        }
      }, 400);
    };

    const promptTimer = setTimeout(() => {
      if (!isMountedRef.current || isAdvancingRef.current) return;
      soundManager.playPop();
      ttsNarrator.speak('Ucapkan huruf di bawah ini!', () => {
        triggerMicAfterPrompt();
      });
    }, 250);

    // Fallback jika TTS dimatikan / callback tidak terpanggil dalam 3.5 detik
    const fallbackStartTimer = setTimeout(() => {
      triggerMicAfterPrompt();
    }, 3500);

    return () => {
      clearTimeout(promptTimer);
      clearTimeout(fallbackStartTimer);
      stopAllEngines();
    };
  }, [question.id]);

  const stopAllEngines = () => {
    if (autoStartTimerRef.current) {
      clearTimeout(autoStartTimerRef.current);
      autoStartTimerRef.current = null;
    }
    if (retryListenTimerRef.current) {
      clearTimeout(retryListenTimerRef.current);
      retryListenTimerRef.current = null;
    }
    acousticPronunciationEngine.stopSession();
  };

  const playExampleAudio = () => {
    acousticPronunciationEngine.ensureAudioContextUnlocked();
    stopAllEngines();
    setStage('idle');
    setSpectrumBars(DEFAULT_BARS);

    soundManager.playPop();
    const letter = question.targetName || question.targetLetter;
    ttsNarrator.speakLetter(letter);

    retryListenTimerRef.current = setTimeout(() => {
      if (isMountedRef.current && !isAdvancingRef.current) {
        startAcousticListening();
      }
    }, 1250);
  };

  const getSessionOptions = () => ({
    sensitivity: 'high' as const,
    targetName: question.targetName,
    targetLetter: question.targetLetter,
    attemptNumber: attemptCountRef.current + 1,
    onMicReady: () => {
      if (!isMountedRef.current) return;
      setStage('waiting');
    },
    onVolume: (_vol: number, speaking: boolean, bars: number[]) => {
      if (!isMountedRef.current) return;
      const now = performance.now();
      if (now - lastVolumeUpdateRef.current >= 32 || speaking) {
        lastVolumeUpdateRef.current = now;
        setSpectrumBars(bars);
      }
    },
    onSpeechStart: () => {
      if (!isMountedRef.current) return;
      setStage('capturing');
      setFeedbackMsg(`Mendengarkan "${question.targetName}"... 🟢`);
    },
    onSpeechReset: () => {
      if (!isMountedRef.current) return;
      setStage('waiting');
      setSpectrumBars(DEFAULT_BARS);
      setSpeechProgressMs(0);
      setFeedbackMsg(`Ucapkan "${question.targetName}" dengan jelas!`);
    },
    onSpeechProgress: (durMs: number) => {
      if (!isMountedRef.current) return;
      setSpeechProgressMs(durMs);
    },
    onEvaluation: (result: AcousticEvaluationResult) => {
      if (!isMountedRef.current || isAdvancingRef.current) return;
      setStage('evaluating');
      setSpectrumBars(DEFAULT_BARS);
      setSpeechProgressMs(0);
      setLastScore(result.score);

      if (result.isMatch || result.score >= 70) {
        const successFeedback =
          result.score >= 70 && !result.isMatch
            ? `Masya Allah! Pelafalan "${question.targetName}" tepat! (Skor: ${result.score}%) ⭐`
            : result.feedback;
        handleSuccess(result.score, successFeedback);
      } else {
        attemptCountRef.current += 1;
        setFailedAttempts(attemptCountRef.current);
        setFeedbackMsg(result.feedback);
        setStage('idle');

        // Aktifkan kembali mikrofon otomatis setelah 900ms agar bisa langsung bicara lagi
        retryListenTimerRef.current = setTimeout(() => {
          if (isMountedRef.current && !isAdvancingRef.current) {
            startAcousticListening(true);
          }
        }, 900);
      }
    },
    onError: (errMessage: string) => {
      if (!isMountedRef.current) return;
      setStage('idle');
      setSpectrumBars(DEFAULT_BARS);
      setMicErrorMsg(errMessage);
    },
  });

  const startAcousticListening = async (keepFeedback = false) => {
    if (isSuccess || isAdvancingRef.current) return;

    if (autoStartTimerRef.current) {
      clearTimeout(autoStartTimerRef.current);
      autoStartTimerRef.current = null;
    }
    if (retryListenTimerRef.current) {
      clearTimeout(retryListenTimerRef.current);
      retryListenTimerRef.current = null;
    }

    acousticPronunciationEngine.ensureAudioContextUnlocked();
    ttsNarrator.stop();
    setMicErrorMsg(null);
    if (!keepFeedback) {
      setFeedbackMsg(`Ucapkan "${question.targetName}" dengan jelas!`);
    }
    setStage('waiting');
    setSpectrumBars(DEFAULT_BARS);
    setSpeechProgressMs(0);

    await acousticPronunciationEngine.startSession(getSessionOptions());
  };

  const handleMicButtonClick = () => {
    if (isSuccess || isAdvancingRef.current) return;
    acousticPronunciationEngine.ensureAudioContextUnlocked();
    soundManager.playPop();

    if (stage === 'capturing') {
      acousticPronunciationEngine.triggerManualFinish(getSessionOptions());
      return;
    }

    startAcousticListening(false);
  };

  const handleSuccess = (score: number, customFeedback?: string) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    stopAllEngines();
    setStage('idle');
    setIsSuccess(true);
    setLastScore(score);
    setFeedbackMsg(
      customFeedback ||
        `Masya Allah! Pelafalan "${question.targetName}" sangat tepat! (Skor: ${score}%) ⭐`
    );
    soundManager.playCorrect();

    let advanced = false;
    const advance = () => {
      if (!advanced) {
        advanced = true;
        onCorrect();
      }
    };

    const fallbackTimer = setTimeout(advance, 2400);

    ttsNarrator.speakPraise(childName, () => {
      clearTimeout(fallbackTimer);
      advance();
    });
  };

  const handleBypass = () => {
    if (isAdvancingRef.current) return;
    soundManager.playPop();
    handleSuccess(95, `Masya Allah! Pengucapan "${question.targetName}" hebat! ⭐`);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto py-2 px-3">
      {/* 1. Judul Instruksi */}
      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-4">
        {question.promptText || 'Ucapkan huruf di bawah ini!'}
      </h2>

      {/* 2. Kartu Huruf Hijaiyah 3D + Tombol Speaker Contoh di Sudut Kanan Atas */}
      <motion.div
        animate={
          isSuccess
            ? { scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] }
            : stage === 'capturing'
            ? { scale: [1, 1.03, 1] }
            : {}
        }
        transition={stage === 'capturing' ? { repeat: Infinity, duration: 0.6 } : {}}
        className={`w-48 h-52 sm:w-52 sm:h-56 rounded-3xl flex flex-col items-center justify-between p-4 border-4 transition-all duration-300 shadow-xl relative overflow-hidden mb-4 ${
          isSuccess
            ? 'bg-gradient-to-b from-emerald-50 to-teal-50 border-emerald-500 shadow-emerald-200'
            : stage === 'capturing'
            ? 'bg-gradient-to-b from-emerald-50 to-cyan-50 border-emerald-400 shadow-emerald-200 ring-4 ring-emerald-100'
            : isListening
            ? 'bg-gradient-to-b from-blue-50 to-indigo-50 border-blue-400 shadow-blue-200 ring-4 ring-blue-100'
            : 'bg-white border-slate-200 shadow-slate-100'
        }`}
      >
        {/* Tombol Contoh Lafal Ringkas di Pojok Kanan Atas Kartu */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={playExampleAudio}
          title="Dengarkan Contoh Lafal"
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs transition"
        >
          <Volume2 className="w-4 h-4" />
        </motion.button>

        {isSuccess && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Sparkles className="w-36 h-36 text-amber-400/30 animate-spin" />
          </div>
        )}

        {/* Area Huruf Arab dengan Ruang Aman Vertikal agar Ekor Huruf Tidak Menabrak Teks */}
        <div className="flex-1 w-full flex items-center justify-center pt-2 pb-4 overflow-visible">
          <span
            className="font-arabic text-6xl sm:text-7xl font-bold select-none leading-normal drop-shadow-sm transition-transform -translate-y-1.5"
            style={{
              color: isSuccess ? '#059669' : stage === 'capturing' ? '#047857' : '#1e293b',
            }}
          >
            {question.targetLetter}
          </span>
        </div>

        <div className="mt-auto shrink-0 relative z-10 bg-slate-100/95 border border-slate-200 px-4 py-1 rounded-full font-black text-xs sm:text-sm text-slate-700 shadow-2xs">
          "{question.targetName}"
        </div>
      </motion.div>

      {/* 3. Spektrum Visualizer 9-Bar & 1 Baris Feedback Terpadu */}
      <div className="w-full max-w-[260px] flex flex-col items-center mb-4">
        <div className="flex items-end justify-center gap-1.5 h-8 w-full bg-slate-100/90 border border-slate-200 rounded-xl p-1.5 overflow-hidden relative mb-2">
          {spectrumBars.map((barHeight, idx) => {
            const h = isSuccess ? 88 : isListening ? Math.max(12, Math.min(100, barHeight)) : 12;
            const isHigh = stage === 'capturing' || h >= 28;
            return (
              <div
                key={idx}
                className={`w-3.5 rounded-md transition-all duration-75 ${
                  isSuccess
                    ? 'bg-emerald-500'
                    : isHigh
                    ? 'bg-emerald-500'
                    : h > 16
                    ? 'bg-teal-400'
                    : 'bg-slate-300'
                }`}
                style={{ height: `${h}%` }}
              />
            );
          })}

          {stage === 'capturing' && (
            <div
              className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-75"
              style={{ width: `${Math.min(100, Math.round((speechProgressMs / 750) * 100))}%` }}
            />
          )}
        </div>

        {/* Pesan Status / Skor Terpadu */}
        <div className="min-h-[38px] flex items-center justify-center text-center">
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-2xl"
            >
              <Check className="w-4 h-4 stroke-[3] shrink-0" />
              <span>{feedbackMsg}</span>
            </motion.div>
          ) : (
            <p
              className={`text-xs sm:text-sm font-bold leading-snug ${
                stage === 'capturing'
                  ? 'text-emerald-700 font-black'
                  : failedAttempts > 0
                  ? 'text-amber-700'
                  : 'text-slate-600'
              }`}
            >
              {feedbackMsg || `Ucapkan "${question.targetName}" dengan jelas!`}
              {!isListening && lastScore !== null && !feedbackMsg.includes(`${lastScore}%`)
                ? ` (Skor: ${lastScore}%)`
                : ''}
            </p>
          )}
        </div>
      </div>

      {/* 4. Tombol Utama Mikrofon */}
      <div className="relative flex items-center justify-center mb-3">
        {isListening && (
          <>
            <motion.div
              animate={{ scale: [1, 1.35, 1.6], opacity: [0.55, 0.25, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeOut' }}
              className={`absolute w-20 h-20 rounded-full pointer-events-none ${
                stage === 'capturing' ? 'bg-emerald-400' : 'bg-blue-400'
              }`}
            />
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMicButtonClick}
          disabled={isSuccess}
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl active:translate-y-1 ${
            isSuccess
              ? 'bg-duo-green text-white shadow-duo-green cursor-default'
              : stage === 'capturing'
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-300 ring-4 ring-emerald-200'
              : isListening
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-300 ring-4 ring-rose-200'
              : 'bg-duo-blue hover:bg-duo-blueDark text-white shadow-duo-blue'
          }`}
        >
          {isSuccess ? (
            <Check className="w-10 h-10 stroke-[3]" />
          ) : (
            <Mic className={`w-9 h-9 ${stage === 'capturing' ? 'animate-bounce' : ''}`} />
          )}
        </motion.button>
      </div>

      {/* Tombol Lewati / Saya Sudah Ucapkan yang Rapi */}
      <button
        onClick={handleBypass}
        className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 py-1 px-3 rounded-xl transition"
      >
        <span>Saya Sudah Ucapkan</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Notifikasi Kendala Izin Mikrofon */}
      {micErrorMsg && (
        <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-[11px] font-semibold text-amber-700 text-left">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{micErrorMsg}</span>
        </div>
      )}
    </div>
  );
};
