/**
 * Register Screen
 * Tela de cadastro de novo usuário
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';

import { Button, TextField } from '../components';
import { useAuth } from '../contexts/auth-context';
import { useAppTheme } from '../hooks';

export function RegisterScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateFields = () => {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!name) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    } else if (name.length < 3) {
      newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
      isValid = false;
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não conferem';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    setIsLoading(true);
    try {
      await signUp(name, email, password);
    } catch (_error) {
      Alert.alert('Erro', 'Falha ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Criar Conta</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Preencha os dados para começar
        </Text>

        <View style={styles.form}>
          <TextField
            label='Nome'
            placeholder='Seu nome completo'
            value={name}
            onChangeText={text => {
              setName(text);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            error={errors.name}
            autoCapitalize='words'
          />

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

          <TextField
            label='Confirmar Senha'
            placeholder='••••••••'
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
            }}
            error={errors.confirmPassword}
            secureTextEntry
          />

          <Button
            title='Criar Conta'
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            size='large'
          />

          <Button
            title='Já tenho conta'
            onPress={handleGoToLogin}
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
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
});
