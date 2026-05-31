import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

export function SoftWaveBackground() {
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    );

    loop.start();
    return () => loop.stop();
  }, [waveAnim]);

  const translateX1 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  });
  const translateY1 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-16, 16],
  });
  const translateX2 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [110, -110],
  });
  const translateY2 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, -12],
  });
  const translateX3 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 80],
  });
  const translateY3 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, -18],
  });

  return (
    <View pointerEvents="none" style={styles.container}>
      <Animated.View
        style={[
          styles.wave,
          styles.wave1,
          {
            transform: [
              { translateX: translateX1 },
              { translateY: translateY1 },
              { rotate: '-10deg' },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          styles.wave2,
          {
            transform: [
              { translateX: translateX2 },
              { translateY: translateY2 },
              { rotate: '8deg' },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          styles.wave3,
          {
            transform: [
              { translateX: translateX3 },
              { translateY: translateY3 },
              { rotate: '-6deg' },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: -1,
  },
  wave: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.6,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 50,
    elevation: 8,
  },
  wave1: {
    width: 380,
    height: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    top: -64,
    left: -100,
  },
  wave2: {
    width: 340,
    height: 130,
    backgroundColor: 'rgba(233, 248, 225, 0.18)',
    top: 90,
    right: -80,
  },
  wave3: {
    width: 360,
    height: 145,
    backgroundColor: 'rgba(245, 249, 238, 0.16)',
    bottom: -48,
    left: 20,
  },
});
