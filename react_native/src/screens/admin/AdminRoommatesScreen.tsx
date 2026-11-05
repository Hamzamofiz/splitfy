import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/ScreenHeader';
import { Colors, Input } from '../../theme';

type Member = { id: string; name: string; phone: string; due: number; status: 'Active' | 'Pending' };

export default function AdminRoommatesScreen() {
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Ahmed Raza', phone: '0300 *** 1122', due: 2675, status: 'Active' },
    { id: '2', name: 'Fatima Khan', phone: '0301 *** 2233', due: 1850, status: 'Active' },
    { id: '3', name: 'Bilal Hassan', phone: '0302 *** 3344', due: 2500, status: 'Pending' },
  ]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const addMember = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Member details required', 'Enter a name and phone number.');
      return;
    }
    setMembers(current => [...current, { id: `${Date.now()}`, name: name.trim(), phone, due: 0, status: 'Active' }]);
    setName(''); setPhone('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Roommates & members" subtitle={`${members.length} members in Gulberg Residency · Room 3`} />
        <View style={styles.summary}><Text style={styles.summaryLabel}>Active room members</Text><Text style={styles.summaryValue}>{members.filter(member => member.status === 'Active').length}</Text></View>
        {members.map(member => <View key={member.id} style={styles.member}>
          <View style={styles.initial}><Text style={styles.initialText}>{member.name[0]}</Text></View>
          <View style={styles.memberInfo}><Text style={styles.name}>{member.name}</Text><Text style={styles.muted}>{member.phone} · {member.status}</Text></View>
          <Text style={styles.due}>PKR {member.due.toLocaleString()}</Text>
        </View>)}
        <View style={styles.form}>
          <Text style={styles.section}>Invite a member</Text>
          <Text style={styles.invite}>Room invite code: <Text style={styles.inviteCode}>SH-402</Text></Text>
          <TextInput testID="admin-member-name" style={styles.input} value={name} onChangeText={setName} placeholder="Member full name" />
          <TextInput testID="admin-member-phone" style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" />
          <TouchableOpacity testID="admin-add-member" style={styles.submit} onPress={addMember}><Text style={styles.submitText}>Add member</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: 16, paddingBottom: 28, gap: 12 },
  summary: { padding: 14, borderRadius: 13, backgroundColor: Colors.teal, gap: 4 },
  summaryLabel: { color: '#D5FFFA', fontSize: 10 },
  summaryValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  member: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 11, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, backgroundColor: Colors.card },
  initial: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.tealLight },
  initialText: { color: Colors.teal, fontSize: 12, fontWeight: '800' },
  memberInfo: { flex: 1, gap: 4 },
  name: { color: Colors.textDark, fontSize: 11, fontWeight: '700' },
  muted: { color: Colors.textSub, fontSize: 9 },
  due: { color: Colors.textDark, fontSize: 9, fontWeight: '700', fontVariant: ['tabular-nums'] },
  form: { padding: 13, gap: 9, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, backgroundColor: Colors.card },
  section: { color: Colors.textDark, fontSize: 14, fontWeight: '800' },
  invite: { color: Colors.textSub, fontSize: 10 },
  inviteCode: { color: Colors.teal, fontWeight: '800' },
  input: { minHeight: Input.height, paddingHorizontal: 11, borderWidth: 1, borderColor: Colors.border, borderRadius: 9, color: Colors.textDark },
  submit: { minHeight: 43, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: Colors.teal },
  submitText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
});
