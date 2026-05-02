import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { logCatch, getDistinctLineas } from '../../lib/db';
import StampAnimation from '../../components/StampAnimation';

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

export default function LogScreen() {
  const [linea, setLinea] = useState('');
  const [unidad, setUnidad] = useState('');
  const [interno, setInterno] = useState('');
  const [notes, setNotes] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allLineas, setAllLineas] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [stampVisible, setStampVisible] = useState(false);
  const [lastIsDuplicate, setLastIsDuplicate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadLineas();
      return () => {
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      };
    }, [])
  );

  async function loadLineas() {
    const all = await getDistinctLineas();
    setAllLineas(all);
  }

  function handleLineaChange(text: string) {
    setLinea(text);
    setError(null);
    if (text.length > 0) {
      const filtered = allLineas.filter((l) =>
        l.toLowerCase().startsWith(text.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function selectSuggestion(s: string) {
    setLinea(s);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function resetForm() {
    setLinea('');
    setUnidad('');
    setInterno('');
    setNotes('');
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
  }

  async function handleRegister() {
    const trimmedLinea = linea.trim();
    const trimmedUnidad = unidad.trim();
    const trimmedInterno = interno.trim();

    if (!trimmedLinea || !trimmedUnidad) {
      setError('Línea y unidad son obligatorias.');
      return;
    }

    if (!trimmedInterno) {
      setError('El interno es obligatorio.');
      return;
    }

    Keyboard.dismiss();
    setError(null);

    try {
      const result = await logCatch(trimmedLinea, trimmedUnidad, trimmedInterno, notes);
      setLastIsDuplicate(result.isDuplicate);
      setStampVisible(true);

      await loadLineas();

      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setStampVisible(false);
        resetForm();
      }, 1800);
    } catch (e) {
      console.error('Error logging catch:', e);
      setError('Ocurrió un error al registrar. Intentá de nuevo.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>REGISTRAR VIAJE</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>LÍNEA</Text>
                <TextInput
                  style={styles.input}
                  value={linea}
                  onChangeText={handleLineaChange}
                  placeholder="Ej: 60, 168, N24"
                  placeholderTextColor={Colors.muted}
                  autoCapitalize="characters"
                  returnKeyType="next"
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    {suggestions.map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={styles.suggestionItem}
                        onPress={() => selectSuggestion(s)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.suggestionText}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>UNIDAD</Text>
                <TextInput
                  style={styles.input}
                  value={unidad}
                  onChangeText={(t) => { setUnidad(t); setError(null); }}
                  placeholder="Número de unidad"
                  placeholderTextColor={Colors.muted}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>INTERNO</Text>
                <TextInput
                  style={styles.input}
                  value={interno}
                  onChangeText={(t) => { setInterno(t); setError(null); }}
                  placeholder="Número de interno"
                  placeholderTextColor={Colors.muted}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>NOTAS (OPCIONAL)</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Algún detalle del viaje..."
                  placeholderTextColor={Colors.muted}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  returnKeyType="done"
                />
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
                activeOpacity={0.8}
              >
                <Text style={styles.registerButtonText}>REGISTRAR</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <StampAnimation
        visible={stampVisible}
        isDuplicate={lastIsDuplicate}
        onAnimationEnd={() => {
          setStampVisible(false);
          resetForm();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  keyboardView: {
    flex: 1,
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
  form: {
    padding: 20,
    gap: 20,
  },
  fieldWrapper: {
    position: 'relative',
  },
  label: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    color: Colors.muted,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: Colors.offWhite,
  },
  notesInput: {
    minHeight: 90,
    paddingTop: 12,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.yellow,
    borderRadius: 8,
    zIndex: 999,
    overflow: 'hidden',
    marginTop: 2,
  },
  suggestionItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  suggestionText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
    color: Colors.yellow,
  },
  errorContainer: {
    backgroundColor: 'rgba(232, 101, 26, 0.15)',
    borderWidth: 1,
    borderColor: Colors.orange,
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.orange,
  },
  registerButton: {
    backgroundColor: Colors.yellow,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  registerButtonText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 28,
    color: '#000',
    letterSpacing: 2,
  },
});
