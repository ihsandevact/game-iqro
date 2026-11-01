import React from 'react';
import { Sparkles, Trophy, Lock } from 'lucide-react';
import { IqroBook, IqroLevelId, Stage } from '../../../core/types/gameTypes';
import { LevelNode } from './LevelNode';

interface JourneyMapProps {
  currentBook: IqroBook;
  completedStages: Record<string, { stars: number; highscore: number }>;
  isStageUnlocked: (stageId: string, defaultUnlocked?: boolean) => boolean;
  onSelectStage: (stage: Stage) => void;
  isBookUnlocked?: (level: IqroLevelId) => boolean;
  onSwitchToBook?: (level: IqroLevelId) => void;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({
  currentBook,
  completedStages,
  isStageUnlocked,
  onSelectStage,
  isBookUnlocked,
  onSwitchToBook,
}) => {
  // Winding serpentine offsets in pixels for each successive step
  const windingOffsets = [0, -40, -65, -35, 0, 35, 65, 40];

  // Check if book is locked by curriculum progression or feature flag
  if (isBookUnlocked && !isBookUnlocked(currentBook.level)) {
    return (
      <div className="w-full max-w-md mx-auto py-10 px-4 text-center">
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-500 mb-4 shadow-sm">
            <Lock className="w-10 h-10 stroke-[2.5]" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full mb-2">
            Segera Hadir
          </span>
          <h3 className="text-xl font-black text-slate-800 mb-2">
            Petualangan {currentBook.title}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-5 max-w-xs leading-relaxed">
            Materi {currentBook.subtitle} saat ini sedang disiapkan di studio. Ayo selesaikan 22 tahapan di Iqro 1 terlebih dahulu!
          </p>
          {onSwitchToBook && (
            <button
              onClick={() => onSwitchToBook(1)}
              className="py-3 px-6 bg-duo-green hover:bg-duo-greenDark text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-duo-green transition active:translate-y-0.5"
            >
              Lanjutkan Belajar Iqro 1
            </button>
          )}
        </div>
      </div>
    );
  }

  const hasPlayableStages = currentBook.units.some((u) =>
    u.stages.some((s) => s.questions && s.questions.length > 0)
  );

  if (!hasPlayableStages) {
    return (
      <div className="w-full max-w-md mx-auto py-10 px-4 text-center">
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-4xl mb-4 shadow-sm animate-bounce">
            🕌
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full mb-2">
            Segera Hadir
          </span>
          <h3 className="text-xl font-black text-slate-800 mb-1">
            Petualangan {currentBook.title}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-2 max-w-xs leading-relaxed">
            Materi {currentBook.subtitle} sedang disiapkan.
          </p>
          <p className="text-xs font-bold text-duo-green bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl">
            ⭐ Ayo selesaikan 22 tahap Iqro 1 hingga wisuda!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center py-6 px-4">
      {currentBook.units.map((unit) => {
        return (
          <div key={unit.id} className="w-full max-w-md flex flex-col items-center mb-8">
            {/* Unit Header Card */}
            <div
              className="w-full rounded-3xl p-4 text-white shadow-duo-green mb-6 border-b-4 border-black/10 relative overflow-hidden"
              style={{ backgroundColor: unit.themeColor }}
            >
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white/90 mb-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Unit {unit.unitNumber}
                  </div>
                  <h3 className="text-base sm:text-lg font-black">{unit.title}</h3>
                  <p className="text-xs text-white/80 font-semibold">{unit.description}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Decorative background circle */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
            </div>

            {/* Stages Serpentine Nodes */}
            <div className="flex flex-col items-center w-full relative">
              {unit.stages.map((stage, idx) => {
                const unlocked = isStageUnlocked(stage.id, stage.unlockedByDefault);
                const completed = !!completedStages[stage.id];
                const starsEarned = completedStages[stage.id]?.stars || 0;

                // Determine if this is the active (current next) stage
                const isActive = unlocked && !completed;
                const offset = windingOffsets[idx % windingOffsets.length];

                return (
                  <LevelNode
                    key={stage.id}
                    stage={stage}
                    isUnlocked={unlocked}
                    isCompleted={completed}
                    isActive={isActive}
                    starsEarned={starsEarned}
                    offsetPercent={offset}
                    onSelect={onSelectStage}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
