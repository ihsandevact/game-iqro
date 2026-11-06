/**
 * Acoustic DSP + MFCC / Mel-Spectrogram Pronunciation Engine
 *
 * Mesin deteksi pengucapan huruf Hijaiyah 100% lokal berbasis Web Audio API (PCM + FFT).
 * Tidak bergantung pada webkitSpeechRecognition / server Google, sehingga:
 * - Pasti berjalan di semua browser (Chrome, Brave, Edge, Firefox, Safari, Android, iOS)
 * - Dilengkapi Hardware DSP Pre-Amplifier (GainNode 6x) sebelum AnalyserNode agar mikrofon
 *   laptop yang pelan tetap terbaca jelas dan responsif
 * - Menggunakan skala desibel logaritmik (dBFS) + Adaptive Noise Floor (SNR)
 * - Mengekstrak 12 pita Mel-Frequency, Onset ZCR, Spectral Centroid, dan Formant Ratio
 * - Mencocokkan profil akustik suara pemain dengan file referensi /audio/letters/*.mp3
 */

import { LETTER_AUDIO_MAP } from '../audio/ttsNarrator';

export type MicSensitivityLevel = 'high' | 'normal' | 'low';

export interface AcousticFrame {
  rms: number;
  db: number;
  volumePercent: number;
  zcr: number; // Zero-Crossing Rate (0.0 - 1.0)
  centroidHz: number; // Spectral Centroid dalam Hz
  melBands: number[]; // 12 pita frekuensi skala Mel (normalized 0..1)
  vocalEnergyRatio: number; // Rasio energi pita vokal manusia (100Hz - 3500Hz)
  f1Energy: number; // Formant 1 region (300Hz - 850Hz)
  f2LowEnergy: number; // Formant 2 back/rounded vowel 'O'/'U' (850Hz - 1350Hz)
  f2HighEnergy: number; // Formant 2 front/open vowel 'A'/'I' (1350Hz - 2400Hz)
  highFreqEnergy: number; // Konsonan desis/letup tajam (2200Hz - 6500Hz)
}

export interface ReferenceAcousticProfile {
  letterKey: string;
  onsetMel: number[];
  nucleusMel: number[];
  overallMel: number[];
  onsetZcr: number;
  onsetCentroidHz: number;
  nucleusCentroidHz: number;
  f2Ratio: number; // f2High / (f2Low + f2High) -> membedakan vokal 'A' vs 'O'
  highFreqOnsetRatio: number; // membedakan konsonan tajam (Ta, Tsa, Sa) vs bilabial (Ba, Ma, Wa)
}

export interface AcousticEvaluationResult {
  isMatch: boolean;
  score: number; // 0 - 100
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
  onMicReady?: (micLabel: string) => void;
  onVolume: (volumePercent: number, isSpeaking: boolean, decibels: number) => void;
  onSpeechStart: () => void;
  onSpeechProgress?: (durationMs: number) => void;
  onEvaluation: (result: AcousticEvaluationResult) => void;
  onError?: (errMessage: string) => void;
}

// Batas frekuensi 12 pita skala Mel (Hz) yang mencakup rentang vokal & konsonan manusia
const MEL_BAND_EDGES_HZ = [
  90, 180, 300, 450, 650, 900, 1250, 1700, 2300, 3100, 4200, 5600, 7500,
];

