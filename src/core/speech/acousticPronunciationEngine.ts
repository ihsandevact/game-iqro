/**
 * Acoustic DSP + MFCC / Mel-Spectrogram + Formant Locus Pronunciation Engine
 *
 * Mesin deteksi pengucapan huruf Hijaiyah 100% lokal berbasis Web Audio API (PCM + FFT).
 * Dilengkapi:
 * 1. Kalibrasi Hening Wajib (Mandatory Ambient Noise Calibration) selama 12 frame pertama
 * 2. Volume Murni berbasis Noise-Subtracted Time-Domain RMS (0% saat diam/hening)
 * 3. 240ms Pre-Roll Raw Float32Array PCM Ring Buffer agar konsonan awal (B, T, Ts, J, H, Kh, S, Sy)
 *    tertangkap 100% utuh sebelum vokal inti dimulai
 * 4. Ekstraksi Fitur PCM Terpadu (Goertzel 12-Band Mel + F1/F2 Formant + F2 Locus Transition Slope)
 * 5. Klasifikasi 7 Kelompok Makhraj & Kompetisi 1-vs-All terhadap Referensi MP3
 */

import { LETTER_AUDIO_MAP } from '../audio/ttsNarrator';

export type MicSensitivityLevel = 'high' | 'normal' | 'low';

export type MakhrajArticulatoryClass =
  | 'glottal_vowel'
  | 'labial_soft'
  | 'coronal_voiced'
  | 'plosive_burst'
  | 'sibilant_fricative'
  | 'breath_fricative'
  | 'heavy_tafkhim';

export interface AcousticFrame {
  rms: number;
  netRms: number;
  snrRatio: number;
  volumePercent: number;
  spectrumBars: number[]; // 9 bar tinggi spektrum real-time (10..100)
  zcr: number;
  centroidHz: number;
  melBands: number[]; // Raw 12 Mel band magnitudes
  normMelBands: number[]; // L2-normalized 12 Mel bands
  formantDominance: number; // Proporsi energi formant vokal (180Hz-2400Hz) terhadap total spektrum
  lowVoiceEnergy: number;
  f1CloseEnergy: number;
  f1Energy: number;
  f2LowEnergy: number;
  f2HighEnergy: number;
  midHighEnergy: number;
  highFreqEnergy: number;
  f1Hz: number;
  f2Hz: number;
}

export interface ReferenceAcousticProfile {
  letterKey: string;
  makhrajClass: MakhrajArticulatoryClass;
  onsetMel: number[];
  nucleusMel: number[];
  overallMel: number[];
  onsetZcr: number;
  maxOnsetZcr: number;
  onsetCentroidHz: number;
  nucleusCentroidHz: number;
  lowVoiceOnsetRatio: number;
  midHighOnsetRatio: number;
  highFreqOnsetRatio: number;
  f1Hz: number;
  f2Hz: number;
  f2OnsetHz: number;
  f2TransitionSlopeHz: number;
  f1Ratio: number;
  f2Ratio: number;
  formantDominance: number;
  syllableCount: number;
}

export interface AcousticEvaluationResult {
  isMatch: boolean;
  score: number;
  durationMs: number;
  peakVolume: number;
  recordedAudioUrl: string | null;
  feedback: string;
  detectedVowelType: 'A' | 'O' | 'I' | 'U' | 'unknown';
}

export interface StartAcousticSessionOptions {
  deviceId?: string;
  sensitivity?: MicSensitivityLevel;
  targetName: string;
  targetLetter: string;
  attemptNumber?: number;
  onMicReady?: (micLabel: string, isContextRunning: boolean) => void;
  onVolume: (volumePercent: number, isSpeaking: boolean, spectrumBars: number[]) => void;
  onSpeechStart: () => void;
  onSpeechReset?: () => void;
  onSpeechProgress?: (durationMs: number) => void;
  onEvaluation: (result: AcousticEvaluationResult) => void;
  onError?: (errMessage: string) => void;
}

const MEL_BAND_EDGES_HZ = [
  90, 180, 300, 450, 650, 900, 1250, 1700, 2300, 3100, 4200, 5600, 7500,
];

const CORE_COMPETITOR_KEYS = [
  'a',
  'ba',
  'ta',
  'tsa',
  'ja',
  'ha',
  'kho',
  'da',
  'ro',
  'sa',
  'sya',
  'ma',
];

const ROUNDED_VOWEL_O_PREFIXES = [
  'kho',
  'kha',
  'ro',
  'ra',
  'sho',
  'shod',
  'dho',
  'dhod',
  'tho',
  'thod',
  'zho',
  'dhzo',
  'gho',
  'ghoin',
  'qo',
  'qof',
];

const GLOTTAL_VOWEL_SET = new Set([
  'a',
  'aa',
  'alif',
  'hamzah',
  'i',
  'ii',
  'u',
  'uu',
  "'a",
  '’a',
  '`a',
  "'aa",
  "'i",
  '’i',
  '`i',
  "'ii",
  "'u",
  '’u',
  '`u',
  "'uu",
  'ain',
  "'ain",
  'ain_a',
  'ain_aa',
  'ain_i',
  'ain_ii',
  'ain_u',
  'ain_uu',
]);

const LABIAL_SOFT_SET = new Set([
  'ba',
  'baa',
  'bi',
  'bii',
  'bu',
  'buu',
  'ma',
  'mim',
  'maa',
  'mi',
  'mii',
  'mu',
  'muu',
  'wa',
  'waw',
  'wau',
  'waa',
  'wi',
  'wii',
  'wu',
  'wuu',
]);

const CORONAL_VOICED_SET = new Set([
  'da',
  'dal',
  'daa',
  'di',
  'dii',
  'du',
  'duu',
  'dza',
  'dzal',
  'dzaa',
  'dzi',
  'dzii',
  'dzu',
  'dzuu',
  'la',
  'lam',
  'laa',
  'li',
  'lii',
  'lu',
  'luu',
  'na',
  'nun',
  'naa',
  'ni',
  'nii',
  'nu',
  'nuu',
  'ya',
  'yaa',
  'yi',
  'yii',
  'yu',
  'yuu',
]);

const PLOSIVE_BURST_SET = new Set([
  'ta',
  'taa',
  'ti',
  'tii',
  'tu',
  'tuu',
  'ja',
  'jim',
  'jaa',
  'ji',
  'jii',
  'ju',
  'juu',
  'ka',
  'kaf',
  'kaa',
  'ki',
  'kii',
  'ku',
  'kuu',
]);

const SIBILANT_FRICATIVE_SET = new Set([
  'tsa',
  'tha',
  'tsaa',
  'tsi',
  'tsii',
  'tsu',
  'tsuu',
  'sa',
  'sin',
  'saa',
  'si',
  'sii',
  'su',
  'suu',
  'sya',
  'syin',
  'syaa',
  'syi',
  'syii',
  'syu',
  'syuu',
  'za',
  'zai',
  'zay',
  'zaa',
  'zi',
  'zii',
  'zu',
  'zuu',
]);

const BREATH_FRICATIVE_SET = new Set([
  'fa',
  'faa',
  'fi',
  'fii',
  'fu',
  'fuu',
  'ha',
  'haaa',
  'hi',
  'hii',
  'hu',
  'huu',
  'haa',
  'ha_besar',
]);

const CALIBRATION_FRAMES = 12;
const MAX_PRE_ROLL_PCM_CHUNKS = 11; // ~250ms @ 44.1kHz (1024 samples/chunk)
const MAX_PRE_ROLL_FRAMES = 9; // ~150ms @ 60fps

// Precomputed Hamming window untuk Goertzel frame penuh (N = 512)
const GOERTZEL_SUB_N = 512;
const HAMMING_WINDOW_512 = new Float32Array(GOERTZEL_SUB_N);
for (let n = 0; n < GOERTZEL_SUB_N; n++) {
  HAMMING_WINDOW_512[n] = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (GOERTZEL_SUB_N - 1));
}

export class AcousticPronunciationEngine {
  private sharedAudioContext: AudioContext | null = null;
  private rawAnalyser: AnalyserNode | null = null;
  private freqAnalyser: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private scriptProcessorNode: ScriptProcessorNode | null = null;
  private silentGainNode: GainNode | null = null;
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private lastRecordedUrl: string | null = null;
  private activeMicLabel = '';

  private latestHardwarePcmRms = 0;
  private latestHardwareZcr = 0;
  private scriptProcessorChunksReceived = 0;

  // Ring buffer PCM & Frame untuk menangkap 100% konsonan awal (Pre-Roll 240ms)
  private preRollPcmRing: Float32Array[] = [];
  private recordedPcmChunks: Float32Array[] = [];
  private preRollFramesRing: AcousticFrame[] = [];

  private animFrameId: number | null = null;
  private isRunning = false;

  // Kalibrasi Noise Floor Adaptif
  private noiseFloorRms = 0.0035;
  private calibrationSumRms = 0;
  private calibrationCount = 0;
  private frameCounter = 0;

  private isCurrentlySpeaking = false;
  private speechStartTime: number | null = null;
  private lastVoiceActiveTime = 0;
  private consecutiveVoiceFrames = 0;
  private capturedFrames: AcousticFrame[] = [];
  private peakVolumeInSession = 0;
  private peakSnrInSession = 0;
  private isEvaluating = false;

