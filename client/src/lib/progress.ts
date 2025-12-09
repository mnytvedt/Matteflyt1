// Progress management
export interface LevelProgress {
  levelId: number;
  accuracy: number;
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

export function saveProgress(levelId: number, accuracy: number) {
  const current = getProgress();
  const stars = accuracy >= 90 ? 3 : accuracy >= 80 ? 2 : accuracy >= 60 ? 1 : 0;
  
  // Only update if better or new
  if (!current[levelId] || accuracy > current[levelId].accuracy) {
    current[levelId] = {
      levelId,
      accuracy,
      unlocked: true,
      stars
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
}

export function isLevelUnlocked(levelId: number): boolean {
  // First 4 levels are always unlocked
  if (levelId <= 4) return true;
  
  // Check if previous level was passed with >= 90% accuracy
  const progress = getProgress();
  const prevLevel = progress[levelId - 1];
  return prevLevel && prevLevel.accuracy >= 90;
}
