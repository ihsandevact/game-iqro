// Indonesian Child-Friendly Narrator Voice Synthesis

class TTSNarrator {
  private voice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

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

      // Retain utterance reference to prevent GC drops in Chromium
      this.currentUtterance = utterance;

      let called = false;
      const finish = () => {
        if (!called) {
          called = true;
          this.currentUtterance = null;
          onEnd?.();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      window.speechSynthesis.speak(utterance);
    } catch {
      this.currentUtterance = null;
      onEnd?.();
    }
  }

  public speakLetter(letterName: string, onEnd?: () => void) {
    // Speak letter clearly e.g. "Ba!" or "Ta!"
    this.speak(letterName, onEnd);
  }

  public speakPraise(childNameOrOnEnd?: string | (() => void), onEnd?: () => void) {
    let childName = 'Faqih';
    let callback = onEnd;

    if (typeof childNameOrOnEnd === 'function') {
      callback = childNameOrOnEnd;
    } else if (typeof childNameOrOnEnd === 'string' && childNameOrOnEnd.trim()) {
      childName = childNameOrOnEnd.trim();
    }

    const praises = [
      `Hebat sekali, ${childName}!`,
      `Masya Allah, ${childName} pintar!`,
      `Luar biasa, benar sekali!`,
      `Wah, keren banget ${childName}!`,
      `Bagus sekali, ${childName}!`
    ];
    const chosen = praises[Math.floor(Math.random() * praises.length)];
    this.speak(chosen, callback);
  }

  public speakEncourage(childName?: string, onEnd?: () => void) {
    const name = childName?.trim() || 'Faqih';
    const encourages = [
      `Oops, ayo coba dengarkan lagi ya ${name}!`,
      `Hampir benar, yuk coba lagi ${name}!`,
      `Ayo semangat ${name}, kamu pasti bisa!`
    ];
    const chosen = encourages[Math.floor(Math.random() * encourages.length)];
    this.speak(chosen, onEnd);
  }

  public speakGreeting(childName: string, onEnd?: () => void) {
    const name = childName.trim() || 'Faqih';
    this.speak(`Halo ${name}! Ayo semangat belajar mengaji bersamaku!`, onEnd);
  }

  public isSpeaking(): boolean {
    return !!this.currentUtterance;
  }

  public stop() {
    this.currentUtterance = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const ttsNarrator = new TTSNarrator();
