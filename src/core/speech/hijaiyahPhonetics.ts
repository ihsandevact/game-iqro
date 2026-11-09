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
    aliasesLatin: ['a', 'aa', 'aaa', 'ah', 'alif', 'hamzah', 'hamza', 'e', 'eh'],
    aliasesArabic: ['ا', 'أ', 'آ', 'ء', 'ألف', 'أَ', 'همزة', 'إ'],
  },
  'ba': {
    letter: 'بَ',
    name: 'Ba',
    aliasesLatin: ['ba', 'baa', 'baaa', 'bah', 'b', 'be', 'bee', 'mba', 'mbak', 'mbah', 'bar', 'bha'],
    aliasesArabic: ['ب', 'با', 'باء', 'به', 'بَ'],
  },
  'ta': {
    letter: 'تَ',
    name: 'Ta',
    aliasesLatin: ['ta', 'taa', 'taaa', 'tah', 't', 'te', 'tee', 'teh', 'tar', 'tak', 'toa', 'to'],
    aliasesArabic: ['ت', 'تا', 'تاء', 'ته', 'تَ', 'ة'],
  },
  'tsa': {
    letter: 'ثَ',
    name: 'Tsa',
    aliasesLatin: ['tsa', 'tsaa', 'tsaaa', 'tsah', 'ts', 'sa', 'saa', 'sah', 'ca', 'caa', 'cah', 'cha', 'tha', 'se', 'tsya', 'ce'],
    aliasesArabic: ['ث', 'ثا', 'ثاء', 'ثه', 'ثَ'],
  },

  // Unit 2: Ja, Ha, Kho
  'ja': {
    letter: 'جَ',
    name: 'Ja',
    aliasesLatin: ['ja', 'jaa', 'jaaa', 'jah', 'j', 'je', 'jee', 'jak', 'jim', 'zhim'],
    aliasesArabic: ['ج', 'جا', 'جيم', 'جه', 'جَ'],
  },
  'ha': {
    letter: 'حَ',
    name: 'Ha',
    aliasesLatin: ['ha', 'haa', 'haaa', 'hah', 'h', 'hha', 'he', 'hee'],
    aliasesArabic: ['ح', 'حا', 'حاء', 'حه', 'حَ'],
  },
  'kho': {
    letter: 'خَ',
    name: 'Kho',
    aliasesLatin: ['kho', 'khoo', 'kha', 'khaa', 'kh', 'co', 'ko', 'kaa', 'khok', 'khot', 'khe', 'ho', 'hoh', 'khor', 'khol'],
    aliasesArabic: ['خ', 'خا', 'خاء', 'خه', 'خَ'],
  },

  // Unit 3: Da, Dza, Ro, Za
  'da': {
    letter: 'دَ',
    name: 'Da',
    aliasesLatin: ['da', 'daa', 'daaa', 'dah', 'd', 'de', 'dee', 'dal'],
    aliasesArabic: ['د', 'دا', 'دal', 'ده', 'دَ'],
  },
  'dza': {
    letter: 'ذَ',
    name: 'Dza',
    aliasesLatin: ['dza', 'dzaa', 'dzah', 'dz', 'za', 'zaa', 'zah', 'dhal', 'zal', 'dze'],
    aliasesArabic: ['ذ', 'ذا', 'ذal', 'ذه', 'ذَ'],
  },
  'ro': {
    letter: 'رَ',
    name: 'Ro',
    aliasesLatin: ['ro', 'roo', 'ra', 'raa', 'roh', 'rah', 'r', 're', 'er'],
    aliasesArabic: ['ر', 'را', 'راء', 'ره', 'رَ'],
  },
  'za': {
    letter: 'زَ',
    name: 'Za',
    aliasesLatin: ['za', 'zaa', 'zah', 'z', 'zay', 'zai', 'ze', 'zet'],
    aliasesArabic: ['ز', 'زا', 'زاي', 'زه', 'زَ'],
  },

  // Unit 4: Sa, Sya, Sho, Dho
  'sa': {
    letter: 'سَ',
    name: 'Sa',
    aliasesLatin: ['sa', 'saa', 'sah', 's', 'sin', 'se'],
    aliasesArabic: ['س', 'سا', 'سين', 'سه', 'سَ'],
  },
  'sya': {
    letter: 'شَ',
    name: 'Sya',
    aliasesLatin: ['sya', 'syaa', 'syah', 'sha', 'shaa', 'shah', 'syin', 'shin', 'sy'],
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
    aliasesLatin: ['tho', 'thoo', 'to', 'too', 'toh', 'thod'],
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
    aliasesLatin: ["'a", "'aa", "'ah", 'ain', 'ayn', 'nga', 'ngah', 'ngaa', 'aain', 'ng'],
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
    aliasesLatin: ['fa', 'faa', 'fah', 'f', 'fe', 've', 'pa', 'fathah'],
    aliasesArabic: ['ف', 'فا', 'فاء', 'فه', 'فَ'],
  },
  'qo': {
    letter: 'قَ',
    name: 'Qo',
    aliasesLatin: ['qo', 'qoo', 'ko', 'koo', 'qof', 'kof', 'q'],
    aliasesArabic: ['ق', 'قا', 'قاف', 'قه', 'قَ'],
  },
  'ka': {
    letter: 'كَ',
    name: 'Ka',
    aliasesLatin: ['ka', 'kaa', 'kah', 'k', 'kaf', 'ke'],
    aliasesArabic: ['ك', 'كا', 'كاف', 'كه', 'كَ'],
  },
  'la': {
    letter: 'لَ',
    name: 'La',
    aliasesLatin: ['la', 'laa', 'lah', 'l', 'lam', 'le', 'el'],
    aliasesArabic: ['ل', 'لا', 'لام', 'له', 'لَ'],
  },

  // Unit 7: Ma, Na, Wa, Ha, Ya
  'ma': {
    letter: 'مَ',
    name: 'Ma',
    aliasesLatin: ['ma', 'maa', 'mah', 'm', 'mim', 'me', 'em'],
    aliasesArabic: ['م', 'ما', 'ميم', 'مه', 'مَ'],
  },
  'na': {
    letter: 'نَ',
    name: 'Na',
    aliasesLatin: ['na', 'naa', 'nah', 'n', 'nun', 'ne', 'en'],
    aliasesArabic: ['ن', 'نا', 'نون', 'نه', 'نَ'],
  },
  'wa': {
    letter: 'وَ',
    name: 'Wa',
    aliasesLatin: ['wa', 'waa', 'wah', 'w', 'wau', 'wawu', 'we'],
    aliasesArabic: ['و', 'وا', 'واو', 'وه', 'وَ'],
  },
  'ha2': {
    letter: 'هَ',
    name: 'Ha',
    aliasesLatin: ['ha', 'haa', 'hah', 'h', 'he', 'ha besar'],
    aliasesArabic: ['ه', 'ها', 'هاء', 'هه', 'هَ'],
  },
  'ya': {
    letter: 'يَ',
    name: 'Ya',
    aliasesLatin: ['ya', 'yaa', 'yah', 'y', 'ye'],
    aliasesArabic: ['ي', 'يا', 'ياء', 'يه', 'يَ'],
  },
};

