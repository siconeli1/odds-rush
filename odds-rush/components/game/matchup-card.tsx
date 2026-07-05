import { StyleSheet, Text, View } from 'react-native';

import { GameColors } from '@/constants/game-theme';
import type { Scenario } from '@/data/types';

import { TeamRow } from './team-row';

interface MatchupCardProps {
  scenario: Scenario;
}

export function MatchupCard({ scenario }: MatchupCardProps) {
  return (
    <View style={styles.container}>
      <TeamRow
        name={scenario.teamA}
        form={scenario.formA}
        isHome={scenario.homeTeam === 'A'}
      />
      <View style={styles.divider}>
        <Text style={styles.dividerText}>x</Text>
      </View>
      <TeamRow
        name={scenario.teamB}
        form={scenario.formB}
        isHome={scenario.homeTeam === 'B'}
      />
      <Text style={styles.headToHead}>{scenario.headToHead}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GameColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GameColors.border,
    padding: 20,
    gap: 14,
    marginHorizontal: 20,
  },
  divider: {
    alignSelf: 'center',
  },
  dividerText: {
    color: GameColors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  headToHead: {
    color: GameColors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
});
