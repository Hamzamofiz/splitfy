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
import type { MaintenanceStackParamList } from '../../navigation/types';
import { Colors, Input, Card, Font } from '../../theme';

const MEMBERS = [
  { id: '1', name: 'Ali Hassan', room: 'Room 1' },
  { id: '2', name: 'Sara Khan', room: 'Room 2' },
  { id: '3', name: 'Usman Raza', room: 'Room 3' },
  { id: '4', name: 'Fatima Malik', room: 'Room 4' },
];

const ISSUE_TYPES = ['Plumbing', 'Electrical', 'Appliance', 'Structural', 'Other'];

type Props = NativeStackScreenProps<MaintenanceStackParamList, 'AdminMaintenanceAllocator'>;

export default function AdminMaintenanceAllocator(_props: Props) {
  const [issueType, setIssueType] = useState('Plumbing');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [selected, setSelected] = useState<string[]>(['1', '2', '3', '4']);

  const toggleMember = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const perShare = selected.length > 0 && cost
    ? (parseFloat(cost) / selected.length).toFixed(0)
    : '0';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Issue Card */}
        <View style={styles.card}>
          <View style={styles.issueHeader}>
            <Text style={styles.issueIcon}>🔧</Text>
            <View>
              <Text style={styles.cardTitle}>Maintenance Issue</Text>
              <Text style={styles.cardSub}>Log and allocate repair expense</Text>
            </View>
          </View>

          <Text style={styles.fieldLabel}>Issue Type</Text>
          <View style={styles.pillRow}>
            {ISSUE_TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.pill, issueType === t && styles.pillActive]}
                onPress={() => setIssueType(t)}>
                <Text style={[styles.pillText, issueType === t && styles.pillTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
            placeholder="Describe the issue..."
            placeholderTextColor={Colors.textLight}
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Cost Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cost Breakdown</Text>
          <Text style={styles.fieldLabel}>Total Repair Cost (PKR)</Text>
          <View style={styles.amountRow}>
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyText}>₨</Text>
            </View>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={Colors.textLight}
              keyboardType="numeric"
              value={cost}
              onChangeText={setCost}
            />
          </View>
        </View>

        {/* Member Selection */}
        <View style={styles.card}>
          <View style={styles.memberHeader}>
            <Text style={styles.cardTitle}>Allocate to Members</Text>
            <TouchableOpacity onPress={() =>
              setSelected(selected.length === MEMBERS.length ? [] : MEMBERS.map(m => m.id))}>
              <Text style={styles.selectAll}>
                {selected.length === MEMBERS.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>
          {MEMBERS.map(m => (
            <TouchableOpacity
              key={m.id}
              style={[styles.memberRow, selected.includes(m.id) && styles.memberRowActive]}
              onPress={() => toggleMember(m.id)}>
              <View style={[styles.checkbox, selected.includes(m.id) && styles.checkboxActive]}>
                {selected.includes(m.id) && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{m.name}</Text>
                <Text style={styles.memberRoom}>{m.room}</Text>
              </View>
              {selected.includes(m.id) && cost ? (
                <Text style={[styles.memberShare, styles.tabular]}>₨ {perShare}</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        {/* Split Summary */}
        {cost && selected.length > 0 ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Split Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Cost</Text>
              <Text style={[styles.summaryValue, styles.tabular]}>₨ {cost}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Members Selected</Text>
              <Text style={[styles.summaryValue, styles.tabular]}>{selected.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Per Member</Text>
              <Text style={[styles.summaryValue, { color: Colors.teal }, styles.tabular]}>₨ {perShare}</Text>
            </View>
          </View>
        ) : null}

        <TouchableOpacity style={styles.ctaBtn}>
          <Text style={styles.ctaBtnText}>Split & Notify Members</Text>
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
  issueHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  issueIcon: { fontSize: 28 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.textDark },
  cardSub: { fontSize: 12, color: Colors.textSub },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSub, marginTop: 4 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.canvas,
  },
  pillActive: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  pillText: { fontSize: 12, color: Colors.textSub },
  pillTextActive: { color: '#fff', fontWeight: '600' },
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
  amountRow: { flexDirection: 'row', alignItems: 'center' },
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
  memberHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectAll: { fontSize: 12, color: Colors.teal, fontWeight: '600' },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.canvas,
  },
  memberRowActive: { borderColor: Colors.teal, backgroundColor: Colors.tealLight },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 13, fontWeight: '600', color: Colors.textDark },
  memberRoom: { fontSize: 11, color: Colors.textSub },
  memberShare: { fontSize: 13, fontWeight: '700', color: Colors.teal },
  tabular: { fontFamily: Font.body, fontVariant: ['tabular-nums'] },
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
  ctaBtn: {
    height: Input.height,
    backgroundColor: Colors.teal,
    borderRadius: Input.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