  private referenceCache = new Map<string, ReferenceAcousticProfile>();
  private hasTriggeredBankPreload = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockHandler = () => {
        this.ensureAudioContextUnlocked();
      };
      window.addEventListener('pointerdown', unlockHandler, { passive: true });
      window.addEventListener('touchstart', unlockHandler, { passive: true });
      window.addEventListener('keydown', unlockHandler, { passive: true });
    }
  }

  public ensureAudioContextUnlocked(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.sharedAudioContext || this.sharedAudioContext.state === 'closed') {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.sharedAudioContext = new AudioCtx();
      }
      if (this.sharedAudioContext.state === 'suspended') {
        this.sharedAudioContext.resume().catch(() => {});
      }
      return this.sharedAudioContext;
    } catch {
      return null;
    }
  }

  public async getAvailableMicrophones(): Promise<MediaDeviceInfo[]> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) {
      return [];
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((d) => d.kind === 'audioinput');
    } catch {
      return [];
    }
  }

  public getActiveMicLabel(): string {
    return this.activeMicLabel;
  }

  public classifyMakhrajGroup(targetKey: string): MakhrajArticulatoryClass {
    const rawClean = (targetKey || '').trim().toLowerCase();
    // Untuk bacaan bersambung Iqro 2/3 (misal "ba-ta"), gunakan suku kata pertama untuk klasifikasi onset awal
    const clean = rawClean.includes('-') ? rawClean.split('-')[0].trim() : rawClean;
    if (GLOTTAL_VOWEL_SET.has(clean)) return 'glottal_vowel';
    if (LABIAL_SOFT_SET.has(clean)) return 'labial_soft';
    if (CORONAL_VOICED_SET.has(clean)) return 'coronal_voiced';
    if (PLOSIVE_BURST_SET.has(clean)) return 'plosive_burst';
    if (SIBILANT_FRICATIVE_SET.has(clean)) return 'sibilant_fricative';
    if (BREATH_FRICATIVE_SET.has(clean)) return 'breath_fricative';
    for (const prefix of ROUNDED_VOWEL_O_PREFIXES) {
      if (clean === prefix || clean.startsWith(prefix)) {
        return 'heavy_tafkhim';
      }
    }
    if (
      clean.startsWith('kh') ||
      clean.startsWith('sh') ||
      clean.startsWith('dh') ||
      clean.startsWith('th') ||
      clean.startsWith('zh') ||
      clean.startsWith('gh') ||
      clean.startsWith('q') ||
      clean.startsWith('r')
    ) {
      return 'heavy_tafkhim';
    }
    return 'coronal_voiced';
  }

  public getExpectedVowelType(targetKey: string): 'A' | 'O' | 'I' | 'U' {
    const rawClean = (targetKey || '').trim().toLowerCase();
    const clean = rawClean.includes('-') ? rawClean.split('-')[0].trim() : rawClean;
    if ((clean.endsWith('u') || clean.endsWith('uu')) && clean !== 'wau') {
      return 'U';
    }
    if ((clean.endsWith('i') || clean.endsWith('ii')) && clean !== 'zai') {
      return 'I';
    }
    for (const prefix of ROUNDED_VOWEL_O_PREFIXES) {
      if (clean === prefix || clean === `${prefix}o` || clean.startsWith(prefix)) {
        return 'O';
      }
    }
    return 'A';
  }

  public async preloadReferenceProfile(
    targetName: string,
    targetLetter: string
  ): Promise<ReferenceAcousticProfile | null> {
    const key = (targetName || targetLetter || '').trim().toLowerCase();
    if (!key) return null;

    if (!this.hasTriggeredBankPreload && typeof window !== 'undefined') {
      this.hasTriggeredBankPreload = true;
      setTimeout(() => {
        for (const compKey of CORE_COMPETITOR_KEYS) {
          this.loadSingleReferenceProfile(compKey, compKey).catch(() => {});
        }
      }, 150);
    }

    return this.loadSingleReferenceProfile(key, targetLetter);
  }

  private async loadSingleReferenceProfile(
    key: string,
    targetLetter?: string
  ): Promise<ReferenceAcousticProfile | null> {
    if (this.referenceCache.has(key)) {
      return this.referenceCache.get(key)!;
    }

    if (typeof window === 'undefined' || typeof fetch === 'undefined') {
      return null;
    }

    const audioUrl =
      LETTER_AUDIO_MAP[key] ||
      (targetLetter ? LETTER_AUDIO_MAP[targetLetter.trim()] : undefined) ||
      `/audio/letters/${key.replace(/[^a-z0-9_]/g, '')}.mp3`;

    try {
      const response = await fetch(audioUrl);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();

      const OfflineCtx =
        window.OfflineAudioContext ||
        (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext })
          .webkitOfflineAudioContext;
      const tempCtx = new OfflineCtx(1, 44100 * 2, 44100);
      const audioBuffer = await tempCtx.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;

      const profile = this.extractProfileFromPcm(key, channelData, sampleRate, 0.0015);
      if (profile) {
        this.referenceCache.set(key, profile);
      }
      return profile;
    } catch {
      return null;
    }
  }

  public setReferenceProfileForTesting(key: string, profile: ReferenceAcousticProfile): void {
    this.referenceCache.set(key.toLowerCase(), profile);
  }

  /**
   * Ekstraksi Fitur Akustik & Fonetik Presisi Tinggi dari Raw Float32Array PCM.
   * Digunakan secara identik untuk file MP3 referensi maupun rekaman suara mikrofon pengguna.
   */
  public extractProfileFromPcm(
    letterKey: string,
    pcm: Float32Array,
    sampleRate: number,
    noiseFloorHint = 0.002
  ): ReferenceAcousticProfile | null {
    const frameSize = 512;
    const hopSize = 256;
    if (pcm.length < frameSize) return null;

    const frameStats: { offset: number; rms: number; zcr: number }[] = [];
    let maxRms = 0;

    for (let offset = 0; offset + frameSize <= pcm.length; offset += hopSize) {
      let sumSq = 0;
      for (let i = 0; i < frameSize; i++) {
        const s = pcm[offset + i];
        sumSq += s * s;
      }
      const rms = Math.sqrt(sumSq / frameSize);
      if (rms > maxRms) maxRms = rms;
      frameStats.push({ offset, rms, zcr: 0 });
    }

    if (maxRms < 0.0012 || frameStats.length === 0) return null;

    // Estimasi noise floor dari persentil bawah sinyal (jangan gunakan maxRms * 0.12 karena menelan konsonan lembut seperti Tsa/Fa/Ha)
    const sortedRms = [...frameStats.map((f) => f.rms)].sort((a, b) => a - b);
    const p15Rms = sortedRms[Math.floor(sortedRms.length * 0.15)] || 0.001;
    const floorRms = Math.max(0.0008, Math.min(noiseFloorHint * 1.15, maxRms * 0.05), p15Rms);
    const zcrDeadband = Math.max(0.0018, floorRms * 1.45);

    // Hitung ZCR dengan Noise-Gate Hysteresis Deadband agar derau ruangan hening ZCR = 0
    for (const st of frameStats) {
      let gatedZc = 0;
      for (let i = 1; i < frameSize; i++) {
        const prev = pcm[st.offset + i - 1];
        const curr = pcm[st.offset + i];
        if (Math.abs(prev) > zcrDeadband || Math.abs(curr) > zcrDeadband) {
          if ((prev >= 0 && curr < 0) || (prev < 0 && curr >= 0)) {
            gatedZc++;
          }
        }
      }
      st.zcr = gatedZc / frameSize;
    }

    // 1. Cari batas vokal inti (vocal core)
    const vocalCoreThreshold = Math.max(floorRms * 2.5, maxRms * 0.22);
    let firstVocalIdx = -1;
    let lastVocalIdx = -1;
    for (let idx = 0; idx < frameStats.length; idx++) {
      if (frameStats[idx].rms >= vocalCoreThreshold) {
        if (firstVocalIdx === -1) firstVocalIdx = idx;
        lastVocalIdx = idx;
      }
    }

    if (firstVocalIdx === -1) {
      firstVocalIdx = 0;
      lastVocalIdx = frameStats.length - 1;
    }

    // 2. Mundur hingga 15 frame (~87ms @ hop=256) sebelum vokal untuk menangkap 100% konsonan awal
    // (Tanpa break pada jeda VOT singkat, dan mendukung konsonan frikatif lembut seperti Tsa/Fa/Ha/Ta)
    let startIdx = firstVocalIdx;
    const consonantMinRms = Math.max(floorRms * 1.6, maxRms * 0.032);
    for (let idx = firstVocalIdx - 1; idx >= Math.max(0, firstVocalIdx - 15); idx--) {
      const st = frameStats[idx];
      if (st.rms >= consonantMinRms || st.zcr >= 0.042) {
        startIdx = idx;
      }
    }

    const endIdx = Math.min(frameStats.length - 1, lastVocalIdx + 1);

    // 3. Hitung Jumlah Suku Kata (Syllable Envelope Peaks) untuk menolak kata multi-suku kata
    const syllableCount = this.countSyllablePeaks(
      frameStats.slice(startIdx, endIdx + 1).map((f) => f.rms),
      maxRms,
      floorRms
    );

    // 4. Analisis Goertzel 64-bin Power Spectrum (512 sampel penuh per frame) & Formant F1/F2
    const activeFrames: {
      rms: number;
      zcr: number;
      centroidHz: number;
      melBands: number[];
      lowVoiceRatio: number;
      midHighRatio: number;
      highFreqRatio: number;
      f1Close: number;
      f1Open: number;
      f2Low: number;
      f2High: number;
      f1Hz: number;
      f2Hz: number;
      formantDominance: number;
    }[] = [];

    const numBins = 64;

    for (let idx = startIdx; idx <= endIdx; idx++) {
      const { offset, rms, zcr } = frameStats[idx];
      if (rms < consonantMinRms * 0.85 && !(idx < firstVocalIdx && zcr >= 0.042)) continue;

      const melBands = new Array(12).fill(0);
      let weightedFreqSum = 0;
      let totalPowerSum = 0;
      let lowVoice = 0;
      let f1Close = 0;
      let f1Open = 0;
      let f1WeightedSum = 0;
      let f1PowerSum = 0;
      let f2Low = 0;
      let f2High = 0;
      let f2WeightedSum = 0;
      let f2PowerSum = 0;
      let midHigh = 0;
      let highFreq = 0;

      for (let b = 1; b <= numBins; b++) {
        const freq = (b * 7500) / numBins;
        if (freq < 85 || freq > 7500) continue;

        const omega = (2 * Math.PI * freq) / sampleRate;
        const coeff = 2 * Math.cos(omega);

        let q1 = 0;
        let q2 = 0;
        for (let n = 0; n < GOERTZEL_SUB_N; n++) {
          const q0 = coeff * q1 - q2 + pcm[offset + n] * HAMMING_WINDOW_512[n];
          q2 = q1;
          q1 = q0;
        }
        const power = Math.max(0, q1 * q1 + q2 * q2 - q1 * q2 * coeff);

        weightedFreqSum += freq * power;
        totalPowerSum += power;

        if (freq >= 90 && freq <= 480) lowVoice += power;
        if (freq >= 200 && freq <= 440) f1Close += power;
        if (freq >= 450 && freq <= 840) f1Open += power;
        if (freq >= 220 && freq <= 840) {
          f1WeightedSum += freq * power;
          f1PowerSum += power;
        }
        if (freq >= 880 && freq <= 1350) f2Low += power;
        if (freq > 1350 && freq <= 2450) f2High += power;
        if (freq >= 880 && freq <= 2450) {
          f2WeightedSum += freq * power;
          f2PowerSum += power;
        }
        if (freq >= 1600 && freq <= 3800) midHigh += power;
        if (freq >= 2200 && freq <= 6800) highFreq += power;

        for (let m = 0; m < 12; m++) {
          if (freq >= MEL_BAND_EDGES_HZ[m] && freq < MEL_BAND_EDGES_HZ[m + 1]) {
            melBands[m] += Math.sqrt(power);
            break;
          }
        }
      }

      const centroidHz = totalPowerSum > 0 ? weightedFreqSum / totalPowerSum : 500;
      const normMel = this.normalizeVector(melBands);
      const lowVoiceRatio = totalPowerSum > 0 ? lowVoice / totalPowerSum : 0;
      const midHighRatio = totalPowerSum > 0 ? midHigh / totalPowerSum : 0;
      const highFreqRatio = totalPowerSum > 0 ? highFreq / totalPowerSum : 0;
      const f1Hz = f1PowerSum > 0 ? f1WeightedSum / f1PowerSum : 550;
      const f2Hz = f2PowerSum > 0 ? f2WeightedSum / f2PowerSum : 1450;
      const formantDominance =
        totalPowerSum > 0 ? (f1Close + f1Open + f2Low + f2High) / totalPowerSum : 0;

      activeFrames.push({
        rms,
        zcr,
        centroidHz,
        melBands: normMel,
        lowVoiceRatio,
        midHighRatio,
        highFreqRatio,
        f1Close,
        f1Open,
        f2Low,
        f2High,
        f1Hz,
        f2Hz,
        formantDominance,
      });
    }

    if (activeFrames.length === 0) return null;

    const n = activeFrames.length;
    // Onset konsonan berada di 2..8 frame pertama (~12ms - 48ms @ hop=256)
    const onsetCount = Math.max(2, Math.min(8, Math.ceil(n * 0.24)));
    const onsetSlice = activeFrames.slice(0, onsetCount);

    // Inti vokal (nucleus) berada di 40%..85% bagian tengah suku kata (setelah transisi konsonan selesai)
    const nucStart = Math.min(n - 1, Math.max(1, Math.floor(n * 0.4)));
    const nucEnd = Math.max(nucStart + 1, Math.ceil(n * 0.85));
    const nucleusSlice = activeFrames.slice(nucStart, nucEnd);

    // Transisi awal konsonan-ke-vokal: 3 frame pertama begitu pita suara mulai bergetar (vokal mulai)
    const vocalStartFrames = activeFrames
      .filter(
        (f) =>
          f.formantDominance >= 0.6 &&
          f.highFreqRatio < 0.16 &&
          f.zcr < 0.11 &&
          f.rms >= maxRms * 0.35
      )
      .slice(0, 3);
    const transitionStartSlice =
      vocalStartFrames.length > 0 ? vocalStartFrames : activeFrames.slice(0, 3);

    const avgMel = (slice: typeof activeFrames) => {
      const sum = new Array(12).fill(0);
      for (const f of slice) {
        for (let i = 0; i < 12; i++) sum[i] += f.melBands[i];
      }
      return this.normalizeVector(sum.map((v) => v / Math.max(1, slice.length)));
    };

    const onsetZcr = onsetSlice.reduce((a, b) => a + b.zcr, 0) / onsetSlice.length;
    const maxOnsetZcr = Math.max(...onsetSlice.map((f) => f.zcr));
    const onsetCentroidHz =
      onsetSlice.reduce((a, b) => a + b.centroidHz, 0) / onsetSlice.length;
    const nucleusCentroidHz =
      nucleusSlice.reduce((a, b) => a + b.centroidHz, 0) / nucleusSlice.length;

    const lowVoiceOnsetRatio =
      onsetSlice.reduce((a, b) => a + b.lowVoiceRatio, 0) / onsetSlice.length;
    const midHighOnsetRatio =
      onsetSlice.reduce((a, b) => a + b.midHighRatio, 0) / onsetSlice.length;
    const highFreqOnsetRatio =
      onsetSlice.reduce((a, b) => a + b.highFreqRatio, 0) / onsetSlice.length;

    const f1Hz = nucleusSlice.reduce((a, b) => a + b.f1Hz, 0) / nucleusSlice.length;
    const f2Hz = nucleusSlice.reduce((a, b) => a + b.f2Hz, 0) / nucleusSlice.length;
    const f2OnsetHz =
      transitionStartSlice.reduce((a, b) => a + b.f2Hz, 0) / transitionStartSlice.length;
    const f2TransitionSlopeHz = f2Hz - f2OnsetHz;

    const totalF1Close = nucleusSlice.reduce((a, b) => a + b.f1Close, 0);
    const totalF1Open = nucleusSlice.reduce((a, b) => a + b.f1Open, 0);
    const f1Ratio =
      totalF1Close + totalF1Open > 0 ? totalF1Open / (totalF1Close + totalF1Open) : 0.6;

    const totalF2Low = nucleusSlice.reduce((a, b) => a + b.f2Low, 0);
    const totalF2High = nucleusSlice.reduce((a, b) => a + b.f2High, 0);
    const f2Ratio =
      totalF2Low + totalF2High > 0 ? totalF2High / (totalF2Low + totalF2High) : 0.5;

    const formantDominance =
      nucleusSlice.reduce((a, b) => a + b.formantDominance, 0) / nucleusSlice.length;

    return {
      letterKey: letterKey.toLowerCase(),
      makhrajClass: this.classifyMakhrajGroup(letterKey),
      onsetMel: avgMel(onsetSlice),
      nucleusMel: avgMel(nucleusSlice),
      overallMel: avgMel(activeFrames),
      onsetZcr,
      maxOnsetZcr,
      onsetCentroidHz,
      nucleusCentroidHz,
      lowVoiceOnsetRatio,
      midHighOnsetRatio,
      highFreqOnsetRatio,
      f1Hz,
      f2Hz,
      f2OnsetHz,
      f2TransitionSlopeHz,
      f1Ratio,
      f2Ratio,
      formantDominance,
      syllableCount,
    };
  }

  /**
   * Menghitung jumlah puncak amplop energi suku kata untuk menolak kata multi-suku kata
   * (misal "Halo", "Bapak", "Satu dua") tanpa salah menghitung letupan konsonan awal (VOT)
   */
  private countSyllablePeaks(rmsArray: number[], maxRms: number, floorRms: number): number {
    if (rmsArray.length < 10) return 1;

    // Haluskan amplop RMS dengan moving average 3-frame
    const smooth = rmsArray.map((_, idx) => {
      const prev = rmsArray[Math.max(0, idx - 1)];
      const curr = rmsArray[idx];
      const next = rmsArray[Math.min(rmsArray.length - 1, idx + 1)];
      return (prev + curr + next) / 3;
    });

    const peakMinThreshold = Math.max(floorRms * 2.8, maxRms * 0.38);
    const dipThreshold = Math.max(floorRms * 1.8, maxRms * 0.18);

    let syllablePeaks = 0;
    let inSyllable = false;
    let currentPeakFrames = 0;
    let currentSilenceDipFrames = 0;

    for (let i = 0; i < smooth.length; i++) {
      if (!inSyllable) {
        if (smooth[i] >= peakMinThreshold) {
          currentPeakFrames++;
          // Puncak suku kata vokal wajib bertahan minimal 5 frame (~30ms)
          // agar letupan plosif singkat tidak dihitung sebagai suku kata terpisah
          if (currentPeakFrames >= 5) {
            inSyllable = true;
            syllablePeaks++;
            currentSilenceDipFrames = 0;
          }
        } else {
          currentPeakFrames = 0;
        }
      } else {
        if (smooth[i] < dipThreshold) {
          currentSilenceDipFrames++;
          // Lembah jeda antar suku kata wajib turun selama >= 5 frame (~30ms setelah penghalusan)
          if (currentSilenceDipFrames >= 5) {
            inSyllable = false;
            currentPeakFrames = 0;
          }
        } else {
          currentSilenceDipFrames = 0;
        }
      }
    }

    return Math.max(1, syllablePeaks);
  }

  /**
   * Mulai sesi tangkapan suara real-time dengan Kalibrasi Hening Wajib,
   * Pre-Roll 240ms PCM Ring Buffer, & Syarat Amplop Suku Kata
   */
  public async startSession(options: StartAcousticSessionOptions): Promise<boolean> {
    this.stopSession();

    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      if (options.onError) {
        options.onError('Browser tidak mendukung akses mikrofon (getUserMedia).');
      }
      return false;
    }

    const ctx = this.ensureAudioContextUnlocked();
    if (!ctx) {
      if (options.onError) {
        options.onError('Gagal menyiapkan sistem pengolahan suara (AudioContext).');
      }
      return false;
    }

    this.preloadReferenceProfile(options.targetName, options.targetLetter).catch(() => {});

    try {
      try {
        const constraints: MediaStreamConstraints = {
          audio: {
            echoCancellation: true,
            noiseSuppression: false,
            autoGainControl: true,
            ...(options.deviceId ? { deviceId: { exact: options.deviceId } } : {}),
          },
        };

        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const track = this.stream.getAudioTracks()[0];
      this.activeMicLabel = track?.label || 'Mikrofon Bawaan';

      const sensitivity = options.sensitivity || 'high';

      this.sourceNode = ctx.createMediaStreamSource(this.stream);

      // 1. Time-Domain Analyser murni
      this.rawAnalyser = ctx.createAnalyser();
      this.rawAnalyser.fftSize = 1024;
      this.rawAnalyser.smoothingTimeConstant = 0.2;
      this.sourceNode.connect(this.rawAnalyser);

      // 2. Frequency Analyser dengan minDecibels wajar (-80 dB) agar derau hening tidak terangkat
      this.freqAnalyser = ctx.createAnalyser();
      this.freqAnalyser.fftSize = 1024;
      this.freqAnalyser.minDecibels = -80;
      this.freqAnalyser.maxDecibels = -15;
      this.freqAnalyser.smoothingTimeConstant = 0.2;
      this.sourceNode.connect(this.freqAnalyser);

      // Reset buffer Pre-Roll & Rekaman PCM
      this.latestHardwarePcmRms = 0;
      this.latestHardwareZcr = 0;
      this.scriptProcessorChunksReceived = 0;
      this.preRollPcmRing = [];
      this.recordedPcmChunks = [];
      this.preRollFramesRing = [];

      // 3. ScriptProcessorNode menangkap raw Float32Array PCM secara kontinu (termasuk Pre-Roll 240ms!)
      try {
        this.scriptProcessorNode = ctx.createScriptProcessor(1024, 1, 1);
        this.scriptProcessorNode.onaudioprocess = (event: AudioProcessingEvent) => {
          if (!this.isRunning) return;
          const input = event.inputBuffer.getChannelData(0);
          const chunkCopy = new Float32Array(input.length);
          let sumSq = 0;
          let zc = 0;
          for (let i = 0; i < input.length; i++) {
            const s = input[i];
            chunkCopy[i] = s;
            sumSq += s * s;
            if (i > 0 && ((input[i - 1] >= 0 && s < 0) || (input[i - 1] < 0 && s >= 0))) {
              zc++;
            }
          }
          this.latestHardwarePcmRms = Math.sqrt(sumSq / input.length);
          this.latestHardwareZcr = zc / input.length;
          this.scriptProcessorChunksReceived++;

          if (this.frameCounter > CALIBRATION_FRAMES) {
            if (this.isCurrentlySpeaking) {
              this.recordedPcmChunks.push(chunkCopy);
            } else {
              this.preRollPcmRing.push(chunkCopy);
              if (this.preRollPcmRing.length > MAX_PRE_ROLL_PCM_CHUNKS) {
                this.preRollPcmRing.shift();
              }
            }
          }
        };
      } catch {
        this.scriptProcessorNode = null;
      }

      this.silentGainNode = ctx.createGain();
      this.silentGainNode.gain.value = 0.00001;

      if (this.scriptProcessorNode) {
        this.freqAnalyser.connect(this.scriptProcessorNode);
        this.scriptProcessorNode.connect(this.silentGainNode);
      } else {
        this.freqAnalyser.connect(this.silentGainNode);
      }
      this.silentGainNode.connect(ctx.destination);

      this.startMediaRecorder(this.stream);

      // Reset state deteksi & mulai kalibrasi noise floor
      this.isRunning = true;
      this.isCurrentlySpeaking = false;
      this.isEvaluating = false;
      this.speechStartTime = null;
      this.lastVoiceActiveTime = 0;
      this.consecutiveVoiceFrames = 0;
      this.capturedFrames = [];
      this.peakVolumeInSession = 0;
      this.peakSnrInSession = 0;
      this.noiseFloorRms = 0.0035;
      this.calibrationSumRms = 0;
      this.calibrationCount = 0;
      this.frameCounter = 0;

      if (options.onMicReady) {
        options.onMicReady(this.activeMicLabel, ctx.state === 'running');
      }

      const volumeThreshold = sensitivity === 'high' ? 18 : sensitivity === 'normal' ? 26 : 36;
      const minSnrThreshold = sensitivity === 'high' ? 2.2 : sensitivity === 'normal' ? 2.6 : 3.2;

      const rawByteTimeData = new Uint8Array(this.rawAnalyser.fftSize);
      const rawFloatTimeData = new Float32Array(this.rawAnalyser.fftSize);
      const byteFreqData = new Uint8Array(this.freqAnalyser.frequencyBinCount);
      const sampleRate = ctx.sampleRate || 44100;

      const processAudioLoop = () => {
        if (!this.isRunning || !this.rawAnalyser || !this.freqAnalyser || this.isEvaluating) {
          return;
        }

        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }

        this.frameCounter++;
        const isCalibrating = this.frameCounter <= CALIBRATION_FRAMES;

        const frame = this.extractCleanFrame(
          this.rawAnalyser,
          this.freqAnalyser,
          rawByteTimeData,
          rawFloatTimeData,
          byteFreqData,
          sampleRate,
          sensitivity,
          isCalibrating
        );

        // Fallback perekaman PCM jika ScriptProcessorNode tidak terpanggil di browser tertentu
        if (!isCalibrating && this.scriptProcessorChunksReceived === 0) {
          const fallbackChunk = new Float32Array(rawFloatTimeData.length);
          fallbackChunk.set(rawFloatTimeData);
          if (this.isCurrentlySpeaking) {
            this.recordedPcmChunks.push(fallbackChunk);
          } else {
            this.preRollPcmRing.push(fallbackChunk);
            if (this.preRollPcmRing.length > MAX_PRE_ROLL_PCM_CHUNKS) {
              this.preRollPcmRing.shift();
            }
          }
        }

        // Fase 1: Kalibrasi Hening Wajib (12 frame pertama ~200ms)
        if (isCalibrating) {
          if (frame.rms > 0.0001) {
            this.calibrationSumRms += frame.rms;
            this.calibrationCount++;
            const avgCalib = this.calibrationSumRms / this.calibrationCount;
            this.noiseFloorRms = Math.max(0.0018, Math.min(0.025, avgCalib));
          }
          options.onVolume(0, false, frame.spectrumBars);
          this.animFrameId = requestAnimationFrame(processAudioLoop);
          return;
        }

        // Adaptasi perlahan noise floor saat sedang tidak berbicara
        if (
          !this.isCurrentlySpeaking &&
          frame.rms > 0.0001 &&
          frame.rms < this.noiseFloorRms * 1.45
        ) {
          this.noiseFloorRms = Math.max(
            0.0018,
            Math.min(0.03, this.noiseFloorRms * 0.94 + frame.rms * 0.06)
          );
        }

        // Syarat bahwa frame ini adalah SUARA VOKAL MANUSIA
        const hasVocalFormants =
          frame.f1CloseEnergy + frame.f1Energy + frame.f2LowEnergy + frame.f2HighEnergy > 12 &&
          frame.formantDominance >= 0.36;

        const isFrameVocal =
          frame.volumePercent >= volumeThreshold &&
          frame.snrRatio >= minSnrThreshold &&
          hasVocalFormants;

        const now = performance.now();

        if (!this.isCurrentlySpeaking) {
          this.preRollFramesRing.push(frame);
          if (this.preRollFramesRing.length > MAX_PRE_ROLL_FRAMES) {
            this.preRollFramesRing.shift();
          }
        }

        if (isFrameVocal) {
          this.consecutiveVoiceFrames++;
          this.lastVoiceActiveTime = now;

          if (frame.volumePercent > this.peakVolumeInSession) {
            this.peakVolumeInSession = frame.volumePercent;
          }
          if (frame.snrRatio > this.peakSnrInSession) {
            this.peakSnrInSession = frame.snrRatio;
          }

          // Mulai fase berbicara setelah minimal 3 frame vokal berturut-turut (~50ms)
          // DAN sertakan seluruh Pre-Roll PCM & Frame agar konsonan awal tertangkap 100%!
          if (!this.isCurrentlySpeaking && this.consecutiveVoiceFrames >= 3) {
            this.isCurrentlySpeaking = true;
            this.speechStartTime = now - 75;

            // Sertakan Pre-Roll PCM Chunks (~240ms sebelum vokal)
            this.recordedPcmChunks = [...this.preRollPcmRing];
            this.preRollPcmRing = [];

            // Sertakan frame onset konsonan dari preRollFramesRing yang berada di atas noise floor
            const preRollOnsetFrames = this.preRollFramesRing.filter(
              (f) => f.snrRatio >= 1.35 || f.zcr >= 0.065
            );
            this.capturedFrames = [...preRollOnsetFrames.slice(-6)];
            this.preRollFramesRing = [];

            options.onSpeechStart();
          }

          if (this.isCurrentlySpeaking) {
            this.capturedFrames.push(frame);
            const currentDur = now - (this.speechStartTime || now);
            if (options.onSpeechProgress) {
              options.onSpeechProgress(Math.round(currentDur));
            }

            // PROTEKSI DERAU KONTINU (> 1800ms tanpa kembali ke hening)
            if (currentDur > 1800) {
              this.noiseFloorRms = Math.min(
                0.04,
                Math.max(this.noiseFloorRms * 1.35, frame.rms * 0.9)
              );
              this.isCurrentlySpeaking = false;
              this.speechStartTime = null;
              this.consecutiveVoiceFrames = 0;
              this.capturedFrames = [];
              this.recordedPcmChunks = [];
              this.preRollPcmRing = [];
              this.preRollFramesRing = [];
              this.peakVolumeInSession = 0;
              this.peakSnrInSession = 0;
              if (options.onSpeechReset) {
                options.onSpeechReset();
              }
            }
          }
        } else {
          this.consecutiveVoiceFrames = 0;

          if (this.isCurrentlySpeaking && this.speechStartTime) {
            const totalDurationMs = this.lastVoiceActiveTime - this.speechStartTime;
            const silenceDurationMs = now - this.lastVoiceActiveTime;

            if (silenceDurationMs < 50) {
              this.capturedFrames.push(frame);
            }

            // SYARAT AMPLOP SUKU KATA SELESAI:
            // 1. Durasi vokal antara 95ms s/d 1600ms
            // 2. Kembali hening selama minimal 230ms
            // 3. Minimal 4 frame vokal dengan puncak volume >= 20%
            if (
              totalDurationMs >= 95 &&
              totalDurationMs <= 1600 &&
              silenceDurationMs >= 230 &&
              this.capturedFrames.length >= 4 &&
              this.peakVolumeInSession >= 20
            ) {
              this.finishAndEvaluate(options, sampleRate);
              return;
            }

            // Jika bunyi terlalu pendek (< 95ms) dan sudah hening > 300ms, reset
            if (totalDurationMs < 95 && silenceDurationMs > 300) {
              this.isCurrentlySpeaking = false;
              this.speechStartTime = null;
              this.capturedFrames = [];
              this.recordedPcmChunks = [];
              this.preRollPcmRing = [];
              this.preRollFramesRing = [];
              this.peakVolumeInSession = 0;
              this.peakSnrInSession = 0;
              if (options.onSpeechReset) {
                options.onSpeechReset();
              }
            }
          }
        }

        options.onVolume(
          frame.volumePercent,
          this.isCurrentlySpeaking || isFrameVocal,
          frame.spectrumBars
        );
        this.animFrameId = requestAnimationFrame(processAudioLoop);
      };

      this.animFrameId = requestAnimationFrame(processAudioLoop);
      return true;
    } catch (err: any) {
      this.stopSession();
      if (options.onError) {
        options.onError(
          err?.message ||
            'Izin mikrofon belum diberikan atau mikrofon sedang digunakan aplikasi lain.'
        );
      }
      return false;
    }
  }

  /**
   * Ekstrak volume murni (Noise-Subtracted Time-Domain RMS) dan spektrum frekuensi per frame
   */
  private extractCleanFrame(
    rawAnalyser: AnalyserNode,
    freqAnalyser: AnalyserNode,
    rawByteTimeData: Uint8Array<ArrayBuffer>,
    rawFloatTimeData: Float32Array<ArrayBuffer>,
    byteFreqData: Uint8Array<ArrayBuffer>,
    sampleRate: number,
    sensitivity: MicSensitivityLevel,
    isCalibrating: boolean
  ): AcousticFrame {
    rawAnalyser.getByteTimeDomainData(rawByteTimeData);
    let byteSumSq = 0;
    let byteZc = 0;
    for (let i = 0; i < rawByteTimeData.length; i++) {
      const norm = (rawByteTimeData[i] - 128) / 128;
      byteSumSq += norm * norm;
      if (i > 0) {
        const prev = (rawByteTimeData[i - 1] - 128) / 128;
        if ((prev >= 0 && norm < 0) || (prev < 0 && norm >= 0)) {
          byteZc++;
        }
      }
    }
    const byteRms = Math.sqrt(byteSumSq / rawByteTimeData.length);
    const byteZcr = byteZc / rawByteTimeData.length;

    let floatRms = 0;
    let floatZcr = 0;
    if (typeof rawAnalyser.getFloatTimeDomainData === 'function') {
      rawAnalyser.getFloatTimeDomainData(rawFloatTimeData);
      let floatSumSq = 0;
      let floatZc = 0;
      for (let i = 0; i < rawFloatTimeData.length; i++) {
        const s = rawFloatTimeData[i];
        floatSumSq += s * s;
        if (
          i > 0 &&
          ((rawFloatTimeData[i - 1] >= 0 && s < 0) ||
            (rawFloatTimeData[i - 1] < 0 && s >= 0))
        ) {
          floatZc++;
        }
      }
      floatRms = Math.sqrt(floatSumSq / rawFloatTimeData.length);
      floatZcr = floatZc / rawFloatTimeData.length;
    }

    const rawRms = Math.max(byteRms, floatRms, this.latestHardwarePcmRms);
    const zcr = Math.max(byteZcr, floatZcr, this.latestHardwareZcr);

    const netRms = Math.max(0, rawRms - this.noiseFloorRms * 1.4);
    const snrRatio = rawRms / Math.max(0.0018, this.noiseFloorRms);

    const sensitivityGain =
      sensitivity === 'high' ? 680 : sensitivity === 'normal' ? 520 : 380;

    const volumePercent =
      isCalibrating || snrRatio < 1.5
        ? 0
        : Math.min(100, Math.round(netRms * sensitivityGain));

    freqAnalyser.getByteFrequencyData(byteFreqData);
    const binHz = sampleRate / freqAnalyser.fftSize;

    const melBands = new Array(12).fill(0);
    let totalEnergy = 0;
    let weightedFreqSum = 0;
    let lowVoiceEnergy = 0;
    let f1CloseEnergy = 0;
    let f1Energy = 0;
    let f1WeightedSum = 0;
    let f1MagSum = 0;
    let f2LowEnergy = 0;
    let f2HighEnergy = 0;
    let f2WeightedSum = 0;
    let f2MagSum = 0;
    let midHighEnergy = 0;
    let highFreqEnergy = 0;

    for (let i = 1; i < byteFreqData.length; i++) {
      const mag = byteFreqData[i];
      if (mag === 0) continue;

      const freq = i * binHz;
      if (freq < 80 || freq > 7500) continue;

      totalEnergy += mag;
      weightedFreqSum += freq * mag;

      if (freq >= 90 && freq <= 480) lowVoiceEnergy += mag;
      if (freq >= 200 && freq <= 440) f1CloseEnergy += mag;
      if (freq >= 450 && freq <= 860) f1Energy += mag;
      if (freq >= 220 && freq <= 860) {
        f1WeightedSum += freq * mag;
        f1MagSum += mag;
      }
      if (freq >= 850 && freq <= 1350) f2LowEnergy += mag;
      if (freq > 1350 && freq <= 2450) f2HighEnergy += mag;
      if (freq >= 850 && freq <= 2450) {
        f2WeightedSum += freq * mag;
        f2MagSum += mag;
      }
      if (freq >= 1600 && freq <= 3800) midHighEnergy += mag;
      if (freq >= 2200 && freq <= 6800) highFreqEnergy += mag;

      for (let m = 0; m < 12; m++) {
        if (freq >= MEL_BAND_EDGES_HZ[m] && freq < MEL_BAND_EDGES_HZ[m + 1]) {
          melBands[m] += mag;
          break;
        }
      }
    }

    const centroidHz = totalEnergy > 0 ? weightedFreqSum / totalEnergy : 0;
    const f1Hz = f1MagSum > 0 ? f1WeightedSum / f1MagSum : 550;
    const f2Hz = f2MagSum > 0 ? f2WeightedSum / f2MagSum : 1450;

    const formantBandSum = melBands.slice(1, 7).reduce((a, b) => a + b, 0);
    const allMelSum = melBands.reduce((a, b) => a + b, 0);
    const formantDominance = allMelSum > 0 ? formantBandSum / allMelSum : 0;

    const barMultipliers = [0.65, 0.85, 1.1, 0.9, 1.25, 1.0, 1.15, 0.8, 0.95];
    const spectrumBars = barMultipliers.map((mult, idx) => {
      if (volumePercent === 0) return 10;
      const melRatio = allMelSum > 0 ? (melBands[idx] || 0) / (allMelSum / 9) : 0.8;
      const barVal = Math.round(volumePercent * (0.65 * mult + 0.35 * Math.min(1.5, melRatio)));
      return Math.max(10, Math.min(100, barVal));
    });

    return {
      rms: rawRms,
      netRms,
      snrRatio,
      volumePercent,
      spectrumBars,
      zcr,
      centroidHz,
      melBands,
      normMelBands: this.normalizeVector(melBands),
      formantDominance,
      lowVoiceEnergy,
      f1CloseEnergy,
      f1Energy,
      f2LowEnergy,
      f2HighEnergy,
      midHighEnergy,
      highFreqEnergy,
      f1Hz,
      f2Hz,
    };
  }

  private mergeRecordedPcmChunks(): Float32Array {
    if (this.recordedPcmChunks.length === 0) return new Float32Array(0);
    const totalLength = this.recordedPcmChunks.reduce((acc, c) => acc + c.length, 0);
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of this.recordedPcmChunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    return merged;
  }

  private buildProfileFromFramesFallback(
    letterKey: string,
    frames: AcousticFrame[]
  ): ReferenceAcousticProfile | null {
    if (frames.length === 0) return null;
    const n = frames.length;
    const onsetCount = Math.max(1, Math.min(5, Math.ceil(n * 0.3)));
    const onsetSlice = frames.slice(0, onsetCount);
    const nucStart = Math.min(n - 1, Math.max(1, Math.floor(n * 0.25)));
    const nucEnd = Math.max(nucStart + 1, Math.ceil(n * 0.85));
    const nucleusSlice = frames.slice(nucStart, nucEnd);

    const avgMel = (slice: AcousticFrame[]) => {
      const sum = new Array(12).fill(0);
      for (const f of slice) {
        for (let i = 0; i < 12; i++) sum[i] += f.normMelBands[i];
      }
      return this.normalizeVector(sum.map((v) => v / Math.max(1, slice.length)));
    };

    const onsetZcr = onsetSlice.reduce((a, b) => a + b.zcr, 0) / onsetSlice.length;
    const maxOnsetZcr = Math.max(...onsetSlice.map((f) => f.zcr));
    const onsetCentroidHz =
      onsetSlice.reduce((a, b) => a + b.centroidHz, 0) / onsetSlice.length;
    const nucleusCentroidHz =
      nucleusSlice.reduce((a, b) => a + b.centroidHz, 0) / nucleusSlice.length;

    const lowVoiceOnsetRatio =
      onsetSlice.reduce((acc, f) => {
        const tot = Math.max(
          1,
          f.lowVoiceEnergy + f.f1Energy + f.f2LowEnergy + f.f2HighEnergy + f.highFreqEnergy
        );
        return acc + f.lowVoiceEnergy / tot;
      }, 0) / onsetSlice.length;

    const midHighOnsetRatio =
      onsetSlice.reduce((acc, f) => {
        const tot = Math.max(
          1,
          f.lowVoiceEnergy + f.f1Energy + f.f2LowEnergy + f.f2HighEnergy + f.highFreqEnergy
        );
        return acc + f.midHighEnergy / tot;
      }, 0) / onsetSlice.length;

    const highFreqOnsetRatio =
      onsetSlice.reduce((acc, f) => {
        const tot = Math.max(
          1,
          f.lowVoiceEnergy + f.f1Energy + f.f2LowEnergy + f.f2HighEnergy + f.highFreqEnergy
        );
        return acc + f.highFreqEnergy / tot;
      }, 0) / onsetSlice.length;

    const f1Hz = nucleusSlice.reduce((a, b) => a + b.f1Hz, 0) / nucleusSlice.length;
    const f2Hz = nucleusSlice.reduce((a, b) => a + b.f2Hz, 0) / nucleusSlice.length;
    const f2OnsetHz = onsetSlice.reduce((a, b) => a + b.f2Hz, 0) / onsetSlice.length;
    const f2TransitionSlopeHz = f2Hz - f2OnsetHz;

    const sumF1Close = nucleusSlice.reduce((a, b) => a + b.f1CloseEnergy, 0);
    const sumF1Open = nucleusSlice.reduce((a, b) => a + b.f1Energy, 0);
    const f1Ratio =
      sumF1Close + sumF1Open > 0 ? sumF1Open / (sumF1Close + sumF1Open) : 0.6;

    const sumF2Low = nucleusSlice.reduce((a, b) => a + b.f2LowEnergy, 0);
    const sumF2High = nucleusSlice.reduce((a, b) => a + b.f2HighEnergy, 0);
    const f2Ratio =
      sumF2Low + sumF2High > 0 ? sumF2High / (sumF2Low + sumF2High) : 0.5;

    const formantDominance =
      nucleusSlice.reduce((a, b) => a + b.formantDominance, 0) / nucleusSlice.length;

    const maxRms = Math.max(...frames.map((f) => f.rms), 0.01);
    const syllableCount = this.countSyllablePeaks(
      frames.map((f) => f.rms),
      maxRms,
      this.noiseFloorRms
    );

    return {
      letterKey: letterKey.toLowerCase(),
      makhrajClass: this.classifyMakhrajGroup(letterKey),
      onsetMel: avgMel(onsetSlice),
      nucleusMel: avgMel(nucleusSlice),
      overallMel: avgMel(frames),
      onsetZcr,
      maxOnsetZcr,
      onsetCentroidHz,
      nucleusCentroidHz,
      lowVoiceOnsetRatio,
      midHighOnsetRatio,
      highFreqOnsetRatio,
      f1Hz,
      f2Hz,
      f2OnsetHz,
      f2TransitionSlopeHz,
      f1Ratio,
      f2Ratio,
      formantDominance,
      syllableCount,
    };
  }

  private async finishAndEvaluate(
    options: StartAcousticSessionOptions,
    sampleRate = 44100
  ): Promise<void> {
    if (this.isEvaluating) return;
    this.isEvaluating = true;

    const frames = [...this.capturedFrames];
    const mergedPcm = this.mergeRecordedPcmChunks();
    const durationMs =
      this.speechStartTime && this.lastVoiceActiveTime
        ? Math.max(130, Math.round(this.lastVoiceActiveTime - this.speechStartTime))
        : frames.length * 16;
    const peakVolume = this.peakVolumeInSession;
    const currentNoiseFloor = this.noiseFloorRms;

    const recordedAudioUrl = await this.stopMediaRecorderAndGetUrl();
    this.cleanupAudioNodes();

    const refProfile = await this.preloadReferenceProfile(
      options.targetName,
      options.targetLetter
    );

    // Ekstrak profil PCM terpadu dari rekaman penuh (Pre-Roll + Utterance)
    const userPcmProfile =
      mergedPcm.length >= 2048
        ? this.extractProfileFromPcm('user', mergedPcm, sampleRate, currentNoiseFloor)
        : null;

    const evaluation = this.computeEvaluation(
      frames,
      durationMs,
      peakVolume,
      recordedAudioUrl,
      options.targetName,
      refProfile,
      options.attemptNumber || 1,
      userPcmProfile
    );

    options.onEvaluation(evaluation);
  }

  /**
   * Menghitung kemiripan gabungan (0..1) antara profil suara pengguna dan profil referensi
   */
  public computeProfileSimilarity(
    user: ReferenceAcousticProfile,
    ref: ReferenceAcousticProfile
  ): number {
    const onsetPearson = this.zeroMeanCorrelation(user.onsetMel, ref.onsetMel);
    const nucleusPearson = this.zeroMeanCorrelation(user.nucleusMel, ref.nucleusMel);
    const overallPearson = this.zeroMeanCorrelation(user.overallMel, ref.overallMel);

    const onsetCos = this.cosineSimilarity(user.onsetMel, ref.onsetMel);
    const nucleusCos = this.cosineSimilarity(user.nucleusMel, ref.nucleusMel);

    const normOnsetPearson = Math.max(0, (onsetPearson + 0.35) / 1.35);
    const normNucleusPearson = Math.max(0, (nucleusPearson + 0.35) / 1.35);
    const normOverallPearson = Math.max(0, (overallPearson + 0.35) / 1.35);

    const spectralSim =
      normOnsetPearson * 0.25 +
      onsetCos * 0.15 +
      normNucleusPearson * 0.2 +
      nucleusCos * 0.15 +
      normOverallPearson * 0.1;

    // Kemiripan artikulasi onset & formant (bobot 0.15)
    const zcrDiff = Math.min(1, Math.abs(user.maxOnsetZcr - ref.maxOnsetZcr) / 0.18);
    const hfDiff = Math.min(1, Math.abs(user.highFreqOnsetRatio - ref.highFreqOnsetRatio) / 0.28);
    const f2RatioDiff = Math.min(1, Math.abs(user.f2Ratio - ref.f2Ratio) / 0.35);
    const slopeSignMatch =
      (user.f2TransitionSlopeHz >= 15 && ref.f2TransitionSlopeHz >= 15) ||
      (user.f2TransitionSlopeHz <= -15 && ref.f2TransitionSlopeHz <= -15) ||
      (Math.abs(user.f2TransitionSlopeHz) < 35 && Math.abs(ref.f2TransitionSlopeHz) < 35)
        ? 1.0
        : 0.4;

    const articulatorySim =
      (1 - zcrDiff) * 0.3 +
      (1 - hfDiff) * 0.3 +
      (1 - f2RatioDiff) * 0.2 +
      slopeSignMatch * 0.2;

    return spectralSim + articulatorySim * 0.15;
  }

  /**
   * Evaluasi Kemiripan Akustik Presisi Tinggi:
   * - Gate 1: Durasi, Volume & Jumlah Suku Kata Tunggal
   * - Gate 2: Klasifikasi Vokal Inti ('A' vs 'O' vs 'I' vs 'U')
   * - Gate 3: Klasifikasi 7 Kelompok Makhraj Konsonan & Arah Transisi Formant F2 (F2 Locus)
   * - Gate 4: Kompetisi 1-vs-All Terhadap Profil Referensi Huruf Pesaing
   */
  public computeEvaluation(
    frames: AcousticFrame[],
    durationMs: number,
    peakVolume: number,
    recordedAudioUrl: string | null,
    targetName: string,
    refProfile: ReferenceAcousticProfile | null,
    attemptNumber: number,
    explicitUserProfile?: ReferenceAcousticProfile | null
  ): AcousticEvaluationResult {
    const cleanTarget = (targetName || '').trim().toLowerCase();

    // Gate 1: Durasi & Jumlah Frame Minimal
    if ((frames.length < 4 && !explicitUserProfile) || durationMs < 110 || peakVolume < 20) {
      return {
        isMatch: false,
        score: 30,
        durationMs,
        peakVolume,
        recordedAudioUrl,
        feedback: `Suara belum terdengar jelas. Ayo ucapkan "${targetName}" dengan lantang ya! 🎙️`,
        detectedVowelType: 'unknown',
      };
    }

    const userProfile =
      explicitUserProfile || this.buildProfileFromFramesFallback('user', frames);

    if (!userProfile) {
      return {
        isMatch: false,
        score: 32,
        durationMs,
        peakVolume,
        recordedAudioUrl,
        feedback: `Belum terdengar bunyi huruf. Yuk ucapkan "${targetName}" dengan jelas! 🎙️`,
        detectedVowelType: 'unknown',
      };
    }

    // Gate 2: Dominasi Formant Vokal Manusia (Menolak ketukan mikrofon / tiupan angin / noise)
    const avgSnr =
      frames.length > 0
        ? frames.reduce((acc, f) => acc + f.snrRatio, 0) / frames.length
        : 4.0;

    if (userProfile.formantDominance < 0.36 || avgSnr < 1.9) {
      return {
        isMatch: false,
        score: 35,
        durationMs,
        peakVolume,
        recordedAudioUrl,
        feedback: `Belum terdengar bunyi vokal huruf. Yuk ucapkan "${targetName}" dengan jelas! 🎙️`,
        detectedVowelType: 'unknown',
      };
    }

    // Gate 3: Penolakan Kata Bersuku Kata Banyak yang Melebihi Suku Kata Target
    const expectedSyllables = cleanTarget.includes('-')
      ? cleanTarget.split('-').filter(Boolean).length
      : 1;
    const maxAllowedSyllables = expectedSyllables === 1 ? 1 : expectedSyllables + 1;

    if (userProfile.syllableCount > maxAllowedSyllables) {
      return {
        isMatch: false,
        score: 42,
        durationMs,
        peakVolume,
        recordedAudioUrl,
        feedback: `Terdengar lebih dari ${expectedSyllables} suku kata (${userProfile.syllableCount} suku kata). Cukup ucapkan "${targetName}" saja ya! 🎯`,
        detectedVowelType: 'unknown',
      };
    }

    // Gate 4: Klasifikasi Vokal ('A' vs 'O' vs 'I' vs 'U')
    let detectedVowelType: 'A' | 'O' | 'I' | 'U' = 'A';
    if (userProfile.f1Ratio < 0.31 && userProfile.f1Hz < 435) {
      detectedVowelType = userProfile.f2Ratio >= 0.48 ? 'I' : 'U';
    } else if (userProfile.f2Ratio < 0.33 || userProfile.f2Hz < 1290) {
      detectedVowelType = 'O';
    } else {
      detectedVowelType = 'A';
    }

    const expectedVowel = this.getExpectedVowelType(cleanTarget);
    const targetMakhraj = this.classifyMakhrajGroup(cleanTarget);

    // Skor Dasar Suara Vokal 1-Suku Kata pada Mikrofon Nyata (80% - 95%)
    let targetSim = 0.78;
    if (refProfile) {
      targetSim = this.computeProfileSimilarity(userProfile, refProfile);
    }
    const melSimilarityScore = refProfile
      ? Math.min(95, Math.max(80, Math.round(74 + targetSim * 22)))
      : 84;

    let phoneticAdjustment = 0;
    let vowelClassMatch = true;
    let articulatoryClassMatch = true;
    let specificRejectionFeedback = '';

    // Validasi Vokal Inti (Menolak jika vokal jelas berbeda)
    if (expectedVowel === 'I') {
      if (detectedVowelType === 'I' || (userProfile.f1Hz < 480 && userProfile.f2Hz > 1520)) {
        phoneticAdjustment += 6;
      } else {
        vowelClassMatch = false;
        phoneticAdjustment -= 34;
        specificRejectionFeedback = `Terdengar bervokal "${detectedVowelType}". Huruf "${targetName}" berharakat Kasrah (bunyi "I") ya! 🎯`;
      }
    } else if (expectedVowel === 'U') {
      if (detectedVowelType === 'U' || (userProfile.f1Hz < 480 && userProfile.f2Hz < 1280)) {
        phoneticAdjustment += 6;
      } else {
        vowelClassMatch = false;
        phoneticAdjustment -= 34;
        specificRejectionFeedback = `Terdengar bervokal "${detectedVowelType}". Huruf "${targetName}" berharakat Dhammah (bunyi "U") ya! 🎯`;
      }
    } else if (expectedVowel === 'O') {
      // Target huruf tebal ('O': Kho, Ro, Sho, Dho, Tho, Zho, Gho, Qo)
      if (
        detectedVowelType === 'O' ||
        (userProfile.f2Ratio <= 0.55 && userProfile.f2Hz <= 1450)
      ) {
        phoneticAdjustment += 6;
      } else {
        vowelClassMatch = false;
        phoneticAdjustment -= 34;
        specificRejectionFeedback = `Terdengar bervokal tipis "${detectedVowelType}". Huruf "${targetName}" dibaca tebal berbunyi "O" ya! 🎯`;
      }
    } else {
      // Target huruf Fathah terbuka ('A': A, Ba, Ta, Tsa, Ja, Ha, Da, Dza, Za, Sa, Sya, Fa, Ka, La, Ma, Na, Wa, Ya)
      if (detectedVowelType === 'I' || detectedVowelType === 'U') {
        vowelClassMatch = false;
        phoneticAdjustment -= 34;
        specificRejectionFeedback = `Terdengar seperti vokal "${detectedVowelType}". Ini huruf "${targetName}" (vokal terbuka "A")! 🎯`;
      } else if (userProfile.f2Ratio < 0.28 && userProfile.f2Hz < 1245) {
        vowelClassMatch = false;
        phoneticAdjustment -= 34;
        specificRejectionFeedback = `Terdengar bervokal bulat "O" (seperti Kho/Ro). Huruf "${targetName}" dibaca terbuka "A" ya! 🎯`;
      } else {
        phoneticAdjustment += 6;
      }
    }

    // Gate 5: Validasi Kelompok Makhraj Konsonan (Pendekatan Real-Mic Ramah Pengguna seperti Huruf Tsa:
    // Hanya menolak apabila terdapat bukti akustik kuat dari makhraj yang berlawanan, tidak menghukum konsonan lembut)
    const {
      onsetZcr,
      maxOnsetZcr,
       midHighOnsetRatio,
      highFreqOnsetRatio,
      f2OnsetHz,
      f2TransitionSlopeHz,
    } = userProfile;
    const firstTargetSyl = cleanTarget.includes('-')
      ? cleanTarget.split('-')[0].trim()
      : cleanTarget;

    if (targetMakhraj === 'plosive_burst') {
      // Target: Ta, Ja, Ka
      const isTaTarget = firstTargetSyl.startsWith('t');
      const isJaTarget = firstTargetSyl.startsWith('j');
      const isBilabialRising =
        f2TransitionSlopeHz > 75 &&
        f2OnsetHz < 1260 &&
        maxOnsetZcr < 0.045 &&
        highFreqOnsetRatio < 0.05;
      // Hanya huruf Ta yang mengecek vokal datar murni 'A', sedangkan Ka (lokus velar F2 ~1480Hz) & Ja (bersuara/voiced) tidak dihukum jika letupan lembut di mikrofon
      const isPureFlatVowelA =
        isTaTarget &&
        maxOnsetZcr < 0.042 &&
        highFreqOnsetRatio < 0.02 &&
        midHighOnsetRatio < 0.11 &&
        Math.abs(f2TransitionSlopeHz) < 20 &&
        f2OnsetHz < 1520;
      const isHeavySibilantHiss =
        !isJaTarget &&
        onsetZcr > 0.22 &&
        highFreqOnsetRatio > 0.7;

      if (isBilabialRising || isPureFlatVowelA) {
        articulatoryClassMatch = false;
        phoneticAdjustment -= 34;
        if (!specificRejectionFeedback) {
          specificRejectionFeedback = `Terdengar seperti huruf lembut ("Ba/Ma/A"). Untuk "${targetName}", ucapkan letupan awal lidah dengan tegas ya! 🎯`;
        }
      } else if (isHeavySibilantHiss) {
        articulatoryClassMatch = false;
        phoneticAdjustment -= 32;
        if (!specificRejectionFeedback) {
          specificRejectionFeedback = `Terdengar mendesis panjang seperti "Sa/Sya". Huruf "${targetName}" diucapkan dengan letupan tegas! 🎯`;
        }
      } else {
        phoneticAdjustment += 6;
      }
    } else if (targetMakhraj === 'sibilant_fricative') {
      // Target: Tsa, Sa, Sya, Za
      const isSoftOrVoicedDental =
        firstTargetSyl.startsWith('ts') ||
        firstTargetSyl.startsWith('th') ||
        firstTargetSyl.startsWith('z');
      const isBilabialRising =
        f2TransitionSlopeHz > 75 && f2OnsetHz < 1260 && highFreqOnsetRatio < 0.08;

      if (isSoftOrVoicedDental) {
        // Huruf Tsa (ث) & Za (ز): pada mikrofon nyata konsonan awal Tsa (Hams interdental) dan Za (berdengung/voiced)
        // jauh lebih lembut dari Sa/Sya, sehingga cukup pastikan bukan bunyi bibir (Ba/Ma).
        if (isBilabialRising) {
          articulatoryClassMatch = false;
          phoneticAdjustment -= 34;
          if (!specificRejectionFeedback) {
            specificRejectionFeedback = `Belum terdengar sentuhan ujung lidah huruf "${targetName}" (terdengar seperti "Ba/Ma"). Ayo ucapkan "${targetName}" dengan jelas! 🎯`;
          }
        } else {
          phoneticAdjustment += 6;
        }
      } else {
        // Huruf Sibilan Tajam (Sa, Sya) yang memiliki sifat Shafir
        const hasAnyFrication =
          maxOnsetZcr >= 0.054 || highFreqOnsetRatio >= 0.042;

        if (!hasAnyFrication || isBilabialRising) {
          articulatoryClassMatch = false;
          phoneticAdjustment -= 34;
          if (!specificRejectionFeedback) {
            specificRejectionFeedback = `Belum terdengar desisan huruf "${targetName}" (terdengar seperti "Ba/Da/A"). Ayo ucapkan "${targetName}" dengan jelas! 🎯`;
          }
        } else {
          phoneticAdjustment += 6;
        }
      }
    } else if (targetMakhraj === 'breath_fricative') {
      // Target: Fa, Ha, Haa (hembusan nafas lembut; di mikrofon nyata jangan dihukum jika resonansi pita suara dominan)
      const isHardSibilant = onsetZcr > 0.22 && highFreqOnsetRatio > 0.68;
      const isBilabialRising =
        f2TransitionSlopeHz > 75 &&
        f2OnsetHz < 1260 &&
        maxOnsetZcr < 0.038 &&
        highFreqOnsetRatio < 0.045;

      if (isHardSibilant) {
        articulatoryClassMatch = false;
        phoneticAdjustment -= 34;
        if (!specificRejectionFeedback) {
          specificRejectionFeedback = `Terdengar mendesis tajam seperti "Sa/Sya". Huruf "${targetName}" diucapkan dengan hembusan nafas halus! 🎯`;
        }
      } else if (isBilabialRising) {
        articulatoryClassMatch = false;
        phoneticAdjustment -= 34;
        if (!specificRejectionFeedback) {
          specificRejectionFeedback = `Belum terdengar hembusan nafas "${targetName}" (terdengar seperti "Ba/Ma"). Ayo beri hembusan saat mengucapkan "${targetName}"! 🎯`;
        }
      } else {
        phoneticAdjustment += 6;
      }
    } else if (targetMakhraj === 'labial_soft') {
      // Target: Ba, Ma, Wa, Bi, Bu, Mi, Mu, Wi, Wu
      const isBaTarget = firstTargetSyl.startsWith('b');
      const hasSharpOrSibilantOnset =
        maxOnsetZcr > 0.12 || highFreqOnsetRatio > 0.2;
      const hasCoronalFallingF2 =
        f2TransitionSlopeHz < -80 && f2OnsetHz > 1520;
      const isFlatPureVowelA =
        isBaTarget &&
        expectedVowel === 'A' &&
        Math.abs(f2TransitionSlopeHz) < 18 &&
        f2OnsetHz > 1420 &&
        maxOnsetZcr < 0.042;

      if (hasSharpOrSibilantOnset) {
        articulatoryClassMatch = false;
        phoneticAdjustment -= 34;
        if (!specificRejectionFeedback) {
          specificRejectionFeedback = `Terdengar seperti huruf lidah/desis ("Ta/Sa/Ja"). Untuk "${targetName}", rapatkan kedua bibir dulu ya! 🎯`;
        }
      } else if (hasCoronalFallingF2) {
        articulatoryClassMatch = false;
        phoneticAdjustment -= 32;
        if (!specificRejectionFeedback) {
          specificRejectionFeedback = `Terdengar seperti huruf ujung lidah ("Da/Ta/Na"). Untuk "${targetName}", gunakan kedua bibir ya! 🎯`;
        }
      } else if (isFlatPureVowelA) {
        articulatoryClassMatch = false;
        phoneticAdjustment -= 32;
        if (!specificRejectionFeedback) {
          specificRejectionFeedback = `Terdengar seperti "A" tanpa katupan bibir. Rapatkan bibir dulu untuk mengucapkan "${targetName}" ya! 🎯`;
        }
      } else {
        phoneticAdjustment += 6;
      }
    } else if (targetMakhraj === 'coronal_voiced') {
      // Target: Da, Dza, La, Na, Ya (konsonan lidah bersuara lembut; hanya tolak jika mendesis tajam seperti Ta/Sa atau bibir Ba/Ma)
      const hasUnvoicedBurstOrSibilant =
        maxOnsetZcr > 0.2 || highFreqOnsetRatio > 0.35;
      const hasBilabialRisingF2 =
        f2TransitionSlopeHz > 75 && f2OnsetHz < 1260 && highFreqOnsetRatio < 0.08;

      if (hasUnvoicedBurstOrSibilant) {
        articulatoryClassMatch = false;
        phoneticAdjustment -= 34;
        if (!specificRejectionFeedback) {
          specificRejectionFeedback = `Terdengar terlalu tajam/mendesis seperti "Ta/Sa". Huruf "${targetName}" diucapkan lebih lembut! 🎯`;
        }
      } else if (hasBilabialRisingF2) {
        articulatoryClassMatch = false;
        phoneticAdjustment -= 34;
        if (!specificRejectionFeedback) {
          specificRejectionFeedback = `Terdengar seperti bunyi bibir ("Ba/Ma"). Untuk "${targetName}", sentuhkan ujung lidah ya! 🎯`;
        }
      } else {
        phoneticAdjustment += 6;
      }
    } else if (targetMakhraj === 'glottal_vowel') {
      // Target: A / Alif / Hamzah / 'A ('Ain)
      const isPharyngealAin =
        firstTargetSyl.startsWith("'") ||
        firstTargetSyl.startsWith('’') ||
        firstTargetSyl.startsWith('`') ||
        firstTargetSyl.startsWith('ain');
      const hasConsonantNoise = isPharyngealAin
        ? maxOnsetZcr > 0.2 || highFreqOnsetRatio > 0.35
        : maxOnsetZcr > 0.12 || highFreqOnsetRatio > 0.18;
      const hasStrongLabialOrCoronalSlope = isPharyngealAin
        ? f2TransitionSlopeHz > 140 && f2OnsetHz < 1180
        : Math.abs(f2TransitionSlopeHz) > 110;

      if (hasConsonantNoise) {
        articulatoryClassMatch = false;
        phoneticAdjustment -= 34;
        if (!specificRejectionFeedback) {
          specificRejectionFeedback = `Terdengar ada konsonan desis/letupan di awal. Huruf "${targetName}" langsung dibaca vokal bersih ya! 🎯`;
        }
      } else if (hasStrongLabialOrCoronalSlope) {
        articulatoryClassMatch = false;
        phoneticAdjustment -= 32;
        if (!specificRejectionFeedback) {
          const heardHint = f2TransitionSlopeHz > 0 ? 'Ba/Ma' : 'Da/Ta';
          specificRejectionFeedback = `Terdengar seperti "${heardHint}". Untuk huruf "${targetName}", langsung buka mulut tanpa menutup bibir/lidah! 🎯`;
        }
      } else {
        phoneticAdjustment += 6;
      }
    } else if (targetMakhraj === 'heavy_tafkhim') {
      // Target: Kho, Ro, Sho, Dho, Tho, Zho, Gho, Qo
      // Hanya Kho (خ) dan Sho (ص) yang wajib memiliki desisan nirsuara (unvoiced frication),
      // sedangkan Gho (غ) dan Zho (ظ) bersifat Jahr (bersuara) sehingga ZCR-nya lembut di mikrofon nyata.
      const isUnvoicedHeavyFricative =
        firstTargetSyl.startsWith('kh') || firstTargetSyl.startsWith('sh');
      const isVoicedHeavyFricative =
        firstTargetSyl.startsWith('gh') ||
        firstTargetSyl.startsWith('zh') ||
        firstTargetSyl.startsWith('dhz');

      if (isUnvoicedHeavyFricative) {
        const hasHeavyFrication =
          maxOnsetZcr >= 0.038 || highFreqOnsetRatio >= 0.035 || midHighOnsetRatio >= 0.11;
        if (!hasHeavyFrication) {
          articulatoryClassMatch = false;
          phoneticAdjustment -= 32;
          if (!specificRejectionFeedback) {
            specificRejectionFeedback = `Belum terdengar desisan huruf "${targetName}" (terdengar seperti "Ro/Bo"). Ayo ucapkan "${targetName}" lebih jelas! 🎯`;
          }
        } else {
          phoneticAdjustment += 6;
        }
      } else if (isVoicedHeavyFricative) {
        phoneticAdjustment += 6;
      } else {
        // Target: Ro, Dho, Tho, Qo (Bukan frikatif desis panjang)
        if (onsetZcr > 0.19 && highFreqOnsetRatio > 0.35) {
          articulatoryClassMatch = false;
          phoneticAdjustment -= 32;
          if (!specificRejectionFeedback) {
            specificRejectionFeedback = `Terdengar mendesis seperti "Kho/Sho". Huruf "${targetName}" tidak mendesis panjang ya! 🎯`;
          }
        } else {
          phoneticAdjustment += 6;
        }
      }
    }

    // Boost penyemangat diberikan jika kelas vokal & kelas makhraj konsonannya sesuai
    const retryToleranceBoost =
      vowelClassMatch && articulatoryClassMatch && attemptNumber >= 2
        ? Math.min(10, (attemptNumber - 1) * 5)
        : 0;

    const finalScore = Math.min(
      99,
      Math.max(35, Math.round(melSimilarityScore + phoneticAdjustment + retryToleranceBoost))
    );

    // Aturan Kelulusan Tunggal: Jika skor >= 70% maka langsung dianggap BENAR!
    const PASS_SCORE_THRESHOLD = 70;
    const isMatch = finalScore >= PASS_SCORE_THRESHOLD;

    let feedback = '';
    if (isMatch) {
      feedback = `Masya Allah! Pelafalan "${targetName}" sangat tepat! (Skor: ${finalScore}%) ⭐`;
    } else if (specificRejectionFeedback) {
      feedback = specificRejectionFeedback;
    } else {
      feedback = `Hampir tepat (Skor: ${finalScore}%)! Ayo ucapkan "${targetName}" sekali lagi dengan lantang! 💪`;
    }

    return {
      isMatch,
      score: finalScore,
      durationMs,
      peakVolume,
      recordedAudioUrl,
      feedback,
      detectedVowelType,
    };
  }

  private startMediaRecorder(stream: MediaStream): void {
    this.recordedChunks = [];
    try {
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
      let selectedMime = '';
      for (const m of mimeTypes) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }
      this.mediaRecorder = selectedMime
        ? new MediaRecorder(stream, { mimeType: selectedMime })
        : new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          this.recordedChunks.push(ev.data);
        }
      };

      this.mediaRecorder.start(80);
    } catch {
      this.mediaRecorder = null;
    }
  }

  private stopMediaRecorderAndGetUrl(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(this.lastRecordedUrl);
        return;
      }

      const recorder = this.mediaRecorder;
      this.mediaRecorder = null;

      const timeout = setTimeout(() => {
        resolve(this.lastRecordedUrl);
      }, 300);

      recorder.onstop = () => {
        clearTimeout(timeout);
        if (this.recordedChunks.length === 0) {
          resolve(null);
          return;
        }
        const mime = (recorder.mimeType || 'audio/webm').split(';')[0];
        const blob = new Blob(this.recordedChunks, { type: mime });
        if (blob.size === 0) {
          resolve(null);
          return;
        }
        if (this.lastRecordedUrl) {
          try {
            URL.revokeObjectURL(this.lastRecordedUrl);
          } catch {
            // ignore
          }
        }
        this.lastRecordedUrl = URL.createObjectURL(blob);
        resolve(this.lastRecordedUrl);
      };

      try {
        recorder.stop();
      } catch {
        clearTimeout(timeout);
        resolve(null);
      }
    });
  }

  public triggerManualFinish(options: StartAcousticSessionOptions): void {
    if (this.isRunning && this.capturedFrames.length >= 4 && this.peakVolumeInSession >= 24) {
      const sampleRate = this.sharedAudioContext?.sampleRate || 44100;
      this.finishAndEvaluate(options, sampleRate);
    }
  }

  public stopSession(): void {
    this.isRunning = false;
    this.isCurrentlySpeaking = false;
    this.isEvaluating = false;

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {
        // ignore
      }
    }
    this.mediaRecorder = null;

    this.cleanupAudioNodes();
  }

  private cleanupAudioNodes(): void {
    this.isRunning = false;
    this.latestHardwarePcmRms = 0;

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.scriptProcessorNode) {
      try {
        this.scriptProcessorNode.onaudioprocess = null;
        this.scriptProcessorNode.disconnect();
      } catch {
        // ignore
      }
      this.scriptProcessorNode = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
        // ignore
      }
      this.sourceNode = null;
    }

    if (this.rawAnalyser) {
      try {
        this.rawAnalyser.disconnect();
      } catch {
        // ignore
      }
      this.rawAnalyser = null;
    }

    if (this.freqAnalyser) {
      try {
        this.freqAnalyser.disconnect();
      } catch {
        // ignore
      }
      this.freqAnalyser = null;
    }

    if (this.silentGainNode) {
      try {
        this.silentGainNode.disconnect();
      } catch {
        // ignore
      }
      this.silentGainNode = null;
    }

    if (this.stream) {
      try {
        this.stream.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      this.stream = null;
    }
  }

  private normalizeVector(vec: number[]): number[] {
    let norm = 0;
    for (let i = 0; i < vec.length; i++) {
      norm += vec[i] * vec[i];
    }
    norm = Math.sqrt(norm);
    if (norm === 0) return vec.map(() => 0);
    return vec.map((v) => v / norm);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Korelasi Pearson (Zero-Mean Cosine Similarity):
   * Menolak vektor spektrum rata/noise karena deviasi terhadap mean bernilai ~0
   */
  private zeroMeanCorrelation(a: number[], b: number[]): number {
    const len = Math.min(a.length, b.length);
    if (len === 0) return 0;

    let sumA = 0;
    let sumB = 0;
    for (let i = 0; i < len; i++) {
      sumA += a[i];
      sumB += b[i];
    }
    const meanA = sumA / len;
    const meanB = sumB / len;

    let num = 0;
    let denA = 0;
    let denB = 0;
    for (let i = 0; i < len; i++) {
      const da = a[i] - meanA;
      const db = b[i] - meanB;
      num += da * db;
      denA += da * da;
      denB += db * db;
    }
    if (denA < 1e-6 || denB < 1e-6) return 0;
    return num / (Math.sqrt(denA) * Math.sqrt(denB));
  }
}

export const acousticPronunciationEngine = new AcousticPronunciationEngine();
