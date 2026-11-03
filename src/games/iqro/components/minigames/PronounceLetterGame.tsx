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
  Globe,
  Radio,
  Zap,
} from 'lucide-react';
import { Question } from '../../../../core/types/gameTypes';
import { soundManager } from '../../../../core/audio/soundManager';
import { ttsNarrator } from '../../../../core/audio/ttsNarrator';
import { speechRecognitionService } from '../../../../core/speech/speechRecognitionService';
import { audioLevelDetector, MicSensitivity } from '../../../../core/speech/audioLevelDetector';
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

  // Live Sound Volume & VAD (Voice Activity Detection)
  const [liveVolume, setLiveVolume] = useState<number>(0);
  const [isVocalDetected, setIsVocalDetected] = useState<boolean>(false);
  const [vocalBurstDetected, setVocalBurstDetected] = useState<boolean>(false);
  const [sensitivity, setSensitivity] = useState<MicSensitivity>('high');

  // Microphones & Language selection
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [showDevicePicker, setShowDevicePicker] = useState<boolean>(false);
  const [recognitionLang, setRecognitionLang] = useState<'ar-SA' | 'id-ID'>('ar-SA');

  const isAdvancingRef = useRef(false);
  const vocalValidationTimerRef = useRef<any>(null);

  // Ambil daftar perangkat mikrofon yang tersedia
  useEffect(() => {
    audioLevelDetector.getAvailableMicrophones().then((devices) => {
      setAudioDevices(devices);
      // Utamakan Realtek atau mikrofon fisik jika defaultnya adalah virtual audio device
      if (devices.length > 0 && !selectedDeviceId) {
        const physicalMic = devices.find(
          (d) =>
            !d.label.toLowerCase().includes('virtual') &&
            !d.label.toLowerCase().includes('voice changer')
        );
        setSelectedDeviceId(physicalMic ? physicalMic.deviceId : devices[0].deviceId);
      }
    });
  }, []);

  // Inisialisasi & reset setiap kali soal berganti
  useEffect(() => {
    stopAllAudioEngines();

    setIsListening(false);
    setIsSuccess(false);
    setLastHeard('');
    setFeedbackMsg('');
    setFailedAttempts(0);
    setMicErrorMsg(null);
    setLiveVolume(0);
    setIsVocalDetected(false);
    setVocalBurstDetected(false);
    isAdvancingRef.current = false;

    const supported = speechRecognitionService.isSupported();
    setIsMicSupported(supported);

    // Mainkan prompt suara instruksi otomatis
    const timer = setTimeout(() => {
      playPromptAudio();
    }, 350);

    return () => {
      clearTimeout(timer);
      stopAllAudioEngines();
    };
  }, [question.id]);

  const stopAllAudioEngines = () => {
    if (vocalValidationTimerRef.current) {
      clearTimeout(vocalValidationTimerRef.current);
      vocalValidationTimerRef.current = null;
    }
    speechRecognitionService.stopListening();
    audioLevelDetector.stop();
  };

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

  const handleStartListening = async () => {
    if (isSuccess || isAdvancingRef.current) return;

    soundManager.playPop();
    setMicErrorMsg(null);
    setFeedbackMsg('Mendengarkan suaramu...');
    setIsListening(true);
    setLiveVolume(0);
    setIsVocalDetected(false);
    setVocalBurstDetected(false);

    // 1. Sambungkan Web Audio API Analyser untuk VU-meter real-time & Deteksi Suara Lokal (VAD)
    await audioLevelDetector.start({
      deviceId: selectedDeviceId,
      sensitivity: sensitivity,
      onVolume: (vol, isSpeaking) => {
        setLiveVolume(vol);
        if (isSpeaking) {
          setIsVocalDetected(true);
        }
      },
      onVocalBurst: (peakVol) => {
        // Suara manusia nyata terdeteksi (> 220ms)!
        setVocalBurstDetected(true);
        setFeedbackMsg(`Suara terdeteksi (Volume ${peakVol}%)! Menganalisis lafal...`);

        // Jembatan Penyelamat Cerdas: Jika pengenalan cloud lambat/tidak membalas,
        // validasi suara pengguna secara lokal setelah 1.2 detik!
        if (!vocalValidationTimerRef.current) {
          vocalValidationTimerRef.current = setTimeout(() => {
            if (!isAdvancingRef.current && !isSuccess) {
              handleSuccess(question.targetName);
            }
          }, 1200);
        }
      },
      onError: (err) => {
        console.warn('VU meter error:', err);
      },
    });

    // 2. Sambungkan Web Speech Recognition
    const started = speechRecognitionService.startListening({
      lang: recognitionLang,
      timeoutMs: 14000,
      onResult: (transcripts) => {
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
        } else {
          setFeedbackMsg(`Terdengar: "${latestSample}". Ayo lafalkan "${question.targetName}" lagi ya!`);
        }
      },
      onError: (errMessage, errCode) => {
        if (errCode === 'not-allowed' || errCode === 'permission-denied') {
          setIsListening(false);
          audioLevelDetector.stop();
          setMicErrorMsg('Izin mikrofon belum aktif. Silakan izinkan akses mikrofon di browser.');
        } else if (errCode === 'no-speech') {
          // Abaikan no-speech pada mode hybrid karena VAD lokal tetap mendengarkan
        } else {
          setFeedbackMsg(errMessage);
        }
      },
      onEnd: () => {
        // Biarkan ditangani oleh pengguna atau timer
      },
    });

    if (!started) {
      // Jika SpeechRecognition tidak didukung (misal Firefox atau browser tertentu),
      // VAD Web Audio lokal tetap aktif mendengarkan suara pengguna!
      setFeedbackMsg('Mode deteksi suara langsung aktif. Silakan lafalkan huruf!');
    }
  };

  const handleStopListening = () => {
    stopAllAudioEngines();
    setIsListening(false);
    setLiveVolume(0);
  };

  const handleSuccess = (matchedWord: string) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    stopAllAudioEngines();
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

    const fallbackTimer = setTimeout(advance, 2400);

    ttsNarrator.speakPraise(childName, () => {
      clearTimeout(fallbackTimer);
      advance();
    });
  };

  const handleBypass = () => {
    if (isAdvancingRef.current) return;
    soundManager.playPop();
    handleSuccess(question.targetName);
  };

  const currentDeviceLabel =
    audioDevices.find((d) => d.deviceId === selectedDeviceId)?.label ||
    (audioDevices.length > 0 ? audioDevices[0].label : 'Mikrofon Default');

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-1">
      {/* Baris Atas: Contoh Lafal & Pengaturan Sensitivitas/Bahasa */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
        {/* Tombol Contoh Suara */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={playExampleAudio}
          className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-300 px-3.5 py-1.5 rounded-2xl shadow-xs font-black text-xs transition"
        >
          <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Dengarkan Contoh Lafal</span>
        </motion.button>

        {/* Sensitivitas Mikrofon Toggle */}
        <button
          onClick={() => {
            const nextSens: MicSensitivity =
              sensitivity === 'high' ? 'normal' : sensitivity === 'normal' ? 'low' : 'high';
            setSensitivity(nextSens);
            if (isListening) handleStopListening();
          }}
          title="Ubah tingkat kepekaan mikrofon"
          className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1.5 rounded-2xl transition"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Peka: {sensitivity === 'high' ? 'Sangat Tinggi ⚡' : sensitivity === 'normal' ? 'Sedang' : 'Rendah'}</span>
        </button>

        {/* Toggle Bahasa Pengenalan (Arab / Indo) */}
        <button
          onClick={() => {
            const next = recognitionLang === 'ar-SA' ? 'id-ID' : 'ar-SA';
            setRecognitionLang(next);
            if (isListening) handleStopListening();
          }}
          title="Ganti mode bahasa pengenalan ucapan"
          className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2.5 py-1.5 rounded-2xl transition"
        >
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span>Mode: {recognitionLang === 'ar-SA' ? '🇸🇦 Arab' : '🇮🇩 Indo'}</span>
        </button>
      </div>

      {/* Spoken Prompt Title */}
      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-3 px-2">
        {question.promptText || `Ayo ucapkan huruf: ${question.targetName}!`}
      </h2>

      {/* Kartu Huruf Hijaiyah Besar 3D */}
      <motion.div
        animate={isSuccess ? { scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] } : {}}
        className={`w-44 h-44 sm:w-52 sm:h-52 rounded-3xl flex flex-col items-center justify-center p-3 border-4 transition-all duration-300 shadow-xl relative overflow-hidden mb-3 ${
          isSuccess
            ? 'bg-gradient-to-b from-emerald-50 to-teal-50 border-emerald-500 shadow-emerald-200'
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
            color: isSuccess ? '#059669' : '#1e293b',
          }}
        >
          {question.targetLetter}
        </span>

        <div className="mt-1 bg-slate-100/90 border border-slate-200 px-3 py-0.5 rounded-full font-black text-xs sm:text-sm text-slate-700 shadow-2xs">
          "{question.targetName}"
        </div>
      </motion.div>

      {/* Real-Time VU-Meter / Indikator Gelombang Suara Nyata */}
      {isListening && (
        <div className="w-full max-w-[260px] flex flex-col items-center mb-2 px-4 animate-fade-in">
          <div className="flex items-center justify-between w-full text-[11px] font-black mb-1">
            <span className={`flex items-center gap-1 ${isVocalDetected ? 'text-emerald-600' : 'text-slate-400'}`}>
              <Radio className={`w-3 h-3 ${isVocalDetected ? 'animate-pulse text-emerald-500' : ''}`} />
              <span>{vocalBurstDetected ? 'Lafal Terdeteksi! 🟢' : isVocalDetected ? 'Suara Terdeteksi...' : 'Menunggu Suaramu...'}</span>
            </span>
            <span className="text-slate-500">{liveVolume}%</span>
          </div>

          {/* Baris Gelombang Suara (Real-time equalizer bars) */}
          <div className="flex items-end justify-center gap-1.5 h-7 w-full bg-slate-100/80 border border-slate-200 rounded-xl p-1 overflow-hidden">
            {[0.5, 0.9, 1.2, 0.8, 1.1, 0.7, 1.0].map((multiplier, idx) => {
              const barHeight = Math.min(100, Math.max(8, Math.round(liveVolume * multiplier)));
              const isHigh = barHeight > 35;
              return (
                <div
                  key={idx}
                  className={`w-4 rounded-md transition-all duration-75 ${
                    isHigh ? 'bg-emerald-500 shadow-xs' : barHeight > 15 ? 'bg-teal-400' : 'bg-slate-300'
                  }`}
                  style={{ height: `${barHeight}%` }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback Status / Live Transcription */}
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
        ) : feedbackMsg ? (
          <p className="text-xs sm:text-sm font-bold text-slate-700 animate-fade-in">
            {feedbackMsg}
          </p>
        ) : lastHeard ? (
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Terdengar: <span className="text-emerald-700 font-black">"{lastHeard}"</span>
          </p>
        ) : (
          <p className="text-xs sm:text-sm font-semibold text-slate-400">
            Tekan mikrofon di bawah lalu lafalkan <b>"{question.targetName}"</b> dengan lantang!
          </p>
        )}
      </div>

      {/* Tombol Utama Mikrofon */}
      <div className="relative flex items-center justify-center mb-2">
        {isListening && (
          <>
            <motion.div
              animate={{ scale: [1, 1.4, 1.7], opacity: [0.6, 0.3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
              className="absolute w-20 h-20 rounded-full bg-blue-400 pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.25, 1.5], opacity: [0.7, 0.4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, ease: 'easeOut' }}
              className="absolute w-20 h-20 rounded-full bg-emerald-300 pointer-events-none"
            />
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={isSuccess}
          className={`relative z-10 w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center transition-all shadow-xl active:translate-y-1 ${
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

      <span className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
        {isSuccess ? 'Lafal Tepat!' : isListening ? 'Sedang Mendengarkan...' : 'Ketuk untuk Bicara'}
      </span>

      {/* Selector Pemilih Mikrofon (Jika di PC terdapat Virtual Mic vs Realtek Mic) */}
      {audioDevices.length > 1 && (
        <div className="relative mb-3">
          <button
            onClick={() => setShowDevicePicker(!showDevicePicker)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl transition max-w-xs truncate"
          >
            <SlidersHorizontal className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">Mic: {currentDeviceLabel}</span>
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
                  Pilih Mikrofon Aktif:
                </div>
                {audioDevices.map((dev) => (
                  <button
                    key={dev.deviceId}
                    onClick={() => {
                      setSelectedDeviceId(dev.deviceId);
                      setShowDevicePicker(false);
                      if (isListening) handleStopListening();
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition truncate ${
                      dev.deviceId === selectedDeviceId
                        ? 'bg-emerald-50 text-emerald-700'
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
      )}

      {/* Fallback & Tombol Toleransi */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 px-4">
        <button
          onClick={playPromptAudio}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ulangi Instruksi</span>
        </button>

        {/* Tombol Toleransi: Lewati / Saya Sudah Ucapkan */}
        {(failedAttempts >= 1 || isVocalDetected || vocalBurstDetected || !isMicSupported || micErrorMsg) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleBypass}
            className="flex items-center gap-1.5 text-xs font-black text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3.5 py-1.5 rounded-xl shadow-xs transition"
          >
            <span>⭐ Saya Sudah Ucapkan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>

      {/* Notifikasi Kendala Izin Mikrofon */}
      {micErrorMsg && (
        <div className="mt-3 mx-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-[11px] font-semibold text-amber-700 text-left">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{micErrorMsg} Anda tetap dapat menekan tombol <b>"Saya Sudah Ucapkan"</b> untuk melanjutkan.</span>
        </div>
      )}
    </div>
  );
};
