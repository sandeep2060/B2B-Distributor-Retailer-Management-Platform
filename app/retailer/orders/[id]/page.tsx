"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { OrderTimeline } from "@/components/retailer/order-timeline";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  RotateCcw,
  Building2,
  MapPin,
  Phone,
  Truck,
  CreditCard,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const order = marketplaceStore.getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const [reordering, setReordering] = useState(false);

  const handleReorder = async () => {
    setReordering(true);
    try {
      for (const item of order.items) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
            unitType: item.unitType,
          }),
        });
      }
      router.push("/retailer/cart");
    } catch (e) {
      console.error(e);
      setReordering(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div className="space-y-1">
          <Link
            href="/retailer/orders"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#0759C7] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to All Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-[#102C55] font-mono">{order.orderNumber}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-500">Order Placed on {formatDate(order.createdAt)}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/retailer/invoices/${order.id}`}>
            <Button variant="outline" size="sm" className="font-bold text-xs h-10 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#0759C7]" />
              <span>View IRD Tax Invoice</span>
            </Button>
          </Link>

          <Button
            variant="orange"
            size="sm"
            onClick={handleReorder}
            isLoading={reordering}
            className="font-bold text-xs h-10 flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reorder Cartons</span>
          </Button>
        </div>
      </div>

      {/* Confirmation and Invoicing Notice from Distributor */}
      {order.confirmationNotice && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Check className="w-4 h-4 text-emerald-700" />
              Notice: Order Confirmed & Tax Invoice Generated (अर्डर स्वीकृत भयो र इनभ्वाइस तयार भयो)
            </span>
            <span className="text-[11px] font-mono text-emerald-800 font-semibold">
              {formatDate(order.confirmationNotice.sentAt)}
            </span>
          </div>
          <p className="text-xs text-emerald-950 font-medium leading-relaxed">
            "{order.confirmationNotice.message}"
          </p>
          <div className="text-[11px] text-emerald-800 flex items-center gap-2 pt-1">
            <span>Invoice Ref: <strong className="font-mono">{order.invoiceNumber}</strong></span>
            <span>•</span>
            <Link href={`/retailer/invoices/${order.id}`} className="underline font-bold text-emerald-900 hover:text-emerald-700">
              Download / Print Official IRD Tax Invoice →
            </Link>
          </div>
        </div>
      )}

      {/* Interactive Order Timeline Component */}
      <OrderTimeline order={order} />

      {/* Order Info & Address Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Address */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#102C55] uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-[#0759C7]" />
            <span>Shop Delivery Destination</span>
          </div>
          <div className="text-xs text-slate-700 space-y-1">
            <p className="font-bold text-sm text-slate-900">{order.retailerShop}</p>
            <p className="text-slate-600">Contact Person: {order.deliveryAddress.recipientName}</p>
            <p className="text-slate-600">
              {order.deliveryAddress.streetAddress}, Ward {order.deliveryAddress.ward}
            </p>
            <p className="text-slate-600">
              {order.deliveryAddress.municipality}, {order.deliveryAddress.district}, {order.deliveryAddress.province}
            </p>
            <p className="text-slate-600 font-mono">Mobile: {order.deliveryAddress.phone}</p>
            {order.deliveryAddress.landmark && (
              <p className="text-slate-500 text-[11px]">Landmark: {order.deliveryAddress.landmark}</p>
            )}
          </div>
        </div>

        {/* Distributor & Payment Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#102C55] uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-[#0759C7]" />
            <span>Wholesale Distributor & Payment</span>
          </div>
          <div className="text-xs text-slate-700 space-y-1">
            <p className="font-bold text-sm text-slate-900">{order.distributorName}</p>
            <p className="text-slate-600">Payment Channel: <span className="font-bold">{order.paymentMethod}</span></p>
            <p className="text-slate-600">Payment Status: <span className="font-bold">{order.paymentStatus}</span></p>
            {order.notes && (
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 mt-2">
                <span className="font-bold block text-slate-800">Special Instructions:</span>
                {order.notes}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-sm text-[#102C55]">Ordered Wholesale Line Items</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4 text-center">Packaging</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-right">Wholesale Rate</th>
                <th className="py-3 px-4 text-right">Taxable Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item) => {
                const isCancelled = item.isCancelled;
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isCancelled ? "bg-rose-50/40 text-slate-400" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <p
                        className={`font-bold ${
                          isCancelled ? "line-through text-slate-400" : "text-slate-900"
                        }`}
                      >
                        {item.productTitle}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400 font-mono">SKU: {item.productSku}</span>

                        {isCancelled && (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                            ✕ Item Cancelled: {item.cancelReason || "Stock Unavailable"}
                          </span>
                        )}

                        {!isCancelled && item.isInvoiced && (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                            ✓ Invoiced
                          </span>
                        )}

                        {item.isVatExempt ? (
                          <span className="text-[9px] font-bold bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                            0% VAT-Exempt
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                            13% VAT
                          </span>
                        )}

                        {item.freeSchemeNote && (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                            {item.freeSchemeNote}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-slate-600">{item.unitType}</td>
                    <td className="py-3.5 px-4 text-center font-bold font-mono">
                      <span className={isCancelled ? "line-through text-slate-400" : "text-slate-900"}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      <span className={isCancelled ? "line-through text-slate-400" : "text-slate-700"}>
                        {formatNPR(item.unitPrice)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={isCancelled ? "line-through text-slate-400" : "text-slate-900"}>
                        {isCancelled ? "Rs. 0.00" : formatNPR(item.totalPrice)}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {order.freeItemsAwarded && order.freeItemsAwarded.length > 0 && (
                order.freeItemsAwarded.map((freeItem, fIdx) => (
                  <tr key={`free_${fIdx}`} className="bg-emerald-50/60 text-emerald-900">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-emerald-900">{freeItem.title}</p>
                      <p className="text-[10px] text-emerald-700">Trade Scheme Bonus / Free Wholesale Promotion</p>
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-emerald-800">{freeItem.unitType}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-900 font-mono">{freeItem.quantity}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-700">Rs. 0.00</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-800">Rs. 0.00 (FREE)</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="p-5 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start gap-4 text-xs">
          <div className="space-y-1 text-slate-500 max-w-sm">
            <p className="font-bold text-slate-700">Official IRD Compliant Billing</p>
            <p>
              Inland Revenue Department of Nepal tax standards applied. Taxable goods carry 13% VAT; agricultural / staple products are exempt under Schedule 1.
            </p>
          </div>

          <div className="w-full sm:w-72 space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-slate-800">{formatNPR(order.subtotal)}</span>
            </div>

            {order.taxCategoryBreakdown && order.taxCategoryBreakdown.vatExempt > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>VAT-Exempt Goods:</span>
                <span className="font-mono font-bold text-slate-800">{formatNPR(order.taxCategoryBreakdown.vatExempt)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>VAT (13% Standard):</span>
              <span className="font-mono font-bold text-slate-800">{formatNPR(order.taxAmount)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee:</span>
              <span className="font-mono font-bold text-slate-800">
                {order.deliveryFee === 0 ? "FREE" : formatNPR(order.deliveryFee)}
              </span>
            </div>

            {Boolean(order.cashDiscountAmount && order.cashDiscountAmount > 0) && (
              <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-1 rounded">
                <span>Spot Cash Discount (CD):</span>
                <span className="font-mono">-{formatNPR(order.cashDiscountAmount)}</span>
              </div>
            )}

            <div className="pt-2 border-t-2 border-slate-900 flex justify-between text-sm font-black text-[#102C55]">
              <span>Grand Total:</span>
              <span className="font-mono text-base text-[#0759C7]">{formatNPR(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
