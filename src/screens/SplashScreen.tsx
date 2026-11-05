import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { Colors } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Login'), 2000);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Splitify</Text>
      <Text style={styles.tagline}>Split smarter. Live better.</Text>
      <ActivityIndicator style={styles.spinner} size="large" color={Colors.teal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logo: { fontSize: 40, fontWeight: '700', color: Colors.teal, letterSpacing: 1 },
  tagline: { fontSize: 15, color: Colors.textMuted },
  spinner: { marginTop: 32 },
});
