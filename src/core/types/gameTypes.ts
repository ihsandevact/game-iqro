export type IqroLevelId = 1 | 2 | 3 | 4 | 5 | 6;

export type StageType = 'learn' | 'listen-tap' | 'bubble-pop' | 'matching' | 'boss-challenge';

export interface Question {
  id: string;
  type: StageType;
  promptText: string;
  targetLetter: string;      // e.g. "بَ"
  targetName: string;        // e.g. "Ba"
  targetAudioKey?: string;   // key for sound
  options: {
    letter: string;
    name: string;
    isCorrect: boolean;
  }[];
  hint?: string;
}

export interface Stage {
  id: string;                // e.g. "iqro1-u1-s1"
  title: string;             // e.g. "Kenalan Huruf A & Ba"
  subtitle: string;
  type: StageType;
  unitNumber: number;
  stageNumber: number;
  unlockedByDefault?: boolean;
  lettersCovered: string[];  // e.g. ["اَ", "بَ"]
  questions: Question[];
}

export interface Unit {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  themeColor: string;
  stages: Stage[];
}

export interface IqroBook {
  level: IqroLevelId;
  title: string;
  subtitle: string;
  color: string;
  totalStages: number;
  units: Unit[];
}

export interface UserProgress {
  currentIqroLevel: IqroLevelId;
  completedStages: Record<string, { stars: number; highscore: number }>;
  starsTotal: number;
  gemsTotal: number;
  streakDays: number;
  soundEnabled: boolean;
  bgmEnabled: boolean;
}
