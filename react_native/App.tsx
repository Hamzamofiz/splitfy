import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from './src/navigation/RootNavigator';
import { RoleSessionProvider } from './src/navigation/RoleSessionContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <RoleSessionProvider>
          <RootNavigator />
        </RoleSessionProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
