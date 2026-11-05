/* eslint-env jest */
jest.mock('react-native-screens', () => {
  const { View } = require('react-native');
  return {
    compatibilityFlags: {},
    enableScreens: jest.fn(),
    Screen: View,
    ScreenContainer: View,
    ScreenStack: View,
    ScreenStackItem: View,
    ScreenFooter: View,
    ScreenStackHeaderConfig: View,
    ScreenStackHeaderBackButtonImage: View,
    ScreenStackHeaderCenterView: View,
    ScreenStackHeaderLeftView: View,
    ScreenStackHeaderRightView: View,
    ScreenStackHeaderSearchBarView: View,
    SearchBar: View,
    isSearchBarAvailableForCurrentPlatform: () => false,
  };
});
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
  types: { images: 'image/*', pdf: 'application/pdf', video: 'video/*' },
  errorCodes: { OPERATION_CANCELED: 'OPERATION_CANCELED' },
  isErrorWithCode: error => typeof error === 'object' && error !== null && 'code' in error,
}));
