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
    // Aguardo o carregamento da sessão antes de decidir navegação
    if (isLoading) return;

    // Verifico se estou na área protegida (tabs) ou na área pública (login/register)
    const inProtectedArea = segments[0] === '(tabs)';

    // Se não estou autenticado mas tentando acessar área protegida, redireciono para login
    if (!isAuthenticated && inProtectedArea) {
      router.replace('/login' as never);
    }
    
    // Se estou autenticado mas na área de login/register, redireciono para home
    if (isAuthenticated && !inProtectedArea && segments[0] !== undefined) {
      router.replace('/(tabs)' as never);
    }
  }, [isAuthenticated, isLoading, router, segments]);

  // Exibo loader enquanto verifico se existe sessão salva
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
