import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { colors } from '../constants/tokens';
import { Button } from '../components/ui/Button';

type Props = StackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: '👶',
    title: 'Bienvenue dans\nPetit Suivi',
    body: "Suivez facilement les selles et urines de votre nourrisson pour veiller à sa santé.",
  },
  {
    icon: '🌿',
    title: 'Simple et\nBienveillant',
    body: "Enregistrez chaque observation en quelques secondes. Couleur, consistance, notes.",
  },
  {
    icon: '🔒',
    title: 'Vos données\nvous appartiennent',
    body: "Tout est stocké localement sur votre appareil. Offline-first, respectueux de votre vie privée.",
  },
  {
    icon: '🩺',
    title: 'Repères médicaux',
    body: "Consultez les fréquences normales par âge et sachez quand consulter un médecin.",
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(idx);
  }

  function next() {
    if (activeIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (activeIndex + 1) * width, animated: true });
    } else {
      navigation.replace('Login');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scroll}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <Text style={styles.icon}>{slide.icon}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.body}>{slide.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>

        <Button
          label={activeIndex === SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
          onPress={next}
          fullWidth
          style={styles.btn}
        />

        <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.skipBtn}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  icon: { fontSize: 72, marginBottom: 32 },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 30,
    color: colors.dk,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  body: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: colors.mu,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    gap: 12,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.bdr,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  btn: {},
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  skipText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
  },
});
