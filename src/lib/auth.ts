/**
 * Lightweight session auth for the admin dashboard.
 * Route-handler / server-component layer (Node runtime).
 */
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  VALID_SESSION_TOKEN,
  verifyCredentials,
  isValidSessionToken,
} from "./auth-constants";

// Re-export so route handlers / server components can import everything from
// a single module, while keeping local bindings for internal use below.
export {
  SESSION_COOKIE,
  VALID_SESSION_TOKEN,
  verifyCredentials,
  isValidSessionToken,
};

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
