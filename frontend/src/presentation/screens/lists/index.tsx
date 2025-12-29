import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFocusEffect, useRouter } from 'expo-router';

import { ShoppingListRemoteDataSource } from '@/src/data/data-sources/shopping-list-remote-data-source';
import { ShoppingListRepositoryImpl } from '@/src/data/repositories/shopping-list-repository';
import { ShoppingList } from '@/src/domain/entities';
import { GetMyListsUseCase } from '@/src/domain/use-cases/get-my-lists-use-case';

import { Button } from '../../components';
import FloatingActionButton from '../../components/fab';
import ListCard from '../../components/list-card';
import EmptyListSvg from '../../components/list-card/EmptyListSvg';
import { useAuth } from '../../contexts/auth-context';
import { useAppTheme } from '../../hooks';

// Instancio use case com repository real
const remoteDataSource = new ShoppingListRemoteDataSource();
const repository = new ShoppingListRepositoryImpl(remoteDataSource);
const useCase = new GetMyListsUseCase(repository);

export const ListsDashboardScreen: React.FC = () => {
  const theme = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para obter iniciais do usuário
  const getUserInitials = () => {
    if (!user?.name) return '?';
    const names = user.name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const fetchLists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await useCase.execute();
      setLists(data);
    } catch (err) {
      const error = err as Error;
      setError(error?.message || 'Erro ao carregar listas');
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
    } catch (err) {
      const error = err as Error;
      setError(error?.message || 'Erro ao recarregar listas');
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Recarrega listas automaticamente quando a tela ganha foco
  // Isso garante que após criar uma lista, o dashboard seja atualizado
  useFocusEffect(
    useCallback(() => {
      fetchLists();
    }, [fetchLists])
  );

  const renderItem = useCallback(
    ({ item }: { item: ShoppingList }) => (
      <ListCard
        title={item.title}
        itemsCount={item.items.length}
        purchasedItemsCount={item.items.filter(i => i.isCompleted).length}
        onPress={() => {
          /* Navegar para detalhes ou ação */
        }}
        onMenuPress={() => {
          /* Abrir menu de opções (editar/excluir) */
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
          <ListCard key={i} title='' itemsCount={0} purchasedItemsCount={0} loading />
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
          <Text style={[styles.retryButtonText, { color: theme.colors.textInverted }]}>
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
        <Button
          title='Começar minha lista'
          onPress={() => router.push('/create-list' as never)}
          size='large'
          variant='primary'
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Minhas Listas</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              Organize suas compras
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push('/(tabs)/account' as never)}
            accessibilityLabel='Ver perfil'
            accessibilityRole='button'
          >
            <Text style={[styles.avatarText, { color: theme.colors.textInverted }]}>
              {getUserInitials()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={lists}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100, gap: 8 }}
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
        onPress={() => router.push('/create-list' as never)}
        testID='fab-create-list'
        accessibilityLabel='Criar nova lista'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
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
});

export default ListsDashboardScreen;
