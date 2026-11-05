import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList, UserRole } from '../navigation/types';
import { useRoleSession } from '../navigation/RoleSessionContext';
import RolePicker from '../components/RolePicker';
import { Colors, Input } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { previewRole } = useRoleSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('roommate');

  const handleLogin = () => {
    if (!__DEV__) {
      Alert.alert('Login unavailable', 'Connect the authentication service before enabling login.');
      return;
    }
    previewRole(selectedRole);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>Splitify</Text>
        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to your shared living account</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.tabText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <RolePicker
          selectedRole={selectedRole}
          onSelectRole={setSelectedRole}
          testIDPrefix="role-preview"
        />
        <Text style={styles.roleHint}>
          {__DEV__
            ? 'Development preview only. This selection does not authenticate an account.'
            : 'Your signed-in role is verified by the authentication service.'}
        </Text>

        <Text style={styles.fieldLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="name@example.com"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.fieldLabel}>Password</Text>
        <View style={styles.passRow}>
          <TextInput
            style={[styles.input, styles.passInput]}
            placeholder="Enter your password"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.showBtn} onPress={() => setShowPass(!showPass)}>
            <Text style={styles.showBtnText}>{showPass ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity testID="login-submit" style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity testID="open-signup" onPress={() => navigation.navigate('Signup')} style={styles.signupLink}>
          <Text style={styles.signupLinkText}>
            Don't have an account? <Text style={styles.signupLinkAccent}>Create Account</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 10,
  },
  brand: { fontSize: 28, fontWeight: '800', color: Colors.teal, textAlign: 'center', fontFamily: 'PlusJakartaSans-Bold' },
  heading: { fontSize: 24, fontWeight: '700', color: Colors.textDark, textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 13, color: Colors.textSub, textAlign: 'center', marginBottom: 12 },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 4 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8 },
  tabActive: { backgroundColor: Colors.teal },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.textSub },
  tabTextActive: { color: '#FFFFFF' },
  roleHint: { color: Colors.textLight, fontSize: 10, lineHeight: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.textDark, marginTop: 6 },
  input: {
    height: Input.height,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    color: Colors.textDark,
    backgroundColor: Colors.card,
    fontSize: 14,
    fontVariant: ['tabular-nums'] as any,
  },
  passRow: { flexDirection: 'row', alignItems: 'center' },
  passInput: { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 },
  showBtn: { height: Input.height, paddingHorizontal: 14, justifyContent: 'center', backgroundColor: Colors.card, borderWidth: 1, borderLeftWidth: 0, borderColor: Colors.border, borderTopRightRadius: 10, borderBottomRightRadius: 10 },
  showBtnText: { color: Colors.teal, fontWeight: '600', fontSize: 12 },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { color: Colors.teal, fontSize: 12, fontWeight: '600' },
  loginBtn: {
    height: Input.height,
    backgroundColor: Colors.teal,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  signupLink: { alignItems: 'center', marginTop: 6 },
  signupLinkText: { color: Colors.textSub, fontSize: 13 },
  signupLinkAccent: { color: Colors.teal, fontWeight: '700' },
});
