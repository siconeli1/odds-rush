import { StyleSheet, Text, View } from 'react-native';

import { GameColors } from '@/constants/game-theme';
import type { MatchResult } from '@/data/types';

const FORM_COLORS: Record<MatchResult, string> = {
  V: GameColors.win,
  E: GameColors.draw,
  D: GameColors.loss,
};

interface TeamRowProps {
  name: string;
  form: MatchResult[];
  isHome: boolean;
}

export function TeamRow({ name, form, isHome }: TeamRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.nameRow}>
        <Text style={styles.name}>{name}</Text>
        {isHome && (
          <View style={styles.homeTag}>
            <Text style={styles.homeTagText}>CASA</Text>
          </View>
        )}
      </View>
      <View style={styles.formRow}>
        {form.map((result, index) => (
          <View
            key={index}
            style={[styles.formBadge, { backgroundColor: FORM_COLORS[result] }]}>
            <Text style={styles.formBadgeText}>{result}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    color: GameColors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  homeTag: {
    backgroundColor: GameColors.surfaceRaised,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  homeTagText: {
    color: GameColors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  formRow: {
    flexDirection: 'row',
    gap: 6,
  },
  formBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formBadgeText: {
    color: '#0B1220',
    fontSize: 11,
    fontWeight: '700',
  },
});
