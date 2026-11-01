import { useState, useEffect } from 'react';
import { IqroLevelId, UserProgress, CostumeItem, CostumeCategory } from '../types/gameTypes';
import { soundManager } from '../audio/soundManager';
import { IQRO_BOOKS } from '../../games/iqro/data/iqroLevels';

// Flatten all stages across books and units for dynamic sequential progression
const ALL_STAGES_SEQUENCE: string[] = IQRO_BOOKS.flatMap((book) =>
  book.units.flatMap((unit) => unit.stages.map((stage) => stage.id))
);

const BOOK_FIRST_STAGES = new Set(
  IQRO_BOOKS.map((book) => book.units[0]?.stages[0]?.id).filter(Boolean)
);

const STORAGE_KEY = 'iqro_petualangan_progress_v1';

// FEATURE FLAG: Set to false to lock Iqro > 1 (temporarily locked for public & local release)
export const ENABLE_IQRO_BEYOND_1 = false;

const DEFAULT_PROGRESS: UserProgress = {
  childName: 'Faqih',
  currentIqroLevel: 1,
  completedStages: {},
  starsTotal: 0,
  gemsTotal: 75, // Generous starting gems so kids can test costumes right away!
  streakDays: 1,
  soundEnabled: true,
  bgmEnabled: true,
  equippedHat: 'hat-default',
  equippedGlasses: 'glasses-none',
  equippedCape: 'cape-none',
  unlockedItems: ['hat-default', 'glasses-none', 'cape-none'],
  unlockedAllLevels: false,
  hasCompletedOnboarding: false,
};

