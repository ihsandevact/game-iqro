import React, { useState, useRef, useEffect } from 'react';
import { Drawer } from 'vaul';
import { Flame, Gem, ChevronDown, BookOpen, Settings, Lock, X, Check } from 'lucide-react';
import { IqroLevelId } from '../../core/types/gameTypes';
import { soundManager } from '../../core/audio/soundManager';
import { useIsMobile } from '../../core/hooks/useIsMobile';

interface NavbarProps {
  currentLevel: IqroLevelId;
  onSelectLevel: (lvl: IqroLevelId) => void;
  isBookUnlocked?: (lvl: IqroLevelId) => boolean;
  gems: number;
  streak: number;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLevel,
  onSelectLevel,
  isBookUnlocked,
  gems,
  streak,
  onOpenSettings,
}) => {
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile(768);

  const levelOptions: { id: IqroLevelId; label: string; color: string }[] = [
    { id: 1, label: 'Iqro 1: Huruf Tunggal', color: 'bg-duo-green' },
    { id: 2, label: 'Iqro 2: Huruf Sambung', color: 'bg-duo-blue' },
    { id: 3, label: 'Iqro 3: Kasrah & Dhammah', color: 'bg-duo-orange' },
    { id: 4, label: 'Iqro 4: Tanwin & Sukun', color: 'bg-duo-purple' },
    { id: 5, label: 'Iqro 5: Tasydid & Waqaf', color: 'bg-pink-500' },
    { id: 6, label: 'Iqro 6: Hukum Tajwid', color: 'bg-amber-500' },
  ];

  // Tutup popup dropdown di Desktop/Tablet ketika klik area luar atau tekan Escape
  useEffect(() => {
    if (!levelDropdownOpen || isMobile) return;

    const handlePointerDownOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLevelDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLevelDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [levelDropdownOpen, isMobile]);

  const handleChooseLevel = (optId: IqroLevelId, isUnlocked: boolean) => {
    if (!isUnlocked) {
      soundManager.playGentleWrong();
      return;
    }
    soundManager.playPop();
    onSelectLevel(optId);
    setLevelDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b-2 border-slate-200 py-2.5 transition-all select-none">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Level Switcher */}
        <div ref={dropdownRef} className="relative flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              soundManager.playPop();
              setLevelDropdownOpen((prev) => !prev);
            }}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 active:scale-95 px-3 py-1.5 rounded-2xl border-2 border-slate-200 font-extrabold text-slate-800 transition"
          >
            <div className="w-7 h-7 rounded-xl bg-duo-green flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
              {currentLevel}
            </div>
            <span className="text-xs sm:text-sm font-black tracking-wide whitespace-nowrap">
              Iqro {currentLevel}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${
                levelDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Desktop/Tablet Level Dropdown Menu */}
          {levelDropdownOpen && !isMobile && (
            <div className="absolute top-12 left-0 w-64 bg-white border-2 border-slate-200 rounded-3xl shadow-2xl py-2 z-50 overflow-hidden">
              <div className="px-3.5 py-1.5 text-xs font-black text-slate-400 uppercase tracking-wider">
                Pilih Tingkat Iqro
              </div>
              {levelOptions.map((opt) => {
                const isUnlocked = isBookUnlocked ? isBookUnlocked(opt.id) : opt.id === 1;
                const isCurrent = currentLevel === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleChooseLevel(opt.id, isUnlocked)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left transition ${
                      isCurrent
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : isUnlocked
                        ? 'text-slate-700 hover:bg-slate-50'
                        : 'text-slate-400 bg-slate-50/60 cursor-not-allowed opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg ${
                          isUnlocked ? opt.color : 'bg-slate-300'
                        } text-white flex items-center justify-center text-xs font-black shadow-xs`}
                      >
                        {opt.id}
                      </div>
                      <span className="text-xs font-bold">{opt.label}</span>
                    </div>

                    {!isUnlocked && (
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Vaul Bottom Sheet for Level Selection */}
        {isMobile && (
          <Drawer.Root open={levelDropdownOpen} onOpenChange={setLevelDropdownOpen}>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" />
              <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] max-h-[85dvh] fixed bottom-0 left-0 right-0 z-50 outline-none border-t-4 border-slate-100 shadow-2xl">
                {/* Grab Handle Pill */}
                <div className="pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
                  <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-5 py-3 flex items-center justify-between border-b-2 border-slate-100 shrink-0">
                  <div className="flex items-center gap-2 text-slate-800">
                    <BookOpen className="w-5 h-5 text-duo-green" />
                    <Drawer.Title className="text-base font-black">
                      Pilih Tingkat Iqro
                    </Drawer.Title>
                  </div>
                  <button
                    onClick={() => {
                      soundManager.playPop();
                      setLevelDropdownOpen(false);
                    }}
                    className="p-1.5 rounded-xl hover:bg-slate-100 active:scale-95 text-slate-400 hover:text-slate-600 transition"
                  >
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Options List */}
                <div className="p-4 space-y-2.5 overflow-y-auto no-scrollbar pb-8 overscroll-contain">
                  {levelOptions.map((opt) => {
                    const isUnlocked = isBookUnlocked ? isBookUnlocked(opt.id) : opt.id === 1;
                    const isCurrent = currentLevel === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleChooseLevel(opt.id, isUnlocked)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 text-left transition active:scale-[0.99] ${
                          isCurrent
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-black shadow-sm'
                            : isUnlocked
                            ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 font-bold'
                            : 'bg-slate-50/80 border-slate-200/70 text-slate-400 cursor-not-allowed opacity-75 font-bold'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-8 h-8 rounded-xl ${
                              isUnlocked ? opt.color : 'bg-slate-300'
                            } text-white flex items-center justify-center text-sm font-black shadow-sm shrink-0`}
                          >
                            {opt.id}
                          </div>
                          <span className="text-sm">{opt.label}</span>
                        </div>

                        {isCurrent ? (
                          <div className="w-6 h-6 rounded-full bg-duo-green text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : !isUnlocked ? (
                          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        )}

        {/* Center: Title on Tablet / Desktop */}
        <div className="hidden md:flex items-center gap-2 text-slate-700 font-extrabold text-base lg:text-lg">
          <BookOpen className="w-5 h-5 text-duo-green" />
          <span>Petualangan Iqro Ceria</span>
        </div>

        {/* Right: Gamification Badges & Clean Settings Gear */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Daily Streak Flame */}
          <div className="flex items-center gap-1.5 bg-orange-50 border-2 border-orange-200/80 px-2.5 sm:px-3 py-1 rounded-full font-black text-xs sm:text-sm text-duo-orange shadow-sm">
            <Flame className="w-4 h-4 fill-duo-orange text-duo-orange animate-bounce" />
            <span>{streak}</span>
          </div>

          {/* Gems Counter */}
          <div className="flex items-center gap-1.5 bg-blue-50 border-2 border-blue-200/80 px-2.5 sm:px-3 py-1 rounded-full font-black text-xs sm:text-sm text-duo-blue shadow-sm">
            <Gem className="w-4 h-4 fill-duo-blue text-duo-blue" />
            <span>{gems}</span>
          </div>

          {/* Settings & Controls Gear Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onOpenSettings();
            }}
            title="Pengaturan & Info"
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-90 border-2 border-slate-200 text-slate-600 transition shadow-sm"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
