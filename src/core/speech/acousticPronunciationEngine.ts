/**
 * Acoustic DSP + MFCC / Mel-Spectrogram Pronunciation Engine
 *
 * Mesin deteksi pengucapan huruf Hijaiyah 100% lokal berbasis Web Audio API (PCM + FFT).
 * Dirancang anti-deadlock terhadap kebijakan Autoplay Chrome:
 * - Menggunakan Shared Persistent AudioContext yang di-unlock otomatis saat klik pertama di halaman
 * - TIDAK PERNAH melakukan blocking `await audioContext.resume()` yang bisa menggantung di setTimeout
 * - Membaca gelombang suara secara paralel dari 3 jalur sekaligus:
 *   1. Raw Time-Domain Analyser (identik dengan QariStudioDashboard `rms * 500`)
 *   2. Pre-Amplified Analyser (GainNode 4.5x untuk mikrofon laptop yang pelan)
 *   3. ScriptProcessorNode PCM langsung dari thread audio hardware (`inputBuffer.getChannelData(0)`)
 */

import { LETTER_AUDIO_MAP } from '../audio/ttsNarrator';

export type MicSensitivityLevel = 'high' | 'normal' | 'low';

export interface AcousticFrame {
  rms: number;
  db: number;
  volumePercent: number;
  spectrumBars: number[]; // 9 bar tinggi spektrum real-time (10..100)
  zcr: number;
  centroidHz: number;
  melBands: number[];
  vocalEnergyRatio: number;
  f1Energy: number;
  f2LowEnergy: number;
  f2HighEnergy: number;
  highFreqEnergy: number;
}

export interface ReferenceAcousticProfile {
  letterKey: string;
  onsetMel: number[];
  nucleusMel: number[];
  overallMel: number[];
  onsetZcr: number;
  onsetCentroidHz: number;
  nucleusCentroidHz: number;
  f2Ratio: number;
  highFreqOnsetRatio: number;
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
  onSpeechProgress?: (durationMs: number) => void;
  onEvaluation: (result: AcousticEvaluationResult) => void;
  onError?: (errMessage: string) => void;
}

const MEL_BAND_EDGES_HZ = [
  90, 180, 300, 450, 650, 900, 1250, 1700, 2300, 3100, 4200, 5600, 7500,
];

const ROUNDED_VOWEL_O_LETTERS = new Set([
  'kho', 'kha', 'ro', 'ra', 'sho', 'shod', 'dho', 'dhod', 'tho', 'thod', 'zho', 'dhzo', 'gho', 'ghoin', 'qo', 'qof',
]);

const SHARP_BURST_OR_FRICATIVE_LETTERS = new Set([
  'ta', 'tsa', 'tha', 'sa', 'sin', 'sya', 'syin', 'sho', 'ka', 'kaf', 'fa', 'ha', 'kho', 'za', 'zai',
]);

const SOFT_VOICED_ONSET_LETTERS = new Set([
  'a', 'alif', 'ba', 'da', 'dal', 'ma', 'mim', 'na', 'nun', 'la', 'lam', 'wa', 'waw', 'ya', "'a", 'ain',
]);

export class AcousticPronunciationEngine {
  // Shared AudioContext yang tetap hidup (tidak di-close) agar status 'running' tidak hilang
  private sharedAudioContext: AudioContext | null = null;
  private rawAnalyser: AnalyserNode | null = null;
  private boostedAnalyser: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private preampGainNode: GainNode | null = null;
  private scriptProcessorNode: ScriptProcessorNode | null = null;
  private silentGainNode: GainNode | null = null;
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private lastRecordedUrl: string | null = null;
  private activeMicLabel = '';

  // Nilai RMS real-time yang ditangkap langsung oleh ScriptProcessorNode dari hardware buffer
  private latestHardwarePcmRms = 0;
  private latestHardwareZcr = 0;

  private animFrameId: number | null = null;
  private isRunning = false;

  private noiseFloorRms = 0.002;
  private frameCounter = 0;

