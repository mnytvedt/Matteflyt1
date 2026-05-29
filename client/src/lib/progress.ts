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

const STORAGE_KEY_PREFIX = 'math-dash-progress';
const LEGACY_STORAGE_KEY = 'math-dash-progress';
const PROFILE_KEY = 'math-dash-current-profile';
const DEFAULT_PROFILE_CODE = '0000';

function normalizeProfileCode(code: string | null | undefined): string {
  const digits = (code ?? '').replace(/\D/g, '').slice(0, 4);
  return digits.padStart(4, '0') || DEFAULT_PROFILE_CODE;
}

export function getCurrentProfileCode(): string {
  try {
    return normalizeProfileCode(localStorage.getItem(PROFILE_KEY));
  } catch {
    return DEFAULT_PROFILE_CODE;
  }
}

export function setCurrentProfileCode(code: string) {
  try {
    localStorage.setItem(PROFILE_KEY, normalizeProfileCode(code));
  } catch {
    // Ignore storage errors in private mode / restricted browsers.
  }
}

function getStorageKey(profileCode = getCurrentProfileCode()): string {
  return `${STORAGE_KEY_PREFIX}:${normalizeProfileCode(profileCode)}`;
}

export function getProgress(): Record<number, LevelProgress> {
  try {
    const storageKey = getStorageKey();
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      return JSON.parse(stored);
    }

    const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyStored && getCurrentProfileCode() === DEFAULT_PROFILE_CODE) {
      localStorage.setItem(storageKey, legacyStored);
      return JSON.parse(legacyStored);
    }

    return {};
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
    localStorage.setItem(getStorageKey(), JSON.stringify(current));
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
