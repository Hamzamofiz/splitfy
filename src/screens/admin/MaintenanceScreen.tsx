import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme';

const RESIDENTS = [
  { name: 'Ali Khan', room: '402-A', type: 'Master Ensuite', amount: 'Rs 23.33' },
  { name: 'Hamza Tariq', room: '402-B', type: 'Master Ensuite', amount: 'Rs 23.33' },
  { name: 'Daniyal Ahmed', room: '402-C', type: 'Master Ensuite', amount: 'Rs 23.33' },
  { name: 'Zain Malik', room: '402-D', type: 'Common Bath', amount: 'Rs 23.33' },
  { name: 'Bilal Raza', room: '402-E', type: 'Common Bath', amount: 'Rs 23.33' },
  { name: 'Usman Sheikh', room: '402-F', type: 'Common Bath', amount: 'Rs 23.33' },
];

export default function MaintenanceScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.brand}>Splitfy <Text style={styles.pkr}>PKR</Text> <Text style={styles.tag}>ROOMMATES</Text></Text>
              <Text style={styles.subtitle}>Hostel Suite / Room 402</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.bell}>🔔</Text>
              <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
            </View>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.codeBadge}><Text style={styles.codeBadgeText}>#SPL-2024-1049</Text></View>
            <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>Admin Mode</Text></View>
          </View>
        </View>

        <Text style={styles.screenTitle}>Maintenance Allocator</Text>
        <Text style={styles.screenSub}>Log room repairs, electrician visits, or hardware purchases and partition shares.</Text>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Monthly Cap</Text>
            <Text style={styles.metricValue}>Rs 350.00</Text>
            <Text style={styles.metricMeta}>Used: Rs 140 (40%) • Rs 210 left</Text>
            <View style={styles.progressBar}><View style={[styles.progressFill, { width: '40%' }]} /></View>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Impact Pool</Text>
            <Text style={styles.metricValue}>6 Roommates</Text>
            <Text style={styles.metricMeta}>Active Room 402 Cohort</Text>
            <View style={styles.avatarRow}>
              <View style={[styles.miniAvatar, { marginLeft: 0 }]}><Text style={styles.miniAvatarText}>AK</Text></View>
              <View style={[styles.miniAvatar, { marginLeft: -8 }]}><Text style={styles.miniAvatarText}>HT</Text></View>
              <View style={[styles.miniAvatar, { marginLeft: -8 }]}><Text style={styles.miniAvatarText}>DA</Text></View>
              <View style={[styles.miniAvatar, { marginLeft: -8 }]}><Text style={styles.miniAvatarText}>+3</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.workCard}>
          <View style={styles.workHeader}>
            <Text style={styles.workTitle}>Work Order & Details</Text>
            <View style={styles.reqBadge}><Text style={styles.reqBadgeText}>Req #449</Text></View>
          </View>
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.catRow}>
            <View style={[styles.catPill, styles.catPillActive]}><Text style={styles.catPillTextActive}>Electrician</Text></View>
            <View style={styles.catPill}><Text style={styles.catPillText}>Plumbing</Text></View>
            <View style={styles.catPill}><Text style={styles.catPillText}>AC Service</Text></View>
          </View>
          <Text style={styles.sectionLabel}>Work Description</Text>
          <View style={styles.descBox}><Text style={styles.descText}>Geyser Heating Element Replacement & Master Bath Valve</Text></View>
          <Text style={styles.sectionLabel}>Vendor/Contractor</Text>
          <View style={styles.vendorRow}>
            <View>
              <Text style={styles.vendorName}>Bashir Electric & Sanitary</Text>
              <Text style={styles.vendorPhone}>+92 300 5550192</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}><Text style={styles.callBtnText}>Call</Text></TouchableOpacity>
          </View>
          <View style={styles.badgeGrid}>
            <View style={styles.infoBadge}><Text style={styles.infoBadgeText}>Expense: Rs 140.00</Text></View>
            <View style={styles.infoBadge}><Text style={styles.infoBadgeText}>Service Date: Oct 12, 2024</Text></View>
          </View>
          <View style={styles.statusBanner}><Text style={styles.statusBannerText}>Paid by Admin (Out-of-Pocket / To be Reimbursed)</Text></View>
          <Text style={styles.sectionLabel}>Digital Receipt</Text>
          <View style={styles.receiptRow}>
            <View>
              <Text style={styles.receiptName}>inv_oct12_bashir.pdf</Text>
              <Text style={styles.receiptMeta}>1.4 MB • Digital Receipt Verified</Text>
            </View>
            <TouchableOpacity style={styles.viewBtn}><Text style={styles.viewBtnText}>View</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.allocationCard}>
          <View style={styles.allocationHeader}>
            <Text style={styles.allocationTitle}>Target Group Allocation</Text>
            <View style={styles.modeBadge}><Text style={styles.modeBadgeText}>Equi-Split Mode</Text></View>
          </View>
          <View style={styles.filterRow}>
            <View style={[styles.filterPill, styles.filterPillActive]}><Text style={styles.filterPillTextActive}>Select All (6)</Text></View>
            <View style={styles.filterPill}><Text style={styles.filterPillText}>Ensuite (3)</Text></View>
            <View style={styles.filterPill}><Text style={styles.filterPillText}>Custom</Text></View>
          </View>
          <View style={styles.coverageRow}>
            <Text style={styles.coverageText}>6 of 6 Active (100% Covered)</Text>
            <Text style={styles.perOccupant}>Rs 23.33 / occupant</Text>
          </View>
          <View style={styles.ratioBar}><View style={[styles.ratioFill, { width: '100%' }]} /></View>
          <View style={styles.formulaRow}>
            <Text style={styles.formulaText}>Equal ad-hoc weighting</Text>
            <Text style={styles.deltaText}>Delta: Rs 0.00</Text>
          </View>
          {RESIDENTS.map((r, idx) => (
            <View key={idx} style={[styles.residentRow, idx < RESIDENTS.length - 1 && styles.residentRowBorder]}>
              <View style={styles.residentInfo}>
                <View style={styles.checkBox}><Text style={styles.check}>✓</Text></View>
                <View>
                  <Text style={styles.resName}>{r.name}</Text>
                  <Text style={styles.resMeta}>{r.room} • {r.type}</Text>
                </View>
              </View>
              <Text style={styles.resAmount}>{r.amount}</Text>
            </View>
          ))}
        </View>

        <View style={styles.reconCard}>
          <View style={styles.reconHeader}>
            <Text style={styles.reconTitle}>Ledger Reconciliation</Text>
            <View style={styles.balancedPill}><Text style={styles.balancedPillText}>Balanced</Text></View>
          </View>
          <View style={styles.reconGrid}>
            <View style={styles.reconBox}><Text style={styles.reconLabel}>Total Voucher</Text><Text style={styles.reconValue}>Rs 140.00</Text></View>
            <View style={styles.reconBox}><Text style={styles.reconLabel}>Allocated</Text><Text style={styles.reconValue}>Rs 140.00</Text></View>
            <View style={styles.reconBox}><Text style={styles.reconLabel}>Delta</Text><Text style={[styles.reconValue, { color: Colors.teal }]}>Rs 0.00</Text></View>
          </View>
          <View style={styles.noteBox}><Text style={styles.noteText}>Replaced copper thermostat coil with 1-year warranty receipt stored in Splitfy vault. Auto-creates peer settlement requests upon confirmation.</Text></View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
        <TouchableOpacity style={styles.pushBtn}><Text style={styles.pushBtnText}>Push Expense & Notify Members</Text><Text style={styles.pushBtnSub}>Automated WhatsApp split breakdown</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 100 },
  headerCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 12, gap: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: 14, fontWeight: '800', color: Colors.teal },
  pkr: { backgroundColor: Colors.tealLight, color: Colors.teal, paddingHorizontal: 4, borderRadius: 4 },
  tag: { color: Colors.textSub, fontWeight: '600' },
  subtitle: { fontSize: 10, color: Colors.textSub },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bell: { fontSize: 16 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontWeight: '700' },
  badgeRow: { flexDirection: 'row', gap: 8 },
  codeBadge: { backgroundColor: Colors.canvas, borderWidth: 1, borderColor: Colors.border, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  codeBadgeText: { fontSize: 10, color: Colors.textSub, fontVariant: ['tabular-nums'] as any },
  adminBadge: { backgroundColor: Colors.teal, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  adminBadgeText: { fontSize: 10, color: '#FFFFFF', fontWeight: '700' },
  screenTitle: { fontSize: 18, fontWeight: '800', color: Colors.textDark },
  screenSub: { fontSize: 11, color: Colors.textSub, marginTop: -6 },
  metricRow: { flexDirection: 'row', gap: 8 },
  metricCard: { flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 10, gap: 2 },
  metricLabel: { fontSize: 10, color: Colors.textSub },
  metricValue: { fontSize: 16, fontWeight: '800', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  metricMeta: { fontSize: 9, color: Colors.textSub },
  progressBar: { height: 4, backgroundColor: Colors.border, borderRadius: 2, marginTop: 4 },
  progressFill: { height: 4, backgroundColor: Colors.copper, borderRadius: 2 },
  avatarRow: { flexDirection: 'row', marginTop: 4 },
  miniAvatar: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.card },
  miniAvatarText: { color: '#FFFFFF', fontSize: 8, fontWeight: '700' },
  workCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 12, gap: 10 },
  workHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  workTitle: { fontSize: 13, fontWeight: '700', color: Colors.textDark },
  reqBadge: { backgroundColor: Colors.canvas, borderWidth: 1, borderColor: Colors.border, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  reqBadgeText: { fontSize: 9, color: Colors.textSub },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: Colors.textDark },
  catRow: { flexDirection: 'row', gap: 6 },
  catPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  catPillActive: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  catPillText: { fontSize: 10, color: Colors.textSub },
  catPillTextActive: { color: '#FFFFFF', fontWeight: '600' },
  descBox: { backgroundColor: Colors.canvas, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 10 },
  descText: { fontSize: 11, color: Colors.textDark },
  vendorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.canvas, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 10 },
  vendorName: { fontSize: 11, fontWeight: '600', color: Colors.textDark },
  vendorPhone: { fontSize: 10, color: Colors.textSub },
  callBtn: { backgroundColor: Colors.tealLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  callBtnText: { fontSize: 10, color: Colors.teal, fontWeight: '700' },
  badgeGrid: { flexDirection: 'row', gap: 6 },
  infoBadge: { backgroundColor: Colors.canvas, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  infoBadgeText: { fontSize: 10, color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  statusBanner: { backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: Colors.copper, borderRadius: 10, padding: 8, alignItems: 'center' },
  statusBannerText: { fontSize: 10, fontWeight: '600', color: Colors.copper },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.canvas, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 10 },
  receiptName: { fontSize: 11, fontWeight: '600', color: Colors.textDark },
  receiptMeta: { fontSize: 9, color: Colors.textSub },
  viewBtn: { borderWidth: 1, borderColor: Colors.teal, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  viewBtnText: { fontSize: 10, color: Colors.teal, fontWeight: '600' },
  allocationCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 12, gap: 10 },
  allocationHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  allocationTitle: { fontSize: 13, fontWeight: '700', color: Colors.textDark },
  modeBadge: { backgroundColor: Colors.tealLight, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  modeBadgeText: { fontSize: 9, color: Colors.teal, fontWeight: '700' },
  filterRow: { flexDirection: 'row', gap: 6 },
  filterPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  filterPillActive: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  filterPillText: { fontSize: 10, color: Colors.textSub },
  filterPillTextActive: { color: '#FFFFFF', fontWeight: '600' },
  coverageRow: { flexDirection: 'row', justifyContent: 'space-between' },
  coverageText: { fontSize: 11, color: Colors.textDark },
  perOccupant: { fontSize: 11, fontWeight: '600', color: Colors.teal, fontVariant: ['tabular-nums'] as any },
  ratioBar: { height: 6, backgroundColor: Colors.border, borderRadius: 3 },
  ratioFill: { height: 6, backgroundColor: Colors.teal, borderRadius: 3 },
  formulaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  formulaText: { fontSize: 10, color: Colors.textSub },
  deltaText: { fontSize: 10, color: Colors.textSub },
  residentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  residentRowBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  residentInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkBox: { width: 16, height: 16, borderRadius: 4, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  check: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  resName: { fontSize: 11, fontWeight: '600', color: Colors.textDark },
  resMeta: { fontSize: 9, color: Colors.textSub },
  resAmount: { fontSize: 11, fontWeight: '700', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  reconCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 12, gap: 10 },
  reconHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reconTitle: { fontSize: 13, fontWeight: '700', color: Colors.textDark },
  balancedPill: { backgroundColor: Colors.tealLight, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  balancedPillText: { fontSize: 9, color: Colors.teal, fontWeight: '700' },
  reconGrid: { flexDirection: 'row', gap: 6 },
  reconBox: { flex: 1, backgroundColor: Colors.canvas, borderRadius: 10, padding: 8, alignItems: 'center' },
  reconLabel: { fontSize: 9, color: Colors.textSub },
  reconValue: { fontSize: 12, fontWeight: '700', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  noteBox: { backgroundColor: Colors.canvas, borderRadius: 10, padding: 8 },
  noteText: { fontSize: 9, color: Colors.textSub, lineHeight: 14 },
  footer: { flexDirection: 'row', gap: 10, padding: 12, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border },
  cancelBtn: { flex: 0.4, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, alignItems: 'center', paddingVertical: 10 },
  cancelBtnText: { fontSize: 12, fontWeight: '600', color: Colors.textDark },
  pushBtn: { flex: 0.6, backgroundColor: Colors.teal, borderRadius: 10, alignItems: 'center', paddingVertical: 8 },
  pushBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  pushBtnSub: { fontSize: 9, color: '#FFFFFF' },
});
