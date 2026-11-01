import React, { useState } from 'react';
import { Flame, Gem, ChevronDown, BookOpen, Settings, Lock, Mic } from 'lucide-react';
import { IqroLevelId } from '../../core/types/gameTypes';
import { soundManager } from '../../core/audio/soundManager';

interface NavbarProps {
  currentLevel: IqroLevelId;
  onSelectLevel: (lvl: IqroLevelId) => void;
  isBookUnlocked?: (lvl: IqroLevelId) => boolean;
  gems: number;
  streak: number;
  onOpenSettings: () => void;
  onOpenStudio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLevel,
  onSelectLevel,
  isBookUnlocked,
  gems,
  streak,
  onOpenSettings,
  onOpenStudio,
}) => {
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);

  const levelOptions: { id: IqroLevelId; label: string; color: string }[] = [
    { id: 1, label: 'Iqro 1: Huruf Tunggal', color: 'bg-duo-green' },
    { id: 2, label: 'Iqro 2: Huruf Sambung', color: 'bg-duo-blue' },
    { id: 3, label: 'Iqro 3: Kasrah & Dhammah', color: 'bg-duo-orange' },
    { id: 4, label: 'Iqro 4: Tanwin & Sukun', color: 'bg-duo-purple' },
    { id: 5, label: 'Iqro 5: Tasydid & Waqaf', color: 'bg-pink-500' },
    { id: 6, label: 'Iqro 6: Hukum Tajwid', color: 'bg-amber-500' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b-2 border-slate-200 py-2.5 transition-all select-none">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Level Switcher */}
        <div className="relative flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              soundManager.playPop();
              setLevelDropdownOpen(!levelDropdownOpen);
            }}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 active:scale-95 px-3 py-1.5 rounded-2xl border-2 border-slate-200 font-extrabold text-slate-800 transition"
          >
            <div className="w-7 h-7 rounded-xl bg-duo-green flex items-center justify-center text-white font-black text-sm shadow-sm">
              {currentLevel}
            </div>
            <span className="text-sm font-black tracking-wide hidden sm:inline">
              Iqro {currentLevel}
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${levelDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Level Dropdown Menu */}
          {levelDropdownOpen && (
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
                    onClick={() => {
                      if (!isUnlocked) {
                        soundManager.playGentleWrong();
                        return;
                      }
                      soundManager.playPop();
                      onSelectLevel(opt.id);
                      setLevelDropdownOpen(false);
                    }}
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

          {/* Studio Rekaman Qari Button */}
          {onOpenStudio && (
            <button
              onClick={() => {
                soundManager.playPop();
                onOpenStudio();
              }}
              title="Studio Rekaman Qari (Iqro 1–6)"
              className="p-2 sm:p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 active:scale-90 border-2 border-emerald-300 text-emerald-600 transition shadow-sm"
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 animate-pulse" />
            </button>
          )}

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
