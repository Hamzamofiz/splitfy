import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LedgerStackParamList } from '../../navigation/types';
import { Colors, Card, Font } from '../../theme';

const MONTHS = ['Aug', 'Sep', 'Oct'];
const BAR_DATA = [
  { month: 'Aug', total: 14200, collected: 12000 },
  { month: 'Sep', total: 16800, collected: 15200 },
  { month: 'Oct', total: 18400, collected: 13200 },
];
const MAX_VAL = 20000;

const CATEGORIES = [
  { label: 'Electricity', amount: '4,200', pct: 0.23, color: Colors.teal },
  { label: 'Gas', amount: '1,850', pct: 0.10, color: Colors.copper },
  { label: 'Internet', amount: '2,500', pct: 0.14, color: Colors.purple },
  { label: 'Maintenance', amount: '5,600', pct: 0.30, color: Colors.danger },
  { label: 'Groceries', amount: '4,250', pct: 0.23, color: Colors.success },
];

const KPIS = [
  { label: 'Avg Monthly Expense', value: '₨ 16,467', sub: 'Last 3 months', color: Colors.teal },
  { label: 'Collection Rate', value: '82%', sub: 'Oct 2024', color: Colors.success },
  { label: 'Pending Dues', value: '₨ 5,200', sub: '3 members', color: Colors.copper },
  { label: 'Emergency Fund', value: '₨ 8,000', sub: '80% of target', color: Colors.purple },
];

type Props = NativeStackScreenProps<LedgerStackParamList, 'AdminAnalytics'>;

export default function AdminAnalyticsScreen(_props: Props) {
  const [activeMonth, setActiveMonth] = useState('Oct');

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Month Selector */}
        <View style={styles.monthRow}>
          {MONTHS.map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.monthPill, activeMonth === m && styles.monthPillActive]}
              onPress={() => setActiveMonth(m)}>
              <Text style={[styles.monthPillText, activeMonth === m && styles.monthPillTextActive]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bar Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Expense vs Collection</Text>
          <View style={styles.chartArea}>
            {BAR_DATA.map(d => (
              <View key={d.month} style={styles.barGroup}>
                <View style={styles.bars}>
                  <View style={styles.barWrapper}>
                    <View style={[styles.bar, { height: (d.total / MAX_VAL) * 120, backgroundColor: Colors.teal + 'AA' }]} />
                  </View>
                  <View style={styles.barWrapper}>
                    <View style={[styles.bar, { height: (d.collected / MAX_VAL) * 120, backgroundColor: Colors.success + 'AA' }]} />
                  </View>
                </View>
                <Text style={styles.barLabel}>{d.month}</Text>
              </View>
            ))}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.teal }]} />
              <Text style={styles.legendText}>Total Expense</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.legendText}>Collected</Text>
            </View>
          </View>
        </View>

        {/* KPI Grid */}
        <Text style={styles.sectionTitle}>Fiscal KPIs</Text>
        <View style={styles.kpiGrid}>
          {KPIS.map(k => (
            <View key={k.label} style={[styles.kpiCard, { borderLeftColor: k.color }]}>
              <Text style={[styles.kpiValue, styles.tabular, { color: k.color }]}>{k.value}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
              <Text style={styles.kpiSub}>{k.sub}</Text>
            </View>
          ))}
        </View>

        {/* Expense Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Expense Distribution</Text>
          <Text style={styles.cardSub}>October 2024</Text>
          {CATEGORIES.map(c => (
            <View key={c.label} style={styles.distRow}>
              <View style={styles.distLeft}>
                <View style={[styles.distDot, { backgroundColor: c.color }]} />
                <Text style={styles.distLabel}>{c.label}</Text>
              </View>
              <View style={styles.distRight}>
                <Text style={[styles.distAmount, styles.tabular]}>₨ {c.amount}</Text>
                <View style={styles.distTrack}>
                  <View style={[styles.distFill, { width: `${c.pct * 100}%` as any, backgroundColor: c.color }]} />
                </View>
                <Text style={[styles.distPct, { color: c.color }]}>{Math.round(c.pct * 100)}%</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  monthRow: { flexDirection: 'row', gap: 8 },
  monthPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  monthPillActive: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  monthPillText: { fontSize: 13, fontWeight: '600', color: Colors.textSub },
  monthPillTextActive: { color: '#fff' },
  card: {
    backgroundColor: Card.backgroundColor,
    borderWidth: Card.borderWidth,
    borderColor: Card.borderColor,
    borderRadius: Card.borderRadius,
    padding: Card.padding,
    gap: 12,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.textDark },
  cardSub: { fontSize: 12, color: Colors.textSub, marginTop: -8 },
  chartArea: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 140, paddingBottom: 8 },
  barGroup: { alignItems: 'center', gap: 6 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  barWrapper: { width: 20, height: 120, justifyContent: 'flex-end' },
  bar: { width: 20, borderRadius: 4 },
  barLabel: { fontSize: 11, color: Colors.textSub, fontWeight: '600' },
  legend: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: Colors.textSub },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textDark },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpiCard: {
    width: '47%',
    backgroundColor: Card.backgroundColor,
    borderWidth: Card.borderWidth,
    borderColor: Card.borderColor,
    borderRadius: Card.borderRadius,
    borderLeftWidth: 4,
    padding: 12,
    gap: 4,
  },
  kpiValue: { fontSize: 20, fontWeight: '700', color: Colors.textDark },
  kpiLabel: { fontSize: 11, fontWeight: '600', color: Colors.textDark },
  kpiSub: { fontSize: 10, color: Colors.textSub },
  tabular: { fontFamily: Font.body, fontVariant: ['tabular-nums'] },
  distRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  distLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 100 },
  distDot: { width: 10, height: 10, borderRadius: 5 },
  distLabel: { fontSize: 12, color: Colors.textDark, fontWeight: '500' },
  distRight: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  distAmount: { fontSize: 12, color: Colors.textDark, fontWeight: '600', width: 60 },
  distTrack: { flex: 1, height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden' },
  distFill: { height: 6, borderRadius: 3 },
  distPct: { fontFamily: Font.body, fontSize: 11, fontWeight: '700', width: 30, textAlign: 'right', fontVariant: ['tabular-nums'] },
});
