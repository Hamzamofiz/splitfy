import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme';

const RESIDENTS = [
  { id: '1', name: 'Ali Khan', bed: 'Bed A', role: 'Host / Rep', days: 30, note: 'Present all month • Suite representative', factor: 1.00, amount: 80.00, delta: 0 },
  { id: '2', name: 'Hamza Tariq', bed: 'Bed B', role: 'Resident', days: 28, note: 'Weekend hackathon away in Lahore', factor: 0.93, amount: 74.67, delta: -5.33 },
  { id: '3', name: 'Daniyal Ahmed', bed: 'Bed C', role: 'Half-Term Away', days: 15, note: 'Semester Break / Visited Home', factor: 0.50, amount: 40.00, delta: -40.00 },
  { id: '4', name: 'Zain Malik', bed: 'Bed D', role: 'Resident', days: 30, note: 'Full residency • Lab duties', factor: 1.00, amount: 80.00, delta: 0 },
  { id: '5', name: 'Bilal Raza', bed: 'Bed E', role: 'Resident', days: 25, note: 'Family wedding in Faisalabad', factor: 0.83, amount: 66.67, delta: -13.33 },
  { id: '6', name: 'Usman Sheikh', bed: 'Bed F', role: 'Resident', days: 30, note: 'Full residency • Midterm prep', factor: 1.00, amount: 80.00, delta: 0 },
];

