import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ApiStatus from '../../components/ApiStatus';
import ScreenHeader from '../../components/ScreenHeader';
import useRoomData from '../../services/useRoomData';
import { Colors } from '../../theme';

export default function AdminRoommatesScreen() {
  const { room, loading, error, reload } = useRoomData();
  const members = room?.members.filter(member => typeof member !== 'string') ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Roommates & members" subtitle={room ? `${members.length} members in ${room.roomName}` : 'Members in your room'} />
        <ApiStatus loading={loading} error={error} onRetry={reload} />
        {!loading && !error && !room ? <Text style={styles.empty}>Create your room in Settings before inviting members.</Text> : null}
        {room ? <>
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Active room members</Text>
            <Text style={styles.summaryValue}>{members.filter(member => member.role === 'roommate').length}</Text>
          </View>
          {members.map(member => (
            <View key={member._id} style={styles.member}>
              <View style={styles.initial}><Text style={styles.initialText}>{member.name[0]?.toUpperCase() ?? '?'}</Text></View>
              <View style={styles.memberInfo}>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.muted}>{member.phone || member.email} · {member.role === 'admin' ? 'Admin' : 'Member'}</Text>
              </View>
            </View>
          ))}
          <View style={styles.form}>
            <Text style={styles.section}>Invite members</Text>
            <Text style={styles.invite}>Share this invite code with a new Member: <Text style={styles.inviteCode}>{room.inviteCode || 'Unavailable'}</Text></Text>
          </View>
        </> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: 16, paddingBottom: 28, gap: 12 },
  empty: { color: Colors.textSub, fontSize: 11 },
  summary: { padding: 14, borderRadius: 13, backgroundColor: Colors.teal, gap: 4 },
  summaryLabel: { color: '#D5FFFA', fontSize: 10 },
  summaryValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  member: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 11, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, backgroundColor: Colors.card },
  initial: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.tealLight },
  initialText: { color: Colors.teal, fontSize: 12, fontWeight: '800' },
  memberInfo: { flex: 1, gap: 4 },
  name: { color: Colors.textDark, fontSize: 11, fontWeight: '700' },
  muted: { color: Colors.textSub, fontSize: 9 },
  form: { padding: 13, gap: 9, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, backgroundColor: Colors.card },
  section: { color: Colors.textDark, fontSize: 14, fontWeight: '800' },
  invite: { color: Colors.textSub, fontSize: 10 },
  inviteCode: { color: Colors.teal, fontWeight: '800' },
});
