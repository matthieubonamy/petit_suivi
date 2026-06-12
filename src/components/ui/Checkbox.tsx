import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/tokens';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onChange(!checked)}
      activeOpacity={0.7}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.check}>✓</Text>}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    gap: 10,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.bdr,
    backgroundColor: colors.sur,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  check: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  label: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.dk,
    flex: 1,
  },
});
