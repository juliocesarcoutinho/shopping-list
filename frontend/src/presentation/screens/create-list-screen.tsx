/**
 * Create List Screen
 * Tela de criação de nova lista de compras com validação RHF + Zod
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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

  return (
    <View style={[styles.container, { backgroundColor: '#E8F5E9' }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
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
                label='Nome da Lista'
                placeholder='Digite o nome da lista'
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
                label='Descrição (optional)'
                placeholder='Adicione uma descrição para sua lista'
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.description?.message}
                autoCapitalize='sentences'
                returnKeyType='done'
                multiline
                numberOfLines={5}
              />
            )}
          />
        </View>

        <Button
          title='Criar Lista'
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
          variant='primary'
          size='large'
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
    gap: 24,
  },
  form: {
    gap: 20,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});
