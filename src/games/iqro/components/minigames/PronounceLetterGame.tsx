import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Volume2,
  Sparkles,
  Check,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  SlidersHorizontal,
  Radio,
  Zap,
  Play,
} from 'lucide-react';
import { Question } from '../../../../core/types/gameTypes';
import { soundManager } from '../../../../core/audio/soundManager';
import { ttsNarrator } from '../../../../core/audio/ttsNarrator';
import {
  acousticPronunciationEngine,
  MicSensitivityLevel,
  AcousticEvaluationResult,
} from '../../../../core/speech/acousticPronunciationEngine';

interface PronounceLetterGameProps {
  question: Question;
  onCorrect: () => void;
  childName?: string;
}

type CaptureStage = 'idle' | 'waiting' | 'capturing' | 'evaluating';

export const PronounceLetterGame: React.FC<PronounceLetterGameProps> = ({
  question,
  onCorrect,
  childName = 'Faqih',
}) => {
  const [stage, setStage] = useState<CaptureStage>('idle');
  const [isSuccess, setIsSuccess] = useState(false);
  const [liveVolume, setLiveVolume] = useState<number>(0);
  const [speechProgressMs, setSpeechProgressMs] = useState<number>(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [micErrorMsg, setMicErrorMsg] = useState<string | null>(null);

  // Pengaturan Sensitivitas & Perangkat Mikrofon
  const [sensitivity, setSensitivity] = useState<MicSensitivityLevel>('high');
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [activeMicLabel, setActiveMicLabel] = useState<string>('Mikrofon Default');
  const [showDevicePicker, setShowDevicePicker] = useState<boolean>(false);

  const isAdvancingRef = useRef(false);
  const isMountedRef = useRef(true);
  const attemptCountRef = useRef(0);
  const lastVolumeUpdateRef = useRef(0);
  const autoStartTimerRef = useRef<any>(null);
  const retryListenTimerRef = useRef<any>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);

  const isListening = stage === 'waiting' || stage === 'capturing';

  // Muat daftar mikrofon saat komponen aktif
  const refreshDevices = async () => {
    const devices = await acousticPronunciationEngine.getAvailableMicrophones();
    if (isMountedRef.current) {
      setAudioDevices(devices);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    refreshDevices();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Inisialisasi & reset setiap kali soal berganti
  useEffect(() => {
    stopAllEngines();

    setStage('idle');
    setIsSuccess(false);
    setLiveVolume(0);
    setSpeechProgressMs(0);
    setLastScore(null);
    setRecordedAudioUrl(null);
    setIsPlayingRecorded(false);
    setFeedbackMsg('');
    setFailedAttempts(0);
    setMicErrorMsg(null);
    isAdvancingRef.current = false;
    attemptCountRef.current = 0;

    // Preload profil akustik file MP3 huruf target
    acousticPronunciationEngine.preloadReferenceProfile(
      question.targetName,
      question.targetLetter
    );

    // Mainkan instruksi suara narator lalu otomatis aktifkan mikrofon setelah instruksi selesai
    const promptTimer = setTimeout(() => {
      playPromptAudio();
    }, 300);

    autoStartTimerRef.current = setTimeout(() => {
      if (isMountedRef.current && !isAdvancingRef.current) {
        startAcousticListening();
      }
    }, 1850);

    return () => {
      clearTimeout(promptTimer);
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
    if (playbackAudioRef.current) {
      try {
        playbackAudioRef.current.pause();
      } catch {
        // ignore
      }
      playbackAudioRef.current = null;
    }
    acousticPronunciationEngine.stopSession();
  };

  const playPromptAudio = () => {
    soundManager.playPop();
    ttsNarrator.speak('Ucapkan huruf di bawah ini!');
  };

  const playExampleAudio = () => {
    // Jika sedang mendengarkan, hentikan sejenak agar suara speaker tidak masuk ke mic
    const wasListening = isListening;
    if (wasListening) {
      acousticPronunciationEngine.stopSession();
      setStage('idle');
    }

    soundManager.playPop();
    const letter = question.targetName || question.targetLetter;
    ttsNarrator.speakLetter(letter);

    if (wasListening) {
      retryListenTimerRef.current = setTimeout(() => {
        if (isMountedRef.current && !isAdvancingRef.current) {
          startAcousticListening();
        }
      }, 1200);
    }
  };

  const playRecordedUserVoice = () => {
    if (!recordedAudioUrl) return;
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
    }
    const audio = new Audio(recordedAudioUrl);
    playbackAudioRef.current = audio;
    setIsPlayingRecorded(true);
    audio.onended = () => setIsPlayingRecorded(false);
    audio.onerror = () => setIsPlayingRecorded(false);
    audio.play().catch(() => setIsPlayingRecorded(false));
  };

  const getSessionOptions = () => ({
    deviceId: selectedDeviceId || undefined,
    sensitivity,
    targetName: question.targetName,
    targetLetter: question.targetLetter,
    attemptNumber: attemptCountRef.current + 1,
    onMicReady: (label: string) => {
      if (!isMountedRef.current) return;
      setActiveMicLabel(label);
      refreshDevices();
    },
    onVolume: (vol: number, speaking: boolean) => {
      if (!isMountedRef.current) return;
      const now = performance.now();
      // Throttle state update ke ~25fps agar UI tetap sangat mulus
      if (now - lastVolumeUpdateRef.current >= 38 || speaking) {
        lastVolumeUpdateRef.current = now;
        setLiveVolume(vol);
      }
    },
    onSpeechStart: () => {
      if (!isMountedRef.current) return;
      setStage('capturing');
      setFeedbackMsg(`Suara terdeteksi! Terus ucapkan "${question.targetName}"... 🟢`);
    },
    onSpeechProgress: (durMs: number) => {
      if (!isMountedRef.current) return;
      setSpeechProgressMs(durMs);
    },
    onEvaluation: (result: AcousticEvaluationResult) => {
      if (!isMountedRef.current || isAdvancingRef.current) return;
      setStage('evaluating');
      setLiveVolume(0);
      setSpeechProgressMs(0);
      setLastScore(result.score);
      if (result.recordedAudioUrl) {
        setRecordedAudioUrl(result.recordedAudioUrl);
      }

      if (result.isMatch) {
        handleSuccess(result.score, result.feedback);
      } else {
        attemptCountRef.current += 1;
        setFailedAttempts(attemptCountRef.current);
        setFeedbackMsg(result.feedback);
        setStage('idle');

        // Aktifkan kembali mikrofon secara otomatis setelah 1.1 detik agar anak bisa langsung coba lagi
        retryListenTimerRef.current = setTimeout(() => {
          if (isMountedRef.current && !isAdvancingRef.current) {
            startAcousticListening(true);
          }
        }, 1100);
      }
    },
    onError: (errMessage: string) => {
      if (!isMountedRef.current) return;
      setStage('idle');
      setLiveVolume(0);
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

    // Hentikan suara narator agar tidak terekam mikrofon
    ttsNarrator.stop();
    setMicErrorMsg(null);
    if (!keepFeedback) {
      setFeedbackMsg(`Silakan ucapkan huruf "${question.targetName}" dengan lantang!`);
    }
    setStage('waiting');
    setLiveVolume(0);
    setSpeechProgressMs(0);

    await acousticPronunciationEngine.startSession(getSessionOptions());
  };

  const handleMicButtonClick = () => {
    if (isSuccess || isAdvancingRef.current) return;
    soundManager.playPop();

    if (stage === 'capturing') {
      // Jika sedang merekam suara dan diklik, langsung evaluasi
      acousticPronunciationEngine.triggerManualFinish(getSessionOptions());
      return;
    }

    if (stage === 'waiting') {
      stopAllEngines();
      setStage('idle');
      setLiveVolume(0);
      setFeedbackMsg('Mikrofon dijeda. Ketuk mikrofon untuk mulai bicara.');
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
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-1">
      {/* Baris Atas: Contoh Lafal, Sensitivitas DSP & Putar Suaramu */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
        {/* Tombol Contoh Suara Qari */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={playExampleAudio}
          className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-300 px-3.5 py-1.5 rounded-2xl shadow-xs font-black text-xs transition"
        >
          <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Dengarkan Contoh Lafal</span>
        </motion.button>

        {/* Tombol Sensitivitas Pre-Amp DSP */}
        <button
          onClick={() => {
            const nextSens: MicSensitivityLevel =
              sensitivity === 'high' ? 'normal' : sensitivity === 'normal' ? 'low' : 'high';
            setSensitivity(nextSens);
            if (isListening) {
              setTimeout(() => startAcousticListening(true), 80);
            }
          }}
          title="Ubah penguatan tangkapan suara mikrofon (DSP Gain)"
          className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1.5 rounded-2xl transition"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>
            Kepekaan:{' '}
            {sensitivity === 'high'
              ? 'Super Peka (+15dB)'
              : sensitivity === 'normal'
              ? 'Normal (+10dB)'
              : 'Rendah'}
          </span>
        </button>

        {/* Tombol Putar Rekaman Suara Anak (Voice Mirror) */}
        {recordedAudioUrl && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={playRecordedUserVoice}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 px-2.5 py-1.5 rounded-2xl transition"
          >
            <Play className={`w-3.5 h-3.5 ${isPlayingRecorded ? 'animate-ping text-indigo-600' : 'text-indigo-500'}`} />
            <span>{isPlayingRecorded ? 'Memutar...' : 'Dengar Suaramu'}</span>
          </motion.button>
        )}
      </div>

      {/* Judul Instruksi */}
      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-3 px-2">
        {question.promptText || 'Ucapkan huruf di bawah ini!'}
      </h2>

      {/* Kartu Huruf Hijaiyah Besar 3D */}
      <motion.div
        animate={
          isSuccess
            ? { scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }
            : stage === 'capturing'
            ? { scale: [1, 1.03, 1] }
            : {}
        }
        transition={stage === 'capturing' ? { repeat: Infinity, duration: 0.6 } : {}}
        className={`w-44 h-44 sm:w-52 sm:h-52 rounded-3xl flex flex-col items-center justify-center p-3 border-4 transition-all duration-300 shadow-xl relative overflow-hidden mb-3 ${
          isSuccess
            ? 'bg-gradient-to-b from-emerald-50 to-teal-50 border-emerald-500 shadow-emerald-200'
            : stage === 'capturing'
            ? 'bg-gradient-to-b from-emerald-50 to-cyan-50 border-emerald-400 shadow-emerald-200 ring-4 ring-emerald-100'
            : isListening
            ? 'bg-gradient-to-b from-blue-50 to-indigo-50 border-blue-400 shadow-blue-200 ring-4 ring-blue-100'
            : 'bg-white border-slate-200 shadow-slate-100'
        }`}
      >
        {isSuccess && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Sparkles className="w-36 h-36 text-amber-400/30 animate-spin" />
          </div>
        )}

        <span
          className="text-7xl sm:text-8xl font-black mb-1 select-none leading-none drop-shadow-sm transition-transform"
          style={{
            fontFamily: 'Amiri, "Traditional Arabic", serif',
            color: isSuccess ? '#059669' : stage === 'capturing' ? '#047857' : '#1e293b',
          }}
        >
          {question.targetLetter}
        </span>

        <div className="mt-1 bg-slate-100/90 border border-slate-200 px-3 py-0.5 rounded-full font-black text-xs sm:text-sm text-slate-700 shadow-2xs">
          "{question.targetName}"
        </div>
      </motion.div>

      {/* Real-Time Acoustic DSP Equalizer & Status Bar */}
      <div className="w-full max-w-[290px] flex flex-col items-center mb-2 px-4">
        <div className="flex items-center justify-between w-full text-[11px] font-black mb-1">
          <span
            className={`flex items-center gap-1.5 transition-colors ${
              stage === 'capturing' || isSuccess
                ? 'text-emerald-600'
                : stage === 'waiting' && liveVolume > 12
                ? 'text-teal-600'
                : stage === 'waiting'
                ? 'text-blue-600'
                : 'text-slate-400'
            }`}
          >
            <Radio
              className={`w-3.5 h-3.5 ${
                stage === 'capturing'
                  ? 'animate-ping text-emerald-500'
                  : isListening
                  ? 'animate-pulse text-blue-500'
                  : 'text-slate-400'
              }`}
            />
            <span>
              {isSuccess
                ? 'Lafal Tepat! ⭐'
                : stage === 'evaluating'
                ? 'Menganalisis Spektrum Suara... 🔍'
                : stage === 'capturing'
                ? 'Suara Masuk! Mendengarkan... 🟢'
                : stage === 'waiting'
                ? 'Mikrofon Aktif — Ucapkan Sekarang! 🎙️'
                : 'Mikrofon Siap'}
            </span>
          </span>
          <span className="text-slate-500 font-mono text-[10px]">
            {isListening ? `${liveVolume}%` : lastScore !== null ? `Skor ${lastScore}%` : ''}
          </span>
        </div>

        {/* 9-Bar Real-time Acoustic Spectrum Visualizer */}
        <div className="flex items-end justify-center gap-1.5 h-8 w-full bg-slate-100/90 border border-slate-200 rounded-xl p-1.5 overflow-hidden relative">
          {[0.55, 0.8, 1.05, 0.75, 1.2, 0.85, 1.1, 0.7, 0.95].map((mult, idx) => {
            const baseHeight = isListening ? Math.max(12, Math.min(100, Math.round(liveVolume * mult))) : 12;
            const isCapturing = stage === 'capturing' || baseHeight >= 30;
            return (
              <div
                key={idx}
                className={`w-3.5 rounded-md transition-all duration-75 ${
                  isSuccess
                    ? 'bg-emerald-500'
                    : isCapturing
                    ? 'bg-emerald-500 shadow-xs'
                    : baseHeight > 16
                    ? 'bg-teal-400'
                    : 'bg-slate-300'
                }`}
                style={{ height: `${isSuccess ? 85 : baseHeight}%` }}
              />
            );
          })}

          {/* Progress Bar Durasi Tangkap Suara */}
          {stage === 'capturing' && (
            <div
              className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-75"
              style={{ width: `${Math.min(100, Math.round((speechProgressMs / 800) * 100))}%` }}
            />
          )}
        </div>
      </div>

      {/* Feedback Status / Skor Kemiripan Akustik */}
      <div className="min-h-[44px] flex flex-col items-center justify-center text-center px-4 mb-2">
        {isSuccess ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-2xl shadow-xs"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{feedbackMsg}</span>
          </motion.div>
        ) : (
          <p
            className={`text-xs sm:text-sm font-bold animate-fade-in ${
               stage === 'capturing'
                ? 'text-emerald-700 font-black'
                : failedAttempts > 0
                ? 'text-amber-700'
                : 'text-slate-700'
            }`}
          >
            {feedbackMsg || (
              <span>
                Ucapkan <b>"{question.targetName}"</b> dengan lantang ke mikrofon!
              </span>
            )}
          </p>
        )}
      </div>

      {/* Tombol Utama Mikrofon */}
      <div className="relative flex items-center justify-center mb-2">
        {isListening && (
          <>
            <motion.div
              animate={{ scale: [1, 1.4, 1.7], opacity: [0.6, 0.3, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeOut' }}
              className={`absolute w-20 h-20 rounded-full pointer-events-none ${
                stage === 'capturing' ? 'bg-emerald-400' : 'bg-blue-400'
              }`}
            />
            <motion.div
              animate={{ scale: [1, 1.25, 1.5], opacity: [0.7, 0.4, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: 0.3, ease: 'easeOut' }}
              className="absolute w-20 h-20 rounded-full bg-emerald-300 pointer-events-none"
            />
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMicButtonClick}
          disabled={isSuccess}
          className={`relative z-10 w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center transition-all shadow-xl active:translate-y-1 ${
            isSuccess
              ? 'bg-duo-green text-white shadow-duo-green cursor-default'
              : stage === 'capturing'
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-300 ring-4 ring-emerald-200'
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

      <span className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
        {isSuccess
          ? 'Lafal Tepat!'
          : stage === 'capturing'
          ? 'Merekam Suaramu... (Otomatis Selesai)'
          : isListening
          ? 'Mendengarkan... Langsung Ucapkan!'
          : 'Ketuk untuk Bicara'}
      </span>

      {/* Pemilih Perangkat Mikrofon (Bermanfaat jika PC memiliki beberapa input audio) */}
      <div className="relative mb-3">
        <button
          onClick={() => setShowDevicePicker(!showDevicePicker)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl transition max-w-xs truncate"
        >
          <SlidersHorizontal className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">Mic: {activeMicLabel}</span>
        </button>

        <AnimatePresence>
          {showDevicePicker && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 bg-white border-2 border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-left"
            >
              <div className="text-[10px] font-black text-slate-400 uppercase px-2 py-1">
                Pilih Input Mikrofon:
              </div>
              <button
                onClick={() => {
                  setSelectedDeviceId('');
                  setShowDevicePicker(false);
                  setTimeout(() => startAcousticListening(true), 80);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition truncate mb-1 ${
                  selectedDeviceId === ''
                    ? 'bg-emerald-50 text-emerald-700 font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                ⭐ Otomatis (Hindari Stereo Mix)
              </button>
              {audioDevices.map((dev) => (
                <button
                  key={dev.deviceId}
                  onClick={() => {
                    setSelectedDeviceId(dev.deviceId);
                    setShowDevicePicker(false);
                    setTimeout(() => startAcousticListening(true), 80);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition truncate ${
                    dev.deviceId === selectedDeviceId
                      ? 'bg-emerald-50 text-emerald-700 font-black'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {dev.label || `Mikrofon (${dev.deviceId.slice(0, 5)}...)`}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tombol Ulangi Instruksi & Toleransi */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 px-4">
        <button
          onClick={playPromptAudio}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ulangi Instruksi</span>
        </button>

        {/* Tombol Toleransi Ramah Anak */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleBypass}
          className="flex items-center gap-1.5 text-xs font-black text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3.5 py-1.5 rounded-xl shadow-xs transition"
        >
          <span>⭐ Saya Sudah Ucapkan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Notifikasi Kendala Izin Mikrofon */}
      {micErrorMsg && (
        <div className="mt-3 mx-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-[11px] font-semibold text-amber-700 text-left">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            {micErrorMsg} Anda tetap dapat menekan tombol <b>"Saya Sudah Ucapkan"</b> untuk
            melanjutkan.
          </span>
        </div>
      )}
    </div>
  );
};
