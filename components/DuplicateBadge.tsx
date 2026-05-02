import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

export default function DuplicateBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>DUPLICADO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.duplicate,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#000',
    fontSize: 11,
    fontFamily: 'BebasNeue_400Regular',
    letterSpacing: 1,
  },
});
