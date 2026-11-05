import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ApiStatus from '../../components/ApiStatus';
import ScreenHeader from '../../components/ScreenHeader';
import { useRoleSession } from '../../navigation/RoleSessionContext';
import { getApiErrorMessage, roomApi } from '../../services/api';
import useRoomData from '../../services/useRoomData';
import { Colors, Input } from '../../theme';

export default function AdminSettingsScreen() {
  const { signOut } = useRoleSession();
  const { room, setRoom, loading, error, reload } = useRoomData();
  const [roomName, setRoomName] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [raastId, setRaastId] = useState('');
  const [easypaisaNumber, setEasypaisaNumber] = useState('');
  const [creating, setCreating] = useState(false);
  const [notifyPayments, setNotifyPayments] = useState(true);
  const [notifyRepairs, setNotifyRepairs] = useState(true);

  useEffect(() => {
    if (room) {
      setRoomName(room.roomName);
      setMonthlyRent(String(room.monthlyRent));
      setRaastId(room.raastId ?? '');
      setEasypaisaNumber(room.easypaisaNumber ?? '');
    }
  }, [room]);

  const saveRoom = async () => {
    const rent = Number(monthlyRent);
    if (!roomName.trim() || !Number.isFinite(rent) || rent <= 0) {
      Alert.alert('Room details required', 'Enter a room name and valid monthly rent.');
      return;
    }
    setCreating(true);
    try {
      if (room) {
        setRoom(await roomApi.update(room._id, {
          roomName: roomName.trim(),
          monthlyRent: rent,
          raastId: raastId.trim(),
          easypaisaNumber: easypaisaNumber.trim(),
        }));
        Alert.alert('Settings saved', 'Your room and payment details were updated.');
      } else {
        await roomApi.create({
          roomName: roomName.trim(),
          monthlyRent: rent,
          raastId: raastId.trim(),
          easypaisaNumber: easypaisaNumber.trim(),
        });
        setRoom(await roomApi.getMyRoom());
        Alert.alert('Room created', 'Your room and member invite code are ready.');
      }
    } catch (requestError) {
      Alert.alert('Unable to save room settings', getApiErrorMessage(requestError));
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Group settings" subtitle="Manage your room and notification preferences." />
        <ApiStatus loading={loading} error={error} onRetry={reload} />
        <View style={styles.card}>
          <Text style={styles.section}>Room details</Text>
          <>
            <Text style={styles.label}>Group name</Text>
            <TextInput testID="admin-room-name" style={styles.input} value={roomName} onChangeText={setRoomName} placeholder="Room or group name" />
            <Text style={styles.label}>Monthly rent</Text>
            <TextInput testID="admin-room-rent" style={styles.input} value={monthlyRent} onChangeText={setMonthlyRent} placeholder="Monthly rent (PKR)" keyboardType="numeric" />
            <Text style={styles.label}>Raast ID</Text>
            <TextInput testID="admin-raast-id" style={styles.input} value={raastId} onChangeText={setRaastId} placeholder="Raast ID" autoCapitalize="none" />
            <Text style={styles.label}>Easypaisa number</Text>
            <TextInput testID="admin-easypaisa-number" style={styles.input} value={easypaisaNumber} onChangeText={setEasypaisaNumber} placeholder="Easypaisa number" keyboardType="phone-pad" />
            {room ? <>
              <Text style={styles.label}>Active members</Text>
              <Text style={styles.value}>{room.members.length} members</Text>
              <Text style={styles.helper}>Invite code: <Text style={styles.code}>{room.inviteCode || 'Unavailable'}</Text></Text>
            </> : !loading && !error ? <Text style={styles.helper}>Create a room to get an invite code and manage shared bills.</Text> : null}
            {!loading && !error ? <TouchableOpacity testID="admin-settings-save" style={[styles.save, creating && styles.disabled]} disabled={creating} onPress={saveRoom}><Text style={styles.saveText}>{creating ? 'Saving…' : room ? 'Save settings' : 'Create room'}</Text></TouchableOpacity> : null}
          </>
        </View>
        <View style={styles.card}>
          <Text style={styles.section}>Notifications</Text>
          <SettingRow label="Payment updates" value={notifyPayments} onChange={setNotifyPayments} />
          <SettingRow label="Maintenance requests" value={notifyRepairs} onChange={setNotifyRepairs} />
          <Text style={styles.helper}>Notification preferences apply on this device.</Text>
        </View>
        <TouchableOpacity testID="admin-settings-sign-out" style={styles.signOut} onPress={() => signOut().catch(requestError => Alert.alert('Unable to sign out', getApiErrorMessage(requestError)))}><Text style={styles.signOutText}>Sign out</Text></TouchableOpacity>
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
  value: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  helper: { color: Colors.textSub, fontSize: 9 },
  code: { color: Colors.teal, fontWeight: '800' },
  settingRow: { minHeight: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: Colors.border },
  settingLabel: { color: Colors.textDark, fontSize: 11 },
  save: { minHeight: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: Colors.teal },
  saveText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  disabled: { opacity: 0.6 },
  signOut: { alignItems: 'center', padding: 8 },
  signOutText: { color: Colors.danger, fontSize: 11, fontWeight: '700' },
});
