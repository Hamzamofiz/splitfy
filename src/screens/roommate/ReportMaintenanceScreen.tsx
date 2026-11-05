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

const CATEGORIES = ['Plumbing', 'Electrical', 'Appliance', 'Structural', 'Other'];
const INITIAL_ACTIVE_MEMBERS = 4;

type Request = {
  id: string;
  category: string;
  description: string;
  estimate: number;
  status: string;
  attachmentName?: string;
};

const INITIAL_REQUESTS: Request[] = [
  { id: '1', category: 'Plumbing', description: 'Kitchen tap repair', estimate: 720, status: 'Allocated' },
];

export default function ReportMaintenanceScreen() {
  const [category, setCategory] = useState('Plumbing');
  const [description, setDescription] = useState('');
  const [estimate, setEstimate] = useState('');
  const [activeMemberCount, setActiveMemberCount] = useState(INITIAL_ACTIVE_MEMBERS);
  const [attachment, setAttachment] = useState<DocumentPickerResponse | null>(null);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const submitRequest = () => {
    if (!description.trim()) {
      Alert.alert('Description required', 'Describe the repair or maintenance issue.');
      return;
    }

    const parsedEstimate = estimate.trim() ? Number(estimate) : 0;
    if (!Number.isFinite(parsedEstimate) || parsedEstimate < 0) {
      Alert.alert('Invalid repair cost', 'Enter a valid non-negative PKR amount.');
      return;
    }

    const request: Request = {
      id: Date.now().toString(),
      category,
      description: description.trim(),
      estimate: parsedEstimate,
      status: 'Submitted',
      attachmentName: attachment?.name ?? undefined,
    };
    setRequests(current => [request, ...current]);
    setDescription('');
    setEstimate('');
    setAttachment(null);
    Alert.alert('Request submitted', 'Your maintenance request has been added.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <RoommatePageHeader
          title="Maintenance"
          subtitle="Report repairs and follow your shared cost allocation."
        />

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Report an issue</Text>
          <Text style={styles.label}>Issue category</Text>
          <View style={styles.categories}>
            {CATEGORIES.map(item => (
              <TouchableOpacity
                key={item}
                testID={`maintenance-category-${item.toLowerCase()}`}
                accessibilityRole="button"
                accessibilityState={{ selected: item === category }}
                onPress={() => setCategory(item)}
                style={[styles.categoryChip, item === category && styles.categoryChipActive]}
              >
                <Text style={[styles.categoryText, item === category && styles.categoryTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput
            testID="maintenance-description"
            style={[styles.input, styles.textArea]}
            accessibilityLabel="Maintenance issue description"
            placeholder="Describe the issue and where it is..."
            placeholderTextColor={Colors.textLight}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Estimated repair cost (PKR, optional)</Text>
          <TextInput
            testID="maintenance-estimate"
            style={styles.input}
            accessibilityLabel="Estimated repair cost"
            placeholder="0"
            placeholderTextColor={Colors.textLight}
            keyboardType="numeric"
            value={estimate}
            onChangeText={setEstimate}
          />

          <FileAttachmentPicker
            attachment={attachment}
            onAttachmentChange={setAttachment}
            kind="media"
            buttonTestID="maintenance-photo-picker"
          />
          <View style={styles.memberAllocation}>
            <View style={styles.memberAllocationInfo}>
              <Text style={styles.label}>Active room members</Text>
              <Text style={styles.memberAllocationHint}>
                Split dynamically across {activeMemberCount} active room members
              </Text>
            </View>
            <View style={styles.memberCountControls}>
              <TouchableOpacity
                testID="maintenance-member-decrease"
                accessibilityRole="button"
                accessibilityLabel="Remove one active member"
                disabled={activeMemberCount <= 1}
                style={[styles.memberCountButton, activeMemberCount <= 1 && styles.disabledButton]}
                onPress={() => setActiveMemberCount(count => Math.max(1, count - 1))}
              >
                <Text style={styles.memberCountButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.memberCount}>{activeMemberCount}</Text>
              <TouchableOpacity
                testID="maintenance-member-increase"
                accessibilityRole="button"
                accessibilityLabel="Add one active member"
                style={styles.memberCountButton}
                onPress={() => setActiveMemberCount(count => count + 1)}
              >
                <Text style={styles.memberCountButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            testID="maintenance-submit"
            accessibilityRole="button"
            style={styles.submitButton}
            onPress={submitRequest}
          >
            <Text style={styles.submitText}>Submit maintenance request</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Your requests & allocated shares</Text>
        {requests.map(request => (
          <View key={request.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestCategory}>{request.category}</Text>
              <Text style={[styles.status, request.status === 'Allocated' && styles.statusAllocated]}>
                {request.status}
              </Text>
            </View>
            <Text style={styles.requestDescription}>{request.description}</Text>
            {request.attachmentName ? (
              <Text style={styles.costLabel}>Photo attached · {request.attachmentName}</Text>
            ) : null}
            {request.estimate > 0 ? (
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Estimated total · split dynamically across {activeMemberCount} active room members</Text>
                <Text style={styles.costAmount}>PKR {request.estimate.toLocaleString()} / PKR {Math.ceil(request.estimate / activeMemberCount).toLocaleString()} each</Text>
              </View>
            ) : (
              <Text style={styles.costLabel}>Cost share will appear after the repair is allocated.</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 28 },
  formCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 14, gap: 10 },
  sectionTitle: { color: Colors.textDark, fontSize: 15, fontWeight: '700' },
  label: { color: Colors.textSub, fontSize: 11, fontWeight: '600', marginTop: 2 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  categoryChip: { borderWidth: 1, borderColor: Colors.border, borderRadius: 18, paddingHorizontal: 10, paddingVertical: 7 },
  categoryChipActive: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  categoryText: { color: Colors.textSub, fontSize: 10, fontWeight: '600' },
  categoryTextActive: { color: '#FFFFFF' },
  input: { height: Input.height, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 11, color: Colors.textDark, backgroundColor: Colors.canvas },
  textArea: { height: 88, textAlignVertical: 'top', paddingTop: 10 },
  submitButton: { backgroundColor: Colors.teal, borderRadius: 10, alignItems: 'center', paddingVertical: 12 },
  submitText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  requestCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 13, gap: 8 },
  memberAllocation: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: 10, borderRadius: 10, backgroundColor: Colors.canvas },
  memberAllocationInfo: { flex: 1, gap: 2 },
  memberAllocationHint: { color: Colors.textSub, fontSize: 9, lineHeight: 13 },
  memberCountControls: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  memberCountButton: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: Colors.teal },
  disabledButton: { opacity: 0.4 },
  memberCountButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  memberCount: { minWidth: 18, color: Colors.textDark, textAlign: 'center', fontSize: 12, fontWeight: '800', fontVariant: ['tabular-nums'] },
  requestHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  requestCategory: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  status: { color: Colors.copper, backgroundColor: '#FFF7ED', fontSize: 9, fontWeight: '700', overflow: 'hidden', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  statusAllocated: { color: Colors.teal, backgroundColor: Colors.tealLight },
  requestDescription: { color: Colors.textSub, fontSize: 11 },
  costRow: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 8, gap: 4 },
  costLabel: { color: Colors.textSub, fontSize: 10 },
  costAmount: { color: Colors.textDark, fontSize: 11, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
