import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const Colors = {
  bg: '#F2F7F4',
  primary: '#6D9773',
  secondary: '#0C3B2E',
  tertiary: '#B46617',
  accent: '#FFBA00',
  white: '#FFFFFF',
};

interface StampAnimationProps {
  visible: boolean;
  isDuplicate?: boolean;
  onAnimationEnd?: () => void;
}

export default function StampAnimation({
  visible,
  isDuplicate = false,
  onAnimationEnd,
}: StampAnimationProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = 0;
      opacity.value = 0;

      scale.value = withSequence(
        withSpring(1.2, { damping: 6, stiffness: 280 }),
        withSpring(1.0, { damping: 12, stiffness: 200 }),
        withTiming(1.0, { duration: 800 }),
        withTiming(0, { duration: 300 })
      );

      opacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(1, { duration: 1100 }),
        withTiming(0, { duration: 300 }, (finished) => {
          if (finished && onAnimationEnd) {
            runOnJS(onAnimationEnd)();
          }
        })
      );
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View
        style={[
          styles.stamp,
          isDuplicate ? styles.stampDuplicate : styles.stampSuccess,
          animatedStyle,
        ]}
      >
        <Text style={[styles.stampText, isDuplicate ? styles.stampTextDuplicate : styles.stampTextSuccess]}>
          {isDuplicate ? '¡YA LO TENÉS!' : '¡ATRAPADO!'}
        </Text>
        {isDuplicate && (
          <Text style={styles.stampSubtext}>duplicado</Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: 'rgba(242, 247, 244, 0.7)',
  },
  stamp: {
    borderWidth: 3,
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  stampSuccess: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    shadowColor: Colors.secondary,
  },
  stampDuplicate: {
    borderColor: Colors.tertiary,
    backgroundColor: Colors.white,
    shadowColor: Colors.tertiary,
  },
  stampText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 48,
    letterSpacing: 2,
  },
  stampTextSuccess: {
    color: Colors.primary,
  },
  stampTextDuplicate: {
    color: Colors.tertiary,
  },
  stampSubtext: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.tertiary,
    marginTop: 2,
  },
});
