import { NextResponse } from "next/server";
import marketplaceStore from "@/lib/db/store";
import { getServerSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    const distributorId = session?.distributorId || "dist_1";
    const settings = marketplaceStore.getDistributorSettings(distributorId);
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    const distributorId = session?.distributorId || "dist_1";
    const body = await request.json();

    const updated = marketplaceStore.updateDistributorSettings(distributorId, body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
