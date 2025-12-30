/**
 * AddItemModal - Modal para adicionar novo item à lista
 *
 * Modal que aparece de baixo para cima com formulário para adicionar item.
 * Validação com RHF + Zod conforme critérios de aceite.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, TextField } from '../index';
import { useAppTheme } from '../../hooks';

// Schema de validação Zod
const addItemSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(80, 'Nome deve ter no máximo 80 caracteres')
    .trim(),
  quantity: z
    .number()
    .min(1, 'Quantidade deve ser maior ou igual a 1')
    .positive('Quantidade deve ser positiva'),
  unitPrice: z.preprocess(
    val => {
      if (val === '' || val === undefined || val === null) return undefined;
      if (typeof val === 'string') {
        // Remove espaços e converte vírgula para ponto
        const cleaned = val.trim().replace(',', '.');
        const num = parseFloat(cleaned);
        return isNaN(num) ? undefined : num;
      }
      return val;
    },
    z
      .number()
      .min(0, 'Preço unitário não pode ser negativo')
      .optional()
  ),
});

type AddItemFormData = z.infer<typeof addItemSchema>;

export interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; quantity: number; unit?: string; unitPrice?: number }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
  error: externalError = null,
}) => {
  const theme = useAppTheme();
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddItemFormData>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      name: '',
      quantity: 1,
      unitPrice: undefined,
    },
  });

  // Animação de slide up quando o modal aparece
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 10,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      // Reset form quando fecha
      reset();
    }
  }, [visible, slideAnim, reset]);

  const handleFormSubmit = async (data: AddItemFormData) => {
    try {
      await onSubmit({
        name: data.name,
        quantity: data.quantity,
        unitPrice: data.unitPrice !== undefined && data.unitPrice !== null ? data.unitPrice : undefined,
      });
      // Reset form após sucesso
      reset();
    } catch (error) {
      // Erro é tratado no componente pai
      console.error('Erro ao adicionar item:', error);
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0], // Usa a altura da tela para garantir que o modal suba completamente
  });

  return (
    <Modal visible={visible} transparent animationType='none' statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modal,
                {
                  backgroundColor: theme.colors.surface,
                  transform: [{ translateY }],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Adicionar Item</Text>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  disabled={loading}
                >
                  <Ionicons name='close' size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              {/* ScrollView para permitir scroll quando o teclado aparece */}
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
                bounces={false}
                nestedScrollEnabled={true}
              >
                {/* Error Message */}
                {externalError && (
                  <View style={[styles.errorBanner, { backgroundColor: theme.colors.error }]}>
                    <Text style={[styles.errorText, { color: theme.colors.textInverted }]}>
                      {externalError}
                    </Text>
                  </View>
                )}

                {/* Form */}
                <View style={styles.form}>
                  <Controller
                    control={control}
                    name='name'
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextField
                        label='Nome do Item'
                        placeholder='Ex: Arroz, Feijão, Leite...'
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.name?.message}
                        autoCapitalize='sentences'
                        returnKeyType='next'
                        autoFocus
                        disabled={loading}
                        labelColor={theme.colors.text}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name='quantity'
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextField
                        label='Quantidade'
                        placeholder='Ex: 2'
                        value={value?.toString() || ''}
                        onChangeText={text => {
                          const num = parseFloat(text);
                          if (!isNaN(num) && num > 0) {
                            onChange(num);
                          } else if (text === '') {
                            onChange(1);
                          }
                        }}
                        onBlur={onBlur}
                        error={errors.quantity?.message}
                        keyboardType='numeric'
                        returnKeyType='next'
                        disabled={loading}
                        labelColor={theme.colors.text}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name='unitPrice'
                    render={({ field: { onChange, onBlur, value } }) => {
                      // Estado local para manter o valor formatado (string com vírgula)
                      const [displayValue, setDisplayValue] = useState<string>('');

                      // Sincroniza displayValue com value quando value muda externamente (reset do form)
                      useEffect(() => {
                        if (value === undefined || value === null) {
                          if (displayValue !== '') {
                            setDisplayValue('');
                          }
                        }
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                      }, [value]);

                      // Função para formatar número para exibição no padrão brasileiro (ex: 9900.90 -> "9.900,90")
                      const formatForDisplay = (num: number): string => {
                        // Converte para string com 2 casas decimais
                        const parts = num.toFixed(2).split('.');
                        const reais = parts[0];
                        const centavos = parts[1];
                        
                        // Formata reais com separador de milhar (ponto)
                        const reaisFormatados = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        
                        // Retorna no formato brasileiro: reais,centavos
                        return `${reaisFormatados},${centavos}`;
                      };

                      // Função para formatar string de entrada no padrão brasileiro
                      // Exemplos: "9" -> "0,09" | "99" -> "0,99" | "990" -> "9,90" | "9900" -> "99,00" | "99000" -> "990,00" | "990000" -> "9.900,00"
                      const formatInput = (input: string): string => {
                        // Remove tudo exceto dígitos
                        let digits = input.replace(/\D/g, '');
                        
                        if (digits === '') return '';
                        
                        // Remove zeros à esquerda (exceto se for apenas "0")
                        digits = digits.replace(/^0+/, '') || '0';
                        
                        // Se tem apenas 1 dígito, formata como centavos
                        if (digits.length === 1) {
                          return `0,0${digits}`;
                        }
                        
                        // Se tem 2 dígitos, formata como centavos
                        if (digits.length === 2) {
                          return `0,${digits}`;
                        }
                        
                        // Separa reais e centavos (últimos 2 dígitos são centavos)
                        const reais = digits.slice(0, -2);
                        const centavos = digits.slice(-2);
                        
                        // Formata reais com separador de milhar (ponto)
                        const reaisFormatados = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        
                        // Retorna no formato brasileiro: reais,centavos
                        return `${reaisFormatados},${centavos}`;
                      };

                      // Função para validar e formatar input em tempo real
                      const handlePriceChange = (text: string) => {
                        // Remove caracteres não numéricos (mantém apenas dígitos)
                        const digits = text.replace(/\D/g, '');
                        
                        if (digits === '') {
                          setDisplayValue('');
                          onChange(undefined);
                          return;
                        }
                        
                        // Formata automaticamente no padrão brasileiro
                        const formatted = formatInput(digits);
                        setDisplayValue(formatted);
                        
                        // Converte para número: remove pontos de milhar e substitui vírgula por ponto
                        // Ex: "9.900,90" -> "9900.90" -> 9900.90
                        const numString = formatted.replace(/\./g, '').replace(',', '.');
                        const numValue = parseFloat(numString);
                        
                        if (!isNaN(numValue) && numValue >= 0) {
                          onChange(numValue);
                        }
                      };

                      // Inicializa displayValue quando o campo é focado pela primeira vez
                      const handleFocus = () => {
                        if (value !== undefined && value !== null && displayValue === '') {
                          setDisplayValue(formatForDisplay(value));
                        }
                      };

                      return (
                        <TextField
                          label='Preço Unitário (opcional)'
                          placeholder='Ex: 4,99'
                          value={displayValue}
                          onChangeText={handlePriceChange}
                          onFocus={handleFocus}
                          onBlur={onBlur}
                          error={errors.unitPrice?.message}
                          keyboardType='numeric'
                          returnKeyType='done'
                          disabled={loading}
                          labelColor={theme.colors.text}
                        />
                      );
                    }}
                  />
                </View>

                {/* Button */}
                <Button
                  title='Adicionar Item'
                  onPress={handleSubmit(handleFormSubmit)}
                  loading={loading}
                  disabled={loading}
                  variant='primary'
                  size='large'
                />
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  } as ViewStyle,
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    maxHeight: '90%',
    paddingTop: 24,
  } as ViewStyle,
  scrollView: {
    maxHeight: 600, // Altura máxima para o scroll
  } as ViewStyle,
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 50, // Espaço extra para garantir que o botão seja visível
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  } as ViewStyle,
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  form: {
    gap: 20,
    marginBottom: 24,
  } as ViewStyle,
  errorBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  } as ViewStyle,
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default AddItemModal;

