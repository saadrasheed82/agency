/**
 * Edge-safe auth constants. No `next/headers` import here so this can be
 * imported by middleware (Edge runtime) without bundling server-only APIs.
 */

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "#Saad#2005s";

// Static opaque session token (single-instance sandbox).
const SESSION_TOKEN = "saad_admin_sess_8f3a9c2e1b7d4a6e";
const COOKIE_NAME = "saad_admin_sess";

export const SESSION_COOKIE = COOKIE_NAME;
export const VALID_SESSION_TOKEN = SESSION_TOKEN;

export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function isValidSessionToken(
  token: string | undefined | null
): boolean {
  return token === SESSION_TOKEN;
}
