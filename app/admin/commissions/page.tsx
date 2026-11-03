"use client";

import React, { useState } from "react";
import marketplaceStore from "@/lib/db/store";
import { formatNPR } from "@/lib/utils/formatters";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Percent, Banknote, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AdminCommissionsPage() {
  const [defaultRate, setDefaultRate] = useState(3.0);
  const [saved, setSaved] = useState(false);
  const distributors = marketplaceStore.getDistributors();
  const stats = marketplaceStore.getPlatformStats();

  const handleSaveDefaults = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <h1 className="text-2xl font-black text-[#102C55]">Platform Commission & Revenue Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure system-wide B2B marketplace fees and distributor-specific commission rates
          </p>
        </div>

        <div className="text-xs font-bold text-slate-700 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Total Commission Earned: {formatNPR(stats.totalCommission)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Global Commission Rule */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#0759C7]" />
              Default Platform Fee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <form onSubmit={handleSaveDefaults} className="space-y-3">
              <Input
                label="Default Platform Commission (%)"
                type="number"
                step="0.1"
                value={defaultRate}
                onChange={(e) => setDefaultRate(parseFloat(e.target.value) || 0)}
                required
              />
              <p className="text-[11px] text-slate-500">
                Applied automatically to newly approved FMCG wholesale distributors unless overridden.
              </p>

              <Button type="submit" variant="primary" size="sm" className="w-full font-bold">
                {saved ? "Saved Successfully!" : "Save Commission Policy"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Distributor Overrides */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-600" />
              Active Distributor Commission Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-100 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-4">Distributor Hub</th>
                  <th className="py-2.5 px-4">PAN / VAT</th>
                  <th className="py-2.5 px-4 text-center">Contracted Rate</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {distributors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-800">{d.companyName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{d.panVatNumber}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#0759C7]">
                      {d.commissionRate}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
