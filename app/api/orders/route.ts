import { NextResponse } from "next/server";
import marketplaceStore from "@/lib/db/store";
import { getServerSession } from "@/lib/auth/session";
import { checkoutSchema } from "@/lib/validations/order";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = await getServerSession();

  const role = session?.role || "RETAILER";
  const userId = session?.userId || "usr_ret_1";
  const distributorId = session?.distributorId;

  let orders = [];
  if (role === "SUPER_ADMIN") {
    orders = marketplaceStore.getOrders();
  } else if (role === "DISTRIBUTOR" && distributorId) {
    orders = marketplaceStore.getOrders({ distributorId });
  } else {
    orders = marketplaceStore.getOrders({ retailerId: userId });
  }

  const statusFilter = searchParams.get("status");
  if (statusFilter && statusFilter !== "ALL") {
    orders = orders.filter((o) => o.status === statusFilter);
  }

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    const userId = session?.userId || "usr_ret_1";
    const body = await request.json();

    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation error", errors: parsed.error.format() }, { status: 400 });
    }

    const cart = marketplaceStore.getCart(userId);
    if (cart.items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
    }

    // Group items by distributor (B2B orders are dispatched per distributor)
    const primaryDistributorId = cart.items[0]?.product.distributorId || "dist_1";
    const dist = marketplaceStore.getDistributorById(primaryDistributorId);
    const retailer = marketplaceStore.getRetailerByUserId(userId);
    const user = marketplaceStore.getUserById(userId);

    const data = parsed.data;

    // Check minimum order amount
    if (dist && cart.subtotal < dist.minOrderAmount) {
      return NextResponse.json(
        {
          error: `Minimum order amount for ${dist.companyName} is Rs. ${dist.minOrderAmount}. Current subtotal is Rs. ${cart.subtotal}`,
        },
        { status: 400 }
      );
    }

    // Commission calculation
    const commissionRate = dist?.commissionRate || 3.0;
    const commissionAmount = Math.round(((cart.subtotal * commissionRate) / 100) * 100) / 100;
    const netDistributorEarnings = cart.subtotal - commissionAmount;

    const orderItems = cart.items
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .map((item) => ({
        id: `oi_${Date.now()}_${Math.random()}`,
        productId: item.productId,
        productTitle: item.product.title,
        productSku: item.product.sku,
        unitType: item.unitType,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      }));

    const newOrder = marketplaceStore.createOrder({
      retailerId: userId,
      retailerName: user?.fullName || data.recipientName,
      retailerShop: retailer?.shopName || `${data.recipientName}'s Store`,
      retailerPhone: data.phone,
      distributorId: primaryDistributorId,
      distributorName: dist?.companyName || "Himalayan FMCG Distributors Pvt. Ltd.",
      status: "PENDING",
      paymentStatus: data.paymentMethod === "BANK_TRANSFER" ? "PAID" : "PENDING",
      paymentMethod: data.paymentMethod as any,
      subtotal: cart.subtotal,
      discountAmount: 0,
      deliveryFee: cart.deliveryFee,
      taxAmount: cart.taxAmount,
      totalAmount: cart.totalAmount,
      commissionRate,
      commissionAmount,
      netDistributorEarnings,
      deliveryAddress: {
        recipientName: data.recipientName,
        phone: data.phone,
        province: data.province,
        district: data.district,
        municipality: data.municipality,
        ward: data.ward,
        streetAddress: data.streetAddress,
        landmark: data.landmark,
      },
      notes: data.specialInstructions,
      items: orderItems,
    });

    // Clear cart after checkout
    marketplaceStore.clearCart(userId);

    return NextResponse.json({
      success: true,
      order: newOrder,
      orderNumber: newOrder.orderNumber,
      orderId: newOrder.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Order placement failed" }, { status: 500 });
  }
}
