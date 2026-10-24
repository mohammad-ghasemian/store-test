export const ROLES = {
  USER: "USER",
  CONTENT_MANAGER: "CONTENT_MANAGER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
export const ADMIN_PANEL_ROLES: Role[] = [
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
  ROLES.CONTENT_MANAGER,
];
