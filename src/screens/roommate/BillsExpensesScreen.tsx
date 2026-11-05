import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import FileAttachmentPicker from '../../components/FileAttachmentPicker';
import RoommatePageHeader from '../../components/RoommatePageHeader';
import { Colors, Input } from '../../theme';

const BILLS = [
  { id: 'electricity', name: 'Electricity', due: 'Oct 28', amount: 1050, status: 'Due soon' },
  { id: 'internet', name: 'Internet', due: 'Nov 01', amount: 625, status: 'Upcoming' },
  { id: 'water', name: 'Water', due: 'Nov 05', amount: 380, status: 'Upcoming' },
];
const TOTAL_SHARE = BILLS.reduce((total, bill) => total + bill.amount, 0);

type PaymentMethod = 'Cash' | 'Digital';
type ExpenseCategory = 'Food' | 'Utilities' | 'Daily Grocery' | 'Maintenance';
type TransferChannel = 'Raast' | 'Easypaisa';
type ExpenseSubmission = {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  method: PaymentMethod;
  channel?: TransferChannel;
  proofName?: string;
};

const EXPENSE_CATEGORIES: ExpenseCategory[] = ['Food', 'Utilities', 'Daily Grocery', 'Maintenance'];

export default function BillsExpensesScreen() {
  const [method, setMethod] = useState<PaymentMethod>('Digital');
  const [channel, setChannel] = useState<TransferChannel>('Raast');
  const [expenseTitle, setExpenseTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Utilities');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [attachment, setAttachment] = useState<DocumentPickerResponse | null>(null);
  const [submissions, setSubmissions] = useState<ExpenseSubmission[]>([]);

  const submitProof = () => {
    if (!expenseTitle.trim()) {
      Alert.alert('Expense title required', 'Enter a short title for this expense.');
      return;
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Amount required', 'Enter a payment amount greater than zero.');
      return;
    }

    if ((method === 'Digital' && !reference.trim() && !attachment) || (method === 'Cash' && !attachment)) {
      Alert.alert(
        'Payment proof required',
        method === 'Cash'
          ? 'Attach a cash receipt or payment confirmation.'
          : 'Add a transaction reference or attach a receipt.',
      );
      return;
    }

    const submission: ExpenseSubmission = {
      id: Date.now().toString(),
      title: expenseTitle.trim(),
      category,
      amount: parsedAmount,
      method,
      channel: method === 'Digital' ? channel : undefined,
      proofName: attachment?.name ?? undefined,
    };
    setSubmissions(current => [submission, ...current]);
    setExpenseTitle('');
    setAmount('');
    setReference('');
    setAttachment(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <RoommatePageHeader
          title="Bills & expenses"
          subtitle="Shared bills and your payment submissions"
        />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Your current share</Text>
          <Text style={styles.summaryAmount}>PKR {TOTAL_SHARE.toLocaleString()}</Text>
          <Text style={styles.summaryHint}>Across {BILLS.length} active bills</Text>
        </View>

        <Text style={styles.sectionTitle}>Shared utility bills</Text>
        {BILLS.map(bill => (
          <View key={bill.id} style={styles.billCard}>
            <View style={styles.billInfo}>
              <Text style={styles.billName}>{bill.name}</Text>
              <View style={styles.billMeta}>
                <Text style={[styles.billStatus, bill.status === 'Due soon' && styles.billStatusSoon]}>
                  {bill.status}
                </Text>
                <Text style={styles.billDue}>Due {bill.due}</Text>
              </View>
            </View>
            <Text style={styles.billAmount}>PKR {bill.amount.toLocaleString()}</Text>
          </View>
        ))}

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Submit payment proof</Text>
          <Text style={styles.fieldLabel}>Expense title</Text>
          <TextInput
            testID="expense-title"
            style={styles.input}
            accessibilityLabel="Expense title"
            placeholder="e.g. October electricity payment"
            placeholderTextColor={Colors.textLight}
            value={expenseTitle}
            onChangeText={setExpenseTitle}
          />

          <Text style={styles.fieldLabel}>Category</Text>
          <TouchableOpacity
            testID="expense-category-dropdown"
            accessibilityRole="button"
            accessibilityState={{ expanded: categoryOpen }}
            style={styles.categoryDropdown}
            onPress={() => setCategoryOpen(open => !open)}
          >
            <Text style={styles.categoryDropdownText}>{category}</Text>
            <Text style={styles.categoryDropdownArrow}>{categoryOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {categoryOpen ? (
            <View style={styles.categoryOptions}>
              {EXPENSE_CATEGORIES.map(item => (
                <TouchableOpacity
                  key={item}
                  testID={`expense-category-${item.toLowerCase().replace(' ', '-')}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: item === category }}
                  style={styles.categoryOption}
                  onPress={() => {
                    setCategory(item);
                    setCategoryOpen(false);
                  }}
                >
                  <Text style={[styles.categoryOptionText, category === item && styles.categoryOptionSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <Text style={styles.fieldLabel}>Payment method</Text>
          <View style={styles.methodRow}>
            {(['Digital', 'Cash'] as const).map(item => (
              <TouchableOpacity
                key={item}
                testID={`payment-method-${item.toLowerCase()}`}
                accessibilityRole="button"
                accessibilityState={{ selected: method === item }}
                onPress={() => setMethod(item)}
                style={[styles.methodButton, method === item && styles.methodButtonActive]}
              >
                <Text style={[styles.methodText, method === item && styles.methodTextActive]}>
                  {item === 'Digital' ? 'Digital transfer' : 'Cash payment'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Amount paid (PKR)</Text>
          <TextInput
            testID="payment-amount"
            style={styles.input}
            accessibilityLabel="Amount paid in PKR"
            placeholder="0"
            placeholderTextColor={Colors.textLight}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {method === 'Digital' ? (
            <>
              <Text style={styles.fieldLabel}>Transfer channel</Text>
              <View style={styles.methodRow}>
                {(['Raast', 'Easypaisa'] as const).map(item => (
                  <TouchableOpacity
                    key={item}
                    testID={`transfer-channel-${item.toLowerCase()}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: channel === item }}
                    onPress={() => setChannel(item)}
                    style={[styles.methodButton, channel === item && styles.methodButtonActive]}
                  >
                    <Text style={[styles.methodText, channel === item && styles.methodTextActive]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.fieldLabel}>Transaction reference (optional with receipt)</Text>
              <TextInput
                testID="payment-reference"
                style={styles.input}
                accessibilityLabel="Transaction reference"
                placeholder="Enter transfer reference"
                placeholderTextColor={Colors.textLight}
                value={reference}
                onChangeText={setReference}
              />
            </>
          ) : (
            <Text style={styles.cashNote}>Cash payments will be marked pending until verified by your group.</Text>
          )}
          <FileAttachmentPicker
            attachment={attachment}
            onAttachmentChange={setAttachment}
            kind="payment-proof"
            buttonTestID="payment-proof-picker"
          />

          <TouchableOpacity
            testID="payment-submit"
            accessibilityRole="button"
            style={styles.submitButton}
            onPress={submitProof}
          >
            <Text style={styles.submitText}>Submit payment</Text>
          </TouchableOpacity>
          {submissions.map(submission => (
            <View key={submission.id} accessibilityLiveRegion="polite" style={styles.statusCard}>
              <View style={styles.submissionHeader}>
                <Text style={styles.submissionTitle}>{submission.title}</Text>
                <Text style={styles.submissionBadge}>
                  {submission.proofName ? 'Receipt Attached' : 'Pending Approval'}
                </Text>
              </View>
              <Text style={styles.statusText}>
                {submission.method} payment of PKR {submission.amount.toLocaleString()} submitted
                {submission.method === 'Digital' ? ` via ${submission.channel}` : ''} for verification
              </Text>
              <Text style={styles.submissionMeta}>
                {submission.category}{submission.proofName ? ` · ${submission.proofName}` : ''}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 28 },
  summaryCard: {
    backgroundColor: Colors.teal,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  summaryLabel: { color: '#E6FFFB', fontSize: 12 },
  summaryAmount: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', fontVariant: ['tabular-nums'] },
  summaryHint: { color: '#CCFBF1', fontSize: 11 },
  sectionTitle: { color: Colors.textDark, fontSize: 15, fontWeight: '700' },
  billCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 13,
  },
  billInfo: { flex: 1, gap: 4 },
  billName: { color: Colors.textDark, fontSize: 13, fontWeight: '700' },
  billMeta: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  billStatus: { color: Colors.teal, backgroundColor: Colors.tealLight, fontSize: 9, fontWeight: '700', overflow: 'hidden', borderRadius: 9, paddingHorizontal: 7, paddingVertical: 3 },
  billStatusSoon: { color: Colors.copper, backgroundColor: Colors.copperLight },
  billDue: { color: Colors.textSub, fontSize: 10 },
  billAmount: { color: Colors.textDark, fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  formCard: {
    marginTop: 4,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  fieldLabel: { color: Colors.textSub, fontSize: 11, fontWeight: '600', marginTop: 2 },
  methodRow: { flexDirection: 'row', gap: 8 },
  methodButton: {
    flex: 1,
    minHeight: 42,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  methodButtonActive: { backgroundColor: Colors.tealLight, borderColor: Colors.teal },
  methodText: { color: Colors.textSub, fontSize: 11, fontWeight: '600' },
  methodTextActive: { color: Colors.teal },
  categoryDropdown: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, backgroundColor: Colors.canvas },
  categoryDropdownText: { color: Colors.textDark, fontSize: 12, fontWeight: '600' },
  categoryDropdownArrow: { color: Colors.textSub, fontSize: 10 },
  categoryOptions: { borderWidth: 1, borderColor: Colors.border, borderRadius: 10, backgroundColor: Colors.card, overflow: 'hidden' },
  categoryOption: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  categoryOptionText: { color: Colors.textSub, fontSize: 11 },
  categoryOptionSelected: { color: Colors.teal, fontWeight: '700' },
  input: {
    height: Input.height,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: Colors.textDark,
    backgroundColor: Colors.canvas,
  },
  cashNote: { color: Colors.textSub, fontSize: 11, lineHeight: 16 },
  submitButton: { backgroundColor: Colors.teal, borderRadius: 10, alignItems: 'center', paddingVertical: 12 },
  submitText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  statusCard: { backgroundColor: Colors.tealLight, borderRadius: 10, padding: 10 },
  statusText: { color: Colors.teal, fontSize: 11, fontWeight: '600' },
  submissionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 5 },
  submissionTitle: { flex: 1, color: Colors.textDark, fontSize: 11, fontWeight: '700' },
  submissionBadge: { color: Colors.copper, fontSize: 8, fontWeight: '700' },
  submissionMeta: { color: Colors.textSub, fontSize: 9, marginTop: 4 },
});
