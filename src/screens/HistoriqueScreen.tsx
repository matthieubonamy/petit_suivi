import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../constants/tokens';
import { STOOL_COLORS, URINE_COLORS } from '../constants/stoolColors';
import { useChildren } from '../stores/ChildrenContext';
import {
  getObservationsByChild,
  getObservationCountByDay,
  deleteObservation,
} from '../services/database';
import { Observation } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AvatarCircle } from '../components/ui/AvatarCircle';
import { EmptyState } from '../components/ui/EmptyState';

type Period = 'today' | '7days' | '30days';

const PERIOD_LABELS: Record<Period, string> = {
  today: "Aujourd'hui",
  '7days': '7 jours',
  '30days': '30 jours',
};

function getColorHex(colorId: string, type: 'stool' | 'urine'): string {
  const list = type === 'stool' ? STOOL_COLORS : URINE_COLORS;
  return list.find((c) => c.id === colorId)?.hex ?? '#ccc';
}

function getColorLabel(colorId: string, type: 'stool' | 'urine'): string {
  const list = type === 'stool' ? STOOL_COLORS : URINE_COLORS;
  return list.find((c) => c.id === colorId)?.label ?? colorId;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function BarChart({ data }: { data: Record<string, { stool: number; urine: number }> }) {
  const days = Object.keys(data).sort();
  const maxVal = Math.max(1, ...days.map((d) => (data[d].stool || 0) + (data[d].urine || 0)));

  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.bars}>
        {days.map((day) => {
          const stool = data[day]?.stool ?? 0;
          const urine = data[day]?.urine ?? 0;
          const total = stool + urine;
          const heightFactor = total / maxVal;

          return (
            <View key={day} style={chartStyles.barGroup}>
              <View style={chartStyles.bar}>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                  {(stool + urine) > 0 ? (
                    <View style={[chartStyles.barFill, { height: `${heightFactor * 100}%` }]}>
                      <View style={[chartStyles.barStool, { flex: stool }]} />
                      <View style={[chartStyles.barUrine, { flex: urine }]} />
                    </View>
                  ) : null}
                </View>
              </View>
              <Text style={chartStyles.dayLabel}>
                {new Date(day).toLocaleDateString('fr-FR', { weekday: 'narrow' })}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={chartStyles.legend}>
        <View style={chartStyles.legendItem}>
          <View style={[chartStyles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={chartStyles.legendLabel}>Selles</Text>
        </View>
        <View style={chartStyles.legendItem}>
          <View style={[chartStyles.legendDot, { backgroundColor: colors.sec }]} />
          <Text style={chartStyles.legendLabel}>Urines</Text>
        </View>
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.sur,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.bdr,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 4,
    marginBottom: 8,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  bar: {
    flex: 1,
    width: '80%',
    justifyContent: 'flex-end',
  },
  barFill: {
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  barStool: { backgroundColor: colors.primary },
  barUrine: { backgroundColor: colors.sec },
  dayLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 10,
    color: colors.mu,
    marginTop: 4,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    marginTop: 4,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.mu,
  },
});

export function HistoriqueScreen() {
  const { children, selectedChildId, setSelectedChildId } = useChildren();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<Period>('7days');
  const [observations, setObservations] = useState<Observation[]>([]);
  const [chartData, setChartData] = useState<Record<string, { stool: number; urine: number }>>({});

  const loadData = useCallback(() => {
    if (!selectedChildId) return;
    const obs = getObservationsByChild(selectedChildId, 200);

    const now = new Date();
    let filtered = obs;
    if (period === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      filtered = obs.filter((o) => o.createdAt.startsWith(todayStr));
    } else if (period === '7days') {
      const cutoff = new Date(now);
      cutoff.setDate(now.getDate() - 7);
      filtered = obs.filter((o) => new Date(o.createdAt) >= cutoff);
    } else {
      const cutoff = new Date(now);
      cutoff.setDate(now.getDate() - 30);
      filtered = obs.filter((o) => new Date(o.createdAt) >= cutoff);
    }
    setObservations(filtered);

    const data = getObservationCountByDay(selectedChildId, 7);
    setChartData(data);
  }, [selectedChildId, period]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));
  useEffect(() => { loadData(); }, [loadData]);

  function handleDelete(id: string) {
    Alert.alert('Supprimer', 'Voulez-vous supprimer cette observation ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          deleteObservation(id);
          loadData();
        },
      },
    ]);
  }

  const selectedChild = children.find((c) => c.id === selectedChildId);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Historique</Text>
      </View>

      {children.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.childScroll}>
          <View style={styles.childChips}>
            {children.map((child) => (
              <TouchableOpacity
                key={child.id}
                style={[styles.childChip, selectedChildId === child.id && styles.childChipActive]}
                onPress={() => setSelectedChildId(child.id)}
              >
                <AvatarCircle name={child.name} color={child.avatarColor} size={24} />
                <Text style={[styles.childChipText, selectedChildId === child.id && styles.childChipTextActive]}>
                  {child.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {!selectedChildId ? (
        <EmptyState icon="📋" title="Aucun enfant sélectionné" subtitle="Ajoutez un enfant pour voir l'historique." />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7 derniers jours</Text>
            <BarChart data={chartData} />
          </View>

          {/* Period filter */}
          <View style={styles.periodRow}>
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.periodBtn, period === p && styles.periodBtnActive]}
                onPress={() => setPeriod(p)}
              >
                <Text style={[styles.periodBtnText, period === p && styles.periodBtnTextActive]}>
                  {PERIOD_LABELS[p]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Observations list */}
          {observations.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>Aucune observation pour cette période.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.countText}>
                {observations.length} observation{observations.length > 1 ? 's' : ''}
              </Text>
              {observations.map((obs) => (
                <View key={obs.id} style={styles.obsCard}>
                  <View style={styles.obsLeft}>
                    <View
                      style={[
                        styles.obsColorDot,
                        {
                          backgroundColor: getColorHex(obs.colorId, obs.type),
                          borderColor: colors.bdr,
                        },
                      ]}
                    />
                    <View style={styles.obsInfo}>
                      <View style={styles.obsTopRow}>
                        <Text style={styles.obsType}>
                          {obs.type === 'stool' ? '💩 Selles' : '💧 Urines'}
                        </Text>
                        <StatusBadge status={obs.status} compact />
                      </View>
                      <Text style={styles.obsColor}>
                        {getColorLabel(obs.colorId, obs.type)}
                        {obs.bristolType ? ` · Bristol ${obs.bristolType}` : ''}
                      </Text>
                      <Text style={styles.obsDate}>{formatDate(obs.createdAt)}</Text>
                      {obs.notes && <Text style={styles.obsNotes} numberOfLines={2}>{obs.notes}</Text>}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(obs.id)}
                  >
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, paddingBottom: 8 },
  heading: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 26,
    color: colors.dk,
  },
  childScroll: { paddingHorizontal: 16, marginBottom: 8 },
  childChips: { flexDirection: 'row', gap: 8, paddingBottom: 8 },
  childChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.sur,
    borderWidth: 1.5,
    borderColor: colors.bdr,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 44,
  },
  childChipActive: { backgroundColor: colors.pl, borderColor: colors.primary },
  childChipText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: colors.mu },
  childChipTextActive: { color: colors.primary },
  content: { padding: 16, gap: 12 },
  section: { gap: 8 },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.dk,
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.sur,
    borderWidth: 1,
    borderColor: colors.bdr,
    minHeight: 44,
    justifyContent: 'center',
  },
  periodBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  periodBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: colors.mu },
  periodBtnTextActive: { color: '#fff' },
  emptyList: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
    fontStyle: 'italic',
  },
  countText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.mu,
  },
  obsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sur,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.bdr,
    gap: 12,
  },
  obsLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  obsColorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    flexShrink: 0,
    marginTop: 2,
  },
  obsInfo: { flex: 1, gap: 3 },
  obsTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  obsType: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: colors.dk },
  obsColor: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: colors.mu },
  obsDate: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: colors.mu },
  obsNotes: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: colors.mu,
    fontStyle: 'italic',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.alB,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  deleteBtnText: {
    fontSize: 12,
    color: colors.al,
    fontFamily: 'Nunito_700Bold',
  },
});
