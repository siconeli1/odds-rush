import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CoinBurst } from '@/components/game/coin-burst';
import { GameColors } from '@/constants/game-theme';
import { canCashOutStreak, MIN_STREAK_TO_CASH_OUT, type BetResult } from '@/game';
import { formatChips } from '@/lib/format-chips';

interface ResultPanelProps {
  result: BetResult;
  timedOut: boolean;
  streakCount: number;
  streakMultiplier: number;
  streakBonus: number;
  forfeitedBonus: number;
  onCashOut: () => void;
  onNext: () => void;
}

export function ResultPanel({
  result,
  timedOut,
  streakCount,
  streakMultiplier,
  streakBonus,
  forfeitedBonus,
  onCashOut,
  onNext,
}: ResultPanelProps) {
  const title = timedOut ? 'TEMPO ESGOTADO' : result.correct ? 'ACERTOU!' : 'ERROU';
  const amountText = result.correct
    ? `+${formatChips(result.netChange)} fichas`
    : `${formatChips(result.netChange)} fichas`;
  const hasActiveStreak = streakCount > 0 && streakBonus > 0;
  const lostBonus = !result.correct && forfeitedBonus > 0;
  const canCashOut = canCashOutStreak(streakCount);
  const roundsToUnlock = MIN_STREAK_TO_CASH_OUT - streakCount;

  return (
    <View style={[styles.container, result.correct ? styles.containerWin : styles.containerLoss]}>
      <Text style={[styles.title, { color: result.correct ? GameColors.win : GameColors.loss }]}>
        {title}
      </Text>
      <View style={styles.amountWrapper}>
        <Text style={[styles.amount, { color: result.correct ? GameColors.win : GameColors.loss }]}>
          {amountText}
        </Text>
        {result.correct && <CoinBurst />}
      </View>

      {lostBonus && (
        <Text style={styles.lostBonusText}>
          Você também perdeu os {formatChips(forfeitedBonus)} fichas de bônus acumulados.
        </Text>
      )}

      {hasActiveStreak && (
        <Text style={styles.streakInfo}>
          STREAK x{streakCount} · x{streakMultiplier} · {formatChips(streakBonus)} fichas em risco
        </Text>
      )}

      <View style={styles.buttonsRow}>
        {hasActiveStreak &&
          (canCashOut ? (
            <Pressable style={[styles.button, styles.cashOutButton]} onPress={onCashOut}>
              <Text style={styles.cashOutButtonText}>EMBOLSAR</Text>
            </Pressable>
          ) : (
            <View style={[styles.button, styles.lockedButton]}>
              <Text style={styles.lockedButtonText}>faltam {roundsToUnlock}</Text>
            </View>
          ))}
        <Pressable style={[styles.button, styles.nextButton]} onPress={onNext}>
          <Text style={styles.nextButtonText}>Próxima</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    backgroundColor: GameColors.surface,
  },
  containerWin: {
    borderColor: GameColors.win,
  },
  containerLoss: {
    borderColor: GameColors.loss,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  amountWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
  },
  lostBonusText: {
    color: GameColors.loss,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  streakInfo: {
    color: GameColors.draw,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: 10,
    marginTop: 6,
  },
  button: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cashOutButton: {
    backgroundColor: GameColors.draw,
  },
  cashOutButtonText: {
    color: '#0B1220',
    fontSize: 15,
    fontWeight: '800',
  },
  lockedButton: {
    borderWidth: 1,
    borderColor: GameColors.border,
    backgroundColor: GameColors.surfaceRaised,
  },
  lockedButtonText: {
    color: GameColors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: GameColors.accent,
  },
  nextButtonText: {
    color: GameColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
