import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  TextInput,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { AdminTabParamList } from '../../navigation/types';
import { useRoleSession } from '../../navigation/RoleSessionContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import FileAttachmentPicker from '../../components/FileAttachmentPicker';
import { Colors, Font, Input } from '../../theme';

type Props = BottomTabScreenProps<AdminTabParamList, 'Dashboard'>;

const BILLS = [
  { id: '1', name: 'Electricity', due: 'Oct 28', amount: '4,200', status: 'Due Soon' },
  { id: '2', name: 'Gas', due: 'Oct 30', amount: '1,850', status: 'Pending' },
  { id: '3', name: 'Internet', due: 'Nov 01', amount: '2,500', status: 'Upcoming' },
];

const RECENT_ACTIVITY = [
  { id: '1', member: 'Ahmed Raza', action: 'Paid via Raast', amount: '+₨ 2,800', time: '2 hours ago', status: 'Auto-Reconciled', statusColor: Colors.teal },
  { id: '2', member: 'Fatima Khan', action: 'Paid via EasyPaisa', amount: '+₨ 1,850', time: '5 hours ago', status: 'Auto-Reconciled', statusColor: Colors.teal },
  { id: '3', member: 'Bilal Hassan', action: 'Cash Proof Submitted', amount: '₨ 2,500', time: 'Yesterday', status: 'Verified by Admin', statusColor: Colors.copper },
];

