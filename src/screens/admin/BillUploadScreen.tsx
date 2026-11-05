import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BillsStackParamList } from '../../navigation/types';
import { Colors, Input, Card, Font } from '../../theme';

const CATEGORIES = ['Electricity', 'Gas', 'Water', 'Internet'];

type Props = NativeStackScreenProps<BillsStackParamList, 'BillUpload'>;

export default function BillUploadScreen(_props: Props) {
  const [category, setCategory] = useState('Electricity');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Category Pills */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Bill Category</Text>
          <View style={styles.pillRow}>
            {CATEGORIES.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.catPill, category === c && styles.catPillActive]}
                onPress={() => setCategory(c)}>
                <Text style={[styles.catPillText, category === c && styles.catPillTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amount */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Total Bill Amount (PKR)</Text>
          <View style={styles.amountRow}>
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyText}>₨</Text>
            </View>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={Colors.textLight}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Note */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Note (optional)</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
            placeholder="e.g. October electricity bill"
            placeholderTextColor={Colors.textLight}
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Receipt Picker */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Receipt Proof</Text>
          <TouchableOpacity style={styles.filePicker}>
            <Text style={styles.filePickerIcon}>📎</Text>
            <Text style={styles.filePickerText}>Tap to attach receipt photo or PDF</Text>
            <Text style={styles.filePickerSub}>JPG, PNG, PDF — max 5MB</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Preview */}
        {amount ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Split Preview</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Category</Text>
              <Text style={styles.summaryValue}>{category}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount</Text>
              <Text style={[styles.summaryValue, styles.tabular]}>₨ {amount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Per Member (4)</Text>
              <Text style={[styles.summaryValue, styles.tabular, { color: Colors.teal }]}>
                ₨ {(parseFloat(amount.replace(/,/g, '')) / 4 || 0).toFixed(0)}
              </Text>
            </View>
          </View>
        ) : null}

        {/* CTA */}
        <TouchableOpacity style={styles.ctaBtn}>
          <Text style={styles.ctaBtnText}>Calculate & Distribute Share</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  card: {
    backgroundColor: Card.backgroundColor,
    borderWidth: Card.borderWidth,
    borderColor: Card.borderColor,
    borderRadius: Card.borderRadius,
    padding: Card.padding,
    gap: 10,
  },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSub },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catPill: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.canvas,
  },
  catPillActive: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  catPillText: { fontSize: 13, color: Colors.textSub, fontWeight: '500' },
  catPillTextActive: { color: '#fff', fontWeight: '700' },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  currencyBadge: {
    height: Input.height,
    width: 44,
    backgroundColor: Colors.tealLight,
    borderWidth: Input.borderWidth,
    borderColor: Colors.border,
    borderRightWidth: 0,
    borderTopLeftRadius: Input.borderRadius,
    borderBottomLeftRadius: Input.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyText: { fontSize: 18, color: Colors.teal, fontWeight: '700' },
  amountInput: {
    flex: 1,
    height: Input.height,
    borderWidth: Input.borderWidth,
    borderColor: Colors.border,
    borderTopRightRadius: Input.borderRadius,
    borderBottomRightRadius: Input.borderRadius,
    paddingHorizontal: 14,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    fontFamily: Font.bodyBold,
    fontVariant: ['tabular-nums'],
    backgroundColor: Colors.card,
  },
  input: {
    height: Input.height,
    borderWidth: Input.borderWidth,
    borderColor: Colors.border,
    borderRadius: Input.borderRadius,
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.textDark,
    backgroundColor: Colors.canvas,
  },
  filePicker: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Card.borderRadius,
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.canvas,
  },
  filePickerIcon: { fontSize: 28 },
  filePickerText: { fontSize: 13, color: Colors.textDark, fontWeight: '500' },
  filePickerSub: { fontSize: 11, color: Colors.textLight },
  summaryCard: {
    backgroundColor: Colors.tealLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.teal + '44',
    padding: 16,
    gap: 8,
  },
  summaryTitle: { fontSize: 13, fontWeight: '700', color: Colors.teal },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 13, color: Colors.textSub },
  summaryValue: { fontSize: 13, fontWeight: '600', color: Colors.textDark },
  tabular: { fontFamily: Font.body, fontVariant: ['tabular-nums'] },
  ctaBtn: {
    height: Input.height,
    backgroundColor: Colors.teal,
    borderRadius: Input.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  ctaBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
