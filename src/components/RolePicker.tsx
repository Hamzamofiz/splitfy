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
      <View style={styles.options}>
        {ROLES.map(role => {
          const selected = selectedRole === role.value;
          return (
            <TouchableOpacity
              key={role.value}
              testID={`${testIDPrefix}-${role.value}`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onSelectRole(role.value)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {role.label}
              </Text>
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
  options: { flexDirection: 'row', gap: 8 },
  option: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 9,
    backgroundColor: Colors.card,
  },
  optionSelected: { borderColor: Colors.teal, backgroundColor: Colors.tealLight },
  optionText: { color: Colors.textSub, fontSize: 10, fontWeight: '600', textAlign: 'center' },
  optionTextSelected: { color: Colors.teal },
});
