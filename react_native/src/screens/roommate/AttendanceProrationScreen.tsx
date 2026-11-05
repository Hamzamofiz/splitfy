import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ApiStatus from '../../components/ApiStatus';
import ScreenHeader from '../../components/ScreenHeader';
import { attendanceApi, getApiErrorMessage } from '../../services/api';
import useRoomData from '../../services/useRoomData';
import { Colors } from '../../theme';

const UTILITY_BASE = 1050;
const MEAL_BASE = 3500;

export default function AttendanceProrationScreen() {
  const { room, loading: roomLoading, error: roomError, reload: reloadRoom } = useRoomData();
  const now = new Date();
  const year = now.getFullYear();
  const monthIndex = now.getMonth();
  const month = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  const roomId = room?._id;
  const DAYS = new Date(year, monthIndex + 1, 0).getDate();
  const [absent, setAbsent] = useState<Set<number>>(() => new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const present = DAYS - absent.size;
  const utilities = Math.round(UTILITY_BASE * present / DAYS);
  const meals = Math.round(MEAL_BASE * present / DAYS);
  const offset = new Date(year, monthIndex, 1).getDay();

  const reloadAttendance = useCallback(async () => {
    if (!roomId) return;
    setLoading(true);
    setError(null);
    try {
      const attendance = await attendanceApi.get(roomId, month);
      setAbsent(new Set(attendance?.absentDays ?? []));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [month, roomId]);

  useEffect(() => { reloadAttendance(); }, [reloadAttendance]);

  const saveAbsentDays = async (next: Set<number>) => {
    if (!roomId) {
      setError('Join a room before saving attendance.');
      return;
    }
    const previous = absent;
    setAbsent(next);
    setSaving(true);
    setError(null);
    try {
      const attendance = await attendanceApi.save(roomId, month, Array.from(next).sort((a, b) => a - b));
      setAbsent(new Set(attendance.absentDays));
    } catch (requestError) {
      setAbsent(previous);
      setError(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day: number) => {
    const next = new Set(absent);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    saveAbsentDays(next);
  };
  const changePresent = (delta: number) => {
    const next = new Set(absent);
    if (delta < 0 && next.size < DAYS) {
      const day = Array.from({ length: DAYS }, (_, i) => i + 1).find(item => !next.has(item));
      if (day !== undefined) next.add(day);
    } else if (delta > 0 && next.size) {
      next.delete(Math.min(...next));
    }
    saveAbsentDays(next);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Attendance & proration" subtitle="Select absent days and see your variable shares update." />
        <ApiStatus loading={roomLoading || loading} error={roomError || error} onRetry={() => { if (roomError) reloadRoom(); else reloadAttendance(); }} />
        {!roomLoading && !roomError && !room ? <Text style={styles.helper}>Join a room to save your attendance.</Text> : null}
        <View style={styles.card}>
          <Text style={styles.label}>Days present this cycle</Text>
          <Text style={styles.present}>{present}<Text style={styles.outOf}> / {DAYS} days</Text></Text>
          <View style={styles.controls}>
            <TouchableOpacity testID="attendance-decrease" accessibilityLabel="Decrease days present" disabled={saving} style={styles.control} onPress={() => changePresent(-1)}><Text style={styles.controlText}>−</Text></TouchableOpacity>
            <View style={styles.track}><View style={[styles.progress, { width: `${present / DAYS * 100}%` }]} /></View>
            <TouchableOpacity testID="attendance-increase" accessibilityLabel="Increase days present" disabled={saving} style={styles.control} onPress={() => changePresent(1)}><Text style={styles.controlText}>+</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.calendarHead}>
            <View><Text style={styles.section}>Attendance calendar</Text><Text style={styles.helper}>Tap a date to toggle absent</Text></View>
            <View style={styles.legend}><View style={styles.dot} /><Text style={styles.helper}>Absent</Text></View>
          </View>
          <View style={styles.grid}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <Text key={`${day}-${i}`} style={styles.weekday}>{day}</Text>)}
            {Array.from({ length: offset }, (_, i) => <View key={`empty-${i}`} style={styles.emptyDay} />)}
            {Array.from({ length: DAYS }, (_, i) => i + 1).map(day => {
              const isAbsent = absent.has(day);
              return <TouchableOpacity key={day} testID={`attendance-date-${day}`} accessibilityRole="button" accessibilityLabel={`Day ${day} ${isAbsent ? 'absent' : 'present'}`} accessibilityState={{ selected: isAbsent }} disabled={saving} style={[styles.day, isAbsent && styles.absentDay]} onPress={() => toggleDay(day)}><Text style={[styles.dayText, isAbsent && styles.absentText]}>{day}</Text></TouchableOpacity>;
            })}
          </View>
        </View>

        <Text style={styles.section}>Adjusted variable shares</Text>
        <View style={styles.shares}>
          <Share title="Utilities" base={UTILITY_BASE} present={present} amount={utilities} days={DAYS} />
          <View style={styles.divider} />
          <Share title="Meal fund" base={MEAL_BASE} present={present} amount={meals} days={DAYS} />
          <View style={styles.total}><Text style={styles.totalLabel}>Estimated total</Text><Text style={styles.totalValue}>PKR {(utilities + meals).toLocaleString()}</Text></View>
        </View>
        <Text style={styles.helper}>Attendance is saved to your room account. Estimates use the monthly base shares; final values depend on actual group records.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Share({ title, base, present, amount, days }: { title: string; base: number; present: number; amount: number; days: number }) {
  return <View style={styles.shareRow}><View style={styles.shareInfo}><Text style={styles.shareTitle}>{title}</Text><Text style={styles.helper}>PKR {base.toLocaleString()} × {present}/{days} days</Text></View><Text style={styles.shareAmount}>PKR {amount.toLocaleString()}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  content: { padding: 16, paddingBottom: 28, gap: 13 },
  card: { padding: 15, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, gap: 12 },
  label: { color: Colors.textSub, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  present: { color: Colors.teal, fontSize: 32, fontWeight: '900', textAlign: 'center', fontVariant: ['tabular-nums'] },
  outOf: { color: Colors.textSub, fontSize: 12, fontWeight: '500' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  control: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  controlText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  track: { flex: 1, height: 7, borderRadius: 4, backgroundColor: Colors.border, overflow: 'hidden' },
  progress: { height: '100%', backgroundColor: Colors.teal },
  calendarHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  section: { color: Colors.textDark, fontSize: 14, fontWeight: '800' },
  helper: { color: Colors.textLight, fontSize: 9, lineHeight: 14 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.copper },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  weekday: { width: '14.2857%', height: 26, textAlign: 'center', textAlignVertical: 'center', color: Colors.textLight, fontSize: 9, fontWeight: '700' },
  emptyDay: { width: '14.2857%', height: 38 },
  day: { width: '14.2857%', height: 38, alignItems: 'center', justifyContent: 'center' },
  absentDay: { backgroundColor: Colors.copperLight, borderRadius: 19 },
  dayText: { color: Colors.textDark, fontSize: 11, fontVariant: ['tabular-nums'] },
  absentText: { color: Colors.copper, fontWeight: '800' },
  shares: { backgroundColor: Colors.card, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: Colors.border },
  shareRow: { minHeight: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  shareInfo: { flex: 1, gap: 4 },
  shareTitle: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  shareAmount: { color: Colors.teal, fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  divider: { height: 1, backgroundColor: Colors.border },
  total: { minHeight: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: Colors.border },
  totalLabel: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  totalValue: { color: Colors.textDark, fontSize: 14, fontWeight: '900', fontVariant: ['tabular-nums'] },
});
