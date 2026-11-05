import { createContext, useContext } from 'react';
import type { UserRole } from './types';

type RoleSession = {
  role: UserRole | null;
  previewRole: (role: UserRole) => void;
  signOut: () => void;
};

const RoleSessionContext = createContext<RoleSession | null>(null);

export const RoleSessionProvider = RoleSessionContext.Provider;

export function useRoleSession() {
  const session = useContext(RoleSessionContext);
  if (!session) {
    throw new Error('useRoleSession must be used within RoleSessionProvider.');
  }
  return session;
}
