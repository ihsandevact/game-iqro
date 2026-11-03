export type IqroLevelId = 1 | 2 | 3 | 4 | 5 | 6;

export type StageType = 'learn' | 'listen-tap' | 'bubble-pop' | 'tracing' | 'matching' | 'boss-challenge' | 'pronounce';

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
  tracingPaths?: string[];   // SVG paths for letter tracing
  expectedPronunciations?: string[]; // Kata kunci fonetik alternatif khusus
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

export type CostumeCategory = 'hat' | 'glasses' | 'cape';

export interface CostumeItem {
  id: string;
  name: string;
  category: CostumeCategory;
  price: number;
  icon: string;
  description: string;
}

export interface UserProgress {
  childName: string;
  currentIqroLevel: IqroLevelId;
  completedStages: Record<string, { stars: number; highscore: number }>;
  starsTotal: number;
  gemsTotal: number;
  streakDays: number;
  soundEnabled: boolean;
  bgmEnabled: boolean;
  equippedHat: string;
  equippedGlasses: string;
  equippedCape: string;
  unlockedItems: string[];
  unlockedAllLevels?: boolean;
  hasCompletedOnboarding?: boolean;
}
