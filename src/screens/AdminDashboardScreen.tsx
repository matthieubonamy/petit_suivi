import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/tokens';
import { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const SIMULATED_METRICS = {
  totalUsers: 1247,
  activeToday: 83,
  totalObservations: 14892,
  alertsLast7: 23,
};

const SIMULATED_BAR_DATA = [
  { day: 'L', count: 42 },
  { day: 'M', count: 67 },
  { day: 'Me', count: 55 },
  { day: 'J', count: 78 },
  { day: 'V', count: 91 },
  { day: 'S', count: 60 },
  { day: 'D', count: 38 },
  { day: 'L', count: 50 },
  { day: 'M', count: 72 },
  { day: 'Me', count: 63 },
  { day: 'J', count: 84 },
  { day: 'V', count: 95 },
  { day: 'S', count: 71 },
  { day: 'D', count: 44 },
];

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

function MetricCard({ label, value, icon, color }: MetricCardProps) {
  return (
    <View style={[metricStyles.card, color ? { borderLeftColor: color, borderLeftWidth: 4 } : {}]}>
      <Text style={metricStyles.icon}>{icon}</Text>
      <Text style={metricStyles.value}>{value.toLocaleString('fr-FR')}</Text>
      <Text style={metricStyles.label}>{label}</Text>
    </View>
  );
}

const metricStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.sur,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bdr,
    minHeight: 110,
    justifyContent: 'center',
    gap: 4,
  },
  icon: { fontSize: 24, marginBottom: 4 },
  value: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 24,
    color: colors.dk,
  },
  label: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.mu,
    textAlign: 'center',
  },
});

export function AdminDashboardScreen() {
  const navigation = useNavigation<NavProp>();
  const maxCount = Math.max(...SIMULATED_BAR_DATA.map((d) => d.count));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Admin header */}
      <View style={styles.adminHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Quitter</Text>
        </TouchableOpacity>
        <Text style={styles.adminTitle}>Dashboard Admin</Text>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>ADMIN</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Metrics */}
        <Text style={styles.sectionTitle}>Métriques globales</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricsRow}>
            <MetricCard label="Utilisateurs" value={SIMULATED_METRICS.totalUsers} icon="👥" color={colors.primary} />
            <MetricCard label="Actifs aujourd'hui" value={SIMULATED_METRICS.activeToday} icon="✅" color={colors.acc} />
          </View>
          <View style={styles.metricsRow}>
            <MetricCard label="Observations totales" value={SIMULATED_METRICS.totalObservations} icon="📊" color={colors.sec} />
            <MetricCard label="Alertes 7j" value={SIMULATED_METRICS.alertsLast7} icon="⚠️" color={colors.wa} />
          </View>
        </View>

        {/* Bar chart - 14 days */}
        <Text style={styles.sectionTitle}>Activité 14 derniers jours</Text>
        <View style={styles.chartBox}>
          <View style={styles.chartBars}>
            {SIMULATED_BAR_DATA.map((d, i) => (
              <View key={i} style={styles.chartBarGroup}>
                <View style={styles.chartBarWrap}>
                  <View
                    style={[
                      styles.chartBar,
                      { height: `${(d.count / maxCount) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.chartDayLabel}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Navigation */}
        <Text style={styles.sectionTitle}>Gestion</Text>
        <View style={styles.navCard}>
          <TouchableOpacity
            style={styles.navRow}
            onPress={() => navigation.navigate('AdminContent')}
          >
            <Text style={styles.navIcon}>📝</Text>
            <View style={styles.navInfo}>
              <Text style={styles.navLabel}>Gestion du contenu</Text>
              <Text style={styles.navSub}>Alertes, repères médicaux</Text>
            </View>
            <Text style={styles.navChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navRow}
            onPress={() => navigation.navigate('AdminUsers')}
          >
            <Text style={styles.navIcon}>👤</Text>
            <View style={styles.navInfo}>
              <Text style={styles.navLabel}>Gestion des utilisateurs</Text>
              <Text style={styles.navSub}>Comptes, signalements</Text>
            </View>
            <Text style={styles.navChevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.simulatedNote}>
          <Text style={styles.simulatedNoteText}>
            Données simulées à titre de démonstration
          </Text>
        </View>
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
    gap: 12,
  },
  backBtn: { minHeight: 44, justifyContent: 'center' },
  backBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#fff' },
  adminTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 18,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  adminBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  adminBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: '#fff',
    letterSpacing: 1,
  },
  content: { padding: 16, gap: 12, paddingBottom: 40 },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.dk,
    marginTop: 8,
  },
  metricsGrid: { gap: 10 },
  metricsRow: { flexDirection: 'row', gap: 10 },
  chartBox: {
    backgroundColor: colors.sur,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.bdr,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 3,
  },
  chartBarGroup: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  chartBarWrap: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    backgroundColor: colors.primary,
    borderRadius: 3,
    width: '100%',
  },
  chartDayLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 9,
    color: colors.mu,
    marginTop: 4,
  },
  navCard: {
    backgroundColor: colors.sur,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.bdr,
    overflow: 'hidden',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.bdr,
    gap: 12,
    minHeight: 60,
  },
  navIcon: { fontSize: 22 },
  navInfo: { flex: 1 },
  navLabel: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.dk },
  navSub: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: colors.mu },
  navChevron: { fontSize: 22, color: colors.bdr },
  simulatedNote: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  simulatedNoteText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: colors.mu,
    fontStyle: 'italic',
  },
});
