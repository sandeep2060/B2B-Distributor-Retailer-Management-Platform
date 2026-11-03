import React from "react";
import marketplaceStore from "@/lib/db/store";
import { formatNPR } from "@/lib/utils/formatters";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ShieldCheck, MapPin, Phone, Banknote, FileCheck } from "lucide-react";

export default function DistributorSettingsPage() {
  const distributorId = "dist_1";
  const dist = marketplaceStore.getDistributorById(distributorId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#102C55]">{dist?.companyName}</h1>
            {dist?.isVerified && (
              <span className="flex items-center gap-1 text-[11px] font-bold bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Distributor
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered wholesale FMCG distributor on B2B Deal Nepal • Rating: {dist?.rating} / 5.0
          </p>
        </div>

        <Button variant="outline" size="sm" className="text-xs font-semibold">
          Update Information
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company & Tax Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0759C7]" />
              Company Legal & Tax Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Registered Company Name:</span>
              <span className="font-bold text-slate-900">{dist?.companyName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Nepal 9-Digit PAN/VAT Registration:</span>
              <span className="font-mono font-bold text-[#0759C7] text-sm">{dist?.panVatNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Department of Commerce Reg No:</span>
              <span className="font-mono text-slate-800">{dist?.registrationNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Minimum Wholesale Order Amount:</span>
              <span className="font-bold text-slate-900 font-mono">{formatNPR(dist?.minOrderAmount)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Delivery Zones Covered:</span>
              <span className="font-medium text-slate-800">{dist?.deliveryZones.join(", ")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Bank & Payout Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-600" />
              Settlement Bank Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Bank Name:</span>
              <span className="font-bold text-slate-900">{dist?.bankName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Account Holder Name:</span>
              <span className="font-medium text-slate-800">{dist?.bankAccountName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Account Number:</span>
              <span className="font-mono font-bold text-[#0759C7]">{dist?.bankAccountNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Warehouse Dispatch Address:</span>
              <span className="font-medium text-slate-800">
                {dist?.streetAddress}, {dist?.district}, {dist?.province}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Dispatch Supervisor:</span>
              <span className="font-medium text-slate-800">
                {dist?.contactPerson} ({dist?.contactPhone})
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
