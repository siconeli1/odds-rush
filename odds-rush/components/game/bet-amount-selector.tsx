import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GameColors } from '@/constants/game-theme';

const AMOUNTS = [25, 50, 100, 200];

interface BetAmountSelectorProps {
  selected: number;
  onSelect: (amount: number) => void;
  disabled?: boolean;
}

export function BetAmountSelector({ selected, onSelect, disabled = false }: BetAmountSelectorProps) {
  return (
    <View style={styles.container}>
      {AMOUNTS.map((amount) => {
        const isSelected = selected === amount;
        return (
          <Pressable
            key={amount}
            onPress={() => onSelect(amount)}
            disabled={disabled}
            style={[
              styles.chip,
              isSelected && styles.chipSelected,
              disabled && styles.chipDisabled,
            ]}>
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{amount}</Text>
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
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: GameColors.surface,
    borderWidth: 1,
    borderColor: GameColors.border,
  },
  chipSelected: {
    backgroundColor: GameColors.accent,
    borderColor: GameColors.accent,
  },
  chipDisabled: {
    opacity: 0.6,
  },
  chipText: {
    color: GameColors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: GameColors.textPrimary,
  },
});
