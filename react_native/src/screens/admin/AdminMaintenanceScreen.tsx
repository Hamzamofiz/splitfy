import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/ScreenHeader';
import { Colors, Input } from '../../theme';

type Issue = { id: string; title: string; category: string; cost: number; status: 'Pending review' | 'Allocated' | 'Resolved' };

export default function AdminMaintenanceScreen() {
  const [issues, setIssues] = useState<Issue[]>([
    { id: '1', title: 'Kitchen tap repair', category: 'Plumbing', cost: 720, status: 'Allocated' },
    { id: '2', title: 'Hall light replacement', category: 'Electrical', cost: 1200, status: 'Pending review' },
  ]);
  const [memberCount, setMemberCount] = useState(4);
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [repairTitle, setRepairTitle] = useState('');
  const [cost, setCost] = useState('');

  const addIssue = () => {
    const amount = Number(cost);
    if (!repairTitle.trim() || !Number.isFinite(amount) || amount <= 0) {
      Alert.alert('Issue details required', 'Enter a repair title and valid cost.');
      return;
    }
    setIssues(current => [{ id: `${Date.now()}`, title: repairTitle.trim(), category: 'Other', cost: amount, status: 'Pending review' }, ...current]);
    setRepairTitle(''); setCost('');
  };
  const allocate = (issue: Issue) => {
    setAllocations(current => ({ ...current, [issue.id]: memberCount }));
    setIssues(current => current.map(item => item.id === issue.id ? { ...item, status: 'Allocated' } : item));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Maintenance allocation" subtitle="Review repair requests and split approved costs." />
        <View style={styles.memberBar}>
          <View style={styles.memberInfo}><Text style={styles.label}>Active room members</Text><Text style={styles.helper}>Allocation uses current active member count</Text></View>
          <TouchableOpacity testID="admin-member-count-minus" style={styles.countButton} onPress={() => setMemberCount(current => Math.max(1, current - 1))}><Text style={styles.countText}>−</Text></TouchableOpacity>
          <Text style={styles.count}>{memberCount}</Text>
          <TouchableOpacity testID="admin-member-count-plus" style={styles.countButton} onPress={() => setMemberCount(current => current + 1)}><Text style={styles.countText}>+</Text></TouchableOpacity>
        </View>
        <Text style={styles.section}>Room requests</Text>
        {issues.map(issue => {
          const allocatedMembers = allocations[issue.id] ?? memberCount;
          return <View key={issue.id} style={styles.issue}>
            <View style={styles.issueHeader}><Text style={styles.issueTitle}>{issue.title}</Text><Text style={[styles.status, issue.status === 'Allocated' ? styles.allocated : styles.pending]}>{issue.status}</Text></View>
            <Text style={styles.helper}>{issue.category} · PKR {issue.cost.toLocaleString()} total</Text>
            <Text style={styles.share}>PKR {Math.ceil(issue.cost / allocatedMembers).toLocaleString()} each · split across {allocatedMembers} active room members</Text>
            {issue.status === 'Pending review' ? <TouchableOpacity testID={`admin-allocate-${issue.id}`} style={styles.allocateButton} onPress={() => allocate(issue)}><Text style={styles.allocateText}>Approve & allocate share</Text></TouchableOpacity> : null}
            {issue.status === 'Allocated' ? <TouchableOpacity testID={`admin-resolve-${issue.id}`} style={styles.resolveButton} onPress={() => setIssues(current => current.map(item => item.id === issue.id ? { ...item, status: 'Resolved' } : item))}><Text style={styles.resolveText}>Mark resolved</Text></TouchableOpacity> : null}
          </View>;
        })}
        <View style={styles.form}>
          <Text style={styles.section}>Add repair expense</Text>
          <TextInput testID="admin-repair-title" style={styles.input} value={repairTitle} onChangeText={setRepairTitle} placeholder="Repair description" />
          <TextInput testID="admin-repair-cost" style={styles.input} value={cost} onChangeText={setCost} placeholder="Total cost (PKR)" keyboardType="numeric" />
          <TouchableOpacity testID="admin-add-repair" style={styles.allocateButton} onPress={addIssue}><Text style={styles.allocateText}>Add repair</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: 16, paddingBottom: 28, gap: 12 },
  memberBar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 12, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  memberInfo: { flex: 1, gap: 3 },
  label: { color: Colors.textDark, fontSize: 10, fontWeight: '700' },
  helper: { color: Colors.textSub, fontSize: 9 },
  countButton: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: Colors.teal },
  countText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  count: { color: Colors.textDark, fontSize: 12, fontWeight: '800' },
  section: { color: Colors.textDark, fontSize: 14, fontWeight: '800' },
  issue: { padding: 12, gap: 8, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  issueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  issueTitle: { flex: 1, color: Colors.textDark, fontSize: 11, fontWeight: '700' },
  status: { overflow: 'hidden', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, fontSize: 8, fontWeight: '700' },
  allocated: { color: Colors.teal, backgroundColor: Colors.tealLight },
  pending: { color: Colors.copper, backgroundColor: Colors.copperLight },
  share: { color: Colors.textDark, fontSize: 9, fontWeight: '700' },
  allocateButton: { minHeight: 39, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: Colors.teal },
  allocateText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  resolveButton: { minHeight: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: Colors.tealLight },
  resolveText: { color: Colors.teal, fontSize: 10, fontWeight: '700' },
  form: { padding: 13, gap: 9, borderRadius: 13, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  input: { height: Input.height, paddingHorizontal: 11, borderWidth: 1, borderColor: Colors.border, borderRadius: 9, color: Colors.textDark },
});
