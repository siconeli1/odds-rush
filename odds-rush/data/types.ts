export type MatchResult = "V" | "E" | "D";

export type TeamSide = "A" | "B";

export type Outcome = "A" | "draw" | "B";

export interface ScenarioOdds {
  A: number;
  draw: number;
  B: number;
}

export interface Scenario {
  id: number;
  teamA: string;
  teamB: string;
  homeTeam: TeamSide;
  formA: MatchResult[];
  formB: MatchResult[];
  headToHead: string;
  odds: ScenarioOdds;
  result: Outcome;
  reveal: string;
  difficulty: 1 | 2 | 3;
}
