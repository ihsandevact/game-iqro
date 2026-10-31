import React from 'react';
import { motion } from 'framer-motion';
import { X, Share, PlusSquare, Smartphone } from 'lucide-react';
import { soundManager } from '../../core/audio/soundManager';

interface IosInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IosInstallModal: React.FC<IosInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border-4 border-emerald-200 p-5 flex flex-col items-center text-center relative"
      >
        <button
          onClick={() => {
            soundManager.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-duo-green/15 text-duo-green flex items-center justify-center mb-3">
          <Smartphone className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-black text-slate-800 mb-1">
          Pasang di Layar iPhone / iPad
        </h3>
        <p className="text-xs text-slate-500 mb-5 font-semibold">
          Ikuti 2 langkah mudah ini di browser Safari:
        </p>

        <div className="w-full space-y-3 text-left mb-6">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Share className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-black text-slate-800">1. Ketuk tombol Bagikan</span>
              <p className="text-slate-500 text-[11px]">Ikon kotak dengan panah ke atas di bilah Safari.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-duo-green flex items-center justify-center shrink-0">
              <PlusSquare className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-black text-slate-800">2. Pilih "Tambah ke Layar Utama"</span>
              <p className="text-slate-500 text-[11px]">Gulir sedikit ke bawah dan ketuk tombol Tambah.</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playPop();
            onClose();
          }}
          className="w-full py-3 bg-duo-green hover:bg-duo-greenDark text-white font-black text-sm rounded-2xl shadow-duo-green transition"
        >
          Mengerti, Terima Kasih!
        </button>
      </motion.div>
    </div>
  );
};
