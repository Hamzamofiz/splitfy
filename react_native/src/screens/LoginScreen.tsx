import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import RolePicker from '../components/RolePicker';
import PasswordInput from '../components/PasswordInput';
import { useRoleSession } from '../navigation/RoleSessionContext';
import type { AuthStackParamList, UserRole } from '../navigation/types';
import { authApi, getApiErrorMessage } from '../services/api';
import { Colors, Input } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { authenticate } = useRoleSession();
  const [role, setRole] = useState<UserRole>('roommate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Credentials required', 'Enter your email address and password.');
      return;
    }
    setLoading(true);
    try {
      const session = await authApi.login(email.trim(), password);
      if (session.user.role !== role) {
        Alert.alert('Role mismatch', `This account is registered as ${session.user.role === 'admin' ? 'Group Admin' : 'Member'}. Select that role and try again.`);
        return;
      }
      await authenticate(session.user, session.token);
    } catch (error) {
      Alert.alert('Unable to log in', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.brand}>Splitify</Text>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to your shared living account</Text>
      <RolePicker selectedRole={role} onSelectRole={setRole} testIDPrefix="login-role" />
      <Text style={styles.label}>Email address</Text>
      <TextInput testID="login-email" style={styles.input} placeholder="name@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Text style={styles.label}>Password</Text>
      <PasswordInput testID="login-password" placeholder="Enter your password" value={password} onChangeText={setPassword} />
      <TouchableOpacity testID="login-submit" style={[styles.primary, loading && styles.disabled]} onPress={login} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryText}>Login</Text>}
      </TouchableOpacity>
      <TouchableOpacity testID="login-create-account-link" onPress={() => navigation.navigate('Signup')} style={styles.linkButton}>
        <Text style={styles.link}>New to Splitify? Create account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 22, gap: 12, backgroundColor: Colors.canvas },
  brand: { textAlign: 'center', color: Colors.teal, fontWeight: '900', fontSize: 30 },
  title: { textAlign: 'center', color: Colors.textDark, fontSize: 24, fontWeight: '800' },
  subtitle: { textAlign: 'center', color: Colors.textSub, fontSize: 13, marginBottom: 8 },
  label: { color: Colors.textDark, fontSize: 12, fontWeight: '600', marginTop: 4 },
  input: { height: Input.height, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, backgroundColor: Colors.card, color: Colors.textDark },
  primary: { height: Input.height, borderRadius: 10, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  primaryText: { color: '#FFFFFF', fontWeight: '700' },
  disabled: { opacity: 0.65 },
  linkButton: { alignItems: 'center', padding: 8 },
  link: { color: Colors.teal, fontWeight: '700', fontSize: 12 },
});
