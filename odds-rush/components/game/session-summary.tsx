import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GameColors } from '@/constants/game-theme';
import { formatChips } from '@/lib/format-chips';

interface SessionSummaryProps {
  balance: number;
  record: number;
  isNewRecord: boolean;
  maxStreak: number;
  correctCount: number;
  totalRounds: number;
  onPlayAgain: () => void;
}

export function SessionSummary({
  balance,
  record,
  isNewRecord,
  maxStreak,
  correctCount,
  totalRounds,
  onPlayAgain,
}: SessionSummaryProps) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>FIM DE SESSÃO</Text>
      {isNewRecord && <Text style={styles.newRecordBadge}>NOVO RECORDE!</Text>}

      <View style={styles.statsBlock}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>SALDO FINAL</Text>
          <Text style={styles.statValue}>{formatChips(balance)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>RECORDE</Text>
          <Text style={[styles.statValue, isNewRecord && styles.statValueHighlight]}>
            {formatChips(record)}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>MAIOR STREAK</Text>
          <Text style={styles.statValue}>{maxStreak}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>ACERTOS</Text>
          <Text style={styles.statValue}>
            {correctCount}/{totalRounds}
          </Text>
        </View>
      </View>

      <Pressable style={styles.playAgainButton} onPress={onPlayAgain}>
        <Text style={styles.playAgainText}>JOGAR DE NOVO</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GameColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 32,
  },
  title: {
    color: GameColors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  newRecordBadge: {
    color: GameColors.draw,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statsBlock: {
    alignSelf: 'stretch',
    backgroundColor: GameColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GameColors.border,
    padding: 24,
    gap: 18,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    color: GameColors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statValue: {
    color: GameColors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  statValueHighlight: {
    color: GameColors.draw,
  },
  playAgainButton: {
    alignSelf: 'stretch',
    backgroundColor: GameColors.accent,
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: 'center',
  },
  playAgainText: {
    color: GameColors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
