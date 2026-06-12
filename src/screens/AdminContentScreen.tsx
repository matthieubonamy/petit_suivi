import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constants/tokens';
import { ALERTS } from '../constants/bristolScale';

export function AdminContentScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.adminHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.adminTitle}>Gestion du contenu</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Cette interface permet de gérer les alertes et repères médicaux affichés dans l'application.
            Dans cette version démo, le contenu est en lecture seule.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Alertes médicales</Text>

        {(Object.keys(ALERTS) as Array<keyof typeof ALERTS>).map((key) => (
          <View key={key} style={styles.section}>
            <Text style={styles.subTitle}>
              {key === 'selles' ? '💩 Selles' : key === 'urines' ? '💧 Urines' : '👶 Comportement'}
              {' '}({ALERTS[key].length})
            </Text>
            {ALERTS[key].map((alert, i) => (
              <View key={i} style={[styles.alertRow, alert.level === 'alert' ? styles.alertRowRed : styles.alertRowYellow]}>
                <View style={[styles.dot, { backgroundColor: alert.level === 'alert' ? colors.al : colors.wa }]} />
                <Text style={styles.alertText}>{alert.text}</Text>
                <View style={[styles.badge, { backgroundColor: alert.level === 'alert' ? colors.alB : colors.waB }]}>
                  <Text style={[styles.badgeText, { color: alert.level === 'alert' ? colors.alT : colors.waT }]}>
                    {alert.level === 'alert' ? 'Urgent' : 'Surveiller'}
                  </Text>
                </View>
              </View>
            ))}
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
    gap: 12,
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
  content: { padding: 16, gap: 12, paddingBottom: 40 },
  infoBox: {
    backgroundColor: colors.pl,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.bdr,
  },
  infoText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.mu,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    color: colors.dk,
    marginTop: 8,
  },
  section: {
    backgroundColor: colors.sur,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.bdr,
    overflow: 'hidden',
  },
  subTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.dk,
    padding: 14,
    backgroundColor: colors.pl,
    borderBottomWidth: 1,
    borderBottomColor: colors.bdr,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.bdr,
    gap: 10,
  },
  alertRowRed: { backgroundColor: '#FEFAFA' },
  alertRowYellow: { backgroundColor: '#FEFDF5' },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  alertText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.dk,
    flex: 1,
    lineHeight: 19,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { fontFamily: 'Nunito_700Bold', fontSize: 11 },
});
