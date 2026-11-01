import { getAllCachedAudioForName } from './customAudioCache';
import { getAllStudioRecordings, isStudioVoiceEnabled } from './qariStudioCache';

// Authentic Studio Makhraj Audio & Indonesian Child-Friendly Narrator Engine

export const LETTER_AUDIO_MAP: Record<string, string> = {
  // Alif / A (Fathah murni: "A")
  'alif': '/audio/letters/alif.mp3',
  'a': '/audio/letters/a.mp3',
  'ا': '/audio/letters/a.mp3',
  'اَ': '/audio/letters/a.mp3',
  'أ': '/audio/letters/a.mp3',
  'أَ': '/audio/letters/a.mp3',

  // Ba (Fathah: "Ba")
  'ba': '/audio/letters/ba.mp3',
  'ب': '/audio/letters/ba.mp3',
  'بَ': '/audio/letters/ba.mp3',

  // Ta (Fathah: "Ta")
  'ta': '/audio/letters/ta.mp3',
  'ت': '/audio/letters/ta.mp3',
  'تَ': '/audio/letters/ta.mp3',

  // Tsa / Tha (Fathah: "Tsa")
  'tsa': '/audio/letters/tsa.mp3',
  'tha': '/audio/letters/tsa.mp3',
  'ث': '/audio/letters/tsa.mp3',
  'ثَ': '/audio/letters/tsa.mp3',

  // Jim / Ja (Fathah murni: "Ja")
  'jim': '/audio/letters/jim.mp3',
  'ja': '/audio/letters/ja.mp3',
  'ج': '/audio/letters/ja.mp3',
  'جَ': '/audio/letters/ja.mp3',

  // Ha (halus/pedas)
  'ha': '/audio/letters/ha.mp3',
  'ح': '/audio/letters/ha.mp3',
  'حَ': '/audio/letters/ha.mp3',

  // Kho / Kha
  'kho': '/audio/letters/kho.mp3',
  'kha': '/audio/letters/kho.mp3',
  'خ': '/audio/letters/kho.mp3',
  'خَ': '/audio/letters/kho.mp3',

  // Dal / Da (Fathah murni: "Da")
  'dal': '/audio/letters/dal.mp3',
  'da': '/audio/letters/da.mp3',
  'د': '/audio/letters/da.mp3',
  'دَ': '/audio/letters/da.mp3',

  // Dzal / Dza (Fathah murni: "Dza")
  'dzal': '/audio/letters/dzal.mp3',
  'dza': '/audio/letters/dza.mp3',
  'ذ': '/audio/letters/dza.mp3',
  'ذَ': '/audio/letters/dza.mp3',

  // Ro / Ra
  'ro': '/audio/letters/ro.mp3',
  'ra': '/audio/letters/ro.mp3',
  'ر': '/audio/letters/ro.mp3',
  'رَ': '/audio/letters/ro.mp3',

  // Zai / Za (Fathah murni: "Za")
  'zai': '/audio/letters/zai.mp3',
  'zay': '/audio/letters/zai.mp3',
  'za': '/audio/letters/za.mp3',
  'ز': '/audio/letters/za.mp3',
  'زَ': '/audio/letters/za.mp3',

  // Sin / Sa (Fathah murni: "Sa")
  'sin': '/audio/letters/sin.mp3',
  'sa': '/audio/letters/sa.mp3',
  'س': '/audio/letters/sa.mp3',
  'سَ': '/audio/letters/sa.mp3',

  // Syin / Sya (Fathah murni: "Sya")
  'syin': '/audio/letters/syin.mp3',
  'sya': '/audio/letters/sya.mp3',
  'ش': '/audio/letters/sya.mp3',
  'شَ': '/audio/letters/sya.mp3',

  // Shod / Sho (Fathah murni: "Sho")
  'shod': '/audio/letters/shod.mp3',
  'sho': '/audio/letters/sho.mp3',
  'ص': '/audio/letters/sho.mp3',
  'صَ': '/audio/letters/sho.mp3',

  // Dhod / Dho (Fathah murni: "Dho")
  'dhod': '/audio/letters/dhod.mp3',
  'dho': '/audio/letters/dho.mp3',
  'ض': '/audio/letters/dho.mp3',
  'ضَ': '/audio/letters/dho.mp3',

  // Tho / Tha (tebal)
  'tho': '/audio/letters/tho.mp3',
  'thod': '/audio/letters/tho.mp3',
  'ط': '/audio/letters/tho.mp3',
  'طَ': '/audio/letters/tho.mp3',

  // Zho / Dhzo
  'zho': '/audio/letters/zho.mp3',
  'dhzo': '/audio/letters/zho.mp3',
  'ظ': '/audio/letters/zho.mp3',
  'ظَ': '/audio/letters/zho.mp3',

  // 'Ain / 'A (Fathah murni: "'A")
  'ain': '/audio/letters/ain.mp3',
  "'ain": '/audio/letters/ain.mp3',
  "'a": '/audio/letters/ain_a.mp3',
  '’a': '/audio/letters/ain_a.mp3',
  '`a': '/audio/letters/ain_a.mp3',
  'ain_a': '/audio/letters/ain_a.mp3',
  'ع': '/audio/letters/ain_a.mp3',
  'عَ': '/audio/letters/ain_a.mp3',

  // Ghoin / Gho (Fathah murni: "Gho")
  'ghoin': '/audio/letters/ghoin.mp3',
  'gho': '/audio/letters/gho.mp3',
  'غ': '/audio/letters/gho.mp3',
  'غَ': '/audio/letters/gho.mp3',

  // Fa
  'fa': '/audio/letters/fa.mp3',
  'ف': '/audio/letters/fa.mp3',
  'فَ': '/audio/letters/fa.mp3',

  // Qof / Qo (Fathah murni: "Qo")
  'qof': '/audio/letters/qof.mp3',
  'qo': '/audio/letters/qo.mp3',
  'ق': '/audio/letters/qo.mp3',
  'قَ': '/audio/letters/qo.mp3',

  // Kaf / Ka (Fathah murni: "Ka")
  'kaf': '/audio/letters/kaf.mp3',
  'ka': '/audio/letters/ka.mp3',
  'ك': '/audio/letters/ka.mp3',
  'كَ': '/audio/letters/ka.mp3',

  // Lam / La (Fathah murni: "La")
  'lam': '/audio/letters/lam.mp3',
  'la': '/audio/letters/la.mp3',
  'ل': '/audio/letters/la.mp3',
  'لَ': '/audio/letters/la.mp3',

  // Mim / Ma (Fathah murni: "Ma")
  'mim': '/audio/letters/mim.mp3',
  'ma': '/audio/letters/ma.mp3',
  'م': '/audio/letters/ma.mp3',
  'مَ': '/audio/letters/ma.mp3',

  // Nun / Na (Fathah murni: "Na")
  'nun': '/audio/letters/nun.mp3',
  'na': '/audio/letters/na.mp3',
  'ن': '/audio/letters/na.mp3',
  'نَ': '/audio/letters/na.mp3',

  // Waw / Wa (Fathah murni: "Wa")
  'waw': '/audio/letters/waw.mp3',
  'wau': '/audio/letters/waw.mp3',
  'wa': '/audio/letters/wa.mp3',
  'و': '/audio/letters/wa.mp3',
  'وَ': '/audio/letters/wa.mp3',

  // Ha (besar/pangkal)
  'haa': '/audio/letters/haa.mp3',
  'ha_besar': '/audio/letters/haa.mp3',
  'ه': '/audio/letters/haa.mp3',
  'هَ': '/audio/letters/haa.mp3',

  // Hamzah
  'hamzah': '/audio/letters/hamzah.mp3',
  'ء': '/audio/letters/a.mp3',
  'ءَ': '/audio/letters/a.mp3',

  // Ya
  'ya': '/audio/letters/ya.mp3',
  'ي': '/audio/letters/ya.mp3',
  'يَ': '/audio/letters/ya.mp3',

  // --- MAD ASLI FATHAH (2 HARAKAT PANJANG / ALIF) ---
  'baa': '/audio/letters/baa.mp3',
  'بَا': '/audio/letters/baa.mp3',
  'taa': '/audio/letters/taa.mp3',
  'تَا': '/audio/letters/taa.mp3',
  'tsaa': '/audio/letters/tsaa.mp3',
  'ثَا': '/audio/letters/tsaa.mp3',
  'jaa': '/audio/letters/jaa.mp3',
  'جَا': '/audio/letters/jaa.mp3',
  'haaa': '/audio/letters/haaa.mp3',
  'حَا': '/audio/letters/haaa.mp3',
  'khoo': '/audio/letters/khoo.mp3',
  'خَا': '/audio/letters/khoo.mp3',
  'daa': '/audio/letters/daa.mp3',
  'دَا': '/audio/letters/daa.mp3',
  'dzaa': '/audio/letters/dzaa.mp3',
  'ذَا': '/audio/letters/dzaa.mp3',
  'roo': '/audio/letters/roo.mp3',
  'raa': '/audio/letters/roo.mp3',
  'رَا': '/audio/letters/roo.mp3',
  'zaa': '/audio/letters/zaa.mp3',
  'زَا': '/audio/letters/zaa.mp3',
  'saa': '/audio/letters/saa.mp3',
  'سَا': '/audio/letters/saa.mp3',
  'syaa': '/audio/letters/syaa.mp3',
  'شَا': '/audio/letters/syaa.mp3',
  'shoo': '/audio/letters/shoo.mp3',
  'صَا': '/audio/letters/shoo.mp3',
  'dhoo': '/audio/letters/dhoo.mp3',
  'ضَا': '/audio/letters/dhoo.mp3',
  'thoo': '/audio/letters/thoo.mp3',
  'طَا': '/audio/letters/thoo.mp3',
  'zhoo': '/audio/letters/zhoo.mp3',
  'ظَا': '/audio/letters/zhoo.mp3',
  "'aa": '/audio/letters/ain_aa.mp3',
  'ain_aa': '/audio/letters/ain_aa.mp3',
  'عَا': '/audio/letters/ain_aa.mp3',
  'ghoo': '/audio/letters/ghoo.mp3',
  'غَا': '/audio/letters/ghoo.mp3',
  'faa': '/audio/letters/faa.mp3',
  'فَا': '/audio/letters/faa.mp3',
  'qoo': '/audio/letters/qoo.mp3',
  'قَا': '/audio/letters/qoo.mp3',
  'kaa': '/audio/letters/kaa.mp3',
  'كَا': '/audio/letters/kaa.mp3',
  'laa': '/audio/letters/laa.mp3',
  'لَا': '/audio/letters/laa.mp3',
  'maa': '/audio/letters/maa.mp3',
  'مَا': '/audio/letters/maa.mp3',
  'naa': '/audio/letters/naa.mp3',
  'نَا': '/audio/letters/naa.mp3',
  'waa': '/audio/letters/waa.mp3',
  'وَا': '/audio/letters/waa.mp3',
  'yaa': '/audio/letters/yaa.mp3',
  'يَا': '/audio/letters/yaa.mp3',

  // --- IQRO 3: KASRAH (-i) ---
  'i': '/audio/letters/i.mp3',
  'إِ': '/audio/letters/i.mp3',
  'إ': '/audio/letters/i.mp3',
  'اِ': '/audio/letters/i.mp3',
  'bi': '/audio/letters/bi.mp3',
  'بِ': '/audio/letters/bi.mp3',
  'ti': '/audio/letters/ti.mp3',
  'تِ': '/audio/letters/ti.mp3',
  'tsi': '/audio/letters/tsi.mp3',
  'ثِ': '/audio/letters/tsi.mp3',
  'ji': '/audio/letters/ji.mp3',
  'جِ': '/audio/letters/ji.mp3',
  'hi': '/audio/letters/hi.mp3',
  'حِ': '/audio/letters/hi.mp3',
  'khi': '/audio/letters/khi.mp3',
  'خِ': '/audio/letters/khi.mp3',
  'di': '/audio/letters/di.mp3',
  'دِ': '/audio/letters/di.mp3',
  'dzi': '/audio/letters/dzi.mp3',
  'ذِ': '/audio/letters/dzi.mp3',
  'ri': '/audio/letters/ri.mp3',
  'رِ': '/audio/letters/ri.mp3',
  'zi': '/audio/letters/zi.mp3',
  'زِ': '/audio/letters/zi.mp3',
  'si': '/audio/letters/si.mp3',
  'سِ': '/audio/letters/si.mp3',
  'syi': '/audio/letters/syi.mp3',
  'شِ': '/audio/letters/syi.mp3',
  'shi': '/audio/letters/shi.mp3',
  'صِ': '/audio/letters/shi.mp3',
  'dhi': '/audio/letters/dhi.mp3',
  'ضِ': '/audio/letters/dhi.mp3',
  'thi': '/audio/letters/thi.mp3',
  'طِ': '/audio/letters/thi.mp3',
  'zhi': '/audio/letters/zhi.mp3',
  'ظِ': '/audio/letters/zhi.mp3',
  "'i": '/audio/letters/ain_i.mp3',
  'ain_i': '/audio/letters/ain_i.mp3',
  'عِ': '/audio/letters/ain_i.mp3',
  'ghi': '/audio/letters/ghi.mp3',
  'غِ': '/audio/letters/ghi.mp3',
  'fi': '/audio/letters/fi.mp3',
  'فِ': '/audio/letters/fi.mp3',
  'qi': '/audio/letters/qi.mp3',
  'قِ': '/audio/letters/qi.mp3',
  'ki': '/audio/letters/ki.mp3',
  'كِ': '/audio/letters/ki.mp3',
  'li': '/audio/letters/li.mp3',
  'لِ': '/audio/letters/li.mp3',
  'mi': '/audio/letters/mi.mp3',
  'مِ': '/audio/letters/mi.mp3',
  'ni': '/audio/letters/ni.mp3',
  'نِ': '/audio/letters/ni.mp3',
  'wi': '/audio/letters/wi.mp3',
  'وِ': '/audio/letters/wi.mp3',
  'hii': '/audio/letters/hii.mp3',
  'هِ': '/audio/letters/hii.mp3',
  'yi': '/audio/letters/yi.mp3',
  'يِ': '/audio/letters/yi.mp3',

  // --- IQRO 3: DHAMMAH (-u) ---
  'u': '/audio/letters/u.mp3',
  'أُ': '/audio/letters/u.mp3',
  'اُ': '/audio/letters/u.mp3',
  'bu': '/audio/letters/bu.mp3',
  'بُ': '/audio/letters/bu.mp3',
  'tu': '/audio/letters/tu.mp3',
  'تُ': '/audio/letters/tu.mp3',
  'tsu': '/audio/letters/tsu.mp3',
  'ثُ': '/audio/letters/tsu.mp3',
  'ju': '/audio/letters/ju.mp3',
  'جُ': '/audio/letters/ju.mp3',
  'hu': '/audio/letters/hu.mp3',
  'حُ': '/audio/letters/hu.mp3',
  'khu': '/audio/letters/khu.mp3',
  'خُ': '/audio/letters/khu.mp3',
  'du': '/audio/letters/du.mp3',
  'دُ': '/audio/letters/du.mp3',
  'dzu': '/audio/letters/dzu.mp3',
  'ذُ': '/audio/letters/dzu.mp3',
  'ru': '/audio/letters/ru.mp3',
  'رُ': '/audio/letters/ru.mp3',
  'zu': '/audio/letters/zu.mp3',
  'زُ': '/audio/letters/zu.mp3',
  'su': '/audio/letters/su.mp3',
  'سُ': '/audio/letters/su.mp3',
  'syu': '/audio/letters/syu.mp3',
  'شُ': '/audio/letters/syu.mp3',
  'shu': '/audio/letters/shu.mp3',
  'صُ': '/audio/letters/shu.mp3',
  'dhu': '/audio/letters/dhu.mp3',
  'ضُ': '/audio/letters/dhu.mp3',
  'thu': '/audio/letters/thu.mp3',
  'طُ': '/audio/letters/thu.mp3',
  'zhu': '/audio/letters/zhu.mp3',
  'ظُ': '/audio/letters/zhu.mp3',
  "'u": '/audio/letters/ain_u.mp3',
  'ain_u': '/audio/letters/ain_u.mp3',
  'عُ': '/audio/letters/ain_u.mp3',
  'ghu': '/audio/letters/ghu.mp3',
  'غُ': '/audio/letters/ghu.mp3',
  'fu': '/audio/letters/fu.mp3',
  'فُ': '/audio/letters/fu.mp3',
  'qu': '/audio/letters/qu.mp3',
  'قُ': '/audio/letters/qu.mp3',
  'ku': '/audio/letters/ku.mp3',
  'كُ': '/audio/letters/ku.mp3',
  'lu': '/audio/letters/lu.mp3',
  'لُ': '/audio/letters/lu.mp3',
  'mu': '/audio/letters/mu.mp3',
  'مُ': '/audio/letters/mu.mp3',
  'nu': '/audio/letters/nu.mp3',
  'نُ': '/audio/letters/nu.mp3',
  'wu': '/audio/letters/wu.mp3',
  'وُ': '/audio/letters/wu.mp3',
  'huu': '/audio/letters/huu.mp3',
  'هُ': '/audio/letters/huu.mp3',
  'yu': '/audio/letters/yu.mp3',
  'يُ': '/audio/letters/yu.mp3',

  // --- IQRO 3: MAD ASLI (KASRAH + YA & DHAMMAH + WAWU) ---
  'bii': '/audio/letters/bii.mp3',
  'بِيْ': '/audio/letters/bii.mp3',
  'بِي': '/audio/letters/bii.mp3',
  'tii': '/audio/letters/tii.mp3',
  'تِيْ': '/audio/letters/tii.mp3',
  'تِي': '/audio/letters/tii.mp3',
  'tsii': '/audio/letters/tsii.mp3',
  'ثِيْ': '/audio/letters/tsii.mp3',
  'ثِي': '/audio/letters/tsii.mp3',
  'jii': '/audio/letters/jii.mp3',
  'جِيْ': '/audio/letters/jii.mp3',
  'جِي': '/audio/letters/jii.mp3',
  'dii': '/audio/letters/dii.mp3',
  'دِيْ': '/audio/letters/dii.mp3',
  'دِي': '/audio/letters/dii.mp3',
  'rii': '/audio/letters/rii.mp3',
  'رِيْ': '/audio/letters/rii.mp3',
  'رِي': '/audio/letters/rii.mp3',
  'sii': '/audio/letters/sii.mp3',
  'سِيْ': '/audio/letters/sii.mp3',
  'سِي': '/audio/letters/sii.mp3',
  'ain_ii': '/audio/letters/ain_ii.mp3',
  "'ii": '/audio/letters/ain_ii.mp3',
  'عِيْ': '/audio/letters/ain_ii.mp3',
  'عِي': '/audio/letters/ain_ii.mp3',
  'fii': '/audio/letters/fii.mp3',
  'فِيْ': '/audio/letters/fii.mp3',
  'فِي': '/audio/letters/fii.mp3',
  'qii': '/audio/letters/qii.mp3',
  'قِيْ': '/audio/letters/qii.mp3',
  'قِي': '/audio/letters/qii.mp3',
  'kii': '/audio/letters/kii.mp3',
  'كِيْ': '/audio/letters/kii.mp3',
  'كِي': '/audio/letters/kii.mp3',
  'lii': '/audio/letters/lii.mp3',
  'لِيْ': '/audio/letters/lii.mp3',
  'لِي': '/audio/letters/lii.mp3',
  'mii': '/audio/letters/mii.mp3',
  'مِيْ': '/audio/letters/mii.mp3',
  'مِي': '/audio/letters/mii.mp3',
  'nii': '/audio/letters/nii.mp3',
  'نِيْ': '/audio/letters/nii.mp3',
  'نِي': '/audio/letters/nii.mp3',

  'buu': '/audio/letters/buu.mp3',
  'بُوْ': '/audio/letters/buu.mp3',
  'بُو': '/audio/letters/buu.mp3',
  'tuu': '/audio/letters/tuu.mp3',
  'تُوْ': '/audio/letters/tuu.mp3',
  'تُو': '/audio/letters/tuu.mp3',
  'tsuu': '/audio/letters/tsuu.mp3',
  'ثُوْ': '/audio/letters/tsuu.mp3',
  'ثُو': '/audio/letters/tsuu.mp3',
  'juu': '/audio/letters/juu.mp3',
  'جُوْ': '/audio/letters/juu.mp3',
  'جُو': '/audio/letters/juu.mp3',
  'duu': '/audio/letters/duu.mp3',
  'دُوْ': '/audio/letters/duu.mp3',
  'دُو': '/audio/letters/duu.mp3',
  'ruu': '/audio/letters/ruu.mp3',
  'رُوْ': '/audio/letters/ruu.mp3',
  'رُو': '/audio/letters/ruu.mp3',
  'suu': '/audio/letters/suu.mp3',
  'سُوْ': '/audio/letters/suu.mp3',
  'سُو': '/audio/letters/suu.mp3',
  'ain_uu': '/audio/letters/ain_uu.mp3',
  "'uu": '/audio/letters/ain_uu.mp3',
  'عُوْ': '/audio/letters/ain_uu.mp3',
  'عُو': '/audio/letters/ain_uu.mp3',
  'fuu': '/audio/letters/fuu.mp3',
  'فُوْ': '/audio/letters/fuu.mp3',
  'فُو': '/audio/letters/fuu.mp3',
  'quu': '/audio/letters/quu.mp3',
  'قُوْ': '/audio/letters/quu.mp3',
  'قُو': '/audio/letters/quu.mp3',
  'kuu': '/audio/letters/kuu.mp3',
  'كُوْ': '/audio/letters/kuu.mp3',
  'كُو': '/audio/letters/kuu.mp3',
  'luu': '/audio/letters/luu.mp3',
  'لُوْ': '/audio/letters/luu.mp3',
  'لُو': '/audio/letters/luu.mp3',
  'muu': '/audio/letters/muu.mp3',
  'مُوْ': '/audio/letters/muu.mp3',
  'مُو': '/audio/letters/muu.mp3',
  'nuu': '/audio/letters/nuu.mp3',
  'نُوْ': '/audio/letters/nuu.mp3',
  'نُو': '/audio/letters/nuu.mp3',
  'yuu': '/audio/letters/yuu.mp3',
  'يُوْ': '/audio/letters/yuu.mp3',
  'يُو': '/audio/letters/yuu.mp3',
};

