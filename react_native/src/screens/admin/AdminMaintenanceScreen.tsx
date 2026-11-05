import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ApiStatus from '../../components/ApiStatus';
import ScreenHeader from '../../components/ScreenHeader';
import { getApiErrorMessage, maintenanceApi, type MaintenanceIssue } from '../../services/api';
import useRoomData from '../../services/useRoomData';
import { Colors, Input } from '../../theme';

function statusLabel(status: MaintenanceIssue['status']) {
  if (status === 'IN_PROGRESS') return 'Allocated';
  if (status === 'RESOLVED') return 'Resolved';
  return 'Pending review';
}

export default function AdminMaintenanceScreen() {
  const { room, loading: roomLoading, error: roomError, reload: reloadRoom } = useRoomData();
  const [issues, setIssues] = useState<MaintenanceIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [repairTitle, setRepairTitle] = useState('');
  const [cost, setCost] = useState('');
  const memberCount = Math.max(1, room?.members.length ?? 1);

  const reload = useCallback(async () => {
    if (!room) return;
    setLoading(true);
    setError(null);
    try {
      setIssues(await maintenanceApi.list(room._id));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [room]);

  useEffect(() => { reload(); }, [reload]);

  const addIssue = async () => {
    const amount = Number(cost);
    if (!room) {
      Alert.alert('Room required', 'Create a room in Settings before adding maintenance issues.');
      return;
    }
    if (!repairTitle.trim() || !Number.isFinite(amount) || amount <= 0) {
      Alert.alert('Issue details required', 'Enter a repair description and valid cost.');
      return;
    }
    setSavingId('new');
    try {
      const issue = await maintenanceApi.create({
        roomId: room._id,
        issueType: 'Other',
        description: repairTitle.trim(),
        repairCost: amount,
      });
      setIssues(current => [issue, ...current]);
      setRepairTitle('');
      setCost('');
    } catch (requestError) {
      Alert.alert('Unable to add repair', getApiErrorMessage(requestError));
    } finally {
      setSavingId(null);
    }
  };

  const updateIssue = async (issue: MaintenanceIssue, status: MaintenanceIssue['status']) => {
    setSavingId(issue._id);
    try {
      const updated = await maintenanceApi.update(issue._id, { status });
      setIssues(current => current.map(item => item._id === updated._id ? updated : item));
    } catch (requestError) {
      Alert.alert('Unable to update request', getApiErrorMessage(requestError));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Maintenance allocation" subtitle="Review repair requests and split approved costs." />
        <ApiStatus loading={roomLoading || loading} error={roomError || error} onRetry={() => { if (roomError) reloadRoom(); else reload(); }} />
        {!roomLoading && !roomError && !room ? <Text style={styles.helper}>Create a room in Settings to review maintenance requests.</Text> : null}
        <View style={styles.memberBar}>
          <View style={styles.memberInfo}><Text style={styles.label}>Active room members</Text><Text style={styles.helper}>Cost shares use the current room member count</Text></View>
          <Text style={styles.count}>{memberCount}</Text>
        </View>
        <Text style={styles.section}>Room requests</Text>
        {issues.map(issue => {
          const label = statusLabel(issue.status);
          return <View key={issue._id} style={styles.issue}>
            <View style={styles.issueHeader}><Text style={styles.issueTitle}>{issue.description}</Text><Text style={[styles.status, issue.status === 'IN_PROGRESS' || issue.status === 'RESOLVED' ? styles.allocated : styles.pending]}>{label}</Text></View>
            <Text style={styles.helper}>{issue.issueType} · PKR {issue.repairCost.toLocaleString()} total</Text>
            {issue.repairCost > 0 ? <Text style={styles.share}>PKR {Math.ceil(issue.repairCost / memberCount).toLocaleString()} each · split across {memberCount} room members</Text> : null}
            {issue.status === 'PENDING' ? <TouchableOpacity disabled={savingId === issue._id} testID={`admin-allocate-${issue._id}`} style={styles.allocateButton} onPress={() => updateIssue(issue, 'IN_PROGRESS')}><Text style={styles.allocateText}>Approve & allocate share</Text></TouchableOpacity> : null}
            {issue.status === 'IN_PROGRESS' ? <TouchableOpacity disabled={savingId === issue._id} testID={`admin-resolve-${issue._id}`} style={styles.resolveButton} onPress={() => updateIssue(issue, 'RESOLVED')}><Text style={styles.resolveText}>Mark resolved</Text></TouchableOpacity> : null}
          </View>;
        })}
        <View style={styles.form}>
          <Text style={styles.section}>Add repair expense</Text>
          <TextInput testID="admin-repair-title" style={styles.input} value={repairTitle} onChangeText={setRepairTitle} placeholder="Repair description" />
          <TextInput testID="admin-repair-cost" style={styles.input} value={cost} onChangeText={setCost} placeholder="Total cost (PKR)" keyboardType="numeric" />
          <TouchableOpacity testID="admin-add-repair" style={styles.allocateButton} disabled={savingId === 'new'} onPress={addIssue}><Text style={styles.allocateText}>{savingId === 'new' ? 'Saving…' : 'Add repair'}</Text></TouchableOpacity>
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
