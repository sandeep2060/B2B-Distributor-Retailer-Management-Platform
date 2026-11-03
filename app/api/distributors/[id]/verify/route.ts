import { NextResponse } from "next/server";
import marketplaceStore from "@/lib/db/store";
import { requireAuth } from "@/lib/auth/session";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(["SUPER_ADMIN"]);
    const body = await request.json();
    const { isVerified, commissionRate } = body;

    const distributorId = params.id;
    const dist = marketplaceStore.getDistributorById(distributorId);

    if (!dist) {
      return NextResponse.json({ error: "Distributor not found" }, { status: 404 });
    }

    if (isVerified !== undefined) {
      marketplaceStore.verifyDistributor(distributorId, Boolean(isVerified));
    }

    if (commissionRate !== undefined) {
      marketplaceStore.setDistributorCommission(distributorId, Number(commissionRate));
    }

    const updated = marketplaceStore.getDistributorById(distributorId);
    return NextResponse.json({ success: true, distributor: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Operation failed" }, { status: 403 });
  }
}
