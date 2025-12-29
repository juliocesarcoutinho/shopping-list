/**
 * Account Screen
 * Exibe dados do usuário autenticado com design melhorado
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { User } from '@/src/domain/entities';
import { userService } from '@/src/infrastructure/services';

import { Button } from '../components';
import { useAuth } from '../contexts/auth-context';
import { useAppTheme } from '../hooks';

export function AccountScreen() {
  const theme = useAppTheme();
  const { signOut } = useAuth();
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

  const getProviderIcon = (provider: 'LOCAL' | 'GOOGLE'): string => {
    return provider === 'GOOGLE' ? '🔐' : '📧';
  };

  const getProviderLabel = (provider: 'LOCAL' | 'GOOGLE'): string => {
    return provider === 'GOOGLE' ? 'Google' : 'Email/Senha';
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Carregando dados...
          </Text>
        </View>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centerContainer}>
          <View
            style={[
              styles.errorCard,
              { backgroundColor: theme.colors.error + '15', borderColor: theme.colors.error },
            ]}
          >
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{errorMessage}</Text>
            <Button
              title='Tentar Novamente'
              onPress={loadUserData}
              variant='primary'
              size='medium'
            />
          </View>
        </View>
      </View>
    );
  }

  if (!user) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={[styles.title, { color: theme.colors.text }]}>Minha Conta</Text>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: theme.colors.primary + '20',
                borderColor: theme.colors.primary,
              },
            ]}
          >
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={[styles.userName, { color: theme.colors.text }]}>{user.name}</Text>
        </View>

        {/* User Data Card */}
        <View
          style={[
            styles.userCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {/* Nome */}
          <View style={styles.fieldSection}>
            <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>📛 NOME</Text>
            <Text style={[styles.fieldValue, { color: theme.colors.text }]}>{user.name}</Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Email */}
          <View style={styles.fieldSection}>
            <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>📧 EMAIL</Text>
            <Text style={[styles.fieldValue, { color: theme.colors.text }]}>{user.email}</Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Método de Autenticação */}
          <View style={styles.fieldSection}>
            <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
              🔐 AUTENTICAÇÃO
            </Text>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: theme.colors.primary + '15',
                  borderColor: theme.colors.primary,
                },
              ]}
            >
              <Text style={styles.badgeIcon}>{getProviderIcon(user.provider)}</Text>
              <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
                {getProviderLabel(user.provider)}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Status */}
          {user.status && (
            <>
              <View style={styles.fieldSection}>
                <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
                  ✓ STATUS
                </Text>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: theme.colors.primary + '15',
                      borderColor: theme.colors.primary,
                    },
                  ]}
                >
                  <Text style={styles.badgeIcon}>✓</Text>
                  <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
                    {user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            </>
          )}

          {/* Membro Desde */}
          {user.createdAt && (
            <View style={styles.fieldSection}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
                📅 MEMBRO DESDE
              </Text>
              <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button title='Recarregar Dados' onPress={loadUserData} variant='primary' size='large' />
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
            size='large'
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  userCard: {
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 28,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  fieldSection: {
    marginVertical: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 6,
  },
  badgeIcon: {
    fontSize: 14,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  errorCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    gap: 16,
  },
  errorIcon: {
    fontSize: 48,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingText: {
    fontSize: 15,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  actions: {
    gap: 12,
  },
});
