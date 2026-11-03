"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NEPAL_LOCATION_DATA } from "@/lib/services/nepal-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, ShieldCheck, AlertCircle } from "lucide-react";

export default function RetailerRegisterPage() {
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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [panVatNumber, setPanVatNumber] = useState("");
  const [ward, setWard] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

  const handleProvinceChange = (pId: string) => {
    setProvinceId(pId);
    const p = NEPAL_LOCATION_DATA.find((item) => item.id === pId);
    if (p && p.districts.length > 0) {
      setDistrict(p.districts[0].name);
      setMunicipality(p.districts[0].municipalities[0] || "");
    }
  };

  const handleDistrictChange = (dName: string) => {
    setDistrict(dName);
    const d = selectedProvince?.districts.find((item) => item.name === dName);
    if (d && d.municipalities.length > 0) {
      setMunicipality(d.municipalities[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          shopName,
          panVatNumber,
          province: selectedProvince?.name || "Bagmati Province",
          district,
          municipality,
          ward,
          streetAddress,
          businessType: "Grocery & Kirana Store",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/retailer/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create retailer account");
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
          <h2 className="text-lg font-black text-[#102C55]">Retailer Registration</h2>
          <p className="text-xs text-slate-500">
            Open a verified wholesale buyer account for your grocery, mart, or retail store
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
            {/* Store Information */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#102C55] flex items-center gap-2">
                <Store className="w-4 h-4 text-[#0759C7]" />
                Store & Proprietor Info
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Shop / Business Name *"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Birgunj Kirana Store"
                  required
                />
                <Input
                  label="Proprietor Full Name *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Binod Shrestha"
                  required
                />
                <Input
                  label="Business Email Address *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="binod@store.com"
                  required
                />
                <Input
                  label="Nepal Phone Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  required
                />
                <Input
                  label="Account Password *"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                />
                <Input
                  label="PAN / VAT Number (Optional)"
                  value={panVatNumber}
                  onChange={(e) => setPanVatNumber(e.target.value)}
                  placeholder="9-digit PAN"
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#102C55]">Store Address in Nepal</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102C55] mb-1">Province *</label>
                  <select
                    value={provinceId}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#0759C7]"
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
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#0759C7]"
                  >
                    {selectedProvince?.districts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102C55] mb-1">Municipality *</label>
                  <select
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#0759C7]"
                  >
                    {activeDistrictData?.municipalities.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Ward No. *"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. 8"
                  required
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Street Address / Chowk *"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. Main Road, Near Bus Park"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="orange"
              size="lg"
              isLoading={loading}
              className="w-full font-bold text-sm h-11 mt-4"
            >
              Complete Registration & Enter Marketplace
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0759C7] font-bold hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
