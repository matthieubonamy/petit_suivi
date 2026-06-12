import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { colors } from '../constants/tokens';
import { useChildren } from '../stores/ChildrenContext';
import { AvatarCircle } from '../components/ui/AvatarCircle';
import { getObservationsByChild } from '../services/database';

type Props = StackScreenProps<RootStackParamList, 'Children'>;

function calcAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (months < 1) return 'Nouveau-né';
  if (months < 12) return `${months} mois`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0
    ? `${years} an${years > 1 ? 's' : ''} et ${rem} mois`
    : `${years} an${years > 1 ? 's' : ''}`;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function obsCount(childId: string): number {
  try {
    return getObservationsByChild(childId, 9999, 0).length;
  } catch {
    return 0;
  }
}

export function ChildrenListScreen({ navigation }: Props) {
  const { children, selectedChildId, setSelectedChildId, removeChild } = useChildren();
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleDelete(id: string, name: string) {
    if (Platform.OS === 'web') {
      const ok = window.confirm(
        `Supprimer ${name} et toutes ses observations ? Cette action est irréversible.`
      );
      if (ok) removeChild(id);
    } else {
      Alert.alert(
        'Supprimer l\'enfant',
        `Supprimer ${name} et toutes ses observations ? Cette action est irréversible.`,
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Supprimer', style: 'destructive', onPress: () => removeChild(id) },
        ]
      );
    }
  }

  function handleSelect(id: string) {
    setSelectedChildId(id);
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Mes enfants</Text>
        <Text style={styles.subheading}>
          {children.length === 0
            ? 'Aucun enfant — commencez par en ajouter un'
            : `${children.length} enfant${children.length > 1 ? 's' : ''} suivi${children.length > 1 ? 's' : ''}`}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {children.map((child) => {
          const isActive = child.id === selectedChildId;
          const isOpen = expanded === child.id;
          const count = obsCount(child.id);

          return (
            <TouchableOpacity
              key={child.id}
              style={[styles.card, isActive && styles.cardActive]}
              onPress={() => handleSelect(child.id)}
              activeOpacity={0.85}
            >
              {/* Active badge */}
              {isActive && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Suivi actif</Text>
                </View>
              )}

              {/* Main row */}
              <View style={styles.cardMain}>
                <AvatarCircle name={child.name} color={child.avatarColor} avatarId={child.avatarId} size={60} />

                <View style={styles.cardInfo}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childAge}>{calcAge(child.birthDate)}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>🎂 {formatDate(child.birthDate)}</Text>
                    <Text style={styles.metaDot}>·</Text>
                    <Text style={styles.metaText}>📋 {count} obs.</Text>
                  </View>
                </View>

                <Text style={[styles.chevron, isOpen && styles.chevronOpen]}>›</Text>
              </View>

              {/* Expanded actions */}
              {isOpen && (
                <View style={styles.actions}>
                  <View style={styles.actionsDivider} />
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.btnEdit}
                      onPress={() => navigation.navigate('AddChild', { childId: child.id })}
                    >
                      <Text style={styles.btnEditText}>✏️  Modifier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnDelete}
                      onPress={() => handleDelete(child.id, child.name)}
                    >
                      <Text style={styles.btnDeleteText}>🗑  Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Add card */}
        <TouchableOpacity
          style={styles.addCard}
          onPress={() => navigation.navigate('AddChild', {})}
          activeOpacity={0.8}
        >
          <View style={styles.addIcon}>
            <Text style={styles.addIconText}>+</Text>
          </View>
          <Text style={styles.addLabel}>Ajouter un enfant</Text>
        </TouchableOpacity>

        {/* Tip */}
        {children.length > 0 && (
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              💡 Appuyez sur une carte pour la sélectionner comme enfant actif ou afficher les actions.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backBtn: {
    minHeight: 44,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  backText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.primary,
  },
  heading: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 28,
    color: colors.dk,
    marginBottom: 4,
  },
  subheading: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },

  card: {
    backgroundColor: colors.sur,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.bdr,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  activeBadge: {
    backgroundColor: colors.pl,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.bdr,
  },
  activeBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  childName: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    color: colors.dk,
    marginBottom: 2,
  },
  childAge: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: colors.primary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.mu,
  },
  metaDot: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.bdr,
    marginHorizontal: 6,
  },
  chevron: {
    fontSize: 24,
    color: colors.bdr,
    transform: [{ rotate: '0deg' }],
    fontFamily: 'Nunito_400Regular',
  },
  chevronOpen: {
    transform: [{ rotate: '90deg' }],
    color: colors.primary,
  },

  actions: {},
  actionsDivider: {
    height: 1,
    backgroundColor: colors.bdr,
    marginHorizontal: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    padding: 12,
  },
  btnEdit: {
    flex: 1,
    backgroundColor: colors.pl,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  btnEditText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.primary,
  },
  btnDelete: {
    flex: 1,
    backgroundColor: colors.alB,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  btnDeleteText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.al,
  },

  addCard: {
    borderWidth: 2,
    borderColor: colors.bdr,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  addIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.pl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  addIconText: {
    fontSize: 28,
    color: colors.primary,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 32,
  },
  addLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: colors.primary,
  },

  tip: {
    backgroundColor: colors.pl,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  tipText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.mu,
    lineHeight: 19,
  },
});
