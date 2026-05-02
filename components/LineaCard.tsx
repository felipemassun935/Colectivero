import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Colors = {
  bg: '#F2F7F4',
  primary: '#6D9773',
  secondary: '#0C3B2E',
  tertiary: '#B46617',
  accent: '#FFBA00',
  white: '#FFFFFF',
  muted: '#9BB5A8',
};

interface LineaCardProps {
  linea: string;
  unidadCount: number;
  catchCount: number;
  onPress: () => void;
}

export default function LineaCard({ linea, unidadCount, catchCount, onPress }: LineaCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <Text style={styles.lineaNumber}>{linea}</Text>
      <View style={styles.footer}>
        <Text style={styles.unidades}>
          {unidadCount} {unidadCount === 1 ? 'unidad' : 'unidades'}
        </Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            {catchCount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    padding: 18,
    flex: 1,
    margin: 6,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    minHeight: 140,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  lineaNumber: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 58,
    color: Colors.accent,
    lineHeight: 60,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  unidades: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: Colors.primary,
  },
  pill: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 28,
    alignItems: 'center',
  },
  pillText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    color: Colors.white,
  },
});
