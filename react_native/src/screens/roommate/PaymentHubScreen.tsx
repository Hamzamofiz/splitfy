import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/ScreenHeader';
import type { RoommateTabParamList } from '../../navigation/types';
import { Colors } from '../../theme';

type Props = BottomTabScreenProps<RoommateTabParamList, 'Settlement'>;
type Channel = 'Raast' | 'Easypaisa' | 'Cash';
type Peer = { id: string; name: string; reason: string; amount: number; direction: 'Owes you' | 'You owe'; requested?: Channel; settled?: Channel };
type Filter = 'All' | 'Paid cycles' | 'Verified receipts';
const HISTORY = [
  { cycle: 'October 2026', date: new Date(2026, 9, 31), amount: 2675, receipt: true },
  { cycle: 'September 2026', date: new Date(2026, 8, 30), amount: 2410, receipt: true },
  { cycle: 'August 2026', date: new Date(2026, 7, 31), amount: 2890, receipt: false },
];

export default function PaymentHubScreen({ navigation }: Props) {
  const [peers, setPeers] = useState<Peer[]>([
    { id: 'ali', name: 'Ali Hassan', reason: 'Shared internet bill', amount: 625, direction: 'Owes you' },
    { id: 'sara', name: 'Sara Khan', reason: 'Kitchen supplies', amount: 320, direction: 'You owe' },
  ]);
  const [selectedPeer, setSelectedPeer] = useState<string | null>(null);
  const [action, setAction] = useState<'request' | 'settle' | null>(null);
  const [channel, setChannel] = useState<Channel>('Raast');
  const [filter, setFilter] = useState<Filter>('All');
  const [range, setRange] = useState<'All dates' | 'Last 30 days' | 'Last 90 days'>('All dates');
  const history = useMemo(() => HISTORY.filter(row => {
    if (filter === 'Paid cycles' && !row.cycle) return false;
    if (filter === 'Verified receipts' && !row.receipt) return false;
    if (range === 'All dates') return true;
    const age = (Date.now() - row.date.getTime()) / 86400000;
    return age >= 0 && age <= (range === 'Last 30 days' ? 30 : 90);
  }), [filter, range]);

  const confirmAction = () => {
    if (!selectedPeer || !action) return;
    setPeers(current => current.map(peer => peer.id !== selectedPeer ? peer : action === 'request' ? { ...peer, requested: channel } : { ...peer, settled: channel }));
    setAction(null);
    setSelectedPeer(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Net settlement" subtitle="Your balances and group payment details" />
        <View style={styles.mainBalance}>
          <Text style={styles.balanceLabel}>You owe this month</Text>
          <Text style={styles.balance}>PKR 2,675</Text>
          <Text style={styles.balanceLabel}>Bills, meals, and shared expenses</Text>
          <TouchableOpacity style={styles.lightButton} onPress={() => navigation.navigate('Bills')}><Text style={styles.lightText}>Submit payment proof</Text></TouchableOpacity>
        </View>
        <View style={styles.metrics}>
          <Metric label="Others owe you" value="PKR 945" positive />
          <Metric label="You owe others" value="PKR 320" />
        </View>
        <Text style={styles.section}>Peer settlements</Text>
        {peers.map(peer => (
          <View key={peer.id} style={styles.peer}>
            <View style={styles.peerInfo}>
              <Text style={styles.peerName}>{peer.name}</Text>
              <Text style={styles.muted}>{peer.reason}</Text>
              <Text style={[styles.peerStatus, peer.settled ? styles.positive : peer.direction === 'Owes you' ? styles.positive : styles.negative]}>
                {peer.settled ? `Settled via ${peer.settled}` : peer.requested ? `Request sent via ${peer.requested}` : peer.direction}
              </Text>
            </View>
            <View style={styles.peerActions}>
              <Text style={styles.peerAmount}>PKR {peer.amount.toLocaleString()}</Text>
              {!peer.settled ? <>
                <TouchableOpacity accessibilityLabel={`Request payment from ${peer.name}`} style={styles.requestButton} onPress={() => { setSelectedPeer(peer.id); setAction('request'); setChannel('Raast'); }}><Text style={styles.requestText}>Request Payment</Text></TouchableOpacity>
                <TouchableOpacity accessibilityLabel={`Mark ${peer.name} settled`} style={styles.settleButton} onPress={() => { setSelectedPeer(peer.id); setAction('settle'); setChannel('Raast'); }}><Text style={styles.settleText}>Mark Settled</Text></TouchableOpacity>
              </> : null}
            </View>
          </View>
        ))}
        <Text style={styles.section}>Group payment details</Text>
        <View style={styles.paymentCard}>
          <PaymentDetail title="Raast ID" value="ROOM402@RAAST" />
          <PaymentDetail title="Easypaisa" value="03XX-XXXXXXX" />
          <Text style={styles.muted}>After paying by Raast, Easypaisa, or cash, attach your proof in Bills.</Text>
        </View>
        <Text style={styles.section}>Billing & settlement history</Text>
        <View style={styles.historyCard}>
          <Text style={styles.filterLabel}>History type</Text>
          <View style={styles.filterRow}>{(['All', 'Paid cycles', 'Verified receipts'] as const).map(item => (
            <TouchableOpacity key={item} testID={`history-filter-${item.toLowerCase().replaceAll(' ', '-')}`} style={[styles.filterButton, filter === item && styles.filterSelected]} onPress={() => setFilter(item)}><Text style={[styles.filterText, filter === item && styles.filterTextSelected]}>{item}</Text></TouchableOpacity>
          ))}</View>
          <Text style={styles.filterLabel}>Date range</Text>
          <View style={styles.filterRow}>{(['All dates', 'Last 30 days', 'Last 90 days'] as const).map(item => (
            <TouchableOpacity key={item} testID={`history-range-${item.toLowerCase().replaceAll(' ', '-')}`} style={[styles.filterButton, range === item && styles.filterSelected]} onPress={() => setRange(item)}><Text style={[styles.filterText, range === item && styles.filterTextSelected]}>{item}</Text></TouchableOpacity>
          ))}</View>
          {history.length ? history.map(row => <View key={row.cycle} style={styles.historyRow}>
            <View><Text style={styles.peerName}>{row.cycle}</Text><Text style={styles.muted}>{row.date.toLocaleDateString('en-PK')}</Text></View>
            <View style={styles.historyRight}><Text style={styles.peerAmount}>PKR {row.amount.toLocaleString()}</Text><Text style={styles.positive}>{row.receipt ? 'Verified receipt' : 'Paid'}</Text></View>
          </View>) : <Text style={styles.muted}>No history for this filter.</Text>}
        </View>
      </ScrollView>

      <Modal visible={action !== null} transparent animationType="fade" onRequestClose={() => setAction(null)}>
        <View style={styles.backdrop}><View style={styles.modal}>
          <Text style={styles.modalTitle}>{action === 'request' ? 'Request payment' : 'Mark settled'}</Text>
          <Text style={styles.muted}>{peers.find(peer => peer.id === selectedPeer)?.name}</Text>
          <Text style={styles.filterLabel}>Choose payment channel</Text>
          <View style={styles.filterRow}>{(['Raast', 'Easypaisa', 'Cash'] as const).map(item => (
            <TouchableOpacity key={item} testID={`settlement-channel-${item.toLowerCase()}`} style={[styles.filterButton, channel === item && styles.filterSelected]} onPress={() => setChannel(item)}><Text style={[styles.filterText, channel === item && styles.filterTextSelected]}>{item}</Text></TouchableOpacity>
          ))}</View>
          <TouchableOpacity testID="confirm-peer-action" style={styles.confirmButton} onPress={confirmAction}><Text style={styles.confirmText}>{action === 'request' ? 'Send payment request' : 'Confirm settled'}</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setAction(null)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}

function Metric({ label, value, positive = false }: { label: string; value: string; positive?: boolean }) {
  return <View style={styles.metric}><Text style={styles.muted}>{label}</Text><Text style={[styles.metricValue, positive ? styles.positive : styles.negative]}>{value}</Text></View>;
}
function PaymentDetail({ title, value }: { title: string; value: string }) {
  return <View style={styles.paymentDetail}><Text style={styles.muted}>{title}</Text><Text style={styles.peerAmount}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: 16, paddingBottom: 28, gap: 12 },
  mainBalance: { padding: 16, borderRadius: 16, backgroundColor: Colors.teal, gap: 5 },
  balanceLabel: { color: '#D5FFFA', fontSize: 10 },
  balance: { color: '#FFFFFF', fontSize: 27, fontWeight: '900', fontVariant: ['tabular-nums'] },
  lightButton: { alignSelf: 'flex-start', marginTop: 6, padding: 9, borderRadius: 9, backgroundColor: '#FFFFFF' },
  lightText: { color: Colors.teal, fontSize: 10, fontWeight: '700' },
  metrics: { flexDirection: 'row', gap: 8 },
  metric: { flex: 1, minHeight: 66, justifyContent: 'center', padding: 11, gap: 5, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, backgroundColor: Colors.card },
  metricValue: { fontSize: 13, fontWeight: '800', fontVariant: ['tabular-nums'] },
  section: { color: Colors.textDark, fontSize: 15, fontWeight: '800' },
  peer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, backgroundColor: Colors.card },
  peerInfo: { flex: 1, gap: 4 },
  peerName: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  muted: { color: Colors.textSub, fontSize: 9, lineHeight: 14 },
  peerStatus: { fontSize: 9, fontWeight: '700' },
  positive: { color: Colors.teal, fontSize: 9, fontWeight: '700' },
  negative: { color: Colors.copper, fontSize: 9, fontWeight: '700' },
  peerActions: { alignItems: 'flex-end', gap: 6 },
  peerAmount: { color: Colors.textDark, fontSize: 10, fontWeight: '800', fontVariant: ['tabular-nums'] },
  requestButton: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.tealLight },
  requestText: { color: Colors.teal, fontSize: 9, fontWeight: '700' },
  settleButton: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.copperLight },
  settleText: { color: Colors.copper, fontSize: 9, fontWeight: '700' },
  paymentCard: { paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, backgroundColor: Colors.card },
  paymentDetail: { minHeight: 43, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: Colors.border },
  historyCard: { padding: 12, gap: 9, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, backgroundColor: Colors.card },
  filterLabel: { color: Colors.textSub, fontSize: 10, fontWeight: '600' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  filterButton: { minHeight: 30, justifyContent: 'center', paddingHorizontal: 8, borderWidth: 1, borderColor: Colors.border, borderRadius: 8 },
  filterSelected: { borderColor: Colors.teal, backgroundColor: Colors.tealLight },
  filterText: { color: Colors.textSub, fontSize: 8, fontWeight: '600' },
  filterTextSelected: { color: Colors.teal },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderColor: Colors.border },
  historyRight: { alignItems: 'flex-end', gap: 4 },
  backdrop: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(8,13,30,0.5)' },
  modal: { padding: 16, gap: 12, borderRadius: 18, backgroundColor: Colors.card },
  modalTitle: { color: Colors.textDark, fontSize: 17, fontWeight: '800' },
  confirmButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: Colors.teal },
  confirmText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  cancelText: { color: Colors.textSub, textAlign: 'center', fontSize: 10, padding: 5 },
});
