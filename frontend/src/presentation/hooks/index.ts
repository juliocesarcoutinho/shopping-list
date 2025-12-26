/**
 * Presentation Layer - Custom Hooks
 *
 * Hooks personalizados para lógica de UI.
 */

import { useColorScheme } from 'react-native';

// Hook para tema da aplicação
export interface UseThemeResult {
  isDark: boolean;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    card: string;
    border: string;
  };
}

export function useAppTheme(): UseThemeResult {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    colors: {
      background: isDark ? '#000000' : '#FFFFFF',
      text: isDark ? '#FFFFFF' : '#000000',
      primary: '#007AFF',
      secondary: '#8E8E93',
      card: isDark ? '#1C1C1E' : '#F2F2F7',
      border: isDark ? '#38383A' : '#E5E5E7',
    },
  };
}
