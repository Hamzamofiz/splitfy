import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DocumentPickerResponse } from '@react-native-documents/picker';

import FilePickerButton from '../../components/FilePickerButton';
import ScreenHeader from '../../components/ScreenHeader';
import { Colors, Input } from '../../theme';

const CATEGORIES = ['Plumbing', 'Electrical', 'Appliance', 'Structural', 'Other'];
type Request = { id: string; category: string; description: string; estimate: number; status: string; file?: string };

export default function ReportMaintenanceScreen() {
  const [category, setCategory] = useState('Plumbing');
  const [description, setDescription] = useState('');
  const [estimate, setEstimate] = useState('');
  const [members, setMembers] = useState(4);
  const [file, setFile] = useState<DocumentPickerResponse | null>(null);
  const [requests, setRequests] = useState<Request[]>([
    { id: 'initial', category: 'Plumbing', description: 'Kitchen tap repair', estimate: 720, status: 'Allocated' },
  ]);

  const submit = () => {
    const cost = estimate.trim() ? Number(estimate) : 0;
    if (!description.trim()) {
      Alert.alert('Description required', 'Describe the repair issue.');
      return;
    }
    if (!Number.isFinite(cost) || cost < 0) {
      Alert.alert('Invalid cost', 'Enter a valid non-negative PKR estimate.');
      return;
    }
    setRequests(current => [{ id: `${Date.now()}`, category, description: description.trim(), estimate: cost, status: 'Submitted', file: file?.name ?? undefined }, ...current]);
    setDescription('');
    setEstimate('');
    setFile(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Maintenance" subtitle="Report repairs and follow your shared cost allocation." />
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
          <FilePickerButton testID="maintenance-photo-picker" kind="media" onPicked={setFile} />
          {file ? <Text style={styles.muted}>Attached: {file.name ?? 'media file'}</Text> : null}
          <View style={styles.memberRow}>
            <View style={styles.memberInfo}><Text style={styles.label}>Active room members</Text><Text style={styles.muted}>Split dynamically across {members} active room members</Text></View>
            <TouchableOpacity testID="maintenance-member-decrease" style={styles.memberButton} onPress={() => setMembers(current => Math.max(1, current - 1))}><Text style={styles.memberButtonText}>−</Text></TouchableOpacity>
            <Text style={styles.memberCount}>{members}</Text>
            <TouchableOpacity testID="maintenance-member-increase" style={styles.memberButton} onPress={() => setMembers(current => current + 1)}><Text style={styles.memberButtonText}>+</Text></TouchableOpacity>
          </View>
          <TouchableOpacity testID="maintenance-submit" style={styles.submit} onPress={submit}><Text style={styles.submitText}>Submit maintenance request</Text></TouchableOpacity>
        </View>
        <Text style={styles.section}>Your requests & allocated shares</Text>
        {requests.map(request => <View key={request.id} style={styles.request}>
          <View style={styles.requestHead}><Text style={styles.requestTitle}>{request.category}</Text><Text style={[styles.status, request.status === 'Allocated' ? styles.allocated : styles.pending]}>{request.status}</Text></View>
          <Text style={styles.muted}>{request.description}</Text>
          {request.file ? <Text style={styles.muted}>Attachment: {request.file}</Text> : null}
          {request.estimate ? <Text style={styles.cost}>PKR {request.estimate.toLocaleString()} total · PKR {Math.ceil(request.estimate / members).toLocaleString()} each / {members} members</Text> : <Text style={styles.muted}>Share is calculated when repair cost is allocated.</Text>}
        </View>)}
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
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 9, backgroundColor: Colors.canvas, borderRadius: 10 },
  memberInfo: { flex: 1, gap: 3 },
  memberButton: { width: 29, height: 29, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: Colors.teal },
  memberButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  memberCount: { color: Colors.textDark, fontSize: 12, fontWeight: '800' },
  submit: { minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: Colors.teal },
  submitText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  request: { padding: 13, gap: 8, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, backgroundColor: Colors.card },
  requestHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  requestTitle: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  status: { overflow: 'hidden', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, fontSize: 9, fontWeight: '700' },
  allocated: { color: Colors.teal, backgroundColor: Colors.tealLight },
  pending: { color: Colors.copper, backgroundColor: Colors.copperLight },
  cost: { color: Colors.textDark, fontSize: 10, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
