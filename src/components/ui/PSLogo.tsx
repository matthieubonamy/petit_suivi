import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../../constants/tokens';

interface PSLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function PSLogo({ size = 'md', showTagline = false }: PSLogoProps) {
  const scales = { sm: 0.7, md: 1, lg: 1.4 };
  const s = scales[size];
  const dim = Math.round(48 * s);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.logoMark,
          { width: dim, height: dim, borderRadius: Math.round(14 * s) },
        ]}
      >
        <Image
          source={require('../../../assets/icon-192.png')}
          style={{ width: dim, height: dim, borderRadius: Math.round(14 * s) }}
          resizeMode="cover"
        />
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
    backgroundColor: colors.pl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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

