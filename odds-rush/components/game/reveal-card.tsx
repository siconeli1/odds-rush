import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { GameColors } from '@/constants/game-theme';

const SUSPENSE_DURATION_MS = 500;

interface RevealCardProps {
  reveal: string;
}

export function RevealCard({ reveal }: RevealCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const pulseOpacity = useRef(new Animated.Value(0.3)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(pulseOpacity, { toValue: 0.3, duration: 250, useNativeDriver: true }),
      ])
    );
    pulse.start();

    const timeout = setTimeout(() => {
      pulse.stop();
      setIsRevealed(true);
      Animated.timing(revealOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }, SUSPENSE_DURATION_MS);

    return () => {
      clearTimeout(timeout);
      pulse.stop();
    };
  }, [pulseOpacity, revealOpacity]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>O JOGO REAL</Text>
      {isRevealed ? (
        <Animated.Text style={[styles.revealText, { opacity: revealOpacity }]}>
          {reveal}
        </Animated.Text>
      ) : (
        <Animated.Text style={[styles.suspenseText, { opacity: pulseOpacity }]}>
          Revelando...
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GameColors.border,
    backgroundColor: GameColors.surface,
    padding: 18,
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: GameColors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  suspenseText: {
    color: GameColors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  revealText: {
    color: GameColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
