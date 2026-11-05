import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Font } from '../theme';

type Props = {
  title?: string;
  subtitle?: string;
  onBell?: () => void;
  onProfilePress?: () => void;
  showTitleBadge?: boolean;
  showDatePill?: boolean;
};

export default function ScreenHeader({
  title = 'Splitify',
  subtitle,
  onBell,
  onProfilePress,
  showTitleBadge = true,
  showDatePill = true,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 0) + 1, marginTop: -2 }]}>
      <TouchableOpacity
        style={styles.left}
        onPress={onProfilePress}
        activeOpacity={onProfilePress ? 0.7 : 1}
        disabled={!onProfilePress}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View>
          {title ? (
            <View style={styles.titleRow}>
              <Text style={styles.title}>{title}</Text>
              {showTitleBadge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>PKR</Text>
                </View>
              ) : null}
            </View>
          ) : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </TouchableOpacity>
      <View style={styles.right}>
        {showDatePill ? (
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>Oct 01 – Oct 31</Text>
          </View>
        ) : null}
        {onBell ? (
          <TouchableOpacity style={styles.bell} onPress={onBell}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontFamily: Font.headerMed, fontSize: 15, fontWeight: '700', color: Colors.textDark },
  badge: {
    backgroundColor: Colors.tealLight,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: Colors.teal },
  subtitle: { fontSize: 11, color: Colors.textSub, marginTop: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  datePill: {
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  datePillText: { fontFamily: Font.body, fontSize: 10, color: Colors.textSub, fontWeight: '500', fontVariant: ['tabular-nums'] },
  bell: { padding: 4 },
  bellIcon: { fontSize: 18 },
});
