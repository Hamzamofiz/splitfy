import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoommatePageHeader from '../../components/RoommatePageHeader';
import { Colors } from '../../theme';

const DAYS_IN_CYCLE = 30;
const BASE_UTILITY_SHARE = 1050;
const BASE_MEAL_SHARE = 3500;

export default function AttendanceProrationScreen() {
  const [absentDays, setAbsentDays] = useState<Set<number>>(() => new Set());
  const daysPresent = DAYS_IN_CYCLE - absentDays.size;
  const attendanceRatio = daysPresent / DAYS_IN_CYCLE;
  const utilityShare = Math.round(BASE_UTILITY_SHARE * attendanceRatio);
  const mealShare = Math.round(BASE_MEAL_SHARE * attendanceRatio);
  const firstDayOffset = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
  const cycleMonth = new Date().toLocaleDateString('en-PK', { month: 'long', year: 'numeric' });

  const adjustDays = (adjustment: number) => {
    setAbsentDays(current => {
      const next = new Set(current);
      if (adjustment < 0 && next.size < DAYS_IN_CYCLE) {
        const nextAbsentDay = Array.from({ length: DAYS_IN_CYCLE }, (_, index) => index + 1)
          .find(day => !next.has(day));
        if (nextAbsentDay !== undefined) {
          next.add(nextAbsentDay);
        }
      } else if (adjustment > 0 && next.size > 0) {
        next.delete(Math.min(...next));
      }
      return next;
    });
  };

  const toggleAbsentDay = (day: number) => {
    setAbsentDays(current => {
      const next = new Set(current);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <RoommatePageHeader
          title="Attendance & proration"
          subtitle="Variable utility and meal shares adjust to your days present."
        />

        <View style={styles.attendanceCard}>
          <Text style={styles.cardLabel}>Days present this cycle</Text>
          <Text style={styles.daysValue}>{daysPresent}<Text style={styles.daysTotal}> / {DAYS_IN_CYCLE} days</Text></Text>
          <View style={styles.controls}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Decrease days present"
              disabled={daysPresent === 0}
              onPress={() => adjustDays(-1)}
              style={[styles.adjustButton, daysPresent === 0 && styles.disabledButton]}
            >
              <Text style={styles.adjustText}>−</Text>
            </TouchableOpacity>
            <View style={styles.track}>
              <View style={[styles.progress, { width: `${attendanceRatio * 100}%` }]} />
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Increase days present"
              disabled={daysPresent === DAYS_IN_CYCLE}
              onPress={() => adjustDays(1)}
              style={[styles.adjustButton, daysPresent === DAYS_IN_CYCLE && styles.disabledButton]}
            >
              <Text style={styles.adjustText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.helper}>Use + or − to set a value from 0 to 30 days.</Text>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.calendarHeading}>
            <View>
              <Text style={styles.calendarTitle}>Attendance calendar</Text>
              <Text style={styles.calendarMonth}>{cycleMonth} · 30-day cycle</Text>
            </View>
            <View style={styles.calendarLegend}>
              <View style={styles.absentDot} />
              <Text style={styles.legendText}>Absent</Text>
            </View>
          </View>
          <View style={styles.calendarGrid}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={`${day}-${index}`} style={styles.weekday}>{day}</Text>
            ))}
            {Array.from({ length: firstDayOffset }, (_, index) => (
              <View key={`empty-${index}`} style={styles.calendarEmpty} />
            ))}
            {Array.from({ length: DAYS_IN_CYCLE }, (_, index) => index + 1).map(day => {
              const isAbsent = absentDays.has(day);
              return (
                <TouchableOpacity
                  key={day}
                  testID={`attendance-date-${day}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${cycleMonth} ${day}, ${isAbsent ? 'absent' : 'present'}`}
                  accessibilityState={{ selected: isAbsent }}
                  onPress={() => toggleAbsentDay(day)}
                  style={[styles.calendarDay, isAbsent && styles.calendarDayAbsent]}
                >
                  <Text style={[styles.calendarDayText, isAbsent && styles.calendarDayAbsentText]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.helper}>Tap any date to mark or clear an absence. Shares recalculate instantly.</Text>
        </View>

        <Text style={styles.sectionTitle}>Adjusted variable shares</Text>
        <View style={styles.shareCard}>
          <View style={styles.shareRow}>
            <View style={styles.shareInfo}>
              <Text style={styles.shareName}>Utilities</Text>
              <Text style={styles.shareFormula}>PKR {BASE_UTILITY_SHARE.toLocaleString()} base × {daysPresent}/{DAYS_IN_CYCLE}</Text>
            </View>
            <Text style={styles.shareAmount}>PKR {utilityShare.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.shareRow}>
            <View style={styles.shareInfo}>
              <Text style={styles.shareName}>Meals</Text>
              <Text style={styles.shareFormula}>PKR {BASE_MEAL_SHARE.toLocaleString()} base × {daysPresent}/{DAYS_IN_CYCLE}</Text>
            </View>
            <Text style={styles.shareAmount}>PKR {mealShare.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated total</Text>
            <Text style={styles.totalAmount}>PKR {(utilityShare + mealShare).toLocaleString()}</Text>
          </View>
        </View>

        <Text style={styles.disclaimer}>
          These estimates use the current monthly base shares. Final amounts may change when your group records actual bills.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 14, paddingBottom: 28 },
  attendanceCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  cardLabel: { color: Colors.textSub, fontSize: 12, fontWeight: '600' },
  daysValue: { color: Colors.teal, fontSize: 32, fontWeight: '800', fontVariant: ['tabular-nums'] },
  daysTotal: { color: Colors.textSub, fontSize: 13, fontWeight: '500' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%' },
  adjustButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: { opacity: 0.4 },
  adjustText: { color: '#FFFFFF', fontSize: 21, fontWeight: '700' },
  track: { flex: 1, height: 7, borderRadius: 4, backgroundColor: Colors.border, overflow: 'hidden' },
  progress: { height: '100%', backgroundColor: Colors.teal, borderRadius: 4 },
  helper: { color: Colors.textLight, fontSize: 10 },
  calendarCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 14, gap: 12 },
  calendarHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  calendarTitle: { color: Colors.textDark, fontSize: 14, fontWeight: '700' },
  calendarMonth: { color: Colors.textSub, fontSize: 10, marginTop: 3 },
  calendarLegend: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  absentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.copper },
  legendText: { color: Colors.textSub, fontSize: 9 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  weekday: { width: '14.2857%', height: 28, textAlign: 'center', textAlignVertical: 'center', color: Colors.textLight, fontSize: 10, fontWeight: '700' },
  calendarEmpty: { width: '14.2857%', height: 38 },
  calendarDay: { width: '14.2857%', height: 38, alignItems: 'center', justifyContent: 'center' },
  calendarDayAbsent: { backgroundColor: Colors.copperLight, borderRadius: 19 },
  calendarDayText: { color: Colors.textDark, fontSize: 11, fontVariant: ['tabular-nums'] },
  calendarDayAbsentText: { color: Colors.copper, fontWeight: '800' },
  sectionTitle: { color: Colors.textDark, fontSize: 15, fontWeight: '700' },
  shareCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  shareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingVertical: 14 },
  shareInfo: { flex: 1, gap: 4 },
  shareName: { color: Colors.textDark, fontSize: 13, fontWeight: '700' },
  shareFormula: { color: Colors.textSub, fontSize: 10 },
  shareAmount: { color: Colors.teal, fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] },
  divider: { height: 1, backgroundColor: Colors.border },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.border, paddingVertical: 14 },
  totalLabel: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  totalAmount: { color: Colors.textDark, fontSize: 15, fontWeight: '800', fontVariant: ['tabular-nums'] },
  disclaimer: { color: Colors.textLight, fontSize: 10, lineHeight: 15 },
});