export default function AdminDashboardScreen({ navigation }: Props) {
  const { signOut } = useRoleSession();
  const insets = useSafeAreaInsets();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [name, setName] = useState('Admin');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<DocumentPickerResponse | null>(null);

  const saveProfile = () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Enter your name to update your profile.');
      return;
    }

    setName(name.trim());
    setShowProfileModal(false);
    Alert.alert('Profile updated', 'Your profile details were updated on this device.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 12) + 4 }]}>
        <View style={styles.leftHeader}>
          <TouchableOpacity
            testID="admin-open-profile"
            accessibilityRole="button"
            accessibilityLabel="Update profile"
            onPress={() => setShowProfileModal(true)}
            style={styles.avatar}
          >
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto.uri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.locationText}>🏠 Gulberg Residency, Room 3</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingTop: 12 }]}>

        {/* Quick Actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.qaScroll}>
          <TouchableOpacity
            style={styles.qaPill}
            onPress={() => navigation.navigate('Bills', { screen: 'AdminExpenseManager' })}>
            <Text style={styles.qaIcon}>➕</Text>
            <Text style={styles.qaLabel}>+ New Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.qaPill}
            onPress={() => navigation.navigate('Bills', { screen: 'BillUpload' })}>
            <Text style={styles.qaIcon}>📷</Text>
            <Text style={styles.qaLabel}>Scan Bill (OCR)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.qaPill}
            onPress={() => navigation.navigate('Analytics', { screen: 'AdminLedgerAudit' })}>
            <Text style={styles.qaIcon}>📂</Text>
            <Text style={styles.qaLabel}>Records</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Upcoming Bills */}
        <Text style={styles.sectionTitle}>Upcoming Bills</Text>
        {BILLS.map(bill => (
          <View key={bill.id} style={styles.billCard}>
            <View style={styles.billLeft}>
              <Text style={styles.billName}>{bill.name}</Text>
              <Text style={styles.billDue}>Due: {bill.due}</Text>
            </View>
            <View style={styles.billRight}>
              <Text style={styles.billAmount}>₨ {bill.amount}</Text>
              <View style={styles.billActions}>
                <TouchableOpacity
                  style={styles.btnPrimary}
                  onPress={() => navigation.navigate('Bills', { screen: 'BillUpload' })}>
                  <Text style={styles.btnPrimaryText}>Pay Direct</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnGhost}
                  onPress={() => navigation.navigate('Bills', { screen: 'BillUpload' })}>
                  <Text style={styles.btnGhostText}>View Bill</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Recent Activity */}
        <View style={styles.activityHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Analytics', { screen: 'AdminLedgerAudit' })}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.activityCard}>
          {RECENT_ACTIVITY.map((item, idx) => (
            <View key={item.id} style={[styles.activityItem, idx < RECENT_ACTIVITY.length - 1 && styles.activityItemBorder]}>
              <View style={styles.activityLeft}>
                <View style={styles.activityDot} />
                <View>
                  <Text style={styles.activityMember}>{item.member}</Text>
                  <Text style={styles.activityAction}>{item.action}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
              </View>
              <View style={styles.activityRight}>
                <Text style={styles.activityAmount}>{item.amount}</Text>
                <View style={[styles.activityBadge, { backgroundColor: item.statusColor + '20' }]}>
                  <Text style={[styles.activityBadgeText, { color: item.statusColor }]}>{item.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.verifyBanner}>
          <Text style={styles.verifyIcon}>🛡️</Text>
          <Text style={styles.verifyText}>Manual Bank & Cash Proof Verification Active</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showProfileModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.profileModalBackdrop}>
          <View style={styles.profileModal}>
            <View style={styles.profileModalHeader}>
              <View>
                <Text style={styles.profileModalTitle}>Update profile</Text>
                <Text style={styles.profileModalSubtitle}>Gulberg Residency · Room 3</Text>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Close profile editor"
                onPress={() => setShowProfileModal(false)}
              >
                <Text style={styles.profileModalClose}>Close</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.profileFieldLabel}>Name</Text>
            <TextInput
              testID="admin-profile-name"
              style={styles.profileInput}
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor={Colors.textLight}
            />
            <Text style={styles.profileFieldLabel}>Phone Number</Text>
            <TextInput
              testID="admin-profile-phone"
              style={styles.profileInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="+92 3XX XXXXXXX"
              placeholderTextColor={Colors.textLight}
              keyboardType="phone-pad"
            />
            <Text style={styles.profileFieldLabel}>Emergency Contact</Text>
            <TextInput
              testID="admin-profile-emergency-contact"
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
              buttonTestID="admin-profile-photo-picker"
            />
            <TouchableOpacity
              testID="admin-save-profile"
              accessibilityRole="button"
              style={styles.profileSaveButton}
              onPress={saveProfile}
            >
              <Text style={styles.profileSaveButtonText}>Save profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="admin-profile-sign-out"
              accessibilityRole="button"
              style={styles.profileSignOutButton}
              onPress={() => {
                setShowProfileModal(false);
                signOut();
              }}
            >
              <Text style={styles.profileSignOutText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 19 },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  locationText: { fontSize: 12, color: Colors.textDark, fontWeight: '600' },
  logoutBtn: { borderWidth: 1, borderColor: Colors.copper, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  logoutBtnText: { fontSize: 11, fontWeight: '700', color: Colors.copper },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 24 },
  syncRow: { alignItems: 'flex-end' },
  syncPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.tealLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  syncDot: { fontSize: 8, color: Colors.teal },
  syncText: { fontSize: 11, color: Colors.teal, fontWeight: '600', fontVariant: ['tabular-nums'] as any },
  qaScroll: { marginHorizontal: -16, paddingHorizontal: 16 },
  qaPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 10, marginRight: 8 },
  qaIcon: { fontSize: 14 },
  qaLabel: { fontSize: 13, fontWeight: '600', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textDark, marginTop: 4, fontVariant: ['tabular-nums'] as any },
  gridRow: { flexDirection: 'row', gap: 12 },
  gridCell: { flex: 1 },
  shortcutGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  shortcutCard: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  shortcutIcon: { fontSize: 24 },
  shortcutLabel: { fontSize: 11, fontWeight: '600', color: Colors.textDark, textAlign: 'center', fontVariant: ['tabular-nums'] as any },
  billCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  billLeft: { gap: 4 },
  billName: { fontSize: 14, fontWeight: '600', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  billDue: { fontSize: 12, color: Colors.copper, fontVariant: ['tabular-nums'] as any },
  billRight: { alignItems: 'flex-end', gap: 8 },
  billAmount: { fontFamily: Font.bodyBold, fontSize: 16, fontWeight: '700', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  billActions: { flexDirection: 'row', gap: 8 },
  btnPrimary: { backgroundColor: Colors.teal, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  btnPrimaryText: { color: '#fff', fontSize: 12, fontWeight: '600', fontVariant: ['tabular-nums'] as any },
  btnGhost: { borderWidth: 1, borderColor: Colors.teal, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  btnGhostText: { color: Colors.teal, fontSize: 12, fontWeight: '600', fontVariant: ['tabular-nums'] as any },
  activityHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  viewAllText: { fontSize: 12, fontWeight: '600', color: Colors.teal },
  activityCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, overflow: 'hidden' },
  activityItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, gap: 10 },
  activityItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  activityLeft: { flexDirection: 'row', gap: 10, flex: 1 },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.teal, marginTop: 6 },
  activityMember: { fontSize: 13, fontWeight: '600', color: Colors.textDark },
  activityAction: { fontSize: 11, color: Colors.textSub },
  activityTime: { fontSize: 10, color: Colors.textLight, marginTop: 2 },
  activityRight: { alignItems: 'flex-end', gap: 6 },
  activityAmount: { fontSize: 14, fontWeight: '700', color: Colors.textDark, fontVariant: ['tabular-nums'] as any },
  activityBadge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  activityBadgeText: { fontSize: 9, fontWeight: '600', fontVariant: ['tabular-nums'] as any },
  verifyBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: Colors.copper, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  verifyIcon: { fontSize: 14 },
  verifyText: { fontSize: 11, fontWeight: '600', color: Colors.copper, flex: 1 },
  profileModalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(8,13,30,0.5)' },
  profileModal: { gap: 9, padding: 18, paddingBottom: 28, backgroundColor: Colors.canvas, borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  profileModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  profileModalTitle: { color: Colors.textDark, fontSize: 18, fontWeight: '800' },
  profileModalSubtitle: { color: Colors.textSub, fontSize: 11, marginTop: 2 },
  profileModalClose: { color: Colors.teal, fontSize: 11, fontWeight: '700' },
  profileFieldLabel: { color: Colors.textSub, fontSize: 11, fontWeight: '600' },
  profileInput: { height: Input.height, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, color: Colors.textDark, backgroundColor: Colors.card },
  profileSaveButton: { minHeight: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.teal, borderRadius: 10 },
  profileSaveButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  profileSignOutButton: { alignItems: 'center', padding: 8 },
  profileSignOutText: { color: Colors.danger, fontSize: 11, fontWeight: '600' },
});
