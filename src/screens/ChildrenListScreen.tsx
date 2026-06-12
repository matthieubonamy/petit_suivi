import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { colors } from '../constants/tokens';
import { useChildren } from '../stores/ChildrenContext';
import { AvatarCircle } from '../components/ui/AvatarCircle';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

type Props = StackScreenProps<RootStackParamList, 'MainTabs'>;

export function ChildrenListScreen({ navigation }: Props) {
  const { children, removeChild } = useChildren();

  function handleDelete(id: string, name: string) {
    Alert.alert(
      'Supprimer l\'enfant',
      `Voulez-vous vraiment supprimer ${name} et toutes ses observations ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => removeChild(id),
        },
      ]
    );
  }

  function getAge(birthDate: string): string {
    const birth = new Date(birthDate);
    const now = new Date();
    const months =
      (now.getFullYear() - birth.getFullYear()) * 12 +
      (now.getMonth() - birth.getMonth());
    if (months < 1) return 'Nouveau-né';
    if (months < 12) return `${months} mois`;
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem > 0 ? `${years} an${years > 1 ? 's' : ''} ${rem} mois` : `${years} an${years > 1 ? 's' : ''}`;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.heading}>Mes enfants</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => (navigation as any).navigate('AddChild', {})}
        >
          <Text style={styles.addBtnText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {children.length === 0 ? (
        <EmptyState
          icon="👶"
          title="Aucun enfant ajouté"
          subtitle="Ajoutez votre premier enfant pour commencer le suivi."
          actionLabel="Ajouter un enfant"
          onAction={() => (navigation as any).navigate('AddChild', {})}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {children.map((child) => (
            <View key={child.id} style={styles.card}>
              <AvatarCircle name={child.name} color={child.avatarColor} size={52} />
              <View style={styles.cardInfo}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childAge}>{getAge(child.birthDate)}</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => (navigation as any).navigate('AddChild', { childId: child.id })}
                >
                  <Text style={styles.editBtnText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(child.id, child.name)}
                >
                  <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <Button
            label="Continuer vers le suivi"
            onPress={() => (navigation as any).replace('MainTabs')}
            fullWidth
            style={styles.continueBtn}
          />
        </ScrollView>
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
    padding: 24,
    paddingBottom: 16,
  },
  heading: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 26,
    color: colors.dk,
  },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minHeight: 44,
    justifyContent: 'center',
  },
  addBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#fff',
  },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: colors.sur,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: colors.bdr,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardInfo: { flex: 1 },
  childName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    color: colors.dk,
  },
  childAge: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.mu,
    marginTop: 2,
  },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.pl,
    minHeight: 44,
    justifyContent: 'center',
  },
  editBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: colors.primary,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.alB,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  deleteBtnText: {
    fontSize: 14,
    color: colors.al,
    fontFamily: 'Nunito_700Bold',
  },
  continueBtn: { marginTop: 16 },
});
