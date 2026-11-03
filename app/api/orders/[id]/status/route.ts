import { NextResponse } from "next/server";
import marketplaceStore from "@/lib/db/store";
import { requireAuth } from "@/lib/auth/session";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth(["SUPER_ADMIN", "DISTRIBUTOR"]);
    const body = await request.json();
    const { action, itemId, cancelReason, selectedItemIds, deliveryDate, timeSlot, deliveryPerson, status } = body;

    const orderId = params.id;
    const order = marketplaceStore.getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Authorization check: Distributor can only update orders assigned to them
    if (session.role === "DISTRIBUTOR" && session.distributorId && order.distributorId !== session.distributorId) {
      return NextResponse.json({ error: "You are not authorized to update this order" }, { status: 403 });
    }

    // 1. Cancel individual item with reason
    if (action === "CANCEL_ITEM") {
      if (!itemId) {
        return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
      }
      const updated = marketplaceStore.cancelOrderItem(order.id, itemId, cancelReason || "Stock Unavailable");
      return NextResponse.json({ success: true, order: updated });
    }

    // 2. Undo cancellation of an item
    if (action === "UNCANCEL_ITEM") {
      if (!itemId) {
        return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
      }
      const updated = marketplaceStore.uncancelOrderItem(order.id, itemId);
      return NextResponse.json({ success: true, order: updated });
    }

    // 3. Set invoice for selected items & send confirmation notice
    if (action === "SET_INVOICE") {
      if (!selectedItemIds || !Array.isArray(selectedItemIds) || selectedItemIds.length === 0) {
        return NextResponse.json({ error: "At least one item must be selected for invoicing" }, { status: 400 });
      }
      const result = marketplaceStore.setOrderInvoice(order.id, selectedItemIds);
      return NextResponse.json({ success: true, ...result });
    }

    // 4. Schedule delivery date & assign delivery personnel
    if (action === "SCHEDULE_DELIVERY" || deliveryDate) {
      const updated = marketplaceStore.scheduleOrderDelivery(
        order.id,
        deliveryDate,
        timeSlot,
        deliveryPerson
      );
      return NextResponse.json({ success: true, order: updated });
    }

    // 5. Direct driver assignment
    if (deliveryPerson && deliveryPerson.name && deliveryPerson.phone) {
      const updated = marketplaceStore.assignDeliveryPersonnel(order.id, deliveryPerson);
      return NextResponse.json({ success: true, order: updated });
    }

    // 6. Direct status transition
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
