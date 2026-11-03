import { NextResponse } from "next/server";
import marketplaceStore from "@/lib/db/store";
import { requireAuth } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const session = await requireAuth(["SUPER_ADMIN", "DISTRIBUTOR"]);
    const body = await request.json();
    const { orderIds, deliveryDate, deliveryPerson, timeSlot } = body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "orderIds array is required" }, { status: 400 });
    }

    if (!deliveryDate) {
      return NextResponse.json({ error: "Delivery date is required" }, { status: 400 });
    }

    if (!deliveryPerson || !deliveryPerson.name || !deliveryPerson.phone) {
      return NextResponse.json({ error: "Driver name and phone are required" }, { status: 400 });
    }

    const updatedOrders = marketplaceStore.bulkDispatchOrders(
      orderIds,
      deliveryDate,
      deliveryPerson,
      timeSlot
    );

    return NextResponse.json({
      success: true,
      count: updatedOrders.length,
      orders: updatedOrders,
      message: `${updatedOrders.length} wholesale orders dispatched successfully.`,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || "Failed to bulk dispatch" }, { status: 500 });
  }
}
