import React, { useState } from 'react';
import { BookOpen, Compass, Award, Heart, ShoppingBag } from 'lucide-react';
import { BoniMascot } from '../mascot/BoniMascot';
import { BoniWardrobe } from '../wardrobe/BoniWardrobe';
import { HIJAIYAH_LIST } from '../../games/iqro/data/hijaiyahData';
import { soundManager } from '../../core/audio/soundManager';
import { ttsNarrator } from '../../core/audio/ttsNarrator';
import { CostumeItem, CostumeCategory } from '../../core/types/gameTypes';

interface AppLayoutProps {
  children: React.ReactNode;
  gemsTotal: number;
  unlockedItems: string[];
  equippedHat: string;
  equippedGlasses: string;
  equippedCape: string;
  onBuyItem: (item: CostumeItem) => boolean;
  onEquipItem: (category: CostumeCategory, itemId: string) => void;
  childName?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  gemsTotal,
  unlockedItems,
  equippedHat,
  equippedGlasses,
  equippedCape,
  onBuyItem,
  onEquipItem,
  childName = 'Faqih',
}) => {
  const [activeTab, setActiveTab] = useState<'journey' | 'wardrobe' | 'dictionary' | 'rewards'>('journey');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const handlePlayLetter = (latin: string, letter: string) => {
    soundManager.playPop();
    setSelectedLetter(letter);
    const played = ttsNarrator.playLetter(letter, () => setSelectedLetter(null));
    if (!played) {
      ttsNarrator.playLetter(latin, () => setSelectedLetter(null));
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F4F9F4] text-slate-800">
      {/* 2-Column Responsive Desktop Container (Unified with Navbar max-w-6xl) */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 flex flex-row relative">
        {/* Left Sidebar (Desktop Only >= 1024px) */}
        <aside className="hidden lg:flex flex-col justify-between w-64 p-4 border-r-2 border-slate-200 sticky top-14 h-[calc(100dvh-3.5rem)] shrink-0 overflow-y-auto no-scrollbar">
          <div className="space-y-2.5">
            <button
              onClick={() => {
                soundManager.playPop();
                setActiveTab('journey');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap transition active:scale-[0.98] ${
                activeTab === 'journey'
                  ? 'bg-duo-green/15 text-duo-greenDark border-2 border-duo-green shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 border-2 border-transparent'
              }`}
            >
              <Compass className={`w-5 h-5 shrink-0 ${activeTab === 'journey' ? 'text-duo-green' : 'text-slate-400'}`} />
              <span className="truncate">Petualangan</span>
            </button>

            <button
              onClick={() => {
                soundManager.playPop();
                setActiveTab('wardrobe');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap transition active:scale-[0.98] ${
                activeTab === 'wardrobe'
                  ? 'bg-duo-purple/15 text-duo-purpleDark border-2 border-duo-purple shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 border-2 border-transparent'
              }`}
            >
              <ShoppingBag className={`w-5 h-5 shrink-0 ${activeTab === 'wardrobe' ? 'text-duo-purple' : 'text-slate-400'}`} />
              <span className="truncate">Toko Kostum</span>
            </button>

            <button
              onClick={() => {
                soundManager.playPop();
                setActiveTab('dictionary');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap transition active:scale-[0.98] ${
                activeTab === 'dictionary'
                  ? 'bg-duo-blue/15 text-duo-blueDark border-2 border-duo-blue shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 border-2 border-transparent'
              }`}
            >
              <BookOpen className={`w-5 h-5 shrink-0 ${activeTab === 'dictionary' ? 'text-duo-blue' : 'text-slate-400'}`} />
              <span className="truncate">Kamus Hijaiyah</span>
            </button>

            <button
              onClick={() => {
                soundManager.playPop();
                setActiveTab('rewards');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap transition active:scale-[0.98] ${
                activeTab === 'rewards'
                  ? 'bg-amber-100 text-amber-700 border-2 border-amber-400 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 border-2 border-transparent'
              }`}
            >
              <Award className={`w-5 h-5 shrink-0 ${activeTab === 'rewards' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="truncate">Piala Prestasi</span>
            </button>
          </div>

          {/* Left Sidebar Mascot & Encouragement Badge */}
          <div className="space-y-2.5">
            <div className="flex flex-col items-center p-3 bg-white border-2 border-slate-200 rounded-3xl shadow-sm text-center">
              <BoniMascot
                mood="idle"
                size="sm"
                characterName={childName}
                equippedHat={equippedHat}
                equippedGlasses={equippedGlasses}
                equippedCape={equippedCape}
                showSpeechBubble={true}
                speechText={`Halo ${childName}! Ayo belajar Iqro!`}
              />
              <span className="text-xs font-black text-slate-700 mt-1">{childName} Sahabat Cilik</span>
            </div>

            <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-[11px] font-bold shadow-sm">
              <Heart className="w-3.5 h-3.5 text-duo-red fill-duo-red shrink-0" />
              <span>Belajar ceria tanpa rasa takut salah!</span>
            </div>
          </div>
        </aside>

        {/* Center Main Stage - Unified & Consistent Across All Tabs */}
        <main className="flex-1 w-full min-w-0 px-2 sm:px-6 py-4 flex flex-col items-center">
          {activeTab === 'journey' && (
            <div className="w-full max-w-lg mx-auto flex flex-col items-center">
              {children}
            </div>
          )}

          {/* Tab: Toko Kostum */}
          {activeTab === 'wardrobe' && (
            <div className="w-full">
              <BoniWardrobe
                gemsTotal={gemsTotal}
                unlockedItems={unlockedItems}
                equippedHat={equippedHat}
                equippedGlasses={equippedGlasses}
                equippedCape={equippedCape}
                onBuyItem={onBuyItem}
                onEquipItem={onEquipItem}
                childName={childName}
              />
            </div>
          )}

          {/* Tab: Kamus Huruf Hijaiyah Interaktif */}
          {activeTab === 'dictionary' && (
            <div className="w-full bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-6 shadow-sm">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                  Kamus 28 Huruf Hijaiyah
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-500">
                  Ketuk kartu huruf untuk mendengarkan pengucapan makhraj yang benar!
                </p>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                {HIJAIYAH_LIST.map((item) => (
                  <button
                    key={item.latin}
                    onClick={() => handlePlayLetter(item.latin, item.letter)}
                    className={`
                      aspect-square rounded-2xl p-1.5 flex flex-col items-center justify-between border-2
                      transition-all active:translate-y-1 relative select-none
                      ${
                        selectedLetter === item.letter
                          ? 'bg-duo-green text-white border-emerald-400 shadow-[0_4px_0_#46A302]'
                          : 'bg-white hover:bg-emerald-50/50 text-slate-800 border-slate-200 shadow-[0_4px_0_#E2E8F0]'
                      }
                    `}
                  >
                    <div className="flex-1 w-full flex items-center justify-center pt-1">
                      <span className="font-arabic text-2xl sm:text-3xl font-bold leading-normal select-none">
                        {item.letter}
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-80 pb-0.5">
                      {item.latin}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Piala & Prestasi */}
          {activeTab === 'rewards' && (
            <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-slate-200 p-6 text-center shadow-sm">
              <Award className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-bounce" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
                Pencapaian & Piala Juara
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Selesaikan semua level Iqro 1 untuk mendapatkan Sertifikat Wisuda Kelulusan Bintang Emas!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-duo-green text-white flex items-center justify-center font-black">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-800">Langkah Pertama</div>
                    <div className="text-[11px] font-semibold text-slate-500">Selesaikan Level 1 Iqro 1</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-duo-yellow text-slate-900 flex items-center justify-center font-black">
                    ⭐
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-800">Bintang Kejora</div>
                    <div className="text-[11px] font-semibold text-slate-500">Kumpulkan 15 Bintang Emas</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation for Mobile / Tablet (< 1024px) */}
      <nav className="lg:hidden sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t-2 border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            soundManager.playPop();
            setActiveTab('journey');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl font-black text-xs transition ${
            activeTab === 'journey' ? 'text-duo-green' : 'text-slate-400'
          }`}
        >
          <Compass className="w-6 h-6" />
          <span>Belajar</span>
        </button>

        <button
          onClick={() => {
            soundManager.playPop();
            setActiveTab('wardrobe');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl font-black text-xs transition ${
            activeTab === 'wardrobe' ? 'text-duo-purple' : 'text-slate-400'
          }`}
        >
          <ShoppingBag className="w-6 h-6" />
          <span>Toko</span>
        </button>

        <button
          onClick={() => {
            soundManager.playPop();
            setActiveTab('dictionary');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl font-black text-xs transition ${
            activeTab === 'dictionary' ? 'text-duo-blue' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-6 h-6" />
          <span>Kamus</span>
        </button>

        <button
          onClick={() => {
            soundManager.playPop();
            setActiveTab('rewards');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl font-black text-xs transition ${
            activeTab === 'rewards' ? 'text-amber-500' : 'text-slate-400'
          }`}
        >
          <Award className="w-6 h-6" />
          <span>Piala</span>
        </button>
      </nav>
    </div>
  );
};
