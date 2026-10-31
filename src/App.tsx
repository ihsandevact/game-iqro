import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { AppLayout } from './components/layout/AppLayout';
import { JourneyMap } from './games/iqro/components/JourneyMap';
import { StageModal } from './games/iqro/components/StageModal';
import { SplashScreen } from './components/splash/SplashScreen';
import { IQRO_BOOKS } from './games/iqro/data/iqroLevels';
import { Stage, IqroLevelId } from './core/types/gameTypes';
import { useProgressStore } from './core/storage/useProgressStore';

export function App() {
  const {
    progress,
    setIqroLevel,
    completeStage,
    toggleSound,
    buyCostume,
    equipCostume,
    isStageUnlocked,
  } = useProgressStore();

  const [isAppLoading, setIsAppLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

  // Get currently selected Iqro book (defaults to level 1)
  const currentBook =
    IQRO_BOOKS.find((b) => b.level === progress.currentIqroLevel) || IQRO_BOOKS[0];

  const handleSelectLevel = (lvl: IqroLevelId) => {
    setIqroLevel(lvl);
  };

  const handleSelectStage = (stage: Stage) => {
    setSelectedStage(stage);
  };

  const handleCompleteStage = (stageId: string, stars: number) => {
    completeStage(stageId, stars);
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col font-sans select-none">
      {/* Playful Animated Duolingo-style Splash Screen */}
      <AnimatePresence>
        {isAppLoading && (
          <SplashScreen
            onComplete={() => setIsAppLoading(false)}
            equippedHat={progress.equippedHat}
            equippedGlasses={progress.equippedGlasses}
            equippedCape={progress.equippedCape}
          />
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <Navbar
        currentLevel={progress.currentIqroLevel}
        onSelectLevel={handleSelectLevel}
        stars={progress.starsTotal}
        gems={progress.gemsTotal}
        streak={progress.streakDays}
        soundEnabled={progress.soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Main Responsive Game Layout */}
      <AppLayout
        gemsTotal={progress.gemsTotal}
        unlockedItems={progress.unlockedItems}
        equippedHat={progress.equippedHat}
        equippedGlasses={progress.equippedGlasses}
        equippedCape={progress.equippedCape}
        onBuyItem={buyCostume}
        onEquipItem={equipCostume}
      >
        <JourneyMap
          currentBook={currentBook}
          completedStages={progress.completedStages}
          isStageUnlocked={isStageUnlocked}
          onSelectStage={handleSelectStage}
        />
      </AppLayout>

      {/* Interactive Stage Dialog Modal */}
      {selectedStage && (
        <StageModal
          stage={selectedStage}
          onClose={() => setSelectedStage(null)}
          onComplete={handleCompleteStage}
        />
      )}
    </div>
  );
}

export default App;
