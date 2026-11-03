"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Boxes,
  PackagePlus,
  Check,
  Eye,
  ShoppingBag,
  Building2,
  Upload,
  UploadCloud,
  Image as ImageIcon,
  X,
  RefreshCw,
  Wand2,
  SlidersHorizontal,
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCompany = searchParams?.get("company") || "";

  const categories = marketplaceStore.getCategories();
  const brands = marketplaceStore.getBrands();
  const distributorCompanies = marketplaceStore.getDistributorCompanies("dist_1");
  const allCatalogProducts = marketplaceStore.getProducts();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Basic Product Info & Principal Company
  const [title, setTitle] = useState("");

  // Principal Company Selection (My Companies vs txt item vs not choose)
  const [companyMode, setCompanyMode] = useState<"SELECT" | "CUSTOM" | "NONE">(
    initialCompany ? "CUSTOM" : distributorCompanies.length > 0 ? "SELECT" : "CUSTOM"
  );
  const [companyName, setCompanyName] = useState(
    initialCompany || (distributorCompanies[0]?.name || "Unilever Nepal Ltd.")
  );
  const [customCompanyName, setCustomCompanyName] = useState(initialCompany);

  // Category Selection (Choose vs txt item)
  const [categoryMode, setCategoryMode] = useState<"SELECT" | "CUSTOM">("SELECT");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "cat_snack");
  const [customCategory, setCustomCategory] = useState("");

  // Brand Selection (Choose vs txt item vs not choose)
  const [brandMode, setBrandMode] = useState<"SELECT" | "CUSTOM" | "NONE">("SELECT");
  const [brandId, setBrandId] = useState(brands[0]?.id || "b_waiwai");
  const [customBrand, setCustomBrand] = useState("");

  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [description, setDescription] = useState("");

  // Image Upload State (Device Upload vs URL vs Presets)
  const [imageUploadMode, setImageUploadMode] = useState<"DEVICE" | "URL">("DEVICE");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1542838132-92c53300491e?w=600");
  const [imageFileName, setImageFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [hasTierPricing, setHasTierPricing] = useState(true);
  const [tierPricing, setTierPricing] = useState([
    { minQty: 2, maxQty: 9, pricePerCarton: 660 },
    { minQty: 10, maxQty: 29, pricePerCarton: 645 },
    { minQty: 30, maxQty: undefined as number | undefined, pricePerCarton: 630 },
  ]);

  // Primary Free Goods Scheme (Buy X Get Y Free / Buy 1 Get Another Free / Free Unselling Item)
  const [hasFreeScheme, setHasFreeScheme] = useState(true);
  const [freeSchemeType, setFreeSchemeType] = useState<"SAME_PRODUCT" | "ANOTHER_PRODUCT" | "UNSELLING_ITEM">("SAME_PRODUCT");
  const [freeSchemeMinQty, setFreeSchemeMinQty] = useState(5); // e.g. Buy 5 Get 1 Free
  const [freeItemName, setFreeItemName] = useState("Carton of Wai Wai Quick Chicken (30 Pcs)");
  const [freeItemQty, setFreeItemQty] = useState(1);
  const [freeProductId, setFreeProductId] = useState(allCatalogProducts[1]?.id || "");
  const [freeItemSku, setFreeItemSku] = useState(allCatalogProducts[1]?.sku || "");
  const [unsellingPreset, setUnsellingPreset] = useState("CUSTOM");

  // Secondary / Additional Attached Unselling Clearance Bonus
  const [hasUnsellingBonus, setHasUnsellingBonus] = useState(false);
  const [unsellingItemName, setUnsellingItemName] = useState("Unsold Strawberry Glucose Biscuits 100g (Carton of 24) [Clearance Stock]");
  const [unsellingItemMinQty, setUnsellingItemMinQty] = useState(3);
  const [unsellingItemQty, setUnsellingItemQty] = useState(1);
  const [unsellingItemTag, setUnsellingItemTag] = useState("Slow-Moving Clearance Stock");

  // Spot Cash / CD Discount %
  const [cashDiscountPercent, setCashDiscountPercent] = useState(2.0);

  // Promotional Gift Scheme
  const [promotionalGift, setPromotionalGift] = useState("Free CG Branded Apron & Metal Display Rack on 15+ Cartons");

  // Campaign / Festive Tag
  const [festivalTag, setFestivalTag] = useState("Buy 5 Get 1 Free Mega Deal");

  // 4. Compliance, Tax & Terms
  const [taxCategory, setTaxCategory] = useState<"TAXABLE_13" | "VAT_EXEMPT">("TAXABLE_13");
  const [hsnCode, setHsnCode] = useState("1902.30.00");
  const [shelfLife, setShelfLife] = useState("9 Months from Mfg Date");
  const [creditTerms, setCreditTerms] = useState("Cash on Delivery / Spot QR (2% CD) or 7-Day Authorized Credit");
  const [returnPolicy, setReturnPolicy] = useState("48-Hour Damage Claim & Sealed Carton Replacement Guarantee");

  // Device File Upload Handler
  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file (PNG, JPG, WEBP)");
      return;
    }

    setIsUploading(true);
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read image file from device");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Auto Generate SKU helper
  const handleAutoGenerateSku = () => {
    const effectiveComp = companyMode === "CUSTOM" ? customCompanyName : companyName;
    const prefix = effectiveComp ? effectiveComp.split(" ")[0].slice(0, 3).toUpperCase() : "SKU";
    const rand = Math.floor(1000 + Math.random() * 9000);
    setSku(`${prefix}-${rand}`);
  };

  const imagePresets = [
    { label: "Noodles", url: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600" },
    { label: "Beverages", url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600" },
    { label: "Fruit Juice", url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600" },
    { label: "Biscuits", url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600" },
    { label: "Cooking Oil", url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600" },
    { label: "Soaps & Hygiene", url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600" },
    { label: "Dairy Ghee", url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600" },
  ];

  const packSizePresets = [
    "30 Pcs x 75g",
    "24 Bottles x 250ml",
    "12 Packs x 1L",
    "20 Packs x 500g",
    "48 Bars x 125g",
    "10 Bags x 5kg",
    "60 Pcs x 50g",
  ];

  // Quick Preset Handlers
  const applyPresetBuy5Get1 = () => {
    setHasFreeScheme(true);
    setFreeSchemeType("SAME_PRODUCT");
    setFreeSchemeMinQty(5);
    setFreeItemQty(1);
    setFreeItemName(title ? `Carton of ${title}` : "Carton of this Product (Free Bonus)");
    setFestivalTag("Buy 5 Get 1 Free Mega Deal");
  };

  const applyPresetBuy1GetAnother = () => {
    setHasFreeScheme(true);
    setFreeSchemeType("ANOTHER_PRODUCT");
    setFreeSchemeMinQty(1);
    setFreeItemQty(1);
    const target = allCatalogProducts.find((p) => p.id === freeProductId) || allCatalogProducts[1] || allCatalogProducts[0];
    if (target) {
      setFreeProductId(target.id);
      setFreeItemName(`${target.title} (${target.packSize || target.unitsPerCarton + " Pcs"})`);
      setFreeItemSku(target.sku);
    }
    setFestivalTag("Buy 1 Get Another Item Free Deal");
  };

  const applyPresetUnsellingItem = () => {
    setHasFreeScheme(true);
    setFreeSchemeType("UNSELLING_ITEM");
    setFreeSchemeMinQty(2);
    setFreeItemQty(1);
    setFreeItemName("Unsold Monsoon Biscuits 100g (Pack of 24) [Clearance Stock]");
    setFestivalTag("Clearance Dead-Stock Freebie Deal");
  };

  const applyPreset10Plus1 = () => {
    setHasFreeScheme(true);
    setFreeSchemeType("SAME_PRODUCT");
    setFreeSchemeMinQty(10);
    setFreeItemQty(1);
    setFreeItemName(title ? `Carton of ${title}` : "Carton of this Product");
    setFestivalTag("10+1 Trade Scheme");
  };

  const handleSelectAnotherProduct = (id: string) => {
    setFreeProductId(id);
    const found = allCatalogProducts.find((p) => p.id === id);
    if (found) {
      setFreeItemName(`${found.title} (${found.packSize || found.unitsPerCarton + " Pcs"})`);
      setFreeItemSku(found.sku);
    }
  };

  const handleSelectUnsellingPreset = (presetKey: string) => {
    setUnsellingPreset(presetKey);
    if (presetKey === "UNSOLD_BISCUITS") {
      setFreeItemName("Unsold Fruit & Glucose Biscuits 100g (Carton of 24) [Overstock Clearance]");
    } else if (presetKey === "UNSOLD_JUICE") {
      setFreeItemName("Near-Expiry Fruit Nectar 200ml (Tray of 12) [30-Day Expiry Liquidation]");
    } else if (presetKey === "UNSOLD_NOODLES") {
      setFreeItemName("Slow-Moving Spicy Noodles 70g (Carton of 30) [Dead-Stock Clearance]");
    } else if (presetKey === "PROMO_MERCH") {
      setFreeItemName("Branded Promo Umbrella & Counter Metal Display Stand");
    }
  };

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
      const effectiveCompany =
        companyMode === "NONE" ? undefined : companyMode === "CUSTOM" ? customCompanyName : companyName;
      const effectiveCategory = categoryMode === "CUSTOM" ? customCategory : undefined;
      const effectiveBrand = brandMode === "NONE" ? "Generic / Direct" : brandMode === "CUSTOM" ? customBrand : undefined;

      const payload = {
        title,
        companyName: effectiveCompany,
        categoryId: categoryMode === "CUSTOM" ? "cat_custom" : categoryId,
        customCategory: effectiveCategory,
        brandId: brandMode === "CUSTOM" || brandMode === "NONE" ? "b_custom" : brandId,
        customBrand: effectiveBrand,
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
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
        barcode,
        isFeatured: false,

        // Offers and schemes
        hasFreeScheme,
        freeSchemeMinQty: hasFreeScheme ? Number(freeSchemeMinQty) : undefined,
        freeItemName: hasFreeScheme ? freeItemName : undefined,
        freeItemQty: hasFreeScheme ? Number(freeItemQty) : undefined,
        freeSchemeType: hasFreeScheme ? freeSchemeType : "SAME_PRODUCT",
        freeProductId: hasFreeScheme && freeSchemeType === "ANOTHER_PRODUCT" ? freeProductId : undefined,
        freeItemSku: hasFreeScheme && freeSchemeType === "ANOTHER_PRODUCT" ? freeItemSku : undefined,
        hasUnsellingBonus,
        unsellingItemName: hasUnsellingBonus ? unsellingItemName : undefined,
        unsellingItemMinQty: hasUnsellingBonus ? Number(unsellingItemMinQty) : undefined,
        unsellingItemQty: hasUnsellingBonus ? Number(unsellingItemQty) : undefined,
        unsellingItemTag: hasUnsellingBonus ? unsellingItemTag : undefined,
        cashDiscountPercent: Number(cashDiscountPercent),
        promotionalGift,
        festivalTag,
        taxCategory,
        hsnCode,
        shelfLife,
        creditTerms,
        returnPolicy,
        tierPricing: hasTierPricing
          ? tierPricing.map((t) => ({
              minQty: Number(t.minQty),
              maxQty: t.maxQty ? Number(t.maxQty) : undefined,
              pricePerCarton: Number(t.pricePerCarton),
            }))
          : [],
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
            Set company dealership, upload images from your device, configure flexible text fields & wholesale schemes
          </p>
        </div>

        <Link href="/distributor/companies">
          <Button variant="outline" size="sm" className="text-xs font-bold flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#0759C7]" />
            <span>My Companies</span>
          </Button>
        </Link>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Basic Product Identity, Principal Company & Image Upload */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-soft space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#102C55] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#0759C7]" />
              1. Basic Product Identity & Principal Company
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Catalog Identity</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* 1A: PRINCIPAL COMPANY / DEALERSHIP SELECTION */}
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="font-bold text-[#102C55] flex items-center gap-1.5 text-xs">
                  <Building2 className="w-4 h-4 text-[#0759C7]" />
                  Principal Company / Manufacturer (कुन कम्पनीको डिलरशिप सामान हो?):
                </label>

                {/* Flexible mode switch buttons: Choose vs txt item vs not choose */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setCompanyMode("SELECT")}
                    className={`px-2 py-0.5 rounded font-semibold transition-all ${
                      companyMode === "SELECT"
                        ? "bg-[#0759C7] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🏢 Choose from My Companies
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompanyMode("CUSTOM")}
                    className={`px-2 py-0.5 rounded font-semibold transition-all ${
                      companyMode === "CUSTOM"
                        ? "bg-[#0759C7] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ✍️ Type Company (txt item)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompanyMode("NONE")}
                    className={`px-2 py-0.5 rounded font-semibold transition-all ${
                      companyMode === "NONE"
                        ? "bg-slate-700 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    ✕ Not Choose
                  </button>
                </div>
              </div>

              {companyMode === "SELECT" && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <select
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-[#0759C7]"
                  >
                    {distributorCompanies.length > 0 ? (
                      distributorCompanies.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} {c.agencyCode ? `(${c.agencyCode})` : ""} - {c.category}
                        </option>
                      ))
                    ) : (
                      <option value="Unilever Nepal Ltd.">Unilever Nepal Ltd.</option>
                    )}
                  </select>

                  <Link
                    href="/distributor/companies"
                    className="text-xs text-[#0759C7] hover:underline font-bold flex items-center justify-center gap-1 bg-white px-3 py-2 rounded-lg border border-blue-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Manage / Add Companies</span>
                  </Link>
                </div>
              )}

              {companyMode === "CUSTOM" && (
                <div className="space-y-1">
                  <Input
                    label="Type Company Name (e.g. Unilever Nepal, Dabur Nepal, Patanjali, CG Foods)"
                    value={customCompanyName}
                    onChange={(e) => setCustomCompanyName(e.target.value)}
                    placeholder="e.g. Unilever Nepal Ltd., Dabur Nepal, Nestlé, Amul"
                    required={companyMode === "CUSTOM"}
                  />
                  <p className="text-[10px] text-slate-500">
                    Freely type any principal manufacturing company or agency name without needing to register it first.
                  </p>
                </div>
              )}

              {companyMode === "NONE" && (
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
                  <span>No company specified. Product will be listed under direct wholesale distributor catalog.</span>
                  <button
                    type="button"
                    onClick={() => setCompanyMode("SELECT")}
                    className="text-[#0759C7] font-bold hover:underline"
                  >
                    Select Company
                  </button>
                </div>
              )}
            </div>

            {/* 1B: Product Title */}
            <div>
              <Input
                label="Wholesale Product Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Wai Wai Quick Chicken Instant Noodles (Carton of 30)"
                required
              />
            </div>

            {/* 1C: Category & Brand with txt item / not choose buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#102C55]">Wholesale Category *</label>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setCategoryMode("SELECT")}
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        categoryMode === "SELECT" ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      Choose List
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setCategoryMode("CUSTOM")}
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        categoryMode === "CUSTOM" ? "bg-blue-100 text-[#0759C7]" : "text-slate-400 hover:text-[#0759C7]"
                      }`}
                    >
                      ✍️ Type Custom (txt item)
                    </button>
                  </div>
                </div>

                {categoryMode === "SELECT" ? (
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
                ) : (
                  <Input
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Type category (e.g. Herbal, Baby Care, Sweets)"
                    required={categoryMode === "CUSTOM"}
                  />
                )}
              </div>

              {/* Brand */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#102C55]">Brand Name</label>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setBrandMode("SELECT")}
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        brandMode === "SELECT" ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      Choose List
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setBrandMode("CUSTOM")}
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        brandMode === "CUSTOM" ? "bg-blue-100 text-[#0759C7]" : "text-slate-400 hover:text-[#0759C7]"
                      }`}
                    >
                      ✍️ Type Custom
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setBrandMode("NONE")}
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        brandMode === "NONE" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      ✕ Not Choose
                    </button>
                  </div>
                </div>

                {brandMode === "SELECT" ? (
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
                ) : brandMode === "CUSTOM" ? (
                  <Input
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    placeholder="Type brand name (e.g. Lifebuoy, Sunsilk, Maggi)"
                    required={brandMode === "CUSTOM"}
                  />
                ) : (
                  <div className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-slate-400 text-xs font-semibold">
                    Generic / No Brand Selected
                  </div>
                )}
              </div>
            </div>

            {/* 1D: SKU & Barcode with auto-generate & not choose buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#102C55]">Distributor SKU Code *</label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateSku}
                    className="text-[10px] text-[#0759C7] font-bold hover:underline flex items-center gap-0.5"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Auto-Generate SKU</span>
                  </button>
                </div>
                <Input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. CG-WW-CHK-30"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#102C55]">Barcode / EAN Code</label>
                  <button
                    type="button"
                    onClick={() => setBarcode("")}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-medium"
                  >
                    ✕ Not Choose / Clear
                  </button>
                </div>
                <Input
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="e.g. 890123000101 (or leave blank)"
                />
              </div>
            </div>

            {/* 1E: DEVICE IMAGE UPLOAD & IMAGE URL PREVIEW */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="font-bold text-xs text-[#102C55] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#0759C7]" />
                  Product Photo (फोटो अपलोड गर्नुहोस् - Device Upload supported):
                </label>

                {/* Mode Toggles */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setImageUploadMode("DEVICE")}
                    className={`px-2.5 py-0.5 rounded font-bold transition-all flex items-center gap-1 ${
                      imageUploadMode === "DEVICE"
                        ? "bg-[#0759C7] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadMode("URL")}
                    className={`px-2.5 py-0.5 rounded font-bold transition-all ${
                      imageUploadMode === "URL"
                        ? "bg-[#0759C7] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🌐 Image URL / Presets
                  </button>
                </div>
              </div>

              {/* Mode 1: Device Upload Zone */}
              {imageUploadMode === "DEVICE" && (
                <div className="space-y-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleDeviceUpload}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-blue-300 hover:border-[#0759C7] bg-white rounded-xl p-5 text-center cursor-pointer transition-all hover:bg-blue-50/40 space-y-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0759C7] flex items-center justify-center mx-auto">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800">
                        Click to browse or drag & drop photo from your computer or phone
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Supports PNG, JPG, JPEG, WEBP • Fast client-side image processing
                      </p>
                    </div>
                    {imageFileName && (
                      <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        Selected: {imageFileName}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Mode 2: URL Input & 1-Click Presets */}
              {imageUploadMode === "URL" && (
                <div className="space-y-3">
                  <Input
                    label="Image Web URL *"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                  />

                  {/* Quick 1-Click Wholesale Presets */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Or Pick Quick FMCG Photo Preset:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {imagePresets.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          className={`text-[11px] px-2 py-0.5 rounded border font-semibold transition-all ${
                            imageUrl === preset.url
                              ? "bg-[#0759C7] text-white border-blue-700"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Image Preview Box */}
              {imageUrl && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt="Product preview"
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Active Product Image</span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Image ready for catalog display
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-[#0759C7] font-bold hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Change Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="text-xs text-red-600 font-bold hover:underline p-1"
                      title="Clear image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 1F: Product Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#102C55]">Product Description</label>
                <button
                  type="button"
                  onClick={() =>
                    setDescription(
                      `Fresh wholesale stock of ${title || "packaged goods"}. Sealed master carton directly sourced from authorized manufacturer with full trade quality guarantee.`
                    )
                  }
                  className="text-[10px] text-[#0759C7] font-bold hover:underline"
                >
                  ⚡ Auto-fill Description
                </button>
              </div>
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
            <div className="sm:col-span-3 space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="text-xs font-semibold text-[#102C55]">Pack Size / Weight *</label>
                {/* Pack Size Presets */}
                <div className="flex flex-wrap gap-1 text-[10px]">
                  <span className="text-slate-400">Presets:</span>
                  {packSizePresets.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setPackSize(size)}
                      className={`px-1.5 py-0.2 rounded border font-mono ${
                        packSize === size ? "bg-[#0759C7] text-white border-blue-700" : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <Input
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

            <div className="sm:col-span-3 flex items-center p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-slate-700">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-200">
            <div>
              <h3 className="font-black text-base text-[#102C55] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F58220]" />
                3. Market Offers, Schemes & Volume Discounts (बजारमा चल्ने छुट तथा अफरहरू)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure tiered quantity breaks, buy-get-free schemes, spot cash discounts, and festive gifts
              </p>
            </div>

            {/* Quick Not Choose / None button for offers */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-orange-200">
              <button
                type="button"
                onClick={() => setHasFreeScheme(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  hasFreeScheme ? "bg-[#F58220] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🎁 Configure Offer
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasFreeScheme(false);
                  setHasUnsellingBonus(false);
                  setCashDiscountPercent(0);
                  setPromotionalGift("");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  !hasFreeScheme ? "bg-slate-700 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                ✕ Not Choose (अफर नराख्ने)
              </button>
            </div>
          </div>

          {/* 3A: Volume Tier Pricing Slabs with Not Choose option */}
          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-[#102C55] flex items-center gap-1.5 uppercase tracking-wider">
                  <BadgePercent className="w-4 h-4 text-[#0759C7]" />
                  A. Volume Tier Pricing Slabs (परिमाण अनुसारको स्ल्याब छुट)
                </h4>
                <p className="text-[11px] text-slate-500">Reward retail stores with higher margins for larger bulk orders</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHasTierPricing(!hasTierPricing)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-bold ${
                    hasTierPricing ? "bg-slate-100 text-slate-600 border-slate-300" : "bg-slate-800 text-white"
                  }`}
                >
                  {hasTierPricing ? "✕ Not Choose (Single Price Only)" : "✓ Enable Slabs"}
                </button>
                {hasTierPricing && (
                  <Button type="button" variant="outline" size="sm" onClick={addTierSlab} className="text-xs h-8">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Slab
                  </Button>
                )}
              </div>
            </div>

            {hasTierPricing ? (
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
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg text-slate-500 text-xs">
                Slab discounts disabled. All orders will be priced at standard wholesale rate (Rs. {wholesalePrice}/ctn).
              </div>
            )}
          </div>

          {/* 3B: REAL-MARKET FREE GOODS & SCHEMES (Buy 5 Get 1, Buy 1 Get Another Free, Free Unselling Item) */}
          <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-sm text-[#102C55] flex items-center gap-2 uppercase tracking-wider">
                  <Gift className="w-4 h-4 text-emerald-600" />
                  B. Free Goods & Promotional Scheme Builder (निःशुल्क सामान तथा बोनस योजना)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Configure "Buy 5 Get 1 Free", "Buy 1 Get Another Item Free", or list free unselling / clearance stock
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  checked={hasFreeScheme}
                  onChange={(e) => setHasFreeScheme(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0759C7]"
                />
                <span className="text-xs font-bold text-slate-800">Enable Free Scheme</span>
              </label>
            </div>

            {hasFreeScheme && (
              <div className="space-y-5">
                {/* 1-Click Quick Presets */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">
                    ⚡ 1-Click Scheme Quick Presets (एक-क्लिक अफर सेटिङ):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={applyPresetBuy5Get1}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        freeSchemeType === "SAME_PRODUCT" && freeSchemeMinQty === 5
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Buy 5 Get 1 Free (Same Item)</span>
                    </button>

                    <button
                      type="button"
                      onClick={applyPresetBuy1GetAnother}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        freeSchemeType === "ANOTHER_PRODUCT"
                          ? "bg-[#0759C7] text-white border-blue-800 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <PackagePlus className="w-3.5 h-3.5" />
                      <span>Buy 1 Get Another Item Free</span>
                    </button>

                    <button
                      type="button"
                      onClick={applyPresetUnsellingItem}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        freeSchemeType === "UNSELLING_ITEM"
                          ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <Boxes className="w-3.5 h-3.5" />
                      <span>Free Unselling / Clearance Item</span>
                    </button>

                    <button
                      type="button"
                      onClick={applyPreset10Plus1}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        freeSchemeType === "SAME_PRODUCT" && freeSchemeMinQty === 10
                          ? "bg-emerald-700 text-white border-emerald-800 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>10+1 Standard FMCG Scheme</span>
                    </button>
                  </div>
                </div>

                {/* Scheme Mode Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Mode 1: Same Product */}
                  <div
                    onClick={() => {
                      setFreeSchemeType("SAME_PRODUCT");
                      if (freeSchemeMinQty < 2) setFreeSchemeMinQty(5);
                    }}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all space-y-1.5 ${
                      freeSchemeType === "SAME_PRODUCT"
                        ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-200"
                        : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                        <Gift className="w-4 h-4" />
                      </span>
                      {freeSchemeType === "SAME_PRODUCT" && (
                        <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-xs text-[#102C55]">1. Same Product Free (Buy X Get Y)</p>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Retailer gets free carton(s) of this product (e.g., Buy 5 Get 1 Free, 10+1).
                    </p>
                  </div>

                  {/* Mode 2: Another Catalog Product */}
                  <div
                    onClick={() => {
                      setFreeSchemeType("ANOTHER_PRODUCT");
                      if (!freeProductId && allCatalogProducts.length > 0) {
                        const target = allCatalogProducts[1] || allCatalogProducts[0];
                        setFreeProductId(target.id);
                        setFreeItemName(`${target.title} (${target.packSize || target.unitsPerCarton + " Pcs"})`);
                        setFreeItemSku(target.sku);
                      }
                    }}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all space-y-1.5 ${
                      freeSchemeType === "ANOTHER_PRODUCT"
                        ? "border-[#0759C7] bg-blue-50/60 ring-2 ring-blue-200"
                        : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-1.5 bg-blue-100 text-[#0759C7] rounded-lg">
                        <PackagePlus className="w-4 h-4" />
                      </span>
                      {freeSchemeType === "ANOTHER_PRODUCT" && (
                        <span className="text-[10px] font-black uppercase text-[#0759C7] bg-blue-100 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-xs text-[#102C55]">2. Buy 1 Get Another Item Free</p>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Retailer buys this SKU and receives a different product from your catalog free.
                    </p>
                  </div>

                  {/* Mode 3: Unselling / Dead Stock Clearance */}
                  <div
                    onClick={() => {
                      setFreeSchemeType("UNSELLING_ITEM");
                      if (unsellingPreset === "CUSTOM" && !freeItemName) {
                        setFreeItemName("Unsold Fruit Biscuits 100g (Pack of 24) [Clearance]");
                      }
                    }}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all space-y-1.5 ${
                      freeSchemeType === "UNSELLING_ITEM"
                        ? "border-purple-600 bg-purple-50/60 ring-2 ring-purple-200"
                        : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-1.5 bg-purple-100 text-purple-800 rounded-lg">
                        <Boxes className="w-4 h-4" />
                      </span>
                      {freeSchemeType === "UNSELLING_ITEM" && (
                        <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-xs text-[#102C55]">3. Free Unselling Item Scheme</p>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Liquidate slow-moving FMCG items, dead stock, or near-expiry batches as free gifts!
                    </p>
                  </div>
                </div>

                {/* SCHEME CONFIGURATION FORM BASED ON ACTIVE MODE */}
                {/* 1. SAME PRODUCT SCHEME FIELDS */}
                {freeSchemeType === "SAME_PRODUCT" && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-emerald-700" />
                        Option 1: Buy X Get Y Free of THIS Product (५ किन्दा १ फ्रि योजना)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        Scheme: {freeSchemeMinQty} + {freeItemQty} Free
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Buy Minimum Cartons (X) *
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={freeSchemeMinQty}
                            onChange={(e) => setFreeSchemeMinQty(Number(e.target.value))}
                            placeholder="5"
                            required
                          />
                          <div className="flex gap-1">
                            {[5, 10, 12, 20].map((qtyVal) => (
                              <button
                                key={qtyVal}
                                type="button"
                                onClick={() => setFreeSchemeMinQty(qtyVal)}
                                className={`px-2 py-1 text-[10px] font-bold rounded border ${
                                  freeSchemeMinQty === qtyVal
                                    ? "bg-emerald-600 text-white border-emerald-700"
                                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                                }`}
                              >
                                {qtyVal}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Quantity of Cartons Free (Y) *
                        </label>
                        <Input
                          type="number"
                          value={freeItemQty}
                          onChange={(e) => setFreeItemQty(Number(e.target.value))}
                          placeholder="1"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Free Item Label Description
                        </label>
                        <Input
                          value={freeItemName}
                          onChange={(e) => setFreeItemName(e.target.value)}
                          placeholder="e.g. Carton of Wai Wai Chicken (30 Pcs)"
                        />
                      </div>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                      <span>
                        Retailer Offer: Buy <strong>{freeSchemeMinQty} Cartons</strong> of {title || "this product"}, receive <strong>+{freeItemQty} Carton FREE!</strong>
                      </span>
                      <span className="font-bold text-emerald-700">
                        Extra {Math.round((freeItemQty / (freeSchemeMinQty + freeItemQty)) * 100)}% Volume Margin for Retailer
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. ANOTHER CATALOG PRODUCT FREE FIELDS */}
                {freeSchemeType === "ANOTHER_PRODUCT" && (
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#102C55] flex items-center gap-1.5">
                        <PackagePlus className="w-4 h-4 text-[#0759C7]" />
                        Option 2: Buy 1 Get Another Item Free (१ किन्दा अर्को सामान फ्रि योजना)
                      </span>
                      <span className="text-[10px] font-mono text-[#0759C7] bg-white px-2 py-0.5 rounded border border-blue-200">
                        Cross-Product Promotion
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Buy Minimum Cartons of This Product (X) *
                        </label>
                        <Input
                          type="number"
                          value={freeSchemeMinQty}
                          onChange={(e) => setFreeSchemeMinQty(Number(e.target.value))}
                          placeholder="1"
                          required
                        />
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Set to 1 for "Buy 1 Get Another Item Free"
                        </span>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Select Another Item from Catalog to Give Free *
                        </label>
                        <select
                          value={freeProductId}
                          onChange={(e) => handleSelectAnotherProduct(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-[#0759C7]"
                        >
                          <option value="">-- Choose Catalog Item --</option>
                          {allCatalogProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.title} • {p.brandName} (SKU: {p.sku}) - {formatNPR(p.wholesalePrice)}/ctn
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Quantity of Free Item Given (Y) *
                        </label>
                        <Input
                          type="number"
                          value={freeItemQty}
                          onChange={(e) => setFreeItemQty(Number(e.target.value))}
                          placeholder="1"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Free Product Description / Note
                        </label>
                        <Input
                          value={freeItemName}
                          onChange={(e) => setFreeItemName(e.target.value)}
                          placeholder="e.g. Free 1L Real Juice Carton on buying 1 Carton"
                        />
                      </div>
                    </div>

                    {/* Preview of Selected Cross-Product */}
                    {freeProductId && (
                      <div className="p-3 bg-white rounded-lg border border-blue-200 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          {allCatalogProducts.find((p) => p.id === freeProductId)?.images[0] && (
                            <img
                              src={allCatalogProducts.find((p) => p.id === freeProductId)?.images[0]}
                              alt="Free item"
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                            />
                          )}
                          <div>
                            <span className="font-bold text-slate-900 block">
                              Gifted Item: {freeItemName}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              SKU: {freeItemSku || "CROSS-PROD"} • {freeItemQty} Free Unit/Carton with every {freeSchemeMinQty} purchased
                            </span>
                          </div>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded">
                          Freebie Ready
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. FREE UNSELLING / CLEARANCE STOCK SCHEME */}
                {freeSchemeType === "UNSELLING_ITEM" && (
                  <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-purple-950 flex items-center gap-1.5">
                        <Boxes className="w-4 h-4 text-purple-700" />
                        Option 3: Free Unselling / Clearance Stock Scheme (नबिकेको सामान क्लियरिन्स योजना)
                      </span>
                      <span className="text-[10px] font-mono text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                        Dead-Stock Liquidation
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Use this to clear out slow-moving items, off-season stock, near-expiry batches, or surplus promo inventory by gifting them free to retailers who buy this product.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Buy Minimum Cartons of This Product (X) *
                        </label>
                        <Input
                          type="number"
                          value={freeSchemeMinQty}
                          onChange={(e) => setFreeSchemeMinQty(Number(e.target.value))}
                          placeholder="2"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Choose Unselling Stock Preset (or enter custom)
                        </label>
                        <select
                          value={unsellingPreset}
                          onChange={(e) => handleSelectUnsellingPreset(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-purple-600"
                        >
                          <option value="CUSTOM">-- Type Custom Unselling / Dead Stock Item Below --</option>
                          <option value="UNSOLD_BISCUITS">Unsold Fruit & Glucose Biscuits 100g (Carton of 24) [Overstock Clearance]</option>
                          <option value="UNSOLD_JUICE">Near-Expiry Fruit Nectar 200ml (Tray of 12) [30-Day Expiry Liquidation]</option>
                          <option value="UNSOLD_NOODLES">Slow-Moving Spicy Noodles 70g (Carton of 30) [Dead-Stock Clearance]</option>
                          <option value="PROMO_MERCH">Branded Promo Umbrella & Counter Metal Display Stand</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Free Unselling Item Title & Packaging Spec *
                        </label>
                        <Input
                          value={freeItemName}
                          onChange={(e) => setFreeItemName(e.target.value)}
                          placeholder="e.g. Unsold Fruit Biscuits 100g (Pack of 24) [Clearance Stock]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Quantity of Free Items (Y) *
                        </label>
                        <Input
                          type="number"
                          value={freeItemQty}
                          onChange={(e) => setFreeItemQty(Number(e.target.value))}
                          placeholder="1"
                          required
                        />
                      </div>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-purple-200 text-xs text-purple-950 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-purple-600" />
                        <span>Retailer receives <strong>{freeItemQty}x {freeItemName}</strong> free on ordering {freeSchemeMinQty}+ cartons.</span>
                      </span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                        Inventory Clearance
                      </span>
                    </div>
                  </div>
                )}

                {/* ADDITIONAL TOGGLE: ATTACH DEDICATED UNSELLING / CLEARANCE GIFT */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                        <Boxes className="w-3.5 h-3.5 text-[#F58220]" />
                        Also Attach Separate Free Unselling / Clearance Gift (नबिकेको अतिरिक्त सामान उपहार)
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Optional: Attach an extra clearance item or promo gift to be delivered with this product
                      </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasUnsellingBonus}
                        onChange={(e) => setHasUnsellingBonus(e.target.checked)}
                        className="w-4 h-4 rounded text-[#F58220]"
                      />
                      <span className="text-xs font-bold text-slate-700">Attach Unselling Item</span>
                    </label>
                  </div>

                  {hasUnsellingBonus && (
                    <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Unselling / Clearance Item Name *
                        </label>
                        <Input
                          value={unsellingItemName}
                          onChange={(e) => setUnsellingItemName(e.target.value)}
                          placeholder="e.g. Unsold Strawberry Biscuits 100g (Carton of 24) [Clearance Stock]"
                          required={hasUnsellingBonus}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Clearance Reason Tag
                        </label>
                        <select
                          value={unsellingItemTag}
                          onChange={(e) => setUnsellingItemTag(e.target.value)}
                          className="w-full h-10 px-2.5 rounded-lg border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-[#F58220]"
                        >
                          <option value="Slow-Moving Clearance Stock">Slow-Moving Clearance Stock</option>
                          <option value="Dead-Stock Liquidation">Dead-Stock Liquidation</option>
                          <option value="Near-Expiry Special Bonus">Near-Expiry Special Bonus (30-60 Days)</option>
                          <option value="Promotional Gift Merchandise">Promotional Gift Merchandise</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Min Cartons Ordered to Get Gift *
                        </label>
                        <Input
                          type="number"
                          value={unsellingItemMinQty}
                          onChange={(e) => setUnsellingItemMinQty(Number(e.target.value))}
                          placeholder="3"
                          required={hasUnsellingBonus}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Quantity of Gift Given *
                        </label>
                        <Input
                          type="number"
                          value={unsellingItemQty}
                          onChange={(e) => setUnsellingItemQty(Number(e.target.value))}
                          placeholder="1"
                          required={hasUnsellingBonus}
                        />
                      </div>

                      <div className="flex items-center text-[11px] text-orange-900 bg-white p-2.5 rounded-lg border border-orange-200">
                        <span>
                          🎁 Retailers ordering <strong>{unsellingItemMinQty}+ cartons</strong> will automatically receive <strong>+{unsellingItemQty} {unsellingItemName}</strong>!
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* LIVE RETAILER PREVIEW BOX */}
                <div className="p-4 bg-gradient-to-r from-slate-900 to-[#102C55] text-white rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Live Retailer Offer Preview (खुद्रा व्यापारीले देख्ने अफर ब्यानर):
                    </span>
                    <span className="text-[10px] bg-[#F58220] font-black px-2 py-0.5 rounded">
                      Live Preview
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {freeSchemeType === "SAME_PRODUCT" && (
                      <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                        <Gift className="w-3.5 h-3.5" />
                        BUY {freeSchemeMinQty} GET {freeItemQty} FREE (SAME PRODUCT)
                      </span>
                    )}

                    {freeSchemeType === "ANOTHER_PRODUCT" && (
                      <span className="inline-flex items-center gap-1 bg-blue-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                        <PackagePlus className="w-3.5 h-3.5" />
                        BUY {freeSchemeMinQty} GET {freeItemQty} FREE: {freeItemName}
                      </span>
                    )}

                    {freeSchemeType === "UNSELLING_ITEM" && (
                      <span className="inline-flex items-center gap-1 bg-purple-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                        <Boxes className="w-3.5 h-3.5" />
                        FREE CLEARANCE ITEM: {freeItemName} (BUY {freeSchemeMinQty}+ CTNS)
                      </span>
                    )}

                    {hasUnsellingBonus && (
                      <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        +{unsellingItemQty} {unsellingItemName} (ON {unsellingItemMinQty}+ CTNS)
                      </span>
                    )}

                    {Boolean(cashDiscountPercent && cashDiscountPercent > 0) && (
                      <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                        <Percent className="w-3.5 h-3.5" />
                        {cashDiscountPercent}% SPOT CASH/QR CD
                      </span>
                    )}
                  </div>
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
