import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LedgerStackParamList } from '../../navigation/types';
import { Colors, Card, Font } from '../../theme';

type Transaction = {
  id: string;
  member: string;
  type: 'Credit' | 'Debit' | 'Settlement';
  description: string;
  amount: string;
  date: string;
  balance: string;
  balanceType: 'positive' | 'negative' | 'zero';
};

const TRANSACTIONS: Transaction[] = [
  { id: '1', member: 'Ali Hassan', type: 'Debit', description: 'Electricity share Oct', amount: '1,050', date: 'Oct 05', balance: '-1,050', balanceType: 'negative' },
  { id: '2', member: 'Ali Hassan', type: 'Credit', description: 'Payment received', amount: '1,050', date: 'Oct 07', balance: '0', balanceType: 'zero' },
  { id: '3', member: 'Sara Khan', type: 'Debit', description: 'Gas share Oct', amount: '462', date: 'Oct 08', balance: '-462', balanceType: 'negative' },
  { id: '4', member: 'Usman Raza', type: 'Debit', description: 'Internet share Oct', amount: '625', date: 'Oct 10', balance: '-1,087', balanceType: 'negative' },
  { id: '5', member: 'Fatima Malik', type: 'Settlement', description: 'Full month settlement', amount: '4,600', date: 'Oct 12', balance: '0', balanceType: 'zero' },
  { id: '6', member: 'Sara Khan', type: 'Credit', description: 'Partial payment', amount: '300', date: 'Oct 15', balance: '-162', balanceType: 'negative' },
  { id: '7', member: 'Usman Raza', type: 'Debit', description: 'Plumbing repair share', amount: '800', date: 'Oct 14', balance: '-1,887', balanceType: 'negative' },
  { id: '8', member: 'Ali Hassan', type: 'Credit', description: 'Advance payment', amount: '500', date: 'Oct 20', balance: '+500', balanceType: 'positive' },
];

const MEMBERS = ['All', 'Ali Hassan', 'Sara Khan', 'Usman Raza', 'Fatima Malik'];

const TYPE_COLORS: Record<string, string> = {
  Credit: Colors.success,
  Debit: Colors.danger,
  Settlement: Colors.teal,
};

const TYPE_ICONS: Record<string, string> = {
  Credit: '↓',
  Debit: '↑',
  Settlement: '✓',
};

type Props = NativeStackScreenProps<LedgerStackParamList, 'AdminLedgerAudit'>;

export default function AdminLedgerAuditScreen(_props: Props) {
  const [memberFilter, setMemberFilter] = useState('All');

  const filtered = TRANSACTIONS.filter(
    t => memberFilter === 'All' || t.member === memberFilter,
  );

  const totalDebits = filtered
    .filter(t => t.type === 'Debit')
    .reduce((s, t) => s + parseFloat(t.amount.replace(/,/g, '')), 0);
  const totalCredits = filtered
    .filter(t => t.type === 'Credit' || t.type === 'Settlement')
    .reduce((s, t) => s + parseFloat(t.amount.replace(/,/g, '')), 0);

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.txRow}>
      <View style={[styles.txTypeIcon, { backgroundColor: TYPE_COLORS[item.type] + '18' }]}>
        <Text style={[styles.txTypeText, { color: TYPE_COLORS[item.type] }]}>
          {TYPE_ICONS[item.type]}
        </Text>
      </View>
      <View style={styles.txMiddle}>
        <Text style={styles.txDesc}>{item.description}</Text>
        <Text style={styles.txMeta}>{item.member} · {item.date}</Text>
      </View>
      <View style={styles.txRight}>
        <Text style={[
          styles.txAmount,
          styles.tabular,
          { color: item.type === 'Credit' || item.type === 'Settlement' ? Colors.success : Colors.danger },
        ]}>
          {item.type === 'Debit' ? '−' : '+'}₨ {item.amount}
        </Text>
        <View style={[
          styles.balanceBadge,
          {
            backgroundColor:
              item.balanceType === 'positive' ? Colors.successLight :
              item.balanceType === 'negative' ? Colors.dangerLight :
              Colors.tealLight,
          },
        ]}>
          <Text style={[
            styles.balanceText,
            styles.tabular,
            {
              color:
                item.balanceType === 'positive' ? Colors.success :
                item.balanceType === 'negative' ? Colors.danger :
                Colors.teal,
            },
          ]}>
            ₨ {item.balance}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.exportBtn}>
          <Text style={styles.exportBtnText}>📤 Export</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderLeftColor: Colors.danger }]}>
          <Text style={styles.summaryLabel}>Total Debits</Text>
          <Text style={[styles.summaryValue, styles.tabular, { color: Colors.danger }]}>
            ₨ {totalDebits.toLocaleString()}
          </Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: Colors.success }]}>
          <Text style={styles.summaryLabel}>Total Credits</Text>
          <Text style={[styles.summaryValue, styles.tabular, { color: Colors.success }]}>
            ₨ {totalCredits.toLocaleString()}
          </Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: Colors.teal }]}>
          <Text style={styles.summaryLabel}>Net Balance</Text>
          <Text style={[styles.summaryValue, styles.tabular, { color: Colors.teal }]}>
            ₨ {(totalCredits - totalDebits).toLocaleString()}
          </Text>
        </View>
      </View>

      <FlatList
        horizontal
        data={MEMBERS}
        keyExtractor={m => m}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.memberFilterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.memberPill, memberFilter === item && styles.memberPillActive]}
            onPress={() => setMemberFilter(item)}>
            <Text style={[styles.memberPillText, memberFilter === item && styles.memberPillTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.ledgerHeader}>
        <Text style={styles.ledgerHeaderText}>DESCRIPTION</Text>
        <Text style={styles.ledgerHeaderText}>AMOUNT / BALANCE</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  exportBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  exportBtnText: { fontSize: 12, fontWeight: '600', color: Colors.textDark },
  summaryRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  summaryCard: {
    flex: 1,
    backgroundColor: Card.backgroundColor,
    borderWidth: Card.borderWidth,
    borderColor: Card.borderColor,
    borderRadius: Card.borderRadius,
    borderLeftWidth: 4,
    padding: 10,
    gap: 4,
  },
  summaryLabel: { fontSize: 10, color: Colors.textSub, fontWeight: '600' },
  summaryValue: { fontSize: 14, fontWeight: '700' },
  memberFilterList: { paddingHorizontal: 16, gap: 8, paddingBottom: 8 },
  memberPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card, marginRight: 8 },
  memberPillActive: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  memberPillText: { fontSize: 12, fontWeight: '600', color: Colors.textSub },
  memberPillTextActive: { color: '#fff' },
  ledgerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: Colors.canvas,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  ledgerHeaderText: { fontSize: 10, fontWeight: '700', color: Colors.textLight, letterSpacing: 0.5 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 4 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, backgroundColor: Colors.card },
  txTypeIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  txTypeText: { fontSize: 16, fontWeight: '700' },
  txMiddle: { flex: 1, gap: 3 },
  txDesc: { fontSize: 13, fontWeight: '600', color: Colors.textDark },
  txMeta: { fontSize: 11, color: Colors.textSub },
  txRight: { alignItems: 'flex-end', gap: 4 },
  txAmount: { fontSize: 13, fontWeight: '700' },
  balanceBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  balanceText: { fontSize: 11, fontWeight: '700' },
  tabular: { fontFamily: Font.body, fontVariant: ['tabular-nums'] },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: Colors.textLight },
});
