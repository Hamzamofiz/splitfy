import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { ReactNode } from 'react';

import type { RoommateTabParamList } from './types';
import RoommateDashboardScreen from '../screens/roommate/RoommateDashboardScreen';
import BillsExpensesScreen from '../screens/roommate/BillsExpensesScreen';
import AttendanceProrationScreen from '../screens/roommate/AttendanceProrationScreen';
import ReportMaintenanceScreen from '../screens/roommate/ReportMaintenanceScreen';
import PaymentHubScreen from '../screens/roommate/PaymentHubScreen';

const Tab = createBottomTabNavigator<RoommateTabParamList>();
const icons: Record<keyof RoommateTabParamList, string> = {
  Home: 'home-outline',
  Bills: 'receipt-outline',
  Attendance: 'calendar-outline',
  Maintenance: 'construct-outline',
  Settlement: 'wallet-outline',
};

type IconProps = { focused: boolean; color: string; size: number };
const tabIcons: Record<keyof RoommateTabParamList, (props: IconProps) => ReactNode> = {
  Home: ({ color, size }) => <Ionicons name={icons.Home} size={size} color={color} />,
  Bills: ({ color, size }) => <Ionicons name={icons.Bills} size={size} color={color} />,
  Attendance: ({ color, size }) => <Ionicons name={icons.Attendance} size={size} color={color} />,
  Maintenance: ({ color, size }) => <Ionicons name={icons.Maintenance} size={size} color={color} />,
  Settlement: ({ color, size }) => <Ionicons name={icons.Settlement} size={size} color={color} />,
};

export default function RoommateNavigator() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#0D9488',
      tabBarInactiveTintColor: '#94A3B8',
      tabBarHideOnKeyboard: true,
      tabBarStyle: { height: 66, paddingTop: 5, paddingBottom: 7 },
      tabBarLabelStyle: { fontSize: 9, fontWeight: '600' },
    }}>
      <Tab.Screen name="Home" component={RoommateDashboardScreen} options={{ title: 'Home', tabBarIcon: tabIcons.Home, tabBarAccessibilityLabel: 'Home tab' }} />
      <Tab.Screen name="Bills" component={BillsExpensesScreen} options={{ title: 'Bills', tabBarIcon: tabIcons.Bills, tabBarAccessibilityLabel: 'Bills and expenses tab' }} />
      <Tab.Screen name="Attendance" component={AttendanceProrationScreen} options={{ title: 'Attendance', tabBarIcon: tabIcons.Attendance, tabBarAccessibilityLabel: 'Attendance and proration tab' }} />
      <Tab.Screen name="Maintenance" component={ReportMaintenanceScreen} options={{ title: 'Maintenance', tabBarIcon: tabIcons.Maintenance, tabBarAccessibilityLabel: 'Maintenance tab' }} />
      <Tab.Screen name="Settlement" component={PaymentHubScreen} options={{ title: 'Settlement', tabBarIcon: tabIcons.Settlement, tabBarAccessibilityLabel: 'Settlement and payment tab' }} />
    </Tab.Navigator>
  );
}
