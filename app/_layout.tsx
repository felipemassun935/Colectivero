import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot, SplashScreen } from 'expo-router';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans';
import { initDB } from '../lib/db';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    BebasNeue_400Regular,
    DMSans_400Regular,
  });

  useEffect(() => {
    async function setup() {
      try {
        await initDB();
      } catch (e) {
        console.error('DB init error:', e);
      } finally {
        setDbReady(true);
      }
    }
    setup();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, dbReady]);

  if ((!fontsLoaded && !fontError) || !dbReady) {
    return <View style={styles.loading} />;
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
});
