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
    <div className="w-full bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-6 lg:p-7 shadow-sm flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-start">
      {/* Left: Mascot Wardrobe Preview Stage */}
      <div className="w-full lg:w-72 flex flex-col items-center bg-gradient-to-b from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-5 sm:p-6 shrink-0 relative overflow-hidden shadow-sm">
        {/* Decorative sparkles */}
        <div className="absolute top-3 left-3 text-emerald-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        <div className="my-2">
          <BoniMascot
            mood="happy"
            size="lg"
            characterName={childName}
            equippedHat={equippedHat}
            equippedGlasses={equippedGlasses}
            equippedCape={equippedCape}
            showSpeechBubble={true}
            speechText={`Bagaimana penampilanku sekarang, ${childName}?`}
          />
        </div>

        <h3 className="text-base font-black text-slate-800 mt-2">Koleksi {childName}</h3>
        <p className="text-xs font-semibold text-slate-500 text-center mt-0.5">
          Dandani {childName} dengan pakaian favoritmu!
        </p>

        {/* Gems Wallet Pill */}
        <div className="mt-4 flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border-2 border-blue-200 shadow-sm">
          <Gem className="w-5 h-5 fill-duo-blue text-duo-blue" />
          <div className="text-left">
            <div className="text-[10px] font-black uppercase text-slate-400">Permata Kamu</div>
            <div className="text-base font-black text-duo-blue">{gemsTotal} Permata</div>
          </div>
        </div>
      </div>

      {/* Right: Category Tabs & Item Grid */}
      <div className="flex-1 w-full min-w-0">
        <div className="flex items-center justify-between gap-2 mb-4 border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-duo-green" />
            <h2 className="text-lg sm:text-xl font-black text-slate-800">
              Toko Pakaian & Aksesoris
            </h2>
          </div>
        </div>

        {/* Category Tabs: Grid 3 Kolom Responsif (Bebas Scrollbar) */}
        <div className="grid grid-cols-3 gap-2 mb-5 w-full">
          <button
            onClick={() => {
              soundManager.playPop();
              setSelectedCategory('hat');
            }}
            className={`py-2.5 px-2 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition text-center whitespace-nowrap active:scale-95 ${
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
            className={`py-2.5 px-2 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition text-center whitespace-nowrap active:scale-95 ${
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
            className={`py-2.5 px-2 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition text-center whitespace-nowrap active:scale-95 ${
              selectedCategory === 'cape'
                ? 'bg-duo-purple text-white shadow-duo-purple'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🦸 Jubah
          </button>
        </div>

        {/* Items Grid: Card Vertikal 3D Rapih */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
                  p-4 rounded-3xl border-2 flex flex-col justify-between transition relative
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
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-3xl shadow-inner mt-1 mb-3">
                  {item.icon}
                </div>

                {/* Name & Description */}
                <div className="text-center mb-4">
                  <h4 className="font-black text-sm sm:text-base text-slate-800 mb-1 leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed px-1">
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
