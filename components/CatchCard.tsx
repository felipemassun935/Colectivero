import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Catch } from '../lib/db';
import DuplicateBadge from './DuplicateBadge';

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
      activeOpacity={0.75}
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
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lineaLabel: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 32,
    color: Colors.yellow,
    lineHeight: 34,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailItem: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.cardBorder,
    marginHorizontal: 12,
  },
  detailLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
    color: Colors.offWhite,
    lineHeight: 24,
  },
  timestamp: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: Colors.muted,
  },
  notes: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: Colors.offWhite,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
