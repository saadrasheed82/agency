/**
 * Lightweight session auth for the admin dashboard.
 * Route-handler / server-component layer (Node runtime).
 */
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  VALID_SESSION_TOKEN,
  API_KEY,
  verifyCredentials,
  isValidSessionToken,
} from "./auth-constants";

// Re-export so route handlers / server components can import everything from
// a single module, while keeping local bindings for internal use below.
export {
  SESSION_COOKIE,
  VALID_SESSION_TOKEN,
  API_KEY,
  verifyCredentials,
  isValidSessionToken,
};

export function authenticateApiRequest(request: NextRequest): boolean {
  const header = request.headers.get("authorization") ?? "";
  const token = decodeURIComponent(header.replace(/^Bearer\s+/i, "").trim());
  return token === API_KEY;
}

export async function createSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, VALID_SESSION_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(SESSION_COOKIE)?.value);
}
