"use client";

import React, { useState } from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Package, Truck, ArrowRight, FileText, RotateCcw, Clock } from "lucide-react";

export default function RetailerOrdersPage() {
  const userId = "usr_ret_1";
  const [activeTab, setActiveTab] = useState("ALL");
  const allOrders = marketplaceStore.getOrders({ retailerId: userId });

  const tabs = [
    { id: "ALL", label: "All Orders", count: allOrders.length },
    { id: "PENDING", label: "Pending", count: allOrders.filter((o) => o.status === "PENDING").length },
    { id: "PROCESSING", label: "Processing", count: allOrders.filter((o) => o.status === "PROCESSING").length },
    { id: "DISPATCHED", label: "Dispatched", count: allOrders.filter((o) => o.status === "DISPATCHED").length },
    { id: "DELIVERED", label: "Delivered", count: allOrders.filter((o) => o.status === "DELIVERED").length },
  ];

  const filteredOrders =
    activeTab === "ALL" ? allOrders : allOrders.filter((o) => o.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <h1 className="text-2xl font-black text-[#102C55]">My Wholesale Orders</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track active shipments, view delivery drivers, and download 13% VAT tax invoices
        </p>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-100 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-[#0759C7] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-white text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-soft space-y-3">
          <Package className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-[#102C55]">No orders found</h3>
          <p className="text-xs text-slate-500">There are no orders matching the selected status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft hover:shadow-card transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Order Info */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#0759C7]">{order.orderNumber}</span>
                  <StatusBadge status={order.status} />
                  <span className="text-xs text-slate-400">• Placed on {formatDate(order.createdAt)}</span>
                </div>

                <div className="text-xs text-slate-600 space-y-0.5">
                  <p className="font-semibold text-slate-800">Distributor: {order.distributorName}</p>
                  <p>
                    Delivery to: {order.deliveryAddress.streetAddress}, {order.deliveryAddress.district}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {order.items.length} items ({order.items.reduce((s, i) => s + i.quantity, 0)} Cartons) • Payment:{" "}
                    {order.paymentMethod} ({order.paymentStatus})
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex sm:items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="md:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Order Total</span>
                  <span className="text-lg font-black font-mono text-[#102C55]">
                    {formatNPR(order.totalAmount)}
                  </span>
                  <span className="text-[10px] text-emerald-700 block font-medium">13% VAT Included</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/retailer/orders/${order.id}`}>
                    <Button variant="primary" size="sm" className="font-bold text-xs h-9">
                      <span>View Details & Timeline</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>

                  <Link href={`/retailer/invoices/${order.id}`}>
                    <Button variant="outline" size="sm" className="h-9 px-2 text-slate-600 hover:text-[#0759C7]" title="Tax Invoice">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
