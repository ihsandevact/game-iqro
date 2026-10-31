// Indonesian Child-Friendly Narrator Voice Synthesis

class TTSNarrator {
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Find Indonesian voice first, fallback to standard
    const idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('ID'));
    if (idVoice) {
      this.voice = idVoice;
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;  // slightly slower for toddler clarity
      utterance.pitch = 1.15; // slightly higher pitch for cheerful, friendly persona

      utterance.onend = () => {
        onEnd?.();
      };

      utterance.onerror = () => {
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      onEnd?.();
    }
  }

  public speakLetter(letterName: string, onEnd?: () => void) {
    // Speak letter clearly e.g. "Ba!" or "Ta!"
    this.speak(letterName, onEnd);
  }

  public speakPraise(onEnd?: () => void) {
    const praises = [
      'Hebat sekali!',
      'Masya Allah, pintar!',
      'Luar biasa, benar!',
      'Wah, keren banget!',
      'Bagus sekali!'
    ];
    const chosen = praises[Math.floor(Math.random() * praises.length)];
    this.speak(chosen, onEnd);
  }

  public speakEncourage(onEnd?: () => void) {
    const encourages = [
      'Oops, ayo coba dengarkan lagi ya!',
      'Hampir benar, yuk coba lagi!',
      'Ayo semangat, kamu pasti bisa!'
    ];
    const chosen = encourages[Math.floor(Math.random() * encourages.length)];
    this.speak(chosen, onEnd);
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const ttsNarrator = new TTSNarrator();
