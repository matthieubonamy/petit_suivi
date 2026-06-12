import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../constants/tokens';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const containerStyle = [
    styles.base,
    styles[variant],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const labelStyle = [styles.label, styles[`${variant}Text` as keyof typeof styles], textStyle];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#fff' : colors.primary}
          size="small"
        />
      ) : (
        <Text style={labelStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.55 },

  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.sec },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.al },

  label: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
  },
  primaryText: { color: '#fff' },
  secondaryText: { color: colors.dk },
  outlineText: { color: colors.primary },
  ghostText: { color: colors.primary },
  dangerText: { color: '#fff' },
});
