import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/use-auth-store';
import { useEffect, useState } from 'react';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { initialize } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    async function prepare() {
      await initialize(); 
      setIsReady(true);
    }
    prepare();
  }, []);

  if (!isReady) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
