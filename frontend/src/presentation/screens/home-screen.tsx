/**
 * Presentation Layer - Home Screen
 *
 * Tela principal da aplicação de lista de compras.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Compras</Text>
      <Text style={styles.subtitle}>Sua aplicação está pronta para começar!</Text>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>🏗️ Clean Architecture</Text>
        <Text style={styles.infoText}>
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  info: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});
