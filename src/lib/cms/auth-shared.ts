export type AdminRole = "owner" | "editor" | "viewer";

export type AdminUser = {
  id: string;
  email: string;
  role: AdminRole;
  displayName: string;
};

export type AdminPermissionArea =
  | "overview"
  | "leads"
  | "tours"
  | "offices"
  | "news"
  | "content"
  | "operators"
  | "legal"
  | "settings"
  | "media"
  | "users"
  | "messaging";

export type AdminMutation =
  | "leads"
  | "tours"
  | "offices"
  | "news"
  | "content"
  | "operators"
  | "legal"
  | "media"
  | "settings"
  | "messaging"
  | "users";

export function canAccess(role: AdminRole, area: AdminPermissionArea): boolean {
  if (role === "owner") return true;
  if (role === "viewer") {
    return area === "overview" || area === "leads";
  }
  // editor
  return area !== "users";
}

export function canMutate(role: AdminRole, action: AdminMutation): boolean {
  if (role === "viewer") return false;
  if (role === "owner") return true;
  return action !== "users";
}

export function isAdminRole(value: string): value is AdminRole {
  return value === "owner" || value === "editor" || value === "viewer";
}
