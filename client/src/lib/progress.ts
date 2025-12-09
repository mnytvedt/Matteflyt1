// Progress management
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
  // This logic is just for display stars, but unlocking logic is strict
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
  // First 4 levels are always unlocked
  if (levelId <= 4) return true;
  
  // Check if previous level was passed with >= 90% accuracy AND < 5s average time
  const progress = getProgress();
  const prevLevel = progress[levelId - 1];
  
  if (!prevLevel) return false;

  const passedAccuracy = prevLevel.accuracy >= 90;
  // If avgTime is undefined (legacy data), we might block or allow. 
  // Let's assume strict: must have speed data. 
  // If user played before this update, they might need to replay.
  const passedSpeed = prevLevel.avgTime !== undefined && prevLevel.avgTime < 5;

  return passedAccuracy && passedSpeed;
}
