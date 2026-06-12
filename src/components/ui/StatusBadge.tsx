import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/tokens';
import { StatusLevel } from '../../types';

interface StatusBadgeProps {
  status: StatusLevel;
  label?: string;
  compact?: boolean;
}

const STATUS_CONFIG = {
  ok: {
    label: 'Normal',
    bg: colors.okB,
    text: colors.okT,
    border: '#C8E6C8',
  },
  watch: {
    label: 'A surveiller',
    bg: colors.waB,
    text: colors.waT,
    border: colors.waBdr,
  },
  alert: {
    label: 'Consulter un médecin',
    bg: colors.alB,
    text: colors.alT,
    border: colors.alBdr,
  },
};

export function StatusBadge({ status, label, compact = false }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const displayLabel = label ?? cfg.label;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: cfg.bg, borderColor: cfg.border },
        compact && styles.compact,
      ]}
    >
      <Text style={[styles.dot, { color: cfg.text }]}>●</Text>
      <Text style={[styles.text, { color: cfg.text }, compact && styles.compactText]}>
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
    alignSelf: 'flex-start',
  },
  compact: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  dot: {
    fontSize: 8,
  },
  text: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
  },
  compactText: {
    fontSize: 11,
  },
});
