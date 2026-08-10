const ROUTE_PERMISSIONS = {
  "/": "view_dashboard",
  "/gallery": "view_gallery",
  "/menuitems": "view_menu_items",
  "/menus": "view_menus",
  "/navbars": "view_navbars",
  "/cards": "view_components",
  "/sliders": "view_sliders",
  "/footers": "view_footers",
  "/pages": "view_pages",
  "/blogs": "view_blogs",
  "/formbuilder": "access_dynamic_form_builder",
  "/formbuilder/form-responses": "view_form_responses",
  "/tools": "access_doc_to_api",
  "/settings/cms-settings": "view_users",
  "/settings/users-settings": "view_users",
  "/settings/user-registration": "view_users",
  "/settings/access-control": "view_users",
  "/settings/role-permission": "create_roles",
  "/admin/organizations": "manage_organizations",
  "/admin/organizations/[id]": "manage_organizations",
  "/admin/roles": "manage_organizations",
  "/usermanual/changelog": "view_changelog",
  "/usermanual/documentation": "view_documentation",
  "/usermanual/userguide": "view_user_guide",
  "/usermanual/faq": "view_faq",
  "/usermanual/support": "access_support",
};

export function isSuperAdmin(user) {
  if (!user) {
    return false;
  }

  if (user.is_super_admin) {
    return true;
  }

  const role = user?.role_mave;
  const permissions = role?.permission_mave || [];

  return permissions.some(
    (permission) =>
      permission?.slug === "admin_all" && permission?.status !== 0
  );
}

export function canManagePlatform(user) {
  if (!user) {
    return false;
  }

  if (user.is_super_admin) {
    return true;
  }

  return hasPermission(user, "manage_organizations");
}

export function getUserPermissionSlugs(user) {
  const role = user?.role_mave;
  const permissions = role?.permission_mave || [];

  if (!permissions.length) {
    return [];
  }

  const slugs = permissions
    .filter((permission) => permission?.status !== 0)
    .map((permission) => permission.slug)
    .filter(Boolean);

  if (slugs.includes("admin_all")) {
    return ["admin_all", ...Object.values(ROUTE_PERMISSIONS)];
  }

  return slugs;
}

export function hasPermission(user, slug) {
  if (!slug) {
    return true;
  }

  if (user?.is_super_admin) {
    return true;
  }

  const slugs = getUserPermissionSlugs(user);

  if (slugs.includes("admin_all")) {
    return true;
  }

  return slugs.includes(slug);
}

export function hasAnyPermission(user, requiredSlugs = []) {
  if (!requiredSlugs.length) {
    return true;
  }

  return requiredSlugs.some((slug) => hasPermission(user, slug));
}

export function canAccessRoute(user, link) {
  if (!link) {
    return true;
  }

  if (link.startsWith("/admin/organizations")) {
    return canManagePlatform(user);
  }

  if (link.startsWith("/admin/roles")) {
    return canManagePlatform(user);
  }

  let permission = ROUTE_PERMISSIONS[link];

  if (!permission) {
    return true;
  }

  return hasPermission(user, permission);
}

export function filterMenuByPermissions(menuItems, user) {
  if (!user) {
    return menuItems;
  }

  return menuItems
    .map((item) => {
      if (item.submenu?.length) {
        const submenu = item.submenu.filter((subItem) =>
          canAccessRoute(user, subItem.link)
        );

        if (!submenu.length) {
          return null;
        }

        return { ...item, submenu };
      }

      return canAccessRoute(user, item.link) ? item : null;
    })
    .filter(Boolean);
}

export { ROUTE_PERMISSIONS };
