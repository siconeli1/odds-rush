const STREAK_MULTIPLIERS = [1, 1.2, 1.5, 2, 3];

export const MIN_STREAK_TO_CASH_OUT = 3;

export function getStreakMultiplier(streakCount: number): number {
  if (streakCount >= 5) return 5;
  return STREAK_MULTIPLIERS[streakCount];
}

export function calculateStreakBonus(betAmount: number, multiplier: number): number {
  return Math.round(betAmount * (multiplier - 1));
}

export function canCashOutStreak(streakCount: number): boolean {
  return streakCount >= MIN_STREAK_TO_CASH_OUT;
}
