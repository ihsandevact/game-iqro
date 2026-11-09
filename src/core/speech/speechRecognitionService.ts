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
  onAudioStart?: () => void;
  onSoundStart?: () => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onSoundEnd?: () => void;
  onAudioEnd?: () => void;
  onResult: (transcripts: string[], isFinal: boolean) => void;
  onError?: (errorMessage: string, errorCode?: string) => void;
  onEnd?: () => void;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private state: SpeechServiceState = 'idle';
  private silenceTimer: any = null;
  private restartTimer: any = null;
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

    // Konfigurasi sensitif tinggi untuk pengucapan kata/huruf
    this.recognition.continuous = true; // Jaga koneksi mic tetap terbuka terus tanpa terputus
    this.recognition.interimResults = true; // Berikan hasil sementara secepat mungkin saat suara masuk
    this.recognition.maxAlternatives = 10; // Ambil hingga 10 hipotesis kata dari Google ASR
    this.recognition.lang = options.lang || 'id-ID'; // Default bahasa Indonesia untuk santri lokal

    // Event Deteksi Suara Hardware & Vokal SpeechRecognition Asli
    this.recognition.onaudiostart = () => {
      if (options.onAudioStart) options.onAudioStart();
    };

    this.recognition.onsoundstart = () => {
      if (options.onSoundStart) options.onSoundStart();
    };

    this.recognition.onspeechstart = () => {
      if (options.onSpeechStart) options.onSpeechStart();
    };

    this.recognition.onspeechend = () => {
      if (options.onSpeechEnd) options.onSpeechEnd();
    };

    this.recognition.onsoundend = () => {
      if (options.onSoundEnd) options.onSoundEnd();
    };

    this.recognition.onaudioend = () => {
      if (options.onAudioEnd) options.onAudioEnd();
    };

    this.recognition.onresult = (event: any) => {
      const transcripts: string[] = [];
      let isFinal = false;

      // Baca dari event.resultIndex ke atas (Best Practice Chromium continuous recognition)
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) isFinal = true;

        for (let j = 0; j < res.length; j++) {
          const transcript = res[j].transcript;
          if (transcript && !transcripts.includes(transcript.trim())) {
            transcripts.push(transcript.trim());
          }
        }
      }

      // Fallback jika kosong, ambil transcript item terakhir
      if (transcripts.length === 0 && event.results.length > 0) {
        const lastItem = event.results[event.results.length - 1];
        if (lastItem.isFinal) isFinal = true;
        for (let j = 0; j < lastItem.length; j++) {
          const transcript = lastItem[j].transcript;
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

      switch (error) {
        case 'not-allowed':
        case 'permission-denied':
          this.isExplicitlyStopped = true;
          this.state = 'error';
          if (this.currentOnError) {
            this.currentOnError(
              'Izin mikrofon belum diberikan. Silakan klik ikon gembok di address bar browser dan izinkan mikrofon.',
              error
            );
          }
          break;
        case 'no-speech':
          // Dalam continuous mode, no-speech adalah kondisi hening normal; biarkan terus aktif
          return;
        case 'aborted':
          // Terjadi saat stop / restart terkendali, abaikan
          return;
        case 'network':
          this.state = 'error';
          if (this.currentOnError && !this.isExplicitlyStopped) {
            this.currentOnError('Pengenalan suara memerlukan koneksi internet aktif.', error);
          }
          break;
        default:
          if (this.currentOnError && !this.isExplicitlyStopped) {
            this.currentOnError(`Kendala suara (${error}).`, error);
          }
          break;
      }
    };

    this.recognition.onend = () => {
      // Auto-restart jika browser mengakhiri sesi karena timeout hening (7-10s) saat masih listening
      if (!this.isExplicitlyStopped && this.state === 'listening' && this.activeOptions) {
        if (this.restartTimer) clearTimeout(this.restartTimer);
        this.restartTimer = setTimeout(() => {
          if (!this.isExplicitlyStopped && this.state === 'listening' && this.activeOptions) {
            try {
              this.initRecognition(this.activeOptions);
            } catch (err) {
              console.warn('[Speech] Auto-restart failed:', err);
            }
          }
        }, 150);
        return;
      }

      this.clearTimer();
      this.state = 'idle';
      if (this.currentOnEnd && !this.isExplicitlyStopped) {
        this.currentOnEnd();
      }
    };

    try {
      this.recognition.start();
    } catch (err: any) {
      if (err.name === 'InvalidStateError' && !this.isExplicitlyStopped && this.activeOptions) {
        if (this.restartTimer) clearTimeout(this.restartTimer);
        this.restartTimer = setTimeout(() => {
          if (!this.isExplicitlyStopped && this.activeOptions) {
            this.initRecognition(this.activeOptions);
          }
        }, 200);
      }
    }

    // Timeout penjaga maksimal (default 60 detik)
    const timeout = options.timeoutMs || 60000;
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
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }
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
