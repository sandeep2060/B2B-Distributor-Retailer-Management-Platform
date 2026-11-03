import React from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { SalesChart } from "@/components/distributor/sales-chart";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  ShoppingCart,
  Building2,
  Store,
  Percent,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

export default function AdminDashboardPage() {
  const stats = marketplaceStore.getPlatformStats();
  const distributors = marketplaceStore.getDistributors();
  const orders = marketplaceStore.getOrders();

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#102C55]">Platform Master Control</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time analytics across all wholesale distributors, retail stores, and GMV in Nepal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/distributors">
            <Button variant="primary" size="sm" className="font-bold text-xs">
              Manage Distributors ({distributors.length})
            </Button>
          </Link>
          <Link href="/admin/reports">
            <Button variant="outline" size="sm" className="font-bold text-xs">
              Download Audit Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Platform GMV"
          value={formatNPR(stats.totalRevenue)}
          change={{ value: 24.5, isPositive: true }}
          subtitle="Gross merchandise value"
          icon={TrendingUp}
          iconColor="blue"
        />
        <StatCard
          title="Platform Commission"
          value={formatNPR(stats.totalCommission)}
          subtitle="B2B Deal 3% fee earned"
          icon={Percent}
          iconColor="orange"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change={{ value: 16.2, isPositive: true }}
          subtitle="Wholesale orders"
          icon={ShoppingCart}
          iconColor="navy"
        />
        <StatCard
          title="Distributor Hubs"
          value={stats.totalDistributors}
          subtitle="Active FMCG suppliers"
          icon={Building2}
          iconColor="green"
        />
        <StatCard
          title="Registered Retailers"
          value={stats.totalRetailers}
          subtitle="Kirana & supermarkets"
          icon={Store}
          iconColor="purple"
        />
      </div>

      {/* Charts & Top Distributors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sales Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#102C55]">Nepal GMV & Growth Trend (NPR)</h2>
              <p className="text-xs text-slate-500">Platform-wide order turnover across all 7 provinces</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Monthly Surge +24.5%
            </span>
          </div>

          <SalesChart />
        </div>

        {/* Top-Performing Distributors */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#102C55]">Top Distributors</h2>
              <p className="text-xs text-slate-500">By rating & volume</p>
            </div>
            <Link href="/admin/distributors" className="text-xs font-bold text-[#0759C7] hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {distributors.map((d) => (
              <div key={d.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-start justify-between">
                  <div className="font-bold text-slate-900 truncate max-w-[170px]">{d.companyName}</div>
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {d.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>{d.district}, Nepal</span>
                  <span className="font-bold text-[#0759C7]">Comm: {d.commissionRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Master Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#102C55]">Master Platform Transactions</h2>
            <p className="text-xs text-slate-500">Orders flowing between retailers and distributors</p>
          </div>
          <Link href="/admin/orders" className="text-xs font-bold text-[#0759C7] hover:underline flex items-center gap-1">
            <span>All Master Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Retailer (Buyer)</th>
                <th className="py-3 px-4">Distributor (Seller)</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Gross Total</th>
                <th className="py-3 px-4">Platform Fee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0759C7]">{o.orderNumber}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{o.retailerShop}</p>
                    <p className="text-[10px] text-slate-500">{o.deliveryAddress.district}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{o.distributorName}</td>
                  <td className="py-3.5 px-4 text-slate-500">{formatDate(o.createdAt)}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{formatNPR(o.totalAmount)}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    +{formatNPR(o.commissionAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/retailer/invoices/${o.id}`}>
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        View IRD Tax
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
