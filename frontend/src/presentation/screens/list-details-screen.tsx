/**
 * ListDetailsScreen - Tela de detalhes da lista de compras
 *
 * Exibe informações completas da lista:
 * - Itens com checkbox, quantidade, preço
 * - Total estimado
 * - Progresso de compras
 *
 * Carrega dados reais via GetListDetailsUseCase e renderiza com estados
 * loading/empty/error conforme critérios de aceite.
 */

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ShoppingListRemoteDataSource } from '@/src/data/data-sources/shopping-list-remote-data-source';
import { ShoppingListRepositoryImpl } from '@/src/data/repositories/shopping-list-repository';
import { ShoppingList } from '@/src/domain/entities';
import { AddItemToListUseCase, GetListDetailsUseCase } from '@/src/domain/use-cases';

import { AddItemModal, Button, FloatingActionButton, ShoppingItemRow } from '../components';
import { useAppTheme } from '../hooks';
import { semanticColors } from '../theme/colors';

// Instancio use cases com repository real
const remoteDataSource = new ShoppingListRemoteDataSource();
const repository = new ShoppingListRepositoryImpl(remoteDataSource);
const getListDetailsUseCase = new GetListDetailsUseCase(repository);
const addItemToListUseCase = new AddItemToListUseCase(repository);

