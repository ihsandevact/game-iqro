// Natural Neural Audio & Indonesian Child-Friendly Narrator Engine

const LETTER_AUDIO_MAP: Record<string, string> = {
  'alif': '/audio/letters/alif.mp3',
  'a': '/audio/letters/alif.mp3',
  'ba': '/audio/letters/ba.mp3',
  'ta': '/audio/letters/ta.mp3',
  'tsa': '/audio/letters/tsa.mp3',
  'jim': '/audio/letters/jim.mp3',
  'ja': '/audio/letters/jim.mp3',
  'ha': '/audio/letters/ha.mp3',
  'kho': '/audio/letters/kho.mp3',
  'dal': '/audio/letters/dal.mp3',
  'da': '/audio/letters/dal.mp3',
  'dzal': '/audio/letters/dzal.mp3',
  'dza': '/audio/letters/dzal.mp3',
  'ro': '/audio/letters/ro.mp3',
  'zai': '/audio/letters/zai.mp3',
  'za': '/audio/letters/zai.mp3',
  'sin': '/audio/letters/sin.mp3',
  'sa': '/audio/letters/sin.mp3',
  'syin': '/audio/letters/syin.mp3',
  'sya': '/audio/letters/syin.mp3',
  'shod': '/audio/letters/shod.mp3',
  'sho': '/audio/letters/shod.mp3',
  'dhod': '/audio/letters/dhod.mp3',
  'dho': '/audio/letters/dhod.mp3',
  'tho': '/audio/letters/tho.mp3',
  'zho': '/audio/letters/zho.mp3',
  'ain': '/audio/letters/ain.mp3',
  "'ain": '/audio/letters/ain.mp3',
  'ghoin': '/audio/letters/ghoin.mp3',
  'gho': '/audio/letters/ghoin.mp3',
  'fa': '/audio/letters/fa.mp3',
  'qof': '/audio/letters/qof.mp3',
  'qo': '/audio/letters/qof.mp3',
  'kaf': '/audio/letters/kaf.mp3',
  'ka': '/audio/letters/kaf.mp3',
  'lam': '/audio/letters/lam.mp3',
  'la': '/audio/letters/lam.mp3',
  'mim': '/audio/letters/mim.mp3',
  'ma': '/audio/letters/mim.mp3',
  'nun': '/audio/letters/nun.mp3',
  'na': '/audio/letters/nun.mp3',
  'waw': '/audio/letters/waw.mp3',
  'wa': '/audio/letters/waw.mp3',
  'haa': '/audio/letters/haa.mp3',
  'ya': '/audio/letters/ya.mp3',
};

const PRAISE_AUDIO_LIST = [
  '/audio/praises/praise_hebat.mp3',
  '/audio/praises/praise_pintar.mp3',
  '/audio/praises/praise_luarbiasa.mp3',
  '/audio/praises/praise_keren.mp3',
  '/audio/praises/praise_bagus.mp3',
];

const ENCOURAGE_AUDIO_LIST = [
  '/audio/encourages/encourage_coba_lagi.mp3',
  '/audio/encourages/encourage_hampir.mp3',
  '/audio/encourages/encourage_semangat.mp3',
];

class TTSNarrator {
  private voice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;

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
    // Prioritize natural Indonesian neural voices if available
    const idVoice = voices.find(
      (v) => (v.lang.startsWith('id') || v.lang.includes('ID')) && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online'))
    ) || voices.find((v) => v.lang.startsWith('id') || v.lang.includes('ID'));

    if (idVoice) {
      this.voice = idVoice;
    }
  }

  private playAudio(src: string, onEnd?: () => void): boolean {
    if (typeof window === 'undefined') {
      onEnd?.();
      return true;
    }

    try {
      this.stop();
      const audio = new Audio(src);
      this.currentAudio = audio;

      let called = false;
      const finish = () => {
        if (!called) {
          called = true;
          this.currentAudio = null;
          onEnd?.();
        }
      };

      audio.onended = finish;
      audio.onerror = () => {
        this.currentAudio = null;
        onEnd?.();
      };

      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch(() => {
          this.currentAudio = null;
          onEnd?.();
        });
      }
      return true;
    } catch {
      onEnd?.();
      return false;
    }
  }

  public speak(text: string, onEnd?: () => void) {
    const lower = text.toLowerCase().trim();

    // Check if matching neural prompt audio exists
    if (lower.includes('cari huruf ba')) {
      return this.playAudio('/audio/prompts/prompt_cari_ba.mp3', onEnd);
    }
    if (lower.includes('mana huruf a')) {
      return this.playAudio('/audio/prompts/prompt_mana_a.mp3', onEnd);
    }
    if (lower.includes('tulis huruf ba')) {
      return this.playAudio('/audio/prompts/prompt_tulis_ba.mp3', onEnd);
    }
    if (lower.includes('dengarkan suara')) {
      return this.playAudio('/audio/prompts/prompt_dengarkan.mp3', onEnd);
    }
    if (lower.includes('pelajaran selesai')) {
      return this.playAudio('/audio/prompts/prompt_selesai.mp3', onEnd);
    }
    if (lower.includes('semangat belajar mengaji')) {
      return this.playAudio('/audio/prompts/prompt_sapaan.mp3', onEnd);
    }

    // Check if it's a letter name
    const cleanLetter = lower.replace(/^(huruf|suara)\s+/i, '').replace(/[^a-z']/g, '');
    if (LETTER_AUDIO_MAP[cleanLetter]) {
      return this.playAudio(LETTER_AUDIO_MAP[cleanLetter], onEnd);
    }

    // Fallback to browser SpeechSynthesis
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    try {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.lang = 'id-ID';
      utterance.rate = 0.98;
      utterance.pitch = 1.15;

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
    const key = letterName.toLowerCase().replace(/[^a-z']/g, '');
    if (LETTER_AUDIO_MAP[key]) {
      this.playAudio(LETTER_AUDIO_MAP[key], onEnd);
    } else {
      this.speak(letterName, onEnd);
    }
  }

  public speakPraise(_childNameOrOnEnd?: string | (() => void), onEnd?: () => void) {
    let callback = onEnd;
    if (typeof _childNameOrOnEnd === 'function') {
      callback = _childNameOrOnEnd;
    }

    // Play high-fidelity neural Indonesian praise audio
    const chosen = PRAISE_AUDIO_LIST[Math.floor(Math.random() * PRAISE_AUDIO_LIST.length)];
    this.playAudio(chosen, callback);
  }

  public speakEncourage(_childName?: string, onEnd?: () => void) {
    // Play high-fidelity neural Indonesian encourage audio
    const chosen = ENCOURAGE_AUDIO_LIST[Math.floor(Math.random() * ENCOURAGE_AUDIO_LIST.length)];
    this.playAudio(chosen, onEnd);
  }

  public speakGreeting(_childName: string, onEnd?: () => void) {
    this.playAudio('/audio/prompts/prompt_sapaan.mp3', onEnd);
  }

  public isSpeaking(): boolean {
    return !!this.currentUtterance || !!this.currentAudio;
  }

  public stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }

    this.currentUtterance = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const ttsNarrator = new TTSNarrator();
