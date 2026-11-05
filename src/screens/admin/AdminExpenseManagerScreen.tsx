import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme';

const QUEUE = [
  { id: '1', label: 'Queue', value: '5 Docs', sub: 'Oct batch', status: 'Connected' },
  { id: '2', label: 'Pending', value: '2 Signoffs', sub: 'Actionable', status: 'Pending' },
  { id: '3', label: 'Audited', value: '12 Items', sub: 'Reconciled', status: 'Audited' },
];

const SIGNOFFS = [
  { id: '1', name: 'Bed A - Ahmed Raza', status: 'Approved via Mobile/Web', time: 'Oct 12, 09:24', action: null },
  { id: '2', name: 'Bed B - Fatima Khan', status: 'Approved via Mobile/Web', time: 'Oct 12, 10:16', action: null },
  { id: '3', name: 'Bed C - Bilal Hassan', status: 'Awaiting Approval', time: '-', action: 'Ping' },
  { id: '4', name: 'Bed D - Sara Ali', status: 'Auto-verified', time: 'Oct 12, 11:02', action: null },
];

const OTHER_INVOICES = [
  { id: '1', name: 'PTCL Internet Bill', amount: '₨ 2,500', status: 'Reconciled' },
  { id: '2', name: 'Maintenance - Plumber', amount: '₨ 1,800', status: 'Partially Signed' },
  { id: '3', name: 'Water Tanker Supply', amount: '₨ 850', status: 'Pending Verification' },
];

