import { ShoppingList } from '@/src/domain/entities';
import { GetMyListsUseCase } from '@/src/domain/use-cases/get-my-lists-use-case';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FloatingActionButton from '../../components/fab';
import ListCard from '../../components/list-card';
import EmptyListSvg from '../../components/list-card/EmptyListSvg';
import { useAppTheme } from '../../hooks';

// Instanciação direta para exemplo, idealmente usar DI/contexto
const useCase = new GetMyListsUseCase({
  getMyLists: async () => [], // Substitua por injeção real do repository
});

export const ListsDashboardScreen: React.FC = () => {
  const theme = useAppTheme();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await useCase.execute();
      setLists(data);
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar listas');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const data = await useCase.execute();
      setLists(data);
    } catch (err: any) {
      setError(err?.message || 'Erro ao recarregar listas');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const renderItem = useCallback(
    ({ item }: { item: ShoppingList }) => (
      <ListCard
        title={item.title}
        itemsCount={item.items.length}
        pendingItemsCount={item.items.filter(i => !i.isCompleted).length}
        purchasedItemsCount={item.items.filter(i => i.isCompleted).length}
        onPress={() => {
          /* Navegar para detalhes ou ação */
        }}
        testID={`list-card-${item.id}`}
      />
    ),
    []
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {[1, 2, 3].map(i => (
          <ListCard key={i} loading />
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={fetchLists}
        >
          <Text style={[styles.retryButtonText, { color: theme.colors.onPrimary }]}>
            Tentar novamente
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!lists.length) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <EmptyListSvg width={160} height={120} />
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Sua lista está vazia</Text>
        <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
          Crie uma lista para organizar suas compras do dia a dia
        </Text>
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            /* Navegar para criar lista */
          }}
          activeOpacity={0.85}
          testID='cta-create-list'
          accessibilityRole='button'
          accessibilityLabel='Criar primeira lista'
        >
          <Text style={[styles.ctaButtonText, { color: theme.colors.onPrimary }]}>
            Criar primeira lista
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={lists}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        accessibilityRole='list'
        testID='lists-flatlist'
      />
      <FloatingActionButton
        onPress={() => {
          // Navegar para criar lista (abrir modal/tela)
        }}
        testID='fab-create-list'
        accessibilityLabel='Criar nova lista'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  retryButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 22,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 22,
  },
  ctaButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ListsDashboardScreen;
