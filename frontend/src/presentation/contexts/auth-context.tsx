/**
 * Auth Context
 * Gerencia estado de autenticação do usuário com integração ao backend
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

import { User } from '@/src/domain/entities';
import { authService } from '@/src/infrastructure/services';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const restoredUser = await authService.restoreSession();
      if (restoredUser) {
        setUser(restoredUser);
      }
    } catch (error) {
      console.error('Erro ao restaurar sessão:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const session = await authService.login(email, password);
    setUser(session.user);
  }

  async function signUp(name: string, email: string, password: string) {
    const session = await authService.register(name, email, password);
    setUser(session.user);
  }

  async function signOut() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
