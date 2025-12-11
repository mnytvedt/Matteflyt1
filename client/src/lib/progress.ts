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
  // Tutorial level (0) is unlocked by default
  if (levelId === 0) return true;
  
  // Check if previous level was passed with >= 90% accuracy AND < 5s average time
  const progress = getProgress();
  const prevLevel = progress[levelId - 1];
  
  if (!prevLevel) return false;

  const passedAccuracy = prevLevel.accuracy >= 90;
  const passedSpeed = prevLevel.avgTime !== undefined && prevLevel.avgTime < 5;

  return passedAccuracy && passedSpeed;
}

export function isAllLevelsCompleted(): boolean {
  const progress = getProgress();
  // We have 21 levels (0-20). Check if all are completed with passing grade.
  for (let i = 0; i <= 20; i++) {
    const p = progress[i];
    if (!p) return false;
    if (p.accuracy < 80) return false; // Minimum passing score
  }
  return true;
}
