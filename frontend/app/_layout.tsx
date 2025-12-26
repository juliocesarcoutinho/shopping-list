import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { Loader } from '@/src/presentation/components';
import { AuthProvider, useAuth } from '@/src/presentation/contexts/auth-context';

function NavigationContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inAuthGroup) {
      router.replace('/login' as never);
    } else if (isAuthenticated && !inAuthGroup) {
      router.replace('/(tabs)' as never);
    }
  }, [isAuthenticated, isLoading, router, segments]);

  if (isLoading) {
    return <Loader variant='spinner' size='large' text='Carregando...' />;
  }

  return (
    <Stack>
      <Stack.Screen name='login' options={{ headerShown: false }} />
      <Stack.Screen name='register' options={{ headerShown: false }} />
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='modal' options={{ presentation: 'modal', title: 'Modal' }} />
      <Stack.Screen name='settings' options={{ title: 'Configurações' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <NavigationContent />
        <StatusBar style='auto' />
      </AuthProvider>
    </ThemeProvider>
  );
}
