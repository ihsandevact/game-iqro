/**
 * Kamus Fonetik & Algoritma Pencocokan Pelafalan Huruf Hijaiyah
 * 
 * Mendukung pencocokan ucapan santri cilik dalam ejaan fonetik Indonesia,
 * karakter Arab, serta variasi umum pengucapan anak-anak.
 */

export interface PhoneticEntry {
  letter: string;
  name: string;
  aliasesLatin: string[];
  aliasesArabic: string[];
}

export const HIJAIYAH_PHONETIC_DICT: Record<string, PhoneticEntry> = {
  // Unit 1: A, Ba, Ta, Tsa
  'a': {
    letter: 'اَ',
    name: 'A',
    aliasesLatin: ['a', 'aa', 'aaa', 'ah', 'alif', 'ha'],
    aliasesArabic: ['ا', 'أ', 'آ', 'ء', 'ألف', 'أَ'],
  },
  'ba': {
    letter: 'بَ',
    name: 'Ba',
    aliasesLatin: ['ba', 'baa', 'bah', 'mbak', 'bar', 'pa', 'pak'],
    aliasesArabic: ['ب', 'با', 'باء', 'به', 'بَ'],
  },
  'ta': {
    letter: 'تَ',
    name: 'Ta',
    aliasesLatin: ['ta', 'taa', 'tah', 'tar', 'te'],
    aliasesArabic: ['ت', 'تا', 'تاء', 'ته', 'تَ'],
  },
  'tsa': {
    letter: 'ثَ',
    name: 'Tsa',
    aliasesLatin: ['tsa', 'tsaa', 'sa', 'saa', 'sah', 'ca', 'tha'],
    aliasesArabic: ['ث', 'ثا', 'ثاء', 'ثه', 'ثَ'],
  },

  // Unit 2: Ja, Ha, Kho
  'ja': {
    letter: 'جَ',
    name: 'Ja',
    aliasesLatin: ['ja', 'jaa', 'jah', 'za', 'jim'],
    aliasesArabic: ['ج', 'جا', 'جيم', 'جه', 'جَ'],
  },
  'ha': {
    letter: 'حَ',
    name: 'Ha',
    aliasesLatin: ['ha', 'haa', 'hah', 'hha', 'he', 'kha'],
    aliasesArabic: ['ح', 'حا', 'حاء', 'حه', 'حَ'],
  },
  'kho': {
    letter: 'خَ',
    name: 'Kho',
    aliasesLatin: ['kho', 'khoo', 'kha', 'khaa', 'co', 'ko', 'khok', 'khot'],
    aliasesArabic: ['خ', 'خا', 'خاء', 'خه', 'خَ'],
  },

  // Unit 3: Da, Dza, Ro, Za
  'da': {
    letter: 'دَ',
    name: 'Da',
    aliasesLatin: ['da', 'daa', 'dah', 'dal', 'de'],
    aliasesArabic: ['د', 'دا', 'دال', 'ده', 'دَ'],
  },
  'dza': {
    letter: 'ذَ',
    name: 'Dza',
    aliasesLatin: ['dza', 'dzaa', 'za', 'zaa', 'zah', 'dhal', 'zal'],
    aliasesArabic: ['ذ', 'ذا', 'ذال', 'ذه', 'ذَ'],
  },
  'ro': {
    letter: 'رَ',
    name: 'Ro',
    aliasesLatin: ['ro', 'roo', 'ra', 'raa', 'roh', 'rah'],
    aliasesArabic: ['ر', 'را', 'راء', 'ره', 'رَ'],
  },
  'za': {
    letter: 'زَ',
    name: 'Za',
    aliasesLatin: ['za', 'zaa', 'zah', 'zay', 'zai'],
    aliasesArabic: ['ز', 'زا', 'زاي', 'زه', 'زَ'],
  },

  // Unit 4: Sa, Sya, Sho, Dho
  'sa': {
    letter: 'سَ',
    name: 'Sa',
    aliasesLatin: ['sa', 'saa', 'sah', 'sin', 'se'],
    aliasesArabic: ['س', 'سا', 'سين', 'سه', 'سَ'],
  },
  'sya': {
    letter: 'شَ',
    name: 'Sya',
    aliasesLatin: ['sya', 'syaa', 'sha', 'shaa', 'syah', 'syin'],
    aliasesArabic: ['ش', 'شا', 'شين', 'شه', 'شَ'],
  },
  'sho': {
    letter: 'صَ',
    name: 'Sho',
    aliasesLatin: ['sho', 'shoo', 'so', 'soo', 'soh', 'shod', 'sod'],
    aliasesArabic: ['ص', 'صا', 'صاد', 'صه', 'صَ'],
  },
  'dho': {
    letter: 'ضَ',
    name: 'Dho',
    aliasesLatin: ['dho', 'dhoo', 'do', 'doo', 'dhoh', 'dhod', 'dod'],
    aliasesArabic: ['ض', 'ضا', 'ضاد', 'ضه', 'ضَ'],
  },

  // Unit 5: Tho, Zho, 'A, Gho
  'tho': {
    letter: 'طَ',
    name: 'Tho',
    aliasesLatin: ['tho', 'thoo', 'to', 'too', 'toh', 'thod', 'tha'],
    aliasesArabic: ['ط', 'طا', 'طاء', 'طه', 'طَ'],
  },
  'zho': {
    letter: 'ظَ',
    name: 'Zho',
    aliasesLatin: ['zho', 'zhoo', 'zo', 'zoo', 'dzo', 'dzoo', 'zhod'],
    aliasesArabic: ['ظ', 'ظا', 'ظاء', 'ظه', 'ظَ'],
  },
  "'a": {
    letter: 'عَ',
    name: "'A",
    aliasesLatin: ["'a", 'a', 'aa', 'ah', 'ain', 'nga', 'ngah', 'nga'],
    aliasesArabic: ['ع', 'عا', 'عين', 'عه', 'عَ'],
  },
  'gho': {
    letter: 'غَ',
    name: 'Gho',
    aliasesLatin: ['gho', 'ghoo', 'go', 'goo', 'gha', 'ghaa', 'ghoin'],
    aliasesArabic: ['غ', 'غا', 'غين', 'غه', 'غَ'],
  },

  // Unit 6: Fa, Qo, Ka, La
  'fa': {
    letter: 'فَ',
    name: 'Fa',
    aliasesLatin: ['fa', 'faa', 'fah', 'pa', 've'],
    aliasesArabic: ['ف', 'فا', 'فاء', 'فه', 'فَ'],
  },
  'qo': {
    letter: 'قَ',
    name: 'Qo',
    aliasesLatin: ['qo', 'qoo', 'ko', 'koo', 'qof', 'kof', 'kopl'],
    aliasesArabic: ['ق', 'قا', 'قاف', 'قه', 'قَ'],
  },
  'ka': {
    letter: 'كَ',
    name: 'Ka',
    aliasesLatin: ['ka', 'kaa', 'kah', 'kaf'],
    aliasesArabic: ['ك', 'كا', 'كاف', 'كه', 'كَ'],
  },
  'la': {
    letter: 'لَ',
    name: 'La',
    aliasesLatin: ['la', 'laa', 'lah', 'lam'],
    aliasesArabic: ['ل', 'لا', 'لام', 'له', 'لَ'],
  },

  // Unit 7: Ma, Na, Wa, Ha, Ya
  'ma': {
    letter: 'مَ',
    name: 'Ma',
    aliasesLatin: ['ma', 'maa', 'mah', 'mim'],
    aliasesArabic: ['م', 'ما', 'ميم', 'مه', 'مَ'],
  },
  'na': {
    letter: 'نَ',
    name: 'Na',
    aliasesLatin: ['na', 'naa', 'nah', 'nun'],
    aliasesArabic: ['ن', 'نا', 'نون', 'نه', 'نَ'],
  },
  'wa': {
    letter: 'وَ',
    name: 'Wa',
    aliasesLatin: ['wa', 'waa', 'wah', 'wau', 'wawu'],
    aliasesArabic: ['و', 'وا', 'واو', 'وه', 'وَ'],
  },
  'ha2': {
    letter: 'هَ',
    name: 'Ha',
    aliasesLatin: ['ha', 'haa', 'hah', 'he'],
    aliasesArabic: ['ه', 'ها', 'هاء', 'هه', 'هَ'],
  },
  'ya': {
    letter: 'يَ',
    name: 'Ya',
    aliasesLatin: ['ya', 'yaa', 'yah', 'ye'],
    aliasesArabic: ['ي', 'يا', 'ياء', 'يه', 'يَ'],
  },
};

