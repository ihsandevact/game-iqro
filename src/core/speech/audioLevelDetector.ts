/**
 * Detektor Level Volume Suara Real-Time (Web Audio API)
 * 
 * Mengukur tingkat desibel/energi suara dari mikrofon secara langsung
 * untuk memberikan indikator visual (VU-meter) dan Voice Activity Detection (VAD).
 */

export interface AudioLevelDetectorOptions {
  deviceId?: string;
  onVolume: (volume: number, isSpeaking: boolean) => void;
  onError?: (errMessage: string) => void;
}

export class AudioLevelDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private isRunning = false;
  private vocalThreshold = 14; // Ambang batas desibel/energi yang dianggap suara manusia

  public async start(options: AudioLevelDetectorOptions): Promise<boolean> {
    this.stop();

    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      if (options.onError) options.onError('Browser tidak mendukung akses media stream mikrofon.');
      return false;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: options.deviceId
          ? {
              deviceId: { exact: options.deviceId },
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          : {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.5;

      this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);
      this.sourceNode.connect(this.analyser);

      this.isRunning = true;
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      const updateLoop = () => {
        if (!this.isRunning || !this.analyser) return;

        this.analyser.getByteFrequencyData(dataArray);

        // Hitung RMS rata-rata amplitudo
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        // Skala 0 - 100
        const volume = Math.min(100, Math.round((avg / 128) * 100));
        const isSpeaking = volume >= this.vocalThreshold;

        options.onVolume(volume, isSpeaking);

        this.animFrameId = requestAnimationFrame(updateLoop);
      };

      this.animFrameId = requestAnimationFrame(updateLoop);
      return true;
    } catch (err: any) {
      this.stop();
      if (options.onError) {
        options.onError(err?.message || 'Gagal menyambungkan mikrofon untuk visualisasi suara.');
      }
      return false;
    }
  }

  public stop(): void {
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
      this.analyser = null;
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
}

export const audioLevelDetector = new AudioLevelDetector();
