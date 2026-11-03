import jwt from "jsonwebtoken";

const AUTH_SECRET = process.env.AUTH_SECRET || "b2b-deal-nepal-wholesale-marketplace-secret-key-2026";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "DISTRIBUTOR" | "RETAILER";
  name: string;
  distributorId?: string;
  retailerProfileId?: string;
  status: string;
}

export function signAuthToken(payload: SessionPayload): string {
  return jwt.sign(payload, AUTH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAuthToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as SessionPayload;
  } catch (error) {
    return null;
  }
}
