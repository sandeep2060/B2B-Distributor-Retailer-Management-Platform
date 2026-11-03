import { NextResponse } from "next/server";
import marketplaceStore from "@/lib/db/store";
import { requireAuth } from "@/lib/auth/session";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(["SUPER_ADMIN", "DISTRIBUTOR"]);
    const body = await request.json();
    const { status, deliveryPerson } = body;

    const orderId = params.id;
    const order = marketplaceStore.getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Authorization check: Distributor can only update orders assigned to them
    if (session.role === "DISTRIBUTOR" && session.distributorId && order.distributorId !== session.distributorId) {
      return NextResponse.json({ error: "You are not authorized to update this order" }, { status: 403 });
    }

    if (deliveryPerson && deliveryPerson.name && deliveryPerson.phone) {
      const updated = marketplaceStore.assignDeliveryPersonnel(order.id, deliveryPerson);
      return NextResponse.json({ success: true, order: updated });
    }

    if (status) {
      const updated = marketplaceStore.updateOrderStatus(order.id, status);
      return NextResponse.json({ success: true, order: updated });
    }

    return NextResponse.json({ error: "No update parameters provided" }, { status: 400 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}
