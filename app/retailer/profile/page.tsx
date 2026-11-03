import React from "react";
import marketplaceStore from "@/lib/db/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, ShieldCheck, MapPin, Phone, Mail, Building, FileText } from "lucide-react";

export default function RetailerProfilePage() {
  const userId = "usr_ret_1";
  const user = marketplaceStore.getUserById(userId);
  const profile = marketplaceStore.getRetailerByUserId(userId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#102C55]">{profile?.shopName}</h1>
            {profile?.isVerified && (
              <span className="flex items-center gap-1 text-[11px] font-bold bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Retailer
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered B2B Wholesale Retail Account • {profile?.businessType}
          </p>
        </div>

        <Button variant="outline" size="sm" className="text-xs">
          Edit Store Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business & Tax Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Store className="w-4 h-4 text-[#0759C7]" />
              Business & Tax Registration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Retail Business Name:</span>
              <span className="font-bold text-slate-900">{profile?.shopName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Nepal 9-Digit PAN/VAT Number:</span>
              <span className="font-mono font-bold text-[#0759C7] text-sm">{profile?.panVatNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Business Classification:</span>
              <span className="font-medium text-slate-800">{profile?.businessType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Wholesale Credit Limit:</span>
              <span className="font-bold text-emerald-700 font-mono">Rs. 50,000.00 (Approved)</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0759C7]" />
              Registered Store Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Owner / Proprietor:</span>
              <span className="font-bold text-slate-900">{user?.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mobile Phone:</span>
              <span className="font-mono font-medium text-slate-800">{user?.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Delivery Location:</span>
              <span className="font-medium text-slate-800">
                {profile?.streetAddress}, Ward {profile?.ward}
              </span>
              <span className="block text-slate-500 text-[11px]">
                {profile?.municipality}, {profile?.district}, {profile?.province}
              </span>
            </div>
            {profile?.landmark && (
              <div>
                <span className="text-slate-400 block text-[11px]">Landmark:</span>
                <span className="text-slate-600">{profile.landmark}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
