import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  canAccessRoute,
  canManagePlatform,
  getUserPermissionSlugs,
  hasAnyPermission,
  hasPermission,
  isSuperAdmin,
} from "../../utils/permissions";

export function usePermissions() {
  const { user } = useAuth();

  return useMemo(
    () => ({
      user,
      permissions: getUserPermissionSlugs(user),
      hasPermission: (slug) => hasPermission(user, slug),
      hasAnyPermission: (slugs) => hasAnyPermission(user, slugs),
      canAccessRoute: (link) => canAccessRoute(user, link),
      isSuperAdmin: isSuperAdmin(user),
      canManagePlatform: canManagePlatform(user),
    }),
    [user]
  );
}
