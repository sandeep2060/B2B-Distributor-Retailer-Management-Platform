import { NextResponse } from "next/server";
import marketplaceStore from "@/lib/db/store";
import { hashPassword } from "@/lib/auth/password";
import { signAuthToken } from "@/lib/auth/jwt";
import { COOKIE_NAME } from "@/lib/auth/session";
import { retailerRegisterSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = retailerRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation error", errors: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // Check if email already registered
    const existing = marketplaceStore.getUserByEmail(data.email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const passwordHash = await hashPassword(data.password);
    const userId = `usr_ret_${Date.now()}`;

    const newUser = marketplaceStore.createUser({
      id: userId,
      email: data.email,
      passwordHash,
      role: "RETAILER",
      status: "ACTIVE",
      fullName: data.fullName,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    });

    const newProfile = marketplaceStore.createRetailerProfile({
      id: `ret_${Date.now()}`,
      userId: newUser.id,
      shopName: data.shopName,
      panVatNumber: data.panVatNumber || "",
      province: data.province,
      district: data.district,
      municipality: data.municipality,
      ward: data.ward,
      streetAddress: data.streetAddress,
      landmark: data.landmark || "",
      businessType: data.businessType || "Retail Store",
      isVerified: true,
    });

    const token = signAuthToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.fullName,
      status: newUser.status,
      retailerProfileId: newProfile.id,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.fullName,
      },
      redirectTo: "/retailer/dashboard",
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
