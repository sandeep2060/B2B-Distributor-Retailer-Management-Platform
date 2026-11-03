import { cookies } from "next/headers";
import { signAuthToken, verifyAuthToken, SessionPayload } from "./jwt";
import marketplaceStore from "../db/store";

export const COOKIE_NAME = "b2b_session";

/**
 * Get current session user in Next.js Server Components or Server Actions
 */
export async function getServerSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyAuthToken(token);
    if (!payload) return null;

    // Check if user is still active in store
    const user = marketplaceStore.getUserById(payload.userId);
    if (!user || user.status === "SUSPENDED") return null;

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Enforce minimum role access or redirect
 */
export async function requireAuth(allowedRoles?: ("SUPER_ADMIN" | "DISTRIBUTOR" | "RETAILER")[]): Promise<SessionPayload> {
  const session = await getServerSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    throw new Error("FORBIDDEN");
  }

  return session;
}
