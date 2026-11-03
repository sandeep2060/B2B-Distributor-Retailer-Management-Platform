import { NextResponse } from "next/server";
import marketplaceStore from "@/lib/db/store";
import { getServerSession } from "@/lib/auth/session";
import { MockDistributorCompany } from "@/lib/db/mock-data";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    const distributorId = session?.distributorId || "dist_1";

    const companies = marketplaceStore.getDistributorCompanies(distributorId);
    return NextResponse.json({ success: true, companies });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || (session.role !== "DISTRIBUTOR" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const distributorId = session.distributorId || "dist_1";
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    const newCompany: MockDistributorCompany = {
      id: `comp_${Date.now()}`,
      distributorId,
      name: body.name.trim(),
      shortCode: body.shortCode?.trim()?.toUpperCase() || body.name.slice(0, 4).toUpperCase(),
      category: body.category?.trim() || "FMCG Goods & Packaged Products",
      agencyCode: body.agencyCode?.trim() || `DLR-${Math.floor(1000 + Math.random() * 9000)}`,
      contactPerson: body.contactPerson?.trim() || "Territory Sales Officer",
      contactPhone: body.contactPhone?.trim() || "9851000000",
      isAuthorized: true,
      createdAt: new Date().toISOString(),
    };

    marketplaceStore.createDistributorCompany(newCompany);

    return NextResponse.json({ success: true, company: newCompany }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || (session.role !== "DISTRIBUTOR" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    marketplaceStore.deleteDistributorCompany(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}