// Klasifikasi fonetik huruf Hijaiyah untuk validasi konsonan & vokal
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
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private preampGainNode: GainNode | null = null;
  private silentGainNode: GainNode | null = null;
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private lastRecordedUrl: string | null = null;
  private activeMicLabel = '';

  private animFrameId: number | null = null;
  private isRunning = false;

  // Kalibrasi Noise Floor Adaptif
  private noiseFloorRms = 0.0025;
  private frameCounter = 0;

  // Pelacak Voice Activity Detection (VAD) & Frame Akustik
  private isCurrentlySpeaking = false;
  private speechStartTime: number | null = null;
  private lastVoiceActiveTime: number = 0;
  private consecutiveVoiceFrames = 0;
  private capturedFrames: AcousticFrame[] = [];
  private peakVolumeInSession = 0;
  private isEvaluating = false;

  // Cache profil referensi MP3 agar tidak perlu decode ulang
  private referenceCache = new Map<string, ReferenceAcousticProfile>();

  /**
   * Ambil daftar mikrofon yang tersedia di perangkat
   */
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

  /**
   * Preload & analisis file audio referensi untuk huruf target
   */
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

  /**
   * Ekstrak profil akustik dari buffer PCM (untuk file referensi MP3)
   */
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

    // Cari peak RMS untuk menentukan ambang batas bagian aktif suara
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
   * Mulai mendengarkan mikrofon dengan Preamp Gain + PCM/FFT Analyser langsung
   */
  public async startSession(options: StartAcousticSessionOptions): Promise<boolean> {
    this.stopSession();

    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      if (options.onError) {
        options.onError('Browser tidak mendukung akses mikrofon (getUserMedia).');
      }
      return false;
    }

    // Preload profil referensi di latar belakang
    this.preloadReferenceProfile(options.targetName, options.targetLetter).catch(() => {});

    try {
      let chosenDeviceId = options.deviceId;

      // Jika belum ada deviceId spesifik, cek apakah ada mikrofon asli (hindari Stereo Mix)
      if (!chosenDeviceId) {
        const devices = await this.getAvailableMicrophones();
        const realMic = devices.find(
          (d) =>
            d.label &&
            !d.label.toLowerCase().includes('stereo mix') &&
            !d.label.toLowerCase().includes('what u hear')
        );
        if (realMic && devices.some((d) => d.label.toLowerCase().includes('stereo mix'))) {
          chosenDeviceId = realMic.deviceId;
        }
      }

      const preferredConstraints: MediaStreamConstraints = {
        audio: {
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: false,
          ...(chosenDeviceId ? { deviceId: { ideal: chosenDeviceId } } : {}),
        },
      };

      try {
        this.stream = await navigator.mediaDevices.getUserMedia(preferredConstraints);
      } catch {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      const track = this.stream.getAudioTracks()[0];
      this.activeMicLabel = track?.label || 'Mikrofon Aktif';
      if (options.onMicReady) {
        options.onMicReady(this.activeMicLabel);
      }

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const sensitivity = options.sensitivity || 'high';

      // DSP Pre-Amplifier GainNode untuk mengangkat sinyal mikrofon laptop yang kecil
      this.preampGainNode = this.audioContext.createGain();
      this.preampGainNode.gain.value =
        sensitivity === 'high' ? 5.5 : sensitivity === 'normal' ? 3.2 : 1.6;

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.minDecibels = -95;
      this.analyser.maxDecibels = -18;
      this.analyser.smoothingTimeConstant = 0.18;

      this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);

      // PENTING: Rantai Audio: Source -> PreampGain -> Analyser -> SilentGain -> Destination
      // Menjamin Chrome memompa buffer PCM aktif setiap frame tanpa mengeluarkan bunyi ke speaker
      this.silentGainNode = this.audioContext.createGain();
      this.silentGainNode.gain.value = 0.00001;

      this.sourceNode.connect(this.preampGainNode);
      this.preampGainNode.connect(this.analyser);
      this.analyser.connect(this.silentGainNode);
      this.silentGainNode.connect(this.audioContext.destination);

      // Siapkan MediaRecorder untuk merekam suara anak (Voice Mirror & Anti-Garbage-Collection)
      this.startMediaRecorder(this.stream);

      // Reset state deteksi
      this.isRunning = true;
      this.isCurrentlySpeaking = false;
      this.isEvaluating = false;
      this.speechStartTime = null;
      this.lastVoiceActiveTime = 0;
      this.consecutiveVoiceFrames = 0;
      this.capturedFrames = [];
      this.peakVolumeInSession = 0;
      this.noiseFloorRms = 0.003;
      this.frameCounter = 0;

      // Ambang batas volume (dalam skala logaritmik 0-100) yang sangat peka
      const volumeThreshold = sensitivity === 'high' ? 14 : sensitivity === 'normal' ? 22 : 32;

      const floatTimeData = new Float32Array(this.analyser.fftSize);
      const byteTimeData = new Uint8Array(this.analyser.fftSize);
      const byteFreqData = new Uint8Array(this.analyser.frequencyBinCount);
      const sampleRate = this.audioContext.sampleRate || 44100;

      const processAudioLoop = () => {
        if (!this.isRunning || !this.analyser || this.isEvaluating) return;

        if (this.audioContext && this.audioContext.state === 'suspended') {
          this.audioContext.resume().catch(() => {});
        }

        const frame = this.extractRealtimeFrame(
          this.analyser,
          floatTimeData,
          byteTimeData,
          byteFreqData,
          sampleRate
        );

        this.frameCounter++;

        // Update noise floor secara adaptif saat sedang tidak berbicara
        if (!this.isCurrentlySpeaking && frame.rms > 0.00005 && frame.rms < 0.025) {
          if (this.frameCounter <= 12) {
            this.noiseFloorRms = this.noiseFloorRms * 0.7 + frame.rms * 0.3;
          } else if (frame.rms < this.noiseFloorRms * 1.25) {
            this.noiseFloorRms = this.noiseFloorRms * 0.95 + frame.rms * 0.05;
          }
        }

        // Deteksi apakah frame ini memiliki suara vokal aktif
        const snrRatio = frame.rms / Math.max(0.0004, this.noiseFloorRms);
        const isFrameVocal =
          frame.volumePercent >= volumeThreshold &&
          (snrRatio >= 1.65 || frame.volumePercent >= 25) &&
          frame.vocalEnergyRatio >= 0.15;

        const now = performance.now();

        if (isFrameVocal) {
          this.consecutiveVoiceFrames++;
          this.lastVoiceActiveTime = now;

          if (frame.volumePercent > this.peakVolumeInSession) {
            this.peakVolumeInSession = frame.volumePercent;
          }

          // Mulai fase berbicara setelah minimal 2 frame berturut-turut (~32ms)
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

            // Jika pengguna telah mengucapkan suku kata cukup jelas (>= 950ms), langsung evaluasi otomatis!
            if (currentDur >= 950 && this.capturedFrames.length >= 10) {
              this.finishAndEvaluate(options);
              return;
            }
          }
        } else {
          this.consecutiveVoiceFrames = 0;

          if (this.isCurrentlySpeaking && this.speechStartTime) {
            const totalDurationMs = this.lastVoiceActiveTime - this.speechStartTime;
            const silenceDurationMs = now - this.lastVoiceActiveTime;

            // Simpan frame transisi ekor (coda) maksimal 3 frame setelah suara turun
            if (silenceDurationMs < 75) {
              this.capturedFrames.push(frame);
            }

            // Jika pengguna selesai mengucapkan suku kata (durasi >= 110ms & jeda hening >= 320ms)
            if (totalDurationMs >= 110 && silenceDurationMs >= 320 && this.capturedFrames.length >= 4) {
              this.finishAndEvaluate(options);
              return;
            }

            // Jika hanya bunyi klik sangat pendek (< 110ms) dan sudah hening > 380ms, reset untuk tunggu ucapan
            if (totalDurationMs < 110 && silenceDurationMs > 380) {
              this.isCurrentlySpeaking = false;
              this.speechStartTime = null;
              this.capturedFrames = [];
            }
          }
        }

        options.onVolume(frame.volumePercent, this.isCurrentlySpeaking || isFrameVocal, frame.db);
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
   * Ekstrak fitur akustik real-time dari AnalyserNode
   */
  private extractRealtimeFrame(
    analyser: AnalyserNode,
    floatTimeData: Float32Array<ArrayBuffer>,
    byteTimeData: Uint8Array<ArrayBuffer>,
    byteFreqData: Uint8Array<ArrayBuffer>,
    sampleRate: number
  ): AcousticFrame {
    let sumSquares = 0;
    let zeroCrossings = 0;

    if (typeof analyser.getFloatTimeDomainData === 'function') {
      analyser.getFloatTimeDomainData(floatTimeData);
      for (let i = 0; i < floatTimeData.length; i++) {
        const s = floatTimeData[i];
        sumSquares += s * s;
        if (
          i > 0 &&
          ((floatTimeData[i - 1] >= 0 && s < 0) || (floatTimeData[i - 1] < 0 && s >= 0))
        ) {
          zeroCrossings++;
        }
      }
    } else {
      analyser.getByteTimeDomainData(byteTimeData);
      for (let i = 0; i < byteTimeData.length; i++) {
        const s = (byteTimeData[i] - 128) / 128;
        sumSquares += s * s;
        if (i > 0) {
          const prev = (byteTimeData[i - 1] - 128) / 128;
          if ((prev >= 0 && s < 0) || (prev < 0 && s >= 0)) {
            zeroCrossings++;
          }
        }
      }
    }

    const timeRms = Math.sqrt(sumSquares / floatTimeData.length);
    const zcr = zeroCrossings / floatTimeData.length;

    analyser.getByteFrequencyData(byteFreqData);
    const binHz = sampleRate / analyser.fftSize;

    const melBands = new Array(12).fill(0);
    let totalEnergy = 0;
    let vocalBandEnergy = 0;
    let weightedFreqSum = 0;
    let f1Energy = 0;
    let f2LowEnergy = 0;
    let f2HighEnergy = 0;
    let highFreqEnergy = 0;

    for (let i = 1; i < byteFreqData.length; i++) {
      const mag = byteFreqData[i];
      if (mag === 0) continue;

      const freq = i * binHz;
      totalEnergy += mag;
      weightedFreqSum += freq * mag;

      if (freq >= 95 && freq <= 3500) {
        vocalBandEnergy += mag;
      }
      if (freq >= 300 && freq <= 850) {
        f1Energy += mag;
      }
      if (freq > 850 && freq <= 1350) {
        f2LowEnergy += mag;
      }
      if (freq > 1350 && freq <= 2400) {
        f2HighEnergy += mag;
      }
      if (freq >= 2200 && freq <= 6500) {
        highFreqEnergy += mag;
      }

      for (let m = 0; m < 12; m++) {
        if (freq >= MEL_BAND_EDGES_HZ[m] && freq < MEL_BAND_EDGES_HZ[m + 1]) {
          melBands[m] += mag;
          break;
        }
      }
    }

    const centroidHz = totalEnergy > 0 ? weightedFreqSum / totalEnergy : 0;
    const vocalEnergyRatio = totalEnergy > 0 ? vocalBandEnergy / totalEnergy : 0;

    const vocalBinCount = Math.max(1, Math.round(3400 / binHz));
    const avgVocalByte = vocalBandEnergy / vocalBinCount;
    const freqEquivalentRms = (avgVocalByte / 255) * 0.18;

    const effectiveRms = Math.max(timeRms, freqEquivalentRms);

    // Konversi ke skala Desibel Logaritmik (dBFS) + SNR Boost
    const db = 20 * Math.log10(Math.max(effectiveRms, 0.00005));
    const dbVolume = Math.max(0, Math.min(100, Math.round(((db + 54) / 40) * 100)));

    const snrDb = 20 * Math.log10(Math.max(1, effectiveRms / Math.max(0.0004, this.noiseFloorRms)));
    const snrVolume = Math.max(0, Math.min(100, Math.round(snrDb * 3.8)));

    const volumePercent = Math.min(100, Math.max(dbVolume, snrVolume));

    return {
      rms: effectiveRms,
      db: Math.round(db),
      volumePercent,
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

  /**
   * Selesaikan rekaman satu ucapan dan jalankan evaluasi akustik + fonetik
   */
  private async finishAndEvaluate(options: StartAcousticSessionOptions): Promise<void> {
    if (this.isEvaluating) return;
    this.isEvaluating = true;

    const frames = [...this.capturedFrames];
    const durationMs =
      this.speechStartTime && this.lastVoiceActiveTime
        ? Math.max(140, Math.round(this.lastVoiceActiveTime - this.speechStartTime))
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

  /**
   * Algoritma Penilaian Kemiripan Akustik (Onset Consonant + Formant Vowel + Mel Cosine Similarity)
   */
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

    if (frames.length < 3 || durationMs < 95) {
      return {
        isMatch: false,
        score: 30,
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

    const sumF1 = nucleusFrames.reduce((a, b) => a + b.f1Energy, 0);
    const sumF2Low = nucleusFrames.reduce((a, b) => a + b.f2LowEnergy, 0);
    const sumF2High = nucleusFrames.reduce((a, b) => a + b.f2HighEnergy, 0);
    const userF2Ratio =
      sumF2Low + sumF2High > 0 ? sumF2High / (sumF2Low + sumF2High) : 0.5;

    const avgVocalRatio =
      nucleusFrames.reduce((a, b) => a + b.vocalEnergyRatio, 0) / nucleusFrames.length;

    if (avgVocalRatio < 0.16 || sumF1 <= 0) {
      return {
        isMatch: false,
        score: 38,
        durationMs,
        peakVolume,
        recordedAudioUrl,
        feedback: `Terdengar suara angin/ketukan. Yuk ucapkan huruf "${targetName}" dengan suaramu! 🎙️`,
        detectedVowelType: 'unknown',
      };
    }

    const detectedVowelType: 'A' | 'O' = userF2Ratio >= 0.35 ? 'A' : 'O';
    const isTargetRoundedO = ROUNDED_VOWEL_O_LETTERS.has(cleanTarget);

    // 1. Skor Kemiripan Spektrum Mel terhadap File Audio Referensi Asli (0..100)
    // Bobot tinggi pada Onset (45%) untuk membedakan konsonan awal (misal Ba vs Ta)
    let melSimilarityScore = 76;
    if (refProfile) {
      const onsetSim = this.cosineSimilarity(userOnsetMel, refProfile.onsetMel);
      const nucleusSim = this.cosineSimilarity(userNucleusMel, refProfile.nucleusMel);
      const overallSim = this.cosineSimilarity(userOverallMel, refProfile.overallMel);

      const rawSim = onsetSim * 0.45 + nucleusSim * 0.35 + overallSim * 0.2;
      melSimilarityScore = Math.min(98, Math.max(48, Math.round(rawSim * 106)));
    }

    // 2. Analisis Karakter Konsonan Onset (Membedakan Ta/Tsa vs Ba/Ma)
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
      // Huruf dengan letupan dental/alveolar atau desis (Ta, Tsa, Sa, Sya, Ka, Ha, Kho)
      if (maxOnsetZcr >= 0.05 || maxOnsetCentroid >= 880 || onsetHighFreqRatio >= 0.14) {
        phoneticAdjustment += 9;
      } else if (attemptNumber === 1 && maxOnsetZcr < 0.03 && maxOnsetCentroid < 580 && onsetHighFreqRatio < 0.07) {
        // Suara bilabial murni (seperti "Ba" atau "Ma") saat target adalah "Ta" / "Tsa"
        phoneticAdjustment -= 22;
      }
    } else if (SOFT_VOICED_ONSET_LETTERS.has(cleanTarget)) {
      // Huruf bilabial/vokal lembut (A, Ba, Da, Ma, Na, La, Wa, Ya)
      if (maxOnsetZcr <= 0.16 && onsetHighFreqRatio <= 0.35) {
        phoneticAdjustment += 8;
      } else if (attemptNumber === 1 && maxOnsetZcr > 0.24 && onsetHighFreqRatio > 0.48) {
        // Desis sangat tajam saat diminta huruf lembut
        phoneticAdjustment -= 18;
      }
    }

    // 3. Cek kesesuaian vokal bulat ('O' seperti Kho, Ro, Sho) vs terbuka ('A' seperti Ba, Ta)
    if (isTargetRoundedO && userF2Ratio <= 0.58) {
      phoneticAdjustment += 6;
    } else if (!isTargetRoundedO && userF2Ratio >= 0.32) {
      phoneticAdjustment += 6;
    }

    // Toleransi ramah anak mulai percobaan ke-2 agar belajar tetap menyenangkan
    const childEncouragementBoost = attemptNumber >= 2 ? (attemptNumber - 1) * 9 : 0;

    const finalScore = Math.min(
      99,
      Math.max(42, Math.round(melSimilarityScore + phoneticAdjustment + childEncouragementBoost))
    );

    const passThreshold = attemptNumber >= 2 ? 62 : 68;
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

  private cleanupAudioNodes(): void {
    this.isRunning = false;

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
        // ignore
      }
      this.sourceNode = null;
    }

    if (this.preampGainNode) {
      try {
        this.preampGainNode.disconnect();
      } catch {
        // ignore
      }
      this.preampGainNode = null;
    }

    if (this.analyser) {
      try {
        this.analyser.disconnect();
      } catch {
        // ignore
      }
      this.analyser = null;
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

    if (this.audioContext) {
      try {
        this.audioContext.close().catch(() => {});
      } catch {
        // ignore
      }
      this.audioContext = null;
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
