import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Catch } from '../lib/db';
import DuplicateBadge from './DuplicateBadge';

const Colors = {
  bg: '#F2F7F4',
  primary: '#6D9773',
  secondary: '#0C3B2E',
  tertiary: '#B46617',
  accent: '#FFBA00',
  white: '#FFFFFF',
  cardBg: '#FFFFFF',
  border: '#DDE8E2',
  muted: '#9BB5A8',
};

interface CatchCardProps {
  catchItem: Catch;
  showLinea?: boolean;
}

function formatArgentineDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }) + ' ' + date.toLocaleTimeString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CatchCard({ catchItem, showLinea = false }: CatchCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/catch/${catchItem.id}`)}
    >
      <View style={styles.header}>
        {showLinea && (
          <Text style={styles.lineaLabel}>{catchItem.linea}</Text>
        )}
        <View style={styles.badges}>
          {catchItem.isDuplicate && <DuplicateBadge />}
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>UNIDAD</Text>
          <Text style={styles.detailValue}>{catchItem.unidad}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>INTERNO</Text>
          <Text style={styles.detailValue}>{catchItem.interno}</Text>
        </View>
      </View>

      <Text style={styles.timestamp}>{formatArgentineDate(catchItem.timestamp)}</Text>

      {catchItem.notes ? (
        <Text style={styles.notes} numberOfLines={2}>
          {catchItem.notes}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  lineaLabel: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 32,
    color: Colors.secondary,
    lineHeight: 34,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
    marginHorizontal: 14,
  },
  detailLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 1,
    marginBottom: 2,
    fontWeight: '600',
  },
  detailValue: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 24,
    color: Colors.secondary,
    lineHeight: 26,
  },
  timestamp: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: Colors.muted,
  },
  notes: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: Colors.tertiary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
