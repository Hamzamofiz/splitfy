import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ReactTestRenderer from 'react-test-renderer';
import { pick } from '@react-native-documents/picker';

import { RoleSessionProvider } from '../src/navigation/RoleSessionContext';
import RoommateNavigator from '../src/navigation/RoommateNavigator';
import AttendanceProrationScreen from '../src/screens/roommate/AttendanceProrationScreen';
import BillsExpensesScreen from '../src/screens/roommate/BillsExpensesScreen';
import ReportMaintenanceScreen from '../src/screens/roommate/ReportMaintenanceScreen';
import PaymentHubScreen from '../src/screens/roommate/PaymentHubScreen';
import RoommateDashboardScreen from '../src/screens/roommate/RoommateDashboardScreen';
import AdminDashboardScreen from '../src/screens/admin/AdminDashboardScreen';
import SignupScreen from '../src/screens/SignupScreen';
import RootNavigator from '../src/navigation/RootNavigator';

function getVisibleText(renderer: ReactTestRenderer.ReactTestRenderer) {
  return renderer.root
    .findAllByType(Text)
    .map(node => {
      const children = node.props.children;
      if (Array.isArray(children)) {
        return children
          .map(child => (typeof child === 'string' || typeof child === 'number' ? String(child) : ''))
          .join('');
      }
      return typeof children === 'string' || typeof children === 'number' ? String(children) : '';
    })
    .join('\n');
}

test('exposes only the five roommate mobile tabs', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <RoleSessionProvider value={{ role: 'roommate', previewRole: () => {}, signOut: () => {} }}>
        <NavigationContainer>
          <RoommateNavigator />
        </NavigationContainer>
      </RoleSessionProvider>,
    );
  });

  try {
    const tabLabels = [
      ...new Set(
        renderer!.root
          .findAll(node => typeof node.props.accessibilityLabel === 'string')
          .map(node => node.props.accessibilityLabel)
          .filter((label: string) => label.endsWith('tab')),
      ),
    ];

    expect(tabLabels).toEqual([
      'Home tab',
      'Bills and expenses tab',
      'Attendance and proration tab',
      'Maintenance tab',
      'Settlement and payment tab',
    ]);
  } finally {
    await ReactTestRenderer.act(() => {
      renderer!.unmount();
    });
  }
});

test('attendance changes recalculate utility and meal shares', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<AttendanceProrationScreen />);
  });

  const increaseDays = renderer!.root.findByProps({ accessibilityLabel: 'Decrease days present' });
  await ReactTestRenderer.act(() => {
    increaseDays.props.onPress();
  });

  const renderedTree = JSON.stringify(renderer!.toJSON());
  expect(renderedTree).toContain('29');
  expect(renderedTree).toContain('1,015');
  expect(renderedTree).toContain('3,383');
});

test('bills form selects a receipt and submits a cash payment proof', async () => {
  const file = {
    uri: 'file://receipt.pdf',
    name: 'receipt.pdf',
    error: null,
    type: 'application/pdf',
    nativeType: 'application/pdf',
    size: 100,
    isVirtual: false,
    convertibleToMimeTypes: null,
    hasRequestedType: true,
  };
  jest.mocked(pick).mockResolvedValue([file]);

  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<BillsExpensesScreen />);
  });

  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'expense-category-dropdown' }).props.onPress();
  });
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'expense-category-food' }).props.onPress();
  });
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'payment-method-cash' }).props.onPress();
    renderer!.root.findByProps({ testID: 'expense-title' }).props.onChangeText('October power bill');
    renderer!.root.findByProps({ testID: 'payment-amount' }).props.onChangeText('500');
  });
  await ReactTestRenderer.act(async () => {
    await renderer!.root.findByProps({ testID: 'payment-proof-picker' }).props.onPress();
  });
  expect(renderer!.root.findByProps({ accessibilityLabel: 'Selected file receipt.pdf' })).toBeDefined();

  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'payment-submit' }).props.onPress();
  });
  const renderedText = getVisibleText(renderer!);
  expect(renderedText).toContain('Cash payment of PKR 500 submitted');
  expect(renderedText).toContain('Across 3 active bills');
  expect(renderedText).toContain('October power bill');
  expect(renderedText).toContain('Food');
  await ReactTestRenderer.act(() => renderer!.unmount());
});

