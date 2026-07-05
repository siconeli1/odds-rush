import { resolveBet } from "./resolveBet.ts";
import { getStreakMultiplier, calculateStreakBonus, canCashOutStreak } from "./streak.ts";
import { getRoundConfig } from "./roundConfig.ts";
import scenariosData from "../data/scenarios.json" with { type: "json" };
import type { Scenario } from "../data/types.ts";

const scenarios = scenariosData as unknown as Scenario[];

console.log("=== resolveBet ===");

const scenario1 = scenarios[0]; // Alfa (odd 1.40) x Beta, result "A"
console.log(
  `#${scenario1.id} ${scenario1.teamA} x ${scenario1.teamB} | odds A=${scenario1.odds.A} | resultado real: ${scenario1.result}`
);

// Aposta certa em A, favorito, aposta 100
console.log(
  "  Apostou 100 em A (acerta):",
  resolveBet(scenario1, "A", 100)
);

// Aposta errada em draw, aposta 100
console.log(
  "  Apostou 100 em draw (erra):",
  resolveBet(scenario1, "draw", 100)
);

// Aposta errada em B, aposta 50
console.log(
  "  Apostou 50 em B (erra):",
  resolveBet(scenario1, "B", 50)
);

const scenario7 = scenarios[6]; // Norte x Órion, zebra, resultado "B", odd 12.00
console.log(
  `\n#${scenario7.id} ${scenario7.teamA} x ${scenario7.teamB} | odds B=${scenario7.odds.B} | resultado real: ${scenario7.result}`
);
console.log(
  "  Apostou 20 em B, a zebra (acerta):",
  resolveBet(scenario7, "B", 20)
);
console.log(
  "  Apostou 20 em A, o favorito (erra, apesar de favorito):",
  resolveBet(scenario7, "A", 20)
);

const scenario3 = scenarios[2]; // Épsilon x Zeta, resultado "draw"
console.log(
  `\n#${scenario3.id} ${scenario3.teamA} x ${scenario3.teamB} | odds draw=${scenario3.odds.draw} | resultado real: ${scenario3.result}`
);
console.log(
  "  Apostou 100 em draw (acerta):",
  resolveBet(scenario3, "draw", 100)
);

console.log("\n=== getStreakMultiplier ===");
for (let streak = 0; streak <= 7; streak++) {
  console.log(`  streak=${streak} -> x${getStreakMultiplier(streak)}`);
}

console.log("\n=== calculateStreakBonus ===");
console.log("  Simulando uma streak de apostas de 100 fichas:");
let pot = 0;
for (let streak = 1; streak <= 5; streak++) {
  const multiplier = getStreakMultiplier(streak);
  const bonus = calculateStreakBonus(100, multiplier);
  pot += bonus;
  console.log(
    `  streak=${streak} (x${multiplier}) -> bônus da rodada +${bonus}, pot acumulado=${pot}, pode embolsar? ${canCashOutStreak(streak)}`
  );
}

console.log("\n=== getRoundConfig ===");
for (let round = 1; round <= 10; round++) {
  console.log(
    `  rodada ${round} -> ${getRoundConfig(round).timeLimitSeconds}s`
  );
}
