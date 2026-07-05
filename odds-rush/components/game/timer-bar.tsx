import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { GameColors } from '@/constants/game-theme';

interface TimerBarProps {
  durationSeconds: number;
  running: boolean;
  onExpire: () => void;
}

const URGENT_THRESHOLD_SECONDS = 2;

export function TimerBar({ durationSeconds, running, onExpire }: TimerBarProps) {
  const progress = useRef(new Animated.Value(1)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const isUrgent = running && secondsLeft > 0 && secondsLeft <= URGENT_THRESHOLD_SECONDS;

  useEffect(() => {
    progress.setValue(1);
    Animated.timing(progress, {
      toValue: 0,
      duration: durationSeconds * 1000,
      useNativeDriver: false,
    }).start();

    setSecondsLeft(durationSeconds);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((current) => {
        const next = current - 1;
        if (next <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onExpireRef.current();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [durationSeconds, progress]);

  useEffect(() => {
    if (!running) {
      progress.stopAnimation();
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [running, progress]);

  useEffect(() => {
    if (!isUrgent) {
      pulseScale.setValue(1);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, { toValue: 1.06, duration: 250, useNativeDriver: true }),
        Animated.timing(pulseScale, { toValue: 1, duration: 250, useNativeDriver: true }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [isUrgent, pulseScale]);

  const widthPercent = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseScale }] }]}>
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, { width: widthPercent }, isUrgent && styles.fillUrgent]}
        />
      </View>
      <Text style={[styles.seconds, isUrgent && styles.secondsUrgent]}>{secondsLeft}s</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: GameColors.timerTrack,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: GameColors.accent,
  },
  fillUrgent: {
    backgroundColor: GameColors.loss,
  },
  seconds: {
    color: GameColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    width: 28,
    textAlign: 'right',
  },
  secondsUrgent: {
    color: GameColors.loss,
  },
});
