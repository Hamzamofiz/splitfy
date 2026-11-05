import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../theme';

type Props = {
  title: string;
  subtitle: string;
};

export default function RoommatePageHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>SPLITIFY · ROOM 402</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 4, marginBottom: 4 },
  eyebrow: { color: Colors.teal, fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  title: { color: Colors.textDark, fontSize: 22, fontWeight: '800' },
  subtitle: { color: Colors.textSub, fontSize: 12, lineHeight: 17 },
});
