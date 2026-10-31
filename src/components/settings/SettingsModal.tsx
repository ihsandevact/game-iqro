import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Volume2, VolumeX, RotateCcw, AlertTriangle, ShieldCheck, Star, Gem, Flame, Check } from 'lucide-react';
import { IqroLevelId } from '../../core/types/gameTypes';
import { soundManager } from '../../core/audio/soundManager';
import { ttsNarrator } from '../../core/audio/ttsNarrator';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: IqroLevelId;
  starsTotal: number;
  gemsTotal: number;
  streakDays: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetLevel: (levelId: IqroLevelId) => void;
  onResetAll: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  starsTotal,
  gemsTotal,
  streakDays,
  soundEnabled,
  onToggleSound,
  onResetLevel,
  onResetAll,
}) => {
  const [resetTarget, setResetTarget] = useState<'level' | 'all' | null>(null);
  const [parentalMath, setParentalMath] = useState<{ num1: number; num2: number; answer: number } | null>(null);
  const [mathAnswerInput, setMathAnswerInput] = useState('');
  const [mathError, setMathError] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerResetGate = (target: 'level' | 'all') => {
    soundManager.playPop();
    const num1 = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const num2 = Math.floor(Math.random() * 5) + 2; // 2 to 6
    setParentalMath({ num1, num2, answer: num1 + num2 });
    setResetTarget(target);
    setMathAnswerInput('');
    setMathError(false);
  };

  const handleVerifyParent = () => {
    if (!parentalMath || !resetTarget) return;

    if (parseInt(mathAnswerInput, 10) === parentalMath.answer) {
      if (resetTarget === 'level') {
        onResetLevel(currentLevel);
        setResetSuccessMsg(`Progres Iqro ${currentLevel} berhasil diulang dari awal!`);
      } else {
        onResetAll();
        setResetSuccessMsg('Seluruh petualangan berhasil direset ke kondisi awal!');
      }

      soundManager.playCorrect();
      ttsNarrator.speak('Progres berhasil direset!');
      setParentalMath(null);
      setResetTarget(null);

      setTimeout(() => {
        setResetSuccessMsg(null);
        onClose();
      }, 1600);
    } else {
      soundManager.playGentleWrong();
      setMathError(true);
      setTimeout(() => setMathError(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-slate-100 flex flex-col overflow-hidden max-h-[92dvh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b-2 border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings className="w-6 h-6 text-duo-green" />
            <h2 className="text-lg sm:text-xl font-black">Pengaturan & Data</h2>
          </div>
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="p-2 rounded-2xl hover:bg-slate-100 active:scale-95 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Success Banner */}
          {resetSuccessMsg && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-black shadow-sm"
            >
              <Check className="w-5 h-5 text-duo-green shrink-0" />
              <span>{resetSuccessMsg}</span>
            </motion.div>
          )}

          {/* Rapor Belajar Santri */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5">
              Rapor Belajar Anak
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-2.5 text-center">
                <Star className="w-5 h-5 fill-duo-yellow text-amber-500 mx-auto mb-1" />
                <div className="text-lg font-black text-amber-700">{starsTotal}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Bintang</div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-2.5 text-center">
                <Gem className="w-5 h-5 fill-duo-blue text-duo-blue mx-auto mb-1" />
                <div className="text-lg font-black text-duo-blue">{gemsTotal}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Permata</div>
              </div>

              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-2.5 text-center">
                <Flame className="w-5 h-5 fill-duo-orange text-duo-orange mx-auto mb-1" />
                <div className="text-lg font-black text-duo-orange">{streakDays} Hari</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Streak</div>
              </div>
            </div>
          </div>

          {/* Pengaturan Audio */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5">
              Pengaturan Suara
            </h3>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-duo-blue/15 text-duo-blue flex items-center justify-center">
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-500" />}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-800">Suara Narasi & Efek</div>
                  <div className="text-[11px] font-semibold text-slate-400">Audio makhraj dan feedback ceria</div>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playPop();
                  onToggleSound();
                }}
                className={`px-4 py-1.5 rounded-xl font-black text-xs transition ${
                  soundEnabled
                    ? 'bg-duo-green text-white shadow-duo-green'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {soundEnabled ? 'AKTIF' : 'MATI'}
              </button>
            </div>
          </div>

          {/* Parental Gate & Reset Section */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zona Orang Tua (Parental Controls)</span>
            </h3>

            {/* If Parental Math Challenge is open */}
            <AnimatePresence>
              {parentalMath ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-slate-800">
                        Kunci Pengaman Orang Tua
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Untuk memastikan bukan anak yang menekan, berapa hasil dari:
                      </p>
                      <div className="text-lg font-black text-amber-700 mt-1">
                        {parentalMath.num1} + {parentalMath.num2} = ?
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="number"
                      placeholder="Jawaban..."
                      value={mathAnswerInput}
                      onChange={(e) => setMathAnswerInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleVerifyParent();
                      }}
                      className={`w-28 p-2 text-center font-black text-base rounded-xl border-2 outline-none transition ${
                        mathError
                          ? 'border-red-400 bg-red-50 text-red-600 animate-bounce'
                          : 'border-slate-300 bg-white text-slate-800 focus:border-duo-green'
                      }`}
                      autoFocus
                    />

                    <button
                      onClick={handleVerifyParent}
                      className="flex-1 py-2 rounded-xl bg-duo-green hover:bg-duo-greenDark text-white font-black text-xs shadow-duo-green active:translate-y-0.5 transition"
                    >
                      Konfirmasi Reset
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playPop();
                        setParentalMath(null);
                        setResetTarget(null);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-200 text-slate-600 font-bold text-xs"
                    >
                      Batal
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Normal Reset Action Buttons */
                <div className="space-y-2.5">
                  <button
                    onClick={() => triggerResetGate('level')}
                    className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-orange-50 border-2 border-orange-200 rounded-2xl text-left transition group active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 text-duo-orange flex items-center justify-center shrink-0">
                        <RotateCcw className="w-5 h-5 group-hover:rotate-[-45deg] transition-transform" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-800">
                          Ulangi Iqro {currentLevel} Saja
                        </div>
                        <div className="text-[11px] font-semibold text-slate-400">
                          Reset bintang & stage level ini (kostum tetap aman)
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => triggerResetGate('all')}
                    className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-red-50 border-2 border-red-200 rounded-2xl text-left transition group active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-100 text-duo-red flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-duo-red">
                          Reset Seluruh Data Belajar
                        </div>
                        <div className="text-[11px] font-semibold text-slate-400">
                          Kembali seperti baru pertama kali mengunduh game
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
