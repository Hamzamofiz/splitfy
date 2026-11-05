import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import RoommatePageHeader from '../../components/RoommatePageHeader';
import type { RoommateTabParamList } from '../../navigation/types';
import { Colors } from '../../theme';

type Props = BottomTabScreenProps<RoommateTabParamList, 'Settlement'>;

const PEER_SETTLEMENTS = [
  { id: '1', name: 'Ali Hassan', description: 'Shared internet bill', amount: 'PKR 625', status: 'Owes you' as const },
  { id: '2', name: 'Sara Khan', description: 'Kitchen supplies', amount: 'PKR 320', status: 'You owe' as const },
];
const SETTLEMENT_HISTORY = [
  { id: 'oct', cycle: 'October 2026', date: new Date(2026, 9, 31), amount: 2675, status: 'Paid', receipt: true },
  { id: 'sep', cycle: 'September 2026', date: new Date(2026, 8, 30), amount: 2410, status: 'Paid', receipt: true },
  { id: 'aug', cycle: 'August 2026', date: new Date(2026, 7, 31), amount: 2890, status: 'Paid', receipt: false },
];

type Channel = 'Raast' | 'Easypaisa' | 'Cash';
type HistoryFilter = 'All' | 'Paid cycles' | 'Verified receipts';
type DateRange = 'All dates' | 'Last 30 days' | 'Last 90 days';
type Peer = (typeof PEER_SETTLEMENTS)[number] & {
  settled: boolean;
  requestedVia?: Channel;
  settledVia?: Channel;
};

