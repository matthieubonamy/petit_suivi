import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constants/tokens';
import { getAllAPIKeys, insertAPIKey, deleteAPIKey } from '../services/database';
import { APIKeyEntry } from '../types';
import { TextInput } from '../components/ui/TextInput';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export function APIKeysScreen() {
  const navigation = useNavigation();
  const [keys, setKeys] = useState<APIKeyEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState('');
  const [keyValue, setKeyValue] = useState('');
  const [provider, setProvider] = useState('');

  useEffect(() => {
    setKeys(getAllAPIKeys());
  }, []);

  function handleAdd() {
    if (!label || !keyValue || !provider) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }
    const entry = insertAPIKey({ label, keyValue, provider });
    setKeys((prev) => [entry, ...prev]);
    setLabel('');
    setKeyValue('');
    setProvider('');
    setShowForm(false);
  }

  function handleDelete(id: string) {
    Alert.alert('Supprimer la clé', 'Confirmez-vous la suppression ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          deleteAPIKey(id);
          setKeys((prev) => prev.filter((k) => k.id !== id));
        },
      },
    ]);
  }

  function maskKey(key: string): string {
    if (key.length <= 8) return '•'.repeat(key.length);
    return key.slice(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Clés API</Text>
        <Text style={styles.subheading}>
          Gérez vos clés d'analyse par intelligence artificielle
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Les clés API permettent d'activer l'analyse automatique des photos. Elles sont
            stockées localement et chiffrées sur votre appareil.
          </Text>
        </View>

        {showForm ? (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Nouvelle clé</Text>
            <TextInput
              label="Label"
              value={label}
              onChangeText={setLabel}
              placeholder="Ex: OpenAI production"
            />
            <TextInput
              label="Fournisseur"
              value={provider}
              onChangeText={setProvider}
              placeholder="Ex: openai, anthropic"
              autoCapitalize="none"
            />
            <TextInput
              label="Clé API"
              value={keyValue}
              onChangeText={setKeyValue}
              placeholder="sk-..."
              secureTextEntry
              secureToggle
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.formButtons}>
              <Button label="Annuler" onPress={() => setShowForm(false)} variant="outline" style={{ flex: 1 }} />
              <Button label="Ajouter" onPress={handleAdd} style={{ flex: 1 }} />
            </View>
          </View>
        ) : (
          <Button
            label="+ Ajouter une clé"
            onPress={() => setShowForm(true)}
            variant="outline"
            fullWidth
          />
        )}

        {keys.length === 0 && !showForm ? (
          <EmptyState
            icon="🔑"
            title="Aucune clé API"
            subtitle="Ajoutez une clé pour activer l'analyse automatique des photos."
          />
        ) : (
          <View style={styles.keysList}>
            {keys.map((key) => (
              <View key={key.id} style={styles.keyCard}>
                <View style={styles.keyInfo}>
                  <Text style={styles.keyLabel}>{key.label}</Text>
                  <Text style={styles.keyProvider}>{key.provider}</Text>
                  <Text style={styles.keyValue}>{maskKey(key.keyValue)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.keyDeleteBtn}
                  onPress={() => handleDelete(key.id)}
                >
                  <Text style={styles.keyDeleteText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, paddingBottom: 12 },
  backBtn: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', marginBottom: 4 },
  backText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.primary },
  heading: { fontFamily: 'Fraunces_600SemiBold', fontSize: 26, color: colors.dk },
  subheading: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.mu,
    marginTop: 4,
  },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  infoBox: {
    backgroundColor: colors.pl,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.bdr,
  },
  infoText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.mu,
    lineHeight: 20,
  },
  form: {
    backgroundColor: colors.sur,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.bdr,
    gap: 4,
  },
  formTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: colors.dk,
    marginBottom: 8,
  },
  formButtons: { flexDirection: 'row', gap: 10, marginTop: 8 },
  keysList: { gap: 10 },
  keyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sur,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.bdr,
    gap: 12,
  },
  keyInfo: { flex: 1 },
  keyLabel: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.dk },
  keyProvider: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: colors.mu, marginTop: 2 },
  keyValue: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.mu,
    fontFamily: 'monospace' as any,
    marginTop: 4,
  },
  keyDeleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.alB,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  keyDeleteText: { fontSize: 12, color: colors.al, fontFamily: 'Nunito_700Bold' },
});
