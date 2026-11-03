"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatNPR } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Gift,
  Tag,
  Zap,
  Sparkles,
  Info,
} from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      setCart(data);
    } catch (e) {
      console.error(e);
    }
  };

  const removeItem = async (productId: string) => {
    await updateQuantity(productId, 0);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="animate-spin w-8 h-8 border-4 border-[#0759C7] border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-slate-500">Loading your wholesale cart & qualifying schemes...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0759C7] flex items-center justify-center mx-auto">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#102C55]">Your Wholesale Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore products from authorized distributors and add cartons to your cart to enjoy wholesale volume rates, free schemes, and cash discounts.
        </p>
        <Link href="/products">
          <Button variant="primary" size="md" className="font-bold">
            Explore Wholesale Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-[#102C55]">Wholesale Shopping Cart</h1>
          <p className="text-xs text-slate-500">
            {cart.items.length} Product line items • {cart.itemCount} Total Cartons
            {cart.totalFreeUnits > 0 && (
              <span className="ml-2 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                +{cart.totalFreeUnits} Free Scheme Cartons
              </span>
            )}
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold text-[#0759C7] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Continue Wholesale Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft divide-y divide-slate-100">
            {cart.items.map((item: any) => {
              const product = item.product;
              const hasFreeScheme = Boolean(product.hasFreeScheme && product.freeSchemeMinQty);
              const qualifiesForFree = item.earnedFreeQty > 0;
              const missingForFree = hasFreeScheme && !qualifiesForFree ? (product.freeSchemeMinQty - item.quantity) : 0;

              return (
                <div key={item.productId} className="p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={product.images[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200"}
                        alt={product.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#0759C7] uppercase">{product.brandName}</span>
                          {product.festivalTag && (
                            <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded">
                              {product.festivalTag}
                            </span>
                          )}
                          {item.isVatExempt ? (
                            <span className="text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                              0% VAT-Exempt
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              13% VAT
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-xs sm:text-sm text-[#102C55] line-clamp-1">{product.title}</h3>
                        <p className="text-[11px] text-slate-500">
                          {product.packSize || `${product.unitsPerCarton} Pcs/Carton`} • {product.distributorName}
                        </p>
                        
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-mono font-bold text-slate-800">
                            Wholesale: {formatNPR(item.unitPrice)} / ctn
                          </span>
                          {item.appliedTierDiscount > 0 && (
                            <span className="text-[10px] font-mono text-emerald-600 font-bold">
                              (-{formatNPR(item.appliedTierDiscount)}/ctn Tier Discount)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Total */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden h-9 bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2.5 text-slate-600 hover:bg-slate-200 h-full font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-xs font-bold font-mono text-[#102C55]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2.5 text-slate-600 hover:bg-slate-200 h-full font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Total Price */}
                      <div className="text-right min-w-[100px]">
                        <span className="text-sm sm:text-base font-black font-mono text-[#0759C7]">
                          {formatNPR(item.totalPrice)}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {item.isVatExempt ? "Exempted amount" : "Taxable amount"}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Real-Market Scheme Badges & Incentives Bar */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
                    {/* Free Scheme Qualification */}
                    {qualifiesForFree ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 font-bold">
                        <Gift className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Scheme Awarded: +{item.earnedFreeQty} {item.earnedFreeItem} Free!</span>
                      </span>
                    ) : hasFreeScheme && missingForFree > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-medium border border-blue-200">
                        <Info className="w-3.5 h-3.5 text-[#0759C7]" />
                        <span>Add {missingForFree} more carton(s) to get <strong>+{product.freeItemQty || 1} Free Carton</strong></span>
                      </span>
                    ) : null}

                    {/* Unselling Bonus Item Qualification */}
                    {item.earnedUnsellingQty > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-100 text-purple-900 font-bold border border-purple-200">
                        <span>📦 Clearance Freebie: +{item.earnedUnsellingQty} {item.earnedUnsellingItem} Free!</span>
                      </span>
                    )}

                    {/* Spot Cash Discount Preview */}
                    {item.cashDiscountRate > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-amber-200">
                        <Zap className="w-3 h-3 text-amber-600" />
                        <span>{item.cashDiscountRate}% Spot CD ({formatNPR(item.cashDiscountAmount)} instant off on COD/QR)</span>
                      </span>
                    )}

                    {/* Promotional Gift Merch */}
                    {item.promotionalGift && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-medium border border-purple-200">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span>Gift Included: {item.promotionalGift}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery & Assurance Info */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-slate-700">
            <Truck className="w-5 h-5 text-[#0759C7] flex-shrink-0" />
            <span>
              Orders above <strong className="font-mono">Rs. 5,000</strong> receive <strong>FREE delivery</strong> in
              Kathmandu Valley & major hubs. Current delivery fee:{" "}
              <strong className="font-mono">{cart.deliveryFee === 0 ? "FREE" : formatNPR(cart.deliveryFee)}</strong>.
            </span>
          </div>

          {/* Trade Scheme Summary Callout */}
          {cart.freeSchemeAwards && cart.freeSchemeAwards.length > 0 && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <Gift className="w-4 h-4 text-emerald-700" />
                <span>Earned Wholesale Trade Schemes & Free Goods in this Order:</span>
              </div>
              <ul className="space-y-1.5 pl-1 text-[11px] font-medium text-emerald-800">
                {cart.freeSchemeAwards.map((scheme: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="font-bold text-emerald-900 bg-emerald-200/80 px-1.5 py-0.5 rounded text-[10px]">
                      +{scheme.quantity} FREE
                    </span>
                    <span>
                      <strong>{scheme.title}</strong> {scheme.isUnsellingBonus ? `[${scheme.tag || "Clearance Gift"}]` : ""} (from {scheme.sourceProduct})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-5">
          <h3 className="font-bold text-base text-[#102C55] pb-3 border-b border-slate-100">
            Wholesale Order Summary
          </h3>

          <div className="space-y-2.5 text-xs">
            {cart.taxableSubtotal > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Taxable Goods Subtotal:</span>
                <span className="font-mono font-bold text-slate-900">{formatNPR(cart.taxableSubtotal)}</span>
              </div>
            )}

            {cart.vatExemptSubtotal > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>VAT-Exempt Goods Subtotal:</span>
                <span className="font-mono font-bold text-slate-900">{formatNPR(cart.vatExemptSubtotal)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>VAT (13% IRD Standard):</span>
              <span className="font-mono font-bold text-slate-900">{formatNPR(cart.taxAmount)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Distributor Delivery Charge:</span>
              <span className="font-mono font-bold text-slate-900">
                {cart.deliveryFee === 0 ? <span className="text-emerald-700">FREE</span> : formatNPR(cart.deliveryFee)}
              </span>
            </div>

            {/* Spot Cash Discount Preview */}
            {cart.totalCashDiscount > 0 && (
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    Spot Cash Discount (CD):
                  </span>
                  <span className="font-mono text-amber-800">Save {formatNPR(cart.totalCashDiscount)}</span>
                </div>
                <p className="text-[10px] text-amber-700">
                  Select Cash on Delivery or Instant Fonepay/QR at checkout to deduct this discount directly on your invoice!
                </p>
              </div>
            )}

            <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-baseline">
              <span className="text-sm font-black text-[#102C55]">Estimated Total:</span>
              <span className="text-xl font-black text-[#0759C7] font-mono">{formatNPR(cart.totalAmount)}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Link href="/retailer/checkout">
              <Button variant="orange" size="lg" className="w-full font-bold text-sm h-12 flex items-center justify-center gap-2 shadow-md">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <p className="text-[10px] text-center text-slate-400">
              Cash on Delivery, Bank Transfer & Fonepay QR supported
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
