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
import { useChildren } from '../stores/ChildrenContext';
import { AvatarCircle } from '../components/ui/AvatarCircle';
import { PSLogo } from '../components/ui/PSLogo';
import { RootStackParamList } from '../types';

type NavProp = StackNavigationProp<RootStackParamList>;

interface RowProps {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
  badge?: string;
}

function Row({ icon, label, subtitle, onPress, danger, badge }: RowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
        <Text style={styles.rowIconText}>{icon}</Text>
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : (
        <Text style={styles.chevron}>›</Text>
      )}
    </TouchableOpacity>
  );
}

function calcAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (months < 1) return 'Nouveau-né';
  if (months < 12) return `${months} mois`;
  const years = Math.floor(months / 12);
  return `${years} an${years > 1 ? 's' : ''}`;
}

export function ProfilScreen() {
  const navigation = useNavigation<NavProp>();
  const { user, logout } = useAuth();
  const { children, selectedChildId, setSelectedChildId } = useChildren();

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
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <PSLogo size="sm" showTagline={false} />
          <Text style={styles.heading}>Mon espace</Text>
        </View>

        {/* Enfants */}
        <Text style={styles.section}>Enfants suivis</Text>
        <View style={styles.card}>
          {children.length === 0 ? (
            <TouchableOpacity
              style={styles.emptyChildren}
              onPress={() => navigation.navigate('Children')}
            >
              <Text style={styles.emptyChildrenIcon}>👶</Text>
              <Text style={styles.emptyChildrenText}>Ajouter un premier enfant</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ) : (
            <>
              {children.map((child) => {
                const isActive = child.id === selectedChildId;
                return (
                  <TouchableOpacity
                    key={child.id}
                    style={[styles.childRow, isActive && styles.childRowActive]}
                    onPress={() => setSelectedChildId(child.id)}
                    activeOpacity={0.75}
                  >
                    <AvatarCircle
                      name={child.name}
                      color={child.avatarColor}
                      avatarId={child.avatarId}
                      size={44}
                    />
                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <Text style={styles.childAge}>{calcAge(child.birthDate)}</Text>
                    </View>
                    {isActive && (
                      <View style={styles.activePill}>
                        <Text style={styles.activePillText}>Actif</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
              <Row
                icon="✏️"
                label="Gérer les enfants"
                subtitle="Ajouter, modifier, supprimer"
                onPress={() => navigation.navigate('Children')}
              />
            </>
          )}
        </View>

        {/* Compte */}
        <Text style={styles.section}>Compte</Text>
        <View style={styles.card}>
          {user ? (
            <>
              <View style={styles.accountRow}>
                <View style={styles.accountIcon}>
                  <Text style={{ fontSize: 20 }}>👤</Text>
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountEmail}>{user.email}</Text>
                  <Text style={styles.accountStatus}>Connecté</Text>
                </View>
              </View>
              <Row icon="🚪" label="Se déconnecter" onPress={handleLogout} danger />
            </>
          ) : (
            <>
              <Row
                icon="🔐"
                label="Se connecter"
                subtitle="Synchronisez vos données"
                onPress={() => navigation.navigate('Login')}
              />
              <Row
                icon="✨"
                label="Créer un compte"
                subtitle="Gratuit et confidentiel"
                onPress={() => navigation.navigate('Signup')}
              />
            </>
          )}
        </View>

        {/* Paramètres */}
        <Text style={styles.section}>Paramètres</Text>
        <View style={styles.card}>
          <Row
            icon="🔑"
            label="Clés API"
            subtitle="Analyse IA des photos"
            onPress={() => navigation.navigate('APIKeys')}
          />
        </View>

        {/* Légal */}
        <Text style={styles.section}>Légal</Text>
        <View style={styles.card}>
          <Row
            icon="📄"
            label="Conditions générales"
            onPress={() => navigation.navigate('Legal', { tab: 'cgv' })}
          />
          <Row
            icon="🔒"
            label="Confidentialité"
            onPress={() => navigation.navigate('Legal', { tab: 'rgpd' })}
          />
          <Row
            icon="ℹ️"
            label="Mentions légales"
            onPress={() => navigation.navigate('Legal', { tab: 'mentions' })}
          />
        </View>

        {/* À propos */}
        <View style={styles.about}>
          <Text style={styles.version}>Petit Suivi v1.0.0</Text>
          <Text style={styles.aboutText}>
            Toutes vos données sont stockées localement sur votre appareil.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.adminBtn}
          onPress={() => navigation.navigate('AdminLogin')}
        >
          <Text style={styles.adminText}>Administration</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 48 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 8,
  },
  heading: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 26,
    color: colors.dk,
  },

  section: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: colors.mu,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 6,
    paddingHorizontal: 4,
  },

  card: {
    backgroundColor: colors.sur,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.bdr,
    overflow: 'hidden',
  },

  // Child rows
  emptyChildren: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    minHeight: 56,
    gap: 12,
  },
  emptyChildrenIcon: { fontSize: 24 },
  emptyChildrenText: {
    flex: 1,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: colors.primary,
  },

  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.bdr,
    gap: 12,
  },
  childRowActive: {
    backgroundColor: colors.pl,
  },
  childInfo: { flex: 1 },
  childName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.dk,
  },
  childAge: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.mu,
    marginTop: 1,
  },
  activePill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activePillText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: '#fff',
  },

  // Settings rows
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
  badge: {
    backgroundColor: colors.okB,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: colors.okT,
  },

  // Account
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.bdr,
    gap: 12,
  },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.pl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInfo: { flex: 1 },
  accountEmail: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: colors.dk,
  },
  accountStatus: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.ok,
    marginTop: 2,
  },

  about: {
    marginTop: 24,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  version: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: colors.mu,
    marginBottom: 6,
  },
  aboutText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.bdr,
    textAlign: 'center',
    lineHeight: 18,
  },
  adminBtn: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  adminText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: colors.bdr,
  },
});
