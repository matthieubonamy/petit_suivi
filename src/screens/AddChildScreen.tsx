import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { colors, AVATAR_COLORS } from '../constants/tokens';
import { useChildren } from '../stores/ChildrenContext';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';
import { AvatarCircle } from '../components/ui/AvatarCircle';
import { getChildById } from '../services/database';

type Props = StackScreenProps<RootStackParamList, 'AddChild'>;

export function AddChildScreen({ navigation, route }: Props) {
  const { addChild, editChild } = useChildren();
  const childId = route.params?.childId;
  const isEditing = Boolean(childId);

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(AVATAR_COLORS[0].hex);
  const [errors, setErrors] = useState<{ name?: string; birthDate?: string }>({});

  useEffect(() => {
    if (childId) {
      const child = getChildById(childId);
      if (child) {
        setName(child.name);
        setBirthDate(child.birthDate);
        setSelectedColor(child.avatarColor);
      }
    }
  }, [childId]);

  function formatBirthDate(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  }

  function parseDateToISO(dateStr: string): string | null {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    if (day.length !== 2 || month.length !== 2 || year.length !== 4) return null;
    const d = new Date(`${year}-${month}-${day}`);
    if (isNaN(d.getTime())) return null;
    return `${year}-${month}-${day}`;
  }

  function validate(): boolean {
    const errs: { name?: string; birthDate?: string } = {};
    if (!name.trim()) errs.name = 'Le prénom est requis';
    if (!birthDate) {
      errs.birthDate = 'La date de naissance est requise';
    } else {
      const iso = parseDateToISO(birthDate);
      if (!iso) errs.birthDate = 'Format invalide (JJ/MM/AAAA)';
      else {
        const d = new Date(iso);
        if (d > new Date()) errs.birthDate = 'La date doit être dans le passé';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const iso = parseDateToISO(birthDate)!;
    if (isEditing && childId) {
      editChild(childId, { name: name.trim(), birthDate: iso, avatarColor: selectedColor });
    } else {
      addChild({ name: name.trim(), birthDate: iso, avatarColor: selectedColor });
    }
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>
          {isEditing ? 'Modifier l\'enfant' : 'Ajouter un enfant'}
        </Text>

        <View style={styles.previewRow}>
          <AvatarCircle name={name || '?'} color={selectedColor} size={64} />
          <Text style={styles.previewName}>{name || 'Prénom'}</Text>
        </View>

        <TextInput
          label="Prénom"
          value={name}
          onChangeText={setName}
          placeholder="Ex: Emma"
          autoCapitalize="words"
          error={errors.name}
        />

        <TextInput
          label="Date de naissance"
          value={birthDate}
          onChangeText={(t) => setBirthDate(formatBirthDate(t))}
          placeholder="JJ/MM/AAAA"
          keyboardType="numeric"
          maxLength={10}
          error={errors.birthDate}
          hint="Format : jour/mois/année"
        />

        <Text style={styles.colorLabel}>Couleur de l'avatar</Text>
        <View style={styles.colorGrid}>
          {AVATAR_COLORS.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.colorDot,
                { backgroundColor: c.hex },
                selectedColor === c.hex && styles.colorDotSelected,
              ]}
              onPress={() => setSelectedColor(c.hex)}
            />
          ))}
        </View>

        <Button
          label={isEditing ? 'Enregistrer les modifications' : 'Ajouter l\'enfant'}
          onPress={handleSave}
          fullWidth
          style={styles.saveBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24 },
  backBtn: { minHeight: 44, justifyContent: 'center', marginBottom: 8, alignSelf: 'flex-start' },
  backText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.primary },
  heading: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 26,
    color: colors.dk,
    marginBottom: 24,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.pl,
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
  },
  previewName: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    color: colors.dk,
  },
  colorLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.dk,
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: colors.dk,
    transform: [{ scale: 1.15 }],
  },
  saveBtn: {},
});