  private isCurrentlySpeaking = false;
  private speechStartTime: number | null = null;
  private lastVoiceActiveTime: number = 0;
  private consecutiveVoiceFrames = 0;
  private capturedFrames: AcousticFrame[] = [];
  private peakVolumeInSession = 0;
  private isEvaluating = false;

  private referenceCache = new Map<string, ReferenceAcousticProfile>();

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

  /**
   * Pastikan shared AudioContext dibuat dan di-resume saat ada interaksi pengguna
   */
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
        // JANGAN di-await agar tidak pernah memblokir eksekusi!
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

  public async preloadReferenceProfile(
    targetName: string,
    targetLetter: string
  ): Promise<ReferenceAcousticProfile | null> {
    const key = (targetName || targetLetter || '').trim().toLowerCase();
    if (!key) return null;

    if (this.referenceCache.has(key)) {
      return this.referenceCache.get(key)!;
    }

    const audioUrl =
      LETTER_AUDIO_MAP[key] ||
      LETTER_AUDIO_MAP[targetLetter?.trim()] ||
      `/audio/letters/${key.replace(/[^a-z0-9]/g, '')}.mp3`;

    try {
      const response = await fetch(audioUrl);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();

      const OfflineCtx =
        window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
      const tempCtx = new OfflineCtx(1, 44100 * 2, 44100);
      const audioBuffer = await tempCtx.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;

      const profile = this.extractProfileFromPcm(key, channelData, sampleRate);
      if (profile) {
        this.referenceCache.set(key, profile);
      }
      return profile;
    } catch {
      return null;
    }
  }

  private extractProfileFromPcm(
    letterKey: string,
    pcm: Float32Array,
    sampleRate: number
  ): ReferenceAcousticProfile | null {
    const frameSize = 1024;
    const hopSize = 512;
    const activeFrames: {
      zcr: number;
      centroidHz: number;
      melBands: number[];
      f2Low: number;
      f2High: number;
      highFreqRatio: number;
    }[] = [];

    let maxRms = 0;
    for (let offset = 0; offset + frameSize <= pcm.length; offset += hopSize) {
      let sumSq = 0;
      for (let i = 0; i < frameSize; i++) {
        sumSq += pcm[offset + i] * pcm[offset + i];
      }
      const rms = Math.sqrt(sumSq / frameSize);
      if (rms > maxRms) maxRms = rms;
    }

    if (maxRms < 0.001) return null;
    const activeThreshold = maxRms * 0.15;

    for (let offset = 0; offset + frameSize <= pcm.length; offset += hopSize) {
      let sumSq = 0;
      let zeroCrossings = 0;
      for (let i = 0; i < frameSize; i++) {
        const s = pcm[offset + i];
        sumSq += s * s;
        if (i > 0 && ((pcm[offset + i - 1] >= 0 && s < 0) || (pcm[offset + i - 1] < 0 && s >= 0))) {
          zeroCrossings++;
        }
      }
      const rms = Math.sqrt(sumSq / frameSize);
      if (rms < activeThreshold) continue;

      const zcr = zeroCrossings / frameSize;

      const melBands = new Array(12).fill(0);
      let weightedFreqSum = 0;
      let totalMagSum = 0;
      let f2Low = 0;
      let f2High = 0;
      let highFreq = 0;

      const numBins = 64;
      for (let b = 1; b <= numBins; b++) {
        const freq = (b * (sampleRate / 2)) / numBins;
        if (freq < 80 || freq > 7500) continue;

        const subN = 256;
        const omega = (2 * Math.PI * freq) / sampleRate;
        const coeff = 2 * Math.cos(omega);
        let q1 = 0;
        let q2 = 0;
        for (let n = 0; n < subN; n++) {
          const w = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (subN - 1));
          const q0 = coeff * q1 - q2 + pcm[offset + n] * w;
          q2 = q1;
          q1 = q0;
        }
        const mag = Math.sqrt(Math.max(0, q1 * q1 + q2 * q2 - q1 * q2 * coeff));

        weightedFreqSum += freq * mag;
        totalMagSum += mag;

        if (freq >= 850 && freq <= 1350) f2Low += mag;
        if (freq > 1350 && freq <= 2400) f2High += mag;
        if (freq >= 2200 && freq <= 6500) highFreq += mag;

        for (let m = 0; m < 12; m++) {
          if (freq >= MEL_BAND_EDGES_HZ[m] && freq < MEL_BAND_EDGES_HZ[m + 1]) {
            melBands[m] += mag;
            break;
          }
        }
      }

      const centroidHz = totalMagSum > 0 ? weightedFreqSum / totalMagSum : 500;
      const normMel = this.normalizeVector(melBands);
      const highFreqRatio = totalMagSum > 0 ? highFreq / totalMagSum : 0;

      activeFrames.push({
        zcr,
        centroidHz,
        melBands: normMel,
        f2Low,
        f2High,
        highFreqRatio,
      });
    }

