export function normalizeRole(role) {
  if (!role) {
    return null;
  }
  const value = String(role).trim().toUpperCase();
  if (!value) {
    return null;
  }
  return value.startsWith("ROLE_") ? value.slice(5) : value;
}

export function homePathForRole(role) {
  return normalizeRole(role) === "ADMIN" ? "/admin" : "/home";
}