export const ListDetailsScreen: React.FC = () => {
  const theme = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [addItemError, setAddItemError] = useState<string | null>(null);

  // Função para carregar dados da lista
  const fetchListDetails = useCallback(async () => {
    if (!id) {
      setError('ID da lista não fornecido');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getListDetailsUseCase.execute(id);
      setList(data);
    } catch (err) {
      const error = err as Error & { status?: number };
      // Se for 404, a lista não existe
      if (error?.status === 404) {
        setError('Lista não encontrada');
      } else if (error?.status === 500) {
        // Erro 500 pode indicar que o endpoint não está implementado no backend
        setError(
          'Endpoint não disponível. O backend precisa implementar GET /api/v1/lists/{id} para buscar detalhes da lista com itens.'
        );
      } else {
        setError(error?.message || 'Erro ao carregar lista');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Função para pull-to-refresh
  const onRefresh = useCallback(async () => {
    if (!id) return;

    setRefreshing(true);
    setError(null);
    try {
      const data = await getListDetailsUseCase.execute(id);
      setList(data);
    } catch (err) {
      const error = err as Error & { status?: number };
      if (error?.status === 404) {
        setError('Lista não encontrada');
      } else if (error?.status === 500) {
        setError(
          'Endpoint não disponível. O backend precisa implementar GET /api/v1/lists/{id} para buscar detalhes da lista com itens.'
        );
      } else {
        setError(error?.message || 'Erro ao recarregar lista');
      }
    } finally {
      setRefreshing(false);
    }
  }, [id]);

  // Recarrega automaticamente quando a tela ganha foco
  // Isso garante que após adicionar/editar itens, a tela seja atualizada
  useFocusEffect(
    useCallback(() => {
      fetchListDetails();
    }, [fetchListDetails])
  );

  // Calcula total estimado somando subtotais dos itens com preço
  const calculateEstimatedTotal = useCallback(() => {
    if (!list?.items) return 0;
    return list.items.reduce((total, item) => {
      if (item.unitPrice !== undefined && item.unitPrice !== null && item.unitPrice > 0) {
        return total + item.quantity * item.unitPrice;
      }
      return total;
    }, 0);
  }, [list]);

  // Calcula contadores
  const totalItems = list?.items.length ?? 0;
  const purchasedItems = list?.items.filter(item => item.isPurchased).length ?? 0;
  const estimatedTotal = calculateEstimatedTotal();

  // Formata valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Handler para toggle de item (placeholder - será implementado no próximo épico)
  const handleTogglePurchased = useCallback((itemId: string, newValue: boolean) => {
    // TODO: Implementar UpdateItemUseCase no próximo épico
    console.log('Toggle item:', itemId, newValue);
  }, []);

  // Handler para editar item (placeholder - será implementado no próximo épico)
  const handleEditItem = useCallback((itemId: string) => {
    // TODO: Implementar navegação para edição no próximo épico
    console.log('Edit item:', itemId);
  }, []);

  // Handler para abrir modal de adicionar item
  const handleAddItem = useCallback(() => {
    setIsAddItemModalVisible(true);
    setAddItemError(null);
  }, []);

  // Handler para fechar modal
  const handleCloseModal = useCallback(() => {
    if (!isAddingItem) {
      setIsAddItemModalVisible(false);
      setAddItemError(null);
    }
  }, [isAddingItem]);

  // Handler para submeter formulário de adicionar item
  const handleSubmitAddItem = useCallback(
    async (data: { name: string; quantity: number; unit?: string; unitPrice?: number }) => {
      if (!id) return;

      setIsAddingItem(true);
      setAddItemError(null);

      try {
        await addItemToListUseCase.execute({
          listId: id,
          name: data.name,
          quantity: data.quantity,
          unit: data.unit,
          unitPrice: data.unitPrice,
        });

        // Fecha modal e recarrega lista
        setIsAddItemModalVisible(false);
        setAddItemError(null);
        // Recarrega a lista para mostrar o novo item
        await fetchListDetails();
      } catch (err) {
        const error = err as Error & { status?: number; data?: { message?: string } };
        // Captura mensagem de erro da API ou do use case
        const apiMessage = error?.message || error?.data?.message;
        setAddItemError(apiMessage || 'Erro ao adicionar item. Tente novamente.');
      } finally {
        setIsAddingItem(false);
      }
    },
    [id, fetchListDetails]
  );

  // Renderiza item na FlatList
  const renderItem = useCallback(
    ({ item }: { item: ShoppingList['items'][0] }) => {
      return (
        <ShoppingItemRow
          id={item.id}
          name={item.name}
          quantity={item.quantity}
          unitPrice={item.unitPrice}
          isPurchased={item.isPurchased}
          onPress={() => handleEditItem(item.id)}
          onTogglePurchased={handleTogglePurchased}
          testID={`item-${item.id}`}
        />
      );
    },
    [handleEditItem, handleTogglePurchased]
  );

  // Estado Loading: skeleton/loader
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
              <ActivityIndicator size='small' color={theme.colors.primary} />
            </View>
            <View style={{ width: 24 }} />
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Carregando lista...
          </Text>
        </View>
      </View>
    );
  }

  // Estado Error: mensagem + retry
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Erro</Text>
            </View>
            <View style={{ width: 24 }} />
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name='alert-circle-outline' size={48} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.text }]}>{error}</Text>
          <Button
            title='Tentar novamente'
            onPress={fetchListDetails}
            variant='primary'
            size='medium'
          />
        </View>
      </View>
    );
  }

  // Estado Empty: mensagem + CTA "Adicionar item"
  if (!list || totalItems === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                {list?.title || 'Lista'}
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                0 itens
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
        <View style={styles.emptyContainer}>
          <Ionicons name='list-outline' size={64} color={theme.colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Lista vazia</Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            Adicione itens para começar suas compras
          </Text>
          <Button title='Adicionar item' onPress={handleAddItem} variant='primary' size='large' />
        </View>

        {/* Modal de adicionar item (também disponível no estado vazio) */}
        <AddItemModal
          visible={isAddItemModalVisible}
          onClose={handleCloseModal}
          onSubmit={handleSubmitAddItem}
          loading={isAddingItem}
          error={addItemError}
        />
      </View>
    );
  }

  // Estado Sucesso: itens reais renderizados

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
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{list.title}</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              {purchasedItems} de {totalItems} itens
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

      <FlatList
        data={list.items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 100,
        }}
        ListHeaderComponent={
          <View
            style={[
              styles.totalCard,
              {
                backgroundColor: semanticColors.primary50, // Verde bem suave e claro
                borderColor: semanticColors.primary100, // Verde suave para borda
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.totalLabel, { color: semanticColors.primary500 }]}>
              Total estimado:
            </Text>
            <Text style={[styles.totalValue, { color: semanticColors.primary500 }]}>
              {estimatedTotal > 0 ? formatCurrency(estimatedTotal) : 'R$ 0,00'}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        accessibilityRole='list'
        testID='list-items-flatlist'
      />

      {/* FAB para adicionar item */}
      <FloatingActionButton
        onPress={handleAddItem}
        testID='fab-add-item'
        accessibilityLabel='Adicionar item à lista'
      />

      {/* Modal de adicionar item */}
      <AddItemModal
        visible={isAddItemModalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmitAddItem}
        loading={isAddingItem}
        error={addItemError}
      />
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
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  totalCard: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  } as ViewStyle,
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  } as ViewStyle,
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  } as ViewStyle,
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  emptySubtitle: {
    fontSize: 15,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 22,
  },
});

export default ListDetailsScreen;
