import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { UserRole } from '../navigation/types';
import { Colors } from '../theme';

type Props = {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  testIDPrefix: string;
};

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Group Admin' },
  { value: 'roommate', label: 'Member' },
];

export default function RolePicker({ selectedRole, onSelectRole, testIDPrefix }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose your role</Text>
      <View style={styles.row}>
        {ROLES.map(({ value, label }) => {
          const selected = selectedRole === value;
          return (
            <TouchableOpacity
              key={value}
              testID={`${testIDPrefix}-${value}`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[styles.option, selected && styles.selected]}
              onPress={() => onSelectRole(value)}
            >
              <Text style={[styles.optionText, selected && styles.selectedText]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 7 },
  label: { color: Colors.textDark, fontSize: 12, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8 },
  option: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, backgroundColor: Colors.card },
  selected: { borderColor: Colors.teal, backgroundColor: Colors.tealLight },
  optionText: { color: Colors.textSub, fontSize: 12, fontWeight: '600' },
  selectedText: { color: Colors.teal },
});
