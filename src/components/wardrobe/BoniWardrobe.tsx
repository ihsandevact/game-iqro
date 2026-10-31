import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gem, Check, Sparkles, ShoppingBag } from 'lucide-react';
import { CostumeCategory, CostumeItem } from '../../core/types/gameTypes';
import { COSTUME_ITEMS } from '../../games/iqro/data/costumeData';
import { BoniMascot } from '../mascot/BoniMascot';
import { soundManager } from '../../core/audio/soundManager';
import { ttsNarrator } from '../../core/audio/ttsNarrator';

interface BoniWardrobeProps {
  gemsTotal: number;
  unlockedItems: string[];
  equippedHat: string;
  equippedGlasses: string;
  equippedCape: string;
  onBuyItem: (item: CostumeItem) => boolean;
  onEquipItem: (category: CostumeCategory, itemId: string) => void;
  childName?: string;
}

export const BoniWardrobe: React.FC<BoniWardrobeProps> = ({
  gemsTotal,
  unlockedItems,
  equippedHat,
  equippedGlasses,
  equippedCape,
  onBuyItem,
  onEquipItem,
  childName = 'Faqih',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CostumeCategory>('hat');

  const filteredItems = COSTUME_ITEMS.filter((item) => item.category === selectedCategory);

  const handleAction = (item: CostumeItem) => {
    const isUnlocked = unlockedItems.includes(item.id);

    if (isUnlocked) {
      onEquipItem(item.category, item.id);
      ttsNarrator.speak(`${childName} memakai ${item.name}! Keren sekali!`);
    } else {
      if (gemsTotal >= item.price) {
        const success = onBuyItem(item);
        if (success) {
          ttsNarrator.speak(`Hore! ${item.name} berhasil dibeli!`);
        }
      } else {
        soundManager.playGentleWrong();
        ttsNarrator.speak('Permata belum cukup, ayo belajar lagi untuk mengumpulkan permata!');
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-6 lg:p-7 shadow-sm flex flex-col gap-6">
      {/* Top: Mascot Wardrobe Preview Hero Banner (Tampilan Vertikal Responsif) */}
      <div className="w-full bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Decorative sparkles */}
        <div className="absolute top-3 left-3 text-emerald-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        {/* Left: Mascot Showcase with Speech Bubble */}
        <div className="flex items-center justify-center shrink-0">
          <BoniMascot
            mood="happy"
            size="md"
            characterName={childName}
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedCape={equippedCape}
            showSpeechBubble={true}
            speechText={`Bagaimana penampilanku sekarang, ${childName}?`}
          />
        </div>

        {/* Center: Title & Description */}
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Koleksi & Lemari Pakaian</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Koleksi Kostum {childName}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 max-w-lg leading-relaxed">
            Kumpulkan permata dari belajar Iqro dan dandani {childName} dengan peci, kacamata, dan jubah santri terfavorit!
          </p>
        </div>

        {/* Right: Gems Wallet Pill */}
        <div className="shrink-0 flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border-2 border-blue-200 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Gem className="w-6 h-6 fill-duo-blue text-duo-blue" />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Permata Kamu</div>
            <div className="text-lg font-black text-duo-blue leading-tight">{gemsTotal} Permata</div>
          </div>
        </div>
      </div>

      {/* Bottom: Store Header, Category Tabs & Item Grid (Vertical Downward Layout) */}
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-slate-100">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-duo-green" />
            <h2 className="text-lg sm:text-xl font-black text-slate-800">
              Toko Pakaian & Aksesoris
            </h2>
          </div>
          <div className="text-xs font-bold text-slate-400">
            {filteredItems.length} Pilihan Aksesoris
          </div>
        </div>

        {/* Category Tabs: Grid 3 Kolom Responsif */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 w-full max-w-md sm:max-w-lg">
          <button
            onClick={() => {
              soundManager.playPop();
              setSelectedCategory('hat');
            }}
            className={`py-2.5 px-3 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition text-center whitespace-nowrap active:scale-95 ${
              selectedCategory === 'hat'
                ? 'bg-duo-green text-white shadow-duo-green'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎩 Peci & Topi
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setSelectedCategory('glasses');
            }}
            className={`py-2.5 px-3 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition text-center whitespace-nowrap active:scale-95 ${
              selectedCategory === 'glasses'
                ? 'bg-duo-blue text-white shadow-duo-blue'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            👓 Kacamata
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setSelectedCategory('cape');
            }}
            className={`py-2.5 px-3 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition text-center whitespace-nowrap active:scale-95 ${
              selectedCategory === 'cape'
                ? 'bg-duo-purple text-white shadow-duo-purple'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🦸 Jubah
          </button>
        </div>

        {/* Items Grid: Card Vertikal 3D Rapih & Luas (Desktop 4 Kolom, Mobile 2 Kolom) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
          {filteredItems.map((item) => {
            const isUnlocked = unlockedItems.includes(item.id);
            const isEquipped =
              equippedHat === item.id ||
              equippedGlasses === item.id ||
              equippedCape === item.id;
            const canAfford = gemsTotal >= item.price;

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className={`
                  p-4 sm:p-5 rounded-3xl border-2 flex flex-col justify-between transition relative
                  ${
                    isEquipped
                      ? 'bg-emerald-50/70 border-duo-green shadow-sm ring-2 ring-duo-green/20'
                      : isUnlocked
                      ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      : 'bg-slate-50/80 border-slate-200 shadow-sm'
                  }
                `}
              >
                {/* Equipped Badge */}
                {isEquipped && (
                  <div className="absolute top-3 right-3 bg-duo-green text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Aktif</span>
                  </div>
                )}

                {/* Big Centered Icon Preview */}
                <div className="w-18 h-18 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-3xl sm:text-4xl shadow-inner mt-1 mb-3">
                  {item.icon}
                </div>

                {/* Name & Description */}
                <div className="text-center mb-4">
                  <h4 className="font-black text-sm sm:text-base text-slate-800 mb-1 leading-snug line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed px-1 line-clamp-2 min-h-[2.25rem]">
                    {item.description}
                  </p>
                </div>

                {/* Action Button: Full-width Chunky 3D Button */}
                <button
                  onClick={() => handleAction(item)}
                  disabled={!isUnlocked && !canAfford}
                  className={`
                    w-full py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition active:translate-y-0.5 flex items-center justify-center gap-2
                    ${
                      isEquipped
                        ? 'bg-slate-200 text-slate-600 border border-slate-300 cursor-default'
                        : isUnlocked
                        ? 'bg-duo-green hover:bg-duo-greenDark text-white shadow-duo-green'
                        : canAfford
                        ? 'bg-duo-blue hover:bg-duo-blueDark text-white shadow-duo-blue'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isEquipped ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Dipakai</span>
                    </>
                  ) : isUnlocked ? (
                    <span>Pakai</span>
                  ) : (
                    <>
                      <Gem className="w-4 h-4 fill-white" />
                      <span>{item.price} Beli</span>
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