/**
 * Normalisasi teks: hilangkan harakat Arab, tanda baca, aksen latin, spasi ganda, dan ubah ke huruf kecil.
 */
export function normalizeSpokenText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // hilangkan aksen latin (á -> a, dll)
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
  identifiedLetter?: string;
  transcriptSample: string;
}

/**
 * Mendeteksi apakah suatu kata/kalimat mengandung pengucapan huruf Hijaiyah tertentu.
 * Mengembalikan nama kanonikal huruf (misal "Ba", "Ta", "Alif", dll) atau null.
 */
export function identifySpokenHijaiyahLetter(text: string): string | null {
  const norm = normalizeSpokenText(text);
  if (!norm) return null;

  const words = norm.split(' ');

  for (const [, entry] of Object.entries(HIJAIYAH_PHONETIC_DICT)) {
    const normName = normalizeSpokenText(entry.name);
    const normLetter = normalizeSpokenText(entry.letter);
    const latinAliases = entry.aliasesLatin.map(normalizeSpokenText);
    const arabicAliases = entry.aliasesArabic.map(normalizeSpokenText);
    const allAliases = new Set([normName, normLetter, ...latinAliases, ...arabicAliases]);

    // Cek kecocokan kalimat utuh
    if (allAliases.has(norm) || allAliases.has(norm.replace(/\s+/g, ''))) {
      return entry.name;
    }

    // Cek kecocokan per kata
    for (const w of words) {
      if (allAliases.has(w)) {
        return entry.name;
      }
    }
  }

  return null;
}