    if (activeFrames.length === 0) return null;

    const n = activeFrames.length;
    const onsetCount = Math.max(1, Math.floor(n * 0.3));
    const onsetSlice = activeFrames.slice(0, onsetCount);
    const nucleusSlice = activeFrames.slice(
      Math.floor(n * 0.25),
      Math.max(Math.floor(n * 0.25) + 1, Math.ceil(n * 0.8))
    );

    const avgMel = (slice: typeof activeFrames) => {
      const sum = new Array(12).fill(0);
      for (const f of slice) {
        for (let i = 0; i < 12; i++) sum[i] += f.melBands[i];
      }
      return this.normalizeVector(sum.map((v) => v / slice.length));
    };

    const onsetZcr = onsetSlice.reduce((a, b) => a + b.zcr, 0) / onsetSlice.length;
    const onsetCentroidHz =
      onsetSlice.reduce((a, b) => a + b.centroidHz, 0) / onsetSlice.length;
    const nucleusCentroidHz =
      nucleusSlice.reduce((a, b) => a + b.centroidHz, 0) / nucleusSlice.length;

    const totalF2Low = nucleusSlice.reduce((a, b) => a + b.f2Low, 0);
    const totalF2High = nucleusSlice.reduce((a, b) => a + b.f2High, 0);
    const f2Ratio =
      totalF2Low + totalF2High > 0 ? totalF2High / (totalF2Low + totalF2High) : 0.5;

    const highFreqOnsetRatio =
      onsetSlice.reduce((a, b) => a + b.highFreqRatio, 0) / onsetSlice.length;

