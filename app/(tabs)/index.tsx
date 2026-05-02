import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAllCatches, getCatchesByLinea, Catch } from '../../lib/db';
import LineaCard from '../../components/LineaCard';
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

interface LineaSummary {
  linea: string;
  unidadCount: number;
  catchCount: number;
}

export default function HomeScreen() {
  const [lineas, setLineas] = useState<LineaSummary[]>([]);
  const [selectedLinea, setSelectedLinea] = useState<string | null>(null);
  const [lineaCatches, setLineaCatches] = useState<Catch[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadLineas();
    }, [])
  );

  async function loadLineas() {
    const all = await getAllCatches();
    const map = new Map<string, { unidades: Set<string>; count: number }>();
    for (const c of all) {
      if (!map.has(c.linea)) {
        map.set(c.linea, { unidades: new Set(), count: 0 });
      }
      const entry = map.get(c.linea)!;
      entry.unidades.add(c.unidad);
      entry.count += 1;
    }
    const summaries: LineaSummary[] = [];
    map.forEach((v, k) => {
      summaries.push({ linea: k, unidadCount: v.unidades.size, catchCount: v.count });
    });
    summaries.sort((a, b) => a.linea.localeCompare(b.linea, 'es', { numeric: true }));
    setLineas(summaries);
  }

  async function openLineaDetail(linea: string) {
    setSelectedLinea(linea);
    const catches = await getCatchesByLinea(linea);
    setLineaCatches(catches);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setSelectedLinea(null);
    setLineaCatches([]);
  }

  function renderPair({ item }: { item: LineaSummary[] }) {
    return (
      <View style={styles.row}>
        {item.map((linea) => (
          <LineaCard
            key={linea.linea}
            linea={linea.linea}
            unidadCount={linea.unidadCount}
            catchCount={linea.catchCount}
            onPress={() => openLineaDetail(linea.linea)}
          />
        ))}
        {item.length === 1 && <View style={styles.emptyCard} />}
      </View>
    );
  }

  function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  const pairs = chunkArray(lineas, 2);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>COLECTIVERO</Text>
        {lineas.length > 0 && (
          <Text style={styles.subtitle}>
            {lineas.length} {lineas.length === 1 ? 'línea' : 'líneas'} en tu colección
          </Text>
        )}
      </View>

      {lineas.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyEmoji}>🚌</Text>
          </View>
          <Text style={styles.emptyTitle}>Ningún colectivo registrado todavía.</Text>
          <Text style={styles.emptySubtitle}>Empezá registrando tu primer viaje.</Text>
        </View>
      ) : (
        <FlatList
          data={pairs}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={renderPair}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.backButton}>
              <Ionicons name="chevron-down" size={22} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.modalLinea}>{selectedLinea}</Text>
            <Text style={styles.modalCount}>
              {lineaCatches.length} {lineaCatches.length === 1 ? 'viaje' : 'viajes'}
            </Text>
          </View>
          <FlatList
            data={lineaCatches}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <CatchCard catchItem={item} showLinea={false} />}
            contentContainerStyle={styles.modalList}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: Colors.secondary,
  },
  title: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 44,
    color: Colors.accent,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: Colors.primary,
    marginTop: 2,
  },
  grid: {
    padding: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  emptyCard: {
    flex: 1,
    margin: 6,
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
    fontSize: 48,
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
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: Colors.secondary,
  },
  backButton: {
    marginBottom: 12,
    alignSelf: 'flex-start',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLinea: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 72,
    color: Colors.accent,
    lineHeight: 74,
  },
  modalCount: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: Colors.primary,
    marginTop: 2,
  },
  modalList: {
    padding: 16,
    paddingBottom: 30,
  },
});
