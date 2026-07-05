import { StyleSheet, Text, View } from 'react-native';

import { GameColors } from '@/constants/game-theme';
import { formatChips } from '@/lib/format-chips';

interface GameHeaderProps {
  roundNumber: number;
  totalRounds: number;
  streak: number;
  streakMultiplier: number;
  streakBonus: number;
  balance: number;
}

export function GameHeader({
  roundNumber,
  totalRounds,
  streak,
  streakMultiplier,
  streakBonus,
  balance,
}: GameHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.label}>RODADA</Text>
        <Text style={styles.value}>
          {roundNumber}/{totalRounds}
        </Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.label}>STREAK</Text>
        <Text style={styles.value}>{streak}</Text>
        {streak > 0 && <Text style={styles.subValue}>x{streakMultiplier}</Text>}
      </View>
      <View style={styles.stat}>
        <Text style={styles.label}>BÔNUS</Text>
        <Text style={[styles.value, streakBonus > 0 && styles.valueAtRisk]}>
          {formatChips(streakBonus)}
        </Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.label}>SALDO</Text>
        <Text style={styles.value}>{formatChips(balance)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  label: {
    color: GameColors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  value: {
    color: GameColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  valueAtRisk: {
    color: GameColors.draw,
  },
  subValue: {
    color: GameColors.draw,
    fontSize: 12,
    fontWeight: '700',
  },
});
