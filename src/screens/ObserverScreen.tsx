import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../constants/tokens';
import { STOOL_COLORS, URINE_COLORS } from '../constants/stoolColors';
import { BRISTOL_SCALE } from '../constants/bristolScale';
import { useChildren } from '../stores/ChildrenContext';
import { insertObservation } from '../services/database';
import { getStatusFromColorId, computeOverallStatus, getBristolStatus, getStatusLabel, analyzePhotoColor } from '../services/colorAnalysis';
import { Toggle } from '../components/ui/Toggle';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AvatarCircle } from '../components/ui/AvatarCircle';
import { BristolVisual } from '../components/ui/BristolVisual';
import { EmptyState } from '../components/ui/EmptyState';
import { RootStackParamList, StatusLevel } from '../types';

type NavProp = StackNavigationProp<RootStackParamList>;

export function ObserverScreen() {
  const navigation = useNavigation<NavProp>();
  const { children, selectedChildId, setSelectedChildId } = useChildren();
  const insets = useSafeAreaInsets();

  const [type, setType] = useState<'stool' | 'urine'>('stool');
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedBristol, setSelectedBristol] = useState<number | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const colorStatus: StatusLevel = selectedColorId
    ? getStatusFromColorId(selectedColorId, type)
    : 'ok';
  const bristolStatus = type === 'stool' && selectedBristol
    ? getBristolStatus(selectedBristol)
    : undefined;
  const overallStatus = selectedColorId
    ? computeOverallStatus(colorStatus, bristolStatus)
    : null;

  const colorList = type === 'stool' ? STOOL_COLORS : URINE_COLORS;

  const showSavedMessage = useCallback(() => {
    setSavedMsg(true);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setSavedMsg(false));
  }, [fadeAnim]);

  async function pickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission requise', 'Autorisez l\'accès à la galerie dans les paramètres.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      setAnalyzing(true);
      const analysis = await analyzePhotoColor(uri, type);
      setAnalyzing(false);
      if (analysis) {
        setSelectedColorId(analysis.colorId);
      }
    }
  }

  async function handleSave() {
    if (!selectedChildId) return;
    if (!selectedColorId) {
      Alert.alert('Couleur requise', 'Veuillez sélectionner une couleur.');
      return;
    }
    setSaving(true);
    insertObservation({
      childId: selectedChildId,
      type,
      colorId: selectedColorId,
      bristolType: type === 'stool' ? selectedBristol ?? undefined : undefined,
      photoUri: photoUri ?? undefined,
      notes: notes.trim() || undefined,
      status: overallStatus ?? 'ok',
    });
    setSaving(false);
    setSelectedColorId(null);
    setSelectedBristol(null);
    setPhotoUri(null);
    setNotes('');
    showSavedMessage();
  }

  if (children.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState
          icon="👶"
          title="Aucun enfant"
          subtitle="Ajoutez un enfant pour commencer les observations."
          actionLabel="Ajouter un enfant"
          onAction={() => navigation.navigate('Children')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Observer</Text>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Child selector */}
        <View style={styles.childRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.childScroll}>
            <View style={styles.childChips}>
              {children.map((child) => (
                <TouchableOpacity
                  key={child.id}
                  style={[
                    styles.childChip,
                    selectedChildId === child.id && styles.childChipActive,
                  ]}
                  onPress={() => setSelectedChildId(child.id)}
                >
                  <AvatarCircle name={child.name} color={child.avatarColor} size={28} />
                  <Text
                    style={[
                      styles.childChipText,
                      selectedChildId === child.id && styles.childChipTextActive,
                    ]}
                  >
                    {child.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.manageChildrenBtn}
            onPress={() => navigation.navigate('Children')}
          >
            <Text style={styles.manageChildrenText}>Gérer</Text>
          </TouchableOpacity>
        </View>

        {/* Type toggle */}
        <View style={styles.section}>
          <Toggle
            options={[
              { value: 'stool', label: 'Selles' },
              { value: 'urine', label: 'Urines' },
            ]}
            value={type}
            onChange={(v) => {
              setType(v as 'stool' | 'urine');
              setSelectedColorId(null);
              setSelectedBristol(null);
            }}
          />
        </View>

        {/* Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo (optionnel)</Text>
          <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoIcon}>📷</Text>
                <Text style={styles.photoHint}>Ajouter une photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {analyzing && (
            <Text style={styles.analyzingText}>Analyse de la couleur en cours...</Text>
          )}
        </View>

        {/* Color grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Couleur</Text>
          <View style={styles.colorGrid}>
            {colorList.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.colorCell,
                  { backgroundColor: c.hex },
                  c.bordered && styles.colorCellBordered,
                  selectedColorId === c.id && styles.colorCellSelected,
                ]}
                onPress={() => setSelectedColorId(c.id)}
              >
                <Text style={styles.colorLabel} numberOfLines={2}>
                  {c.label}
                </Text>
                {selectedColorId === c.id && <Text style={styles.colorCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bristol (stools only) */}
        {type === 'stool' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Consistance (échelle de Bristol)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.bristolRow}>
                {BRISTOL_SCALE.map((b) => (
                  <TouchableOpacity
                    key={b.type}
                    style={[
                      styles.bristolCard,
                      selectedBristol === b.type && styles.bristolCardSelected,
                    ]}
                    onPress={() => setSelectedBristol(b.type)}
                  >
                    <BristolVisual type={b.type} size={60} />
                    <Text style={styles.bristolType}>Type {b.type}</Text>
                    <Text style={styles.bristolDesc} numberOfLines={2}>
                      {b.description}
                    </Text>
                    <Text
                      style={[
                        styles.bristolDetail,
                        b.status === 'ok' && { color: colors.okT },
                        b.status === 'watch' && { color: colors.waT },
                        b.status === 'alert' && { color: colors.alT },
                      ]}
                    >
                      {b.detail}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Status preview */}
        {overallStatus && (
          <View style={styles.section}>
            <View style={styles.statusPreview}>
              <Text style={styles.statusPreviewLabel}>Statut de l'observation</Text>
              <StatusBadge status={overallStatus} />
              {overallStatus === 'alert' && (
                <View style={styles.alertBanner}>
                  <Text style={styles.alertBannerIcon}>⚠️</Text>
                  <Text style={styles.alertBannerText}>
                    Cette observation mérite une attention médicale. Consultez un professionnel de santé.
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (optionnel)</Text>
          <RNTextInput
            style={styles.textarea}
            value={notes}
            onChangeText={setNotes}
            placeholder="Observations complémentaires..."
            placeholderTextColor={colors.mu}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveBtn, (!selectedColorId || saving) && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!selectedColorId || saving}
        >
          <Text style={styles.saveBtnText}>
            {saving ? 'Enregistrement...' : 'Enregistrer l\'observation'}
          </Text>
        </TouchableOpacity>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Aide au suivi uniquement — pas un outil de diagnostic.
        </Text>
      </ScrollView>

      {/* Saved feedback */}
      {savedMsg && (
        <Animated.View style={[styles.savedToast, { opacity: fadeAnim }]}>
          <Text style={styles.savedToastText}>✓ Observation enregistrée !</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.bdr,
    backgroundColor: colors.bg,
  },
  headerTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 22,
    color: colors.dk,
  },
  settingsBtn: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
  settingsIcon: { fontSize: 22 },
  content: { padding: 16, gap: 4 },
  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  childScroll: { flex: 1 },
  childChips: { flexDirection: 'row', gap: 8, paddingRight: 8 },
  manageChildrenBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.pl,
    minHeight: 44,
    justifyContent: 'center',
    marginLeft: 4,
  },
  manageChildrenText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: colors.primary,
  },
  childChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.sur,
    borderWidth: 1.5,
    borderColor: colors.bdr,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 7,
    minHeight: 44,
  },
  childChipActive: {
    backgroundColor: colors.pl,
    borderColor: colors.primary,
  },
  childChipText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.mu,
  },
  childChipTextActive: { color: colors.primary },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.dk,
    marginBottom: 10,
  },
  photoBox: {
    height: 140,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.bdr,
    borderStyle: 'dashed',
    overflow: 'hidden',
    backgroundColor: colors.sur,
  },
  photo: { width: '100%', height: '100%', resizeMode: 'cover' },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoIcon: { fontSize: 32 },
  photoHint: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
  },
  analyzingText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.primary,
    marginTop: 6,
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorCell: {
    width: '31%',
    aspectRatio: 1.3,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  colorCellBordered: {
    borderWidth: 1.5,
    borderColor: colors.bdr,
  },
  colorCellSelected: {
    borderWidth: 3,
    borderColor: colors.dk,
  },
  colorLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  colorCheck: {
    position: 'absolute',
    top: 4,
    right: 6,
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bristolRow: { flexDirection: 'row', gap: 10, paddingBottom: 4 },
  bristolCard: {
    width: 100,
    backgroundColor: colors.sur,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.bdr,
    gap: 4,
  },
  bristolCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.pl,
  },
  bristolType: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: colors.dk,
  },
  bristolDesc: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 10,
    color: colors.mu,
    textAlign: 'center',
  },
  bristolDetail: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 10,
    textAlign: 'center',
  },
  statusPreview: {
    backgroundColor: colors.sur,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.bdr,
  },
  statusPreviewLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.dk,
  },
  alertBanner: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.alB,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.alBdr,
    alignItems: 'flex-start',
  },
  alertBannerIcon: { fontSize: 18 },
  alertBannerText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.alT,
    flex: 1,
    lineHeight: 19,
  },
  textarea: {
    backgroundColor: colors.sur,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.bdr,
    padding: 14,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: colors.dk,
    minHeight: 90,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginBottom: 16,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#fff',
  },
  disclaimer: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.mu,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  savedToast: {
    position: 'absolute',
    bottom: 100,
    left: 40,
    right: 40,
    backgroundColor: colors.dk,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  savedToastText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#fff',
  },
});
