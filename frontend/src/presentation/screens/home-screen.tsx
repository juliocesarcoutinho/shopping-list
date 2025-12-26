/**
 * Presentation Layer - Home Screen
 *
 * Tela principal da aplicação de lista de compras.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useAppTheme } from '../hooks';

export function HomeScreen() {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Lista de Compras</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Sua aplicação está pronta para começar!
      </Text>

      <View style={[styles.info, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.infoTitle, { color: theme.colors.text }]}>🏗️ Clean Architecture</Text>
        <Text style={[styles.infoText, { color: theme.colors.textTertiary }]}>
          • Domain: Regras de negócio{'\n'}• Data: Repositórios e DTOs{'\n'}• Presentation: UI e
          componentes{'\n'}• Infrastructure: Serviços externos
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  info: {
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
