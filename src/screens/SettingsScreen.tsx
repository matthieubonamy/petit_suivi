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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../constants/tokens';
import { useAuth } from '../stores/AuthContext';
import { RootStackParamList } from '../types';
import { PSLogo } from '../components/ui/PSLogo';

type NavProp = StackNavigationProp<RootStackParamList>;

interface SettingsRowProps {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
  chevron?: boolean;
}

function SettingsRow({ icon, label, subtitle, onPress, danger, chevron = true }: SettingsRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
        <Text style={styles.rowIconText}>{icon}</Text>
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
        {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>
      {chevron && <Text style={styles.chevron}>›</Text>}
    </TouchableOpacity>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<NavProp>();
  const { user, logout } = useAuth();

  async function handleLogout() {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnecter',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.navigate('Login');
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Paramètres</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account section */}
        <Text style={styles.sectionLabel}>Compte</Text>
        <View style={styles.card}>
          {user ? (
            <>
              <View style={styles.accountRow}>
                <Text style={styles.accountEmail}>{user.email}</Text>
                <View style={styles.accountBadge}>
                  <Text style={styles.accountBadgeText}>Connecté</Text>
                </View>
              </View>
              <SettingsRow
                icon="🚪"
                label="Se déconnecter"
                onPress={handleLogout}
                danger
              />
            </>
          ) : (
            <>
              <SettingsRow
                icon="🔐"
                label="Se connecter"
                subtitle="Synchronisez vos données"
                onPress={() => navigation.navigate('Login')}
              />
              <SettingsRow
                icon="✨"
                label="Créer un compte"
                onPress={() => navigation.navigate('Signup')}
              />
            </>
          )}
        </View>

        {/* Children section */}
        <Text style={styles.sectionLabel}>Enfants</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="👶"
            label="Gérer les enfants"
            subtitle="Ajouter, modifier ou supprimer"
            onPress={() => navigation.navigate('Children')}
          />
        </View>

        {/* Data section */}
        <Text style={styles.sectionLabel}>Données</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="🔑"
            label="Clés API"
            subtitle="Gérer les clés d'analyse IA"
            onPress={() => navigation.navigate('APIKeys')}
          />
        </View>

        {/* Legal section */}
        <Text style={styles.sectionLabel}>Légal</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="📄"
            label="Conditions générales"
            onPress={() => navigation.navigate('Legal', { tab: 'cgv' })}
          />
          <SettingsRow
            icon="🔒"
            label="Politique de confidentialité"
            onPress={() => navigation.navigate('Legal', { tab: 'rgpd' })}
          />
          <SettingsRow
            icon="ℹ️"
            label="Mentions légales"
            onPress={() => navigation.navigate('Legal', { tab: 'mentions' })}
          />
        </View>

        {/* About section */}
        <Text style={styles.sectionLabel}>À propos</Text>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <PSLogo size="sm" />
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
          <Text style={styles.aboutText}>
            Petit Suivi aide les parents à suivre la santé digestive de leurs nourrissons.
            Toutes les données sont stockées localement sur votre appareil.
          </Text>
        </View>

        {/* Admin (hidden) */}
        <TouchableOpacity
          style={styles.adminBtn}
          onPress={() => navigation.navigate('AdminLogin')}
        >
          <Text style={styles.adminBtnText}>Administration</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, paddingBottom: 8 },
  backBtn: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', marginBottom: 4 },
  backText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.primary },
  heading: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 26,
    color: colors.dk,
  },
  content: { padding: 16, gap: 8, paddingBottom: 48 },
  sectionLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: colors.mu,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: colors.sur,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.bdr,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.bdr,
    gap: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: colors.pl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconDanger: { backgroundColor: colors.alB },
  rowIconText: { fontSize: 18 },
  rowContent: { flex: 1 },
  rowLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.dk,
  },
  rowLabelDanger: { color: colors.al },
  rowSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.mu,
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: colors.bdr,
    fontFamily: 'Nunito_400Regular',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.bdr,
  },
  accountEmail: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
    flex: 1,
  },
  accountBadge: {
    backgroundColor: colors.okB,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  accountBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: colors.okT,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.bdr,
  },
  versionText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.mu,
  },
  aboutText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.mu,
    padding: 14,
    lineHeight: 20,
  },
  adminBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  adminBtnText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.bdr,
  },
});
