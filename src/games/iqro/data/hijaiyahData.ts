export interface HijaiyahInfo {
  letter: string;         // With harakat fathah (e.g. 'اَ', 'بَ', 'تَ')
  rawLetter: string;      // Bare letter ('ا', 'ب', 'ت')
  latin: string;          // 'A', 'Ba', 'Ta', etc.
  makhraj: string;        // Deskripsi tempat keluar huruf
  mnemonic: string;       // Cerita visual balita
  color: string;
}

export const HIJAIYAH_LIST: HijaiyahInfo[] = [
  { letter: 'اَ', rawLetter: 'ا', latin: 'A', makhraj: 'Tenggorokan bagian paling dalam (Aqshal Halqi)', mnemonic: 'Tiang lurus tinggi seperti pensil!', color: '#58CC02' },
  { letter: 'بَ', rawLetter: 'ب', latin: 'Ba', makhraj: 'Dua bibir tertutup (Syafatain)', mnemonic: 'Mangkok dengan 1 bakso di bawah!', color: '#1CB0F6' },
  { letter: 'تَ', rawLetter: 'ت', latin: 'Ta', makhraj: 'Ujung lidah menempel di pangkal gigi seri atas', mnemonic: 'Piring dengan 2 mata tersenyum di atas!', color: '#FF9600' },
  { letter: 'ثَ', rawLetter: 'ث', latin: 'Tsa', makhraj: 'Ujung lidah keluar sedikit di antara gigi seri', mnemonic: 'Piring dengan 3 butir permen!', color: '#CE82FF' },
  { letter: 'جَ', rawLetter: 'ج', latin: 'Ja', makhraj: 'Tengah lidah bertemu langit-langit atas', mnemonic: 'Bebek gendut punya telur di perutnya!', color: '#FFC800' },
  { letter: 'حَ', rawLetter: 'ح', latin: 'Ha', makhraj: 'Tengah tenggorokan bersih dan halus', mnemonic: 'Bebek gendut tanpa telur!', color: '#22C55E' },
  { letter: 'خَ', rawLetter: 'خ', latin: 'Kho', makhraj: 'Tenggorokan bagian atas dekat anak lidah', mnemonic: 'Bebek pakai topi satu di atas kepalanya!', color: '#F97316' },
  { letter: 'دَ', rawLetter: 'د', latin: 'Da', makhraj: 'Ujung lidah menempel di pangkal gigi seri atas', mnemonic: 'Mulut buaya terbuka ke kiri!', color: '#06B6D4' },
  { letter: 'ذَ', rawLetter: 'ذ', latin: 'Dza', makhraj: 'Ujung lidah keluar sedikit disentuh gigi seri', mnemonic: 'Mulut buaya punya mahkota titik di atas!', color: '#8B5CF6' },
  { letter: 'رَ', rawLetter: 'ر', latin: 'Ro', makhraj: 'Ujung lidah bergetar sedikit di langit-langit depan', mnemonic: 'Perosotan meluncur ke bawah!', color: '#EC4899' },
  { letter: 'زَ', rawLetter: 'ز', latin: 'Za', makhraj: 'Ujung lidah di belakang gigi seri bawah (desis tajam)', mnemonic: 'Perosotan meluncur dengan lampu di atasnya!', color: '#10B981' },
  { letter: 'سَ', rawLetter: 'س', latin: 'Sa', makhraj: 'Ujung lidah di belakang gigi seri bawah (desis halus)', mnemonic: 'Gigi sisir punya 3 gerigi!', color: '#3B82F6' },
  { letter: 'شَ', rawLetter: 'ش', latin: 'Sya', makhraj: 'Tengah lidah terangkat ke langit-langit (angin berhamburan)', mnemonic: 'Gigi sisir dengan 3 bintang di atasnya!', color: '#F59E0B' },
  { letter: 'صَ', rawLetter: 'ص', latin: 'Sho', makhraj: 'Ujung lidah di belakang gigi seri (tebal/tekan)', mnemonic: 'Balon lonjong punya ekor mangkok!', color: '#14B8A6' },
  { letter: 'ضَ', rawLetter: 'ض', latin: 'Dho', makhraj: 'Tepi lidah menyentuh gigi geraham atas', mnemonic: 'Balon lonjong dengan topi titik!', color: '#6366F1' },
  { letter: 'طَ', rawLetter: 'ط', latin: 'Tho', makhraj: 'Ujung lidah menempel di pangkal gigi seri atas (tebal)', mnemonic: 'Tongkat bendera berdiri kokoh!', color: '#84CC16' },
  { letter: 'ظَ', rawLetter: 'ظ', latin: 'Zho', makhraj: 'Ujung lidah disentuh gigi seri atas (tebal)', mnemonic: 'Tongkat bendera bermahkota bintang!', color: '#D946EF' },
  { letter: 'عَ', rawLetter: 'ع', latin: '\'A', makhraj: 'Tengah tenggorokan ditekan halus', mnemonic: 'Angka 4 terbalik terbuka!', color: '#0EA5E9' },
  { letter: 'غَ', rawLetter: 'غ', latin: 'Gho', makhraj: 'Tenggorokan atas (berkumur lembut)', mnemonic: 'Angka terbalik dengan topi titik!', color: '#EAB308' },
  { letter: 'فَ', rawLetter: 'ف', latin: 'Fa', makhraj: 'Ujung gigi seri atas menyentuh perut bibir bawah', mnemonic: 'Piring bundar berleher dengan 1 titik!', color: '#A855F7' },
  { letter: 'قَ', rawLetter: 'ق', latin: 'Qo', makhraj: 'Pangkal lidah paling dalam dekat anak lidah (mantul/tebal)', mnemonic: 'Mangkok bundar dengan 2 titik di atas!', color: '#EF4444' },
  { letter: 'كَ', rawLetter: 'ك', latin: 'Ka', makhraj: 'Pangkal lidah agak ke depan sedikit dari Qaf', mnemonic: 'Kursi bersandar yang nyaman!', color: '#059669' },
  { letter: 'لَ', rawLetter: 'ل', latin: 'La', makhraj: 'Ujung lidah ke gusi langit-langit atas', mnemonic: 'Gagang payung melengkung!', color: '#2563EB' },
  { letter: 'مَ', rawLetter: 'م', latin: 'Ma', makhraj: 'Dua bibir tertutup rapat', mnemonic: 'Sendok melengkung ke bawah!', color: '#D97706' },
  { letter: 'نَ', rawLetter: 'ن', latin: 'Na', makhraj: 'Ujung lidah menempel di gusi atas', mnemonic: 'Mangkok dalam punya telur di tengah!', color: '#7C3AED' },
  { letter: 'وَ', rawLetter: 'و', latin: 'Wa', makhraj: 'Dua bibir dimonyongkan membentuk lingkaran', mnemonic: 'Angka sembilan melingkar!', color: '#DB2777' },
  { letter: 'هَ', rawLetter: 'ه', latin: 'Ha', makhraj: 'Tenggorokan bagian paling dalam (ringan hembusan nafas)', mnemonic: 'Cincin donat bundar!', color: '#0284C7' },
  { letter: 'يَ', rawLetter: 'ي', latin: 'Ya', makhraj: 'Tengah lidah bertemu langit-langit atas', mnemonic: 'Bebek berenang dengan 2 titik di bawah!', color: '#65A30D' },
];
