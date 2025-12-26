/**
 * Design Tokens - Colors
 *
 * Paleta de cores centralizada seguindo design minimalista.
 * Inspirada em sistemas como iOS Human Interface Guidelines.
 */

// Cores Base (Neutras)
export const baseColors = {
  // Brancos e Pretos
  white: '#FFFFFF',
  black: '#000000',

  // Escala de Cinzas
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

// Cores Semânticas
export const semanticColors = {
  // Primary (Azul - inspirado no iOS)
  primary50: '#EFF6FF',
  primary100: '#DBEAFE',
  primary200: '#BFDBFE',
  primary300: '#93C5FD',
  primary400: '#60A5FA',
  primary500: '#3B82F6', // Cor principal
  primary600: '#2563EB',
  primary700: '#1D4ED8',
  primary800: '#1E40AF',
  primary900: '#1E3A8A',

  // Success (Verde)
  success50: '#F0FDF4',
  success100: '#DCFCE7',
  success500: '#22C55E',
  success600: '#16A34A',

  // Warning (Amarelo)
  warning50: '#FFFBEB',
  warning100: '#FEF3C7',
  warning500: '#F59E0B',
  warning600: '#D97706',

  // Error (Vermelho)
  error50: '#FEF2F2',
  error100: '#FEE2E2',
  error500: '#EF4444',
  error600: '#DC2626',
};

// Temas Light/Dark
export const lightColors = {
  // Background
  background: baseColors.white,
  backgroundSecondary: baseColors.gray50,
  backgroundTertiary: baseColors.gray100,

  // Text
  text: baseColors.gray900,
  textSecondary: baseColors.gray600,
  textTertiary: baseColors.gray500,
  textInverted: baseColors.white,

  // Primary
  primary: semanticColors.primary500,
  primaryHover: semanticColors.primary600,
  primaryActive: semanticColors.primary700,

  // Surface (Cards, Modals)
  surface: baseColors.white,
  surfaceSecondary: baseColors.gray50,

  // Borders
  border: baseColors.gray200,
  borderFocus: semanticColors.primary500,

  // States
  success: semanticColors.success500,
  warning: semanticColors.warning500,
  error: semanticColors.error500,

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const darkColors = {
  // Background
  background: baseColors.gray900,
  backgroundSecondary: baseColors.gray800,
  backgroundTertiary: baseColors.gray700,

  // Text
  text: baseColors.white,
  textSecondary: baseColors.gray300,
  textTertiary: baseColors.gray400,
  textInverted: baseColors.gray900,

  // Primary
  primary: semanticColors.primary400,
  primaryHover: semanticColors.primary300,
  primaryActive: semanticColors.primary200,

  // Surface
  surface: baseColors.gray800,
  surfaceSecondary: baseColors.gray700,

  // Borders
  border: baseColors.gray600,
  borderFocus: semanticColors.primary400,

  // States
  success: semanticColors.success500,
  warning: semanticColors.warning500,
  error: semanticColors.error500,

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export type ColorTokens = typeof lightColors;
