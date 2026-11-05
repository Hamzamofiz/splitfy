import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';

import SignupScreen from '../src/screens/SignupScreen';
import LoginScreen from '../src/screens/LoginScreen';
import AttendanceProrationScreen from '../src/screens/roommate/AttendanceProrationScreen';
import { RoleSessionProvider } from '../src/navigation/RoleSessionContext';

function getText(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(getText).join('');
  if (React.isValidElement(value)) return getText((value.props as { children?: unknown }).children);
  return '';
}

describe('reconstructed role flows', () => {
  it('opens the Create Account form from the Login link', async () => {
    const navigate = jest.fn();
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <RoleSessionProvider>
          <LoginScreen
            navigation={{ navigate } as never}
            route={{ key: 'Login', name: 'Login' } as never}
          />
        </RoleSessionProvider>,
      );
    });

    await ReactTestRenderer.act(() => {
      renderer.root.findByProps({ testID: 'login-create-account-link' }).props.onPress();
    });

    expect(navigate).toHaveBeenCalledWith('Signup');
  });

  it.each([
    ['Login', LoginScreen, 'login-password'],
    ['Signup', SignupScreen, 'signup-password'],
  ] as const)('%s password visibility can be toggled', async (_screenName, Screen, passwordTestID) => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <RoleSessionProvider>
          <Screen
            navigation={{ navigate: jest.fn() } as never}
            route={{ key: passwordTestID, name: _screenName } as never}
          />
        </RoleSessionProvider>,
      );
    });

    const visibilityToggle = () => renderer.root.findByProps({ testID: `${passwordTestID}-visibility-toggle` });
    expect(visibilityToggle().props.accessibilityLabel).toBe('Show password');

    await ReactTestRenderer.act(() => visibilityToggle().props.onPress());
    expect(visibilityToggle().props.accessibilityLabel).toBe('Hide password');

    await ReactTestRenderer.act(() => visibilityToggle().props.onPress());
    expect(visibilityToggle().props.accessibilityLabel).toBe('Show password');
  });

  it('shows the invite field for Members and hides it for Group Admins', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <RoleSessionProvider>
          <SignupScreen
            navigation={{ navigate: jest.fn() } as never}
            route={{ key: 'Signup', name: 'Signup' } as never}
          />
        </RoleSessionProvider>,
      );
    });

    expect(renderer.root.findByProps({ testID: 'signup-invite-code' })).toBeTruthy();
    expect(renderer.root.findAllByType(Text).some(node => node.props.children === 'Group Invite Code')).toBe(true);
    expect(renderer.root.findAllByType(Text).some(node => node.props.children === 'Create Account')).toBe(true);

    await ReactTestRenderer.act(() => {
      renderer.root.findByProps({ testID: 'signup-role-admin' }).props.onPress();
    });
    expect(renderer.root.findAllByProps({ testID: 'signup-invite-code' })).toHaveLength(0);
    expect(renderer.root.findAllByType(Text).some(node => node.props.children === 'Group Invite Code')).toBe(false);

    await ReactTestRenderer.act(() => {
      renderer.root.findByProps({ testID: 'signup-role-roommate' }).props.onPress();
    });
    expect(renderer.root.findByProps({ testID: 'signup-invite-code' })).toBeTruthy();
  });

  it('updates attendance and proration when a calendar date is toggled', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<AttendanceProrationScreen />);
    });

    await ReactTestRenderer.act(() => {
      renderer.root.findByProps({ testID: 'attendance-date-1' }).props.onPress();
    });

    expect(renderer.root.findByProps({ testID: 'attendance-date-1' }).props.accessibilityState.selected).toBe(true);
    const visibleText = renderer.root.findAllByType(Text).map(node => getText(node.props.children)).join(' ');
    expect(visibleText).toContain('PKR 1,015');
    expect(visibleText).toContain('PKR 3,383');
    expect(visibleText).toContain('PKR 4,398');
  });
});
