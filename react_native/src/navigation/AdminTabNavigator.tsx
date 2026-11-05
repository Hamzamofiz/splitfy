import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { ReactNode } from 'react';

import type { AdminTabParamList } from './types';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminBillsScreen from '../screens/admin/AdminBillsScreen';
import AdminRoommatesScreen from '../screens/admin/AdminRoommatesScreen';
import AdminMaintenanceScreen from '../screens/admin/AdminMaintenanceScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const icons: Record<keyof AdminTabParamList, string> = {
  Dashboard: 'grid-outline',
  Bills: 'receipt-outline',
  Roommates: 'people-outline',
  Maintenance: 'construct-outline',
  Settings: 'settings-outline',
};

type IconProps = { focused: boolean; color: string; size: number };
const tabIcons: Record<keyof AdminTabParamList, (props: IconProps) => ReactNode> = {
  Dashboard: ({ color, size }) => <Ionicons name={icons.Dashboard} size={size} color={color} />,
  Bills: ({ color, size }) => <Ionicons name={icons.Bills} size={size} color={color} />,
  Roommates: ({ color, size }) => <Ionicons name={icons.Roommates} size={size} color={color} />,
  Maintenance: ({ color, size }) => <Ionicons name={icons.Maintenance} size={size} color={color} />,
  Settings: ({ color, size }) => <Ionicons name={icons.Settings} size={size} color={color} />,
};

export default function AdminTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#0D9488',
      tabBarInactiveTintColor: '#94A3B8',
      tabBarHideOnKeyboard: true,
      tabBarStyle: { height: 66, paddingTop: 5, paddingBottom: 7 },
      tabBarLabelStyle: { fontSize: 9, fontWeight: '600' },
    }}>
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} options={{ title: 'Home', tabBarIcon: tabIcons.Dashboard }} />
      <Tab.Screen name="Bills" component={AdminBillsScreen} options={{ title: 'Bills', tabBarIcon: tabIcons.Bills }} />
      <Tab.Screen name="Roommates" component={AdminRoommatesScreen} options={{ title: 'Members', tabBarIcon: tabIcons.Roommates }} />
      <Tab.Screen name="Maintenance" component={AdminMaintenanceScreen} options={{ title: 'Repairs', tabBarIcon: tabIcons.Maintenance }} />
      <Tab.Screen name="Settings" component={AdminSettingsScreen} options={{ title: 'Settings', tabBarIcon: tabIcons.Settings }} />
    </Tab.Navigator>
  );
}
