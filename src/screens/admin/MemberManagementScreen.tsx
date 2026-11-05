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
import type { RoommatesStackParamList } from '../../navigation/types';
import { Colors, Input, Card, Font } from '../../theme';

type Member = {
  id: string;
  name: string;
  room: string;
  activeDays: number;
  totalDays: number;
  splitPct: number;
  status: 'Active' | 'Away' | 'Pending';
};

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Ali Hassan', room: 'Room 1', activeDays: 28, totalDays: 31, splitPct: 32, status: 'Active' },
  { id: '2', name: 'Sara Khan', room: 'Room 2', activeDays: 25, totalDays: 31, splitPct: 28, status: 'Active' },
  { id: '3', name: 'Usman Raza', room: 'Room 3', activeDays: 20, totalDays: 31, splitPct: 22, status: 'Away' },
  { id: '4', name: 'Fatima Malik', room: 'Room 4', activeDays: 31, totalDays: 31, splitPct: 18, status: 'Pending' },
];

const STATUS_COLORS: Record<string, string> = {
  Active: Colors.teal,
  Away: Colors.copper,
  Pending: Colors.danger,
};

type Props = NativeStackScreenProps<RoommatesStackParamList, 'MemberManagement'>;

export default function MemberManagementScreen(_props: Props) {
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [newName, setNewName] = useState('');

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  const updateDays = (id: string, delta: number) => {
    setMembers(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, activeDays: Math.max(0, Math.min(m.totalDays, m.activeDays + delta)) }
          : m,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Search */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍  Search members..."
            placeholderTextColor={Colors.textLight}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Add Member */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add New Member</Text>
          <View style={styles.addRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Full name"
              placeholderTextColor={Colors.textLight}
              value={newName}
              onChangeText={setNewName}
            />
            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Members List */}
        <Text style={styles.sectionTitle}>{filtered.length} Members</Text>
        {filtered.map(m => {
          const activePct = m.activeDays / m.totalDays;
          return (
            <View key={m.id} style={styles.memberCard}>
              <View style={styles.memberTop}>
                <View style={styles.memberLeft}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{m.name[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.memberName}>{m.name}</Text>
                    <Text style={styles.memberRoom}>{m.room}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[m.status] + '22' }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLORS[m.status] }]}>
                    {m.status}
                  </Text>
                </View>
              </View>

              {/* Active Days Counter */}
              <View style={styles.daysRow}>
                <Text style={styles.daysLabel}>Active Days</Text>
                <View style={styles.counter}>
                  <TouchableOpacity style={styles.counterBtn} onPress={() => updateDays(m.id, -1)}>
                    <Text style={styles.counterBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={[styles.counterValue, styles.tabular]}>
                    {m.activeDays}/{m.totalDays}
                  </Text>
                  <TouchableOpacity style={styles.counterBtn} onPress={() => updateDays(m.id, 1)}>
                    <Text style={styles.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Dual-tone Progress Bar */}
              <View style={styles.progressTrack}>
                <View style={[styles.progressActive, { width: `${activePct * 100}%` as any }]} />
                <View style={[styles.progressInactive, { width: `${(1 - activePct) * 100}%` as any }]} />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabelTeal}>{m.activeDays}d active</Text>
                <Text style={styles.progressLabelCopper}>{m.totalDays - m.activeDays}d away</Text>
              </View>

              {/* Split % */}
              <View style={styles.splitRow}>
                <Text style={styles.splitLabel}>Split Share</Text>
                <Text style={[styles.splitValue, styles.tabular]}>{m.splitPct}%</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  searchRow: {},
  searchInput: {
    height: Input.height,
    borderWidth: Input.borderWidth,
    borderColor: Colors.border,
    borderRadius: Input.borderRadius,
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.textDark,
    backgroundColor: Colors.card,
  },
  card: {
    backgroundColor: Card.backgroundColor,
    borderWidth: Card.borderWidth,
    borderColor: Card.borderColor,
    borderRadius: Card.borderRadius,
    padding: Card.padding,
    gap: 10,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.textDark },
  addRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
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
  addBtn: {
    height: Input.height,
    paddingHorizontal: 18,
    backgroundColor: Colors.teal,
    borderRadius: Input.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textSub },
  memberCard: {
    backgroundColor: Card.backgroundColor,
    borderWidth: Card.borderWidth,
    borderColor: Card.borderColor,
    borderRadius: Card.borderRadius,
    padding: 14,
    gap: 10,
  },
  memberTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  memberLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  memberName: { fontSize: 14, fontWeight: '600', color: Colors.textDark },
  memberRoom: { fontSize: 11, color: Colors.textSub },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  daysLabel: { fontSize: 12, color: Colors.textSub },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: Card.borderRadius,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: { fontSize: 16, color: Colors.textDark, fontWeight: '700' },
  counterValue: { fontSize: 14, fontWeight: '700', color: Colors.textDark, minWidth: 48, textAlign: 'center' },
  progressTrack: { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden' },
  progressActive: { height: 6, backgroundColor: Colors.teal },
  progressInactive: { height: 6, backgroundColor: Colors.copper },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabelTeal: { fontFamily: Font.body, fontSize: 10, color: Colors.teal, fontWeight: '600', fontVariant: ['tabular-nums'] },
  progressLabelCopper: { fontFamily: Font.body, fontSize: 10, color: Colors.copper, fontWeight: '600', fontVariant: ['tabular-nums'] },
  splitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  splitLabel: { fontSize: 12, color: Colors.textSub },
  splitValue: { fontSize: 16, fontWeight: '700', color: Colors.teal },
  tabular: { fontFamily: Font.body, fontVariant: ['tabular-nums'] },
});
