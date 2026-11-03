import React from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { SalesChart } from "@/components/distributor/sales-chart";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  Percent,
  CheckCircle2,
  Layers,
  Banknote,
} from "lucide-react";

export default function DistributorDashboard() {
  const distributorId = "dist_1";
  const stats = marketplaceStore.getDistributorStats(distributorId);
  const products = marketplaceStore.getProducts({ distributorId });
  const orders = marketplaceStore.getOrders({ distributorId });

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#102C55]">Distributor Performance Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time wholesale sales, order tracking, and delivery logistics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/distributor/products/new">
            <Button variant="primary" size="sm" className="font-bold text-xs flex items-center gap-1.5 shadow-sm">
              <Plus className="w-4 h-4" />
              <span>Add New Wholesale SKU</span>
            </Button>
          </Link>
          <Link href="/distributor/orders">
            <Button variant="outline" size="sm" className="font-bold text-xs">
              Manage Orders ({stats.pendingOrders} Pending)
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Wholesale Sales"
          value={formatNPR(stats.totalSales)}
          change={{ value: 18.4, isPositive: true }}
          subtitle="vs last month"
          icon={TrendingUp}
          iconColor="blue"
        />
        <StatCard
          title="Net Earnings (After Comm.)"
          value={formatNPR(stats.netEarnings)}
          subtitle="Payout eligible"
          icon={Banknote}
          iconColor="green"
        />
        <StatCard
          title="Orders Received"
          value={stats.totalOrders}
          change={{ value: 12.1, isPositive: true }}
          subtitle="Retail orders"
          icon={ShoppingCart}
          iconColor="navy"
        />
        <StatCard
          title="Pending Fulfillment"
          value={stats.pendingOrders}
          subtitle="Awaiting dispatch"
          icon={Clock}
          iconColor="orange"
        />
      </div>

      {/* Sales Trend Chart & Top Sellers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sales Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#102C55]">Monthly Wholesale Revenue (NPR)</h2>
              <p className="text-xs text-slate-500">Gross order volumes delivered to registered retail stores</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              +28% Festive Surge
            </span>
          </div>

          <SalesChart />
        </div>

        {/* Top-Selling Products */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#102C55]">Top Wholesale SKUs</h2>
              <p className="text-xs text-slate-500">Highest volume items</p>
            </div>
            <Link href="/distributor/products" className="text-xs font-bold text-[#0759C7] hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map((prod) => (
              <div key={prod.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                <div className="flex items-center gap-2.5 truncate max-w-[180px]">
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="w-9 h-9 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-bold text-slate-800 truncate">{prod.title}</p>
                    <p className="text-[10px] text-slate-400">Stock: {prod.stockQuantity} ctns</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#0759C7] block">{formatNPR(prod.wholesalePrice)}</span>
                  <span className="text-[10px] text-slate-400">per ctn</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#102C55]">Recent Retailer Orders</h2>
            <p className="text-xs text-slate-500">Orders requiring processing, dispatch, or invoice settlement</p>
          </div>
          <Link
            href="/distributor/orders"
            className="text-xs font-bold text-[#0759C7] hover:underline flex items-center gap-1"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Retail Shop & Location</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Order Value</th>
                <th className="py-3 px-4">Platform Comm (3%)</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0759C7]">{o.orderNumber}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{o.retailerShop}</p>
                    <p className="text-[10px] text-slate-500">
                      {o.deliveryAddress.streetAddress}, {o.deliveryAddress.district}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{formatDate(o.createdAt)}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{formatNPR(o.totalAmount)}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{formatNPR(o.commissionAmount)}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    {formatNPR(o.netDistributorEarnings)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/distributor/orders/${o.id}`}>
                      <Button variant="outline" size="sm" className="text-xs h-8">
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
