import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { useAppTheme } from '../../hooks';

export interface ListCardProps {
  title: string;
  itemsCount: number;
  pendingItemsCount: number;
  purchasedItemsCount: number;
  loading?: boolean;
  onPress?: () => void;
  testID?: string;
}

export const ListCard: React.FC<ListCardProps> = ({
  title,
  itemsCount,
  pendingItemsCount,
  purchasedItemsCount,
  loading = false,
  onPress,
  testID,
}) => {
  const theme = useAppTheme();

  if (loading) {
    return (
      <View
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        accessibilityRole='none'
        testID={testID ? `${testID}-skeleton` : 'list-card-skeleton'}
      >
        <View style={[styles.skeletonTitle, { backgroundColor: theme.colors.border }]} />
        <View style={styles.skeletonCounters}>
          <View style={[styles.skeletonCounter, { backgroundColor: theme.colors.border }]} />
          <View style={[styles.skeletonCounter, { backgroundColor: theme.colors.border }]} />
          <View style={[styles.skeletonCounter, { backgroundColor: theme.colors.border }]} />
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole='button'
      accessibilityLabel={`Lista: ${title}`}
      testID={testID || 'list-card'}
    >
      <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.counters}>
        <Counter
          label='Total'
          value={itemsCount}
          color={theme.colors.primary}
          testID={testID ? `${testID}-total` : 'list-card-total'}
        />
        <Counter
          label='Pendentes'
          value={pendingItemsCount}
          color={theme.colors.warning}
          testID={testID ? `${testID}-pending` : 'list-card-pending'}
        />
        <Counter
          label='Comprados'
          value={purchasedItemsCount}
          color={theme.colors.success}
          testID={testID ? `${testID}-purchased` : 'list-card-purchased'}
        />
      </View>
    </TouchableOpacity>
  );
};

interface CounterProps {
  label: string;
  value: number;
  color: string;
  testID?: string;
}

const Counter: React.FC<CounterProps> = ({ label, value, color, testID }) => (
  <View style={styles.counter} testID={testID} accessibilityLabel={`${label}: ${value}`}>
    <Text style={[styles.counterValue, { color }]}>{value}</Text>
    <Text style={styles.counterLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    flexDirection: 'column',
    alignItems: 'flex-start',
  } as ViewStyle,
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.2,
  } as TextStyle,
  counters: {
    flexDirection: 'row',
    gap: 16,
  } as ViewStyle,
  counter: {
    alignItems: 'center',
    minWidth: 56,
  } as ViewStyle,
  counterValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  } as TextStyle,
  counterLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    letterSpacing: 0.5,
  } as TextStyle,
  // Skeleton styles
  skeletonTitle: {
    width: 120,
    height: 20,
    borderRadius: 6,
    marginBottom: 16,
  } as ViewStyle,
  skeletonCounters: {
    flexDirection: 'row',
    gap: 16,
  } as ViewStyle,
  skeletonCounter: {
    width: 56,
    height: 28,
    borderRadius: 8,
  } as ViewStyle,
});

export default ListCard;
