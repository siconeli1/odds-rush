export interface RoundConfig {
  timeLimitSeconds: number;
}

export function getRoundConfig(roundNumber: number): RoundConfig {
  if (roundNumber <= 3) return { timeLimitSeconds: 6 };
  if (roundNumber <= 7) return { timeLimitSeconds: 5 };
  if (roundNumber <= 9) return { timeLimitSeconds: 4 };
  return { timeLimitSeconds: 3 };
}
