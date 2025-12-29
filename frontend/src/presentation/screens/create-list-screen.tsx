/**
 * Create List Screen
 * Tela de criação de nova lista de compras com validação RHF + Zod
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { ShoppingListRemoteDataSource } from '@/src/data/data-sources/shopping-list-remote-data-source';
import { ShoppingListRepositoryImpl } from '@/src/data/repositories/shopping-list-repository';
import { CreateListUseCase } from '@/src/domain/use-cases';

import { Button, TextField } from '../components';
import { useAppTheme } from '../hooks';

// Schema de validação Zod
const createListSchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres')
    .trim(),
  description: z
    .string()
    .max(255, 'Descrição deve ter no máximo 255 caracteres')
    .optional()
    .or(z.literal('')),
});

type CreateListFormData = z.infer<typeof createListSchema>;

// Instancio use case - idealmente viria de DI/contexto
const remoteDataSource = new ShoppingListRemoteDataSource();
const repository = new ShoppingListRepositoryImpl(remoteDataSource);
const createListUseCase = new CreateListUseCase(repository);

export function CreateListScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateListFormData>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateListFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      await createListUseCase.execute({
        title: data.title,
        description: data.description || undefined,
      });

      // Sucesso: volto para o dashboard
      router.back();
    } catch (error: unknown) {
      // Capturo mensagem de erro da API ou do use case
      const apiError = error as { message?: string; data?: { message?: string } };
      const apiMessage = apiError?.message || apiError?.data?.message;
      setErrorMessage(apiMessage || 'Erro ao criar lista. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Nova Lista</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Crie uma nova lista de compras
          </Text>

          {errorMessage ? (
            <View style={[styles.errorBanner, { backgroundColor: theme.colors.error }]}>
              <Text style={[styles.errorText, { color: theme.colors.textInverted }]}>
                {errorMessage}
              </Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Controller
              control={control}
              name='title'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label='Título'
                  placeholder='Ex: Compras do mês'
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.title?.message}
                  autoCapitalize='sentences'
                  returnKeyType='next'
                />
              )}
            />

            <Controller
              control={control}
              name='description'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label='Descrição (opcional)'
                  placeholder='Ex: Lista para o supermercado'
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.description?.message}
                  autoCapitalize='sentences'
                  returnKeyType='done'
                  multiline
                  numberOfLines={3}
                />
              )}
            />
          </View>

          <View style={styles.actions}>
            <Button
              title='Criar'
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              variant='primary'
              size='large'
            />
            <Button
              title='Cancelar'
              onPress={handleCancel}
              disabled={isLoading}
              variant='secondary'
              size='large'
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
  },
});
