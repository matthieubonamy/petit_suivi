import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { colors } from '../constants/tokens';
import { PSLogo } from '../components/ui/PSLogo';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity }}>
        <PSLogo size="lg" showTagline />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
