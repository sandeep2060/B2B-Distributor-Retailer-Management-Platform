"use client";

import React from "react";
import marketplaceStore from "@/lib/db/store";
import { formatNPR } from "@/lib/utils/formatters";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, BarChart3, TrendingUp, CheckCircle2 } from "lucide-react";

export default function AdminReportsPage() {
  const stats = marketplaceStore.getPlatformStats();
  const orders = marketplaceStore.getOrders();
  const distributors = marketplaceStore.getDistributors();

  const exportOrdersCsv = () => {
    let csv = "OrderNumber,Retailer,Distributor,Status,Date,GrossTotal,CommissionRate,CommissionFee,NetPayout\n";
    orders.forEach((o) => {
      csv += `${o.orderNumber},"${o.retailerShop}","${o.distributorName}",${o.status},${o.createdAt},${o.totalAmount},${o.commissionRate}%,${o.commissionAmount},${o.netDistributorEarnings}\n`;
    });

    const encoded = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `b2b_deal_master_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDistributorCommissionCsv = () => {
    let csv = "DistributorName,PAN_VAT,District,CommissionRate,Rating,MinOrder\n";
    distributors.forEach((d) => {
      csv += `"${d.companyName}",${d.panVatNumber},"${d.district}",${d.commissionRate}%,${d.rating},${d.minOrderAmount}\n`;
    });

    const encoded = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `b2b_deal_distributor_commissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <h1 className="text-2xl font-black text-[#102C55]">Reports & Analytics Export</h1>
        <p className="text-xs text-slate-500 mt-1">
          Generate and export official wholesale CSV reports for tax audits, Inland Revenue Department (IRD) filing,
          and management reviews
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders Report */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#0759C7]" />
                Platform Master Orders Ledger
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">{orders.length} Records</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <p className="text-slate-600">
              Complete transaction log with buyer details, seller distributor, VAT calculations, gross amounts, and
              delivery statuses.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={exportOrdersCsv}
              className="w-full font-bold flex items-center justify-center gap-2 h-10"
            >
              <Download className="w-4 h-4" />
              <span>Download Master Orders CSV</span>
            </Button>
          </CardContent>
        </Card>

        {/* Distributor Performance & Commission Report */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Distributor Settlement & Commission Statement
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">{distributors.length} Hubs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <p className="text-slate-600">
              Distributor legal PAN/VAT records, delivery zones, contracted commission percentages, and minimum order
              thresholds.
            </p>
            <Button
              variant="orange"
              size="sm"
              onClick={exportDistributorCommissionCsv}
              className="w-full font-bold flex items-center justify-center gap-2 h-10"
            >
              <Download className="w-4 h-4" />
              <span>Download Distributor Statement CSV</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
