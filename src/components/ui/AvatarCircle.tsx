import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { AVATAR_IMAGES } from '../../constants/tokens';

interface AvatarCircleProps {
  name: string;
  color: string;
  avatarId?: string;
  size?: number;
  style?: ViewStyle;
}

export function AvatarCircle({ name, color, avatarId, size = 40, style }: AvatarCircleProps) {
  const imageSource = avatarId ? AVATAR_IMAGES[avatarId] : null;
  const fontSize = size * 0.36;

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: imageSource ? 'transparent' : color },
        style,
      ]}
    >
      {imageSource ? (
        <Image
          source={imageSource}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
  },
});