export default function HostelAttendanceScreen() {
  const [residents, setResidents] = useState(RESIDENTS);
  const [threshold, setThreshold] = useState(5);

  const updateDays = (id: string, deltaDays: number) => {
    setResidents(prev => prev.map(r => {
      if (r.id !== id) return r;
      const days = Math.max(0, Math.min(30, r.days + deltaDays));
      const factor = days / 30;
      const amount = Math.round(80 * factor * 100) / 100;
      const diff = Math.round((amount - 80) * 100) / 100;
      return { ...r, days, factor, amount, delta: diff };
    }));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.brand}>Splitfy <Text style={styles.pkr}>PKR</Text></Text>
              <Text style={styles.subtitle}>Hostel Suite · Rm 402</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.bell}>🔔</Text>
              <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
            </View>
          </View>
          <View style={styles.dateRow}>
            <View style={styles.dateBadge}><Text style={styles.dateBadgeText}>Oct 01 – Oct 31 (30 Days)</Text></View>
            <View style={styles.ledgerTag}><Text style={styles.ledgerTagText}>PKR LEDGER</Text></View>
          </View>
        </View>

        <Text style={styles.screenTitle}>Hostel Attendance & Proration</Text>
        <Text style={styles.screenSub}>Configure 0–30 days physical presence to dynamically rebalance variable utility and meal consumption ledgers.</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Residents</Text>
            <Text style={styles.summaryValue}>6 / 6 Beds Active</Text>
            <Text style={styles.summaryMeta}>100% Suite Capacity</Text>
            <View style={styles.dotRow}><View style={styles.activeDot} /><Text style={styles.activeText}>Active</Text></View>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Billed Days</Text>
            <Text style={styles.summaryValue}>158 / 180 Max</Text>
            <Text style={styles.summaryMeta}>87.8%</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>On Track</Text></View>
          </View>
        </View>
        <View style={styles.auditBanner}>
          <Text style={styles.auditText}>✓ Audit Ready & Balanced</Text>
          <View style={styles.syncedBadge}><Text style={styles.syncedText}>Synced v4.2</Text></View>
        </View>

        <View style={styles.matrixHeader}>
          <Text style={styles.matrixTitle}>Suite 402 Matrix</Text>
          <TouchableOpacity style={styles.setAllBtn}><Text style={styles.setAllBtnText}>Set All 30d</Text></TouchableOpacity>
        </View>
        <Text style={styles.matrixSub}>Shared Variable Pool: Rs 480.00  •  Baseline: Rs 80.00 / bed</Text>

        {residents.map(r => (
          <View key={r.id} style={styles.residentCard}>
            <View style={styles.residentHeader}>
              <View>
                <Text style={styles.residentName}>{r.name} <Text style={styles.bedTag}>({r.bed})</Text></Text>
                <Text style={styles.residentRole}>{r.role}</Text>
              </View>
              <View style={styles.residentAmountCol}>
                <Text style={styles.residentAmount}>Rs {r.amount.toFixed(2)}</Text>
                <Text style={[styles.residentFactor, r.delta < 0 && { color: Colors.copper }]}>
                  {r.factor.toFixed(2)}x {r.delta < 0 ? `(${r.delta.toFixed(2)})` : '(1.00x)'}
                </Text>
              </View>
            </View>
            <View style={styles.sliderRow}>
              <TouchableOpacity style={styles.sliderBtn} onPress={() => updateDays(r.id, -1)}><Text style={styles.sliderBtnText}>-</Text></TouchableOpacity>
              <View style={styles.daysInfo}>
                <Text style={styles.daysText}>{r.days} / 30 Days {r.days === 30 ? '(Full Month)' : `(${30 - r.days} Days Away)`}</Text>
              </View>
              <TouchableOpacity style={styles.sliderBtn} onPress={() => updateDays(r.id, 1)}><Text style={styles.sliderBtnText}>+</Text></TouchableOpacity>
            </View>
            <Text style={styles.residentNote}>{r.note}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Variable Pool & Proration Rules</Text>
        <View style={styles.poolCard}>
          <Text style={styles.poolLabel}>Allocated Variable Total</Text>
          <Text style={styles.poolValue}>Rs 421.33</Text>
          <Text style={styles.poolRebate}>Rs 58.67 Rebate from Rs 480 pool</Text>
        </View>

        <View style={styles.rulesCard}>
          <View style={styles.rulesHeader}>
            <Text style={styles.rulesTitle}>Proration Rules for Absent Days</Text>
            <View style={styles.agreedBadge}><Text style={styles.agreedText}>Suite Agreed</Text></View>
          </View>
          <View style={styles.ruleRow}>
            <View style={styles.checkbox}><Text style={styles.check}>✓</Text></View>
            <Text style={styles.ruleText}>Exempt Fixed Expenses (Internet 100Mbps and Water Tanker flat fee remain non-prorated)</Text>
          </View>
          <View style={styles.ruleRow}>
            <View style={styles.checkbox}><Text style={styles.check}>✓</Text></View>
            <Text style={styles.ruleText}>Variable Resource Billing (Apply occupancy proration strictly to metered Electricity, Sui Gas, and Shared Meals)</Text>
          </View>
        </View>

        <View style={styles.thresholdCard}>
          <Text style={styles.thresholdLabel}>Min days away to activate proration</Text>
          <View style={styles.thresholdRow}>
            <TouchableOpacity style={styles.thresholdBtn} onPress={() => setThreshold(Math.max(0, threshold - 1))}><Text style={styles.thresholdBtnText}>-</Text></TouchableOpacity>
            <Text style={styles.thresholdValue}>{threshold} Days</Text>
            <TouchableOpacity style={styles.thresholdBtn} onPress={() => setThreshold(Math.min(10, threshold + 1))}><Text style={styles.thresholdBtnText}>+</Text></TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Live Ledger Redistribution</Text>
        <View style={styles.ledgerCard}>
          <View style={styles.ledgerHeader}>
            <Text style={styles.ledgerTitle}>Distribution Ratio</Text>
            <View style={styles.balancedBadge}><Text style={styles.balancedText}>100% Balanced</Text></View>
          </View>
          <View style={styles.barContainer}><View style={[styles.barFill, { width: '88%' }]} /><View style={[styles.barRebate, { width: '12%' }]} /></View>
          <Text style={styles.barLabels}>Active Variable: 88%  |  Rebate Pool: 12%</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}><Text style={styles.metricLabel}>Fixed Base</Text><Text style={styles.metricValue}>Rs 1,200.00</Text></View>
            <View style={styles.metricBox}><Text style={styles.metricLabel}>Variable</Text><Text style={styles.metricValue}>Rs 421.33</Text></View>
            <View style={styles.metricBox}><Text style={styles.metricLabel}>Rebate Pool</Text><Text style={[styles.metricValue, { color: Colors.copper }]}>Rs 58.67</Text></View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.exportBtn}><Text style={styles.exportBtnText}>📥 Export Log</Text></TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn}><Text style={styles.saveBtnText}>🔄 Save & Recalculate</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 90 },
  headerCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 12, gap: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: 14, fontWeight: '800', color: Colors.teal },
  pkr: { backgroundColor: Colors.tealLight, color: Colors.teal, paddingHorizontal: 4, borderRadius: 4 },
  subtitle: { fontSize: 10, color: Colors.textSub },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bell: { fontSize: 16 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontWeight: '700' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateBadge: { backgroundColor: Colors.canvas, borderWidth: 1, borderColor: Colors.border, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  dateBadgeText: { fontSize: 10, color: Colors.textSub, fontVariant: ['tabular-nums'] as any },
  ledgerTag: { backgroundColor: Colors.teal, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  ledgerTagText: { fontSize: 8, color: '#FFFFFF', fontWeight: '700' },
  screenTitle: { fontSize: 18, fontWeight: '800', color: Colors.textDark },
  screenSub: { fontSize: 11, color: Colors.textSub, marginTop: -6 },
  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: { flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 10, gap: 2 },
  summaryLabel: { fontSize: 10, color: Colors.textSub },
  summaryValue: { fontSize: 13, fontWeight: '800', color: Colors.textDark },
  summaryMeta: { fontSize: 9, color: Colors.textSub },
  dotRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.teal },
  activeText: { fontSize: 9, color: Colors.teal },
  badge: { alignSelf: 'flex-start', backgroundColor: Colors.tealLight, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: 8, color: Colors.teal },
  auditBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: Colors.teal, borderRadius: 12, padding: 10 },
  auditText: { fontSize: 12, fontWeight: '700', color: Colors.teal },
  syncedBadge: { backgroundColor: Colors.teal, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  syncedText: { fontSize: 8, color: '#FFFFFF' },
  matrixHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matrixTitle: { fontSize: 14, fontWeight: '800', color: Colors.textDark },
  setAllBtn: { backgroundColor: Colors.tealLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  setAllBtnText: { fontSize: 10, fontWeight: '700', color: Colors.teal },
  matrixSub: { fontSize: 10, color: Colors.textSub, marginTop: -4 },
  residentCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 12, gap: 8 },
  residentHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  residentName: { fontSize: 13, fontWeight: '700', color: Colors.textDark },
  bedTag: { color: Colors.textSub },
  residentRole: { fontSize: 10, color: Colors.textSub },
  residentAmountCol: { alignItems: 'flex-end' },
  residentAmount: { fontSize: 14, fontWeight: '800', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  residentFactor: { fontSize: 10, color: Colors.teal, fontVariant: ['tabular-nums'] as any },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sliderBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  sliderBtnText: { color: '#FFFFFF', fontWeight: '700' },
  daysInfo: { flex: 1, backgroundColor: Colors.canvas, borderRadius: 10, paddingVertical: 6, alignItems: 'center' },
  daysText: { fontSize: 11, fontWeight: '600', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  residentNote: { fontSize: 9, color: Colors.textSub },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: Colors.textDark },
  poolCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 12, alignItems: 'center', gap: 2 },
  poolLabel: { fontSize: 10, color: Colors.textSub },
  poolValue: { fontSize: 24, fontWeight: '800', color: Colors.teal, fontVariant: ['tabular-nums'] as any },
  poolRebate: { fontSize: 10, color: Colors.textSub },
  rulesCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 12, gap: 10 },
  rulesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rulesTitle: { fontSize: 12, fontWeight: '700', color: Colors.textDark },
  agreedBadge: { backgroundColor: Colors.tealLight, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  agreedText: { fontSize: 8, color: Colors.teal, fontWeight: '700' },
  ruleRow: { flexDirection: 'row', gap: 8 },
  checkbox: { width: 16, height: 16, borderRadius: 4, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  check: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  ruleText: { flex: 1, fontSize: 10, color: Colors.textSub, lineHeight: 16 },
  thresholdCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  thresholdLabel: { fontSize: 11, color: Colors.textDark },
  thresholdRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  thresholdBtn: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  thresholdBtnText: { color: '#FFFFFF', fontWeight: '700' },
  thresholdValue: { fontSize: 12, fontWeight: '700', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  ledgerCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 12, gap: 10 },
  ledgerHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  ledgerTitle: { fontSize: 12, fontWeight: '700', color: Colors.textDark },
  balancedBadge: { backgroundColor: Colors.tealLight, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  balancedText: { fontSize: 8, color: Colors.teal, fontWeight: '700' },
  barContainer: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { backgroundColor: Colors.teal },
  barRebate: { backgroundColor: Colors.copper },
  barLabels: { fontSize: 9, color: Colors.textSub },
  metricsGrid: { flexDirection: 'row', gap: 8 },
  metricBox: { flex: 1, backgroundColor: Colors.canvas, borderRadius: 10, padding: 8, alignItems: 'center' },
  metricLabel: { fontSize: 9, color: Colors.textSub },
  metricValue: { fontSize: 12, fontWeight: '700', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  footer: { flexDirection: 'row', gap: 10, padding: 12, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border },
  exportBtn: { flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, alignItems: 'center', paddingVertical: 10 },
  exportBtnText: { fontSize: 12, fontWeight: '600', color: Colors.textDark },
  saveBtn: { flex: 1, backgroundColor: Colors.teal, borderRadius: 10, alignItems: 'center', paddingVertical: 10 },
  saveBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
});
