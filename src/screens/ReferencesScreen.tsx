import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/tokens';
import { BRISTOL_SCALE, AGE_FREQUENCIES } from '../constants/bristolScale';
import { STOOL_COLORS, URINE_COLORS } from '../constants/stoolColors';
import { Toggle } from '../components/ui/Toggle';
import { BristolVisual } from '../components/ui/BristolVisual';
import { StatusBadge } from '../components/ui/StatusBadge';

type Tab = 'colors' | 'bristol' | 'frequencies';

export function ReferencesScreen() {
  const [tab, setTab] = useState<Tab>('colors');
  const [colorType, setColorType] = useState<'stool' | 'urine'>('stool');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Repères</Text>
        <Text style={styles.subheading}>Guide de référence médicale</Text>
      </View>

      <View style={styles.tabBar}>
        {(['colors', 'bristol', 'frequencies'] as Tab[]).map((t) => (
          <View
            key={t}
            style={[styles.tabItem, tab === t && styles.tabItemActive]}
          >
            <Text
              style={[styles.tabText, tab === t && styles.tabTextActive]}
              onPress={() => setTab(t)}
            >
              {t === 'colors' ? 'Couleurs' : t === 'bristol' ? 'Bristol' : 'Fréquences'}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'colors' && (
          <>
            <Toggle
              options={[
                { value: 'stool', label: 'Selles' },
                { value: 'urine', label: 'Urines' },
              ]}
              value={colorType}
              onChange={(v) => setColorType(v as 'stool' | 'urine')}
            />
            <View style={styles.colorList}>
              {(colorType === 'stool' ? STOOL_COLORS : URINE_COLORS).map((c) => (
                <View key={c.id} style={styles.colorRow}>
                  <View
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: c.hex },
                      c.bordered && styles.colorSwatchBordered,
                    ]}
                  />
                  <Text style={styles.colorName}>{c.label}</Text>
                  <StatusBadge status={c.status} compact />
                </View>
              ))}
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Interprétation</Text>
              <Text style={styles.infoText}>
                Les couleurs indiquent la santé digestive. Un vert ou orange isolé n'est pas alarmant,
                mais une persistance mérite attention. Rouge, noir ou blanc/gris doivent être consultés.
              </Text>
            </View>
          </>
        )}

        {tab === 'bristol' && (
          <>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Échelle de Bristol</Text>
              <Text style={styles.infoText}>
                L'échelle de Bristol classe les selles en 7 types selon leur forme et consistance.
                Les types 3 et 4 sont considérés idéaux.
              </Text>
            </View>
            {BRISTOL_SCALE.map((b) => (
              <View key={b.type} style={styles.bristolRow}>
                <BristolVisual type={b.type} size={80} />
                <View style={styles.bristolInfo}>
                  <View style={styles.bristolHeader}>
                    <Text style={styles.bristolType}>Type {b.type}</Text>
                    <StatusBadge status={b.status} compact />
                  </View>
                  <Text style={styles.bristolDesc}>{b.description}</Text>
                  <Text style={[
                    styles.bristolDetail,
                    b.status === 'ok' && { color: colors.okT },
                    b.status === 'watch' && { color: colors.waT },
                    b.status === 'alert' && { color: colors.alT },
                  ]}>
                    {b.detail}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {tab === 'frequencies' && (
          <>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Fréquences normales</Text>
              <Text style={styles.infoText}>
                Les fréquences varient beaucoup selon l'âge, l'alimentation et l'enfant.
                Ces valeurs sont indicatives.
              </Text>
            </View>
            {AGE_FREQUENCIES.map((f) => (
              <View key={f.age} style={styles.freqCard}>
                <View style={styles.freqHeader}>
                  <Text style={styles.freqAge}>{f.age}</Text>
                </View>
                <View style={styles.freqBody}>
                  <View style={styles.freqRow}>
                    <Text style={styles.freqLabel}>Selles</Text>
                    <Text style={styles.freqValue}>{f.stool}</Text>
                  </View>
                  <View style={styles.freqDivider} />
                  <View style={styles.freqRow}>
                    <Text style={styles.freqLabel}>Urines</Text>
                    <Text style={styles.freqValue}>{f.urine}</Text>
                  </View>
                  {f.note ? (
                    <>
                      <View style={styles.freqDivider} />
                      <Text style={styles.freqNote}>ℹ️ {f.note}</Text>
                    </>
                  ) : null}
                </View>
              </View>
            ))}
          </>
        )}
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
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 4,
    marginBottom: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.sur,
    borderWidth: 1,
    borderColor: colors.bdr,
  },
  tabItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: colors.mu,
  },
  tabTextActive: { color: '#fff' },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  colorList: { gap: 8, marginTop: 16 },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sur,
    borderRadius: 10,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.bdr,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorSwatchBordered: {
    borderWidth: 1.5,
    borderColor: colors.bdr,
  },
  colorName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.dk,
    flex: 1,
  },
  infoBox: {
    backgroundColor: colors.pl,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.bdr,
  },
  infoTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.dk,
    marginBottom: 6,
  },
  infoText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
    lineHeight: 21,
  },
  bristolRow: {
    flexDirection: 'row',
    backgroundColor: colors.sur,
    borderRadius: 14,
    padding: 16,
    gap: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bdr,
  },
  bristolInfo: { flex: 1, gap: 4 },
  bristolHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  bristolType: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: colors.dk,
  },
  bristolDesc: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
  },
  bristolDetail: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
  },
  freqCard: {
    backgroundColor: colors.sur,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.bdr,
  },
  freqHeader: {
    backgroundColor: colors.pl,
    padding: 12,
  },
  freqAge: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 17,
    color: colors.dk,
  },
  freqBody: { padding: 14, gap: 6 },
  freqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  freqLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
  },
  freqValue: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.dk,
  },
  freqDivider: {
    height: 1,
    backgroundColor: colors.bdr,
    marginVertical: 4,
  },
  freqNote: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.mu,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