const PRAISE_AUDIO_LIST = [
  '/audio/praises/praise_hebat.mp3',
  '/audio/praises/praise_pintar.mp3',
  '/audio/praises/praise_luarbiasa.mp3',
  '/audio/praises/praise_keren.mp3',
  '/audio/praises/praise_bagus.mp3',
];

const ENCOURAGE_AUDIO_LIST = [
  '/audio/encourages/encourage_coba_lagi.mp3',
  '/audio/encourages/encourage_hampir.mp3',
  '/audio/encourages/encourage_semangat.mp3',
];

class TTSNarrator {
  private voice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isChainCancelled = false;
  private activeChildName = '';
  private customAudioUrls: Record<string, string> = {};
  private studioAudioUrls: Record<string, string> = {};

  // Web Audio engine for rock-solid decoding of recorded WebM/Opus blobs
  private webAudioCtx: AudioContext | null = null;
  private currentSourceNode: AudioBufferSourceNode | null = null;
  private decodedBufferCache: Map<string, AudioBuffer> = new Map();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
    if (typeof window !== 'undefined') {
      this.loadStudioRecordings();
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(
      (v) => (v.lang.startsWith('id') || v.lang.includes('ID')) && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online'))
    ) || voices.find((v) => v.lang.startsWith('id') || v.lang.includes('ID'));

    if (idVoice) {
      this.voice = idVoice;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.webAudioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.webAudioCtx = new AudioCtx();
      }
    }
    if (this.webAudioCtx && this.webAudioCtx.state === 'suspended') {
      this.webAudioCtx.resume().catch(() => {});
    }
    return this.webAudioCtx;
  }

  /**
   * Direct Web Audio playback: seamlessly decodes and plays WebM Opus blobs
   * and any audio format without HTMLAudioElement duration/codec hang issues.
   */
  public async playWithWebAudio(url: string, onEnd?: () => void): Promise<boolean> {
    const ctx = this.getAudioContext();
    if (!ctx) {
      onEnd?.();
      return false;
    }

    try {
      this.stop();
      this.isChainCancelled = false;

      let buffer = this.decodedBufferCache.get(url);
      if (!buffer) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        buffer = await ctx.decodeAudioData(arrayBuffer);
        this.decodedBufferCache.set(url, buffer);
      }

      const sourceNode = ctx.createBufferSource();
      sourceNode.buffer = buffer;
      sourceNode.connect(ctx.destination);
      this.currentSourceNode = sourceNode;

      let called = false;
      const finish = () => {
        if (!called) {
          called = true;
          this.currentSourceNode = null;
          onEnd?.();
        }
      };

      sourceNode.onended = finish;
      sourceNode.start(0);
      return true;
    } catch (err) {
      console.warn('TTSNarrator WebAudio playback error:', err);
      this.currentSourceNode = null;
      onEnd?.();
      return false;
    }
  }

  public async loadChildAudio(childName: string): Promise<boolean> {
    const trimmed = (childName || '').trim();
    if (!trimmed) return false;

    if (
      this.activeChildName.toLowerCase() === trimmed.toLowerCase() &&
      Object.keys(this.customAudioUrls).length > 0
    ) {
      return true;
    }

    this.releaseCustomAudioUrls();
    this.activeChildName = trimmed;

    try {
      const blobs = await getAllCachedAudioForName(trimmed);
      const urls: Record<string, string> = {};
      for (const [key, blob] of Object.entries(blobs)) {
        if (blob) {
          urls[key] = URL.createObjectURL(blob);
        }
      }
      this.customAudioUrls = urls;
      return Object.keys(urls).length > 0;
    } catch {
      this.customAudioUrls = {};
      return false;
    }
  }

  public releaseCustomAudioUrls() {
    for (const url of Object.values(this.customAudioUrls)) {
      try {
        URL.revokeObjectURL(url);
        this.decodedBufferCache.delete(url);
      } catch {
        // ignore
      }
    }
    this.customAudioUrls = {};
  }

  public async loadStudioRecordings(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (!isStudioVoiceEnabled()) {
      this.releaseStudioAudioUrls();
      return false;
    }

    try {
      this.releaseStudioAudioUrls();
      const records = await getAllStudioRecordings();
      const urls: Record<string, string> = {};
      for (const [qId, rec] of Object.entries(records)) {
        if (rec && rec.blob) {
          const url = URL.createObjectURL(rec.blob);

          // 1. Map by question ID exact and lowercased (e.g. 'q1', 'q201')
          urls[qId] = url;
          urls[qId.toLowerCase()] = url;

          // 2. Map by Arabic target letter (with and without harakat)
          if (rec.targetLetter) {
            const rawArabic = rec.targetLetter.trim();
            urls[rawArabic] = url;
            const strippedArabic = rawArabic.replace(/[\u064B-\u065F\u0670]/g, '');
            if (strippedArabic && !urls[strippedArabic]) {
              urls[strippedArabic] = url;
            }
          }

          // 3. Map by Latin target name (e.g. 'ba', 'ba-ta', 'bata')
          if (rec.targetName) {
            const rawName = rec.targetName.trim().toLowerCase();
            urls[rawName] = url;
            const cleanLatin = rawName.replace(/[^a-z0-9']/g, '');
            if (cleanLatin && !urls[cleanLatin]) {
              urls[cleanLatin] = url;
            }
            const noApos = cleanLatin.replace(/'/g, '');
            if (noApos && !urls[noApos]) {
              urls[noApos] = url;
            }
            const hyphenated = rawName.replace(/\s+/g, '-');
            if (hyphenated && !urls[hyphenated]) {
              urls[hyphenated] = url;
            }
          }
        }
      }
      this.studioAudioUrls = urls;
      return Object.keys(urls).length > 0;
    } catch {
      this.studioAudioUrls = {};
      return false;
    }
  }

  public releaseStudioAudioUrls() {
    for (const url of Object.values(this.studioAudioUrls)) {
      try {
        URL.revokeObjectURL(url);
        this.decodedBufferCache.delete(url);
      } catch {
        // ignore
      }
    }
    this.studioAudioUrls = {};
  }

  public getLetterAudioPath(letter: string): string | null {
    if (!letter) return null;
    const rawTrimmed = letter.trim();

    // Studio recordings take priority if studio voice is enabled
    if (this.studioAudioUrls[rawTrimmed]) {
      return this.studioAudioUrls[rawTrimmed];
    }
    const normalized = rawTrimmed.toLowerCase().replace(/[’`]/g, "'");
    if (this.studioAudioUrls[normalized]) {
      return this.studioAudioUrls[normalized];
    }
    const cleanLatin = normalized.replace(/[^a-z']/g, '');
    if (this.studioAudioUrls[cleanLatin]) {
      return this.studioAudioUrls[cleanLatin];
    }
    const noApos = cleanLatin.replace(/'/g, '');
    if (this.studioAudioUrls[noApos]) {
      return this.studioAudioUrls[noApos];
    }

    // Default authentic letter audio maps
    if (LETTER_AUDIO_MAP[normalized]) {
      return LETTER_AUDIO_MAP[normalized];
    }
    if (LETTER_AUDIO_MAP[cleanLatin]) {
      return LETTER_AUDIO_MAP[cleanLatin];
    }
    if (LETTER_AUDIO_MAP[noApos]) {
      return LETTER_AUDIO_MAP[noApos];
    }
    return null;
  }

  // Extract chained audio paths for multi-syllable Arabic words or Latin combos (e.g. "بَتَ", "Ba-Ta")
  public getWordAudioPaths(word: string): string[] {
    if (!word) return [];
    const trimmed = word.trim();

    // 0. Direct studio audio match for full word (e.g. "Ba-Ta" or "كُتِبَ")
    if (this.studioAudioUrls[trimmed]) return [this.studioAudioUrls[trimmed]];
    const lowerTrimmed = trimmed.toLowerCase();
    if (this.studioAudioUrls[lowerTrimmed]) return [this.studioAudioUrls[lowerTrimmed]];
    const cleanLatin = lowerTrimmed.replace(/[^a-z0-9']/g, '');
    if (this.studioAudioUrls[cleanLatin]) return [this.studioAudioUrls[cleanLatin]];

    // 1. Single letter direct match
    const single = this.getLetterAudioPath(trimmed);
    if (single) return [single];

    // 2. Hyphenated / space-separated Latin (e.g. "Ba-Ta", "Ka-Ta-Ba")
    // Strictly requires 2 to 5 parts, and ALL parts MUST be valid Hijaiyah letters!
    if (trimmed.includes('-') || trimmed.includes(' ')) {
      const parts = trimmed.split(/[- ]+/).filter(Boolean);
      if (parts.length >= 2 && parts.length <= 5) {
        const paths: string[] = [];
        let allValid = true;
        for (const p of parts) {
          const path = this.getLetterAudioPath(p);
          if (path) {
            paths.push(path);
          } else {
            allValid = false;
            break;
          }
        }
        if (allValid && paths.length === parts.length) {
          return paths;
        }
      }
    }

    // 3. Arabic word character/syllable analysis (Iqro 2 & Iqro 3 joined letters)
    // Strictly requires Arabic characters in the string!
    if (/[\u0600-\u06FF]/.test(trimmed)) {
      // 3a. Check if trimmed has spaces/hyphens between Arabic letters/syllables (e.g. "بَ - بِ - بُ")
      if (trimmed.includes(' ') || trimmed.includes('-')) {
        const arParts = trimmed.split(/[- ]+/).filter(Boolean);
        const paths: string[] = [];
        let allMatched = true;
        for (const p of arParts) {
          const path = this.getLetterAudioPath(p);
          if (path) {
            paths.push(path);
          } else {
            allMatched = false;
            break;
          }
        }
        if (allMatched && paths.length === arParts.length) {
          return paths;
        }
      }

      // 3b. Syllable segmentation for connected Arabic words (e.g. "كُتِبَ", "حَسُنَ", "بِيْدِيْ")
      // Syllable = Consonant + optional harakat + optional mad letter (Alif, Ya, Waw with optional sukun)
      const syllableRegex = /([\u0621-\u064A][\u064B-\u0652]?(?:[اى]|[يو][\u0652]?|[\u0670])?)/g;
      const syllables = trimmed.match(syllableRegex);
      if (syllables && syllables.length > 0) {
        const paths: string[] = [];
        let allMatched = true;
        for (const syl of syllables) {
          let p = this.getLetterAudioPath(syl);
          if (!p) {
            const noSukun = syl.replace(/\u0652/g, '');
            p = this.getLetterAudioPath(noSukun);
          }
          if (!p) {
            // Strip harakat and mad alif if base fathah fallback
            const base = syl.replace(/[\u064B-\u065F\u0670]/g, '').replace(/[اى]/g, '');
            p = this.getLetterAudioPath(base);
          }
          if (p) {
            paths.push(p);
          } else {
            allMatched = false;
            break;
          }
        }
        if (allMatched && paths.length === syllables.length) {
          return paths;
        }
      }

      // 3c. Fallback char-by-char for simple fathah joined words
      const paths: string[] = [];
      const chars = trimmed.split('');
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        if (/[\u064B-\u065F\u0670]/.test(c)) continue;
        if (c === 'ا' && paths.length > 0) continue;

        const path = this.getLetterAudioPath(c);
        if (path) {
          paths.push(path);
        }
      }
      if (paths.length > 0) {
        return paths;
      }
    }

    return [];
  }

  public playAudio(src: string, onEnd?: () => void): boolean {
    if (typeof window === 'undefined') {
      onEnd?.();
      return true;
    }

    // Blob URLs (e.g. from studio recordings or mic) decode 100% reliably via Web Audio API
    if (src.startsWith('blob:')) {
      this.playWithWebAudio(src, onEnd);
      return true;
    }

    try {
      this.stop();
      this.isChainCancelled = false;
      const audio = new Audio(src);
      this.currentAudio = audio;

      let called = false;
      const finish = () => {
        if (!called) {
          called = true;
          this.currentAudio = null;
          onEnd?.();
        }
      };

      audio.onended = finish;
      audio.onerror = () => {
        this.currentAudio = null;
        this.playWithWebAudio(src, finish);
      };

      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch(() => {
          this.currentAudio = null;
          this.playWithWebAudio(src, finish);
        });
      }
      return true;
    } catch {
      this.playWithWebAudio(src, onEnd);
      return true;
    }
  }

  public playAudioChain(srcs: string[], onEnd?: () => void) {
    if (typeof window === 'undefined' || srcs.length === 0) {
      onEnd?.();
      return;
    }

    this.stop();
    this.isChainCancelled = false;

    let idx = 0;
    const playNext = () => {
      if (this.isChainCancelled || idx >= srcs.length) {
        this.currentAudio = null;
        onEnd?.();
        return;
      }

      const src = srcs[idx++];
      let called = false;
      const advance = () => {
        if (!called) {
          called = true;
          if (this.isChainCancelled) {
            this.currentAudio = null;
            onEnd?.();
            return;
          }
          // Snappy transition: 25ms after question prompt, or 80ms between joined syllables
          const isPrompt = src.includes('/prompts/');
          const gap = isPrompt ? 25 : 80;
          setTimeout(playNext, gap);
        }
      };

      if (src.startsWith('blob:')) {
        this.playWithWebAudio(src, advance);
        return;
      }

      try {
        const audio = new Audio(src);
        this.currentAudio = audio;

        audio.onended = advance;
        audio.onerror = () => {
          this.currentAudio = null;
          this.playWithWebAudio(src, advance);
        };

        const promise = audio.play();
        if (promise !== undefined) {
          promise.catch(() => {
            this.currentAudio = null;
            this.playWithWebAudio(src, advance);
          });
        }
      } catch {
        this.playWithWebAudio(src, advance);
      }
    };

    playNext();
  }

  private getStudioUrl(letterKey?: string, questionId?: string): string | null {
    if (questionId && this.studioAudioUrls[questionId]) {
      return this.studioAudioUrls[questionId];
    }
    if (questionId && this.studioAudioUrls[questionId.toLowerCase()]) {
      return this.studioAudioUrls[questionId.toLowerCase()];
    }
    if (!letterKey) return null;

    const trimmed = letterKey.trim();
    if (this.studioAudioUrls[trimmed]) return this.studioAudioUrls[trimmed];

    const lower = trimmed.toLowerCase();
    if (this.studioAudioUrls[lower]) return this.studioAudioUrls[lower];

    const clean = lower.replace(/[^a-z0-9']/g, '');
    if (this.studioAudioUrls[clean]) return this.studioAudioUrls[clean];

    const strippedArabic = trimmed.replace(/[\u064B-\u065F\u0670]/g, '');
    if (strippedArabic && this.studioAudioUrls[strippedArabic]) {
      return this.studioAudioUrls[strippedArabic];
    }

    return null;
  }

  // Play authentic human studio letter or joined-word audio directly
  public playLetter(letterKey: string, onEnd?: () => void): boolean {
    const studioUrl = this.getStudioUrl(letterKey);
    if (studioUrl) {
      return this.playAudio(studioUrl, onEnd);
    }
    const audioPath = this.getLetterAudioPath(letterKey);
    if (audioPath) {
      return this.playAudio(audioPath, onEnd);
    }
    const wordPaths = this.getWordAudioPaths(letterKey);
    if (wordPaths.length > 0) {
      this.playAudioChain(wordPaths, onEnd);
      return true;
    }
    onEnd?.();
    return false;
  }

  // Chained Audio: "Ayo cari..." + [Authentic Letter / Word Audio Chain]
  public askFindLetter(letterKey: string, onEnd?: () => void, questionId?: string) {
    const studioUrl = this.getStudioUrl(letterKey, questionId);
    if (studioUrl) {
      this.playAudioChain(['/audio/prompts/prompt_ayo_cari.mp3', studioUrl], onEnd);
      return;
    }
    const wordPaths = this.getWordAudioPaths(letterKey);
    if (wordPaths.length > 0) {
      this.playAudioChain(['/audio/prompts/prompt_ayo_cari.mp3', ...wordPaths], onEnd);
    } else {
      this.speakLetter(letterKey, onEnd);
    }
  }

  // Chained Audio: "Yang mana..." + [Authentic Letter / Word Audio Chain]
  public askWhichLetter(letterKey: string, onEnd?: () => void, questionId?: string) {
    const studioUrl = this.getStudioUrl(letterKey, questionId);
    if (studioUrl) {
      this.playAudioChain(['/audio/prompts/prompt_yang_mana.mp3', studioUrl], onEnd);
      return;
    }
    const wordPaths = this.getWordAudioPaths(letterKey);
    if (wordPaths.length > 0) {
      this.playAudioChain(['/audio/prompts/prompt_yang_mana.mp3', ...wordPaths], onEnd);
    } else {
      this.speakLetter(letterKey, onEnd);
    }
  }

  // Chained Audio: "Ayo coba tulis..." + [Authentic Letter / Word Audio Chain]
  public askTraceLetter(letterKey: string, onEnd?: () => void, questionId?: string) {
    const studioUrl = this.getStudioUrl(letterKey, questionId);
    if (studioUrl) {
      this.playAudioChain(['/audio/prompts/prompt_ayo_tulis.mp3', studioUrl], onEnd);
      return;
    }
    const wordPaths = this.getWordAudioPaths(letterKey);
    if (wordPaths.length > 0) {
      this.playAudioChain(['/audio/prompts/prompt_ayo_tulis.mp3', ...wordPaths], onEnd);
    } else {
      this.speakLetter(letterKey, onEnd);
    }
  }

  // Chained Audio: "Letuskan balon..." + [Authentic Letter / Word Audio Chain]
  public askPopLetter(letterKey: string, onEnd?: () => void, questionId?: string) {
    const studioUrl = this.getStudioUrl(letterKey, questionId);
    if (studioUrl) {
      this.playAudioChain(['/audio/prompts/prompt_letuskan_balon.mp3', studioUrl], onEnd);
      return;
    }
    const wordPaths = this.getWordAudioPaths(letterKey);
    if (wordPaths.length > 0) {
      this.playAudioChain(['/audio/prompts/prompt_letuskan_balon.mp3', ...wordPaths], onEnd);
    } else {
      this.speakLetter(letterKey, onEnd);
    }
  }

  // Universal Prompt Target Extractor: handles colons, prefixes, adjectives, and question marks
  public extractTargetFromPrompt(text: string): string {
    const clean = text.replace(/\([^)]*\)/g, '').trim();

    // 1. If colon ":", target is after colon (e.g. "Ayo coba tulis: RO - ZA!", "bacaan: BA - TA!")
    if (clean.includes(':')) {
      let afterColon = clean.split(':')[1].trim();
      afterColon = afterColon.replace(/^(?:huruf|kata|bacaan)\s+/i, '').trim();
      afterColon = afterColon.replace(/[!?.]+$/, '').trim();
      if (afterColon) return afterColon;
    }

    // 2. Match after "huruf", "kata", "bacaan"
    const m = clean.match(/(?:huruf|bacaan|kata)\s+([A-Za-z'ء-ي\- ]+)/i);
    if (m) {
      let target = m[1].trim().replace(/[!?.]+$/, '').trim();
      // If space-separated without hyphen (e.g. "KHA bertopi"), take the first word if valid
      const words = target.split(/\s+/);
      if (words.length > 1 && !target.includes('-')) {
        if (this.getLetterAudioPath(words[0])) {
          return words[0];
        }
      }
      if (!['tiga', 'pertama', 'pamungkas', 'panjang', 'pendek'].includes(target.toLowerCase())) {
        return target;
      }
    }

    // 3. Match before question mark e.g. "Yang mana huruf A?", "Yang mana ZA?"
    const qMatch = clean.match(/([A-Za-z'ء-ي\- ]+)\s*\?/);
    if (qMatch) {
      let target = qMatch[1].trim();
      target = target.replace(/^(?:yang\s+mana|mana|apa)\s+(?:huruf|kata|bacaan\s+)?/i, '').trim();
      return target;
    }

    return clean;
  }

  // Smart Speech Dispatcher: parses prompt and chains natural audio
  public speak(text: string, onEnd?: () => void) {
    const lower = text.toLowerCase().trim();

    // General app voice prompts
    if (lower.includes('pelajaran selesai') || lower.includes('luar biasa')) {
      return this.playAudio('/audio/prompts/prompt_selesai.mp3', onEnd);
    }
    if (lower.includes('kenalan') || lower.includes('siapa nama') || lower.includes('namaku iqro') || lower.includes('namaku boni')) {
      return this.playAudio('/audio/prompts/prompt_kenalan.mp3', onEnd);
    }
    if (lower.includes('senang berkenalan') || lower.includes('petualangan belajar iqro')) {
      return this.playAudio('/audio/prompts/prompt_kenalan_sukses.mp3', onEnd);
    }
    if (lower.includes('memakai') || lower.includes('cocok sekali')) {
      return this.playAudio('/audio/prompts/prompt_pakai_kostum.mp3', onEnd);
    }
    if (lower.includes('berhasil dibeli')) {
      return this.playAudio('/audio/prompts/prompt_beli_sukses.mp3', onEnd);
    }
    if (lower.includes('permata belum cukup')) {
      return this.playAudio('/audio/prompts/prompt_permata_kurang.mp3', onEnd);
    }
    if (lower.includes('berhasil direset') || lower.includes('data direset')) {
      return this.playAudio('/audio/prompts/prompt_reset_sukses.mp3', onEnd);
    }
    if (lower.includes('semangat belajar mengaji') || lower.includes('halo')) {
      return this.playAudio('/audio/prompts/prompt_sapaan.mp3', onEnd);
    }

    // Extract target letter or word combo from text (strips parentheses e.g. "(Dua titik di atas)")
    const cleanText = text.replace(/\([^)]*\)/g, '').trim();

    // 1. Balloon game prompt
    if (lower.includes('balon') || lower.includes('letuskan') || lower.includes('pecahkan')) {
      const target = this.extractTargetFromPrompt(cleanText);
      if (target && this.getWordAudioPaths(target).length > 0) {
        return this.askPopLetter(target, onEnd);
      }
    }

    // 2. Tracing game prompt
    if (lower.includes('tulis')) {
      const target = this.extractTargetFromPrompt(cleanText);
      if (target && this.getWordAudioPaths(target).length > 0) {
        return this.askTraceLetter(target, onEnd);
      }
    }

    // 3. Which one ("Yang mana") prompt
    if (lower.includes('mana')) {
      const target = this.extractTargetFromPrompt(cleanText);
      if (target && this.getWordAudioPaths(target).length > 0) {
        return this.askWhichLetter(target, onEnd);
      }
    }

    // 4. Find letter ("Cari" / "Pilih") prompt
    if (lower.includes('cari') || lower.includes('pilih')) {
      const target = this.extractTargetFromPrompt(cleanText);
      if (target && this.getWordAudioPaths(target).length > 0) {
        return this.askFindLetter(target, onEnd);
      }
    }

    // 5. Letter / word name standalone
    const cleanLetter = lower.replace(/^(huruf|suara|bacaan|kata)\s+/i, '').replace(/[^a-z'ء-ي\- ]/g, '').trim();
    if (cleanLetter && this.getWordAudioPaths(cleanLetter).length > 0) {
      return this.playLetter(cleanLetter, onEnd);
    }

    // Fallback: browser SpeechSynthesis with parentheses removed
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    try {
      this.stop();
      const spokenText = cleanText.replace(/!+/g, '.');
      const utterance = new SpeechSynthesisUtterance(spokenText);
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.lang = 'id-ID';
      utterance.rate = 0.98;
      utterance.pitch = 1.15;

      this.currentUtterance = utterance;

      let called = false;
      const finish = () => {
        if (!called) {
          called = true;
          this.currentUtterance = null;
          onEnd?.();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      window.speechSynthesis.speak(utterance);
    } catch {
      this.currentUtterance = null;
      onEnd?.();
    }
  }

  public speakLetter(letterName: string, onEnd?: () => void) {
    if (this.playLetter(letterName, onEnd)) {
      return;
    }
    this.speak(letterName, onEnd);
  }

  public speakPraise(childNameOrOnEnd?: string | (() => void), onEnd?: () => void) {
    let callback = onEnd;
    let name = '';
    if (typeof childNameOrOnEnd === 'function') {
      callback = childNameOrOnEnd;
    } else if (typeof childNameOrOnEnd === 'string') {
      name = childNameOrOnEnd.trim();
    }

    const customPraiseKeys = ['praise_hebat', 'praise_pintar', 'praise_luarbiasa', 'praise_keren', 'praise_bagus'];
    const availableCustom = customPraiseKeys
      .map((k) => this.customAudioUrls[k])
      .filter(Boolean);

    if (
      availableCustom.length > 0 &&
      (!name || name.toLowerCase() === this.activeChildName.toLowerCase())
    ) {
      const chosen = availableCustom[Math.floor(Math.random() * availableCustom.length)];
      this.playAudio(chosen, callback);
      return;
    }

    const chosen = PRAISE_AUDIO_LIST[Math.floor(Math.random() * PRAISE_AUDIO_LIST.length)];
    this.playAudio(chosen, callback);
  }

  public speakEncourage(_childName?: string, onEnd?: () => void) {
    const chosen = ENCOURAGE_AUDIO_LIST[Math.floor(Math.random() * ENCOURAGE_AUDIO_LIST.length)];
    this.playAudio(chosen, onEnd);
  }

  public speakGreeting(childName?: string, onEnd?: () => void) {
    const name = childName?.trim() || '';
    if (
      this.customAudioUrls['prompt_sapaan'] &&
      (!name || name.toLowerCase() === this.activeChildName.toLowerCase())
    ) {
      this.playAudio(this.customAudioUrls['prompt_sapaan'], onEnd);
      return;
    }

    this.playAudio('/audio/prompts/prompt_sapaan.mp3', onEnd);
  }

  public speakIntroduction(onEnd?: () => void) {
    this.playAudio('/audio/prompts/prompt_kenalan.mp3', onEnd);
  }

  public speakIntroductionSuccess(onEnd?: () => void) {
    this.playAudio('/audio/prompts/prompt_kenalan_sukses.mp3', onEnd);
  }

  public speakEquipCostume(onEnd?: () => void) {
    this.playAudio('/audio/prompts/prompt_pakai_kostum.mp3', onEnd);
  }

  public speakBuyCostume(onEnd?: () => void) {
    this.playAudio('/audio/prompts/prompt_beli_sukses.mp3', onEnd);
  }

  public speakNotEnoughGems(onEnd?: () => void) {
    this.playAudio('/audio/prompts/prompt_permata_kurang.mp3', onEnd);
  }

  public speakResetSuccess(onEnd?: () => void) {
    this.playAudio('/audio/prompts/prompt_reset_sukses.mp3', onEnd);
  }

  public speakLessonComplete(childNameOrOnEnd?: string | (() => void), onEnd?: () => void) {
    let callback = onEnd;
    let name = '';
    if (typeof childNameOrOnEnd === 'function') {
      callback = childNameOrOnEnd;
    } else if (typeof childNameOrOnEnd === 'string') {
      name = childNameOrOnEnd.trim();
    }

    if (
      this.customAudioUrls['prompt_selesai'] &&
      (!name || name.toLowerCase() === this.activeChildName.toLowerCase())
    ) {
      this.playAudio(this.customAudioUrls['prompt_selesai'], callback);
      return;
    }

    this.playAudio('/audio/prompts/prompt_selesai.mp3', callback);
  }

  public isSpeaking(): boolean {
    return !!this.currentUtterance || !!this.currentAudio || !!this.currentSourceNode;
  }

  public stop() {
    this.isChainCancelled = true;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }

    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.stop();
        this.currentSourceNode.disconnect();
      } catch {
        // ignore
      }
      this.currentSourceNode = null;
    }

    this.currentUtterance = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const ttsNarrator = new TTSNarrator();
