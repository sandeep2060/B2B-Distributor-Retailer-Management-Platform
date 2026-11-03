"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import marketplaceStore from "@/lib/db/store";
import { formatNPR } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Package,
  Layers,
  Gift,
  Tag,
  Percent,
  Calendar,
  ShieldCheck,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
  HelpCircle,
  FileText,
  BadgePercent,
  Clock,
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const categories = marketplaceStore.getCategories();
  const brands = marketplaceStore.getBrands();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Basic Product Info
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "cat_snack");
  const [brandId, setBrandId] = useState(brands[0]?.id || "b_waiwai");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1542838132-92c53300491e?w=600");

  // 2. Packaging & Base Pricing
  const [unitType, setUnitType] = useState("CARTON");
  const [packSize, setPackSize] = useState("30 Pcs x 75g");
  const [unitsPerCarton, setUnitsPerCarton] = useState(30);
  const [mrp, setMrp] = useState(25);
  const [cartonMrp, setCartonMrp] = useState(750);
  const [wholesalePrice, setWholesalePrice] = useState(660);
  const [minOrderQty, setMinOrderQty] = useState(2);
  const [stockQuantity, setStockQuantity] = useState(200);

  // 3. Real-Market Offers & Schemes
  // Slabs / Tier Pricing
  const [tierPricing, setTierPricing] = useState([
    { minQty: 2, maxQty: 9, pricePerCarton: 660 },
    { minQty: 10, maxQty: 29, pricePerCarton: 645 },
    { minQty: 30, maxQty: undefined as number | undefined, pricePerCarton: 630 },
  ]);

  // Buy X Get Y Free Scheme
  const [hasFreeScheme, setHasFreeScheme] = useState(true);
  const [freeSchemeMinQty, setFreeSchemeMinQty] = useState(10);
  const [freeItemName, setFreeItemName] = useState("Carton of Wai Wai (30 Pcs)");
  const [freeItemQty, setFreeItemQty] = useState(1);

  // Spot Cash / CD Discount %
  const [cashDiscountPercent, setCashDiscountPercent] = useState(2.0);

  // Promotional Gift Scheme
  const [promotionalGift, setPromotionalGift] = useState("Free CG Branded Apron & Metal Display Rack on 15+ Cartons");

  // Campaign / Festive Tag
  const [festivalTag, setFestivalTag] = useState("Tihar & Chhath Wholesale Dhamaka");

  // 4. Compliance, Tax & Terms
  const [taxCategory, setTaxCategory] = useState<"TAXABLE_13" | "VAT_EXEMPT">("TAXABLE_13");
  const [hsnCode, setHsnCode] = useState("1902.30.00");
  const [shelfLife, setShelfLife] = useState("9 Months from Mfg Date");
  const [creditTerms, setCreditTerms] = useState("Cash on Delivery / Spot QR (2% CD) or 7-Day Authorized Credit");
  const [returnPolicy, setReturnPolicy] = useState("48-Hour Damage Claim & Sealed Carton Replacement Guarantee");

  const addTierSlab = () => {
    const lastTier = tierPricing[tierPricing.length - 1];
    const newMin = lastTier ? (lastTier.maxQty ? lastTier.maxQty + 1 : lastTier.minQty + 10) : 5;
    const newPrice = lastTier ? Math.max(1, lastTier.pricePerCarton - 15) : wholesalePrice - 15;
    setTierPricing([...tierPricing, { minQty: newMin, maxQty: undefined, pricePerCarton: newPrice }]);
  };

  const removeTierSlab = (index: number) => {
    if (tierPricing.length <= 1) return;
    setTierPricing(tierPricing.filter((_, i) => i !== index));
  };

  const updateTierSlab = (index: number, field: string, value: any) => {
    const updated = [...tierPricing];
    updated[index] = { ...updated[index], [field]: value };
    setTierPricing(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const payload = {
        title,
        categoryId,
        brandId,
        sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
        description: description || "Fresh wholesale stock direct from manufacturer.",
        unitType,
        packSize,
        unitsPerCarton: Number(unitsPerCarton),
        mrp: Number(mrp),
        cartonMrp: Number(cartonMrp),
        wholesalePrice: Number(wholesalePrice),
        minOrderQty: Number(minOrderQty),
        stockQuantity: Number(stockQuantity),
        imageUrl,
        barcode,
        isFeatured: false,

        // Offers and schemes
        hasFreeScheme,
        freeSchemeMinQty: hasFreeScheme ? Number(freeSchemeMinQty) : undefined,
        freeItemName: hasFreeScheme ? freeItemName : undefined,
        freeItemQty: hasFreeScheme ? Number(freeItemQty) : undefined,
        cashDiscountPercent: Number(cashDiscountPercent),
        promotionalGift,
        festivalTag,
        taxCategory,
        hsnCode,
        shelfLife,
        creditTerms,
        returnPolicy,
        tierPricing: tierPricing.map((t) => ({
          minQty: Number(t.minQty),
          maxQty: t.maxQty ? Number(t.maxQty) : undefined,
          pricePerCarton: Number(t.pricePerCarton),
        })),
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add wholesale product");
      }

      router.push("/distributor/products");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create product");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <Link
            href="/distributor/products"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#0759C7] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Product Catalog
          </Link>
          <h1 className="text-2xl font-black text-[#102C55]">Add Wholesale Product SKU & Offers</h1>
          <p className="text-xs text-slate-500">
            Configure real-market wholesale pricing, volume slabs, buy-get-free schemes, spot cash discounts & tax details
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Basic Product Identity */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#102C55] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#0759C7]" />
              1. Basic Product & Brand Information
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Catalog Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <Input
                label="Wholesale Product Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Wai Wai Quick Chicken Instant Noodles (Carton of 30)"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C55] mb-1">Wholesale Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#0759C7]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102C55] mb-1">Brand Name *</label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#0759C7]"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Distributor SKU Code *"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. CG-WW-CHK-30"
                required
              />
            </div>

            <div>
              <Input
                label="Barcode / EAN Code"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="e.g. 890123000101"
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Product Image URL *"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#102C55] mb-1">Product Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of packaging, taste, storage condition, and wholesale benefits..."
                rows={2}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0759C7] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Packaging, MRP & Base Wholesale Price */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#102C55] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0759C7]" />
              2. Packaging Specs & Base Pricing
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Carton Rates</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <Input
                label="Pack Size / Weight *"
                value={packSize}
                onChange={(e) => setPackSize(e.target.value)}
                placeholder="e.g. 30 Pcs x 75g"
                required
              />
            </div>

            <div>
              <Input
                label="Units Per Master Carton *"
                type="number"
                value={unitsPerCarton}
                onChange={(e) => setUnitsPerCarton(Number(e.target.value))}
                placeholder="30"
                required
              />
            </div>

            <div>
              <Input
                label="Single Unit Retail MRP (NPR) *"
                type="number"
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                placeholder="25"
                required
              />
            </div>

            <div>
              <Input
                label="Total Carton MRP (NPR) *"
                type="number"
                value={cartonMrp}
                onChange={(e) => setCartonMrp(Number(e.target.value))}
                placeholder="750"
                required
              />
            </div>

            <div>
              <Input
                label="Standard Wholesale Carton Price (NPR) *"
                type="number"
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(Number(e.target.value))}
                placeholder="660"
                required
              />
            </div>

            <div>
              <Input
                label="Minimum Order Quantity (MOQ Cartons) *"
                type="number"
                value={minOrderQty}
                onChange={(e) => setMinOrderQty(Number(e.target.value))}
                placeholder="2"
                required
              />
            </div>

            <div>
              <Input
                label="Available Warehouse Stock (Cartons) *"
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                placeholder="200"
                required
              />
            </div>

            <div className="sm:col-span-2 flex items-center p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-slate-700">
              <div className="space-y-0.5">
                <span className="font-bold text-[#0759C7] block">Calculated Single Unit Wholesale Cost:</span>
                <span className="font-mono text-sm font-black text-slate-900">
                  {unitsPerCarton > 0 ? formatNPR(wholesalePrice / unitsPerCarton) : "Rs. 0"} per unit
                </span>
                <span className="text-[11px] text-emerald-700 block">
                  Retailer Margin: {formatNPR(cartonMrp - wholesalePrice)} per carton (
                  {Math.round(((cartonMrp - wholesalePrice) / cartonMrp) * 100)}% margin)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: REAL-MARKET OFFERS, SCHEMES & VOLUME DISCOUNTS */}
        <div className="bg-gradient-to-br from-white to-orange-50/30 p-6 sm:p-7 rounded-2xl border-2 border-[#F58220]/40 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-orange-200">
            <div>
              <h3 className="font-black text-base text-[#102C55] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F58220]" />
                3. Market Offers, Schemes & Volume Discounts (बजारमा चल्ने छुट तथा अफरहरू)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure tiered quantity breaks, buy-get-free schemes, spot cash discounts, and festive gifts
              </p>
            </div>
            <span className="bg-[#F58220] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              High Conversion
            </span>
          </div>

          {/* 3A: Volume Tier Pricing Slabs */}
          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-[#102C55] flex items-center gap-1.5 uppercase tracking-wider">
                  <BadgePercent className="w-4 h-4 text-[#0759C7]" />
                  A. Volume Tier Pricing Slabs (परिमाण अनुसारको स्ल्याब छुट)
                </h4>
                <p className="text-[11px] text-slate-500">Reward retail stores with higher margins for larger bulk orders</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addTierSlab} className="text-xs h-8">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Slab
              </Button>
            </div>

            <div className="space-y-2">
              {tierPricing.map((tier, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="w-16 font-bold text-slate-700 text-xs">Slab {idx + 1}:</span>
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="number"
                      value={tier.minQty}
                      onChange={(e) => updateTierSlab(idx, "minQty", Number(e.target.value))}
                      placeholder="Min"
                      className="w-16 h-8 px-2 text-xs font-mono font-bold border border-slate-300 rounded bg-white text-center"
                    />
                    <span className="text-slate-400">to</span>
                    <input
                      type="number"
                      value={tier.maxQty || ""}
                      onChange={(e) =>
                        updateTierSlab(idx, "maxQty", e.target.value ? Number(e.target.value) : undefined)
                      }
                      placeholder="Max (or +)"
                      className="w-20 h-8 px-2 text-xs font-mono border border-slate-300 rounded bg-white text-center"
                    />
                    <span className="text-slate-500 text-xs">Cartons @</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-600">Rs.</span>
                    <input
                      type="number"
                      value={tier.pricePerCarton}
                      onChange={(e) => updateTierSlab(idx, "pricePerCarton", Number(e.target.value))}
                      className="w-24 h-8 px-2 text-xs font-mono font-bold text-[#0759C7] border border-slate-300 rounded bg-white text-right"
                    />
                    <span className="text-slate-400 text-xs">/ctn</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeTierSlab(idx)}
                    disabled={tierPricing.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-20"
                    title="Remove slab"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3B: Buy X Get Y Free Scheme (10+1, 12+1 Scheme) */}
          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-[#102C55] flex items-center gap-1.5 uppercase tracking-wider">
                  <Gift className="w-4 h-4 text-emerald-600" />
                  B. Buy X Get Y Free Scheme (माल फ्रि योजना / 10+1 Scheme)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Standard FMCG free goods scheme (e.g., Buy 10 Cartons, Get 1 Carton Free)
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFreeScheme}
                  onChange={(e) => setHasFreeScheme(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0759C7]"
                />
                <span className="text-xs font-bold text-slate-700">Enable Scheme</span>
              </label>
            </div>

            {hasFreeScheme && (
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Buy Minimum Cartons (X) *
                  </label>
                  <Input
                    type="number"
                    value={freeSchemeMinQty}
                    onChange={(e) => setFreeSchemeMinQty(Number(e.target.value))}
                    placeholder="10"
                    required={hasFreeScheme}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Free Item Awarded *
                  </label>
                  <Input
                    value={freeItemName}
                    onChange={(e) => setFreeItemName(e.target.value)}
                    placeholder="e.g. Carton of Wai Wai (30 Pcs)"
                    required={hasFreeScheme}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Quantity Free (Y) *
                  </label>
                  <Input
                    type="number"
                    value={freeItemQty}
                    onChange={(e) => setFreeItemQty(Number(e.target.value))}
                    placeholder="1"
                    required={hasFreeScheme}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3C: Spot Cash Discount & Retailer Promotional Gift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="font-bold text-[#102C55] flex items-center gap-1.5 uppercase tracking-wider text-xs">
                <Percent className="w-3.5 h-3.5 text-[#0759C7]" />
                Spot Cash / QR Discount (नगद छुट - CD %)
              </label>
              <p className="text-[11px] text-slate-500">
                Instant discount deducted if retailer pays immediately on delivery via Cash or Fonepay QR
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.5"
                  value={cashDiscountPercent}
                  onChange={(e) => setCashDiscountPercent(Number(e.target.value))}
                  placeholder="2.0"
                />
                <span className="font-bold text-slate-700 text-sm">% Off</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="font-bold text-[#102C55] flex items-center gap-1.5 uppercase tracking-wider text-xs">
                <Gift className="w-3.5 h-3.5 text-[#F58220]" />
                Promotional Gift / Merchandise (उपहार स्किम)
              </label>
              <p className="text-[11px] text-slate-500">
                Shop gifts like branded display racks, aprons, wall clocks, umbrellas, or bonus merchandise
              </p>
              <Input
                value={promotionalGift}
                onChange={(e) => setPromotionalGift(e.target.value)}
                placeholder="e.g. Free CG Apron + Display Board on 15+ Cartons"
              />
            </div>

            <div className="sm:col-span-2 bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="font-bold text-[#102C55] flex items-center gap-1.5 uppercase tracking-wider text-xs">
                <Tag className="w-3.5 h-3.5 text-[#F58220]" />
                Campaign / Festival Banner Tag (चाडपर्व स्किम ट्याग)
              </label>
              <Input
                value={festivalTag}
                onChange={(e) => setFestivalTag(e.target.value)}
                placeholder="e.g. Tihar & Chhath Wholesale Dhamaka, Dashain Special, Clearance Deal"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Compliance, Taxation, Shelf Life & Policies */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#102C55] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              4. Nepal IRD Tax Classification, Shelf Life & Credit Terms
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">IRD & Trade Terms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-[#102C55] mb-1">
                Nepal IRD VAT Classification *
              </label>
              <select
                value={taxCategory}
                onChange={(e) => setTaxCategory(e.target.value as any)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#0759C7]"
              >
                <option value="TAXABLE_13">13% Taxable Goods (Standard FMCG with VAT invoice)</option>
                <option value="VAT_EXEMPT">VAT-Exempt / Non-Taxable (Rice, Mustard Oil, Raw Staples)</option>
              </select>
            </div>

            <div>
              <Input
                label="Customs / IRD HSN Code"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                placeholder="e.g. 1902.30.00"
              />
            </div>

            <div>
              <Input
                label="Product Shelf Life / Expiry Duration *"
                value={shelfLife}
                onChange={(e) => setShelfLife(e.target.value)}
                placeholder="e.g. 9 Months from Mfg Date"
                required
              />
            </div>

            <div>
              <Input
                label="Wholesale Credit Terms Offered *"
                value={creditTerms}
                onChange={(e) => setCreditTerms(e.target.value)}
                placeholder="e.g. Cash / Fonepay or 7-Day Authorized Credit"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Transit Damage & Return Policy Guarantee *"
                value={returnPolicy}
                onChange={(e) => setReturnPolicy(e.target.value)}
                placeholder="e.g. 48-Hour Damage Claim & Sealed Carton Replacement Guarantee"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link href="/distributor/products">
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="orange"
            size="lg"
            isLoading={loading}
            className="font-bold px-8 shadow-md"
          >
            Publish Wholesale Product & Real Market Offers
          </Button>
        </div>
      </form>
    </div>
  );
}
