import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Input, Card, Font } from '../../theme';

const PAYMENT_METHODS = ['Raast', 'Easypaisa', 'IBAN'];

export default function PaymentSetupScreen() {
  const [method, setMethod] = useState('Raast');
  const [raast, setRaast] = useState('');
  const [easypaisa, setEasypaisa] = useState('');
  const [iban, setIban] = useState('');
  const [roomKey] = useState('SPL-2024-GR3-7X9K');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Payment Method Tabs */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Admin Payment Details</Text>
          <Text style={styles.cardSub}>Members will use these details to send their share</Text>

          <View style={styles.methodTabs}>
            {PAYMENT_METHODS.map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.methodTab, method === m && styles.methodTabActive]}
                onPress={() => setMethod(m)}>
                <Text style={[styles.methodTabText, method === m && styles.methodTabTextActive]}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {method === 'Raast' && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Raast ID / Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="03XX-XXXXXXX"
                placeholderTextColor={Colors.textLight}
                keyboardType="phone-pad"
                value={raast}
                onChangeText={setRaast}
              />
              <Text style={styles.fieldHint}>Linked to your JazzCash / HBL account</Text>
            </View>
          )}

          {method === 'Easypaisa' && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Easypaisa Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="03XX-XXXXXXX"
                placeholderTextColor={Colors.textLight}
                keyboardType="phone-pad"
                value={easypaisa}
                onChangeText={setEasypaisa}
              />
              <Text style={styles.fieldHint}>Telenor Easypaisa wallet number</Text>
            </View>
          )}

          {method === 'IBAN' && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>IBAN Number</Text>
              <TextInput
                style={styles.input}
                placeholder="PK36SCBL0000001123456702"
                placeholderTextColor={Colors.textLight}
                autoCapitalize="characters"
                value={iban}
                onChangeText={setIban}
              />
              <Text style={styles.fieldHint}>24-character Pakistani IBAN</Text>
            </View>
          )}

          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save Payment Details</Text>
          </TouchableOpacity>
        </View>

        {/* Room Key */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Group Room Key</Text>
          <Text style={styles.cardSub}>Share this key with roommates to join your group</Text>

          <View style={styles.keyBox}>
            <Text style={styles.keyValue}>{roomKey}</Text>
            <TouchableOpacity style={styles.copyBtn}>
              <Text style={styles.copyBtnText}>Copy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.qrContainer}>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrIcon}>⬛</Text>
              <Text style={styles.qrLabel}>QR Code</Text>
              <Text style={styles.qrSub}>{roomKey}</Text>
            </View>
          </View>

          <View style={styles.keyActions}>
            <TouchableOpacity style={styles.keyActionBtn}>
              <Text style={styles.keyActionIcon}>🔄</Text>
              <Text style={styles.keyActionText}>Regenerate Key</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.keyActionBtn}>
              <Text style={styles.keyActionIcon}>📤</Text>
              <Text style={styles.keyActionText}>Share Key</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, styles.infoCard]}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoBody}>
              Roommates enter the Room Key in their app to join your group. Once joined, they can view bills and send payments directly to your registered account.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.canvas },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  card: {
    backgroundColor: Card.backgroundColor,
    borderWidth: Card.borderWidth,
    borderColor: Card.borderColor,
    borderRadius: Card.borderRadius,
    padding: Card.padding,
    gap: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textDark },
  cardSub: { fontSize: 12, color: Colors.textSub, marginTop: -6 },
  methodTabs: { flexDirection: 'row', gap: 8 },
  methodTab: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.canvas,
  },
  methodTabActive: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  methodTabText: { fontSize: 13, fontWeight: '600', color: Colors.textSub },
  methodTabTextActive: { color: '#fff' },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSub },
  fieldHint: { fontSize: 11, color: Colors.textLight },
  input: {
    height: Input.height,
    borderWidth: Input.borderWidth,
    borderColor: Colors.border,
    borderRadius: Input.borderRadius,
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.textDark,
    backgroundColor: Colors.canvas,
  },
  saveBtn: {
    height: Input.height,
    backgroundColor: Colors.teal,
    borderRadius: Input.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  keyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  keyValue: { fontFamily: Font.bodyBold, fontSize: 16, fontWeight: '700', color: Colors.teal, letterSpacing: 1.5, fontVariant: ['tabular-nums'] },
  copyBtn: { backgroundColor: Colors.tealLight, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 },
  copyBtnText: { fontSize: 12, color: Colors.teal, fontWeight: '700' },
  qrContainer: { alignItems: 'center', paddingVertical: 8 },
  qrPlaceholder: {
    width: 160,
    height: 160,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.canvas,
    gap: 6,
  },
  qrIcon: { fontSize: 48 },
  qrLabel: { fontSize: 13, fontWeight: '700', color: Colors.textDark },
  qrSub: { fontSize: 10, color: Colors.textSub },
  keyActions: { flexDirection: 'row', gap: 10 },
  keyActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.canvas,
  },
  keyActionIcon: { fontSize: 16 },
  keyActionText: { fontSize: 13, fontWeight: '600', color: Colors.textDark },
  infoCard: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  infoIcon: { fontSize: 20, marginTop: 2 },
  infoText: { flex: 1, gap: 4 },
  infoTitle: { fontSize: 13, fontWeight: '700', color: Colors.textDark },
  infoBody: { fontSize: 12, color: Colors.textSub, lineHeight: 18 },
});
