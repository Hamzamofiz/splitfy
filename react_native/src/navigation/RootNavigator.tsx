import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import AdminTabNavigator from './AdminTabNavigator';
import RoommateNavigator from './RoommateNavigator';
import { useRoleSession } from './RoleSessionContext';
import type { RootStackParamList } from './types';
import { Colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { role, isRestoring } = useRoleSession();

  if (isRestoring) {
    return <View style={styles.loading}><ActivityIndicator color={Colors.teal} /></View>;
  }

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

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.canvas },
});