export default function AdminExpenseManagerScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Bill Ingestion & Manager</Text>
        <Text style={styles.pageSubtitle}>Optical extractions • OCR spotlight parsing • Resident signoffs</Text>

        <View style={styles.summaryRow}>
          {QUEUE.map(item => (
            <View key={item.id} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
              <Text style={styles.summarySub}>{item.sub}</Text>
              <View style={styles.summaryBadge}>
                <Text style={styles.summaryBadgeText}>{item.status}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.8}>
          <Text style={styles.uploadBtnText}>+ Batch Upload Invoices (PDF/JPG)</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Spotlight Ingestion</Text>
        <View style={styles.spotlightCard}>
          <View style={styles.spotlightHeader}>
            <View>
              <Text style={styles.spotlightTitle}>LESCO Electricity Bill</Text>
              <Text style={styles.spotlightRef}>Consumer Ref: 0123456789 | Reading Cycle: Oct 2025</Text>
            </View>
            <TouchableOpacity style={styles.pdfBtn}>
              <Text style={styles.pdfBtnText}>Raw PDF</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.extractionGrid}>
            <View style={styles.extractItem}>
              <Text style={styles.extractLabel}>Billed Units</Text>
              <Text style={styles.extractValue}>842 kWh</Text>
            </View>
            <View style={styles.extractItem}>
              <Text style={styles.extractLabel}>Net Payable</Text>
              <Text style={styles.extractValue}>₨ 4,200</Text>
            </View>
            <View style={styles.extractItem}>
              <Text style={styles.extractLabel}>Late Charges</Text>
              <Text style={styles.extractValue}>₨ 0</Text>
            </View>
            <View style={styles.extractItem}>
              <Text style={styles.extractLabel}>Due Date</Text>
              <Text style={styles.extractValue}>Oct 28</Text>
            </View>
          </View>
          <Text style={styles.splitTitle}>Per-Resident Split Breakdown</Text>
          <View style={styles.splitRow}>
            <Text style={styles.splitLabel}>Bed A</Text>
            <Text style={styles.splitValue}>₨ 1,050</Text>
          </View>
          <View style={styles.splitRow}>
            <Text style={styles.splitLabel}>Bed B</Text>
            <Text style={styles.splitValue}>₨ 1,050</Text>
          </View>
          <View style={styles.splitRow}>
            <Text style={styles.splitLabel}>Bed C</Text>
            <Text style={styles.splitValue}>₨ 1,050</Text>
          </View>
          <View style={styles.splitRow}>
            <Text style={styles.splitLabel}>Bed D</Text>
            <Text style={styles.splitValue}>₨ 1,050</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Resident Signoff Matrix</Text>
        <View style={styles.matrixCard}>
          {SIGNOFFS.map((item, idx) => (
            <View key={item.id} style={[styles.matrixItem, idx < SIGNOFFS.length - 1 && styles.matrixBorder]}>
              <View style={styles.matrixLeft}>
                <Text style={styles.matrixName}>{item.name}</Text>
                <Text style={[styles.matrixStatus, item.status === 'Awaiting Approval' && { color: Colors.copper }, item.status === 'Auto-verified' && { color: Colors.teal }]}>
                  {item.status}
                </Text>
                <Text style={styles.matrixTime}>{item.time}</Text>
              </View>
              {item.action ? (
                <TouchableOpacity style={styles.pingBtn}>
                  <Text style={styles.pingBtnText}>{item.action}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.approvedPill}>
                  <Text style={styles.approvedPillText}>Signed</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Other Ingested Invoices</Text>
        <View style={styles.listCard}>
          {OTHER_INVOICES.map((item, idx) => (
            <View key={item.id} style={[styles.listItem, idx < OTHER_INVOICES.length - 1 && styles.listBorder]}>
              <View>
                <Text style={styles.listName}>{item.name}</Text>
                <Text style={styles.listAmount}>{item.amount}</Text>
              </View>
              <Text style={[styles.listStatus, item.status === 'Reconciled' && { color: Colors.teal }, item.status === 'Pending Verification' && { color: Colors.copper }]}>
                {item.status}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Admin Verification Authority</Text>
        <View style={styles.verifyCard}>
          <View style={styles.verifyBtns}>
            <TouchableOpacity style={styles.reuploadBtn}>
              <Text style={styles.reuploadBtnText}>Request Re-upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.forceBtn}>
              <Text style={styles.forceBtnText}>Force Admin Confirm</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.logsTitle}>Live System Logs</Text>
          <Text style={styles.logLine}>• OCR: LESCO bill parsed successfully (98% confidence)</Text>
          <Text style={styles.logLine}>• 3/4 residents signed off</Text>
          <Text style={styles.logLine}>• Awaiting verification for Bed C</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  pageTitle: { fontSize: 18, fontWeight: '800', color: Colors.textDark },
  pageSubtitle: { fontSize: 11, color: Colors.textSub, marginTop: -4 },
  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: { flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 10, gap: 2 },
  summaryLabel: { fontSize: 10, color: Colors.textSub },
  summaryValue: { fontSize: 16, fontWeight: '800', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  summarySub: { fontSize: 9, color: Colors.textSub },
  summaryBadge: { alignSelf: 'flex-start', backgroundColor: Colors.tealLight, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginTop: 2 },
  summaryBadgeText: { fontSize: 8, color: Colors.teal, fontWeight: '600' },
  uploadBtn: { backgroundColor: Colors.teal, borderRadius: 12, alignItems: 'center', paddingVertical: 12 },
  uploadBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textDark, marginTop: 4 },
  spotlightCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 12, gap: 10 },
  spotlightHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  spotlightTitle: { fontSize: 14, fontWeight: '700', color: Colors.textDark },
  spotlightRef: { fontSize: 10, color: Colors.textSub },
  pdfBtn: { borderWidth: 1, borderColor: Colors.teal, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  pdfBtnText: { color: Colors.teal, fontSize: 11, fontWeight: '600' },
  extractionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  extractItem: { width: '48%', backgroundColor: Colors.canvas, borderRadius: 10, padding: 8 },
  extractLabel: { fontSize: 9, color: Colors.textSub },
  extractValue: { fontSize: 13, fontWeight: '700', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  splitTitle: { fontSize: 12, fontWeight: '700', color: Colors.textDark },
  splitRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  splitLabel: { fontSize: 11, color: Colors.textSub },
  splitValue: { fontSize: 11, fontWeight: '600', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  matrixCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, overflow: 'hidden' },
  matrixItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  matrixBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  matrixLeft: { gap: 2 },
  matrixName: { fontSize: 12, fontWeight: '600', color: Colors.textDark },
  matrixStatus: { fontSize: 10, color: Colors.textSub },
  matrixTime: { fontSize: 9, color: Colors.textLight },
  pingBtn: { backgroundColor: Colors.copper, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  pingBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  approvedPill: { backgroundColor: Colors.tealLight, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  approvedPillText: { color: Colors.teal, fontSize: 10, fontWeight: '600' },
  listCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, overflow: 'hidden' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  listBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  listName: { fontSize: 12, fontWeight: '600', color: Colors.textDark },
  listAmount: { fontSize: 11, color: Colors.textSub, fontVariant: ['tabular-nums'] as any },
  listStatus: { fontSize: 10, fontWeight: '600' },
  verifyCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 12, gap: 10 },
  verifyBtns: { flexDirection: 'row', gap: 8 },
  reuploadBtn: { flex: 1, borderWidth: 1, borderColor: Colors.copper, borderRadius: 10, alignItems: 'center', paddingVertical: 8 },
  reuploadBtnText: { color: Colors.copper, fontWeight: '600', fontSize: 12 },
  forceBtn: { flex: 1, backgroundColor: Colors.teal, borderRadius: 10, alignItems: 'center', paddingVertical: 8 },
  forceBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  logsTitle: { fontSize: 12, fontWeight: '700', color: Colors.textDark },
  logLine: { fontSize: 10, color: Colors.textSub },
});
