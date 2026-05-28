// Progress management
import { LEVELS } from "@/lib/levels";

export interface LevelProgress {
  levelId: number;
  accuracy: number;
  avgTime: number; // New field for speed
  unlocked: boolean;
  stars: number;
}

const STORAGE_KEY = 'math-dash-progress';

export function getProgress(): Record<number, LevelProgress> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveProgress(levelId: number, accuracy: number, avgTime: number) {
  const current = getProgress();
  
  // 3 stars: >90% accuracy AND <5s speed
  // 2 stars: >80% accuracy
  // 1 star: >60% accuracy
  let stars = 0;
  if (accuracy >= 90 && avgTime < 5) stars = 3;
  else if (accuracy >= 80) stars = 2;
  else if (accuracy >= 60) stars = 1;

  // Only update if better (prioritizing stars, then accuracy)
  const currentProgress = current[levelId];
  const isBetter = !currentProgress || stars > currentProgress.stars || (stars === currentProgress.stars && accuracy > currentProgress.accuracy);

  if (isBetter) {
    current[levelId] = {
      levelId,
      accuracy,
      avgTime,
      unlocked: true,
      stars
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
}

export function isLevelUnlocked(levelId: number): boolean {
  const progress = getProgress();
  const level = LEVELS.find((entry) => entry.id === levelId);

  if (!level) return false;

  if (levelId === 0) return true;

  if (level.category === 'multiplication' && levelId === 20) {
    return LEVELS
      .filter((entry) => entry.category === 'addition_subtraction')
      .every((entry) => {
        const savedLevel = progress[entry.id];
        return savedLevel && savedLevel.accuracy >= entry.passingScore;
      });
  }

  const previousLevelConfig = LEVELS.find((entry) => entry.id === levelId - 1);
  const previousLevelProgress = progress[levelId - 1];

  if (!previousLevelConfig || !previousLevelProgress) return false;

  return previousLevelProgress.accuracy >= previousLevelConfig.passingScore;
}

export function isAllLevelsCompleted(): boolean {
  const progress = getProgress();

  return LEVELS.every((level) => {
    const savedLevel = progress[level.id];
    return savedLevel && savedLevel.accuracy >= level.passingScore;
  });
}
