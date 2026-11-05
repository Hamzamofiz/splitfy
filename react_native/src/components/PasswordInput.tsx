import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Colors, Input } from '../theme';

type Props = {
  testID: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
};

export default function PasswordInput({ testID, placeholder, value, onChangeText }: Props) {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <View style={styles.container}>
      <TextInput
        testID={testID}
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
      <TouchableOpacity
        testID={`${testID}-visibility-toggle`}
        accessibilityRole="button"
        accessibilityLabel={secureTextEntry ? 'Show password' : 'Hide password'}
        onPress={() => setSecureTextEntry(current => !current)}
        style={styles.toggle}
      >
        <Text style={styles.toggleText}>{secureTextEntry ? 'Show' : 'Hide'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Input.height,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.card,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    color: Colors.textDark,
  },
  toggle: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  toggleText: {
    color: Colors.teal,
    fontSize: 12,
    fontWeight: '700',
  },
});
