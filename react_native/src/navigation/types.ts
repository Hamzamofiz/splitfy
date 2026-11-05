import type { NavigatorScreenParams } from '@react-navigation/native';

export type UserRole = 'admin' | 'roommate';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type RoommateTabParamList = {
  Home: undefined;
  Bills: undefined;
  Attendance: undefined;
  Maintenance: undefined;
  Settlement: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Bills: undefined;
  Roommates: undefined;
  Maintenance: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  AdminTabs: NavigatorScreenParams<AdminTabParamList> | undefined;
  RoommateTabs: NavigatorScreenParams<RoommateTabParamList> | undefined;
};
