import React from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function AdminOrdersPage() {
  const orders = marketplaceStore.getOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <h1 className="text-2xl font-black text-[#102C55]">Master Platform Wholesale Orders</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete transaction history across all retail businesses and distributor hubs in Nepal
          </p>
        </div>

        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          Total Master Orders: <span className="text-[#0759C7] font-mono">{orders.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Retailer Shop</th>
                <th className="py-3 px-4">Distributor</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Gross Total</th>
                <th className="py-3 px-4">Platform Fee (3%)</th>
                <th className="py-3 px-4">Net Distributor</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Tax Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0759C7]">{o.orderNumber}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{o.retailerShop}</p>
                    <p className="text-[10px] text-slate-400">{o.deliveryAddress.district}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{o.distributorName}</td>
                  <td className="py-3.5 px-4 text-slate-500">{formatDate(o.createdAt)}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{formatNPR(o.totalAmount)}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    +{formatNPR(o.commissionAmount)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{formatNPR(o.netDistributorEarnings)}</td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/retailer/invoices/${o.id}`}>
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        IRD Invoice
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
