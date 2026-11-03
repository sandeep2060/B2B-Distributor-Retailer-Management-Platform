import { NextResponse } from "next/server";
import { COOKIE_NAME, getServerSession } from "@/lib/auth/session";
import marketplaceStore from "@/lib/db/store";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = marketplaceStore.getUserById(session.userId);
  return NextResponse.json({
    authenticated: true,
    user: {
      ...session,
      avatarUrl: user?.avatarUrl,
      phone: user?.phone,
    },
  });
}

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
