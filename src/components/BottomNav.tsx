import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme';

type Tab = 'Ledger' | 'Bills' | 'Roommates' | 'Settings';

type Props = {
  active: Tab;
  onPress: (tab: Tab) => void;
};

const TABS: { key: Tab; icon: string }[] = [
  { key: 'Ledger', icon: '📒' },
  { key: 'Bills', icon: '🧾' },
  { key: 'Roommates', icon: '👥' },
  { key: 'Settings', icon: '⚙️' },
];

export default function BottomNav({ active, onPress }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onPress(tab.key)}
          activeOpacity={0.7}>
          <Text style={styles.icon}>{tab.icon}</Text>
          <Text style={[styles.label, active === tab.key && styles.labelActive]}>
            {tab.key}
          </Text>
          {active === tab.key && <View style={styles.dot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  icon: { fontSize: 20 },
  label: { fontSize: 10, color: Colors.textSub, fontWeight: '500', fontVariant: ['tabular-nums'] as any },
  labelActive: { color: Colors.teal, fontWeight: '700' },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.teal,
    marginTop: 2,
  },
});
