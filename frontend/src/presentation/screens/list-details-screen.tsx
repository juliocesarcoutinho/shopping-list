/**
 * ListDetailsScreen - Tela de detalhes da lista de compras
 *
 * Exibe informações completas da lista:
 * - Itens com checkbox, quantidade, preço
 * - Total estimado
 * - Progresso de compras
 *
 * Por enquanto é um placeholder com design mockado
 * (funcionalidade completa será implementada no épico de itens)
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../hooks';

export const ListDetailsScreen: React.FC = () => {
  const theme = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Dados mockados para visualização (serão substituídos por dados reais)
  const mockList = {
    id: id || '1',
    title: 'Compras do Mercado',
    totalItems: 8,
    completedItems: 3,
    estimatedTotal: 79.8,
    items: [
      { id: '1', name: 'Leite', quantity: 2, unitPrice: 4.5, isCompleted: true },
      { id: '2', name: 'Pão', quantity: 1, unitPrice: 6.0, isCompleted: true },
      { id: '3', name: 'Ovos', quantity: 2, unitPrice: 12.9, isCompleted: false },
      { id: '4', name: 'Manteiga', quantity: 1, unitPrice: 0, isCompleted: false },
      { id: '5', name: 'Queijo', quantity: 1, unitPrice: 25.0, isCompleted: false },
      { id: '6', name: 'Iogurte', quantity: 4, unitPrice: 3.5, isCompleted: false },
      { id: '7', name: 'Maçã', quantity: 6, unitPrice: 0, isCompleted: true },
      { id: '8', name: 'Banana', quantity: 3, unitPrice: 4.2, isCompleted: false },
    ],
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel='Voltar'
          >
            <Ionicons name='arrow-back' size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{mockList.title}</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              {mockList.completedItems} de {mockList.totalItems} itens
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              /* Abrir menu de opções */
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel='Menu de opções'
          >
            <Ionicons name='ellipsis-vertical' size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Card de Total Estimado */}
        <View
          style={[
            styles.totalCard,
            {
              backgroundColor: theme.colors.primary + '15', // primary com 15% opacity
              borderColor: theme.colors.primary + '30',
            },
          ]}
        >
          <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>
            Total estimado:
          </Text>
          <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
            {formatCurrency(mockList.estimatedTotal)}
          </Text>
        </View>

        {/* Lista de Itens */}
        <View style={styles.itemsList}>
          {mockList.items.map(item => (
            <View
              key={item.id}
              style={[
                styles.itemCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              {/* Checkbox */}
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  {
                    borderColor: item.isCompleted ? theme.colors.success : theme.colors.border,
                    backgroundColor: item.isCompleted ? theme.colors.success : 'transparent',
                  },
                ]}
                onPress={() => {
                  /* Toggle item */
                }}
              >
                {item.isCompleted && <Ionicons name='checkmark' size={16} color='white' />}
              </TouchableOpacity>

              {/* Conteúdo do Item */}
              <View style={styles.itemContent}>
                <Text
                  style={[
                    styles.itemName,
                    {
                      color: theme.colors.text,
                      textDecorationLine: item.isCompleted ? 'line-through' : 'none',
                      opacity: item.isCompleted ? 0.6 : 1,
                    },
                  ]}
                >
                  {item.name}
                </Text>

                <View style={styles.itemDetails}>
                  {/* Quantidade */}
                  <Text style={[styles.itemQuantity, { color: theme.colors.textSecondary }]}>
                    # {item.quantity}x
                  </Text>

                  {/* Preço */}
                  {item.unitPrice > 0 && (
                    <>
                      <Text style={[styles.itemPrice, { color: theme.colors.success }]}>
                        {formatCurrency(item.unitPrice)}
                      </Text>

                      {/* Total */}
                      <Text style={[styles.itemTotal, { color: theme.colors.textSecondary }]}>
                        (total: {formatCurrency(item.quantity * item.unitPrice)})
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Placeholder de "Em Construção" */}
        <View style={styles.placeholderContainer}>
          <Ionicons name='construct-outline' size={48} color={theme.colors.textTertiary} />
          <Text style={[styles.placeholderTitle, { color: theme.colors.text }]}>
            Funcionalidade em Construção
          </Text>
          <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
            Esta é uma visualização mockada.{'\n'}A funcionalidade completa de gerenciamento de
            itens{'\n'}
            será implementada no próximo épico.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  } as ViewStyle,
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  } as ViewStyle,
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  } as ViewStyle,
  totalCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  itemsList: {
    marginTop: 20,
    gap: 12,
  } as ViewStyle,
  itemCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
  } as ViewStyle,
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  itemContent: {
    flex: 1,
    gap: 6,
  } as ViewStyle,
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  } as ViewStyle,
  itemQuantity: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemTotal: {
    fontSize: 13,
    fontWeight: '400',
  },
  placeholderContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
    paddingVertical: 40,
  } as ViewStyle,
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ListDetailsScreen;
