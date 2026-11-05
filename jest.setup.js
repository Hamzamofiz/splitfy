/* eslint-env jest */
jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
  types: { images: 'image/*', pdf: 'application/pdf', video: 'video/*' },
  errorCodes: { OPERATION_CANCELED: 'OPERATION_CANCELED' },
  isErrorWithCode: (error) =>
    typeof error === 'object' && error !== null && 'code' in error,
}));
