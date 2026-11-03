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

    // Real-market trade discount calculation:
    // Spot Cash Discount (CD) applies for COD or Instant Bank/Fonepay settlement
    const isSpotCashPayment = ["CASH_ON_DELIVERY", "BANK_TRANSFER", "FONEPAY"].includes(data.paymentMethod);
    const spotCashDiscount = isSpotCashPayment ? (cart.totalCashDiscount || 0) : 0;
    const totalDiscount = spotCashDiscount;
    const finalTotalAmount = Math.max(0, cart.totalAmount - spotCashDiscount);

    // Commission calculation based on net subtotal
    const netSubtotal = cart.subtotal - totalDiscount;
    const commissionRate = dist?.commissionRate || 3.0;
    const commissionAmount = Math.round(((netSubtotal * commissionRate) / 100) * 100) / 100;
    const netDistributorEarnings = netSubtotal - commissionAmount;

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
        spotDiscountPercent: item.cashDiscountRate,
        isVatExempt: item.isVatExempt,
        freeSchemeNote: item.earnedFreeQty > 0 ? `+${item.earnedFreeQty} ${item.earnedFreeItem}` : undefined,
      }));

    const freeItemsAwarded = (cart.freeSchemeAwards || []).map((f: any) => ({
      title: f.title,
      quantity: f.quantity,
      unitType: f.unitType || "CARTON",
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
      discountAmount: totalDiscount,
      cashDiscountAmount: spotCashDiscount,
      freeItemsAwarded,
      taxCategoryBreakdown: {
        taxable: cart.taxableSubtotal || 0,
        vatExempt: cart.vatExemptSubtotal || 0,
        vatAmount: cart.taxAmount,
      },
      deliveryFee: cart.deliveryFee,
      taxAmount: cart.taxAmount,
      totalAmount: finalTotalAmount,
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
