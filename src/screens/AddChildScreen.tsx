import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { colors, AVATAR_CATALOG, AVATAR_IMAGES, AvatarCategory } from '../constants/tokens';
import { useChildren } from '../stores/ChildrenContext';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';
import { AvatarCircle } from '../components/ui/AvatarCircle';
import { getChildById } from '../services/database';

type Props = StackScreenProps<RootStackParamList, 'AddChild'>;

const CATEGORY_TABS: { key: AvatarCategory; label: string }[] = [
  { key: 'baby',    label: '👶 Bébés' },
  { key: 'child',   label: '🧒 Enfants' },
  { key: 'mother',  label: '👩 Mères' },
  { key: 'father',  label: '👨 Pères' },
  { key: 'parent',  label: '🧑 Parents' },
  { key: 'diverse', label: '🌍 Diversité' },
];

const DEFAULT_COLOR = '#C97B4A';

export function AddChildScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { addChild, editChild } = useChildren();
  const childId = route.params?.childId;
  const isEditing = Boolean(childId);

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('b1');
  const [activeCategory, setActiveCategory] = useState<AvatarCategory>('baby');
  const [errors, setErrors] = useState<{ name?: string; birthDate?: string }>({});

  useEffect(() => {
    if (childId) {
      const child = getChildById(childId);
      if (child) {
        setName(child.name);
        setBirthDate(child.birthDate);
        if (child.avatarId) {
          setSelectedAvatarId(child.avatarId);
          // Determine category from avatarId
          const found = AVATAR_CATALOG.find((a) => a.id === child.avatarId);
          if (found) setActiveCategory(found.category);
        }
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
      else if (new Date(iso) > new Date()) errs.birthDate = 'La date doit être dans le passé';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const iso = parseDateToISO(birthDate)!;
    if (isEditing && childId) {
      editChild(childId, { name: name.trim(), birthDate: iso, avatarColor: DEFAULT_COLOR, avatarId: selectedAvatarId });
    } else {
      addChild({ name: name.trim(), birthDate: iso, avatarColor: DEFAULT_COLOR, avatarId: selectedAvatarId });
    }
    navigation.goBack();
  }

  const avatarsInCategory = AVATAR_CATALOG.filter((a) => a.category === activeCategory);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.saveTopBtn}>
            <Text style={styles.saveTopText}>
              {isEditing ? 'Enregistrer' : 'Ajouter'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>
          {isEditing ? 'Modifier l\'enfant' : 'Ajouter un enfant'}
        </Text>

        {/* Preview */}
        <View style={styles.previewRow}>
          <AvatarCircle
            name={name || '?'}
            color={DEFAULT_COLOR}
            avatarId={selectedAvatarId}
            size={72}
          />
          <View style={styles.previewText}>
            <Text style={styles.previewName}>{name || 'Prénom'}</Text>
            {birthDate.length === 10 && parseDateToISO(birthDate) && (
              <Text style={styles.previewDate}>{birthDate}</Text>
            )}
          </View>
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

        {/* Avatar picker */}
        <Text style={styles.avatarLabel}>Avatar</Text>

        {/* Category tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
          <View style={styles.tabsRow}>
            {CATEGORY_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeCategory === tab.key && styles.tabActive]}
                onPress={() => setActiveCategory(tab.key)}
              >
                <Text style={[styles.tabText, activeCategory === tab.key && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Avatar grid */}
        <View style={styles.avatarGrid}>
          {avatarsInCategory.map((av) => {
            const src = AVATAR_IMAGES[av.id];
            const isSelected = selectedAvatarId === av.id;
            return (
              <TouchableOpacity
                key={av.id}
                style={[styles.avatarItem, isSelected && styles.avatarItemSelected]}
                onPress={() => setSelectedAvatarId(av.id)}
                activeOpacity={0.8}
              >
                <Image
                  source={src}
                  style={[styles.avatarImage, { borderRadius: 32 }]}
                  resizeMode="cover"
                />
                {isSelected && <View style={styles.selectedCheck}><Text style={styles.checkText}>✓</Text></View>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backBtn: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  backText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.primary },
  saveTopBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    minHeight: 44,
    justifyContent: 'center',
  },
  saveTopText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#fff',
  },
  heading: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 26,
    color: colors.dk,
    marginBottom: 20,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.pl,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  previewText: { marginLeft: 16, flex: 1 },
  previewName: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 22,
    color: colors.dk,
  },
  previewDate: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.mu,
    marginTop: 4,
  },
  avatarLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.dk,
    marginBottom: 10,
    marginTop: 8,
  },
  tabs: { marginBottom: 12 },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.sur,
    borderWidth: 1.5,
    borderColor: colors.bdr,
    minHeight: 40,
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.pl,
    borderColor: colors.primary,
  },
  tabText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: colors.mu,
  },
  tabTextActive: { color: colors.primary },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  avatarItem: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  avatarItemSelected: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  selectedCheck: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
  },
});
