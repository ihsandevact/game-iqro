import React from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { IqroBook, Stage } from '../../../core/types/gameTypes';
import { LevelNode } from './LevelNode';

interface JourneyMapProps {
  currentBook: IqroBook;
  completedStages: Record<string, { stars: number; highscore: number }>;
  isStageUnlocked: (stageId: string, defaultUnlocked?: boolean) => boolean;
  onSelectStage: (stage: Stage) => void;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({
  currentBook,
  completedStages,
  isStageUnlocked,
  onSelectStage,
}) => {
  // Winding serpentine offsets in pixels for each successive step
  const windingOffsets = [0, -40, -65, -35, 0, 35, 65, 40];

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
