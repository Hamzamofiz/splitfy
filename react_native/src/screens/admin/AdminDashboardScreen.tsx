import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DocumentPickerResponse } from '@react-native-documents/picker';

import FilePickerButton from '../../components/FilePickerButton';
import ScreenHeader from '../../components/ScreenHeader';
import { useRoleSession } from '../../navigation/RoleSessionContext';
import type { AdminTabParamList } from '../../navigation/types';
import { Colors, Input } from '../../theme';

type Props = BottomTabScreenProps<AdminTabParamList, 'Dashboard'>;
const INITIAL_BILLS = [
  { title: 'Electricity', amount: 4200, due: 'Oct 28', status: 'Due soon' },
  { title: 'Gas', amount: 1850, due: 'Oct 30', status: 'Pending' },
  { title: 'Internet', amount: 2500, due: 'Nov 01', status: 'Upcoming' },
];
const ACTIVITY = [
  { member: 'Ahmed Raza', action: 'Paid via Raast', amount: '+ PKR 2,800', status: 'Verified' },
  { member: 'Fatima Khan', action: 'Paid via Easypaisa', amount: '+ PKR 1,850', status: 'Verified' },
  { member: 'Bilal Hassan', action: 'Cash proof submitted', amount: 'PKR 2,500', status: 'Pending Approval' },
];