test('maintenance form adds a request with an allocated roommate share', async () => {
  const photo = {
    uri: 'file://tap.jpg',
    name: 'tap.jpg',
    error: null,
    type: 'image/jpeg',
    nativeType: 'image/jpeg',
    size: 100,
    isVirtual: false,
    convertibleToMimeTypes: null,
    hasRequestedType: true,
  };
  jest.mocked(pick).mockResolvedValue([photo]);

  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<ReportMaintenanceScreen />);
  });

  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'maintenance-category-electrical' }).props.onPress();
    renderer!.root.findByProps({ testID: 'maintenance-description' }).props.onChangeText('Hall light repair');
    renderer!.root.findByProps({ testID: 'maintenance-estimate' }).props.onChangeText('800');
    renderer!.root.findByProps({ testID: 'maintenance-member-increase' }).props.onPress();
  });
  await ReactTestRenderer.act(async () => {
    await renderer!.root.findByProps({ testID: 'maintenance-photo-picker' }).props.onPress();
  });
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'maintenance-submit' }).props.onPress();
  });

  const renderedTree = getVisibleText(renderer!);
  expect(renderedTree).toContain('Electrical');
  expect(renderedTree).toContain('PKR 800 / PKR 160 each');
  expect(renderedTree).toContain('Split dynamically across 5 active room members');
  expect(renderedTree).toContain('Photo attached · tap.jpg');
  await ReactTestRenderer.act(() => renderer!.unmount());
});

test('calendar absences update the attendance counter and shares', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<AttendanceProrationScreen />);
  });
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'attendance-date-12' }).props.onPress();
  });
  expect(getVisibleText(renderer!)).toContain('29');
  expect(getVisibleText(renderer!)).toContain('1,015');
  expect(renderer!.root.findByProps({ testID: 'attendance-date-12' }).props.accessibilityState.selected).toBe(true);
  await ReactTestRenderer.act(() => renderer!.unmount());
});

test('profile modal saves fields and quick actions navigate to their flows', async () => {
  const navigate = jest.fn();
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <RoleSessionProvider value={{ role: 'roommate', previewRole: () => {}, signOut: () => {} }}>
        <RoommateDashboardScreen navigation={{ navigate } as never} route={{ key: 'Home', name: 'Home' } as never} />
      </RoleSessionProvider>,
    );
  });

  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'open-profile' }).props.onPress();
  });
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'profile-name' }).props.onChangeText('Ayesha Khan');
    renderer!.root.findByProps({ testID: 'profile-phone' }).props.onChangeText('03001234567');
    renderer!.root.findByProps({ testID: 'profile-emergency-contact' }).props.onChangeText('Ali 03007654321');
  });
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'save-profile' }).props.onPress();
  });
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'open-profile' }).props.onPress();
  });
  const renderedText = getVisibleText(renderer!);
  expect(renderer!.root.findByProps({ testID: 'profile-name' }).props.value).toBe('Ayesha Khan');
  expect(renderer!.root.findByProps({ testID: 'profile-phone' }).props.value).toBe('03001234567');
  expect(renderer!.root.findByProps({ testID: 'profile-emergency-contact' }).props.value).toBe('Ali 03007654321');
  expect(renderedText).toContain('Pending Approval');
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ accessibilityLabel: 'Close profile editor' }).props.onPress();
  });

  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'quick-upload-expense' }).props.onPress();
    renderer!.root.findByProps({ testID: 'quick-mark-absent' }).props.onPress();
    renderer!.root.findByProps({ testID: 'quick-pay-bill' }).props.onPress();
  });
  expect(navigate.mock.calls).toEqual([['Bills'], ['Attendance'], ['Bills']]);
  await ReactTestRenderer.act(() => renderer!.unmount());
});

test('admin dashboard opens profile modal, edits fields, and signs out from modal', async () => {
  const signOut = jest.fn();
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <RoleSessionProvider value={{ role: 'admin', previewRole: () => {}, signOut }}>
        <SafeAreaProvider
          initialMetrics={{
            frame: { x: 0, y: 0, width: 400, height: 800 },
            insets: { top: 0, right: 0, bottom: 0, left: 0 },
          }}
        >
          <AdminDashboardScreen
            navigation={{ navigate: jest.fn() } as never}
            route={{ key: 'Dashboard', name: 'Dashboard' } as never}
          />
        </SafeAreaProvider>
      </RoleSessionProvider>,
    );
  });

  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'admin-open-profile' }).props.onPress();
  });
  expect(renderer!.root.findByProps({ testID: 'admin-profile-name' })).toBeDefined();
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'admin-profile-name' }).props.onChangeText('Gulberg Admin');
    renderer!.root.findByProps({ testID: 'admin-profile-phone' }).props.onChangeText('03001112222');
    renderer!.root.findByProps({ testID: 'admin-profile-emergency-contact' }).props.onChangeText('Emergency contact');
  });
  expect(renderer!.root.findByProps({ testID: 'admin-profile-name' }).props.value).toBe('Gulberg Admin');
  expect(renderer!.root.findByProps({ testID: 'admin-profile-photo-picker' })).toBeDefined();

  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'admin-profile-sign-out' }).props.onPress();
  });
  expect(signOut).toHaveBeenCalledTimes(1);
  await ReactTestRenderer.act(() => renderer!.unmount());
});

