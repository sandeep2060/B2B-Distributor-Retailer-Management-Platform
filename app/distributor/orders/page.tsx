"use client";

import React, { useState } from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Truck, CheckCircle2, Clock } from "lucide-react";

export default function DistributorOrdersPage() {
  const distributorId = "dist_1";
  const [activeTab, setActiveTab] = useState("ALL");
  const allOrders = marketplaceStore.getOrders({ distributorId });

  const tabs = [
    { id: "ALL", label: "All Orders", count: allOrders.length },
    { id: "PENDING", label: "Pending", count: allOrders.filter((o) => o.status === "PENDING").length },
    { id: "PROCESSING", label: "Processing", count: allOrders.filter((o) => o.status === "PROCESSING").length },
    { id: "DISPATCHED", label: "Dispatched", count: allOrders.filter((o) => o.status === "DISPATCHED").length },
    { id: "DELIVERED", label: "Delivered", count: allOrders.filter((o) => o.status === "DELIVERED").length },
  ];

  const filtered = activeTab === "ALL" ? allOrders : allOrders.filter((o) => o.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <h1 className="text-2xl font-black text-[#102C55]">Retailer Orders Received</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review purchase orders, dispatch wholesale cartons, assign drivers, and monitor delivery settlement
        </p>

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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Retailer Store</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Gross Total</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0759C7]">{o.orderNumber}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{o.retailerShop}</p>
                    <p className="text-[10px] text-slate-500">Contact: {o.deliveryAddress.phone}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {o.deliveryAddress.streetAddress}, {o.deliveryAddress.district}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{formatDate(o.createdAt)}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{formatNPR(o.totalAmount)}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    {formatNPR(o.netDistributorEarnings)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/distributor/orders/${o.id}`}>
                      <Button variant="primary" size="sm" className="text-xs h-8 font-bold">
                        Process Order
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
