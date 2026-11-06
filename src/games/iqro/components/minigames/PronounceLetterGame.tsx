import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  Volume2,
  Sparkles,
  Check,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  Globe,
  Radio,
} from 'lucide-react';
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

type SpeechStage = 'waiting' | 'sound_detected' | 'speech_detected' | 'evaluating';

export const PronounceLetterGame: React.FC<PronounceLetterGameProps> = ({
  question,
  onCorrect,
  childName = 'Faqih',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechStage, setSpeechStage] = useState<SpeechStage>('waiting');
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastHeard, setLastHeard] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isMicSupported, setIsMicSupported] = useState(true);
  const [micErrorMsg, setMicErrorMsg] = useState<string | null>(null);

  // VAD flags for button & indicator triggers
  const [isVocalDetected, setIsVocalDetected] = useState<boolean>(false);
  const [vocalBurstDetected, setVocalBurstDetected] = useState<boolean>(false);
  const [recognitionLang, setRecognitionLang] = useState<'ar-SA' | 'id-ID'>('id-ID');

  const isAdvancingRef = useRef(false);
  const evaluatingTimerRef = useRef<any>(null);

  // Inisialisasi & reset setiap kali soal berganti
  useEffect(() => {
    stopAllAudioEngines();

    setIsListening(false);
    setSpeechStage('waiting');
    setIsSuccess(false);
    setLastHeard('');
    setFeedbackMsg('');
    setFailedAttempts(0);
    setMicErrorMsg(null);
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
      if (evaluatingTimerRef.current) clearTimeout(evaluatingTimerRef.current);
      stopAllAudioEngines();
    };
  }, [question.id]);

  const stopAllAudioEngines = () => {
    speechRecognitionService.stopListening();
  };

  const playPromptAudio = () => {
    soundManager.playPop();
    ttsNarrator.speak('Ucapkan huruf di bawah ini!');
  };

  const playExampleAudio = () => {
    soundManager.playPop();
    const letter = question.targetName || question.targetLetter;
    ttsNarrator.speakLetter(letter);
  };

  const handleStartListening = () => {
    if (isSuccess || isAdvancingRef.current) return;

    // Hentikan suara narator sebelumnya agar tidak masuk ke mikrofon
    ttsNarrator.stop();
    soundManager.playPop();

    setMicErrorMsg(null);
    setFeedbackMsg('Mendengarkan suaramu...');
    setIsListening(true);
    setSpeechStage('waiting');
    setIsVocalDetected(false);
    setVocalBurstDetected(false);

    // Sambungkan Web Speech Recognition langsung tanpa konflik getUserMedia
    const started = speechRecognitionService.startListening({
      lang: recognitionLang,
      timeoutMs: 60000,
      onAudioStart: () => {
        setSpeechStage('waiting');
      },
      onSoundStart: () => {
        setSpeechStage('sound_detected');
        setIsVocalDetected(true);
      },
      onSpeechStart: () => {
        setSpeechStage('speech_detected');
        setIsVocalDetected(true);
        setVocalBurstDetected(true);
      },
      onSpeechEnd: () => {
        setSpeechStage('evaluating');
      },
      onResult: (transcripts) => {
        if (transcripts.length === 0) return;
        setSpeechStage('evaluating');
        setIsVocalDetected(true);
        setVocalBurstDetected(true);

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
          // Jika pengguna melafalkan huruf hijaiyah lain (misal di layar Ta tapi ucapkan Ba)
          if (
            evaluation.identifiedLetter &&
            evaluation.identifiedLetter.toLowerCase() !== question.targetName.toLowerCase()
          ) {
            setFeedbackMsg(
              `Terdengar: "${evaluation.identifiedLetter}". Ini huruf "${question.targetName}", ayo ucapkan "${question.targetName}" ya! 🎯`
            );
          } else {
            setFeedbackMsg(
              `Terdengar: "${latestSample}". Ayo lafalkan "${question.targetName}" lagi ya!`
            );
          }
          setFailedAttempts((prev) => prev + 1);

          // Kembalikan status ke listening aktif setelah 1.5 detik
          if (evaluatingTimerRef.current) clearTimeout(evaluatingTimerRef.current);
          evaluatingTimerRef.current = setTimeout(() => {
            setSpeechStage((prev) => (prev === 'evaluating' ? 'waiting' : prev));
          }, 1500);
        }
      },
      onError: (errMessage, errCode) => {
        if (errCode === 'not-allowed' || errCode === 'permission-denied') {
          setIsListening(false);
          setSpeechStage('waiting');
          setMicErrorMsg('Izin mikrofon belum aktif. Silakan klik ikon gembok di address bar browser dan izinkan mikrofon.');
        } else if (errCode === 'no-speech') {
          // Abaikan no-speech
        } else {
          setFeedbackMsg(errMessage);
        }
      },
      onEnd: () => {
        // Biarkan auto-restart service yang menangani
      },
    });

    if (!started) {
      setIsListening(false);
      setSpeechStage('waiting');
      setFeedbackMsg('Mikrofon tidak dapat dimulai. Periksa izin browser.');
    }
  };

  const handleStopListening = () => {
    stopAllAudioEngines();
    setIsListening(false);
    setSpeechStage('waiting');
  };

  const handleSuccess = (matchedWord: string) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    stopAllAudioEngines();
    setIsListening(false);
    setSpeechStage('waiting');
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

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-1">
      {/* Baris Atas: Contoh Lafal & Pengaturan Bahasa */}
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

        {/* Toggle Bahasa Pengenalan (Indo / Arab) */}
        <button
          onClick={() => {
            const next = recognitionLang === 'id-ID' ? 'ar-SA' : 'id-ID';
            setRecognitionLang(next);
            if (isListening) handleStopListening();
          }}
          title="Ganti mode bahasa pengenalan ucapan"
          className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2.5 py-1.5 rounded-2xl transition"
        >
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span>Mode: {recognitionLang === 'id-ID' ? '🇮🇩 Indo (Peka)' : '🇸🇦 Arab'}</span>
        </button>
      </div>

      {/* Spoken Prompt Title */}
      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-3 px-2">
        {question.promptText || 'Ucapkan huruf di bawah ini!'}
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

      {/* Real-Time Status & Indikator Gelombang Suara (Equalizer Visualizer) */}
      {isListening && (
        <div className="w-full max-w-[280px] flex flex-col items-center mb-2 px-4 animate-fade-in">
          <div className="flex items-center justify-between w-full text-[11px] font-black mb-1.5">
            <span
              className={`flex items-center gap-1.5 transition-colors ${
                speechStage === 'speech_detected' || speechStage === 'evaluating'
                  ? 'text-emerald-600'
                  : speechStage === 'sound_detected'
                  ? 'text-teal-600'
                  : 'text-blue-500'
              }`}
            >
              <Radio
                className={`w-3.5 h-3.5 ${
                  speechStage !== 'waiting' ? 'animate-pulse text-emerald-500' : 'text-blue-400'
                }`}
              />
              <span>
                {speechStage === 'evaluating'
                  ? 'Menganalisis Lafal... 🔍'
                  : speechStage === 'speech_detected'
                  ? 'Lafal Terdeteksi! 🟢'
                  : speechStage === 'sound_detected'
                  ? 'Suara Masuk... 🔊'
                  : 'Menunggu Suaramu... 🎙️'}
              </span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {speechStage !== 'waiting' ? 'Aktif' : 'Standby'}
            </span>
          </div>

          {/* Baris Gelombang Suara Dinamis */}
          <div className="flex items-end justify-center gap-1.5 h-8 w-full bg-slate-100/90 border border-slate-200 rounded-xl p-1.5 overflow-hidden">
            {[0, 1, 2, 3, 4, 5, 6].map((barIdx) => {
              const isSpeech = speechStage === 'speech_detected' || speechStage === 'evaluating';
              const isSound = speechStage === 'sound_detected';

              return (
                <motion.div
                  key={barIdx}
                  animate={
                    isSpeech
                      ? {
                          height: ['40%', '95%', '60%', '100%', '45%'],
                          backgroundColor: '#10b981',
                        }
                      : isSound
                      ? {
                          height: ['25%', '65%', '35%', '70%', '30%'],
                          backgroundColor: '#14b8a6',
                        }
                      : {
                          height: ['15%', '28%', '15%'],
                          backgroundColor: '#94a3b8',
                        }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: isSpeech ? 0.35 + barIdx * 0.05 : isSound ? 0.5 + barIdx * 0.07 : 1.2 + barIdx * 0.15,
                    ease: 'easeInOut',
                  }}
                  className="w-4 rounded-md shadow-2xs"
                  style={{ minHeight: '6px' }}
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
        ) : (
          <div className="flex flex-col items-center gap-1">
            {lastHeard && (
              <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-2xs">
                <span>Didengar mikrofon:</span>
                <span className="text-emerald-700 font-black">"{lastHeard}"</span>
              </div>
            )}
            <p className={`text-xs sm:text-sm font-bold animate-fade-in ${failedAttempts > 0 ? 'text-amber-700' : 'text-slate-700'}`}>
              {feedbackMsg || (
                <span>
                  Tekan mikrofon di bawah lalu lafalkan <b>"{question.targetName}"</b> dengan lantang!
                </span>
              )}
            </p>
          </div>
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
        {isSuccess
          ? 'Lafal Tepat!'
          : isListening
          ? 'Sedang Mendengarkan (Katakan Sekarang!)'
          : 'Ketuk untuk Bicara'}
      </span>

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
        {(failedAttempts >= 1 || isVocalDetected || vocalBurstDetected || isListening || !isMicSupported || micErrorMsg) && (
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