import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { UserRole } from './types';
import { setAuthToken, type User } from '../services/api';

type RoleSession = {
  role: UserRole | null;
  user: User | null;
  isRestoring: boolean;
  authenticate: (user: User, token: string) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  previewRole: (role: UserRole) => void;
  signOut: () => Promise<void>;
};

const RoleSessionContext = createContext<RoleSession | null>(null);
const SESSION_KEY = 'splitify.session';

export function RoleSessionProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(SESSION_KEY)
      .then(saved => {
        if (!saved) return;
        const session = JSON.parse(saved) as { user: User; token: string };
        if (!session.user?._id || !session.token || !['admin', 'roommate'].includes(session.user.role)) {
          throw new Error('Stored session is invalid.');
        }
        if (active) {
          setUser(session.user);
          setRole(session.user.role);
          setAuthToken(session.token);
        }
      })
      .catch(error => {
        console.error('Unable to restore the saved session:', error);
        return AsyncStorage.removeItem(SESSION_KEY);
      })
      .finally(() => {
        if (active) setIsRestoring(false);
      });

    return () => { active = false; };
  }, []);

  const session = useMemo<RoleSession>(
    () => ({
      role,
      user,
      isRestoring,
      authenticate: async (authenticatedUser, token) => {
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ user: authenticatedUser, token }));
        setAuthToken(token);
        setUser(authenticatedUser);
        setRole(authenticatedUser.role);
      },
      updateUser: async updatedUser => {
        const saved = await AsyncStorage.getItem(SESSION_KEY);
        if (saved) {
          const currentSession = JSON.parse(saved) as { user: User; token: string };
          await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ ...currentSession, user: updatedUser }));
        }
        setUser(updatedUser);
        setRole(updatedUser.role);
      },
      previewRole: selectedRole => {
        if (!__DEV__) {
          throw new Error('Role preview is only available in development.');
        }
        setUser(null);
        setRole(selectedRole);
      },
      signOut: async () => {
        await AsyncStorage.removeItem(SESSION_KEY);
        setAuthToken(null);
        setUser(null);
        setRole(null);
      },
    }),
    [isRestoring, role, user],
  );

  return <RoleSessionContext.Provider value={session}>{children}</RoleSessionContext.Provider>;
}

export function useRoleSession() {
  const session = useContext(RoleSessionContext);
  if (!session) {
    throw new Error('useRoleSession must be used within RoleSessionProvider.');
  }
  return session;
}
