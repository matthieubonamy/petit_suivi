import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/tokens';
import { ALERTS } from '../constants/bristolScale';

const SECTION_CONFIG = {
  selles: { icon: '💩', label: 'Selles' },
  urines: { icon: '💧', label: 'Urines' },
  comportement: { icon: '👶', label: 'Comportement' },
};

export function AlertesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Alertes</Text>
        <Text style={styles.subheading}>Signes nécessitant une consultation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.emergencyBox}>
          <Text style={styles.emergencyIcon}>🚨</Text>
          <View style={styles.emergencyText}>
            <Text style={styles.emergencyTitle}>En cas d'urgence</Text>
            <Text style={styles.emergencyBody}>
              Appelez le 15 (SAMU) ou le 3114 en cas de danger immédiat.
            </Text>
          </View>
        </View>

        {(Object.keys(ALERTS) as Array<keyof typeof ALERTS>).map((key) => (
          <View key={key} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{SECTION_CONFIG[key].icon}</Text>
              <Text style={styles.sectionTitle}>{SECTION_CONFIG[key].label}</Text>
            </View>

            {ALERTS[key].map((alert, i) => (
              <View
                key={i}
                style={[
                  styles.alertRow,
                  alert.level === 'alert' ? styles.alertRowRed : styles.alertRowYellow,
                ]}
              >
                <View
                  style={[
                    styles.alertDot,
                    alert.level === 'alert' ? styles.alertDotRed : styles.alertDotYellow,
                  ]}
                />
                <Text
                  style={[
                    styles.alertText,
                    alert.level === 'alert' ? styles.alertTextRed : styles.alertTextYellow,
                  ]}
                >
                  {alert.text}
                </Text>
                <View style={[
                  styles.alertLevelBadge,
                  alert.level === 'alert' ? styles.alertBadgeRed : styles.alertBadgeYellow,
                ]}>
                  <Text style={[
                    styles.alertLevelText,
                    alert.level === 'alert' ? { color: colors.alT } : { color: colors.waT },
                  ]}>
                    {alert.level === 'alert' ? 'Urgent' : 'Surveiller'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>⚕️ Avertissement</Text>
          <Text style={styles.disclaimerText}>
            Ces informations sont à titre indicatif uniquement et ne remplacent pas l'avis d'un
            professionnel de santé. En cas de doute, consultez votre pédiatre.
          </Text>
        </View>

        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>Contacts utiles</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>SAMU</Text>
            <Text style={styles.contactNumber}>15</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Pompiers</Text>
            <Text style={styles.contactNumber}>18</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Numéro d'urgence européen</Text>
            <Text style={styles.contactNumber}>112</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Médecin de garde</Text>
            <Text style={styles.contactNumber}>3966</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, paddingBottom: 12 },
  heading: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 26,
    color: colors.dk,
  },
  subheading: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
    marginTop: 2,
  },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  emergencyBox: {
    flexDirection: 'row',
    backgroundColor: colors.alB,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.alBdr,
    alignItems: 'center',
  },
  emergencyIcon: { fontSize: 28 },
  emergencyText: { flex: 1 },
  emergencyTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.alT,
    marginBottom: 4,
  },
  emergencyBody: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.alT,
    lineHeight: 19,
  },
  section: {
    backgroundColor: colors.sur,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.bdr,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.bdr,
    backgroundColor: colors.pl,
  },
  sectionIcon: { fontSize: 20 },
  sectionTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 18,
    color: colors.dk,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.bdr,
  },
  alertRowRed: { backgroundColor: '#FEFAFA' },
  alertRowYellow: { backgroundColor: '#FEFDF5' },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  alertDotRed: { backgroundColor: colors.al },
  alertDotYellow: { backgroundColor: colors.wa },
  alertText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  alertTextRed: { color: colors.dk },
  alertTextYellow: { color: colors.dk },
  alertLevelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    flexShrink: 0,
  },
  alertBadgeRed: { backgroundColor: colors.alB },
  alertBadgeYellow: { backgroundColor: colors.waB },
  alertLevelText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
  },
  disclaimer: {
    backgroundColor: colors.pl,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.bdr,
  },
  disclaimerTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.dk,
    marginBottom: 6,
  },
  disclaimerText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.mu,
    lineHeight: 20,
  },
  contactBox: {
    backgroundColor: colors.sur,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.bdr,
    gap: 10,
  },
  contactTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.dk,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.bdr,
  },
  contactLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
  },
  contactNumber: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 18,
    color: colors.primary,
  },
});
