import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/tokens';

interface PSLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function PSLogo({ size = 'md', showTagline = false }: PSLogoProps) {
  const scales = { sm: 0.7, md: 1, lg: 1.4 };
  const s = scales[size];

  return (
    <View style={styles.container}>
      <View style={[styles.logoMark, { width: 48 * s, height: 48 * s, borderRadius: 14 * s }]}>
        <Text style={[styles.logoText, { fontSize: 22 * s }]}>PS</Text>
      </View>
      <View style={styles.textGroup}>
        <Text style={[styles.appName, { fontSize: 22 * s }]}>Petit Suivi</Text>
        {showTagline && (
          <Text style={[styles.tagline, { fontSize: 12 * s }]}>
            Suivi doux pour tout-petits
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontFamily: 'Fraunces_600SemiBold',
  },
  textGroup: {
    flexDirection: 'column',
  },
  appName: {
    fontFamily: 'Fraunces_600SemiBold',
    color: colors.dk,
  },
  tagline: {
    fontFamily: 'Nunito_400Regular',
    color: colors.mu,
    marginTop: 2,
  },
});