export default function AdminDashboardScreen({ navigation }: Props) {
  const { signOut } = useRoleSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState('Admin');
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
        <View style={styles.top}>
          <TouchableOpacity testID="admin-open-profile" accessibilityRole="button" accessibilityLabel="Update profile" style={styles.avatar} onPress={() => setProfileOpen(true)}>
            {photo ? <Image source={{ uri: photo.uri }} style={styles.avatarImage} /> : <Text style={styles.avatarText}>{name[0]?.toUpperCase() ?? 'A'}</Text>}
          </TouchableOpacity>
          <View style={styles.location}><Text style={styles.eyebrow}>GROUP ADMIN</Text><Text style={styles.locationText}>Gulberg Residency · Room 3</Text></View>
          <TouchableOpacity style={styles.logout} onPress={signOut}><Text style={styles.logoutText}>Log out</Text></TouchableOpacity>
        </View>
        <ScreenHeader title="Admin dashboard" subtitle="Room 3 overview · October cycle" />
        <View style={styles.metricRow}>
          <Metric label="Collected" value="PKR 38,450" />
          <Metric label="Pending" value="PKR 6,200" accent />
        </View>
        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quick} onPress={() => navigation.navigate('Bills')}><Text style={styles.quickText}>＋ Add expense</Text></TouchableOpacity>
          <TouchableOpacity style={styles.quick} onPress={() => navigation.navigate('Roommates')}><Text style={styles.quickText}>＋ Add member</Text></TouchableOpacity>
        </View>
        <Text style={styles.section}>Upcoming bills</Text>
        {INITIAL_BILLS.map(bill => <View key={bill.title} style={styles.bill}>
          <View style={styles.billInfo}><Text style={styles.billTitle}>{bill.title}</Text><Text style={styles.muted}>{bill.status} · Due {bill.due}</Text></View>
          <Text style={styles.amount}>PKR {bill.amount.toLocaleString()}</Text>
        </View>)}
        <Text style={styles.section}>Recent activity</Text>
        <View style={styles.activityCard}>{ACTIVITY.map((item, index) => <View key={item.member} style={[styles.activity, index > 0 && styles.divider]}>
          <View style={styles.activityInfo}><Text style={styles.memberName}>{item.member}</Text><Text style={styles.muted}>{item.action}</Text></View>
          <View style={styles.activityRight}><Text style={styles.amount}>{item.amount}</Text><Text style={[styles.status, item.status === 'Verified' ? styles.verified : styles.pending]}>{item.status}</Text></View>
        </View>)}</View>
      </ScrollView>

      <Modal visible={profileOpen} animationType="slide" transparent onRequestClose={() => setProfileOpen(false)}>
        <View style={styles.backdrop}><View style={styles.modal}>
          <View style={styles.modalHeader}><Text style={styles.modalTitle}>Update profile</Text><TouchableOpacity onPress={() => setProfileOpen(false)}><Text style={styles.link}>Close</Text></TouchableOpacity></View>
          <Field label="Name" value={name} onChangeText={setName} testID="admin-profile-name" />
          <Field label="Phone Number" value={phone} onChangeText={setPhone} testID="admin-profile-phone" keyboardType="phone-pad" />
          <Field label="Emergency Contact" value={emergency} onChangeText={setEmergency} testID="admin-profile-emergency-contact" />
          <FilePickerButton testID="admin-profile-photo-picker" kind="photo" onPicked={setPhoto} />
          <TouchableOpacity testID="admin-save-profile" style={styles.saveButton} onPress={saveProfile}><Text style={styles.saveText}>Save profile</Text></TouchableOpacity>
          <TouchableOpacity testID="admin-profile-sign-out" onPress={() => { setProfileOpen(false); signOut(); }}><Text style={styles.signOut}>Sign out</Text></TouchableOpacity>
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <View style={styles.metric}><Text style={styles.muted}>{label}</Text><Text style={[styles.metricValue, accent && styles.accent]}>{value}</Text></View>;
}
function Field({ label, ...props }: { label: string; value: string; onChangeText: (value: string) => void; testID: string; keyboardType?: 'phone-pad' }) {
  return <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput {...props} style={styles.input} placeholder={label} placeholderTextColor={Colors.textLight} /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: 16, paddingBottom: 28, gap: 12 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingBottom: 10, borderBottomWidth: 1, borderColor: Colors.border },
  avatar: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: Colors.teal, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  location: { flex: 1, gap: 2 },
  eyebrow: { color: Colors.teal, fontSize: 8, fontWeight: '800', letterSpacing: 0.6 },
  locationText: { color: Colors.textDark, fontSize: 10, fontWeight: '700' },
  logout: { paddingHorizontal: 9, paddingVertical: 6, borderWidth: 1, borderColor: Colors.copper, borderRadius: 8 },
  logoutText: { color: Colors.copper, fontSize: 9, fontWeight: '700' },
  metricRow: { flexDirection: 'row', gap: 8 },
  metric: { flex: 1, padding: 12, gap: 5, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, backgroundColor: Colors.card },
  muted: { color: Colors.textSub, fontSize: 9 },
  metricValue: { color: Colors.teal, fontSize: 13, fontWeight: '800', fontVariant: ['tabular-nums'] },
  accent: { color: Colors.copper },
  quickRow: { flexDirection: 'row', gap: 8 },
  quick: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: Colors.tealLight },
  quickText: { color: Colors.teal, fontSize: 10, fontWeight: '700' },
  section: { color: Colors.textDark, fontSize: 14, fontWeight: '800' },
  bill: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, backgroundColor: Colors.card },
  billInfo: { gap: 4 },
  billTitle: { color: Colors.textDark, fontSize: 11, fontWeight: '700' },
  amount: { color: Colors.textDark, fontSize: 10, fontWeight: '700', fontVariant: ['tabular-nums'] },
  activityCard: { paddingHorizontal: 11, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, backgroundColor: Colors.card },
  activity: { minHeight: 58, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  divider: { borderTopWidth: 1, borderColor: Colors.border },
  activityInfo: { flex: 1, gap: 4 },
  memberName: { color: Colors.textDark, fontSize: 10, fontWeight: '700' },
  activityRight: { alignItems: 'flex-end', gap: 4 },
  status: { overflow: 'hidden', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3, fontSize: 8, fontWeight: '700' },
  verified: { color: Colors.teal, backgroundColor: Colors.tealLight },
  pending: { color: Colors.copper, backgroundColor: Colors.copperLight },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(8,13,30,0.5)' },
  modal: { gap: 10, padding: 18, paddingBottom: 28, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: Colors.canvas },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { color: Colors.textDark, fontSize: 18, fontWeight: '800' },
  link: { color: Colors.teal, fontSize: 10, fontWeight: '700' },
  field: { gap: 5 },
  fieldLabel: { color: Colors.textSub, fontSize: 10, fontWeight: '600' },
  input: { height: Input.height, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, backgroundColor: Colors.card, color: Colors.textDark },
  saveButton: { minHeight: 45, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: Colors.teal },
  saveText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  signOut: { color: Colors.danger, textAlign: 'center', fontSize: 11, fontWeight: '700', padding: 6 },
});
