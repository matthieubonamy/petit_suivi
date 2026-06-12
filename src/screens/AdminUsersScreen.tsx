import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constants/tokens';

const SIMULATED_USERS = [
  { id: '1', email: 'parent1@exemple.fr', children: 2, observations: 145, lastActive: 'Il y a 2h', status: 'active' },
  { id: '2', email: 'parent2@exemple.fr', children: 1, observations: 89, lastActive: 'Il y a 1 jour', status: 'active' },
  { id: '3', email: 'parent3@exemple.fr', children: 3, observations: 312, lastActive: 'Il y a 3 jours', status: 'active' },
  { id: '4', email: 'parent4@exemple.fr', children: 1, observations: 23, lastActive: 'Il y a 2 semaines', status: 'inactive' },
  { id: '5', email: 'parent5@exemple.fr', children: 2, observations: 0, lastActive: 'Jamais', status: 'inactive' },
];

export function AdminUsersScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.adminHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.adminTitle}>Utilisateurs</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{SIMULATED_USERS.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{SIMULATED_USERS.filter(u => u.status === 'active').length}</Text>
            <Text style={styles.statLabel}>Actifs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{SIMULATED_USERS.reduce((a, u) => a + u.observations, 0)}</Text>
            <Text style={styles.statLabel}>Observations</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Données simulées. En production, ces données seraient chargées depuis Supabase.
          </Text>
        </View>

        {SIMULATED_USERS.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={[styles.userAvatar, { backgroundColor: user.status === 'active' ? colors.okB : colors.bdr }]}>
              <Text style={styles.userAvatarText}>{user.email[0].toUpperCase()}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.userMeta}>
                <Text style={styles.userMetaText}>{user.children} enfant{user.children > 1 ? 's' : ''}</Text>
                <Text style={styles.userMetaDot}>·</Text>
                <Text style={styles.userMetaText}>{user.observations} obs.</Text>
                <Text style={styles.userMetaDot}>·</Text>
                <Text style={styles.userMetaText}>{user.lastActive}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, user.status === 'active' ? styles.statusActive : styles.statusInactive]}>
              <Text style={[styles.statusText, user.status === 'active' ? { color: colors.okT } : { color: colors.mu }]}>
                {user.status === 'active' ? 'Actif' : 'Inactif'}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0EBE3' },
  adminHeader: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backBtn: { minHeight: 44, justifyContent: 'center', minWidth: 60 },
  backText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#fff' },
  adminTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 18,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  content: { padding: 16, gap: 10, paddingBottom: 40 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: colors.sur,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bdr,
  },
  statValue: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 22,
    color: colors.dk,
  },
  statLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.mu,
  },
  infoBox: {
    backgroundColor: colors.waB,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.waBdr,
  },
  infoText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.waT,
    fontStyle: 'italic',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sur,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.bdr,
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: colors.dk,
  },
  userInfo: { flex: 1 },
  userEmail: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.dk,
  },
  userMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4, marginTop: 3 },
  userMetaText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: colors.mu,
  },
  userMetaDot: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: colors.bdr,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: { backgroundColor: colors.okB },
  statusInactive: { backgroundColor: colors.bdr },
  statusText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
  },
});