    return {
      letterKey,
      onsetMel: avgMel(onsetSlice),
      nucleusMel: avgMel(nucleusSlice),
      overallMel: avgMel(activeFrames),
      onsetZcr,
      onsetCentroidHz,
      nucleusCentroidHz,
      f2Ratio,
      highFreqOnsetRatio,
    };
  }

  /**
   * Mulai sesi tangkapan suara real-time (Anti-Deadlock & Multi-Sensor)
   */
  public async startSession(options: StartAcousticSessionOptions): Promise<boolean> {
    this.stopSession();

    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      if (options.onError) {
        options.onError('Browser tidak mendukung akses mikrofon (getUserMedia).');
      }
      return false;
    }

    // 1. Inisialisasi / ambil Shared AudioContext SEBELUM await apa pun!
    const ctx = this.ensureAudioContextUnlocked();
    if (!ctx) {
      if (options.onError) {
        options.onError('Gagal menyiapkan sistem pengolahan suara (AudioContext).');
      }
      return false;
    }

    // Preload profil referensi di latar belakang
    this.preloadReferenceProfile(options.targetName, options.targetLetter).catch(() => {});

    try {
      // Gunakan konfigurasi yang terbukti bekerja di QariStudioDashboard
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          ...(options.deviceId ? { deviceId: { exact: options.deviceId } } : {}),
        },
      };

      try {
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      // Coba resume lagi secara non-blocking (JANGAN di-await!)
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const track = this.stream.getAudioTracks()[0];
      this.activeMicLabel = track?.label || 'Mikrofon Bawaan';

      const sensitivity = options.sensitivity || 'high';

      this.sourceNode = ctx.createMediaStreamSource(this.stream);

      // JALUR 1: Raw Analyser langsung dari sourceNode (100% identik dengan QariStudioDashboard)
      this.rawAnalyser = ctx.createAnalyser();
      this.rawAnalyser.fftSize = 512;
      this.rawAnalyser.smoothingTimeConstant = 0.15;
      this.sourceNode.connect(this.rawAnalyser);

      // JALUR 2: Pre-Amplified Analyser (4.5x boost untuk mikrofon laptop yang pelan)
      this.preampGainNode = ctx.createGain();
      this.preampGainNode.gain.value =
        sensitivity === 'high' ? 4.5 : sensitivity === 'normal' ? 2.8 : 1.5;

      this.boostedAnalyser = ctx.createAnalyser();
      this.boostedAnalyser.fftSize = 1024;
      this.boostedAnalyser.minDecibels = -95;
      this.boostedAnalyser.maxDecibels = -18;
      this.boostedAnalyser.smoothingTimeConstant = 0.15;

      // JALUR 3: ScriptProcessorNode membaca PCM langsung dari hardware buffer
      this.latestHardwarePcmRms = 0;
      this.latestHardwareZcr = 0;
      try {
        this.scriptProcessorNode = ctx.createScriptProcessor(1024, 1, 1);
        this.scriptProcessorNode.onaudioprocess = (event: AudioProcessingEvent) => {
          if (!this.isRunning) return;
          const input = event.inputBuffer.getChannelData(0);
          let sumSq = 0;
          let zc = 0;
          for (let i = 0; i < input.length; i++) {
            const s = input[i];
            sumSq += s * s;
            if (i > 0 && ((input[i - 1] >= 0 && s < 0) || (input[i - 1] < 0 && s >= 0))) {
              zc++;
            }
          }
          this.latestHardwarePcmRms = Math.sqrt(sumSq / input.length);
          this.latestHardwareZcr = zc / input.length;
        };
      } catch {
        this.scriptProcessorNode = null;
      }

      this.silentGainNode = ctx.createGain();
      this.silentGainNode.gain.value = 0.00001;

      this.sourceNode.connect(this.preampGainNode);
      this.preampGainNode.connect(this.boostedAnalyser);

      if (this.scriptProcessorNode) {
        this.boostedAnalyser.connect(this.scriptProcessorNode);
        this.scriptProcessorNode.connect(this.silentGainNode);
      } else {
        this.boostedAnalyser.connect(this.silentGainNode);
      }
      this.silentGainNode.connect(ctx.destination);

      // Mulai MediaRecorder untuk Voice Mirror
      this.startMediaRecorder(this.stream);

      // Reset state sesi
      this.isRunning = true;
      this.isCurrentlySpeaking = false;
      this.isEvaluating = false;
      this.speechStartTime = null;
      this.lastVoiceActiveTime = 0;
      this.consecutiveVoiceFrames = 0;
      this.capturedFrames = [];
      this.peakVolumeInSession = 0;
      this.noiseFloorRms = 0.002;
      this.frameCounter = 0;

      if (options.onMicReady) {
        options.onMicReady(this.activeMicLabel, ctx.state === 'running');
      }

      const volumeThreshold = sensitivity === 'high' ? 12 : sensitivity === 'normal' ? 20 : 30;

      const rawByteTimeData = new Uint8Array(this.rawAnalyser.fftSize);
      const boostedFloatTimeData = new Float32Array(this.boostedAnalyser.fftSize);
      const boostedByteTimeData = new Uint8Array(this.boostedAnalyser.fftSize);
      const boostedByteFreqData = new Uint8Array(this.boostedAnalyser.frequencyBinCount);
      const sampleRate = ctx.sampleRate || 44100;

      const processAudioLoop = () => {
        if (!this.isRunning || !this.rawAnalyser || !this.boostedAnalyser || this.isEvaluating) {
          return;
        }

        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }

        const frame = this.extractMultiPathFrame(
          this.rawAnalyser,
          this.boostedAnalyser,
          rawByteTimeData,
          boostedFloatTimeData,
          boostedByteTimeData,
          boostedByteFreqData,
          sampleRate,
          sensitivity
        );

        this.frameCounter++;

        // Kalibrasi noise floor adaptif saat hening
        if (!this.isCurrentlySpeaking && frame.rms > 0.00005 && frame.rms < 0.02) {
          if (this.frameCounter <= 10) {
            this.noiseFloorRms = this.noiseFloorRms * 0.7 + frame.rms * 0.3;
          } else if (frame.rms < this.noiseFloorRms * 1.25) {
            this.noiseFloorRms = this.noiseFloorRms * 0.95 + frame.rms * 0.05;
          }
        }

        const isFrameVocal = frame.volumePercent >= volumeThreshold;
        const now = performance.now();

        if (isFrameVocal) {
          this.consecutiveVoiceFrames++;
          this.lastVoiceActiveTime = now;

          if (frame.volumePercent > this.peakVolumeInSession) {
            this.peakVolumeInSession = frame.volumePercent;
          }

          if (!this.isCurrentlySpeaking && this.consecutiveVoiceFrames >= 2) {
            this.isCurrentlySpeaking = true;
            this.speechStartTime = now - 30;
            options.onSpeechStart();
          }

          if (this.isCurrentlySpeaking) {
            this.capturedFrames.push(frame);
            const currentDur = now - (this.speechStartTime || now);
            if (options.onSpeechProgress) {
              options.onSpeechProgress(Math.round(currentDur));
            }

            // Jika suara diucapkan jelas selama >= 850ms, langsung evaluasi otomatis!
            if (currentDur >= 850 && this.capturedFrames.length >= 8) {
              this.finishAndEvaluate(options);
              return;
            }
          }
        } else {
          this.consecutiveVoiceFrames = 0;

          if (this.isCurrentlySpeaking && this.speechStartTime) {
            const totalDurationMs = this.lastVoiceActiveTime - this.speechStartTime;
            const silenceDurationMs = now - this.lastVoiceActiveTime;

            if (silenceDurationMs < 75) {
              this.capturedFrames.push(frame);
            }

            // Jika suku kata sudah selesai (durasi >= 100ms & hening >= 300ms), evaluasi otomatis!
            if (totalDurationMs >= 100 && silenceDurationMs >= 300 && this.capturedFrames.length >= 4) {
              this.finishAndEvaluate(options);
              return;
            }

            if (totalDurationMs < 100 && silenceDurationMs > 360) {
              this.isCurrentlySpeaking = false;
              this.speechStartTime = null;
              this.capturedFrames = [];
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
          err?.message || 'Izin mikrofon belum diberikan atau mikrofon sedang digunakan aplikasi lain.'
        );
      }
      return false;
    }
  }

  /**
   * Ekstrak volume, 9-bar spektrum, dan fitur fonetik dari 3 jalur paralel sekaligus
   */
  private extractMultiPathFrame(
    rawAnalyser: AnalyserNode,
    boostedAnalyser: AnalyserNode,
    rawByteTimeData: Uint8Array<ArrayBuffer>,
    boostedFloatTimeData: Float32Array<ArrayBuffer>,
    boostedByteTimeData: Uint8Array<ArrayBuffer>,
    boostedByteFreqData: Uint8Array<ArrayBuffer>,
    sampleRate: number,
    sensitivity: MicSensitivityLevel
  ): AcousticFrame {
    // 1. Jalur Raw Byte Time-Domain (identik dengan QariStudioDashboard)
    rawAnalyser.getByteTimeDomainData(rawByteTimeData);
    let rawSumSq = 0;
    let rawZc = 0;
    for (let i = 0; i < rawByteTimeData.length; i++) {
      const norm = (rawByteTimeData[i] - 128) / 128;
      rawSumSq += norm * norm;
      if (i > 0) {
        const prev = (rawByteTimeData[i - 1] - 128) / 128;
        if ((prev >= 0 && norm < 0) || (prev < 0 && norm >= 0)) {
          rawZc++;
        }
      }
    }
    const rawRms = Math.sqrt(rawSumSq / rawByteTimeData.length);
    const rawZcr = rawZc / rawByteTimeData.length;

    // 2. Jalur Boosted Float/Byte Time-Domain
    let boostedSumSq = 0;
    let boostedZc = 0;
    if (typeof boostedAnalyser.getFloatTimeDomainData === 'function') {
      boostedAnalyser.getFloatTimeDomainData(boostedFloatTimeData);
      for (let i = 0; i < boostedFloatTimeData.length; i++) {
        const s = boostedFloatTimeData[i];
        boostedSumSq += s * s;
        if (
          i > 0 &&
          ((boostedFloatTimeData[i - 1] >= 0 && s < 0) ||
            (boostedFloatTimeData[i - 1] < 0 && s >= 0))
        ) {
          boostedZc++;
        }
      }
    } else {
      boostedAnalyser.getByteTimeDomainData(boostedByteTimeData);
      for (let i = 0; i < boostedByteTimeData.length; i++) {
        const s = (boostedByteTimeData[i] - 128) / 128;
        boostedSumSq += s * s;
      }
    }
    const boostedRms = Math.sqrt(boostedSumSq / boostedFloatTimeData.length);
    const boostedZcr = boostedZc / boostedFloatTimeData.length;

    // 3. Jalur Frequency-Domain (Mel-Filterbank & 9 Spectrum Bars)
    boostedAnalyser.getByteFrequencyData(boostedByteFreqData);
    const binHz = sampleRate / boostedAnalyser.fftSize;

    const melBands = new Array(12).fill(0);
    let totalEnergy = 0;
    let vocalBandEnergy = 0;
    let weightedFreqSum = 0;
    let f1Energy = 0;
    let f2LowEnergy = 0;
    let f2HighEnergy = 0;
    let highFreqEnergy = 0;

    for (let i = 1; i < boostedByteFreqData.length; i++) {
      const mag = boostedByteFreqData[i];
      if (mag === 0) continue;

      const freq = i * binHz;
      totalEnergy += mag;
      weightedFreqSum += freq * mag;

      if (freq >= 90 && freq <= 3500) vocalBandEnergy += mag;
      if (freq >= 280 && freq <= 850) f1Energy += mag;
      if (freq > 850 && freq <= 1350) f2LowEnergy += mag;
      if (freq > 1350 && freq <= 2400) f2HighEnergy += mag;
      if (freq >= 2200 && freq <= 6500) highFreqEnergy += mag;

      for (let m = 0; m < 12; m++) {
        if (freq >= MEL_BAND_EDGES_HZ[m] && freq < MEL_BAND_EDGES_HZ[m + 1]) {
          melBands[m] += mag;
          break;
        }
      }
    }

    const centroidHz = totalEnergy > 0 ? weightedFreqSum / totalEnergy : 0;
    const vocalEnergyRatio = totalEnergy > 0 ? vocalBandEnergy / totalEnergy : 0.5;

    const vocalBinCount = Math.max(1, Math.round(3400 / binHz));
    const avgVocalByte = vocalBandEnergy / vocalBinCount; // 0..255
    const freqVolPercent = Math.min(100, Math.round((avgVocalByte / 140) * 100));

    // Gabungkan 4 pengukur volume:
    // A. Rumus QariStudioDashboard (rawRms * 550)
    const studioLinearVol = Math.min(100, Math.round(rawRms * 580));
    // B. Boosted RMS
    const boostedLinearVol = Math.min(100, Math.round(boostedRms * 260));
    // C. Hardware ScriptProcessor RMS
    const hwLinearVol = Math.min(100, Math.round(this.latestHardwarePcmRms * 320));
    // D. Skala Desibel Logaritmik (dBFS)
    const effectiveRms = Math.max(rawRms * 3.5, boostedRms, this.latestHardwarePcmRms, (avgVocalByte / 255) * 0.2);
    const db = 20 * Math.log10(Math.max(effectiveRms, 0.00005));
    const sensOffset = sensitivity === 'high' ? 54 : sensitivity === 'normal' ? 48 : 42;
    const dbVol = Math.max(0, Math.min(100, Math.round(((db + sensOffset) / 38) * 100)));

    const volumePercent = Math.min(
      100,
      Math.max(studioLinearVol, boostedLinearVol, hwLinearVol, freqVolPercent, dbVol)
    );

    // Hitung 9 bar spektrum real-time agar setiap bar bergerak lincah sesuai pita frekuensi + amplitudo
    const barMultipliers = [0.65, 0.85, 1.1, 0.9, 1.25, 1.0, 1.15, 0.8, 0.95];
    const spectrumBars = barMultipliers.map((mult, idx) => {
      const melVal = melBands[idx] || 0;
      const melContribution = Math.min(100, Math.round((melVal / 350) * 100));
      const combined = Math.max(Math.round(volumePercent * mult), melContribution);
      return Math.max(10, Math.min(100, combined));
    });

    const zcr = Math.max(rawZcr, boostedZcr, this.latestHardwareZcr);

    return {
      rms: effectiveRms,
      db: Math.round(db),
      volumePercent,
      spectrumBars,
      zcr,
      centroidHz,
      melBands: this.normalizeVector(melBands),
      vocalEnergyRatio,
      f1Energy,
      f2LowEnergy,
      f2HighEnergy,
      highFreqEnergy,
    };
  }

  private async finishAndEvaluate(options: StartAcousticSessionOptions): Promise<void> {
    if (this.isEvaluating) return;
    this.isEvaluating = true;

    const frames = [...this.capturedFrames];
    const durationMs =
      this.speechStartTime && this.lastVoiceActiveTime
        ? Math.max(130, Math.round(this.lastVoiceActiveTime - this.speechStartTime))
        : frames.length * 16;
    const peakVolume = this.peakVolumeInSession;

    const recordedAudioUrl = await this.stopMediaRecorderAndGetUrl();
    this.cleanupAudioNodes();

    const refProfile = await this.preloadReferenceProfile(
      options.targetName,
      options.targetLetter
    );

    const evaluation = this.computeEvaluation(
      frames,
      durationMs,
      peakVolume,
      recordedAudioUrl,
      options.targetName,
      refProfile,
      options.attemptNumber || 1
    );

    options.onEvaluation(evaluation);
  }

  private computeEvaluation(
    frames: AcousticFrame[],
    durationMs: number,
    peakVolume: number,
    recordedAudioUrl: string | null,
    targetName: string,
    refProfile: ReferenceAcousticProfile | null,
    attemptNumber: number
  ): AcousticEvaluationResult {
    const cleanTarget = (targetName || '').trim().toLowerCase();

    if (frames.length < 3 || durationMs < 90) {
      return {
        isMatch: false,
        score: 35,
        durationMs,
        peakVolume,
        recordedAudioUrl,
        feedback: `Suara terlalu singkat. Ayo ucapkan "${targetName}" dengan jelas ya!`,
        detectedVowelType: 'unknown',
      };
    }

    const n = frames.length;
    const onsetCount = Math.max(1, Math.min(5, Math.ceil(n * 0.35)));
    const onsetFrames = frames.slice(0, onsetCount);
    const nucleusFrames = frames.slice(
      Math.floor(n * 0.2),
      Math.max(Math.floor(n * 0.2) + 1, Math.ceil(n * 0.85))
    );

    const avgMel = (slice: AcousticFrame[]) => {
      const sum = new Array(12).fill(0);
      for (const f of slice) {
        for (let i = 0; i < 12; i++) sum[i] += f.melBands[i];
      }
      return this.normalizeVector(sum.map((v) => v / slice.length));
    };

    const userOnsetMel = avgMel(onsetFrames);
    const userNucleusMel = avgMel(nucleusFrames);
    const userOverallMel = avgMel(frames);

    const sumF2Low = nucleusFrames.reduce((a, b) => a + b.f2LowEnergy, 0);
    const sumF2High = nucleusFrames.reduce((a, b) => a + b.f2HighEnergy, 0);
    const userF2Ratio =
      sumF2Low + sumF2High > 0 ? sumF2High / (sumF2Low + sumF2High) : 0.5;

    const detectedVowelType: 'A' | 'O' = userF2Ratio >= 0.35 ? 'A' : 'O';
    const isTargetRoundedO = ROUNDED_VOWEL_O_LETTERS.has(cleanTarget);

    let melSimilarityScore = 78;
    if (refProfile) {
      const onsetSim = this.cosineSimilarity(userOnsetMel, refProfile.onsetMel);
      const nucleusSim = this.cosineSimilarity(userNucleusMel, refProfile.nucleusMel);
      const overallSim = this.cosineSimilarity(userOverallMel, refProfile.overallMel);

      const rawSim = onsetSim * 0.45 + nucleusSim * 0.35 + overallSim * 0.2;
      if (rawSim > 0.1) {
        melSimilarityScore = Math.min(98, Math.max(55, Math.round(rawSim * 108)));
      }
    }

    let phoneticAdjustment = 0;
    const maxOnsetZcr = Math.max(...onsetFrames.map((f) => f.zcr));
    const maxOnsetCentroid = Math.max(...onsetFrames.map((f) => f.centroidHz));
    const onsetHighFreqRatio =
      onsetFrames.reduce(
        (acc, f) =>
          acc + f.highFreqEnergy / Math.max(1, f.f1Energy + f.f2LowEnergy + f.highFreqEnergy),
        0
      ) / onsetFrames.length;

    if (SHARP_BURST_OR_FRICATIVE_LETTERS.has(cleanTarget)) {
      if (maxOnsetZcr >= 0.045 || maxOnsetCentroid >= 850 || onsetHighFreqRatio >= 0.12) {
        phoneticAdjustment += 9;
      } else if (
        attemptNumber === 1 &&
        maxOnsetZcr < 0.025 &&
        maxOnsetCentroid > 0 &&
        maxOnsetCentroid < 520 &&
        onsetHighFreqRatio < 0.06
      ) {
        phoneticAdjustment -= 20;
      }
    } else if (SOFT_VOICED_ONSET_LETTERS.has(cleanTarget)) {
      if (maxOnsetZcr <= 0.18 && onsetHighFreqRatio <= 0.38) {
        phoneticAdjustment += 8;
      } else if (attemptNumber === 1 && maxOnsetZcr > 0.26 && onsetHighFreqRatio > 0.5) {
        phoneticAdjustment -= 16;
      }
    }

    if (isTargetRoundedO && userF2Ratio <= 0.58) {
      phoneticAdjustment += 6;
    } else if (!isTargetRoundedO && userF2Ratio >= 0.32) {
      phoneticAdjustment += 6;
    }

    const childEncouragementBoost = attemptNumber >= 2 ? (attemptNumber - 1) * 10 : 0;

    const finalScore = Math.min(
      99,
      Math.max(45, Math.round(melSimilarityScore + phoneticAdjustment + childEncouragementBoost))
    );

    const passThreshold = attemptNumber >= 2 ? 60 : 66;
    const isMatch = finalScore >= passThreshold;

    let feedback = '';
    if (isMatch) {
      feedback = `Masya Allah! Pelafalan "${targetName}" sangat tepat! (Skor: ${finalScore}%) ⭐`;
    } else if (SHARP_BURST_OR_FRICATIVE_LETTERS.has(cleanTarget) && phoneticAdjustment < 0) {
      feedback = `Terdengar seperti huruf lembut ("Ba/Ma"). Ini huruf "${targetName}", ayo ucapkan "${targetName}" lebih tegas ya! 🎯`;
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
    if (this.isRunning && this.capturedFrames.length >= 2) {
      this.finishAndEvaluate(options);
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

  /**
   * Putuskan node tanpa menutup sharedAudioContext agar izin AudioContext tetap 'running'
   */
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

    if (this.preampGainNode) {
      try {
        this.preampGainNode.disconnect();
      } catch {
        // ignore
      }
      this.preampGainNode = null;
    }

    if (this.boostedAnalyser) {
      try {
        this.boostedAnalyser.disconnect();
      } catch {
        // ignore
      }
      this.boostedAnalyser = null;
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
}

export const acousticPronunciationEngine = new AcousticPronunciationEngine();
