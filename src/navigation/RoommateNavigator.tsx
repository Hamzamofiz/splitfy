import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { RoommateTabParamList } from './types';
import RoommateDashboardScreen from '../screens/roommate/RoommateDashboardScreen';
import BillsExpensesScreen from '../screens/roommate/BillsExpensesScreen';
import AttendanceProrationScreen from '../screens/roommate/AttendanceProrationScreen';
import ReportMaintenanceScreen from '../screens/roommate/ReportMaintenanceScreen';
import PaymentHubScreen from '../screens/roommate/PaymentHubScreen';

const Tab = createBottomTabNavigator<RoommateTabParamList>();
const ACTIVE_TINT = '#0D9488';
const INACTIVE_TINT = '#94A3B8';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const ICONS: Record<keyof RoommateTabParamList, [IconName, IconName]> = {
  Home: ['home', 'home-outline'],
  Bills: ['receipt', 'receipt-outline'],
  Attendance: ['calendar', 'calendar-outline'],
  Maintenance: ['construct', 'construct-outline'],
  Settlement: ['wallet', 'wallet-outline'],
};

const createTabIcon =
  (routeName: keyof RoommateTabParamList) =>
  ({ focused, color }: { focused: boolean; color: string }) => {
    const [active, inactive] = ICONS[routeName];
    return <Ionicons name={focused ? active : inactive} size={21} color={color} />;
  };

const TAB_ICONS_RENDERERS = {
  Home: createTabIcon('Home'),
  Bills: createTabIcon('Bills'),
  Attendance: createTabIcon('Attendance'),
  Maintenance: createTabIcon('Maintenance'),
  Settlement: createTabIcon('Settlement'),
};

export default function RoommateNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_TINT,
        tabBarInactiveTintColor: INACTIVE_TINT,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 68,
          paddingHorizontal: 0,
          paddingTop: 7,
          paddingBottom: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          elevation: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarItemStyle: { flex: 1, minWidth: 0 },
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '600',
          marginTop: 2,
          includeFontPadding: false,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={RoommateDashboardScreen}
        options={{ tabBarIcon: TAB_ICONS_RENDERERS.Home, tabBarAccessibilityLabel: 'Home tab' }}
      />
      <Tab.Screen
        name="Bills"
        component={BillsExpensesScreen}
        options={{ tabBarIcon: TAB_ICONS_RENDERERS.Bills, tabBarAccessibilityLabel: 'Bills and expenses tab' }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceProrationScreen}
        options={{ tabBarIcon: TAB_ICONS_RENDERERS.Attendance, tabBarAccessibilityLabel: 'Attendance and proration tab' }}
      />
      <Tab.Screen
        name="Maintenance"
        component={ReportMaintenanceScreen}
        options={{ tabBarIcon: TAB_ICONS_RENDERERS.Maintenance, tabBarAccessibilityLabel: 'Maintenance tab' }}
      />
      <Tab.Screen
        name="Settlement"
        component={PaymentHubScreen}
        options={{ tabBarIcon: TAB_ICONS_RENDERERS.Settlement, tabBarAccessibilityLabel: 'Settlement and payment tab' }}
      />
    </Tab.Navigator>
  );
}
