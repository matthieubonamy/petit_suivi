import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { colors } from '../../constants/tokens';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  secureToggle?: boolean;
  containerStyle?: ViewStyle;
}

export function TextInput({
  label,
  error,
  hint,
  secureToggle,
  containerStyle,
  secureTextEntry,
  ...rest
}: TextInputProps) {
  const [secure, setSecure] = useState(secureTextEntry ?? false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error ? styles.inputError : styles.inputNormal]}>
        <RNTextInput
          style={styles.input}
          placeholderTextColor={colors.mu}
          secureTextEntry={secure}
          autoCapitalize="none"
          {...rest}
        />
        {secureToggle && (
          <TouchableOpacity
            onPress={() => setSecure((s) => !s)}
            style={styles.toggleBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.toggleText}>{secure ? 'Voir' : 'Masquer'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.dk,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: colors.sur,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  inputNormal: { borderColor: colors.bdr },
  inputError: { borderColor: colors.al },
  input: {
    flex: 1,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.dk,
    paddingVertical: 10,
  },
  toggleBtn: { paddingLeft: 8 },
  toggleText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: colors.primary,
  },
  errorText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.al,
    marginTop: 4,
  },
  hintText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.mu,
    marginTop: 4,
  },
});
