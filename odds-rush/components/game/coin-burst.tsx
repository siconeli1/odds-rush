import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const COIN_COUNT = 6;
const BURST_DISTANCE = 46;
const BURST_DURATION_MS = 650;

export function CoinBurst() {
  const coins = useRef(Array.from({ length: COIN_COUNT }, () => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      40,
      coins.map((value) =>
        Animated.timing(value, {
          toValue: 1,
          duration: BURST_DURATION_MS,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [coins]);

  return (
    <View style={styles.container} pointerEvents="none">
      {coins.map((value, index) => {
        const angle = (index / COIN_COUNT) * Math.PI * 2;
        const translateX = value.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(angle) * BURST_DISTANCE],
        });
        const translateY = value.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(angle) * BURST_DISTANCE + 24],
        });
        const opacity = value.interpolate({
          inputRange: [0, 0.15, 1],
          outputRange: [0, 1, 0],
        });
        const scale = value.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0.4, 1, 0.7],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.coin,
              { opacity, transform: [{ translateX }, { translateY }, { scale }] },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coin: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F5C518',
    borderWidth: 2,
    borderColor: '#B8860B',
  },
});
