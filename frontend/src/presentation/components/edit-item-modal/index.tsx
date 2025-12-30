/**
 * EditItemModal - Modal para editar item existente na lista
 *
 * Modal que aparece de baixo para cima com formulário pré-preenchido para editar item.
 * Validação com RHF + Zod (reaproveitando schema do AddItemModal).
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

// Schema de validação Zod (reaproveitado do AddItemModal)
const editItemSchema = z.object({
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

type EditItemFormData = z.infer<typeof editItemSchema>;

export interface EditItemModalProps {
  visible: boolean;
  item: {
    id: string;
    name: string;
    quantity: number;
    unitPrice?: number;
  } | null;
  onClose: () => void;
  onSubmit: (data: { name: string; quantity: number; unitPrice?: number }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  visible,
  item,
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
  } = useForm<EditItemFormData>({
    resolver: zodResolver(editItemSchema),
    defaultValues: {
      name: '',
      quantity: 1,
      unitPrice: undefined,
    },
  });

  // Pré-preenche o formulário quando o item muda
  useEffect(() => {
    if (item && visible) {
      reset({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice !== undefined && item.unitPrice !== null && item.unitPrice > 0 ? item.unitPrice : undefined,
      });
    } else if (!visible) {
      reset();
    }
  }, [item, visible, reset]);

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
    }
  }, [visible, slideAnim]);

  const handleFormSubmit = async (data: EditItemFormData) => {
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
      console.error('Erro ao editar item:', error);
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  if (!item) {
    return null;
  }

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
                <View style={styles.headerTitleContainer}>
                  <Ionicons name='pencil' size={20} color={theme.colors.text} style={styles.headerIcon} />
                  <Text style={[styles.title, { color: theme.colors.text }]}>Editar Item</Text>
                </View>
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
                    render={({ field: { onChange, onBlur, value } }) => {
                      // Estado local para manter o valor como string durante a digitação
                      const [displayValue, setDisplayValue] = useState<string>(value?.toString() || '1');

                      // Sincroniza displayValue com value quando value muda externamente (reset do form)
                      useEffect(() => {
                        if (value !== undefined && value !== null) {
                          const newDisplayValue = value.toString();
                          if (displayValue !== newDisplayValue) {
                            setDisplayValue(newDisplayValue);
                          }
                        }
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                      }, [value]);

                      const handleQuantityChange = (text: string) => {
                        // Remove caracteres não numéricos
                        const digits = text.replace(/\D/g, '');
                        
                        // Permite campo vazio temporariamente durante a digitação
                        if (digits === '') {
                          setDisplayValue('');
                          return;
                        }
                        
                        // Converte para número e atualiza display
                        const num = parseFloat(digits);
                        if (!isNaN(num) && num > 0) {
                          setDisplayValue(digits);
                          onChange(num);
                        }
                      };

                      const handleQuantityBlur = () => {
                        // Se o campo estiver vazio ou inválido, define como 1
                        if (displayValue === '' || parseFloat(displayValue) <= 0 || isNaN(parseFloat(displayValue))) {
                          setDisplayValue('1');
                          onChange(1);
                        }
                        onBlur();
                      };

                      return (
                        <TextField
                          label='Quantidade'
                          placeholder='Ex: 2'
                          value={displayValue}
                          onChangeText={handleQuantityChange}
                          onBlur={handleQuantityBlur}
                          error={errors.quantity?.message}
                          keyboardType='numeric'
                          returnKeyType='next'
                          disabled={loading}
                          labelColor={theme.colors.text}
                        />
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name='unitPrice'
                    render={({ field: { onChange, onBlur, value } }) => {
                      // Estado local para manter o valor formatado (string com vírgula)
                      const [displayValue, setDisplayValue] = useState<string>('');

                      // Sincroniza displayValue com value quando value muda externamente (reset do form ou item muda)
                      useEffect(() => {
                        if (value === undefined || value === null) {
                          if (displayValue !== '') {
                            setDisplayValue('');
                          }
                        } else {
                          // Formata o valor para exibição no padrão brasileiro
                          const formatted = formatForDisplay(value);
                          if (displayValue !== formatted) {
                            setDisplayValue(formatted);
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
                        const numString = formatted.replace(/\./g, '').replace(',', '.');
                        const numValue = parseFloat(numString);
                        
                        if (!isNaN(numValue) && numValue >= 0) {
                          onChange(numValue);
                        }
                      };

                      // Inicializa displayValue quando o campo é focado pela primeira vez ou quando value muda
                      const handleFocus = () => {
                        if (value !== undefined && value !== null && value > 0) {
                          const formatted = formatForDisplay(value);
                          if (displayValue !== formatted) {
                            setDisplayValue(formatted);
                          }
                        }
                      };

                      return (
                        <TextField
                          label='Preço (R$)'
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
                  title='Salvar Alterações'
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
    maxHeight: 600,
  } as ViewStyle,
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  } as ViewStyle,
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  } as ViewStyle,
  headerIcon: {
    marginRight: 4,
  },
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

export default EditItemModal;

