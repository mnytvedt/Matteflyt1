// Progress management
import { LEVELS, type LevelConfig } from "@/lib/levels";

export interface LevelProgress {
  levelId: number;
  accuracy: number;
  avgTime: number;
  maxTime: number;
  unlocked: boolean;
  stars: number;
  mastered: boolean;
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

function getLevel(levelId: number): LevelConfig | undefined {
  return LEVELS.find((entry) => entry.id === levelId);
}

function isLevelMastered(progress: Partial<LevelProgress> | undefined, level: LevelConfig): boolean {
  if (!progress) return false;

  if (typeof progress.mastered === 'boolean') return progress.mastered;

  if (typeof progress.maxTime !== 'number') return false;

  return progress.accuracy === level.passingScore && progress.maxTime < level.timeLimitPerQuestion;
}

export function hasMasteredLevel(levelId: number, progress = getProgress()): boolean {
  const level = getLevel(levelId);

  if (!level) return false;

  return isLevelMastered(progress[levelId], level);
}

export function saveProgress(levelId: number, accuracy: number, avgTime: number, maxTime: number) {
  const current = getProgress();

  const level = getLevel(levelId);

  if (!level) return;

  const mastered = accuracy === level.passingScore && maxTime < level.timeLimitPerQuestion;

  let stars = 0;
  if (mastered) stars = 3;
  else if (accuracy === level.passingScore) stars = 2;
  else if (accuracy >= 80) stars = 1;

  const currentProgress = current[levelId];
  const isBetter =
    !currentProgress ||
    stars > currentProgress.stars ||
    (stars === currentProgress.stars && accuracy > currentProgress.accuracy) ||
    (stars === currentProgress.stars && accuracy === currentProgress.accuracy && avgTime < currentProgress.avgTime);

  if (isBetter) {
    current[levelId] = {
      levelId,
      accuracy,
      avgTime,
      maxTime,
      unlocked: true,
      stars,
      mastered,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
}

export function isLevelUnlocked(levelId: number): boolean {
  const progress = getProgress();
  const level = getLevel(levelId);

  if (!level) return false;

  const categoryLevels = LEVELS.filter((entry) => entry.category === level.category);
  const currentIndex = categoryLevels.findIndex((entry) => entry.id === levelId);

  if (currentIndex === -1) return false;

  // First level in each category is always unlocked.
  if (currentIndex === 0) return true;

  const previousLevelInCategory = categoryLevels[currentIndex - 1];

  return isLevelMastered(progress[previousLevelInCategory.id], previousLevelInCategory);
}

export function isAllLevelsCompleted(): boolean {
  const progress = getProgress();

  return LEVELS.every((level) => isLevelMastered(progress[level.id], level));
}
