import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList, RootStackParamList, UserRole } from './types';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import RoommateNavigator from './RoommateNavigator';
import AdminTabNavigator from './AdminTabNavigator';
import { RoleSessionProvider } from './RoleSessionContext';

const Root = createNativeStackNavigator<RootStackParamList>();
const Auth = createNativeStackNavigator<AuthStackParamList>();

function AuthStack() {
  return (
    <Auth.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Auth.Screen name="Splash" component={SplashScreen} />
      <Auth.Screen name="Login" component={LoginScreen} />
      <Auth.Screen name="Signup" component={SignupScreen} />
    </Auth.Navigator>
  );
}

export default function RootNavigator() {
  const [role, setRole] = useState<UserRole | null>(null);
  const previewRole = (nextRole: UserRole) => {
    if (!__DEV__) {
      throw new Error('Role preview is available only in development.');
    }
    setRole(nextRole);
  };

  const signOut = () => setRole(null);

  return (
    <RoleSessionProvider value={{ role, previewRole, signOut }}>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {role === null ? (
          <Root.Screen name="Auth" component={AuthStack} />
        ) : role === 'admin' ? (
          <Root.Screen name="AdminTabs" component={AdminTabNavigator} />
        ) : (
          <Root.Screen name="RoommateTabs" component={RoommateNavigator} />
        )}
      </Root.Navigator>
    </RoleSessionProvider>
  );
}
