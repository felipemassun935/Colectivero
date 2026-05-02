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
  bg: '#0D0D0D',
  yellow: '#F5C518',
  orange: '#E8651A',
  offWhite: '#F0EDE8',
  cardBg: '#1A1A1A',
  cardBorder: '#2A2A2A',
  muted: '#666',
  duplicate: '#E8651A',
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
  },
  stamp: {
    borderWidth: 4,
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  stampSuccess: {
    borderColor: Colors.yellow,
    backgroundColor: 'rgba(13,13,13,0.92)',
  },
  stampDuplicate: {
    borderColor: Colors.orange,
    backgroundColor: 'rgba(13,13,13,0.92)',
  },
  stampText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 48,
    letterSpacing: 2,
  },
  stampTextSuccess: {
    color: Colors.yellow,
  },
  stampTextDuplicate: {
    color: Colors.orange,
  },
  stampSubtext: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.orange,
    marginTop: 2,
  },
});
