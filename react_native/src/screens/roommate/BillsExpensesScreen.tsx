import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ApiStatus from '../../components/ApiStatus';
import ScreenHeader from '../../components/ScreenHeader';
import { useRoleSession } from '../../navigation/RoleSessionContext';
import { billApi, expenseApi, getApiErrorMessage, type Bill, type Expense } from '../../services/api';
import useRoomData from '../../services/useRoomData';
import { Colors, Input } from '../../theme';

const CATEGORIES = ['Food', 'Utilities', 'Maintenance', 'Other'];

export default function BillsExpensesScreen() {
  const { user } = useRoleSession();
  const { room, loading: roomLoading, error: roomError, reload: reloadRoom } = useRoomData();
  const [bills, setBills] = useState<Bill[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Utilities');
  const [amount, setAmount] = useState('');

  const reload = useCallback(async () => {
    if (!room) return;
    setLoading(true);
    setError(null);
    try {
      const [nextBills, nextExpenses] = await Promise.all([billApi.list(room._id), expenseApi.list(room._id)]);
      setBills(nextBills);
      setExpenses(nextExpenses);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [room]);

  useEffect(() => { reload(); }, [reload]);

  const myAssignments = bills.flatMap(bill => bill.assignedTo
    .filter(assignment => typeof assignment.user === 'string' ? assignment.user === user?._id : assignment.user._id === user?._id)
    .map(assignment => ({ bill, assignment })));

  const submit = async () => {
    const paid = Number(amount);
    if (!room || !user) {
      Alert.alert('Room required', 'Join a room before submitting an expense.');
      return;
    }
    if (!title.trim() || !Number.isFinite(paid) || paid <= 0) {
      Alert.alert('Details required', 'Enter an expense title and a valid amount.');
      return;
    }
    setSaving(true);
    try {
      const splitBetween = room.members.map(member => typeof member === 'string' ? member : member._id);
      const expense = await expenseApi.create({
        title: title.trim(),
        amount: paid,
        roomId: room._id,
        splitBetween,
        category,
        approvalStatus: 'PENDING',
      });
      setExpenses(current => [expense, ...current]);
      setTitle('');
      setAmount('');
    } catch (requestError) {
      Alert.alert('Unable to submit expense', getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const payBill = async (billId: string) => {
    try {
      const updatedBill = await billApi.markPaid(billId);
      setBills(current => current.map(bill => bill._id === updatedBill._id ? updatedBill : bill));
    } catch (requestError) {
      Alert.alert('Unable to update payment', getApiErrorMessage(requestError));
    }
  };

  const totalShare = myAssignments.reduce((sum, item) => sum + item.assignment.shareAmount, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Bills & expenses" subtitle="Shared utilities and your room expenses" />
        <ApiStatus loading={roomLoading || loading} error={roomError || error} onRetry={() => { if (roomError) reloadRoom(); else reload(); }} />
        {!roomLoading && !roomError && !room ? <Text style={styles.muted}>Join a room to view bills and submit shared expenses.</Text> : null}
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Your share across current bills</Text>
          <Text style={styles.summaryValue}>PKR {totalShare.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>{myAssignments.length} assigned bills</Text>
        </View>
        <Text style={styles.section}>Shared utility bills</Text>
        {myAssignments.map(({ bill, assignment }) => (
          <View key={bill._id} style={styles.bill}>
            <View style={styles.billInfo}><Text style={styles.billTitle}>{bill.title}</Text><Text style={styles.muted}>{bill.billType} · Due {new Date(bill.dueDate).toLocaleDateString()}</Text></View>
            <View style={styles.billActions}>
              <Text style={styles.money}>PKR {assignment.shareAmount.toLocaleString()}</Text>
              {assignment.isPaid ? <Text style={styles.paid}>Paid</Text> : <TouchableOpacity testID={`roommate-pay-bill-${bill._id}`} onPress={() => payBill(bill._id)}><Text style={styles.payLink}>Mark paid</Text></TouchableOpacity>}
            </View>
          </View>
        ))}
        {!loading && room && myAssignments.length === 0 ? <Text style={styles.muted}>No bills are currently assigned to you.</Text> : null}
        <View style={styles.form}>
          <Text style={styles.section}>Record a shared expense</Text>
          <Label text="Expense title" />
          <TextInput testID="expense-title" style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Shared groceries" />
          <Label text="Category" />
          <View style={styles.row}>{CATEGORIES.map(item => (
            <TouchableOpacity key={item} testID={`expense-category-${item.toLowerCase()}`} accessibilityState={{ selected: category === item }} style={[styles.method, category === item && styles.methodSelected]} onPress={() => setCategory(item)}>
              <Text style={[styles.methodText, category === item && styles.methodTextSelected]}>{item}</Text>
            </TouchableOpacity>
          ))}</View>
          <Label text="Amount paid (PKR)" />
          <TextInput testID="payment-amount" style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0" />
          <Text style={styles.muted}>This expense will be split among the room members and submitted for admin review.</Text>
          <TouchableOpacity testID="payment-submit" style={[styles.submit, saving && styles.disabled]} disabled={saving} onPress={submit}><Text style={styles.submitText}>{saving ? 'Submitting…' : 'Submit expense'}</Text></TouchableOpacity>
        </View>
        <Text style={styles.section}>Room expenses</Text>
        {expenses.map(expense => <View key={expense._id} style={styles.submission}>
          <Text style={styles.billTitle}>{expense.title} · PKR {expense.amount.toLocaleString()}</Text>
          <Text style={styles.muted}>{expense.category} · {expense.approvalStatus}</Text>
        </View>)}
        {!loading && room && expenses.length === 0 ? <Text style={styles.muted}>No shared expenses have been recorded.</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Label({ text }: { text: string }) { return <Text style={styles.label}>{text}</Text>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: 16, paddingBottom: 28, gap: 12 },
  summary: { backgroundColor: Colors.teal, padding: 16, borderRadius: 16, gap: 4 },
  summaryLabel: { color: '#D5FFFA', fontSize: 11 },
  summaryValue: { color: '#FFFFFF', fontSize: 25, fontWeight: '900', fontVariant: ['tabular-nums'] },
  section: { color: Colors.textDark, fontSize: 15, fontWeight: '800' },
  bill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, padding: 13 },
  billInfo: { flex: 1, gap: 4 },
  billActions: { alignItems: 'flex-end', gap: 5 },
  billTitle: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  muted: { color: Colors.textSub, fontSize: 10 },
  money: { color: Colors.textDark, fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  paid: { color: Colors.teal, fontSize: 9, fontWeight: '700' },
  payLink: { color: Colors.teal, fontSize: 9, fontWeight: '700' },
  form: { gap: 10, marginTop: 4, padding: 14, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16 },
  label: { color: Colors.textSub, fontSize: 11, fontWeight: '600', marginTop: 2 },
  input: { height: Input.height, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, color: Colors.textDark, backgroundColor: Colors.canvas },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  method: { minHeight: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 10 },
  methodSelected: { backgroundColor: Colors.tealLight, borderColor: Colors.teal },
  methodText: { color: Colors.textSub, fontSize: 10, fontWeight: '600' },
  methodTextSelected: { color: Colors.teal },
  submit: { minHeight: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: Colors.teal },
  submitText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  disabled: { opacity: 0.6 },
  submission: { padding: 10, borderRadius: 10, backgroundColor: Colors.card, gap: 4 },
});
