"use client";

import React, { useState } from "react";
import marketplaceStore from "@/lib/db/store";
import { formatNPR } from "@/lib/utils/formatters";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Banknote,
  FileCheck,
  Sliders,
  Save,
  CheckCircle2,
  ExternalLink,
  Edit2,
  X,
} from "lucide-react";
import Link from "next/link";

export default function DistributorSettingsPage() {
  const distributorId = "dist_1";
  const [dist, setDist] = useState(() => marketplaceStore.getDistributorById(distributorId));
  const systemSettings = marketplaceStore.getDistributorSettings(distributorId);

  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Edit form state
  const [companyName, setCompanyName] = useState(dist?.companyName || "");
  const [streetAddress, setStreetAddress] = useState(dist?.streetAddress || "");
  const [district, setDistrict] = useState(dist?.district || "");
  const [province, setProvince] = useState(dist?.province || "");
  const [contactPerson, setContactPerson] = useState(dist?.contactPerson || "");
  const [contactPhone, setContactPhone] = useState(dist?.contactPhone || "");
  const [bankName, setBankName] = useState(dist?.bankName || "");
  const [bankAccountName, setBankAccountName] = useState(dist?.bankAccountName || "");
  const [bankAccountNumber, setBankAccountNumber] = useState(dist?.bankAccountNumber || "");
  const [deliveryZones, setDeliveryZones] = useState(dist?.deliveryZones?.join(", ") || "");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = marketplaceStore.updateDistributor(distributorId, {
      companyName,
      streetAddress,
      district,
      province,
      contactPerson,
      contactPhone,
      bankName,
      bankAccountName,
      bankAccountNumber,
      deliveryZones: deliveryZones.split(",").map((z) => z.trim()).filter(Boolean),
    });

    if (updated) {
      setDist({ ...updated });
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
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
            Registered wholesale FMCG distributor on B2B Deal Nepal • Rating: {dist?.rating} / 5.0 • PAN:{" "}
            <span className="font-mono font-bold text-[#0759C7]">{dist?.panVatNumber}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/distributor/system-settings"
            className="px-3.5 py-2 text-xs font-bold text-[#0759C7] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sliders className="w-4 h-4" />
            <span>System Settings</span>
          </Link>

          <Button
            variant={isEditing ? "outline" : "primary"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-semibold flex items-center gap-1.5"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            <span>{isEditing ? "Cancel Editing" : "Edit Profile"}</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs between Business Profile & System Settings */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <Link
          href="/distributor/settings"
          className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-[#0759C7] text-[#0759C7]"
        >
          <Building2 className="w-4 h-4" />
          <span>Business Profile & Legal Identity</span>
        </Link>
        <Link
          href="/distributor/system-settings"
          className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Sliders className="w-4 h-4" />
          <span>System Settings & Invoice Print Template</span>
        </Link>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="bg-emerald-600 text-white p-3.5 px-5 rounded-xl shadow-md flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Business profile details successfully updated!</span>
        </div>
      )}

      {/* Featured System Settings Teaser Card */}
      <div className="p-4 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#0759C7] tracking-wider block">
            Flexible & Dynamic System Settings:
          </span>
          <p className="font-bold text-[#102C55] mt-0.5">
            Active Invoice Template:{" "}
            <span className="font-mono text-[#0759C7] uppercase">{systemSettings.invoiceTemplate}</span> (
            {systemSettings.invoiceTitle || "कर बीजक"})
          </p>
          <p className="text-[11px] text-slate-500">
            Configure dynamic print layouts (IRD Standard, 80mm Thermal, Modern FMCG), VAT rules, and order automation.
          </p>
        </div>
        <Link
          href="/distributor/system-settings"
          className="px-3 py-1.5 rounded-lg bg-[#0759C7] text-white font-bold text-xs hover:bg-[#0648a3] transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
        >
          <span>Manage System Settings</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Profile Form (Edit Mode vs View Mode) */}
      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0759C7]" />
                <span>Edit Business & Warehouse Identity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Registered Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <Input
                  label="Dispatch Supervisor / Contact Person"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  required
                />
                <Input
                  label="Contact Phone / Mobile"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
                <Input
                  label="Delivery Zones Covered (Comma Separated)"
                  value={deliveryZones}
                  onChange={(e) => setDeliveryZones(e.target.value)}
                  required
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Warehouse Dispatch Address (Street, Chowk)"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
                <Input
                  label="Province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Settlement Bank Account</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Bank Name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
                <Input
                  label="Account Holder Name"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  required
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Account Number"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </Button>
          </div>
        </form>
      ) : (
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
      )}
    </div>
  );
}