export function useProgressStore() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Existing users who have already completed stages should be marked as onboarded
        const hasCompletedOnboarding =
          parsed.hasCompletedOnboarding ??
          (parsed.completedStages && Object.keys(parsed.completedStages).length > 0);

        // Force reset to Iqro 1 if level > 1 is locked by feature flag
        const currentIqroLevel =
          !ENABLE_IQRO_BEYOND_1 && parsed.currentIqroLevel > 1
            ? 1
            : (parsed.currentIqroLevel || 1);

        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          currentIqroLevel,
          hasCompletedOnboarding: !!hasCompletedOnboarding,
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore quota errors
    }
  }, [progress]);

  const setIqroLevel = (level: IqroLevelId) => {
    if (level > 1 && !ENABLE_IQRO_BEYOND_1) {
      soundManager.playGentleWrong();
      return;
    }
    if (level > 1 && !isBookUnlocked(level)) {
      soundManager.playGentleWrong();
      return;
    }
    setProgress(prev => ({ ...prev, currentIqroLevel: level }));
  };

  const completeStage = (stageId: string, stars: number) => {
    setProgress(prev => {
      const existing = prev.completedStages[stageId];
      const prevStars = existing?.stars || 0;
      const additionalStars = Math.max(0, stars - prevStars);
      const earnedGems = stars * 15;

      return {
        ...prev,
        completedStages: {
          ...prev.completedStages,
          [stageId]: {
            stars: Math.max(prevStars, stars),
            highscore: 100
          }
        },
        starsTotal: prev.starsTotal + additionalStars,
        gemsTotal: prev.gemsTotal + earnedGems
      };
    });
  };

  const toggleSound = () => {
    setProgress(prev => {
      const next = !prev.soundEnabled;
      soundManager.setSoundEnabled(next);
      return { ...prev, soundEnabled: next };
    });
  };

  const buyCostume = (item: CostumeItem): boolean => {
    if (progress.gemsTotal < item.price) {
      soundManager.playGentleWrong();
      return false;
    }

    soundManager.playCorrect();
    setProgress(prev => {
      const newUnlocked = prev.unlockedItems.includes(item.id)
        ? prev.unlockedItems
        : [...prev.unlockedItems, item.id];

      return {
        ...prev,
        gemsTotal: prev.gemsTotal - item.price,
        unlockedItems: newUnlocked,
        ...(item.category === 'hat' ? { equippedHat: item.id } : {}),
        ...(item.category === 'glasses' ? { equippedGlasses: item.id } : {}),
        ...(item.category === 'cape' ? { equippedCape: item.id } : {}),
      };
    });
    return true;
  };

  const equipCostume = (category: CostumeCategory, itemId: string) => {
    soundManager.playPop();
    setProgress(prev => ({
      ...prev,
      ...(category === 'hat' ? { equippedHat: itemId } : {}),
      ...(category === 'glasses' ? { equippedGlasses: itemId } : {}),
      ...(category === 'cape' ? { equippedCape: itemId } : {}),
    }));
  };

  const isBookUnlocked = (bookLevel: IqroLevelId): boolean => {
    if (bookLevel === 1) return true;
    // Feature flag: if false, strictly lock all books > 1
    if (!ENABLE_IQRO_BEYOND_1) return false;
    if (progress.unlockedAllLevels) return true;
    if (bookLevel === 2) {
      // Iqro 2 unlocks when the final graduation stage of Iqro 1 is completed
      return !!progress.completedStages['iqro1-u7-s4'];
    }
    if (bookLevel === 3) {
      return !!progress.completedStages['iqro2-u7-s4'];
    }
    if (bookLevel === 4) {
      return !!progress.completedStages['iqro3-u7-s4'];
    }
    return false;
  };

  const isStageUnlocked = (stageId: string, defaultUnlocked?: boolean): boolean => {
    // If Iqro > 1 is locked by feature flag, reject any non-Iqro 1 stage immediately
    if (!ENABLE_IQRO_BEYOND_1 && !stageId.startsWith('iqro1-')) {
      return false;
    }

    if (progress.unlockedAllLevels) return true;
    if (progress.completedStages[stageId]) return true;

    // Gating: check if stage belongs to a locked book
    if (stageId.startsWith('iqro2-') && !isBookUnlocked(2)) {
      return false;
    }
    if (stageId.startsWith('iqro3-') && !isBookUnlocked(3)) {
      return false;
    }
    if (stageId.startsWith('iqro4-') && !isBookUnlocked(4)) {
      return false;
    }

    if (defaultUnlocked) return true;
    if (BOOK_FIRST_STAGES.has(stageId)) return true;

    // Check linear sequential progression across units and books
    const stageIndex = ALL_STAGES_SEQUENCE.indexOf(stageId);
    if (stageIndex > 0) {
      const prevStageId = ALL_STAGES_SEQUENCE[stageIndex - 1];
      return !!progress.completedStages[prevStageId];
    }

    return false;
  };

  const toggleUnlockAllLevels = (enabled?: boolean) => {
    soundManager.playPop();
    setProgress(prev => ({
      ...prev,
      unlockedAllLevels: enabled !== undefined ? enabled : !prev.unlockedAllLevels,
    }));
  };

  const resetCurrentLevel = (levelId: IqroLevelId) => {
    soundManager.playPop();
    setProgress(prev => {
      // Filter out stages belonging to this level e.g. "iqro1-"
      const prefix = `iqro${levelId}-`;
      const filteredStages: Record<string, { stars: number; highscore: number }> = {};
      let removedStars = 0;

      Object.entries(prev.completedStages).forEach(([key, val]) => {
        if (!key.startsWith(prefix)) {
          filteredStages[key] = val;
        } else {
          removedStars += val.stars;
        }
      });

      return {
        ...prev,
        completedStages: filteredStages,
        starsTotal: Math.max(0, prev.starsTotal - removedStars),
      };
    });
  };

  const setChildName = (name: string) => {
    const trimmed = name.trim() || 'Faqih';
    setProgress(prev => ({ ...prev, childName: trimmed }));
  };

  const completeOnboarding = (name: string) => {
    const trimmed = name.trim() || 'Faqih';
    soundManager.playCorrect();
    setProgress(prev => ({
      ...prev,
      childName: trimmed,
      hasCompletedOnboarding: true,
    }));
  };

  const resetAllProgress = () => {
    soundManager.playPop();
    localStorage.removeItem(STORAGE_KEY);
    setProgress(DEFAULT_PROGRESS);
  };

  return {
    progress,
    setChildName,
    completeOnboarding,
    setIqroLevel,
    completeStage,
    toggleSound,
    buyCostume,
    equipCostume,
    isStageUnlocked,
    isBookUnlocked,
    toggleUnlockAllLevels,
    resetCurrentLevel,
    resetAllProgress,
  };
}
