import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import ApiStatus from '../../components/ApiStatus';
import ScreenHeader from '../../components/ScreenHeader';
import { useRoleSession } from '../../navigation/RoleSessionContext';
import type { AdminTabParamList } from '../../navigation/types';
import { authApi, billApi, getApiErrorMessage, maintenanceApi, settlementApi, type Bill, type MaintenanceIssue, type Settlement } from '../../services/api';
import useRoomData from '../../services/useRoomData';
import { Colors, Input } from '../../theme';

type Props = BottomTabScreenProps<AdminTabParamList, 'Dashboard'>;

function userName(value: Settlement['payer']) {
  return typeof value === 'string' ? 'Room member' : value.name;
}

export default function AdminDashboardScreen({ navigation }: Props) {
  const { user, signOut, updateUser } = useRoleSession();
  const { room, loading: roomLoading, error: roomError, reload: reloadRoom } = useRoomData();
  const [bills, setBills] = useState<Bill[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setPhone(user?.phone ?? '');
  }, [user]);

  const reload = useCallback(async () => {
    if (!room) return;
    setLoading(true);
    setError(null);
    try {
      const [nextBills, nextSettlements, nextMaintenance] = await Promise.all([
        billApi.list(room._id),
        settlementApi.list(room._id),
        maintenanceApi.list(room._id),
      ]);
      setBills(nextBills);
      setSettlements(nextSettlements);
      setMaintenance(nextMaintenance);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [room]);

  useEffect(() => { reload(); }, [reload]);

  const saveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Enter your name before saving.');
      return;
    }
    setSavingProfile(true);
    try {
      const updated = await authApi.updateProfile({ name: name.trim(), phone: phone.trim() });
      await updateUser(updated);
      setProfileOpen(false);
      Alert.alert('Profile updated', 'Your profile was saved.');
    } catch (requestError) {
      Alert.alert('Unable to update profile', getApiErrorMessage(requestError));
    } finally {
      setSavingProfile(false);
    }
  };

  const collected = settlements.filter(item => item.status === 'Completed').reduce((sum, item) => sum + item.amount, 0);
  const pending = bills.reduce((sum, bill) => sum + bill.assignedTo.filter(assignment => !assignment.isPaid).reduce((subtotal, assignment) => subtotal + assignment.shareAmount, 0), 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.top}>
          <TouchableOpacity testID="admin-open-profile" accessibilityRole="button" accessibilityLabel="Update profile" style={styles.avatar} onPress={() => setProfileOpen(true)}>
            <Text style={styles.avatarText}>{name[0]?.toUpperCase() ?? 'A'}</Text>
          </TouchableOpacity>
          <View style={styles.location}><Text style={styles.eyebrow}>GROUP ADMIN</Text><Text style={styles.locationText}>{room?.roomName ?? 'Your room'}</Text></View>
          <TouchableOpacity style={styles.logout} onPress={() => signOut().catch(requestError => Alert.alert('Unable to sign out', getApiErrorMessage(requestError)))}><Text style={styles.logoutText}>Log out</Text></TouchableOpacity>
        </View>
        <ScreenHeader title="Admin dashboard" subtitle={room ? `${room.members.length} members · Room overview` : 'Room overview'} />
        <ApiStatus loading={roomLoading || loading} error={roomError || error} onRetry={() => { if (roomError) reloadRoom(); else reload(); }} />
        {!roomLoading && !roomError && !room ? <Text style={styles.muted}>Create your room in Settings to start managing shared bills and repairs.</Text> : null}
        <View style={styles.metricRow}>
          <Metric label="Collected" value={`PKR ${collected.toLocaleString()}`} />
          <Metric label="Pending" value={`PKR ${pending.toLocaleString()}`} accent />
        </View>
        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quick} onPress={() => navigation.navigate('Bills')}><Text style={styles.quickText}>＋ Add bill</Text></TouchableOpacity>
          <TouchableOpacity style={styles.quick} onPress={() => navigation.navigate('Roommates')}><Text style={styles.quickText}>View members</Text></TouchableOpacity>
        </View>
        <Text style={styles.section}>Upcoming bills</Text>
        {bills.slice(0, 3).map(bill => <View key={bill._id} style={styles.bill}>
          <View style={styles.billInfo}><Text style={styles.billTitle}>{bill.title}</Text><Text style={styles.muted}>{bill.status} · Due {new Date(bill.dueDate).toLocaleDateString()}</Text></View>
          <Text style={styles.amount}>PKR {bill.totalAmount.toLocaleString()}</Text>
        </View>)}
        {!loading && room && bills.length === 0 ? <Text style={styles.muted}>No bills have been added to this room.</Text> : null}
        <Text style={styles.section}>Recent activity</Text>
        <View style={styles.activityCard}>
          {settlements.slice(0, 3).map((item, index) => <View key={item._id} style={[styles.activity, index > 0 && styles.divider]}>
            <View style={styles.activityInfo}><Text style={styles.memberName}>{userName(item.payer)}</Text><Text style={styles.muted}>{item.note || item.paymentMethod}</Text></View>
            <View style={styles.activityRight}><Text style={styles.amount}>PKR {item.amount.toLocaleString()}</Text><Text style={[styles.status, item.status === 'Completed' ? styles.verified : styles.pending]}>{item.status}</Text></View>
          </View>)}
          {maintenance.slice(0, 2).map(item => <View key={item._id} style={[styles.activity, styles.divider]}>
            <View style={styles.activityInfo}><Text style={styles.memberName}>{item.description}</Text><Text style={styles.muted}>Maintenance · {item.status.toLowerCase().replace('_', ' ')}</Text></View>
            <Text style={styles.amount}>PKR {item.repairCost.toLocaleString()}</Text>
          </View>)}
          {!loading && room && settlements.length === 0 && maintenance.length === 0 ? <Text style={styles.muted}>No recent activity.</Text> : null}
        </View>
      </ScrollView>

      <Modal visible={profileOpen} animationType="slide" transparent onRequestClose={() => setProfileOpen(false)}>
        <View style={styles.backdrop}><View style={styles.modal}>
          <View style={styles.modalHeader}><Text style={styles.modalTitle}>Update profile</Text><TouchableOpacity onPress={() => setProfileOpen(false)}><Text style={styles.link}>Close</Text></TouchableOpacity></View>
          <Field label="Name" value={name} onChangeText={setName} testID="admin-profile-name" />
          <Field label="Phone Number" value={phone} onChangeText={setPhone} testID="admin-profile-phone" keyboardType="phone-pad" />
          <TouchableOpacity testID="admin-save-profile" style={styles.saveButton} disabled={savingProfile} onPress={saveProfile}><Text style={styles.saveText}>{savingProfile ? 'Saving…' : 'Save profile'}</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { setProfileOpen(false); signOut().catch(requestError => Alert.alert('Unable to sign out', getApiErrorMessage(requestError))); }}><Text style={styles.signOut}>Sign out</Text></TouchableOpacity>
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
