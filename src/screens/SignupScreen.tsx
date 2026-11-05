import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList, UserRole } from '../navigation/types';
import { useRoleSession } from '../navigation/RoleSessionContext';
import RolePicker from '../components/RolePicker';
import { Colors, Input } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const { previewRole } = useRoleSession();
  const [activeTab, setActiveTab] = useState<'signin' | 'create'>('create');
  const [selectedRole, setSelectedRole] = useState<UserRole>('roommate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [agree, setAgree] = useState(false);

  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };
  const strength = getStrength(password);

  const handleCreate = () => {
    if (!__DEV__) {
      Alert.alert('Sign up unavailable', 'Connect the authentication service before enabling account creation.');
      return;
    }
    previewRole(selectedRole);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.brand}>Splitify</Text>
      <Text style={styles.heading}>Create Account</Text>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'signin' && styles.tabActive]}
          onPress={() => {
            setActiveTab('signin');
            navigation.navigate('Login');
          }}>
          <Text style={[styles.tabText, activeTab === 'signin' && styles.tabTextActive]}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.tabActive]}
          onPress={() => setActiveTab('create')}>
          <Text style={[styles.tabText, activeTab === 'create' && styles.tabTextActive]}>Create Account</Text>
        </TouchableOpacity>
      </View>

      <RolePicker
        selectedRole={selectedRole}
        onSelectRole={setSelectedRole}
        testIDPrefix="signup-role"
      />
      <Text style={styles.roleHint}>
        {__DEV__
          ? 'Development preview only. Account creation requires a configured authentication service.'
          : 'Your account role is assigned and verified by the authentication service.'}
      </Text>

      <Text style={styles.fieldLabel}>Full Name</Text>
      <TextInput testID="signup-name" style={styles.input} placeholder="Enter your full name" placeholderTextColor="#94A3B8" value={name} onChangeText={setName} />

      <Text style={styles.fieldLabel}>Email Address</Text>
      <TextInput style={styles.input} placeholder="name@example.com" placeholderTextColor="#94A3B8" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

      <Text style={styles.fieldLabel}>Pakistani Mobile (+92)</Text>
      <TextInput style={styles.input} placeholder="+92 XXX XXXXXXX" placeholderTextColor="#94A3B8" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

      <Text style={styles.fieldLabel}>Secure Password</Text>
      <View style={styles.passRow}>
        <TextInput
          style={[styles.input, styles.passInput]}
          placeholder="Create a strong password"
          placeholderTextColor="#94A3B8"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.showBtn} onPress={() => setShowPass(!showPass)}>
          <Text style={styles.showBtnText}>{showPass ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.strengthRow}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={[styles.strengthBar, i <= strength && styles.strengthBarActive]} />
        ))}
      </View>
      <Text style={styles.strengthText}>{strength < 2 ? 'Weak' : strength < 4 ? 'Medium' : 'Strong'} password</Text>

      {selectedRole === 'roommate' ? (
        <>
          <Text style={styles.fieldLabel}>Unit Invite Code (Optional)</Text>
          <View style={styles.inviteRow}>
            <TextInput
              testID="signup-invite-code"
              style={[styles.input, styles.inviteInput]}
              placeholder="ENTER CODE (E.G., SH-402)"
              placeholderTextColor="#94A3B8"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.validateBtn}>
              <Text style={styles.validateBtnText}>Validate</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      <TouchableOpacity testID="signup-agree" style={styles.agreeRow} onPress={() => setAgree(!agree)} activeOpacity={0.7}>
        <View style={[styles.checkbox, agree && styles.checkboxActive]}>
          {agree ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
        <Text style={styles.agreeText}>
          I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="signup-submit"
        style={[styles.signupBtn, (!agree || !name) && styles.signupBtnDisabled]}
        onPress={handleCreate}
        disabled={!agree || !name}>
        <Text style={styles.signupBtnText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
        <Text style={styles.loginLinkText}>
          Already have an account? <Text style={styles.loginLinkAccent}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.canvas },
  container: { paddingHorizontal: 20, paddingVertical: 32, gap: 10 },
  brand: { fontSize: 24, fontWeight: '800', color: Colors.teal, textAlign: 'center', fontFamily: 'PlusJakartaSans-Bold' },
  heading: { fontSize: 22, fontWeight: '700', color: Colors.textDark, textAlign: 'center', marginBottom: 8 },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 4 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8 },
  tabActive: { backgroundColor: Colors.teal },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.textSub },
  tabTextActive: { color: '#FFFFFF' },
  roleHint: { color: Colors.textLight, fontSize: 10, lineHeight: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.textDark, marginTop: 4 },
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
  strengthRow: { flexDirection: 'row', gap: 6 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  strengthBarActive: { backgroundColor: Colors.teal },
  strengthText: { fontSize: 11, color: Colors.textSub },
  inviteRow: { flexDirection: 'row', alignItems: 'center' },
  inviteInput: { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0, textTransform: 'uppercase' },
  validateBtn: { height: Input.height, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: Colors.teal, borderTopRightRadius: 10, borderBottomRightRadius: 10 },
  validateBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 6 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkboxActive: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  checkmark: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  agreeText: { flex: 1, fontSize: 11, color: Colors.textSub, lineHeight: 16 },
  linkText: { color: Colors.teal, fontWeight: '600' },
  signupBtn: { height: Input.height, backgroundColor: Colors.teal, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  signupBtnDisabled: { opacity: 0.4 },
  signupBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  loginLink: { alignItems: 'center', marginTop: 4 },
  loginLinkText: { color: Colors.textSub, fontSize: 13 },
  loginLinkAccent: { color: Colors.teal, fontWeight: '700' },
});
