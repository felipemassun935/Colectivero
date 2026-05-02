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
          <Text style={styles.headerSub}>Tu historial de viajes</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyEmoji}>📊</Text>
          </View>
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
          <Text style={styles.headerSub}>Tu historial de viajes</Text>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Colors.secondary,
  },
  title: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 38,
    color: Colors.accent,
    letterSpacing: 1,
  },
  headerSub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: Colors.primary,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: Colors.muted,
    letterSpacing: 2,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
    width: '47%',
    alignItems: 'flex-start',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  statValue: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 42,
    color: Colors.secondary,
    lineHeight: 44,
  },
  statValueAccent: {
    color: Colors.tertiary,
  },
  statLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 1,
    marginTop: 4,
    fontWeight: '600',
  },
  featuredCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 24,
    padding: 24,
    alignItems: 'flex-start',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  featuredLinea: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 80,
    color: Colors.accent,
    lineHeight: 82,
  },
  featuredLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: Colors.primary,
    marginTop: 2,
  },
  streakBanner: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
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
    color: Colors.tertiary,
    lineHeight: 50,
  },
  streakLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyEmoji: {
    fontSize: 44,
  },
  emptyTitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 18,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
  },
});
