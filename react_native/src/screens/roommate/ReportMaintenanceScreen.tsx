import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ApiStatus from '../../components/ApiStatus';
import ScreenHeader from '../../components/ScreenHeader';
import { getApiErrorMessage, maintenanceApi, type MaintenanceIssue } from '../../services/api';
import useRoomData from '../../services/useRoomData';
import { Colors, Input } from '../../theme';

const CATEGORIES = ['AC', 'Plumbing', 'Electricity', 'Carpentry', 'Other'];

export default function ReportMaintenanceScreen() {
  const { room, loading: roomLoading, error: roomError, reload: reloadRoom } = useRoomData();
  const [category, setCategory] = useState('Plumbing');
  const [description, setDescription] = useState('');
  const [estimate, setEstimate] = useState('');
  const [requests, setRequests] = useState<MaintenanceIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const memberCount = Math.max(1, room?.members.length ?? 1);

  const reload = useCallback(async () => {
    if (!room) return;
    setLoading(true);
    setError(null);
    try {
      setRequests(await maintenanceApi.list(room._id));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [room]);

  useEffect(() => { reload(); }, [reload]);

  const submit = async () => {
    const cost = estimate.trim() ? Number(estimate) : 0;
    if (!room) {
      Alert.alert('Room required', 'Join a room before reporting maintenance.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Description required', 'Describe the repair issue.');
      return;
    }
    if (!Number.isFinite(cost) || cost < 0) {
      Alert.alert('Invalid cost', 'Enter a valid non-negative PKR estimate.');
      return;
    }
    setSaving(true);
    try {
      const request = await maintenanceApi.create({
        roomId: room._id,
        issueType: category,
        description: description.trim(),
        repairCost: cost,
      });
      setRequests(current => [request, ...current]);
      setDescription('');
      setEstimate('');
    } catch (requestError) {
      Alert.alert('Unable to submit request', getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Maintenance" subtitle="Report repairs and follow your shared cost allocation." />
        <ApiStatus loading={roomLoading || loading} error={roomError || error} onRetry={() => { if (roomError) reloadRoom(); else reload(); }} />
        {!roomLoading && !roomError && !room ? <Text style={styles.muted}>Join a room to report and follow maintenance requests.</Text> : null}
        <View style={styles.form}>
          <Text style={styles.section}>Report an issue</Text>
          <Text style={styles.label}>Issue category</Text>
          <View style={styles.chips}>{CATEGORIES.map(item => (
            <TouchableOpacity key={item} testID={`maintenance-category-${item.toLowerCase()}`} accessibilityRole="button" accessibilityState={{ selected: category === item }} style={[styles.chip, category === item && styles.chipSelected]} onPress={() => setCategory(item)}><Text style={[styles.chipText, category === item && styles.chipTextSelected]}>{item}</Text></TouchableOpacity>
          ))}</View>
          <Text style={styles.label}>Description</Text>
          <TextInput testID="maintenance-description" style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} placeholder="Describe the issue and location..." multiline />
          <Text style={styles.label}>Estimated repair cost (PKR, optional)</Text>
          <TextInput testID="maintenance-estimate" style={styles.input} value={estimate} onChangeText={setEstimate} keyboardType="numeric" placeholder="0" />
          <Text style={styles.muted}>Active room members: {memberCount}</Text>
          <TouchableOpacity testID="maintenance-submit" style={[styles.submit, saving && styles.disabled]} disabled={saving} onPress={submit}><Text style={styles.submitText}>{saving ? 'Submitting…' : 'Submit maintenance request'}</Text></TouchableOpacity>
        </View>
        <Text style={styles.section}>Your requests & allocated shares</Text>
        {requests.map(request => (
          <View key={request._id} style={styles.request}>
            <View style={styles.requestHead}><Text style={styles.requestTitle}>{request.issueType}</Text><Text style={[styles.status, request.status === 'RESOLVED' ? styles.allocated : styles.pending]}>{request.status.toLowerCase().replace('_', ' ')}</Text></View>
            <Text style={styles.muted}>{request.description}</Text>
            {request.repairCost > 0 ? <Text style={styles.cost}>PKR {request.repairCost.toLocaleString()} total · PKR {Math.ceil(request.repairCost / memberCount).toLocaleString()} each / {memberCount} members</Text> : <Text style={styles.muted}>Share will be calculated when repair cost is allocated.</Text>}
          </View>
        ))}
        {!loading && room && requests.length === 0 ? <Text style={styles.muted}>No maintenance requests yet.</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: 16, paddingBottom: 28, gap: 12 },
  form: { padding: 14, gap: 10, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, backgroundColor: Colors.card },
  section: { color: Colors.textDark, fontSize: 15, fontWeight: '800' },
  label: { color: Colors.textSub, fontSize: 11, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: { paddingHorizontal: 10, paddingVertical: 7, borderWidth: 1, borderColor: Colors.border, borderRadius: 18 },
  chipSelected: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  chipText: { color: Colors.textSub, fontSize: 10, fontWeight: '600' },
  chipTextSelected: { color: '#FFFFFF' },
  input: { height: Input.height, paddingHorizontal: 11, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, color: Colors.textDark, backgroundColor: Colors.canvas },
  multiline: { height: 82, paddingTop: 10, textAlignVertical: 'top' },
  muted: { color: Colors.textSub, fontSize: 10 },
  submit: { minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: Colors.teal },
  submitText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  disabled: { opacity: 0.6 },
  request: { padding: 13, gap: 8, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, backgroundColor: Colors.card },
  requestHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  requestTitle: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  status: { overflow: 'hidden', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, fontSize: 9, fontWeight: '700' },
  allocated: { color: Colors.teal, backgroundColor: Colors.tealLight },
  pending: { color: Colors.copper, backgroundColor: Colors.copperLight },
  cost: { color: Colors.textDark, fontSize: 10, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
