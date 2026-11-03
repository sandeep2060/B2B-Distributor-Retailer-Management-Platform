"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatNPR } from "@/lib/utils/formatters";
import { NEPAL_LOCATION_DATA } from "@/lib/services/nepal-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building2,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  QrCode,
  Banknote,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Nepal Location Dropdowns State
  const [selectedProvinceId, setSelectedProvinceId] = useState("bagmati");
  const selectedProvince = NEPAL_LOCATION_DATA.find((p) => p.id === selectedProvinceId);
  const [selectedDistrict, setSelectedDistrict] = useState("Kathmandu");
  const activeDistrictData = selectedProvince?.districts.find((d) => d.name === selectedDistrict);
  const [selectedMunicipality, setSelectedMunicipality] = useState(
    activeDistrictData?.municipalities[0] || "Kathmandu Metropolitan City"
  );

  // Form Fields
  const [recipientName, setRecipientName] = useState("Suman Thapa");
  const [phone, setPhone] = useState("9841556677");
  const [ward, setWard] = useState("14");
  const [streetAddress, setStreetAddress] = useState("Kalanki Chowk (Near Ring Road Bridge)");
  const [landmark, setLandmark] = useState("Opposite to NIC Asia Bank Branch");
  const [panVatNumber, setPanVatNumber] = useState("304561289");
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [specialInstructions, setSpecialInstructions] = useState(
    "Please deliver during morning hours before 11:30 AM."
  );

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
        setLoadingCart(false);
      });
  }, []);

  // Update district when province changes
  const handleProvinceChange = (provId: string) => {
    setSelectedProvinceId(provId);
    const prov = NEPAL_LOCATION_DATA.find((p) => p.id === provId);
    if (prov && prov.districts.length > 0) {
      setSelectedDistrict(prov.districts[0].name);
      setSelectedMunicipality(prov.districts[0].municipalities[0] || "");
    }
  };

  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const distData = selectedProvince?.districts.find((d) => d.name === distName);
    if (distData && distData.municipalities.length > 0) {
      setSelectedMunicipality(distData.municipalities[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const payload = {
        recipientName,
        phone,
        province: selectedProvince?.name || "Bagmati Province",
        district: selectedDistrict,
        municipality: selectedMunicipality,
        ward,
        streetAddress,
        landmark,
        panVatNumber,
        paymentMethod,
        specialInstructions,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order failed");
      }

      router.push(`/retailer/orders/${data.orderId}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to place order");
      setSubmitting(false);
    }
  };

  if (loadingCart) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="animate-spin w-8 h-8 border-4 border-[#0759C7] border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-slate-500">Preparing checkout...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#102C55]">No Items in Cart</h2>
        <p className="text-xs text-slate-500">Please add products to your cart before proceeding to checkout.</p>
        <Link href="/products">
          <Button variant="primary" size="sm">
            Go to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-[#102C55]">Wholesale Order Checkout</h1>
          <p className="text-xs text-slate-500">Provide store delivery details and select payment method</p>
        </div>
        <Link
          href="/retailer/cart"
          className="text-xs font-semibold text-[#0759C7] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Cart
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Delivery Address & Business Info */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Shop Delivery Location */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#102C55] pb-2 border-b border-slate-100">
                <Truck className="w-4 h-4 text-[#0759C7]" />
                <span>1. Store Delivery Address (Nepal)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-[#102C55] mb-1">Province *</label>
                  <select
                    value={selectedProvinceId}
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
                    value={selectedDistrict}
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
                  <label className="block text-xs font-semibold text-[#102C55] mb-1">Municipality / Sub-Metro *</label>
                  <select
                    value={selectedMunicipality}
                    onChange={(e) => setSelectedMunicipality(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#0759C7]"
                  >
                    {activeDistrictData?.municipalities.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102C55] mb-1">Ward No. *</label>
                  <Input
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="e.g. 14"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#102C55] mb-1">
                    Street / Chowk / Shop Address *
                  </label>
                  <Input
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. Kalanki Chowk, Near Ring Road Bridge"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#102C55] mb-1">
                    Nearest Landmark (Optional)
                  </label>
                  <Input
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opposite to NIC Asia Bank Branch"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Contact & PAN/VAT Information */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#102C55] pb-2 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-[#0759C7]" />
                <span>2. Store Contact & Tax Info</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-[#102C55] mb-1">Contact Person *</label>
                  <Input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Shop Owner or Manager Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102C55] mb-1">Nepal Mobile Number *</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#102C55] mb-1">
                    Retailer 9-digit PAN/VAT No. (For IRD Tax Invoice)
                  </label>
                  <Input
                    value={panVatNumber}
                    onChange={(e) => setPanVatNumber(e.target.value)}
                    placeholder="e.g. 304561289"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Used for official taxable credit invoice under Nepal Inland Revenue Department guidelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#102C55] pb-2 border-b border-slate-100">
                <CreditCard className="w-4 h-4 text-[#0759C7]" />
                <span>3. Payment Method</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Cash on Delivery */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-[#0759C7] bg-blue-50/60 ring-1 ring-[#0759C7]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    checked={paymentMethod === "CASH_ON_DELIVERY"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-[#0759C7]" />
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-slate-500 mt-0.5 text-[11px]">
                      Inspect wholesale cartons at delivery and pay in cash or via mobile QR scan to delivery driver.
                    </p>
                  </div>
                </label>

                {/* Bank Transfer / QR */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-[#0759C7] bg-blue-50/60 ring-1 ring-[#0759C7]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={paymentMethod === "BANK_TRANSFER"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      Bank Transfer / Fonepay
                    </span>
                    <p className="text-slate-500 mt-0.5 text-[11px]">
                      Direct corporate bank transfer or advance wholesale invoice settlement.
                    </p>
                  </div>
                </label>

                {/* eSewa */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === "ESEWA"
                      ? "border-[#0759C7] bg-blue-50/60 ring-1 ring-[#0759C7]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ESEWA"
                    checked={paymentMethod === "ESEWA"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-emerald-600 text-white text-[10px] flex items-center justify-center font-black">
                        e
                      </span>
                      eSewa Mobile Wallet
                    </span>
                    <p className="text-slate-500 mt-0.5 text-[11px]">
                      Official eSewa digital wallet API integration ready.
                    </p>
                  </div>
                </label>

                {/* Khalti */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === "KHALTI"
                      ? "border-[#0759C7] bg-blue-50/60 ring-1 ring-[#0759C7]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="KHALTI"
                    checked={paymentMethod === "KHALTI"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-purple-600 text-white text-[10px] flex items-center justify-center font-black">
                        K
                      </span>
                      Khalti Digital Wallet
                    </span>
                    <p className="text-slate-500 mt-0.5 text-[11px]">
                      Khalti wallet and e-banking payment flow ready.
                    </p>
                  </div>
                </label>
              </div>

              {/* Special Delivery Instructions */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#102C55] mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Call before dispatch, deliver before noon rush hour..."
                  rows={2}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0759C7] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Confirmation Summary */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-5 sticky top-24">
            <h3 className="font-bold text-base text-[#102C55] pb-3 border-b border-slate-100">
              Order Review & Settlement
            </h3>

            {/* Line items mini preview */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.items.map((item: any) => (
                <div key={item.productId} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                  <div className="truncate max-w-[170px]">
                    <p className="font-bold text-slate-900 truncate">{item.product.title}</p>
                    <p className="text-[10px] text-slate-500">
                      {item.quantity} Cartons x {formatNPR(item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-slate-800">{formatNPR(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount:</span>
                <span className="font-mono font-bold text-slate-900">{formatNPR(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>13% VAT:</span>
                <span className="font-mono font-bold text-slate-900">{formatNPR(cart.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery:</span>
                <span className="font-mono font-bold text-slate-900">
                  {cart.deliveryFee === 0 ? <span className="text-emerald-700">FREE</span> : formatNPR(cart.deliveryFee)}
                </span>
              </div>

              <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-baseline">
                <span className="text-sm font-black text-[#102C55]">Grand Total:</span>
                <span className="text-xl font-black text-[#0759C7] font-mono">{formatNPR(cart.totalAmount)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="orange"
              size="lg"
              isLoading={submitting}
              className="w-full font-bold text-sm h-12 shadow-md"
            >
              {submitting ? "Confirming Order..." : "Confirm & Place Wholesale Order"}
            </Button>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-700" />
              <span>Official IRD VAT tax invoice will be generated upon confirmation.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
