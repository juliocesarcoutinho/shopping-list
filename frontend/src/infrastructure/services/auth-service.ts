/**
 * Auth Service
 * Serviço de autenticação que coordena repository e storage
 */

import { AuthSession, User } from '@/src/domain/entities';
import { AuthRepository } from '@/src/domain/repositories';

import { getApiClient } from '../http/apiClient';
import { AuthStorageService } from '../storage';

export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly storage: AuthStorageService
  ) {}

  async login(email: string, password: string): Promise<AuthSession> {
    const session = await this.repository.login(email, password);
    await this.storage.saveSession(session);
    return session;
  }

  async register(name: string, email: string, password: string): Promise<AuthSession> {
    const session = await this.repository.register(name, email, password);
    await this.storage.saveSession(session);
    return session;
  }

  async logout(): Promise<void> {
    const refreshToken = await this.storage.getRefreshToken();

    if (refreshToken) {
      try {
        await this.repository.logout(refreshToken);
      } catch (_error) {
        // Ignoro erro ao fazer logout no backend
      }
    }

    await this.storage.clearSession();
    getApiClient().removeAuthToken();
  }

  async restoreSession(): Promise<User | null> {
    const accessToken = await this.storage.getAccessToken();
    const user = await this.storage.getUser();

    if (!accessToken || !user) {
      return null;
    }

    // Configuro token no apiClient
    getApiClient().setAuthToken(accessToken);

    try {
      // Verifico se o token ainda é válido buscando dados do usuário
      return await this.repository.getCurrentUser();
    } catch (_error) {
      // Token inválido ou expirado, tento refresh
      const refreshToken = await this.storage.getRefreshToken();
      if (!refreshToken) {
        await this.storage.clearSession();
        return null;
      }

      try {
        const newSession = await this.repository.refreshToken(refreshToken);
        await this.storage.saveSession(newSession);
        return newSession.user;
      } catch (_refreshError) {
        await this.storage.clearSession();
        return null;
      }
    }
  }

  async refreshToken(): Promise<AuthSession | null> {
    const refreshToken = await this.storage.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      const session = await this.repository.refreshToken(refreshToken);
      await this.storage.saveSession(session);
      return session;
    } catch (_error) {
      await this.storage.clearSession();
      throw _error;
    }
  }
}
