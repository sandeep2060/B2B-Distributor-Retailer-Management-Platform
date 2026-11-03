import React from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Building2,
  ArrowRight,
  TrendingUp,
  FileText,
  RotateCcw,
} from "lucide-react";

export default function RetailerDashboard() {
  const userId = "usr_ret_1";
  const orders = marketplaceStore.getOrders({ retailerId: userId });
  const retailer = marketplaceStore.getRetailerByUserId(userId);

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === "PENDING" || o.status === "PROCESSING").length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#102C55] to-[#0759C7] text-white p-6 sm:p-8 rounded-2xl shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs bg-[#F58220] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
            Verified Retailer
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Welcome, {retailer?.shopName || "Kalanki Kirana Store"}!
          </h1>
          <p className="text-xs text-blue-100 mt-1">
            Proprietor: Suman Thapa • PAN/VAT: <span className="font-mono">{retailer?.panVatNumber}</span> • {retailer?.district}, {retailer?.province}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button variant="orange" size="md" className="font-bold text-xs flex items-center gap-1.5 shadow-md">
              <ShoppingCart className="w-4 h-4" />
              <span>Browse Wholesale Stock</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Wholesale Spend"
          value={formatNPR(totalSpent)}
          subtitle="Lifetime volume on B2B Deal"
          icon={TrendingUp}
          iconColor="blue"
        />
        <StatCard
          title="Total Orders"
          value={orders.length}
          subtitle="Processed & historical"
          icon={ShoppingCart}
          iconColor="navy"
        />
        <StatCard
          title="In Transit / Active"
          value={pendingOrders}
          subtitle="Awaiting delivery"
          icon={Clock}
          iconColor="orange"
        />
        <StatCard
          title="Delivered & Verified"
          value={deliveredOrders}
          subtitle="Tax invoices settled"
          icon={CheckCircle2}
          iconColor="green"
        />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#102C55]">Recent Wholesale Orders</h2>
            <p className="text-xs text-slate-500">Track shipments, dispatch drivers, and invoices</p>
          </div>
          <Link href="/retailer/orders" className="text-xs font-bold text-[#0759C7] hover:underline flex items-center gap-1">
            <span>View All ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Distributor</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Items / Cartons</th>
                <th className="py-3 px-4">Total (NPR)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0759C7]">{order.orderNumber}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{order.distributorName}</p>
                    <p className="text-[10px] text-slate-400">Payment: {order.paymentMethod}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{formatDate(order.createdAt)}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} Cartons ({order.items.length} SKUs)
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{formatNPR(order.totalAmount)}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link href={`/retailer/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        Track & Details
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
