import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface AvatarCircleProps {
  name: string;
  color: string;
  size?: number;
  style?: ViewStyle;
}

export function AvatarCircle({ name, color, size = 40, style }: AvatarCircleProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const fontSize = size * 0.36;

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
  },
});
