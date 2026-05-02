import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getStats, Stats } from '../../lib/db';
import CatchCard from '../../components/CatchCard';

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

interface StatCardProps {
  label: string;
  value: string | number;
  accent?: boolean;
}

function StatCard({ label, value, accent = false }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, accent && styles.statValueAccent]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function StatsScreen() {
  const [stats, setStats] = useState<Stats | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  async function loadStats() {
    const s = await getStats();
    setStats(s);
  }

  if (!stats || stats.totalCatches === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ESTADÍSTICAS</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyTitle}>Sin datos todavía.</Text>
          <Text style={styles.emptySubtitle}>
            Registrá tu primer viaje para ver estadísticas.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>ESTADÍSTICAS</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.statsGrid}>
            <StatCard label="TOTAL VIAJES" value={stats.totalCatches} />
            <StatCard label="LÍNEAS ÚNICAS" value={stats.uniqueLineas} />
            <StatCard label="UNIDADES ÚNICAS" value={stats.uniqueUnidades} />
            <StatCard
              label="RACHA ACTUAL"
              value={`${stats.currentStreak} ${stats.currentStreak === 1 ? 'día' : 'días'}`}
              accent={stats.currentStreak > 0}
            />
          </View>
        </View>

        {stats.mostRiddenLinea && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LÍNEA MÁS VIAJADA</Text>
            <View style={styles.featuredCard}>
              <Text style={styles.featuredLinea}>{stats.mostRiddenLinea}</Text>
              <Text style={styles.featuredLabel}>tu favorita</Text>
            </View>
          </View>
        )}

        {stats.rarestCatch && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CATCH MÁS RARO</Text>
            <CatchCard catchItem={stats.rarestCatch} showLinea={true} />
          </View>
        )}

        {stats.currentStreak > 0 && (
          <View style={styles.section}>
            <View style={styles.streakBanner}>
              <Text style={styles.streakFire}>🔥</Text>
              <View style={styles.streakText}>
                <Text style={styles.streakNumber}>{stats.currentStreak}</Text>
                <Text style={styles.streakLabel}>
                  {stats.currentStreak === 1 ? 'día consecutivo' : 'días consecutivos'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  title: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 36,
    color: Colors.offWhite,
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
    color: Colors.muted,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 10,
    padding: 16,
    width: '47.5%',
    alignItems: 'flex-start',
  },
  statValue: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 40,
    color: Colors.offWhite,
    lineHeight: 42,
  },
  statValueAccent: {
    color: Colors.yellow,
  },
  statLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 1,
    marginTop: 4,
  },
  featuredCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.yellow,
    borderRadius: 12,
    padding: 20,
    alignItems: 'flex-start',
  },
  featuredLinea: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 80,
    color: Colors.yellow,
    lineHeight: 82,
  },
  featuredLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: Colors.muted,
    marginTop: 2,
  },
  streakBanner: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakFire: {
    fontSize: 40,
  },
  streakText: {
    flex: 1,
  },
  streakNumber: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 48,
    color: Colors.orange,
    lineHeight: 50,
  },
  streakLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.offWhite,
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 18,
    color: Colors.offWhite,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
  },
});
