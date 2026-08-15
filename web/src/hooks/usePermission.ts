'use client';

import { useAuth } from '@/contexts/AuthContext';

export function usePermission() {
  const { user } = useAuth();

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.some((role) => user.role === role);
  };

  const isAdmin = (): boolean => hasRole('ADMIN');

  const isManager = (): boolean =>
    hasAnyRole(['ADMIN', 'MANAGER']);

  const isEmployee = (): boolean =>
    hasAnyRole(['ADMIN', 'MANAGER', 'EMPLOYEE']);

  const canAccess = (allowedRoles: string[]): boolean => {
    return hasAnyRole(allowedRoles);
  };

  return {
    user,
    hasRole,
    hasAnyRole,
    isAdmin,
    isManager,
    isEmployee,
    canAccess,
  };
}
