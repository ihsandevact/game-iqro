import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { AppLayout } from './components/layout/AppLayout';
import { JourneyMap } from './games/iqro/components/JourneyMap';
import { StageModal } from './games/iqro/components/StageModal';
import { SplashScreen } from './components/splash/SplashScreen';
import { WelcomeModal } from './components/onboarding/WelcomeModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { IosInstallModal } from './components/pwa/IosInstallModal';
import { usePwaInstall } from './components/pwa/usePwaInstall';
import { QariStudioDashboard } from './components/studio/QariStudioDashboard';
import { IQRO_BOOKS } from './games/iqro/data/iqroLevels';
import { Stage, IqroLevelId } from './core/types/gameTypes';
import { useProgressStore } from './core/storage/useProgressStore';
import { ttsNarrator } from './core/audio/ttsNarrator';

export function App() {
  const {
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
  } = useProgressStore();

  const { isInstallable, showIosGuide, setShowIosGuide, installApp } = usePwaInstall();
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

  // Sync URL query/hash parameter with Studio page view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleHashOrQuery = () => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('studio') === 'true' || params.get('mode') === 'studio' || window.location.hash === '#studio') {
          setIsStudioOpen(true);
        } else {
          setIsStudioOpen(false);
        }
      };
      handleHashOrQuery();
      window.addEventListener('popstate', handleHashOrQuery);
      window.addEventListener('hashchange', handleHashOrQuery);
      return () => {
        window.removeEventListener('popstate', handleHashOrQuery);
        window.removeEventListener('hashchange', handleHashOrQuery);
      };
    }
  }, []);

  const openStudio = () => {
    setIsStudioOpen(true);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('studio', 'true');
      window.history.pushState({ view: 'studio' }, '', url.toString());
    }
  };

  const closeStudio = () => {
    setIsStudioOpen(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('studio');
      if (url.hash === '#studio') url.hash = '';
      const newQuery = url.search ? url.search : '';
      window.history.pushState({}, '', url.pathname + newQuery);
    }
  };

  // Preload personalized audio from IndexedDB for the active child name
  useEffect(() => {
    if (progress.childName) {
      ttsNarrator.loadChildAudio(progress.childName);
    }
  }, [progress.childName]);

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

  if (isStudioOpen) {
    return (
      <div className="w-full min-h-[100dvh] flex flex-col font-sans select-none">
        <QariStudioDashboard onBack={closeStudio} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] flex flex-col font-sans select-none">
      {/* Playful Animated Duolingo-style Splash Screen */}
      <AnimatePresence>
        {isAppLoading && (
          <SplashScreen
            onComplete={() => setIsAppLoading(false)}
            childName={progress.childName}
            equippedHat={progress.equippedHat}
            equippedGlasses={progress.equippedGlasses}
            equippedCape={progress.equippedCape}
          />
        )}
      </AnimatePresence>

      {/* First-time Onboarding Welcome Modal */}
      {!isAppLoading && !progress.hasCompletedOnboarding && (
        <WelcomeModal
          onComplete={completeOnboarding}
          equippedHat={progress.equippedHat}
          equippedGlasses={progress.equippedGlasses}
          equippedCape={progress.equippedCape}
        />
      )}

      {/* Top Navigation Bar */}
      <Navbar
        currentLevel={progress.currentIqroLevel}
        onSelectLevel={handleSelectLevel}
        isBookUnlocked={isBookUnlocked}
        gems={progress.gemsTotal}
        streak={progress.streakDays}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenStudio={openStudio}
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
        childName={progress.childName}
      >
        <JourneyMap
          currentBook={currentBook}
          completedStages={progress.completedStages}
          isStageUnlocked={isStageUnlocked}
          onSelectStage={handleSelectStage}
          isBookUnlocked={isBookUnlocked}
          onSwitchToBook={handleSelectLevel}
        />
      </AppLayout>

      {/* Interactive Stage Dialog Modal */}
      {selectedStage && (
        <StageModal
          stage={selectedStage}
          onClose={() => setSelectedStage(null)}
          onComplete={handleCompleteStage}
          childName={progress.childName}
          equippedHat={progress.equippedHat}
          equippedGlasses={progress.equippedGlasses}
          equippedCape={progress.equippedCape}
        />
      )}

      {/* Settings & Reset Progress Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        childName={progress.childName}
        onUpdateChildName={setChildName}
        currentLevel={progress.currentIqroLevel}
        starsTotal={progress.starsTotal}
        gemsTotal={progress.gemsTotal}
        streakDays={progress.streakDays}
        soundEnabled={progress.soundEnabled}
        onToggleSound={toggleSound}
        onResetLevel={resetCurrentLevel}
        onResetAll={resetAllProgress}
        isInstallable={isInstallable}
        onInstallPwa={installApp}
        equippedHat={progress.equippedHat}
        equippedGlasses={progress.equippedGlasses}
        equippedCape={progress.equippedCape}
        unlockedAllLevels={!!progress.unlockedAllLevels}
        onToggleUnlockAllLevels={toggleUnlockAllLevels}
      />

      {/* iOS Safari Guide Modal */}
      <IosInstallModal
        isOpen={showIosGuide}
        onClose={() => setShowIosGuide(false)}
      />
    </div>
  );
}

export default App;
