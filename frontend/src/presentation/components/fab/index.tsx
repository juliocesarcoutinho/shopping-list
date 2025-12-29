import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line } from 'react-native-svg';

import { useAppTheme } from '../../hooks';

export interface FloatingActionButtonProps {
  onPress: () => void;
  testID?: string;
  accessibilityLabel?: string;
  icon?: React.ReactNode;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  testID = 'fab',
  accessibilityLabel = 'Adicionar',
  icon,
}) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents='box-none'
      style={[styles.container, { bottom: 24 + insets.bottom, right: 24 }]}
    >
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
          },
        ]}
        activeOpacity={0.85}
        onPress={onPress}
        testID={testID}
        accessibilityRole='button'
        accessibilityLabel={accessibilityLabel}
      >
        {icon ?? (
          <Svg width={28} height={28} viewBox='0 0 28 28'>
            <Line
              x1='14'
              y1='6'
              x2='14'
              y2='22'
              stroke={theme.colors.textInverted}
              strokeWidth='3.2'
              strokeLinecap='round'
            />
            <Line
              x1='6'
              y1='14'
              x2='22'
              y2='14'
              stroke={theme.colors.textInverted}
              strokeWidth='3.2'
              strokeLinecap='round'
            />
          </Svg>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
    elevation: 10,
  } as ViewStyle,
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  } as ViewStyle,
  icon: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: Platform.OS === 'android' ? 2 : 0,
  },
});

export default FloatingActionButton;
