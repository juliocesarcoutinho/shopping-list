/**
 * Account Screen
 * Exibe dados do usuário autenticado
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { User } from '@/src/domain/entities';
import { userService } from '@/src/infrastructure/services';
import { Button } from '../components';
import { useAuth } from '../contexts/auth-context';
import { useAppTheme } from '../hooks';

export function AccountScreen() {
  const theme = useAppTheme();
  const { user: authUser, signOut } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const userData = await userService.getMe();
      setUser(userData);
    } catch (error: any) {
      const errorMsg = error?.message || 'Erro ao carregar dados do usuário';
      setErrorMessage(errorMsg);
      console.error('[AccountScreen] Erro ao carregar usuário:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderLabel = (provider: 'LOCAL' | 'GOOGLE'): string => {
    return provider === 'GOOGLE' ? '🔐 Google' : '📧 Email/Senha';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Minha Conta</Text>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Carregando dados...
          </Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.centerContainer}>
          <View
            style={[
              styles.errorCard,
              { backgroundColor: theme.colors.error + '15', borderColor: theme.colors.error },
            ]}
          >
            <Text style={[styles.errorIcon]}>⚠️</Text>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{errorMessage}</Text>
            <Button
              title='Tentar Novamente'
              onPress={loadUserData}
              variant='primary'
              size='medium'
            />
          </View>
        </View>
      ) : user ? (
        <View style={styles.content}>
          {/* Card de Dados do Usuário */}
          <View
            style={[
              styles.userCard,
              {
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            {/* Avatar */}
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.colors.primary + '20' },
              ]}
            >
              <Text style={styles.avatarText}>👤</Text>
            </View>

            {/* Informações */}
            <View style={styles.userInfo}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Nome</Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{user.name}</Text>

              <Text style={[styles.label, { color: theme.colors.textSecondary, marginTop: 16 }]}>
                Email
              </Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{user.email}</Text>

              <Text style={[styles.label, { color: theme.colors.textSecondary, marginTop: 16 }]}>
                Método de Autenticação
              </Text>
              <View
                style={[
                  styles.providerBadge,
                  { backgroundColor: theme.colors.primary + '15' },
                ]}
              >
                <Text style={[styles.providerText, { color: theme.colors.primary }]}>
                  {getProviderLabel(user.provider)}
                </Text>
              </View>

              {user.status && (
                <>
                  <Text style={[styles.label, { color: theme.colors.textSecondary, marginTop: 16 }]}>
                    Status
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: theme.colors.primary + '15' },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: theme.colors.primary }]}>
                      ✓ {user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                    </Text>
                  </View>
                </>
              )}

              {user.createdAt && (
                <>
                  <Text style={[styles.label, { color: theme.colors.textSecondary, marginTop: 16 }]}>
                    Membro Desde
                  </Text>
                  <Text style={[styles.value, { color: theme.colors.text }]}>
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Botões */}
          <View style={styles.actions}>
            <Button
              title='Recarregar Dados'
              onPress={loadUserData}
              variant='primary'
              size='medium'
            />
            <Button
              title='Sair'
              onPress={async () => {
                try {
                  await signOut();
                } catch (error) {
                  console.error('Erro ao sair:', error);
                }
              }}
              variant='secondary'
              size='medium'
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  userCard: {
    borderRadius: 12,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  avatarText: {
    fontSize: 40,
  },
  userInfo: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  providerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  providerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  actions: {
    gap: 12,
  },
});
