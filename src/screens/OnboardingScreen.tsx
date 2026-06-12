import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { colors } from '../constants/tokens';
import { Button } from '../components/ui/Button';

type Props = StackScreenProps<RootStackParamList, 'Onboarding'>;

const SLIDES = [
  {
    icon: '👶',
    title: 'Bienvenue dans\nPetit Suivi',
    body: 'Suivez facilement les selles et urines de votre nourrisson pour veiller à sa santé.',
  },
  {
    icon: '🌿',
    title: 'Simple et\nBienveillant',
    body: 'Enregistrez chaque observation en quelques secondes. Couleur, consistance, notes.',
  },
  {
    icon: '🔒',
    title: 'Vos données\nvous appartiennent',
    body: 'Tout est stocké localement sur votre appareil. Offline-first, respectueux de votre vie privée.',
  },
  {
    icon: '🩺',
    title: 'Repères médicaux',
    body: 'Consultez les fréquences normales par âge et sachez quand consulter un médecin.',
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = SLIDES[activeIndex];

  function next() {
    if (activeIndex < SLIDES.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      navigation.replace('Login');
    }
  }

  return (
    <View style={styles.container}>
      {/* Slide content */}
      <View style={styles.slide}>
        <Text style={styles.icon}>{slide.icon}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>

      {/* Fixed footer */}
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
        />

        <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.skipBtn}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    flexDirection: 'column',
  },
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
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: colors.bg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.bdr,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  skipText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
  },
});
