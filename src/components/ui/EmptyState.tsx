import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/tokens';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} style={styles.btn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    color: colors.dk,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.mu,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  btn: {
    paddingHorizontal: 28,
  },
});
