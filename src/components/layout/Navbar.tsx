import React, { useState } from 'react';
import { Flame, Gem, Star, Volume2, VolumeX, Maximize2, Minimize2, ChevronDown, BookOpen, Settings } from 'lucide-react';
import { IqroLevelId } from '../../core/types/gameTypes';
import { soundManager } from '../../core/audio/soundManager';

interface NavbarProps {
  currentLevel: IqroLevelId;
  onSelectLevel: (lvl: IqroLevelId) => void;
  stars: number;
  gems: number;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLevel,
  onSelectLevel,
  stars,
  gems,
  streak,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);

  const toggleFullscreen = () => {
    soundManager.playPop();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const levelOptions: { id: IqroLevelId; label: string; color: string }[] = [
    { id: 1, label: 'Iqro 1: Huruf Tunggal', color: 'bg-duo-green' },
    { id: 2, label: 'Iqro 2: Huruf Sambung', color: 'bg-duo-blue' },
    { id: 3, label: 'Iqro 3: Kasrah & Dhammah', color: 'bg-duo-orange' },
    { id: 4, label: 'Iqro 4: Tanwin & Sukun', color: 'bg-duo-purple' },
    { id: 5, label: 'Iqro 5: Tasydid & Waqaf', color: 'bg-pink-500' },
    { id: 6, label: 'Iqro 6: Hukum Tajwid', color: 'bg-amber-500' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-3 md:px-6 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand & Iqro Level Switcher */}
        <div className="relative flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playPop();
              setLevelDropdownOpen(!levelDropdownOpen);
            }}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 active:scale-95 px-3 py-1.5 rounded-2xl border-2 border-slate-300 font-extrabold text-slate-800 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-duo-green flex items-center justify-center text-white font-black text-sm shadow-sm">
              {currentLevel}
            </div>
            <span className="text-sm md:text-base font-black tracking-wide hidden sm:inline">
              Iqro {currentLevel}
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${levelDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Level Dropdown Menu */}
          {levelDropdownOpen && (
            <div className="absolute top-12 left-0 w-64 bg-white border-2 border-slate-200 rounded-2xl shadow-xl py-2 z-50">
              <div className="px-3 py-1.5 text-xs font-black text-slate-400 uppercase tracking-wider">
                Pilih Tingkat Iqro
              </div>
              {levelOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    soundManager.playPop();
                    onSelectLevel(opt.id);
                    setLevelDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 transition ${
                    currentLevel === opt.id ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md ${opt.color} text-white flex items-center justify-center text-xs font-black`}>
                    {opt.id}
                  </div>
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Title on Tablet / Desktop */}
        <div className="hidden lg:flex items-center gap-2 text-slate-700 font-extrabold text-lg">
          <BookOpen className="w-5 h-5 text-duo-green" />
          <span>Petualangan Iqro Ceria</span>
        </div>

        {/* Right: Gamification Badges & Utility Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak Flame */}
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full font-black text-xs sm:text-sm text-duo-orange">
            <Flame className="w-4 h-4 fill-duo-orange text-duo-orange animate-bounce" />
            <span>{streak}</span>
          </div>

          {/* Gems Counter */}
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full font-black text-xs sm:text-sm text-duo-blue">
            <Gem className="w-4 h-4 fill-duo-blue text-duo-blue" />
            <span>{gems}</span>
          </div>

          {/* Stars Total */}
          <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-full font-black text-xs sm:text-sm text-amber-600">
            <Star className="w-4 h-4 fill-duo-yellow text-amber-500" />
            <span>{stars}</span>
          </div>

          {/* Audio Mute/Unmute Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onToggleSound();
            }}
            title={soundEnabled ? 'Matikan Suara' : 'Hidupkan Suara'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-90 border border-slate-300 text-slate-600 transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-500" />}
          </button>

          {/* Settings & Reset Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onOpenSettings();
            }}
            title="Pengaturan & Reset"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-90 border border-slate-300 text-slate-600 transition"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Fullscreen Button (Poki Style) */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-90 border border-slate-300 text-slate-600 transition hidden sm:inline-flex"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
