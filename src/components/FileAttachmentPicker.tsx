import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
  type DocumentPickerResponse,
} from '@react-native-documents/picker';

import { Colors } from '../theme';

type Props = {
  attachment: DocumentPickerResponse | null;
  onAttachmentChange: (attachment: DocumentPickerResponse | null) => void;
  kind: 'payment-proof' | 'photo' | 'media';
  buttonTestID: string;
};

export default function FileAttachmentPicker({
  attachment,
  onAttachmentChange,
  kind,
  buttonTestID,
}: Props) {
  const [isPicking, setIsPicking] = useState(false);
  const isPhoto = kind === 'photo';
  const isMedia = kind === 'media';

  const selectAttachment = async () => {
    if (isPicking) {
      return;
    }

    setIsPicking(true);
    try {
      const [file] = await pick({
        type: isPhoto ? types.images : isMedia ? [types.images, types.video] : [types.images, types.pdf],
      });
      if (!file.hasRequestedType) {
        Alert.alert(
          'Unsupported file type',
          isPhoto
            ? 'Select an image file.'
            : isMedia
              ? 'Select an image or video file.'
              : 'Select an image or PDF file.',
        );
        return;
      }
      onAttachmentChange(file);
    } catch (error) {
      if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
        return;
      }

      const message = error instanceof Error ? error.message : 'Please try selecting the file again.';
      Alert.alert('Unable to attach file', message);
    } finally {
      setIsPicking(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID={buttonTestID}
        accessibilityRole="button"
        accessibilityLabel={attachment ? `Selected file ${attachment.name ?? 'attachment'}` : undefined}
        disabled={isPicking}
        style={[styles.button, isPicking && styles.disabled]}
        onPress={selectAttachment}
      >
        <Text style={styles.buttonText}>
          {isPicking
            ? 'Opening files...'
            : attachment
              ? 'Replace attachment'
              : isPhoto
                ? 'Add a photo (optional)'
                : isMedia
                  ? 'Attach photo or video proof'
                : 'Attach receipt or confirmation'}
        </Text>
      </TouchableOpacity>
      {attachment ? (
        <View style={styles.fileRow}>
          <Text numberOfLines={1} style={styles.fileName}>
            {attachment.name ?? 'Selected file'}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Remove attachment"
            onPress={() => onAttachmentChange(null)}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 7 },
  button: {
    minHeight: 44,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.teal,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  disabled: { opacity: 0.6 },
  buttonText: { color: Colors.teal, fontSize: 11, fontWeight: '600' },
  fileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  fileName: { flex: 1, color: Colors.textSub, fontSize: 10 },
  removeText: { color: Colors.danger, fontSize: 10, fontWeight: '600' },
});
