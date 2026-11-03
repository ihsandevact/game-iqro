import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2, Sparkles, Check, RotateCcw, AlertCircle, ArrowRight } from 'lucide-react';
import { Question } from '../../../../core/types/gameTypes';
import { soundManager } from '../../../../core/audio/soundManager';
import { ttsNarrator } from '../../../../core/audio/ttsNarrator';
import { speechRecognitionService } from '../../../../core/speech/speechRecognitionService';
import { evaluatePronunciation } from '../../../../core/speech/hijaiyahPhonetics';

interface PronounceLetterGameProps {
  question: Question;
  onCorrect: () => void;
  childName?: string;
}

export const PronounceLetterGame: React.FC<PronounceLetterGameProps> = ({
  question,
  onCorrect,
  childName = 'Faqih',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastHeard, setLastHeard] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isMicSupported, setIsMicSupported] = useState(true);
  const [micErrorMsg, setMicErrorMsg] = useState<string | null>(null);

  const isAdvancingRef = useRef(false);

  // Inisialisasi & reset setiap soal berganti
  useEffect(() => {
    setIsListening(false);
    setIsSuccess(false);
    setLastHeard('');
    setFeedbackMsg('');
    setFailedAttempts(0);
    setMicErrorMsg(null);
    isAdvancingRef.current = false;

    const supported = speechRecognitionService.isSupported();
    setIsMicSupported(supported);

    // Mainkan prompt suara instruksi secara otomatis
    const timer = setTimeout(() => {
      playPromptAudio();
    }, 350);

    return () => {
      clearTimeout(timer);
      speechRecognitionService.stopListening();
    };
  }, [question.id]);

  const playPromptAudio = () => {
    soundManager.playPop();
    const letter = question.targetName || question.targetLetter;
    ttsNarrator.speak(`Ayo ucapkan huruf: ${letter}!`);
  };

  const playExampleAudio = () => {
    soundManager.playPop();
    const letter = question.targetName || question.targetLetter;
    ttsNarrator.speakLetter(letter);
  };

  const handleStartListening = () => {
    if (isSuccess || isAdvancingRef.current) return;

    soundManager.playPop();
    setMicErrorMsg(null);
    setFeedbackMsg('Mendengarkan suaramu...');
    setIsListening(true);

    const started = speechRecognitionService.startListening({
      lang: 'id-ID',
      timeoutMs: 8000,
      onResult: (transcripts, isFinal) => {
        if (transcripts.length === 0) return;
        const latestSample = transcripts[0];
        setLastHeard(latestSample);

        // Evaluasi pelafalan dengan kamus fonetik
        const evaluation = evaluatePronunciation(
          transcripts,
          question.targetName,
          question.targetLetter,
          question.expectedPronunciations
        );

        if (evaluation.isMatch) {
          handleSuccess(evaluation.matchedWord || latestSample);
        } else if (isFinal) {
          handleFailure(latestSample);
        }
      },
      onError: (errMessage, errCode) => {
        setIsListening(false);
        if (errCode === 'not-allowed' || errCode === 'permission-denied') {
          setMicErrorMsg('Izin mikrofon belum aktif di browser.');
        } else if (errCode === 'no-speech') {
          setFeedbackMsg('Belum terdengar suara. Ayo coba dekatkan ke mikrofon ya!');
        } else {
          setFeedbackMsg(errMessage);
        }
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (!started) {
      setIsListening(false);
      setMicErrorMsg('Mikrofon tidak dapat diakses pada browser ini.');
    }
  };

  const handleStopListening = () => {
    speechRecognitionService.stopListening();
    setIsListening(false);
  };

  const handleSuccess = (matchedWord: string) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    speechRecognitionService.stopListening();
    setIsListening(false);
    setIsSuccess(true);
    setFeedbackMsg(`Masya Allah! Pengucapan "${matchedWord}" sangat tepat! ⭐`);
    soundManager.playCorrect();

    let advanced = false;
    const advance = () => {
      if (!advanced) {
        advanced = true;
        onCorrect();
      }
    };

    // Fallback otomatis jika TTS pujian tertunda
    const fallbackTimer = setTimeout(advance, 2400);

    ttsNarrator.speakPraise(childName, () => {
      clearTimeout(fallbackTimer);
      advance();
    });
  };

  const handleFailure = (heard: string) => {
    setIsListening(false);
    setFailedAttempts((prev) => prev + 1);
    soundManager.playGentleWrong();
    setFeedbackMsg(`Terdengar: "${heard}". Ayo coba lafalkan "${question.targetName}" lagi ya!`);
    ttsNarrator.speakEncourage(childName);
  };

  // Fallback: tombol "Saya Sudah Ucapkan" untuk kenyamanan anak tanpa frustrasi
  const handleBypass = () => {
    if (isAdvancingRef.current) return;
    soundManager.playPop();
    handleSuccess(question.targetName);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-1">
      {/* Tombol Header: Dengarkan Contoh Suara Resmi */}
      <div className="flex items-center gap-2 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={playExampleAudio}
          className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-300 px-4 py-2 rounded-2xl shadow-xs font-black text-xs sm:text-sm transition"
        >
          <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Dengarkan Contoh Lafal</span>
        </motion.button>
      </div>

      {/* Spoken Prompt Title */}
      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-4 px-2">
        {question.promptText || `Ayo ucapkan huruf: ${question.targetName}!`}
      </h2>

      {/* Kartu Huruf Hijaiyah Besar 3D */}
      <motion.div
        animate={isSuccess ? { scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] } : {}}
        className={`w-48 h-48 sm:w-56 sm:h-56 rounded-3xl flex flex-col items-center justify-center p-4 border-4 transition-all duration-300 shadow-xl relative overflow-hidden mb-6 ${
          isSuccess
            ? 'bg-gradient-to-b from-emerald-50 to-teal-50 border-emerald-500 shadow-emerald-200'
            : isListening
            ? 'bg-gradient-to-b from-blue-50 to-indigo-50 border-blue-400 shadow-blue-200'
            : 'bg-white border-slate-200 shadow-slate-100'
        }`}
      >
        {/* Efek Bintang Latar saat Benar */}
        {isSuccess && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Sparkles className="w-36 h-36 text-amber-400/30 animate-spin" />
          </div>
        )}

        {/* Karakter Huruf Arab */}
        <span
          className="text-7xl sm:text-8xl font-black mb-1 select-none leading-none drop-shadow-sm transition-transform"
          style={{
            fontFamily: 'Amiri, "Traditional Arabic", serif',
            color: isSuccess ? '#059669' : '#1e293b',
          }}
        >
          {question.targetLetter}
        </span>

        {/* Badge Nama Latin */}
        <div className="mt-2 bg-slate-100/90 border border-slate-200 px-3.5 py-1 rounded-full font-black text-xs sm:text-sm text-slate-700 shadow-2xs">
          "{question.targetName}"
        </div>
      </motion.div>

      {/* Feedback Status / Live Transcription */}
      <div className="min-h-[48px] flex flex-col items-center justify-center text-center px-4 mb-4">
        {isSuccess ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-2xl shadow-xs"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{feedbackMsg}</span>
          </motion.div>
        ) : feedbackMsg ? (
          <p className="text-xs sm:text-sm font-bold text-slate-600 animate-fade-in">
            {feedbackMsg}
          </p>
        ) : lastHeard ? (
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            Terdengar: <span className="text-slate-800 font-black">"{lastHeard}"</span>
          </p>
        ) : (
          <p className="text-xs sm:text-sm font-semibold text-slate-400">
            Tekan mikrofon di bawah lalu ucapkan dengan lantang!
          </p>
        )}
      </div>

      {/* Tombol Utama Mikrofon Bergelombang */}
      <div className="relative flex items-center justify-center mb-4">
        {/* Animasi Gelombang Suara Berdenyut saat Listening */}
        {isListening && (
          <>
            <motion.div
              animate={{ scale: [1, 1.5, 1.8], opacity: [0.6, 0.3, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeOut' }}
              className="absolute w-20 h-20 rounded-full bg-blue-400 pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1.5], opacity: [0.7, 0.4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, delay: 0.4, ease: 'easeOut' }}
              className="absolute w-20 h-20 rounded-full bg-indigo-300 pointer-events-none"
            />
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={isSuccess}
          className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-xl active:translate-y-1 ${
            isSuccess
              ? 'bg-duo-green text-white shadow-duo-green cursor-default'
              : isListening
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-300 ring-4 ring-rose-200 animate-pulse'
              : 'bg-duo-blue hover:bg-duo-blueDark text-white shadow-duo-blue'
          }`}
        >
          {isSuccess ? (
            <Check className="w-10 h-10 stroke-[3]" />
          ) : isListening ? (
            <Mic className="w-9 h-9 animate-bounce" />
          ) : (
            <Mic className="w-9 h-9" />
          )}
        </motion.button>
      </div>

      <span className="text-xs font-black text-slate-500 uppercase tracking-wider mb-6">
        {isSuccess ? 'Lafal Benar!' : isListening ? 'Sedang Mendengarkan...' : 'Ketuk untuk Bicara'}
      </span>

      {/* Fallback & Bantuan (Mencegah Anak Macet / Masalah Mikrofon) */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2.5 px-4">
        {/* Tombol Ulangi Contoh */}
        <button
          onClick={playPromptAudio}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ulangi Instruksi</span>
        </button>

        {/* Tombol Toleransi: Lewati / Saya Sudah Ucapkan */}
        {(failedAttempts >= 2 || !isMicSupported || micErrorMsg) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleBypass}
            className="flex items-center gap-1.5 text-xs font-black text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-4 py-2 rounded-xl shadow-xs transition"
          >
            <span>⭐ Saya Sudah Ucapkan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>

      {/* Notifikasi Kendala Mikrofon Browser */}
      {micErrorMsg && (
        <div className="mt-3 mx-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-[11px] font-semibold text-amber-700 text-left">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{micErrorMsg} Anda tetap bisa menekan tombol <b>"Saya Sudah Ucapkan"</b> di atas untuk melanjutkan.</span>
        </div>
      )}
    </div>
  );
};
