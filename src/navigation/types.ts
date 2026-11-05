import type { NavigatorScreenParams } from '@react-navigation/native';

// Auth and feature stack routes.
export type AuthStackParamList = {
  Splash: undefined;
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

export type BillsStackParamList = {
  AdminExpenseManager: undefined;
  BillUpload: undefined;
};

export type RoommatesStackParamList = {
  MemberManagement: undefined;
};

export type MaintenanceStackParamList = {
  AdminMaintenanceAllocator: undefined;
};

export type LedgerStackParamList = {
  AdminAnalytics: undefined;
  AdminLedgerAudit: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Bills: NavigatorScreenParams<BillsStackParamList>;
  Roommates: NavigatorScreenParams<RoommatesStackParamList>;
  Maintenance: NavigatorScreenParams<MaintenanceStackParamList>;
  Settings: undefined;
  Analytics: NavigatorScreenParams<LedgerStackParamList>;
};

export type UserRole = 'admin' | 'roommate';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  AdminTabs: NavigatorScreenParams<AdminTabParamList> | undefined;
  RoommateTabs: NavigatorScreenParams<RoommateTabParamList> | undefined;
};
