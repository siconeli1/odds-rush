import type { Outcome, Scenario } from "../data/types";

export interface BetResult {
  correct: boolean;
  payout: number;
  netChange: number;
}

export function resolveBet(
  scenario: Scenario,
  choice: Outcome,
  betAmount: number
): BetResult {
  const correct = scenario.result === choice;

  if (!correct) {
    return { correct: false, payout: 0, netChange: -betAmount };
  }

  const odd = scenario.odds[choice];
  const payout = betAmount * odd;
  return { correct: true, payout, netChange: payout - betAmount };
}