/**
 * Mencari entri fonetik huruf Hijaiyah berdasarkan nama target atau karakter huruf Arab.
 * Mendukung pencarian fleksibel (misal: 'Kha' -> 'kho', 'Alif' -> 'a', 'رَ' -> 'ro').
 */
export function findPhoneticEntry(targetName: string, targetLetter: string): PhoneticEntry | null {
  const normName = normalizeSpokenText(targetName).replace(/['`’\s]/g, '');
  const normLetter = normalizeSpokenText(targetLetter);

  // 1. Direct key match (e.g. 'ba', 'ta', 'kho')
  if (HIJAIYAH_PHONETIC_DICT[normName]) return HIJAIYAH_PHONETIC_DICT[normName];

  // 2. Direct name match (case-insensitive)
  for (const [, entry] of Object.entries(HIJAIYAH_PHONETIC_DICT)) {
    if (normalizeSpokenText(entry.name) === normName) return entry;
  }

  // 3. Match by Arabic letter (e.g. 'بَ', 'تَ', 'خَ', 'ب')
  if (normLetter) {
    for (const [, entry] of Object.entries(HIJAIYAH_PHONETIC_DICT)) {
      if (normalizeSpokenText(entry.letter) === normLetter) return entry;
      if (entry.aliasesArabic.map(normalizeSpokenText).includes(normLetter)) return entry;
    }
  }

  // 4. Match in aliases (e.g. 'kha' -> 'kho', 'ra' -> 'ro', 'alif' -> 'a')
  for (const [, entry] of Object.entries(HIJAIYAH_PHONETIC_DICT)) {
    if (entry.aliasesLatin.map(normalizeSpokenText).includes(normName)) return entry;
  }

  return null;
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

  // Kumpulkan semua kandidat yang sah untuk target ini
  const validCandidates = new Set<string>();
  if (normTargetName) validCandidates.add(normTargetName);
  if (normTargetLetter) validCandidates.add(normTargetLetter);

  // Tambahkan variasi tanpa spasi (misal "ba ta" -> "bata")
  validCandidates.add(normTargetName.replace(/\s+/g, ''));

  // Ambil dari kamus menggunakan pencari pintar
  const entry = findPhoneticEntry(targetName, targetLetter);
  if (entry) {
    validCandidates.add(normalizeSpokenText(entry.name));
    validCandidates.add(normalizeSpokenText(entry.letter));
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

    // 2. Cek apakah ada kata dalam transkripsi yang persis cocok (Word boundary match)
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

    // 3. Cek Substring Match HANYA untuk target majemuk / panjang (>= 4 karakter, misal "bata", "alif")
    // Jangan izinkan pada suku kata 2 huruf agar kata seperti "tidak" tidak salah mencocokkan "da"
    for (const cand of validCandidates) {
      if (cand.length >= 4 && normalized.includes(cand)) {
        return {
          isMatch: true,
          confidence: 0.85,
          matchedWord: cand,
          transcriptSample: rawTranscript,
        };
      }
    }

    // 4. Cek Fuzzy Levenshtein HANYA untuk kata yang panjang (>= 4 karakter, misal "hamzah" vs "hamsah")
    // DILARANG keras pada kata 1-3 huruf karena akan menukar huruf konsonan (e.g. 'ba' vs 'ta' berjarak 1)
    for (const word of words) {
      for (const cand of validCandidates) {
        if (cand.length >= 4 && word.length >= 4) {
          const dist = getLevenshteinDistance(word, cand);
          if (dist <= 1) {
            return {
              isMatch: true,
              confidence: 0.8,
              matchedWord: cand,
              transcriptSample: rawTranscript,
            };
          }
        }
      }
    }
  }

  // Deteksi huruf lain yang mungkin diucapkan secara salah (misal dilayar TA tapi ucapkan BA)
  const identifiedOther = transcripts.length > 0 ? identifySpokenHijaiyahLetter(transcripts[0]) : null;

  return {
    isMatch: false,
    confidence: 0,
    identifiedLetter: identifiedOther || undefined,
    transcriptSample: transcripts[0] || '',
  };
}
