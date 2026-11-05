import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import AdminTabNavigator from './AdminTabNavigator';
import RoommateNavigator from './RoommateNavigator';
import { useRoleSession } from './RoleSessionContext';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { role } = useRoleSession();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === 'admin' ? (
        <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
      ) : role === 'roommate' ? (
        <Stack.Screen name="RoommateTabs" component={RoommateNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
