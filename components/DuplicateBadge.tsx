import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Colors = {
  accent: '#FFBA00',
  secondary: '#0C3B2E',
};

export default function DuplicateBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>DUPLICADO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: Colors.secondary,
    fontSize: 11,
    fontFamily: 'BebasNeue_400Regular',
    letterSpacing: 1,
    fontWeight: '700',
  },
});
