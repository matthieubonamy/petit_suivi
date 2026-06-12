import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { colors } from '../constants/tokens';
import { useAuth } from '../stores/AuthContext';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';

type Props = StackScreenProps<RootStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }
    setError('');
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Erreur lors de l\'envoi');
    } else {
      setSuccess(true);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Mot de passe oublié</Text>
          <Text style={styles.subheading}>
            Entrez votre adresse email pour recevoir un lien de réinitialisation.
          </Text>

          {success ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                Un email de réinitialisation a été envoyé à {email}. Vérifiez votre boîte de réception.
              </Text>
              <Button
                label="Retour à la connexion"
                onPress={() => navigation.navigate('Login')}
                variant="outline"
                fullWidth
                style={styles.backToLoginBtn}
              />
            </View>
          ) : (
            <>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoComplete="email"
                placeholder="vous@exemple.fr"
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Button
                label="Envoyer le lien"
                onPress={handleReset}
                loading={loading}
                fullWidth
                style={styles.btn}
              />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: 24 },
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
    lineHeight: 22,
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
  btn: { marginTop: 8 },
  successBox: {
    backgroundColor: colors.okB,
    borderWidth: 1,
    borderColor: '#C8E6C8',
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  successText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.okT,
    lineHeight: 22,
  },
  backToLoginBtn: {},
});
