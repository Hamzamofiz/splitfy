import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/ScreenHeader';
import { useRoleSession } from '../../navigation/RoleSessionContext';
import { Colors, Input } from '../../theme';

export default function AdminSettingsScreen() {
  const { signOut } = useRoleSession();
  const [roomName, setRoomName] = useState('Gulberg Residency · Room 3');
  const [raast, setRaast] = useState('ROOM402@RAAST');
  const [easypaisa, setEasypaisa] = useState('03XX-XXXXXXX');
  const [notifyPayments, setNotifyPayments] = useState(true);
  const [notifyRepairs, setNotifyRepairs] = useState(true);

  const save = () => Alert.alert('Settings saved', 'Group details were updated on this device.');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Group settings" subtitle="Manage your room and payment details." />
        <View style={styles.card}>
          <Text style={styles.section}>Room details</Text>
          <Text style={styles.label}>Group name</Text>
          <TextInput style={styles.input} value={roomName} onChangeText={setRoomName} />
          <Text style={styles.label}>Active members</Text>
          <Text style={styles.memberCount}>4 members</Text>
          <Text style={styles.helper}>Invite code: <Text style={styles.code}>SH-402</Text></Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.section}>Group payment details</Text>
          <Text style={styles.label}>Raast ID</Text>
          <TextInput style={styles.input} value={raast} onChangeText={setRaast} autoCapitalize="none" />
          <Text style={styles.label}>Easypaisa number</Text>
          <TextInput style={styles.input} value={easypaisa} onChangeText={setEasypaisa} keyboardType="phone-pad" />
          <Text style={styles.helper}>Members will see these details when they submit a payment.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.section}>Notifications</Text>
          <SettingRow label="Payment proofs" value={notifyPayments} onChange={setNotifyPayments} />
          <SettingRow label="Maintenance requests" value={notifyRepairs} onChange={setNotifyRepairs} />
        </View>
        <TouchableOpacity testID="admin-settings-save" style={styles.save} onPress={save}><Text style={styles.saveText}>Save settings</Text></TouchableOpacity>
        <TouchableOpacity testID="admin-settings-sign-out" style={styles.signOut} onPress={signOut}><Text style={styles.signOutText}>Sign out</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return <View style={styles.settingRow}><Text style={styles.settingLabel}>{label}</Text><Switch value={value} onValueChange={onChange} trackColor={{ true: Colors.teal }} /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: 16, paddingBottom: 28, gap: 12 },
  card: { padding: 14, gap: 10, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  section: { color: Colors.textDark, fontSize: 14, fontWeight: '800' },
  label: { color: Colors.textSub, fontSize: 10, fontWeight: '600' },
  input: { height: Input.height, paddingHorizontal: 11, borderRadius: 9, borderWidth: 1, borderColor: Colors.border, color: Colors.textDark },
  memberCount: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  helper: { color: Colors.textSub, fontSize: 9 },
  code: { color: Colors.teal, fontWeight: '800' },
  settingRow: { minHeight: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: Colors.border },
  settingLabel: { color: Colors.textDark, fontSize: 11 },
  save: { minHeight: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: Colors.teal },
  saveText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  signOut: { alignItems: 'center', padding: 8 },
  signOutText: { color: Colors.danger, fontSize: 11, fontWeight: '700' },
});
