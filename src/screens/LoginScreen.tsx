import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { colors } from '../constants/tokens';
import { useAuth } from '../stores/AuthContext';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';
import { PSLogo } from '../components/ui/PSLogo';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Erreur de connexion');
    } else {
      navigation.replace('MainTabs');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrap}>
            <PSLogo size="md" showTagline />
          </View>

          <Text style={styles.heading}>Connexion</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            placeholder="vous@exemple.fr"
          />

          <TextInput
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            secureToggle
            placeholder="••••••••"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button label="Se connecter" onPress={handleLogin} loading={loading} fullWidth style={styles.btn} />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.link}
          >
            <Text style={styles.linkText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>ou</Text>
            <View style={styles.line} />
          </View>

          <Button
            label="Créer un compte"
            onPress={() => navigation.navigate('Signup')}
            variant="outline"
            fullWidth
          />

          <TouchableOpacity
            onPress={() => navigation.replace('MainTabs')}
            style={styles.guestBtn}
          >
            <Text style={styles.guestText}>Continuer sans compte</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingTop: 16 },
  logoWrap: { alignItems: 'center', marginBottom: 32, marginTop: 8 },
  heading: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 28,
    color: colors.dk,
    marginBottom: 24,
  },
  error: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.al,
    marginBottom: 12,
    backgroundColor: colors.alB,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.alBdr,
  },
  btn: { marginTop: 4, marginBottom: 8 },
  link: {
    alignSelf: 'center',
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  linkText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.bdr },
  orText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.mu,
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
    marginTop: 8,
  },
  guestText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
    textDecorationLine: 'underline',
  },
});
