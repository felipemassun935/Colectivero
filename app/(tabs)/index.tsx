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
  bg: '#0D0D0D',
  yellow: '#F5C518',
  orange: '#E8651A',
  offWhite: '#F0EDE8',
  cardBg: '#1A1A1A',
  cardBorder: '#2A2A2A',
  muted: '#666',
  duplicate: '#E8651A',
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

  function renderLinea({ item, index }: { item: LineaSummary; index: number }) {
    return (
      <LineaCard
        linea={item.linea}
        unidadCount={item.unidadCount}
        catchCount={item.catchCount}
        onPress={() => openLineaDetail(item.linea)}
      />
    );
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
            {lineas.length} {lineas.length === 1 ? 'línea' : 'líneas'}
          </Text>
        )}
      </View>

      {lineas.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🚌</Text>
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
              <Ionicons name="chevron-down" size={22} color={Colors.offWhite} />
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  title: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 42,
    color: Colors.yellow,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: Colors.muted,
    marginTop: 2,
  },
  grid: {
    padding: 10,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  emptyCard: {
    flex: 1,
    margin: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 72,
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
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  backButton: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  modalLinea: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 72,
    color: Colors.yellow,
    lineHeight: 74,
  },
  modalCount: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: Colors.muted,
    marginTop: 2,
  },
  modalList: {
    padding: 16,
    paddingBottom: 30,
  },
});
