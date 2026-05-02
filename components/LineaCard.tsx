import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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

interface LineaCardProps {
  linea: string;
  unidadCount: number;
  catchCount: number;
  onPress: () => void;
}

export default function LineaCard({ linea, unidadCount, catchCount, onPress }: LineaCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={onPress}>
      <Text style={styles.lineaNumber}>{linea}</Text>
      <Text style={styles.unidades}>
        {unidadCount} {unidadCount === 1 ? 'unidad' : 'unidades'}
      </Text>
      <Text style={styles.catches}>
        {catchCount} {catchCount === 1 ? 'viaje' : 'viajes'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    margin: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    minHeight: 130,
  },
  lineaNumber: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 56,
    color: Colors.yellow,
    lineHeight: 58,
    marginBottom: 4,
  },
  unidades: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: Colors.offWhite,
    marginBottom: 2,
  },
  catches: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    color: Colors.muted,
  },
});
