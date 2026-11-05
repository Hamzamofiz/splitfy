import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';

import SignupScreen from '../src/screens/SignupScreen';
import LoginScreen from '../src/screens/LoginScreen';
import AttendanceProrationScreen from '../src/screens/roommate/AttendanceProrationScreen';
import { RoleSessionProvider, useRoleSession } from '../src/navigation/RoleSessionContext';
import { authApi } from '../src/services/api';

jest.mock('../src/services/useRoomData', () => () => ({
  room: { _id: 'test-room', members: [] },
  loading: false,
  error: null,
  reload: jest.fn(),
}));
jest.mock('../src/services/api', () => ({
  authApi: {
    login: jest.fn().mockResolvedValue({
      user: {
        _id: 'member-id',
        name: 'Test Member',
        email: 'member@example.com',
        role: 'roommate',
      },
      token: 'test-token',
    }),
    signup: jest.fn().mockResolvedValue({
      user: {
        _id: 'new-member-id',
        name: 'New Member',
        email: 'new@example.com',
        role: 'roommate',
      },
      token: 'signup-token',
    }),
    updateProfile: jest.fn(),
  },
  setAuthToken: jest.fn(),
  attendanceApi: {
    get: jest.fn().mockResolvedValue(null),
    save: jest.fn((_roomId: string, _month: string, absentDays: number[]) => Promise.resolve({ absentDays })),
  },
  getApiErrorMessage: jest.fn(() => 'request failed'),
}));

function SessionProbe() {
  const { role, user } = useRoleSession();
  return <Text testID="session-probe">{role ?? 'signed-out'}:{user?.name ?? 'no-user'}</Text>;
}

function getText(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(getText).join('');
  if (React.isValidElement(value)) return getText((value.props as { children?: unknown }).children);
  return '';
}

describe('reconstructed role flows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('authenticates with the backend and stores the returned member session', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <RoleSessionProvider>
          <LoginScreen
            navigation={{ navigate: jest.fn() } as never}
            route={{ key: 'Login', name: 'Login' } as never}
          />
          <SessionProbe />
        </RoleSessionProvider>,
      );
    });

    await ReactTestRenderer.act(() => {
      renderer.root.findByProps({ testID: 'login-email' }).props.onChangeText('member@example.com');
      renderer.root.findByProps({ testID: 'login-password' }).props.onChangeText('password123');
    });

    await ReactTestRenderer.act(async () => {
      await renderer.root.findByProps({ testID: 'login-submit' }).props.onPress();
    });

    expect(authApi.login).toHaveBeenCalledWith('member@example.com', 'password123');
    expect(getText(renderer.root.findByProps({ testID: 'session-probe' }).props.children)).toBe('roommate:Test Member');
  });

  it('sends an invite code only with the Member signup payload', async () => {
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

    await ReactTestRenderer.act(() => {
      renderer.root.findByProps({ testID: 'signup-name' }).props.onChangeText('New Member');
      renderer.root.findByProps({ testID: 'signup-email' }).props.onChangeText('new@example.com');
      renderer.root.findByProps({ testID: 'signup-password' }).props.onChangeText('password123');
      renderer.root.findByProps({ testID: 'signup-invite-code' }).props.onChangeText('a1b2c3');
      renderer.root.findByProps({ testID: 'signup-agree' }).props.onPress();
    });

    await ReactTestRenderer.act(async () => {
      await renderer.root.findByProps({ testID: 'signup-submit' }).props.onPress();
    });

    expect(authApi.signup).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Member',
      email: 'new@example.com',
      role: 'roommate',
      inviteCode: 'A1B2C3',
    }));
  });

  it('omits the invite code from Admin signup requests', async () => {
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

    await ReactTestRenderer.act(() => {
      renderer.root.findByProps({ testID: 'signup-role-admin' }).props.onPress();
      renderer.root.findByProps({ testID: 'signup-name' }).props.onChangeText('Group Admin');
      renderer.root.findByProps({ testID: 'signup-email' }).props.onChangeText('admin@example.com');
      renderer.root.findByProps({ testID: 'signup-password' }).props.onChangeText('password123');
      renderer.root.findByProps({ testID: 'signup-agree' }).props.onPress();
    });

    await ReactTestRenderer.act(async () => {
      await renderer.root.findByProps({ testID: 'signup-submit' }).props.onPress();
    });

    expect(authApi.signup).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Group Admin',
      email: 'admin@example.com',
      role: 'admin',
    }));
    const [payload] = (authApi.signup as jest.Mock).mock.calls[0] as [{ inviteCode?: string }];
    expect(payload).not.toHaveProperty('inviteCode');
  });

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
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<AttendanceProrationScreen />);
      await Promise.resolve();
    });

    await ReactTestRenderer.act(async () => {
      renderer.root.findByProps({ testID: 'attendance-date-1' }).props.onPress();
      await Promise.resolve();
    });

    expect(renderer.root.findByProps({ testID: 'attendance-date-1' }).props.accessibilityState.selected).toBe(true);
    const visibleText = renderer.root.findAllByType(Text).map(node => getText(node.props.children)).join(' ');
    expect(visibleText).toContain('PKR 1,015');
    expect(visibleText).toContain('PKR 3,383');
    expect(visibleText).toContain('PKR 4,398');
  });
});
