/**
 * Layanan Web Speech Recognition untuk Deteksi Suara & Pelafalan
 * 
 * Membungkus SpeechRecognition / webkitSpeechRecognition API
 * dengan penanganan siklus hidup yang aman, reaktif, dan ramah anak.
 */

// Deklarasi interface SpeechRecognition untuk TypeScript
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

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as IWindowSpeech;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public getState(): SpeechServiceState {
    return this.state;
  }

  /**
   * Mulai mendengarkan suara pengguna melalui mikrofon
   */
  public startListening(options: StartListeningOptions): boolean {
    if (!this.isSupported()) {
      if (options.onError) {
        options.onError('Browser tidak mendukung Speech Recognition.', 'not-supported');
      }
      return false;
    }

    // Bersihkan sesi sebelumnya jika masih ada
    this.stopListening();

    try {
      const win = window as IWindowSpeech;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
      this.isExplicitlyStopped = false;
      this.state = 'listening';
      this.currentOnEnd = options.onEnd || null;
      this.currentOnError = options.onError || null;

      // Konfigurasi
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 5;
      this.recognition.lang = options.lang || 'id-ID'; // Default fonetik Indonesia

      this.recognition.onresult = (event: any) => {
        const transcripts: string[] = [];
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) isFinal = true;

          for (let j = 0; j < res.length; j++) {
            const transcript = res[j].transcript;
            if (transcript && !transcripts.includes(transcript)) {
              transcripts.push(transcript);
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
            userMessage = 'Izin mikrofon belum diberikan. Silakan izinkan akses mikrofon di browser.';
            break;
          case 'no-speech':
            userMessage = 'Suara belum terdengar. Ayo coba ucapkan lebih dekat ke mikrofon ya!';
            break;
          case 'network':
            userMessage = 'Koneksi pengenalan suara terputus. Pastikan perangkat terhubung internet.';
            break;
          case 'aborted':
            // Dihentikan secara sengaja, abaikan pesan error
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
        this.clearTimer();
        this.state = 'idle';
        if (this.currentOnEnd && !this.isExplicitlyStopped) {
          this.currentOnEnd();
        }
      };

      this.recognition.start();

      // Timeout penjaga agar mikrofon tidak menggantung jika anak terdiam lama
      const timeout = options.timeoutMs || 8000;
      this.silenceTimer = setTimeout(() => {
        if (this.state === 'listening') {
          this.stopListening();
        }
      }, timeout);

      return true;
    } catch (e: any) {
      this.state = 'error';
      if (options.onError) {
        options.onError(e?.message || 'Gagal memulai mikrofon.', 'init-error');
      }
      return false;
    }
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
        // abaikan jika sudah berhenti
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
