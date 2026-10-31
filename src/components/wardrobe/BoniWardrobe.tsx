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
    <div className="w-full bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">
      {/* Left: Mascot Wardrobe Preview Stage */}
      <div className="w-full md:w-64 flex flex-col items-center bg-gradient-to-b from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-4 sm:p-6 shrink-0 relative overflow-hidden">
        {/* Decorative sparkles */}
        <div className="absolute top-3 left-3 text-emerald-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        <div className="mb-2">
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
        <p className="text-xs font-semibold text-slate-500 text-center">
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
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between gap-2 mb-4 border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-duo-green" />
            <h2 className="text-lg sm:text-xl font-black text-slate-800">
              Toko Pakaian & Aksesoris
            </h2>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          <button
            onClick={() => {
              soundManager.playPop();
              setSelectedCategory('hat');
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition shrink-0 ${
              selectedCategory === 'hat'
                ? 'bg-duo-green text-white shadow-duo-green'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎩 Peci & Mahkota
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setSelectedCategory('glasses');
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition shrink-0 ${
              selectedCategory === 'glasses'
                ? 'bg-duo-blue text-white shadow-duo-blue'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            👓 Kacamata Gaul
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setSelectedCategory('cape');
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition shrink-0 ${
              selectedCategory === 'cape'
                ? 'bg-duo-purple text-white shadow-duo-purple'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🦸 Jubah Terbang
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  p-3.5 rounded-2xl border-2 flex flex-col justify-between transition relative
                  ${
                    isEquipped
                      ? 'bg-emerald-50/70 border-duo-green shadow-sm'
                      : isUnlocked
                      ? 'bg-white border-slate-200 hover:border-slate-300'
                      : 'bg-slate-50 border-slate-200'
                  }
                `}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-800">{item.name}</h4>
                    <p className="text-[11px] font-semibold text-slate-500 leading-tight">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-slate-100">
                  {/* Price or Owned status */}
                  {isUnlocked ? (
                    <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Dimiliki
                    </span>
                  ) : (
                    <div className="flex items-center gap-1 font-black text-sm text-duo-blue">
                      <Gem className="w-4 h-4 fill-duo-blue" />
                      <span>{item.price}</span>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleAction(item)}
                    disabled={!isUnlocked && !canAfford}
                    className={`
                      px-4 py-2 rounded-xl font-black text-xs transition active:translate-y-0.5
                      ${
                        isEquipped
                          ? 'bg-slate-200 text-slate-600 cursor-default'
                          : isUnlocked
                          ? 'bg-duo-green hover:bg-duo-greenDark text-white shadow-duo-green'
                          : canAfford
                          ? 'bg-duo-blue hover:bg-duo-blueDark text-white shadow-duo-blue'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {isEquipped
                      ? 'Dipakai'
                      : isUnlocked
                      ? 'Pakai'
                      : canAfford
                      ? 'Beli'
                      : 'Permata Kurang'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
