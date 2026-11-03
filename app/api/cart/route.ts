import { NextResponse } from "next/server";
import marketplaceStore from "@/lib/db/store";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  const userId = session?.userId || "usr_ret_1"; // Default to demo retailer
  const cart = marketplaceStore.getCart(userId);
  return NextResponse.json(cart);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    const userId = session?.userId || "usr_ret_1";
    const body = await request.json();
    const { productId, quantity = 1, unitType = "CARTON" } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const updatedCart = marketplaceStore.addToCart(userId, productId, Number(quantity), unitType);
    return NextResponse.json(updatedCart);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add to cart" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    const userId = session?.userId || "usr_ret_1";
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: "Product ID and quantity required" }, { status: 400 });
    }

    const updatedCart = marketplaceStore.updateCartItem(userId, productId, Number(quantity));
    return NextResponse.json(updatedCart);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getServerSession();
  const userId = session?.userId || "usr_ret_1";
  marketplaceStore.clearCart(userId);
  return NextResponse.json({ success: true, message: "Cart cleared" });
}
