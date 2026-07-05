import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GameColors } from '@/constants/game-theme';
import type { Outcome, Scenario } from '@/data/types';

interface OutcomeButtonsProps {
  scenario: Scenario;
  selected: Outcome | null;
  onSelect: (outcome: Outcome) => void;
  disabled?: boolean;
  revealedResult?: Outcome | null;
}

export function OutcomeButtons({
  scenario,
  selected,
  onSelect,
  disabled = false,
  revealedResult = null,
}: OutcomeButtonsProps) {
  const options: { outcome: Outcome; label: string; odd: number }[] = [
    { outcome: 'A', label: scenario.teamA, odd: scenario.odds.A },
    { outcome: 'draw', label: 'Empate', odd: scenario.odds.draw },
    { outcome: 'B', label: scenario.teamB, odd: scenario.odds.B },
  ];

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected === option.outcome;
        const isCorrectAnswer = revealedResult === option.outcome;
        const isWrongPick = isSelected && revealedResult !== null && !isCorrectAnswer;

        return (
          <Pressable
            key={option.outcome}
            onPress={() => onSelect(option.outcome)}
            disabled={disabled}
            style={[
              styles.button,
              isSelected && styles.buttonSelected,
              isCorrectAnswer && styles.buttonCorrect,
              isWrongPick && styles.buttonWrong,
              disabled && styles.buttonDisabled,
            ]}>
            <Text style={styles.odd}>{option.odd.toFixed(2)}</Text>
            <Text style={styles.label} numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    backgroundColor: GameColors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GameColors.border,
    paddingVertical: 14,
  },
  buttonSelected: {
    borderColor: GameColors.accent,
    backgroundColor: GameColors.surfaceRaised,
  },
  buttonCorrect: {
    borderColor: GameColors.win,
    backgroundColor: GameColors.surfaceRaised,
  },
  buttonWrong: {
    borderColor: GameColors.loss,
    backgroundColor: GameColors.surfaceRaised,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  odd: {
    color: GameColors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    color: GameColors.textSecondary,
    fontSize: 12,
  },
});
