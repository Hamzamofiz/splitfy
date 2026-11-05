import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import RolePicker from '../components/RolePicker';
import PasswordInput from '../components/PasswordInput';
import { useRoleSession } from '../navigation/RoleSessionContext';
import type { AuthStackParamList, UserRole } from '../navigation/types';
import { Colors, Input } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const { previewRole } = useRoleSession();
  const [role, setRole] = useState<UserRole>('roommate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [agree, setAgree] = useState(false);

  const createAccount = () => {
    if (!name.trim() || !agree) {
      Alert.alert('Complete required fields', 'Enter your name and accept the terms to continue.');
      return;
    }
    if (role === 'roommate' && !inviteCode.trim()) {
      Alert.alert('Group Invite Code required', 'Enter your room invite code to join as a Member.');
      return;
    }
    if (!__DEV__) {
      Alert.alert('Sign up unavailable', 'A verified authentication service is required.');
      return;
    }
    previewRole(role);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.brand}>Splitify</Text>
      <Text style={styles.title}>Create Account</Text>
      <RolePicker selectedRole={role} onSelectRole={setRole} testIDPrefix="signup-role" />
      <Text style={styles.notice}>Development preview only. Account creation requires authentication setup.</Text>
      <Text style={styles.label}>Full name</Text>
      <TextInput testID="signup-name" style={styles.input} value={name} onChangeText={setName} placeholder="Your full name" />
      <Text style={styles.label}>Email address</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" />
      <Text style={styles.label}>Phone number</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+92 3XX XXXXXXX" keyboardType="phone-pad" />
      <Text style={styles.label}>Password</Text>
      <PasswordInput testID="signup-password" value={password} onChangeText={setPassword} placeholder="Create a password" />
      {role === 'roommate' ? (
        <>
          <Text style={styles.label}>Group Invite Code</Text>
          <TextInput testID="signup-invite-code" style={styles.input} value={inviteCode} onChangeText={setInviteCode} placeholder="Enter group code (e.g. SH-402)" autoCapitalize="characters" />
        </>
      ) : null}
      <TouchableOpacity testID="signup-agree" accessibilityRole="checkbox" accessibilityState={{ checked: agree }} style={styles.terms} onPress={() => setAgree(current => !current)}>
        <Text style={styles.termsText}>{agree ? '☑' : '☐'}  I agree to the Terms of Service and Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="signup-submit" style={styles.primary} onPress={createAccount}>
        <Text style={styles.primaryText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 22, paddingVertical: 36, gap: 10, backgroundColor: Colors.canvas },
  brand: { textAlign: 'center', color: Colors.teal, fontWeight: '900', fontSize: 28 },
  title: { textAlign: 'center', color: Colors.textDark, fontSize: 22, fontWeight: '800', marginBottom: 6 },
  notice: { color: Colors.textLight, fontSize: 10, lineHeight: 15 },
  label: { color: Colors.textDark, fontSize: 12, fontWeight: '600', marginTop: 4 },
  input: { height: Input.height, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, backgroundColor: Colors.card, color: Colors.textDark },
  terms: { paddingVertical: 8 },
  termsText: { color: Colors.textSub, fontSize: 11 },
  primary: { height: Input.height, borderRadius: 10, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#FFFFFF', fontWeight: '700' },
  linkButton: { alignItems: 'center', padding: 8 },
  link: { color: Colors.teal, fontWeight: '700', fontSize: 12 },
});
