/**
 * Login Screen
 * Tela de autenticação do usuário
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';

import { Button, TextField } from '../components';
import { useAuth } from '../contexts/auth-context';
import { useAppTheme } from '../hooks';

export function LoginScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateFields = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (_error) {
      Alert.alert('Erro', 'Falha ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    router.push('/register' as never);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Bem-vindo!</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Faça login para continuar
        </Text>

        <View style={styles.form}>
          <TextField
            label='Email'
            placeholder='seu@email.com'
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
          />

          <TextField
            label='Senha'
            placeholder='••••••••'
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            error={errors.password}
            secureTextEntry
          />

          <Button
            title='Entrar'
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            size='large'
          />

          <Button
            title='Criar conta'
            onPress={handleGoToRegister}
            variant='secondary'
            disabled={isLoading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    gap: 16,
  },
});
