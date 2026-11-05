import React, { createContext, useContext, useMemo, useState } from 'react';

import type { UserRole } from './types';

type RoleSession = {
  role: UserRole | null;
  previewRole: (role: UserRole) => void;
  signOut: () => void;
};

const RoleSessionContext = createContext<RoleSession | null>(null);

export function RoleSessionProvider({ children }: React.PropsWithChildren) {
  const [role, setRole] = useState<UserRole | null>(null);
  const session = useMemo<RoleSession>(
    () => ({
      role,
      previewRole: selectedRole => {
        if (!__DEV__) {
          throw new Error('Role preview is only available in development.');
        }
        setRole(selectedRole);
      },
      signOut: () => setRole(null),
    }),
    [role],
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
