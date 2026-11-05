import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DocumentPickerResponse } from '@react-native-documents/picker';

import FilePickerButton from '../../components/FilePickerButton';
import ScreenHeader from '../../components/ScreenHeader';
import { Colors, Input } from '../../theme';

const BILLS = [
  { name: 'Electricity', amount: 1050, due: 'Oct 28', status: 'Due soon' },
  { name: 'Internet', amount: 625, due: 'Nov 01', status: 'Upcoming' },
  { name: 'Water', amount: 380, due: 'Nov 05', status: 'Upcoming' },
];
const CATEGORIES = ['Food', 'Utilities', 'Daily Grocery', 'Maintenance'] as const;
type Method = 'Digital Transfer' | 'Cash Payment';

export default function BillsExpensesScreen() {
  const [method, setMethod] = useState<Method>('Digital Transfer');
  const [channel, setChannel] = useState<'Raast' | 'Easypaisa'>('Raast');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Utilities');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [proof, setProof] = useState<DocumentPickerResponse | null>(null);
  const [submitted, setSubmitted] = useState<{ id: string; title: string; category: string; amount: number; method: string; proof?: string }[]>([]);

  const submit = () => {
    const paid = Number(amount);
    if (!title.trim() || !Number.isFinite(paid) || paid <= 0) {
      Alert.alert('Details required', 'Enter an expense title and a valid paid amount.');
      return;
    }
    if ((!proof && method === 'Cash Payment') || (!proof && method === 'Digital Transfer' && !reference.trim())) {
      Alert.alert('Payment proof required', method === 'Cash Payment' ? 'Attach your cash receipt.' : 'Enter a transfer reference or attach proof.');
      return;
    }
    setSubmitted(current => [{ id: `${Date.now()}`, title: title.trim(), category, amount: paid, method, proof: proof?.name ?? undefined }, ...current]);
    setTitle('');
    setAmount('');
    setReference('');
    setProof(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Bills & expenses" subtitle="Shared utilities and your payment submissions" />
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Your share across active bills</Text>
          <Text style={styles.summaryValue}>PKR {BILLS.reduce((sum, bill) => sum + bill.amount, 0).toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>{BILLS.length} current bills</Text>
        </View>
        <Text style={styles.section}>Shared utility bills</Text>
        {BILLS.map(bill => (
          <View key={bill.name} style={styles.bill}>
            <View style={styles.billInfo}>
              <Text style={styles.billTitle}>{bill.name}</Text>
              <Text style={styles.muted}>{bill.status} · Due {bill.due}</Text>
            </View>
            <Text style={styles.money}>PKR {bill.amount.toLocaleString()}</Text>
          </View>
        ))}
        <View style={styles.form}>
          <Text style={styles.section}>Submit payment proof</Text>
          <Label text="Expense title" />
          <TextInput testID="expense-title" style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. October electricity payment" />
          <Label text="Category" />
          <TouchableOpacity testID="expense-category-dropdown" style={styles.dropdown} onPress={() => setCategoryOpen(open => !open)}>
            <Text style={styles.dropdownText}>{category}</Text><Text style={styles.muted}>{categoryOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {categoryOpen ? <View style={styles.options}>{CATEGORIES.map(item => (
            <TouchableOpacity key={item} testID={`expense-category-${item.toLowerCase().replace(' ', '-')}`} style={styles.option} onPress={() => { setCategory(item); setCategoryOpen(false); }}>
              <Text style={item === category ? styles.selectedOption : styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}</View> : null}
          <Label text="Payment method" />
          <View style={styles.row}>{(['Digital Transfer', 'Cash Payment'] as const).map(item => (
            <TouchableOpacity key={item} testID={`payment-method-${item === 'Cash Payment' ? 'cash' : 'digital'}`} accessibilityState={{ selected: method === item }} style={[styles.method, method === item && styles.methodSelected]} onPress={() => setMethod(item)}>
              <Text style={[styles.methodText, method === item && styles.methodTextSelected]}>{item}</Text>
            </TouchableOpacity>
          ))}</View>
          {method === 'Digital Transfer' ? (
            <>
              <Label text="Transfer channel" />
              <View style={styles.row}>{(['Raast', 'Easypaisa'] as const).map(item => (
                <TouchableOpacity key={item} testID={`transfer-channel-${item.toLowerCase()}`} style={[styles.method, channel === item && styles.methodSelected]} onPress={() => setChannel(item)}>
                  <Text style={[styles.methodText, channel === item && styles.methodTextSelected]}>{item}</Text>
                </TouchableOpacity>
              ))}</View>
              <Label text={`${channel} reference (optional with proof)`} />
              <TextInput testID="payment-reference" style={styles.input} value={reference} onChangeText={setReference} placeholder="Enter transaction reference" />
            </>
          ) : <Text style={styles.muted}>Cash receipts are reviewed by the group admin.</Text>}
          <Label text="Amount paid (PKR)" />
          <TextInput testID="payment-amount" style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0" />
          <FilePickerButton testID="payment-proof-picker" onPicked={setProof} />
          {proof ? <Text style={styles.muted}>Attached: {proof.name ?? 'receipt file'}</Text> : null}
          <TouchableOpacity testID="payment-submit" style={styles.submit} onPress={submit}><Text style={styles.submitText}>Submit payment</Text></TouchableOpacity>
          {submitted.map(item => <View key={item.id} style={styles.submission}>
            <Text style={styles.billTitle}>{item.title} · PKR {item.amount.toLocaleString()}</Text>
            <Text style={styles.muted}>{item.category} · {item.method} · Pending approval{item.proof ? ` · ${item.proof}` : ''}</Text>
          </View>)}
        </View>
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
  billTitle: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  muted: { color: Colors.textSub, fontSize: 10 },
  money: { color: Colors.textDark, fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  form: { gap: 10, marginTop: 4, padding: 14, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16 },
  label: { color: Colors.textSub, fontSize: 11, fontWeight: '600', marginTop: 2 },
  input: { height: Input.height, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, color: Colors.textDark, backgroundColor: Colors.canvas },
  dropdown: { height: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: 10 },
  dropdownText: { color: Colors.textDark, fontSize: 12, fontWeight: '600' },
  options: { borderWidth: 1, borderColor: Colors.border, borderRadius: 10, overflow: 'hidden' },
  option: { padding: 11, borderBottomWidth: 1, borderColor: Colors.border },
  optionText: { color: Colors.textSub, fontSize: 11 },
  selectedOption: { color: Colors.teal, fontSize: 11, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8 },
  method: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 5 },
  methodSelected: { backgroundColor: Colors.tealLight, borderColor: Colors.teal },
  methodText: { color: Colors.textSub, fontSize: 10, fontWeight: '600' },
  methodTextSelected: { color: Colors.teal },
  submit: { minHeight: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: Colors.teal },
  submitText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  submission: { padding: 10, borderRadius: 10, backgroundColor: Colors.tealLight, gap: 4 },
});
