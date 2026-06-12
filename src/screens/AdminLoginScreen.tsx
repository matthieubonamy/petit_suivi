import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/tokens';
import { RootStackParamList } from '../types';
import { TextInput } from '../components/ui/TextInput';
import { Button } from '../components/ui/Button';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const ADMIN_PIN = '2025'; // Demo PIN

export function AdminLoginScreen() {
  const navigation = useNavigation<NavProp>();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    if (pin === ADMIN_PIN) {
      navigation.replace('AdminDashboard');
    } else {
      setError('PIN incorrect');
      setPin('');
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>

          <View style={styles.center}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>🔐</Text>
            </View>
            <Text style={styles.heading}>Administration</Text>
            <Text style={styles.subheading}>Accès réservé aux administrateurs</Text>

            <TextInput
              label="PIN"
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              keyboardType="numeric"
              maxLength={8}
              placeholder="••••"
              containerStyle={styles.pinInput}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button label="Accéder" onPress={handleLogin} fullWidth />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: 24 },
  backBtn: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  backText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.primary },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.pl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: { fontSize: 36 },
  heading: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 26,
    color: colors.dk,
  },
  subheading: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
    marginBottom: 24,
  },
  pinInput: { width: '100%', marginBottom: 8 },
  error: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.al,
    marginBottom: 12,
  },
});
