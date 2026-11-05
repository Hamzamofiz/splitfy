import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { errorCodes, isErrorWithCode, pick, types, type DocumentPickerResponse } from '@react-native-documents/picker';

import { Colors } from '../theme';

export default function FilePickerButton({
  onPicked,
  kind = 'proof',
  testID,
}: {
  onPicked: (file: DocumentPickerResponse) => void;
  kind?: 'proof' | 'photo' | 'media';
  testID: string;
}) {
  const [busy, setBusy] = useState(false);

  const selectFile = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const allowedTypes = kind === 'photo'
        ? types.images
        : kind === 'media'
          ? [types.images, types.video]
          : [types.images, types.pdf];
      const [file] = await pick({ type: allowedTypes });
      if (!file.hasRequestedType) {
        Alert.alert('Unsupported file', 'Choose a supported image, video, or PDF file.');
        return;
      }
      onPicked(file);
    } catch (error) {
      if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) return;
      Alert.alert('Unable to open files', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <TouchableOpacity testID={testID} accessibilityRole="button" style={styles.button} onPress={selectFile} disabled={busy}>
        <Text style={styles.text}>{busy ? 'Opening files…' : kind === 'photo' ? 'Add a photo (optional)' : kind === 'media' ? 'Attach photo or video' : 'Attach receipt or screenshot'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  button: { minHeight: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.teal, borderRadius: 10, paddingHorizontal: 10 },
  text: { color: Colors.teal, fontSize: 11, fontWeight: '700' },
});
