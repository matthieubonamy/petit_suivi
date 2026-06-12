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
import { Checkbox } from '../components/ui/Checkbox';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export function SignupScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptCGV, setAcceptCGV] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!email || !password || !confirm) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (!acceptCGV) {
      setError('Veuillez accepter les conditions générales');
      return;
    }
    setError('');
    setLoading(true);
    const result = await register(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Erreur lors de la création du compte');
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Créer un compte</Text>
          <Text style={styles.subheading}>
            Pour synchroniser vos données entre appareils
          </Text>

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
            placeholder="Min. 8 caractères"
            hint="Au moins 8 caractères"
          />

          <TextInput
            label="Confirmer le mot de passe"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            secureToggle
            placeholder="••••••••"
          />

          <Checkbox
            checked={acceptCGV}
            onChange={setAcceptCGV}
            label="J'accepte les conditions générales et la politique de confidentialité"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            label="Créer mon compte"
            onPress={handleSignup}
            loading={loading}
            fullWidth
            style={styles.btn}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginHint}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24 },
  backBtn: { minHeight: 44, justifyContent: 'center', marginBottom: 8, alignSelf: 'flex-start' },
  backText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.primary,
  },
  heading: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 28,
    color: colors.dk,
    marginBottom: 6,
  },
  subheading: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
    marginBottom: 24,
  },
  error: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.al,
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: colors.alB,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.alBdr,
  },
  btn: { marginTop: 16, marginBottom: 16 },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginHint: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
  },
  loginLink: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.primary,
  },
});
