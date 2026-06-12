import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/tokens';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
}

export function Toggle({ options, value, onChange }: ToggleProps) {
  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.tab, value === opt.value && styles.tabActive]}
          onPress={() => onChange(opt.value)}
          activeOpacity={0.75}
        >
          <Text style={[styles.tabText, value === opt.value && styles.tabTextActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.pl,
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.pd,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.pd,
  },
  tabTextActive: {
    color: '#fff',
  },
});