export default function PaymentHubScreen({ navigation }: Props) {
  const [peers, setPeers] = useState<Peer[]>(() =>
    PEER_SETTLEMENTS.map(peer => ({ ...peer, settled: false })),
  );
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('All');
  const [dateRange, setDateRange] = useState<DateRange>('All dates');
  const [actionPeerId, setActionPeerId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'request' | 'settle' | null>(null);
  const [channel, setChannel] = useState<Channel>('Raast');

  const visibleHistory = useMemo(() => {
    const now = new Date();
    return SETTLEMENT_HISTORY.filter(item => {
      const matchesFilter = historyFilter === 'All'
        || (historyFilter === 'Paid cycles' && item.status === 'Paid')
        || (historyFilter === 'Verified receipts' && item.receipt);
      if (!matchesFilter) {
        return false;
      }
      if (dateRange === 'All dates') {
        return true;
      }
      const daysAgo = (now.getTime() - item.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= (dateRange === 'Last 30 days' ? 30 : 90) && daysAgo >= 0;
    });
  }, [dateRange, historyFilter]);

  const openPeerAction = (peerId: string, type: 'request' | 'settle') => {
    setActionPeerId(peerId);
    setActionType(type);
    setChannel('Raast');
  };

  const confirmPeerAction = () => {
    if (!actionPeerId || !actionType) {
      return;
    }
    setPeers(current => current.map(peer => {
      if (peer.id !== actionPeerId) {
        return peer;
      }
      return actionType === 'request'
        ? { ...peer, requestedVia: channel }
        : { ...peer, settled: true, settledVia: channel };
    }));
    setActionPeerId(null);
    setActionType(null);
  };

  const activePeer = peers.find(peer => peer.id === actionPeerId);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <RoommatePageHeader
          title="Net settlement"
          subtitle="Your shared balances and payment details"
        />

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>You owe this month</Text>
          <Text style={styles.balanceAmount}>PKR 2,675</Text>
          <Text style={styles.balanceHint}>Includes bills, meals, and shared expenses</Text>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.payButton}
            onPress={() => navigation.navigate('Bills')}
          >
            <Text style={styles.payButtonText}>Go to payment submission</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Others owe you</Text>
            <Text style={styles.creditAmount}>PKR 945</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>You owe others</Text>
            <Text style={styles.debitAmount}>PKR 320</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Peer settlements</Text>
        {peers.map(item => (
          <View key={item.id} style={styles.peerCard}>
            <View style={styles.peerInfo}>
              <Text style={styles.peerName}>{item.name}</Text>
              <Text style={styles.peerDescription}>{item.description}</Text>
              <Text style={[styles.peerStatus, item.settled ? styles.settledStatus : item.status === 'Owes you' ? styles.creditStatus : styles.debitStatus]}>
                {item.settled ? `Settled via ${item.settledVia}` : item.requestedVia ? `Requested via ${item.requestedVia}` : item.status}
              </Text>
            </View>
            <View style={styles.peerAction}>
              <Text style={styles.peerAmount}>{item.amount}</Text>
              {!item.settled ? (
                <>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Request payment from ${item.name}`}
                  style={styles.requestButton}
                  onPress={() => openPeerAction(item.id, 'request')}
                >
                  <Text style={styles.requestText}>Request Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Mark settlement with ${item.name} as settled`}
                  style={styles.payPeerButton}
                  onPress={() => openPeerAction(item.id, 'settle')}
                >
                  <Text style={styles.payPeerText}>Mark Settled</Text>
                </TouchableOpacity>
                </>
              ) : null}
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Group payment details</Text>
        <View style={styles.paymentCard}>
          <View style={styles.paymentMethod}>
            <Text style={styles.methodName}>Raast</Text>
            <Text style={styles.methodValue}>RAAST-XXXX-1234</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.paymentMethod}>
            <Text style={styles.methodName}>Easypaisa</Text>
            <Text style={styles.methodValue}>03XX-XXXXXXX</Text>
          </View>
          <Text style={styles.paymentNote}>Submit a cash or digital payment proof from the Bills tab.</Text>
        </View>

        <Text style={styles.sectionTitle}>Billing & settlement history</Text>
        <View style={styles.historyCard}>
          <Text style={styles.historyFilterLabel}>Show</Text>
          <View style={styles.filterRow}>
            {(['All', 'Paid cycles', 'Verified receipts'] as const).map(item => (
              <TouchableOpacity
                key={item}
                testID={`history-filter-${item.toLowerCase().replaceAll(' ', '-')}`}
                accessibilityRole="button"
                accessibilityState={{ selected: historyFilter === item }}
                style={[styles.filterButton, historyFilter === item && styles.filterButtonActive]}
                onPress={() => setHistoryFilter(item)}
              >
                <Text style={[styles.filterText, historyFilter === item && styles.filterTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.historyFilterLabel}>Date range</Text>
          <View style={styles.filterRow}>
            {(['All dates', 'Last 30 days', 'Last 90 days'] as const).map(item => (
              <TouchableOpacity
                key={item}
                testID={`history-range-${item.toLowerCase().replaceAll(' ', '-')}`}
                accessibilityRole="button"
                accessibilityState={{ selected: dateRange === item }}
                style={[styles.filterButton, dateRange === item && styles.filterButtonActive]}
                onPress={() => setDateRange(item)}
              >
                <Text style={[styles.filterText, dateRange === item && styles.filterTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {visibleHistory.length > 0 ? visibleHistory.map(item => (
            <View key={item.id} style={styles.historyRow}>
              <View style={styles.historyInfo}>
                <Text style={styles.historyCycle}>{item.cycle}</Text>
                <Text style={styles.historyDate}>{item.date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
              </View>
              <View style={styles.historyAmountInfo}>
                <Text style={styles.historyAmount}>PKR {item.amount.toLocaleString()}</Text>
                <Text style={[styles.historyStatus, item.receipt && styles.historyVerified]}>
                  {item.receipt ? 'Verified receipt' : 'Paid'}
                </Text>
              </View>
            </View>
          )) : (
            <Text style={styles.emptyHistory}>No settlements match these filters.</Text>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={actionType !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setActionPeerId(null);
          setActionType(null);
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.actionModal}>
            <Text style={styles.modalTitle}>
              {actionType === 'request' ? 'Request payment' : 'Mark as settled'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {activePeer ? `${activePeer.name} · ${activePeer.amount}` : 'Choose a local payment channel'}
            </Text>
            <Text style={styles.channelLabel}>Payment channel</Text>
            <View style={styles.channelOptions}>
              {(['Raast', 'Easypaisa', 'Cash'] as const).map(item => (
                <TouchableOpacity
                  key={item}
                  testID={`settlement-channel-${item.toLowerCase()}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: channel === item }}
                  style={[styles.channelButton, channel === item && styles.channelButtonActive]}
                  onPress={() => setChannel(item)}
                >
                  <Text style={[styles.channelButtonText, channel === item && styles.channelButtonTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity testID="confirm-peer-action" style={styles.confirmButton} onPress={confirmPeerAction}>
              <Text style={styles.confirmButtonText}>
                {actionType === 'request' ? 'Send payment request' : 'Confirm settled'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.cancelButton}
              onPress={() => {
                setActionPeerId(null);
                setActionType(null);
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 28 },
  balanceCard: { backgroundColor: Colors.teal, borderRadius: 16, padding: 16, gap: 5 },
  balanceLabel: { color: '#D5FFFA', fontSize: 12 },
  balanceAmount: { color: '#FFFFFF', fontSize: 27, fontWeight: '800', fontVariant: ['tabular-nums'] },
  balanceHint: { color: '#D5FFFA', fontSize: 10 },
  payButton: { alignSelf: 'flex-start', marginTop: 6, backgroundColor: '#FFFFFF', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 8 },
  payButtonText: { color: Colors.teal, fontSize: 11, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: { flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, padding: 12, gap: 5 },
  summaryLabel: { color: Colors.textSub, fontSize: 10 },
  creditAmount: { color: Colors.teal, fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  debitAmount: { color: Colors.copper, fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  sectionTitle: { color: Colors.textDark, fontSize: 15, fontWeight: '700', marginTop: 3 },
  peerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, padding: 12 },
  peerInfo: { flex: 1, gap: 4 },
  peerName: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  peerDescription: { color: Colors.textSub, fontSize: 10 },
  peerStatus: { alignSelf: 'flex-start', fontSize: 9, fontWeight: '700' },
  creditStatus: { color: Colors.teal },
  debitStatus: { color: Colors.copper },
  settledStatus: { color: Colors.teal, fontWeight: '700' },
  peerAction: { alignItems: 'flex-end', gap: 7 },
  peerAmount: { color: Colors.textDark, fontSize: 11, fontWeight: '700', fontVariant: ['tabular-nums'] },
  requestButton: { backgroundColor: Colors.tealLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  requestText: { color: Colors.teal, fontSize: 10, fontWeight: '700' },
  payPeerButton: { backgroundColor: Colors.copperLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  payPeerText: { color: Colors.copper, fontSize: 10, fontWeight: '700' },
  paymentCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, paddingHorizontal: 13 },
  paymentMethod: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingVertical: 13 },
  methodName: { color: Colors.textSub, fontSize: 11 },
  methodValue: { color: Colors.textDark, fontSize: 11, fontWeight: '700', fontVariant: ['tabular-nums'] },
  divider: { height: 1, backgroundColor: Colors.border },
  paymentNote: { color: Colors.textLight, fontSize: 10, lineHeight: 15, paddingBottom: 12 },
  historyCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 12, gap: 9 },
  historyFilterLabel: { color: Colors.textSub, fontSize: 10, fontWeight: '600' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  filterButton: { minHeight: 30, justifyContent: 'center', paddingHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  filterButtonActive: { backgroundColor: Colors.tealLight, borderColor: Colors.teal },
  filterText: { color: Colors.textSub, fontSize: 9, fontWeight: '600' },
  filterTextActive: { color: Colors.teal },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingVertical: 9, borderTopWidth: 1, borderTopColor: Colors.border },
  historyInfo: { flex: 1, gap: 3 },
  historyCycle: { color: Colors.textDark, fontSize: 11, fontWeight: '700' },
  historyDate: { color: Colors.textSub, fontSize: 9 },
  historyAmountInfo: { alignItems: 'flex-end', gap: 4 },
  historyAmount: { color: Colors.textDark, fontSize: 11, fontWeight: '700', fontVariant: ['tabular-nums'] },
  historyStatus: { color: Colors.textSub, fontSize: 8, fontWeight: '600' },
  historyVerified: { color: Colors.teal },
  emptyHistory: { paddingVertical: 12, color: Colors.textLight, fontSize: 10, textAlign: 'center' },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: 22, backgroundColor: 'rgba(8,13,30,0.5)' },
  actionModal: { gap: 12, padding: 18, borderRadius: 18, backgroundColor: Colors.card },
  modalTitle: { color: Colors.textDark, fontSize: 17, fontWeight: '800' },
  modalSubtitle: { color: Colors.textSub, fontSize: 11 },
  channelLabel: { color: Colors.textSub, fontSize: 10, fontWeight: '600' },
  channelOptions: { flexDirection: 'row', gap: 7 },
  channelButton: { flex: 1, minHeight: 38, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: 9 },
  channelButtonActive: { backgroundColor: Colors.tealLight, borderColor: Colors.teal },
  channelButtonText: { color: Colors.textSub, fontSize: 10, fontWeight: '600' },
  channelButtonTextActive: { color: Colors.teal },
  confirmButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.teal, borderRadius: 10, marginTop: 4 },
  confirmButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  cancelButton: { alignItems: 'center', paddingVertical: 6 },
  cancelText: { color: Colors.textSub, fontSize: 11, fontWeight: '600' },
});
