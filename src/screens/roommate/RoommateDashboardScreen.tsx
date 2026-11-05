import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DocumentPickerResponse } from '@react-native-documents/picker';

import FileAttachmentPicker from '../../components/FileAttachmentPicker';
import type { RoommateTabParamList } from '../../navigation/types';
import { useRoleSession } from '../../navigation/RoleSessionContext';
import { Colors, Input } from '../../theme';

type Props = BottomTabScreenProps<RoommateTabParamList, 'Home'>;

const ACTIVE_BILLS = [
  { id: 'electricity', name: 'Electricity', due: 'Due Oct 28', share: 'PKR 1,050', status: 'Due soon' },
  { id: 'internet', name: 'Internet', due: 'Due Nov 01', share: 'PKR 625', status: 'Upcoming' },
];

const RECENT_ACTIVITY = [
  { id: 'payment', title: 'Payment via Raast', detail: 'PKR 1,200', proofStatus: 'Verified' },
  { id: 'bill', title: 'October electricity bill', detail: 'Share added · PKR 1,050', proofStatus: 'Pending Approval' },
  { id: 'maintenance', title: 'Kitchen tap repair', detail: 'Allocated share · PKR 180', proofStatus: 'Receipt Attached' },
];

export default function RoommateDashboardScreen({ navigation }: Props) {
  const { signOut } = useRoleSession();
  const [profileVisible, setProfileVisible] = useState(false);
  const [name, setName] = useState('Member');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<DocumentPickerResponse | null>(null);

  const saveProfile = () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Enter your name to update your profile.');
      return;
    }
    setName(name.trim());
    setProfileVisible(false);
    Alert.alert('Profile updated', 'Your profile details were updated on this device.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>SPLITIFY · ROOM 402</Text>
            <Text style={styles.title}>Home</Text>
          </View>
          <TouchableOpacity
            testID="open-profile"
            accessibilityRole="button"
            accessibilityLabel="Update profile"
            onPress={() => setProfileVisible(true)}
            style={styles.avatar}
          >
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto.uri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Your current balance</Text>
          <Text style={styles.balanceAmount}>PKR 2,675</Text>
          <Text style={styles.balanceNote}>Amount due this month</Text>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.payButton}
            onPress={() => navigation.navigate('Settlement')}
          >
            <Text style={styles.payButtonText}>View settlement</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity
            testID="quick-upload-expense"
            accessibilityRole="button"
            style={styles.quickAction}
            onPress={() => navigation.navigate('Bills')}
          >
            <Text style={styles.quickActionText}>Upload Daily Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="quick-mark-absent"
            accessibilityRole="button"
            style={styles.quickAction}
            onPress={() => navigation.navigate('Attendance')}
          >
            <Text style={styles.quickActionText}>Mark Absent Days</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="quick-pay-bill"
            accessibilityRole="button"
            style={styles.quickAction}
            onPress={() => navigation.navigate('Bills')}
          >
            <Text style={styles.quickActionText}>Pay Bill</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Active bills</Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate('Bills')}>
            <Text style={styles.link}>View all</Text>
          </TouchableOpacity>
        </View>
        {ACTIVE_BILLS.map(bill => (
          <View key={bill.id} style={styles.billCard}>
            <View style={styles.billInfo}>
              <Text style={styles.billName}>{bill.name}</Text>
              <View style={styles.billMeta}>
                <Text style={[styles.billStatus, bill.status === 'Due soon' && styles.billStatusSoon]}>
                  {bill.status}
                </Text>
                <Text style={styles.billDue}>{bill.due}</Text>
              </View>
            </View>
            <Text style={styles.billShare}>{bill.share}</Text>
          </View>
        ))}

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate('Bills')}>
            <Text style={styles.link}>Payments</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.activityCard}>
          {RECENT_ACTIVITY.map((activity, index) => (
            <View key={activity.id} style={[styles.activityRow, index > 0 && styles.activityDivider]}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDetail}>{activity.detail}</Text>
              </View>
              <View style={styles.activityRight}>
                <Text style={styles.activityAmount}>{activity.detail}</Text>
                <Text
                  style={[
                    styles.proofStatus,
                    activity.proofStatus === 'Verified' && styles.proofVerified,
                    activity.proofStatus === 'Pending Approval' && styles.proofPending,
                  ]}
                >
                  {activity.proofStatus}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={profileVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setProfileVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.profileModal}>
            <View style={styles.modalHeading}>
              <View>
                <Text style={styles.modalTitle}>Update profile</Text>
                <Text style={styles.modalSubtitle}>Room 402 member details</Text>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Close profile editor"
                onPress={() => setProfileVisible(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              testID="profile-name"
              style={styles.profileInput}
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor={Colors.textLight}
            />
            <Text style={styles.fieldLabel}>Phone</Text>
            <TextInput
              testID="profile-phone"
              style={styles.profileInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="+92 3XX XXXXXXX"
              placeholderTextColor={Colors.textLight}
              keyboardType="phone-pad"
            />
            <Text style={styles.fieldLabel}>Emergency contact</Text>
            <TextInput
              testID="profile-emergency-contact"
              style={styles.profileInput}
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              placeholder="Name and phone number"
              placeholderTextColor={Colors.textLight}
            />
            <FileAttachmentPicker
              attachment={profilePhoto}
              onAttachmentChange={setProfilePhoto}
              kind="photo"
              buttonTestID="profile-photo-picker"
            />
            <TouchableOpacity testID="save-profile" style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.saveButtonText}>Save profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.signOutButton}
              onPress={() => {
                setProfileVisible(false);
                signOut();
              }}
            >
              <Text style={styles.signOutText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 28 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  eyebrow: { color: Colors.teal, fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  title: { color: Colors.textDark, fontSize: 24, fontWeight: '800', marginTop: 3 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 20 },
  avatarText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  balanceCard: { backgroundColor: Colors.teal, borderRadius: 18, padding: 17, gap: 5 },
  balanceLabel: { color: '#D5FFFA', fontSize: 12 },
  balanceAmount: { color: '#FFFFFF', fontSize: 27, fontWeight: '800', fontVariant: ['tabular-nums'] },
  balanceNote: { color: '#D5FFFA', fontSize: 11 },
  payButton: { alignSelf: 'flex-start', marginTop: 7, backgroundColor: '#FFFFFF', borderRadius: 9, paddingHorizontal: 13, paddingVertical: 8 },
  payButtonText: { color: Colors.teal, fontSize: 11, fontWeight: '700' },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  sectionTitle: { color: Colors.textDark, fontSize: 15, fontWeight: '700' },
  link: { color: Colors.teal, fontSize: 11, fontWeight: '700' },
  billCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, padding: 12 },
  billInfo: { flex: 1, gap: 4 },
  billName: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  billMeta: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  billStatus: { color: Colors.teal, backgroundColor: Colors.tealLight, fontSize: 9, fontWeight: '700', overflow: 'hidden', borderRadius: 9, paddingHorizontal: 7, paddingVertical: 3 },
  billStatusSoon: { color: Colors.copper, backgroundColor: Colors.copperLight },
  billDue: { color: Colors.textSub, fontSize: 10 },
  billShare: { color: Colors.textDark, fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  activityCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, paddingHorizontal: 12 },
  activityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingVertical: 12 },
  activityDivider: { borderTopWidth: 1, borderTopColor: Colors.border },
  activityInfo: { flex: 1, gap: 3 },
  activityTitle: { color: Colors.textDark, fontSize: 11, fontWeight: '600' },
  activityDetail: { color: Colors.textSub, fontSize: 10 },
  activityAmount: { color: Colors.textDark, fontSize: 10, fontWeight: '700', textAlign: 'right' },
  quickActions: { flexDirection: 'row', gap: 7 },
  quickAction: { flex: 1, minHeight: 55, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 12 },
  quickActionText: { color: Colors.teal, fontSize: 9, lineHeight: 13, fontWeight: '700', textAlign: 'center' },
  activityRight: { alignItems: 'flex-end', gap: 5, maxWidth: '42%' },
  proofStatus: { overflow: 'hidden', borderRadius: 9, paddingHorizontal: 7, paddingVertical: 3, backgroundColor: Colors.copperLight, color: Colors.copper, fontSize: 8, fontWeight: '700' },
  proofVerified: { backgroundColor: Colors.tealLight, color: Colors.teal },
  proofPending: { backgroundColor: Colors.copperLight, color: Colors.copper },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(8,13,30,0.5)' },
  profileModal: { gap: 9, padding: 18, paddingBottom: 28, backgroundColor: Colors.canvas, borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  modalHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  modalTitle: { color: Colors.textDark, fontSize: 18, fontWeight: '800' },
  modalSubtitle: { color: Colors.textSub, fontSize: 11, marginTop: 2 },
  closeText: { color: Colors.teal, fontSize: 11, fontWeight: '700' },
  fieldLabel: { color: Colors.textSub, fontSize: 11, fontWeight: '600' },
  profileInput: { height: Input.height, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, color: Colors.textDark, backgroundColor: Colors.card },
  saveButton: { minHeight: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.teal, borderRadius: 10 },
  saveButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  signOutButton: { alignItems: 'center', padding: 8 },
  signOutText: { color: Colors.danger, fontSize: 11, fontWeight: '600' },
});
