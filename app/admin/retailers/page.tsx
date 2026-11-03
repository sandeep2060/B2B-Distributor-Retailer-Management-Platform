"use client";

import React, { useState } from "react";
import marketplaceStore from "@/lib/db/store";
import { Button } from "@/components/ui/button";
import { Store, ShieldCheck, MapPin } from "lucide-react";

export default function AdminRetailersPage() {
  const [retailers, setRetailers] = useState(marketplaceStore.getRetailers());

  const handleToggleVerification = (id: string, current: boolean) => {
    marketplaceStore.verifyRetailer(id, !current);
    setRetailers([...marketplaceStore.getRetailers()]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <h1 className="text-2xl font-black text-[#102C55]">Registered Retail Stores</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit store proprietor records, verify shop PAN/VAT numbers, and manage retailer permissions
          </p>
        </div>

        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          Total Retail Stores: <span className="text-[#0759C7] font-mono">{retailers.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Retail Store Name</th>
                <th className="py-3 px-4">Business Type</th>
                <th className="py-3 px-4">Store PAN/VAT</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {retailers.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{r.shopName}</td>
                  <td className="py-3.5 px-4 text-slate-600">{r.businessType}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0759C7]">
                    {r.panVatNumber || "Unregistered"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {r.streetAddress}, {r.district}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {r.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant={r.isVerified ? "outline" : "primary"}
                      size="sm"
                      onClick={() => handleToggleVerification(r.id, r.isVerified)}
                      className="text-xs h-8"
                    >
                      {r.isVerified ? "Unverify" : "Verify Retailer"}
                    </Button>
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
