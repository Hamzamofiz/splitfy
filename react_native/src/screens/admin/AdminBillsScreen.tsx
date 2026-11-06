import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ApiStatus from '../../components/ApiStatus';
import ScreenHeader from '../../components/ScreenHeader';
import { billApi, getApiErrorMessage, type Bill } from '../../services/api';
import useRoomData from '../../services/useRoomData';
import { Colors, Input } from '../../theme';

const BILL_TYPES = ['Rent', 'Electricity', 'Water', 'Gas', 'Maintenance', 'Internet', 'other'];

export default function AdminBillsScreen() {
  const { room, loading: roomLoading, error: roomError, reload: reloadRoom } = useRoomData();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [due, setDue] = useState('');
  const [category, setCategory] = useState(BILL_TYPES[1]);
  const [selected, setSelected] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!room) return;
    setLoading(true);
    setError(null);
    try {
      setBills(await billApi.list(room._id));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [room]);

  useEffect(() => { reload(); }, [reload]);

  const addBill = async () => {
    const value = Number(amount);
    const members = room?.members.map(member => typeof member === 'string' ? member : member._id) ?? [];
    if (!room) {
      Alert.alert('Room required', 'Create a room in Settings before adding bills.');
      return;
    }
    if (!title.trim() || !Number.isFinite(value) || value <= 0 || !due.trim() || Number.isNaN(Date.parse(due))) {
      Alert.alert('Complete bill details', 'Enter a title, valid amount, and due date (for example 2026-11-15).');
      return;
    }
    if (!members.length) {
      Alert.alert('No room members', 'Add at least one member before creating a bill.');
      return;
    }

    setSaving(true);
    try {
      const share = value / members.length;
      const bill = await billApi.create({
        title: title.trim(),
        totalAmount: value,
        dueDate: new Date(due).toISOString(),
        billType: category,
        roomId: room._id,
        assignedTo: members.map(user => ({ user, shareAmount: share, isPaid: false })),
      });
      setBills(current => [bill, ...current]);
      setTitle('');
      setAmount('');
      setDue('');
    } catch (requestError) {
      Alert.alert('Unable to add bill', getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const total = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Bills & expenses" subtitle="Manage group bills and member shares." />
        <ApiStatus loading={roomLoading || loading} error={roomError || error} onRetry={() => { if (roomError) reloadRoom(); else reload(); }} />
        {!roomLoading && !roomError && !room ? <Text style={styles.muted}>Create a room in Settings before adding bills.</Text> : null}
        <View style={styles.total}><Text style={styles.muted}>Total active bills</Text><Text style={styles.totalValue}>PKR {total.toLocaleString()}</Text></View>
        <Text style={styles.section}>Active bills</Text>
        {bills.map(bill => {
          const billDue = new Date(bill.dueDate);
          const memberCount = bill.assignedTo.length || 1;
          return <View key={bill._id} style={styles.bill}>
            <View style={styles.billInfo}><Text style={styles.billTitle}>{bill.title}</Text><Text style={styles.muted}>{bill.billType} · Due {Number.isNaN(billDue.getTime()) ? bill.dueDate : billDue.toLocaleDateString()}</Text></View>
            <View style={styles.billActions}>
              <Text style={styles.amount}>PKR {bill.totalAmount.toLocaleString()}</Text>
              <Text style={styles.status}>{bill.status}</Text>
              <TouchableOpacity testID={`bill-share-${bill._id}`} onPress={() => setSelected(selected === bill._id ? null : bill._id)}><Text style={styles.link}>{selected === bill._id ? 'Hide shares' : 'View shares'}</Text></TouchableOpacity>
            </View>
            {selected === bill._id ? <Text style={styles.share}>{memberCount} assigned members · PKR {Math.ceil(bill.totalAmount / memberCount).toLocaleString()} average share</Text> : null}
          </View>;
        })}
        <View style={styles.form}>
          <Text style={styles.section}>Add group bill</Text>
          <TextInput testID="admin-bill-title" style={styles.input} value={title} onChangeText={setTitle} placeholder="Bill title (e.g., Electricity)" placeholderTextColor={Colors.textLight} />
          <View style={styles.row}>{BILL_TYPES.map(item => <TouchableOpacity key={item} style={[styles.chip, category === item && styles.chipActive]} onPress={() => setCategory(item)}><Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text></TouchableOpacity>)}</View>
          <TextInput testID="admin-bill-amount" style={styles.input} value={amount} onChangeText={setAmount} placeholder="Amount in PKR (e.g., 2000)" placeholderTextColor={Colors.textLight} keyboardType="numeric" />
          <TextInput testID="admin-bill-due" style={styles.input} value={due} onChangeText={setDue} placeholder="Due date (YYYY-MM-DD)" placeholderTextColor={Colors.textLight} />
          <TouchableOpacity testID="admin-add-bill" style={[styles.submit, saving && styles.disabled]} onPress={addBill} disabled={saving}><Text style={styles.submitText}>{saving ? 'Saving…' : 'Add bill'}</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: 16, paddingBottom: 28, gap: 12 },
  total: { padding: 15, borderRadius: 14, backgroundColor: Colors.teal, gap: 5 },
  muted: { color: Colors.textSub, fontSize: 9 },
  totalValue: { color: '#FFFFFF', fontSize: 23, fontWeight: '900', fontVariant: ['tabular-nums'] },
  section: { color: Colors.textDark, fontSize: 14, fontWeight: '800' },
  bill: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 9, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  billInfo: { flex: 1, gap: 5 },
  billTitle: { color: Colors.textDark, fontSize: 11, fontWeight: '700' },
  billActions: { alignItems: 'flex-end', gap: 4 },
  amount: { color: Colors.textDark, fontSize: 10, fontWeight: '800', fontVariant: ['tabular-nums'] },
  status: { color: Colors.copper, fontSize: 8, fontWeight: '700' },
  link: { color: Colors.teal, fontSize: 9, fontWeight: '700' },
  share: { width: '100%', color: Colors.teal, fontSize: 9 },
  form: { padding: 13, gap: 9, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  input: { minHeight: Input.height, paddingHorizontal: 11, borderWidth: 1, borderColor: Colors.border, borderRadius: 9, color: Colors.textDark },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.tealLight, borderColor: Colors.teal },
  chipText: { color: Colors.textSub, fontSize: 8 },
  chipTextActive: { color: Colors.teal, fontWeight: '700' },
  submit: { minHeight: 43, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: Colors.teal },
  submitText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  disabled: { opacity: 0.6 },
});
