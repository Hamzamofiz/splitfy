import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type {
  AdminTabParamList,
  BillsStackParamList,
  LedgerStackParamList,
  MaintenanceStackParamList,
  RoommatesStackParamList,
} from './types';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminExpenseManagerScreen from '../screens/admin/AdminExpenseManagerScreen';
import BillUploadScreen from '../screens/admin/BillUploadScreen';
import RoommatesScreen from '../screens/admin/MemberManagementScreen';
import MaintenanceAllocatorScreen from '../screens/admin/AdminMaintenanceAllocator';
import SettingsScreen from '../screens/admin/PaymentSetupScreen';
import AdminAnalyticsScreen from '../screens/admin/AdminAnalyticsScreen';
import AdminLedgerAuditScreen from '../screens/admin/AdminLedgerAuditScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const BillsStack = createNativeStackNavigator<BillsStackParamList>();
const RoommatesStack = createNativeStackNavigator<RoommatesStackParamList>();
const MaintenanceStack = createNativeStackNavigator<MaintenanceStackParamList>();
const LedgerStack = createNativeStackNavigator<LedgerStackParamList>();
const hideTabBarButton = () => null;
const ACTIVE_TINT = '#0D9488';
const INACTIVE_TINT = '#94A3B8';

function BillsNavigator() {
  return (
    <BillsStack.Navigator screenOptions={{ headerShown: false }}>
      <BillsStack.Screen name="AdminExpenseManager" component={AdminExpenseManagerScreen} />
      <BillsStack.Screen name="BillUpload" component={BillUploadScreen} />
    </BillsStack.Navigator>
  );
}

function RoommatesNavigator() {
  return (
    <RoommatesStack.Navigator screenOptions={{ headerShown: false }}>
      <RoommatesStack.Screen name="MemberManagement" component={RoommatesScreen} />
    </RoommatesStack.Navigator>
  );
}

function MaintenanceNavigator() {
  return (
    <MaintenanceStack.Navigator screenOptions={{ headerShown: false }}>
      <MaintenanceStack.Screen name="AdminMaintenanceAllocator" component={MaintenanceAllocatorScreen} />
    </MaintenanceStack.Navigator>
  );
}

function LedgerNavigator() {
  return (
    <LedgerStack.Navigator screenOptions={{ headerShown: false }}>
      <LedgerStack.Screen name="AdminAnalytics" component={AdminAnalyticsScreen} />
      <LedgerStack.Screen name="AdminLedgerAudit" component={AdminLedgerAuditScreen} />
    </LedgerStack.Navigator>
  );
}

type TabIconName = React.ComponentProps<typeof Ionicons>['name'];
const TAB_ICONS: Record<keyof AdminTabParamList, [TabIconName, TabIconName]> = {
  Dashboard: ['home', 'home-outline'],
  Bills: ['receipt', 'receipt-outline'],
  Roommates: ['people', 'people-outline'],
  Maintenance: ['construct', 'construct-outline'],
  Settings: ['settings', 'settings-outline'],
  Analytics: ['analytics', 'analytics-outline'],
};

const getTabIcon = (routeName: keyof AdminTabParamList, focused: boolean): TabIconName => {
  const [activeIcon, inactiveIcon] = TAB_ICONS[routeName];
  return focused ? activeIcon : inactiveIcon;
};

const createTabIconRenderer =
  (routeName: keyof AdminTabParamList) =>
  ({ focused, color }: { focused: boolean; color: string }) => (
    <Ionicons
      name={getTabIcon(routeName, focused)}
      size={21}
      color={color}
    />
  );

const TAB_ICON_RENDERERS = {
  Dashboard: createTabIconRenderer('Dashboard'),
  Bills: createTabIconRenderer('Bills'),
  Roommates: createTabIconRenderer('Roommates'),
  Maintenance: createTabIconRenderer('Maintenance'),
  Settings: createTabIconRenderer('Settings'),
  Analytics: createTabIconRenderer('Analytics'),
};

export default function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_TINT,
        tabBarInactiveTintColor: INACTIVE_TINT,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          width: '100%',
          height: 68,
          paddingBottom: 8,
          paddingTop: 7,
          paddingHorizontal: 0,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          elevation: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          flex: 1,
          minWidth: 0,
        },
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '600',
          marginTop: 2,
          flexShrink: 1,
          textAlign: 'center',
          includeFontPadding: false,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{ tabBarIcon: TAB_ICON_RENDERERS.Dashboard, tabBarAccessibilityLabel: 'Dashboard tab' }}
      />
      <Tab.Screen
        name="Bills"
        component={BillsNavigator}
        options={{ tabBarIcon: TAB_ICON_RENDERERS.Bills, tabBarAccessibilityLabel: 'Bills tab' }}
      />
      <Tab.Screen
        name="Roommates"
        component={RoommatesNavigator}
        options={{ tabBarIcon: TAB_ICON_RENDERERS.Roommates, tabBarAccessibilityLabel: 'Roommates tab' }}
      />
      <Tab.Screen
        name="Maintenance"
        component={MaintenanceNavigator}
        options={{ tabBarIcon: TAB_ICON_RENDERERS.Maintenance, tabBarAccessibilityLabel: 'Maintenance tab' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: TAB_ICON_RENDERERS.Settings, tabBarAccessibilityLabel: 'Settings tab' }}
      />
      <Tab.Screen
        name="Analytics"
        component={LedgerNavigator}
        options={{
          tabBarButton: hideTabBarButton,
          tabBarItemStyle: { display: 'none' },
          tabBarIcon: TAB_ICON_RENDERERS.Analytics,
          tabBarAccessibilityLabel: 'Analytics tab',
        }}
      />
    </Tab.Navigator>
  );
}