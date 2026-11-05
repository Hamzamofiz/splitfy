import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DocumentPickerResponse } from '@react-native-documents/picker';

import FilePickerButton from '../../components/FilePickerButton';
import ScreenHeader from '../../components/ScreenHeader';
import { useRoleSession } from '../../navigation/RoleSessionContext';
import type { RoommateTabParamList } from '../../navigation/types';
import { Colors, Input } from '../../theme';

type Props = BottomTabScreenProps<RoommateTabParamList, 'Home'>;
const BILL_DATA = [
  { name: 'Electricity', due: 'Due Oct 28', share: 1050, status: 'Due soon' },
  { name: 'Internet', due: 'Due Nov 01', share: 625, status: 'Upcoming' },
];
const ACTIVITY = [
  { title: 'Payment via Raast', note: 'PKR 1,200', status: 'Verified' },
  { title: 'October electricity', note: 'Share added · PKR 1,050', status: 'Pending Approval' },
  { title: 'Kitchen tap repair', note: 'Allocated share · PKR 180', status: 'Receipt Attached' },
];

export default function RoommateDashboardScreen({ navigation }: Props) {
  const { signOut } = useRoleSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState('Member');
  const [phone, setPhone] = useState('');
  const [emergency, setEmergency] = useState('');
  const [photo, setPhoto] = useState<DocumentPickerResponse | null>(null);

  const saveProfile = () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Enter your name before saving.');
      return;
    }
    setName(name.trim());
    setProfileOpen(false);
    Alert.alert('Profile updated', 'Your profile was updated on this device.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ScreenHeader title="Home" subtitle="Your shared living overview" />
          <TouchableOpacity testID="open-profile" accessibilityLabel="Update profile" accessibilityRole="button" style={styles.avatar} onPress={() => setProfileOpen(true)}>
            {photo ? <Image source={{ uri: photo.uri }} style={styles.avatarImage} /> : <Text style={styles.avatarText}>{name[0]?.toUpperCase() ?? 'M'}</Text>}
          </TouchableOpacity>
        </View>
        <View style={styles.balance}>
          <Text style={styles.balanceLabel}>Your current balance</Text>
          <Text style={styles.balanceValue}>PKR 2,675</Text>
          <Text style={styles.balanceLabel}>Amount due this month</Text>
          <TouchableOpacity style={styles.lightButton} onPress={() => navigation.navigate('Settlement')}>
            <Text style={styles.lightButtonText}>View settlement</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.quickRow}>
          <QuickAction label="Upload Daily Expense" onPress={() => navigation.navigate('Bills')} />
          <QuickAction label="Mark Absent Days" onPress={() => navigation.navigate('Attendance')} />
          <QuickAction label="Pay Bill" onPress={() => navigation.navigate('Bills')} />
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Active bills</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Bills')}><Text style={styles.link}>View all</Text></TouchableOpacity>
        </View>
        {BILL_DATA.map(bill => (
          <View key={bill.name} style={styles.bill}>
            <View style={styles.billInfo}>
              <Text style={styles.billName}>{bill.name}</Text>
              <View style={styles.billMeta}>
                <Text style={[styles.badge, bill.status === 'Due soon' ? styles.pendingBadge : styles.successBadge]}>{bill.status}</Text>
                <Text style={styles.muted}>{bill.due}</Text>
              </View>
            </View>
            <Text style={styles.money}>PKR {bill.share.toLocaleString()}</Text>
          </View>
        ))}
        <Text style={styles.sectionTitle}>Recent activity</Text>
        <View style={styles.card}>
          {ACTIVITY.map((item, index) => (
            <View key={item.title} style={[styles.activity, index > 0 && styles.divider]}>
              <View style={styles.activityCopy}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.muted}>{item.note}</Text>
              </View>
              <Text style={[styles.badge, item.status === 'Verified' ? styles.successBadge : styles.pendingBadge]}>{item.status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={profileOpen} animationType="slide" transparent onRequestClose={() => setProfileOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>Update profile</Text>
              <TouchableOpacity onPress={() => setProfileOpen(false)}><Text style={styles.link}>Close</Text></TouchableOpacity>
            </View>
            <Field label="Name" value={name} onChangeText={setName} testID="profile-name" />
            <Field label="Phone" value={phone} onChangeText={setPhone} testID="profile-phone" keyboardType="phone-pad" />
            <Field label="Emergency contact" value={emergency} onChangeText={setEmergency} testID="profile-emergency-contact" />
            <FilePickerButton testID="profile-photo-picker" kind="photo" onPicked={setPhoto} />
            <TouchableOpacity testID="save-profile" style={styles.primaryButton} onPress={saveProfile}><Text style={styles.primaryText}>Save profile</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { setProfileOpen(false); signOut(); }}><Text style={styles.signOut}>Sign out</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function QuickAction({ label, onPress }: { label: string; onPress: () => void }) {
  return <TouchableOpacity style={styles.quickAction} accessibilityRole="button" onPress={onPress}><Text style={styles.quickText}>{label}</Text></TouchableOpacity>;
}

function Field({ label, ...props }: { label: string; value: string; onChangeText: (value: string) => void; testID: string; keyboardType?: 'phone-pad' }) {
  return <View style={styles.fieldGroup}><Text style={styles.fieldLabel}>{label}</Text><TextInput {...props} style={styles.input} placeholder={label} placeholderTextColor={Colors.textLight} /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: 16, gap: 12, paddingBottom: 28 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.teal, overflow: 'hidden' },
  avatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  avatarImage: { width: '100%', height: '100%' },
  balance: { backgroundColor: Colors.teal, padding: 18, borderRadius: 18, gap: 6 },
  balanceLabel: { color: '#D5FFFA', fontSize: 11 },
  balanceValue: { color: '#FFFFFF', fontSize: 29, fontWeight: '900', fontVariant: ['tabular-nums'] },
  lightButton: { alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: '#FFFFFF', borderRadius: 9 },
  lightButtonText: { color: Colors.teal, fontWeight: '700', fontSize: 11 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: Colors.textDark, fontSize: 15, fontWeight: '800' },
  link: { color: Colors.teal, fontSize: 11, fontWeight: '700' },
  quickRow: { flexDirection: 'row', gap: 7 },
  quickAction: { flex: 1, minHeight: 55, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  quickText: { color: Colors.teal, fontSize: 9, fontWeight: '700', textAlign: 'center' },
  bill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: 13, borderRadius: 13, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  billInfo: { flex: 1, gap: 5 },
  billName: { color: Colors.textDark, fontSize: 13, fontWeight: '700' },
  billMeta: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  badge: { overflow: 'hidden', borderRadius: 9, paddingHorizontal: 7, paddingVertical: 3, fontSize: 8, fontWeight: '700' },
  pendingBadge: { color: Colors.copper, backgroundColor: Colors.copperLight },
  successBadge: { color: Colors.teal, backgroundColor: Colors.tealLight },
  muted: { color: Colors.textSub, fontSize: 10 },
  money: { color: Colors.textDark, fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  card: { paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  activity: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  activityCopy: { flex: 1, gap: 4 },
  activityTitle: { color: Colors.textDark, fontSize: 11, fontWeight: '700' },
  divider: { borderTopWidth: 1, borderTopColor: Colors.border },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(8,13,30,0.5)' },
  modal: { gap: 10, padding: 18, paddingBottom: 28, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: Colors.canvas },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { color: Colors.textDark, fontSize: 18, fontWeight: '800' },
  fieldGroup: { gap: 5 },
  fieldLabel: { color: Colors.textSub, fontSize: 11, fontWeight: '600' },
  input: { height: Input.height, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, backgroundColor: Colors.card, color: Colors.textDark },
  primaryButton: { minHeight: 46, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: Colors.teal },
  primaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  signOut: { textAlign: 'center', padding: 8, color: Colors.danger, fontSize: 11, fontWeight: '700' },
});
