import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer } from 'vaul';
import {
  X,
  Settings,
  Volume2,
  VolumeX,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Star,
  Gem,
  Flame,
  Check,
  Smartphone,
  Download,
  User,
  Lock,
  Unlock,
} from 'lucide-react';
import { IqroLevelId } from '../../core/types/gameTypes';
import { soundManager } from '../../core/audio/soundManager';
import { ttsNarrator } from '../../core/audio/ttsNarrator';
import { BoniMascot } from '../mascot/BoniMascot';
import { useIsMobile } from '../../core/hooks/useIsMobile';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  onUpdateChildName: (name: string) => void;
  currentLevel: IqroLevelId;
  starsTotal: number;
  gemsTotal: number;
  streakDays: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetLevel: (levelId: IqroLevelId) => void;
  onResetAll: () => void;
  isInstallable?: boolean;
  onInstallPwa?: () => void;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedCape?: string;
  unlockedAllLevels?: boolean;
  onToggleUnlockAllLevels?: (enabled?: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  childName,
  onUpdateChildName,
  currentLevel,
  starsTotal,
  gemsTotal,
  streakDays,
  soundEnabled,
  onToggleSound,
  onResetLevel,
  onResetAll,
  isInstallable,
  onInstallPwa,
  equippedHat = 'hat-default',
  equippedGlasses = 'glasses-none',
  equippedCape = 'cape-none',
  unlockedAllLevels = false,
  onToggleUnlockAllLevels,
}) => {
  const isMobile = useIsMobile(768);
  const [resetTarget, setResetTarget] = useState<'level' | 'all' | 'unlock_all' | null>(null);
  const [parentalMath, setParentalMath] = useState<{ num1: number; num2: number; answer: number } | null>(null);
  const [mathAnswerInput, setMathAnswerInput] = useState('');
  const [mathError, setMathError] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState(childName || 'Faqih');
  const [isNameSaved, setIsNameSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveName = () => {
    const trimmed = nameInput.trim() || 'Faqih';
    setNameInput(trimmed);
    onUpdateChildName(trimmed);
    setIsNameSaved(true);
    soundManager.playCorrect();
    ttsNarrator.speakGreeting(trimmed);
    setTimeout(() => setIsNameSaved(false), 2500);
  };

  const triggerResetGate = (target: 'level' | 'all' | 'unlock_all') => {
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
      if (resetTarget === 'unlock_all') {
        const nextState = !unlockedAllLevels;
        onToggleUnlockAllLevels?.(nextState);
        setResetSuccessMsg(
          nextState
            ? 'Mode Santri Lanjutan aktif! Seluruh tingkat Iqro kini terbuka bebas.'
            : 'Mode Standar aktif! Tingkat Iqro kembali mengikuti urutan kurikulum.'
        );
        soundManager.playCorrect();
      } else if (resetTarget === 'level') {
        onResetLevel(currentLevel);
        setResetSuccessMsg(`Progres Iqro ${currentLevel} berhasil diulang dari awal!`);
        soundManager.playCorrect();
        ttsNarrator.speakResetSuccess();
      } else {
        onResetAll();
        setResetSuccessMsg('Seluruh petualangan berhasil direset ke kondisi awal!');
        soundManager.playCorrect();
        ttsNarrator.speakResetSuccess();
      }

      setParentalMath(null);
      setResetTarget(null);

      setTimeout(() => {
        setResetSuccessMsg(null);
        if (resetTarget !== 'unlock_all') {
          onClose();
        }
      }, 1600);
    } else {
      soundManager.playGentleWrong();
      setMathError(true);
      setTimeout(() => setMathError(false), 800);
    }
  };

  // Reusable body content for both Mobile Drawer & Desktop Modal
  const modalContent = (
    <div className="space-y-5 sm:space-y-6">
      {/* Success Notification Banner */}
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

      {/* Profil Santri Cilik / Ganti Nama Anak */}
      <div>
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5 flex items-center gap-1.5">
          <User className="w-4 h-4 text-duo-green" />
          <span>Profil Santri Cilik</span>
        </h3>
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-2 border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-3.5 shadow-sm">
          {/* Avatar Maskot & Mobile Label Row */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl border-2 border-emerald-300 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              <BoniMascot
                mood="happy"
                size="sm"
                equippedHat={equippedHat}
                equippedGlasses={equippedGlasses}
                equippedCape={equippedCape}
                characterName={nameInput}
              />
            </div>
            {/* Header text on mobile next to avatar */}
            <div className="sm:hidden flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">Nama Panggilan Anak</span>
                {isNameSaved && (
                  <span className="text-[10px] font-black text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-emerald-300 shadow-sm animate-pulse">
                    ✓ Tersimpan
                  </span>
                )}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 truncate">
                Dipanggil saat memuji si kecil
              </div>
            </div>
          </div>

          {/* Input & Action Row */}
          <div className="flex-1 w-full min-w-0">
            <div className="hidden sm:flex items-center justify-between mb-1.5">
              <label htmlFor="childNameInput" className="text-xs font-black text-slate-800">
                Nama Panggilan Anak
              </label>
              {isNameSaved && (
                <span className="text-[10px] font-black text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-emerald-300 shadow-sm animate-pulse">
                  ✓ Tersimpan
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full">
              <input
                id="childNameInput"
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setIsNameSaved(false);
                }}
                onBlur={handleSaveName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                }}
                maxLength={15}
                placeholder="Contoh: Faqih"
                className="flex-1 min-w-0 px-3.5 py-2 text-xs sm:text-sm font-black text-slate-800 bg-white rounded-xl border-2 border-slate-300 focus:border-duo-green outline-none transition"
              />
              <button
                onClick={handleSaveName}
                className="px-4 py-2 bg-duo-green hover:bg-duo-greenDark active:scale-95 text-white font-black text-xs rounded-xl shadow-duo-green transition shrink-0 flex items-center gap-1.5"
              >
                <span>Simpan</span>
                {isNameSaved && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            </div>

            <div className="text-[10px] font-semibold text-slate-500 mt-1.5">
              Nama ini dipanggil {nameInput.trim() || 'si kecil'} saat memuji & menyemangati!
            </div>
          </div>
        </div>
      </div>

      {/* Rapor Belajar Santri */}
      <div>
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5">
          Rapor Belajar Anak
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-2.5 text-center shadow-sm">
            <Star className="w-5 h-5 fill-duo-yellow text-amber-500 mx-auto mb-1" />
            <div className="text-base sm:text-lg font-black text-amber-700">{starsTotal}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Bintang</div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-2.5 text-center shadow-sm">
            <Gem className="w-5 h-5 fill-duo-blue text-duo-blue mx-auto mb-1" />
            <div className="text-base sm:text-lg font-black text-duo-blue">{gemsTotal}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Permata</div>
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-2.5 text-center shadow-sm">
            <Flame className="w-5 h-5 fill-duo-orange text-duo-orange mx-auto mb-1" />
            <div className="text-base sm:text-lg font-black text-duo-orange">{streakDays} Hari</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Streak</div>
          </div>
        </div>
      </div>

      {/* Pengaturan Audio */}
      <div>
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5">
          Pengaturan Suara
        </h3>
        <div className="flex items-center justify-between p-3 sm:p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-duo-blue/15 text-duo-blue flex items-center justify-center shrink-0">
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
            className={`px-4 py-1.5 rounded-xl font-black text-xs transition active:scale-95 ${
              soundEnabled
                ? 'bg-duo-green text-white shadow-duo-green'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {soundEnabled ? 'AKTIF' : 'MATI'}
          </button>
        </div>
      </div>

      {/* Instalasi Aplikasi PWA */}
      <div>
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5">
          Aplikasi Layar HP (PWA)
        </h3>
        <div className="flex items-center justify-between p-3 sm:p-3.5 bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-duo-green text-white flex items-center justify-center shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-800">
                Pasang ke Layar Utama
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                Mainkan langsung tanpa browser & siap offline
              </div>
            </div>
          </div>

          {isInstallable && onInstallPwa ? (
            <button
              onClick={() => {
                soundManager.playPop();
                onInstallPwa();
              }}
              className="px-3.5 py-2 rounded-xl bg-duo-green hover:bg-duo-greenDark text-white font-black text-xs shadow-duo-green flex items-center gap-1.5 shrink-0 active:translate-y-0.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pasang</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-emerald-700 bg-white/70 px-2.5 py-1 rounded-lg">
              ✓ Siap PWA
            </span>
          )}
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
              className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-3 shadow-sm"
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
                  className="px-3 py-2 rounded-xl bg-slate-200 text-slate-600 font-bold text-xs active:scale-95 transition"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          ) : (
            /* Normal Reset Action Buttons */
            <div className="space-y-2.5">
              {/* Parental Bypass: Buka Semua Tingkat Iqro */}
              <button
                onClick={() => triggerResetGate('unlock_all')}
                className={`w-full flex items-center justify-between p-3.5 border-2 rounded-2xl text-left transition group active:scale-[0.99] shadow-sm ${
                  unlockedAllLevels
                    ? 'bg-emerald-50/80 border-emerald-300 hover:bg-emerald-100/60'
                    : 'bg-white hover:bg-purple-50 border-purple-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      unlockedAllLevels
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-purple-100 text-duo-purple'
                    }`}
                  >
                    {unlockedAllLevels ? (
                      <Unlock className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                      <span>Buka Semua Tingkat Iqro</span>
                      {unlockedAllLevels ? (
                        <span className="text-[10px] font-black bg-duo-green text-white px-2 py-0.5 rounded-full">
                          Aktif
                        </span>
                      ) : (
                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                          Standar
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      {unlockedAllLevels
                        ? 'Semua buku & stage terbuka bebas tanpa harus wisuda bertahap'
                        : 'Buka Iqro 2, 3, dst tanpa perlu menyelesaikan Iqro 1 dahulu'}
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => triggerResetGate('level')}
                className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-orange-50 border-2 border-orange-200 rounded-2xl text-left transition group active:scale-[0.99] shadow-sm"
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
                className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-red-50 border-2 border-red-200 rounded-2xl text-left transition group active:scale-[0.99] shadow-sm"
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
  );

  // MOBILE VIEW: Vaul Bottom Sheet Drawer
  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] max-h-[88dvh] fixed bottom-0 left-0 right-0 z-50 outline-none border-t-4 border-slate-100 shadow-2xl">
            {/* Grab Handle Pill for intuitive swipe-down gesture */}
            <div className="pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b-2 border-slate-100 shrink-0">
              <div className="flex items-center gap-2 text-slate-800">
                <Settings className="w-5 h-5 text-duo-green" />
                <Drawer.Title className="text-base font-black">Pengaturan & Data</Drawer.Title>
              </div>
              <button
                onClick={() => {
                  soundManager.playPop();
                  onClose();
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 active:scale-95 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Scrollable Body with Sleek Momentum Touch Scroll & No Ugly Scrollbars */}
            <div className="p-4 overflow-y-auto no-scrollbar pb-10 overscroll-contain">
              {modalContent}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  // DESKTOP & TABLET VIEW: Centered Modal Dialog
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-slate-100 flex flex-col overflow-hidden max-h-[88dvh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b-2 border-slate-100 shrink-0">
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

        {/* Scrollable Content with sleek scrolling */}
        <div className="p-5 sm:p-6 overflow-y-auto no-scrollbar">
          {modalContent}
        </div>
      </motion.div>
    </div>
  );
};
