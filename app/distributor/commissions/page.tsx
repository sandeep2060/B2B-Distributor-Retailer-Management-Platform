import React from "react";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Percent, Banknote, TrendingUp, CheckCircle2, ShieldCheck } from "lucide-react";

export default function DistributorCommissionsPage() {
  const distributorId = "dist_1";
  const dist = marketplaceStore.getDistributorById(distributorId);
  const stats = marketplaceStore.getDistributorStats(distributorId);
  const orders = marketplaceStore.getOrders({ distributorId });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <h1 className="text-2xl font-black text-[#102C55]">Commission & Payout Ledger</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review transparent B2B Deal marketplace commission deductions and net distributor earnings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">Contracted Commission Rate</span>
            <p className="text-3xl font-black text-[#0759C7] font-mono">{dist?.commissionRate || 3.0}%</p>
            <p className="text-[11px] text-slate-500">Tier-1 Verified FMCG Distributor Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">Total Platform Deductions</span>
            <p className="text-3xl font-black text-slate-900 font-mono">{formatNPR(stats.totalCommission)}</p>
            <p className="text-[11px] text-slate-500">Calculated on delivered gross volume</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">Net Payouts Settled</span>
            <p className="text-3xl font-black text-emerald-700 font-mono">{formatNPR(stats.netEarnings)}</p>
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Direct Bank Transfer Settled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Commission Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-[#102C55]">Order Settlement Statements</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Retailer</th>
                <th className="py-3 px-4">Gross Order Total</th>
                <th className="py-3 px-4">Commission %</th>
                <th className="py-3 px-4">Platform Fee (NPR)</th>
                <th className="py-3 px-4 text-right">Net Payout (NPR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0759C7]">{o.orderNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{o.retailerShop}</td>
                  <td className="py-3.5 px-4 font-mono">{formatNPR(o.totalAmount)}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{o.commissionRate}%</td>
                  <td className="py-3.5 px-4 font-mono text-red-600">-{formatNPR(o.commissionAmount)}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-700">
                    {formatNPR(o.netDistributorEarnings)}
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
