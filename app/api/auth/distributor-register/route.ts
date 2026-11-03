import { NextResponse } from "next/server";
import marketplaceStore from "@/lib/db/store";
import { hashPassword } from "@/lib/auth/password";
import { signAuthToken } from "@/lib/auth/jwt";
import { COOKIE_NAME } from "@/lib/auth/session";
import { distributorRegisterSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = distributorRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation error", errors: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    const existing = marketplaceStore.getUserByEmail(data.email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const passwordHash = await hashPassword(data.password);
    const userId = `usr_dist_${Date.now()}`;

    const newUser = marketplaceStore.createUser({
      id: userId,
      email: data.email,
      passwordHash,
      role: "DISTRIBUTOR",
      status: "ACTIVE", // Verified and active for seamless demonstration
      fullName: data.fullName,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    });

    const distId = `dist_${Date.now()}`;
    const newProfile = marketplaceStore.createDistributorProfile({
      id: distId,
      userId: newUser.id,
      companyName: data.companyName,
      panVatNumber: data.panVatNumber,
      registrationNumber: data.registrationNumber || "REG-" + Math.floor(10000 + Math.random() * 90000),
      province: data.province,
      district: data.district,
      municipality: data.municipality,
      ward: data.ward,
      streetAddress: data.streetAddress,
      contactPerson: data.contactPerson,
      contactPhone: data.contactPhone,
      bankName: data.bankName,
      bankAccountName: data.bankAccountName,
      bankAccountNumber: data.bankAccountNumber,
      commissionRate: 3.0,
      isVerified: true,
      rating: 5.0,
      minOrderAmount: data.minOrderAmount,
      deliveryZones: [data.district, "Kathmandu Valley"],
    });

    const token = signAuthToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.fullName,
      status: newUser.status,
      distributorId: newProfile.id,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.fullName,
      },
      redirectTo: "/distributor/dashboard",
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
