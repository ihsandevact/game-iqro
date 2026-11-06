/**
 * Layanan Web Speech Recognition untuk Deteksi Suara & Pelafalan
 * 
 * Membungkus SpeechRecognition / webkitSpeechRecognition API
 * dengan mode continuous listening, multi-alternatives, dan auto-resilience.
 */

interface IWindowSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export type SpeechServiceState = 'idle' | 'listening' | 'processing' | 'error';

export interface StartListeningOptions {
  lang?: string;
  timeoutMs?: number;
  onResult: (transcripts: string[], isFinal: boolean) => void;
  onError?: (errorMessage: string, errorCode?: string) => void;
  onEnd?: () => void;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private state: SpeechServiceState = 'idle';
  private silenceTimer: any = null;
  private currentOnEnd: (() => void) | null = null;
  private currentOnError: ((err: string, code?: string) => void) | null = null;
  private isExplicitlyStopped = false;
  private activeOptions: StartListeningOptions | null = null;

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as IWindowSpeech;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public getState(): SpeechServiceState {
    return this.state;
  }

  /**
   * Mulai mendengarkan suara pengguna melalui mikrofon secara terus-menerus
   */
  public startListening(options: StartListeningOptions): boolean {
    if (!this.isSupported()) {
      if (options.onError) {
        options.onError('Browser tidak mendukung Speech Recognition.', 'not-supported');
      }
      return false;
    }

    this.stopListening();

    try {
      this.activeOptions = options;
      this.isExplicitlyStopped = false;
      this.currentOnEnd = options.onEnd || null;
      this.currentOnError = options.onError || null;

      this.initRecognition(options);
      return true;
    } catch (e: any) {
      this.state = 'error';
      if (options.onError) {
        options.onError(e?.message || 'Gagal memulai mikrofon.', 'init-error');
      }
      return false;
    }
  }

  private initRecognition(options: StartListeningOptions): void {
    const win = window as IWindowSpeech;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionClass();
    this.state = 'listening';

    // Konfigurasi sensitif tinggi untuk pengucapan kata/huruf tunggal
    this.recognition.continuous = false; // Mode single-utterance: respon super cepat (200ms) tanpa buffering tertunda
    this.recognition.interimResults = true; // Berikan hasil sementara secepat mungkin
    this.recognition.maxAlternatives = 10; // Ambil hingga 10 hipotesis kata dari Google ASR
    this.recognition.lang = options.lang || 'id-ID'; // Default bahasa Indonesia untuk santri lokal

    this.recognition.onresult = (event: any) => {
      const transcripts: string[] = [];
      let isFinal = false;

      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) isFinal = true;

        for (let j = 0; j < res.length; j++) {
          const transcript = res[j].transcript;
          if (transcript && !transcripts.includes(transcript.trim())) {
            transcripts.push(transcript.trim());
          }
        }
      }

      if (transcripts.length > 0) {
        options.onResult(transcripts, isFinal);
      }
    };

    this.recognition.onerror = (event: any) => {
      const error = event.error;
      let userMessage = 'Terjadi kendala pada mikrofon.';

      switch (error) {
        case 'not-allowed':
        case 'permission-denied':
          userMessage = 'Izin mikrofon belum diberikan. Silakan klik ikon gembok di address bar browser dan izinkan mikrofon.';
          this.isExplicitlyStopped = true;
          break;
        case 'no-speech':
          // Pada mode continuous, no-speech bisa terjadi saat hening, jangan batalkan
          return;
        case 'network':
          userMessage = 'Pengenalan suara memerlukan koneksi internet aktif.';
          break;
        case 'aborted':
          return;
        default:
          userMessage = `Kendala suara (${error}).`;
          break;
      }

      this.state = 'error';
      if (this.currentOnError && !this.isExplicitlyStopped) {
        this.currentOnError(userMessage, error);
      }
    };

    this.recognition.onend = () => {
      // Auto-reconnect jika belum dihentikan secara sengaja
      if (!this.isExplicitlyStopped && this.state === 'listening' && this.activeOptions) {
        try {
          this.recognition.start();
          return;
        } catch {
          // abaikan
        }
      }

      this.clearTimer();
      this.state = 'idle';
      if (this.currentOnEnd && !this.isExplicitlyStopped) {
        this.currentOnEnd();
      }
    };

    this.recognition.start();

    // Timeout penjaga maksimal (default 12 detik)
    const timeout = options.timeoutMs || 12000;
    this.silenceTimer = setTimeout(() => {
      if (this.state === 'listening') {
        this.stopListening();
      }
    }, timeout);
  }

  /**
   * Hentikan perekaman secara mulus
   */
  public stopListening(): void {
    this.isExplicitlyStopped = true;
    this.clearTimer();

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // abaikan
      }
      this.recognition = null;
    }
    this.state = 'idle';
  }

  /**
   * Batalkan perekaman seketika
   */
  public abortListening(): void {
    this.isExplicitlyStopped = true;
    this.clearTimer();

    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // abaikan
      }
      this.recognition = null;
    }
    this.state = 'idle';
  }

  private clearTimer(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