/**
 * Normalisasi teks: hilangkan harakat Arab, tanda baca, spasi ganda, dan ubah ke huruf kecil.
 */
export function normalizeSpokenText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // strip Arabic diacritics
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Menghitung Levenshtein Distance sederhana untuk toleransi tipo fonetik 1 huruf
 */
export function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const aLen = a.length;
  const bLen = b.length;

  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  for (let i = 0; i <= bLen; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= aLen; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bLen; i++) {
    for (let j = 1; j <= aLen; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[bLen][aLen];
}

export interface PronunciationMatchResult {
  isMatch: boolean;
  confidence: number;
  matchedWord?: string;
  transcriptSample: string;
}

/**
 * Mengevaluasi apakah hasil pengenalan suara cocok dengan target huruf atau kata.
 * 
 * @param transcripts Daftar hipotesis hasil pengenalan suara (dari SpeechRecognitionAlternatives)
 * @param targetName Nama latin huruf, misal "Ba" atau "Bata"
 * @param targetLetter Karakter huruf Arab, misal "بَ"
 * @param customExpected Daftar alternatif kata kunci tambahan khusus (opsional)
 */
export function evaluatePronunciation(
  transcripts: string[],
  targetName: string,
  targetLetter: string,
  customExpected?: string[]
): PronunciationMatchResult {
  const normTargetName = normalizeSpokenText(targetName);
  const normTargetLetter = normalizeSpokenText(targetLetter);

  // Kumpulkan semua kandidat yang sah
  const validCandidates = new Set<string>();
  if (normTargetName) validCandidates.add(normTargetName);
  if (normTargetLetter) validCandidates.add(normTargetLetter);

  // Tambahkan variasi tanpa spasi (misal "ba ta" -> "bata")
  validCandidates.add(normTargetName.replace(/\s+/g, ''));

  // Ambil dari kamus jika ada
  const dictKey = normTargetName.replace(/['`’\s]/g, '');
  const entry = HIJAIYAH_PHONETIC_DICT[dictKey] || HIJAIYAH_PHONETIC_DICT[normTargetName];
  if (entry) {
    entry.aliasesLatin.forEach((al) => validCandidates.add(normalizeSpokenText(al)));
    entry.aliasesArabic.forEach((ar) => validCandidates.add(normalizeSpokenText(ar)));
  }

  // Tambahkan custom expected jika ada
  if (customExpected) {
    customExpected.forEach((ce) => validCandidates.add(normalizeSpokenText(ce)));
  }

  // Evaluasi setiap hipotesis transkripsi yang didengar mic
  for (const rawTranscript of transcripts) {
    const normalized = normalizeSpokenText(rawTranscript);
    if (!normalized) continue;

    const words = normalized.split(' ');

    // 1. Cek Exact Match langsung pada kalimat utuh
    for (const cand of validCandidates) {
      if (normalized === cand || normalized.replace(/\s+/g, '') === cand) {
        return {
          isMatch: true,
          confidence: 1.0,
          matchedWord: cand,
          transcriptSample: rawTranscript,
        };
      }
    }

    // 2. Cek apakah ada kata dalam transkripsi yang persis cocok
    for (const word of words) {
      for (const cand of validCandidates) {
        if (word === cand) {
          return {
            isMatch: true,
            confidence: 0.95,
            matchedWord: word,
            transcriptSample: rawTranscript,
          };
        }
      }
    }

    // 3. Cek Substring Match (e.g. anak bilang "ini huruf ba" -> mengandung "ba")
    for (const cand of validCandidates) {
      if (cand.length >= 2 && normalized.includes(cand)) {
        return {
          isMatch: true,
          confidence: 0.85,
          matchedWord: cand,
          transcriptSample: rawTranscript,
        };
      }
    }

    // 4. Cek Fuzzy Levenshtein (jarak 1 karakter, e.g. "bah" vs "ba", "pa" vs "ba")
    for (const word of words) {
      for (const cand of validCandidates) {
        if (cand.length >= 2 && word.length >= 2) {
          const dist = getLevenshteinDistance(word, cand);
          if (dist <= 1) {
            return {
              isMatch: true,
              confidence: 0.8,
              matchedWord: word,
              transcriptSample: rawTranscript,
            };
          }
        }
      }
    }
  }

  return {
    isMatch: false,
    confidence: 0,
    transcriptSample: transcripts[0] || '',
  };
}
