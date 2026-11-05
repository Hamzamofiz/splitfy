import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Font } from '../theme';

type Props = {
  label: string;
  value: string;
  pill: string;
  progress: number; // 0–1
  tint: string;
  pillColor: string;
  badge?: string;
  badgeColor?: string;
};

export default function MetricCard({
  label,
  value,
  pill,
  progress,
  tint,
  pillColor,
  badge,
  badgeColor,
}: Props) {
  return (
    <View style={[styles.card, { backgroundColor: tint }]}>
      <View style={styles.top}>
        <View style={[styles.pill, { backgroundColor: pillColor + '22' }]}>
          <Text style={[styles.pillText, { color: pillColor }]}>{pill}</Text>
        </View>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: (badgeColor ?? pillColor) + '22' }]}>
            <Text style={[styles.badgeText, { color: badgeColor ?? pillColor }]}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(progress, 1) * 100}%` as any, backgroundColor: pillColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 6,
    minHeight: 120,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pill: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: '700' },
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontFamily: Font.body, fontSize: 9, fontWeight: '600', fontVariant: ['tabular-nums'] },
  value: {
    fontFamily: Font.bodyBold,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textDark,
    fontVariant: ['tabular-nums'],
  },
  label: { fontSize: 11, color: Colors.textSub },
  track: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  fill: { height: 4, borderRadius: 2 },
});
