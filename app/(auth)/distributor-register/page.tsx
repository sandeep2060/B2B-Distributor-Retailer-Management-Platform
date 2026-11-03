"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NEPAL_LOCATION_DATA } from "@/lib/services/nepal-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, ShieldCheck, AlertCircle, Banknote } from "lucide-react";

export default function DistributorRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [provinceId, setProvinceId] = useState("bagmati");
  const selectedProvince = NEPAL_LOCATION_DATA.find((p) => p.id === provinceId);
  const [district, setDistrict] = useState("Kathmandu");
  const activeDistrictData = selectedProvince?.districts.find((d) => d.name === district);
  const [municipality, setMunicipality] = useState(
    activeDistrictData?.municipalities[0] || "Kathmandu Metropolitan City"
  );

  const [companyName, setCompanyName] = useState("");
  const [panVatNumber, setPanVatNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [ward, setWard] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [bankName, setBankName] = useState("Nabil Bank Ltd.");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState(2500);

  const handleProvinceChange = (pId: string) => {
    setProvinceId(pId);
    const p = NEPAL_LOCATION_DATA.find((item) => item.id === pId);
    if (p && p.districts.length > 0) {
      setDistrict(p.districts[0].name);
      setMunicipality(p.districts[0].municipalities[0] || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/distributor-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          companyName,
          panVatNumber,
          registrationNumber,
          province: selectedProvince?.name || "Bagmati Province",
          district,
          municipality,
          ward,
          streetAddress,
          contactPerson: contactPerson || fullName,
          contactPhone: contactPhone || phone,
          bankName,
          bankAccountName: bankAccountName || companyName,
          bankAccountNumber,
          minOrderAmount: Number(minOrderAmount),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Application failed");
      }

      router.push("/distributor/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit distributor application");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#102C55] via-[#0759C7] to-[#102C55] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-50 p-6 text-center border-b border-slate-200">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#0759C7] flex items-center justify-center font-black text-white text-lg shadow-md">
              B2B
            </div>
            <span className="text-xl font-black text-[#102C55]">B2B Deal</span>
          </Link>
          <h2 className="text-lg font-black text-[#102C55]">Distributor Onboarding Application</h2>
          <p className="text-xs text-slate-500">
            Expand your FMCG wholesale sales directly to thousands of retailers across Nepal
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Company & Legal Info */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#102C55] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0759C7]" />
                Company Legal & Tax Identity
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Registered Company Name *"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Sagarmatha FMCG Distributors Pvt. Ltd."
                  required
                />
                <Input
                  label="Nepal 9-Digit PAN/VAT Number *"
                  value={panVatNumber}
                  onChange={(e) => setPanVatNumber(e.target.value)}
                  placeholder="e.g. 602348912"
                  required
                />
                <Input
                  label="Company Registration No."
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="REG-XXXXX/080"
                />
                <Input
                  label="Minimum Wholesale Order Amount (NPR) *"
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  placeholder="2500"
                  required
                />
              </div>
            </div>

            {/* Account Credentials */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#102C55]">Portal Access Credentials</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Director / Manager Name *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Official Representative"
                  required
                />
                <Input
                  label="Official Corporate Email *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com.np"
                  required
                />
                <Input
                  label="Primary Phone Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  required
                />
                <Input
                  label="Portal Password *"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
            </div>

            {/* Warehouse Address */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#102C55]">Warehouse & Dispatch Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102C55] mb-1">Province *</label>
                  <select
                    value={provinceId}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    {NEPAL_LOCATION_DATA.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102C55] mb-1">District *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    {selectedProvince?.districts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Warehouse Street Address *"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. Kuleshwor Wholesale Complex, Godown #4"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bank Details for Payout */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#102C55] flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-600" />
                Bank Settlement Account (For Wholesale Payouts)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Commercial Bank *"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Nabil Bank Ltd."
                  required
                />
                <Input
                  label="Account Holder Name *"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  placeholder="Official Company Account"
                  required
                />
                <Input
                  label="Account Number *"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="Bank Account No."
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full font-bold text-sm h-11 mt-4"
            >
              Submit Distributor Application
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already registered?{" "}
            <Link href="/login" className="text-[#0759C7] font-bold hover:underline">
              Distributor Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
