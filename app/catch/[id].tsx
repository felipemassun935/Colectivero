import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCatchById, Catch } from '../../lib/db';
import DuplicateBadge from '../../components/DuplicateBadge';

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

function formatArgentineDateTime(isoString: string): string {
  const date = new Date(isoString);
  const dateStr = date.toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${dateStr} a las ${timeStr}`;
}

export default function CatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [catchData, setCatchData] = useState<Catch | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const result = await getCatchById(Number(id));
      if (!result) {
        setNotFound(true);
      } else {
        setCatchData(result);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.offWhite} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.yellow} size="large" />
        </View>
      )}

      {!loading && notFound && (
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Catch no encontrado.</Text>
        </View>
      )}

      {!loading && catchData && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <Text style={styles.lineaHero}>{catchData.linea}</Text>
            {catchData.isDuplicate && (
              <View style={styles.badgeContainer}>
                <DuplicateBadge />
              </View>
            )}
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>UNIDAD</Text>
                <Text style={styles.detailValue}>{catchData.unidad}</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>INTERNO</Text>
                <Text style={styles.detailValue}>{catchData.interno}</Text>
              </View>
            </View>
          </View>

          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>FECHA Y HORA</Text>
            <Text style={styles.metaValue}>
              {formatArgentineDateTime(catchData.timestamp)}
            </Text>
          </View>

          {catchData.notes ? (
            <View style={styles.notesCard}>
              <Text style={styles.metaLabel}>NOTAS</Text>
              <Text style={styles.notesText}>{catchData.notes}</Text>
            </View>
          ) : null}

          <View style={styles.idSection}>
            <Text style={styles.idText}>#{catchData.id}</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  navBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: Colors.offWhite,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: Colors.muted,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 20,
  },
  lineaHero: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 96,
    color: Colors.yellow,
    lineHeight: 98,
  },
  badgeContainer: {
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailBlock: {
    flex: 1,
  },
  detailDivider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.cardBorder,
    marginHorizontal: 16,
  },
  detailLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 36,
    color: Colors.offWhite,
    lineHeight: 38,
  },
  metaCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  metaLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  metaValue: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: Colors.offWhite,
    lineHeight: 22,
    textTransform: 'capitalize',
  },
  notesCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  notesText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: Colors.offWhite,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  idSection: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  idText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: Colors.cardBorder,
  },
});
