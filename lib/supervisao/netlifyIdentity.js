import GoTrue from "gotrue-js";

export function createNetlifyIdentityAuth() {
  if (typeof window === "undefined") return null;

  return new GoTrue({
    APIUrl: `${window.location.origin}/.netlify/identity`,
    audience: "",
    setCookie: true,
  });
}

export function getUserRoles(user) {
  return user?.app_metadata?.roles || user?.app_metadata?.authorization?.roles || [];
}

export function userHasAllowedRole(user, allowedRoles = []) {
  if (!allowedRoles.length) return true;

  const roles = getUserRoles(user);
  return roles.some((role) => allowedRoles.includes(role));
}

export async function getUserJwt(user) {
  if (!user) return "";

  if (typeof user.jwt === "function") {
    return user.jwt();
  }

  return user?.token?.access_token || user?.token?.accessToken || "";
}
