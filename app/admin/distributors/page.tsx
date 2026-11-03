"use client";

import React, { useState } from "react";
import marketplaceStore from "@/lib/db/store";
import { formatNPR } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, ShieldCheck, Star, Edit2, CheckCircle2, XCircle, Percent } from "lucide-react";

export default function AdminDistributorsPage() {
  const [distributors, setDistributors] = useState(marketplaceStore.getDistributors());
  const [editingDistId, setEditingDistId] = useState<string | null>(null);
  const [newCommissionRate, setNewCommissionRate] = useState<number>(3.0);

  const handleToggleVerification = (id: string, currentStatus: boolean) => {
    marketplaceStore.verifyDistributor(id, !currentStatus);
    setDistributors([...marketplaceStore.getDistributors()]);
  };

  const handleSaveCommission = (id: string) => {
    marketplaceStore.setDistributorCommission(id, newCommissionRate);
    setDistributors([...marketplaceStore.getDistributors()]);
    setEditingDistId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <h1 className="text-2xl font-black text-[#102C55]">Wholesale Distributor Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit legal PAN/VAT documentation, configure platform commission rates, and manage seller status
          </p>
        </div>

        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          Total Registered: <span className="text-[#0759C7] font-mono">{distributors.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Distributor Company</th>
                <th className="py-3 px-4">PAN / VAT Reg</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Min Order</th>
                <th className="py-3 px-4">Commission %</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {distributors.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{d.companyName}</p>
                    <p className="text-[10px] text-slate-500">
                      Contact: {d.contactPerson} ({d.contactPhone})
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0759C7]">{d.panVatNumber}</td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {d.district}, {d.province}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {d.rating}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium">{formatNPR(d.minOrderAmount)}</td>
                  <td className="py-3.5 px-4">
                    {editingDistId === d.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="0.1"
                          value={newCommissionRate}
                          onChange={(e) => setNewCommissionRate(parseFloat(e.target.value) || 0)}
                          className="w-16 h-7 px-1.5 text-xs font-mono font-bold border border-slate-300 rounded"
                        />
                        <button
                          onClick={() => handleSaveCommission(d.id)}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                        <span>{d.commissionRate}%</span>
                        <button
                          onClick={() => {
                            setEditingDistId(d.id);
                            setNewCommissionRate(d.commissionRate);
                          }}
                          className="text-slate-400 hover:text-[#0759C7]"
                          title="Change Commission Rate"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {d.isVerified ? "Verified" : "Pending Audit"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant={d.isVerified ? "danger" : "primary"}
                      size="sm"
                      onClick={() => handleToggleVerification(d.id, d.isVerified)}
                      className="text-xs h-8 font-bold"
                    >
                      {d.isVerified ? "Suspend" : "Approve & Verify"}
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
