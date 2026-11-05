import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/ScreenHeader';
import { Colors, Input } from '../../theme';

type Bill = { id: string; title: string; category: string; amount: number; due: string; status: string };
const CATEGORIES = ['Utilities', 'Internet', 'Food', 'Maintenance', 'Other'];

export default function AdminBillsScreen() {
  const [bills, setBills] = useState<Bill[]>([
    { id: 'electricity', title: 'Electricity', category: 'Utilities', amount: 4200, due: 'Oct 28', status: 'Due soon' },
    { id: 'gas', title: 'Gas', category: 'Utilities', amount: 1850, due: 'Oct 30', status: 'Pending' },
    { id: 'internet', title: 'Internet', category: 'Internet', amount: 2500, due: 'Nov 01', status: 'Upcoming' },
  ]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [due, setDue] = useState('');
  const [category, setCategory] = useState('Utilities');
  const [selected, setSelected] = useState<string | null>(null);

  const addBill = () => {
    const value = Number(amount);
    if (!title.trim() || !Number.isFinite(value) || value <= 0 || !due.trim()) {
      Alert.alert('Complete bill details', 'Enter a title, valid amount, and due date.');
      return;
    }
    setBills(current => [{ id: `${Date.now()}`, title: title.trim(), category, amount: value, due, status: 'Upcoming' }, ...current]);
    setTitle(''); setAmount(''); setDue('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Bills & expenses" subtitle="Manage group bills and member shares." />
        <View style={styles.total}><Text style={styles.muted}>Total active bills</Text><Text style={styles.totalValue}>PKR {bills.reduce((sum, bill) => sum + bill.amount, 0).toLocaleString()}</Text></View>
        <Text style={styles.section}>Active bills</Text>
        {bills.map(bill => <View key={bill.id} style={styles.bill}>
          <View style={styles.billInfo}><Text style={styles.billTitle}>{bill.title}</Text><Text style={styles.muted}>{bill.category} · Due {bill.due}</Text></View>
          <View style={styles.billActions}><Text style={styles.amount}>PKR {bill.amount.toLocaleString()}</Text><Text style={styles.status}>{bill.status}</Text><TouchableOpacity testID={`bill-share-${bill.id}`} onPress={() => setSelected(selected === bill.id ? null : bill.id)}><Text style={styles.link}>{selected === bill.id ? 'Hide shares' : 'View shares'}</Text></TouchableOpacity></View>
          {selected === bill.id ? <Text style={styles.share}>4 active members · PKR {Math.ceil(bill.amount / 4).toLocaleString()} per member</Text> : null}
        </View>)}
        <View style={styles.form}>
          <Text style={styles.section}>Add group expense</Text>
          <TextInput testID="admin-bill-title" style={styles.input} value={title} onChangeText={setTitle} placeholder="Expense title" />
          <View style={styles.row}>{CATEGORIES.map(item => <TouchableOpacity key={item} style={[styles.chip, category === item && styles.chipActive]} onPress={() => setCategory(item)}><Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text></TouchableOpacity>)}</View>
          <TextInput testID="admin-bill-amount" style={styles.input} value={amount} onChangeText={setAmount} placeholder="Total amount (PKR)" keyboardType="numeric" />
          <TextInput testID="admin-bill-due" style={styles.input} value={due} onChangeText={setDue} placeholder="Due date (e.g. Nov 15)" />
          <TouchableOpacity testID="admin-add-bill" style={styles.submit} onPress={addBill}><Text style={styles.submitText}>Add expense</Text></TouchableOpacity>
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
});
