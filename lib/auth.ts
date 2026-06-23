import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "margin_session";

function expectedToken() {
  const secret = process.env.AUTH_SECRET || "dev-secret";
  return createHmac("sha256", secret).update("admin-session").digest("hex");
}

export function verifyPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "changeme";
  if (password.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function createSessionToken() {
  return expectedToken();
}

export function isAuthenticated() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const expected = expectedToken();
  if (token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
