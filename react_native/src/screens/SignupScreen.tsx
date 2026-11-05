import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import RolePicker from '../components/RolePicker';
import PasswordInput from '../components/PasswordInput';
import { useRoleSession } from '../navigation/RoleSessionContext';
import type { AuthStackParamList, UserRole } from '../navigation/types';
import { authApi, getApiErrorMessage } from '../services/api';
import { Colors, Input } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const { authenticate } = useRoleSession();
  const [role, setRole] = useState<UserRole>('roommate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const createAccount = async () => {
    if (!name.trim() || !email.trim() || !password || !agree) {
      Alert.alert('Complete required fields', 'Enter your name, email, password, and accept the terms to continue.');
      return;
    }
    if (role === 'roommate' && !inviteCode.trim()) {
      Alert.alert('Group Invite Code required', 'Enter your room invite code to join as a Member.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        role,
        ...(role === 'roommate' ? { inviteCode: inviteCode.trim().toUpperCase() } : {}),
      };
      const session = await authApi.signup(payload);
      await authenticate(session.user, session.token);
    } catch (error) {
      Alert.alert('Unable to create account', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.brand}>Splitify</Text>
      <Text style={styles.title}>Create Account</Text>
      <RolePicker selectedRole={role} onSelectRole={setRole} testIDPrefix="signup-role" />
      <Text style={styles.label}>Full name</Text>
      <TextInput testID="signup-name" style={styles.input} value={name} onChangeText={setName} placeholder="Your full name" />
      <Text style={styles.label}>Email address</Text>
      <TextInput testID="signup-email" style={styles.input} value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" />
      <Text style={styles.label}>Phone number</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+92 3XX XXXXXXX" keyboardType="phone-pad" />
      <Text style={styles.label}>Password</Text>
      <PasswordInput testID="signup-password" value={password} onChangeText={setPassword} placeholder="Create a password" />
      {role === 'roommate' ? (
        <>
          <Text style={styles.label}>Group Invite Code</Text>
          <TextInput testID="signup-invite-code" style={styles.input} value={inviteCode} onChangeText={setInviteCode} placeholder="Enter group code (e.g. A1B2C3)" autoCapitalize="characters" />
        </>
      ) : null}
      <TouchableOpacity testID="signup-agree" accessibilityRole="checkbox" accessibilityState={{ checked: agree }} style={styles.terms} onPress={() => setAgree(current => !current)}>
        <Text style={styles.termsText}>{agree ? '☑' : '☐'}  I agree to the Terms of Service and Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="signup-submit" style={[styles.primary, loading && styles.disabled]} onPress={createAccount} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryText}>Create Account</Text>}
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
  label: { color: Colors.textDark, fontSize: 12, fontWeight: '600', marginTop: 4 },
  input: { height: Input.height, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, backgroundColor: Colors.card, color: Colors.textDark },
  terms: { paddingVertical: 8 },
  termsText: { color: Colors.textSub, fontSize: 11 },
  primary: { height: Input.height, borderRadius: 10, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#FFFFFF', fontWeight: '700' },
  disabled: { opacity: 0.65 },
  linkButton: { alignItems: 'center', padding: 8 },
  link: { color: Colors.teal, fontWeight: '700', fontSize: 12 },
});
