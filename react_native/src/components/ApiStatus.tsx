import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../theme';

export default function ApiStatus({ loading, error, onRetry }: { loading: boolean; error: string | null; onRetry: () => void }) {
  if (!loading && !error) return null;

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator color={Colors.teal} /> : null}
      {error ? <Text style={styles.message}>{error}</Text> : null}
      {error ? <TouchableOpacity onPress={onRetry}><Text style={styles.retry}>Try again</Text></TouchableOpacity> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 7, padding: 12, borderRadius: 12, backgroundColor: Colors.card },
  message: { color: Colors.danger, textAlign: 'center', fontSize: 11 },
  retry: { color: Colors.teal, fontSize: 11, fontWeight: '700' },
});