test('signup invite code appears for Member and is hidden for Group Admin', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <RoleSessionProvider value={{ role: null, previewRole: () => {}, signOut: () => {} }}>
        <SignupScreen
          navigation={{ navigate: jest.fn() } as never}
          route={{ key: 'Signup', name: 'Signup' } as never}
        />
      </RoleSessionProvider>,
    );
  });

  expect(renderer!.root.findByProps({ testID: 'signup-invite-code' })).toBeDefined();
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'signup-role-admin' }).props.onPress();
  });
  expect(renderer!.root.findAllByProps({ testID: 'signup-invite-code' })).toHaveLength(0);

  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'signup-role-roommate' }).props.onPress();
  });
  expect(renderer!.root.findByProps({ testID: 'signup-invite-code' })).toBeDefined();
  await ReactTestRenderer.act(() => renderer!.unmount());
});

test('settlement peer actions select local channels and history filters work', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <PaymentHubScreen navigation={{ navigate: jest.fn() } as never} route={{ key: 'Settlement', name: 'Settlement' } as never} />,
    );
  });
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ accessibilityLabel: 'Request payment from Ali Hassan' }).props.onPress();
  });
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'settlement-channel-easypaisa' }).props.onPress();
  });
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'confirm-peer-action' }).props.onPress();
  });
  expect(getVisibleText(renderer!)).toContain('Requested via Easypaisa');

  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ accessibilityLabel: 'Mark settlement with Sara Khan as settled' }).props.onPress();
  });
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'settlement-channel-cash' }).props.onPress();
  });
  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'confirm-peer-action' }).props.onPress();
  });
  expect(getVisibleText(renderer!)).toContain('Settled via Cash');

  await ReactTestRenderer.act(() => {
    renderer!.root.findByProps({ testID: 'history-filter-verified-receipts' }).props.onPress();
    renderer!.root.findByProps({ testID: 'history-range-last-30-days' }).props.onPress();
  });
  const historyText = getVisibleText(renderer!);
  expect(historyText).toContain('October 2026');
  expect(historyText).not.toContain('September 2026');
  expect(historyText).not.toContain('August 2026');
  await ReactTestRenderer.act(() => renderer!.unmount());
});

async function enterRolePreview(role: 'admin' | 'roommate') {
  jest.useFakeTimers();
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  try {
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>,
      );
    });

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(2100);
    });

    const roleButton = renderer!.root.findByProps({ testID: `role-preview-${role}` });
    await ReactTestRenderer.act(() => {
      roleButton.props.onPress();
    });
    await ReactTestRenderer.act(() => {
      renderer!.root.findByProps({ testID: 'login-submit' }).props.onPress();
    });

    return JSON.stringify(renderer!.toJSON());
  } finally {
    if (renderer) {
      await ReactTestRenderer.act(() => renderer!.unmount());
    }
    jest.useRealTimers();
  }
}

async function createAccountPreview(role: 'admin' | 'roommate') {
  jest.useFakeTimers();
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  try {
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>,
      );
    });

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(2100);
    });
    await ReactTestRenderer.act(() => {
      renderer!.root.findByProps({ testID: 'open-signup' }).props.onPress();
    });
    await ReactTestRenderer.act(() => {
      renderer!.root.findByProps({ testID: `signup-role-${role}` }).props.onPress();
      renderer!.root.findByProps({ testID: 'signup-name' }).props.onChangeText('Test Member');
      renderer!.root.findByProps({ testID: 'signup-agree' }).props.onPress();
    });
    await ReactTestRenderer.act(() => {
      renderer!.root.findByProps({ testID: 'signup-submit' }).props.onPress();
    });

    return JSON.stringify(renderer!.toJSON());
  } finally {
    if (renderer) {
      await ReactTestRenderer.act(() => renderer!.unmount());
    }
    jest.useRealTimers();
  }
}

test('development role preview switches to the selected admin flow', async () => {
  const renderedTree = await enterRolePreview('admin');
  expect(renderedTree).toContain('Upcoming Bills');
  expect(renderedTree).toContain('Recent Activity');
});

test('development role preview switches to the selected roommate flow', async () => {
  const renderedTree = await enterRolePreview('roommate');
  expect(renderedTree).toContain('Your current balance');
  expect(renderedTree).toContain('Recent activity');
});

test('signup role selection routes group admins to Admin tabs', async () => {
  const renderedTree = await createAccountPreview('admin');
  expect(renderedTree).toContain('Upcoming Bills');
  expect(renderedTree).toContain('Recent Activity');
});

test('signup role selection routes roommates to the five-core mobile flow', async () => {
  const renderedTree = await createAccountPreview('roommate');
  expect(renderedTree).toContain('Your current balance');
  expect(renderedTree).toContain('Recent activity');
});
