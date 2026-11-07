import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import ApiStatus from '../../components/ApiStatus';
import ScreenHeader from '../../components/ScreenHeader';
import { useRoleSession } from '../../navigation/RoleSessionContext';
import type { RoommateTabParamList } from '../../navigation/types';
import { billApi, getApiErrorMessage, settlementApi, type Bill, type Settlement, type User } from '../../services/api';
import useRoomData from '../../services/useRoomData';
import { Colors, Input } from '../../theme';

type Props = BottomTabScreenProps<RoommateTabParamList, 'Settlement'>;
type Filter = 'All' | 'Pending' | 'Completed';

function isCurrentUser(value: Settlement['payer'], id: string) {
  return typeof value === 'string' ? value === id : value._id === id;
}

function displayName(value: Settlement['payer']) {
  return typeof value === 'string' ? 'Room member' : value.name;
}

export default function PaymentHubScreen({ navigation }: Props) {
  const { user } = useRoleSession();
  const { room, loading: roomLoading, error: roomError, reload: reloadRoom } = useRoomData();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('All');
  const [payeeId, setPayeeId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [channel, setChannel] = useState('Cash');

  const reload = useCallback(async () => {
    if (!room) return;
    setLoading(true);
    setError(null);
    try {
      const [nextSettlements, nextBills] = await Promise.all([settlementApi.list(room._id), billApi.list(room._id)]);
      setSettlements(nextSettlements);
      setBills(nextBills);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [room]);

  useEffect(() => { reload(); }, [reload]);

  const members: User[] = room?.members.filter((member): member is User => typeof member !== 'string' && member._id !== user?._id) ?? [];
  const visibleSettlements = useMemo(() => settlements.filter(item => filter === 'All' || item.status === filter), [filter, settlements]);
  const myAmountDue = bills.reduce((total, bill) => total + bill.assignedTo
    .filter(assignment => !assignment.isPaid && (typeof assignment.user === 'string' ? assignment.user === user?._id : assignment.user._id === user?._id))
    .reduce((sum, assignment) => sum + assignment.shareAmount, 0), 0);
  const othersOwe = settlements.filter(item => item.status === 'Pending' && isCurrentUser(item.payee, user?._id ?? '')).reduce((sum, item) => sum + item.amount, 0);
  const iOwe = settlements.filter(item => item.status === 'Pending' && isCurrentUser(item.payer, user?._id ?? '')).reduce((sum, item) => sum + item.amount, 0);

  const recordSettlement = async () => {
    const value = Number(amount);
    if (!room || !payeeId) {
      Alert.alert('Member required', 'Choose the member who received this settlement.');
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      Alert.alert('Valid amount required', 'Enter a settlement amount greater than zero.');
      return;
    }
    setSavingId('new');
    try {
      const paymentMethod = channel === 'Raast' ? 'Bank Transfer' : channel === 'Easypaisa' ? 'EasyPaisa' : channel;
      const settlement = await settlementApi.create({
        roomId: room._id,
        payee: payeeId,
        amount: value,
        paymentMethod,
        note: note.trim(),
        status: 'Completed',
      });
      setSettlements(current => [settlement, ...current]);
      setAmount('');
      setNote('');
    } catch (requestError) {
      Alert.alert('Unable to record settlement', getApiErrorMessage(requestError));
    } finally {
      setSavingId(null);
    }
  };

  const completeSettlement = async (item: Settlement) => {
    setSavingId(item._id);
    try {
      const updated = await settlementApi.update(item._id, { status: 'Completed' });
      setSettlements(current => current.map(currentItem => currentItem._id === updated._id ? updated : currentItem));
    } catch (requestError) {
      Alert.alert('Unable to update settlement', getApiErrorMessage(requestError));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Net settlement" subtitle={room?.roomName ?? 'Your group payments and settlements'} />
        <ApiStatus loading={roomLoading || loading} error={roomError || error} onRetry={() => { if (roomError) reloadRoom(); else reload(); }} />
        {!roomLoading && !roomError && !room ? <Text style={styles.muted}>Join a room to view and record settlements.</Text> : null}
        <View style={styles.mainBalance}>
          <Text style={styles.balanceLabel}>Your unpaid bill shares</Text>
          <Text style={styles.balance}>PKR {myAmountDue.toLocaleString()}</Text>
          <TouchableOpacity style={styles.lightButton} onPress={() => navigation.navigate('Bills')}><Text style={styles.lightText}>View bills</Text></TouchableOpacity>
        </View>
        <View style={styles.metrics}>
          <Metric label="Others owe you" value={`PKR ${othersOwe.toLocaleString()}`} positive />
          <Metric label="You owe others" value={`PKR ${iOwe.toLocaleString()}`} />
        </View>
        <View style={styles.form}>
          <Text style={styles.section}>Record a settlement</Text>
          <Text style={styles.filterLabel}>Member who received payment</Text>
          <View style={styles.filterRow}>{members.map(member => (
            <TouchableOpacity key={member._id} testID={`settlement-payee-${member._id}`} style={[styles.filterButton, payeeId === member._id && styles.filterSelected]} onPress={() => setPayeeId(member._id)}>
              <Text style={[styles.filterText, payeeId === member._id && styles.filterTextSelected]}>{member.name}</Text>
            </TouchableOpacity>
          ))}</View>
          <Text style={styles.filterLabel}>Payment channel</Text>
          <View style={styles.filterRow}>{(['Cash', 'Raast', 'Easypaisa'] as const).map(item => (
            <TouchableOpacity key={item} testID={`settlement-channel-${item.toLowerCase()}`} style={[styles.filterButton, channel === item && styles.filterSelected]} onPress={() => setChannel(item)}>
              <Text style={[styles.filterText, channel === item && styles.filterTextSelected]}>{item}</Text>
            </TouchableOpacity>
          ))}</View>
          <TextInput testID="settlement-amount" style={styles.input} value={amount} onChangeText={setAmount} placeholder="Amount (PKR)" placeholderTextColor={Colors.textSub} keyboardType="numeric" />
          <TextInput testID="settlement-note" style={styles.input} value={note} onChangeText={setNote} placeholder="Note (optional)" placeholderTextColor={Colors.textSub} />
          <TouchableOpacity testID="settlement-submit" style={styles.confirmButton} disabled={savingId === 'new'} onPress={recordSettlement}><Text style={styles.confirmText}>{savingId === 'new' ? 'Saving…' : 'Save settlement'}</Text></TouchableOpacity>
        </View>
        <Text style={styles.section}>Group payment details</Text>
        <View style={styles.historyCard}>
          <PaymentDetail title="Raast ID" value={room?.raastId || 'Not provided by admin'} />
          <PaymentDetail title="Easypaisa" value={room?.easypaisaNumber || 'Not provided by admin'} />
        </View>
        <Text style={styles.section}>Settlement history</Text>
        <View style={styles.historyCard}>
          <View style={styles.filterRow}>{(['All', 'Pending', 'Completed'] as const).map(item => (
            <TouchableOpacity key={item} testID={`history-filter-${item.toLowerCase()}`} style={[styles.filterButton, filter === item && styles.filterSelected]} onPress={() => setFilter(item)}><Text style={[styles.filterText, filter === item && styles.filterTextSelected]}>{item}</Text></TouchableOpacity>
          ))}</View>
          {visibleSettlements.map(item => (
            <View key={item._id} style={styles.historyRow}>
              <View style={styles.historyInfo}>
                <Text style={styles.peerName}>{displayName(item.payer)} → {displayName(item.payee)}</Text>
                <Text style={styles.muted}>{item.note || item.paymentMethod} · {new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={styles.historyRight}>
                <Text style={styles.peerAmount}>PKR {item.amount.toLocaleString()}</Text>
                {item.status === 'Pending' && isCurrentUser(item.payer, user?._id ?? '') ? <TouchableOpacity disabled={savingId === item._id} onPress={() => completeSettlement(item)}><Text style={styles.link}>Mark completed</Text></TouchableOpacity> : <Text style={styles.positive}>{item.status}</Text>}
              </View>
            </View>
          ))}
          {!loading && room && visibleSettlements.length === 0 ? <Text style={styles.muted}>No settlements for this filter.</Text> : null}
        </View>
        <Text style={styles.helper}>After you pay by cash, Raast, or Easypaisa, record the settlement here.</Text>
      </ScrollView>
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
  muted: { color: Colors.textSub, fontSize: 9, lineHeight: 14 },
  positive: { color: Colors.teal, fontSize: 9, fontWeight: '700' },
  negative: { color: Colors.copper, fontSize: 9, fontWeight: '700' },
  peerName: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  peerAmount: { color: Colors.textDark, fontSize: 10, fontWeight: '800', fontVariant: ['tabular-nums'] },
  historyCard: { padding: 12, gap: 9, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, backgroundColor: Colors.card },
  paymentDetail: { minHeight: 43, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: Colors.border },
  filterLabel: { color: Colors.textSub, fontSize: 10, fontWeight: '600' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  filterButton: { minHeight: 30, justifyContent: 'center', paddingHorizontal: 8, borderWidth: 1, borderColor: Colors.border, borderRadius: 8 },
  filterSelected: { borderColor: Colors.teal, backgroundColor: Colors.tealLight },
  filterText: { color: Colors.textSub, fontSize: 8, fontWeight: '600' },
  filterTextSelected: { color: Colors.teal },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderColor: Colors.border },
  historyInfo: { flex: 1, gap: 4 },
  historyRight: { alignItems: 'flex-end', gap: 4 },
  helper: { color: Colors.textLight, fontSize: 9, lineHeight: 14 },
  form: { padding: 13, gap: 10, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, backgroundColor: Colors.card },
  input: { height: Input.height, paddingHorizontal: 11, borderWidth: 1, borderColor: Colors.border, borderRadius: 9, color: Colors.textDark },
  confirmButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: Colors.teal },
  confirmText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  link: { color: Colors.teal, fontSize: 9, fontWeight: '700' },
});
