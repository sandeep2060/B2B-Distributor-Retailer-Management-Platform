"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import marketplaceStore from "@/lib/db/store";
import { formatNPR } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Package,
  Building2,
  Tag,
  Percent,
  Gift,
  Eye,
  RefreshCw,
  X,
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const distributorId = "dist_1";

  // Preloaded data for dropdowns
  const categories = marketplaceStore.getCategories();
  const distributorCompanies = marketplaceStore.getDistributorCompanies(distributorId);

  // Form State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Basic Info
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState(
    distributorCompanies[0]?.name || "Unilever Nepal Ltd."
  );
  const [isCustomCompany, setIsCustomCompany] = useState(false);
  const [customCompanyName, setCustomCompanyName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "cat_snack");
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");

  // 2. Packaging & Units
  const [unitType, setUnitType] = useState<
    "CARTON" | "BOX" | "PACK" | "BAG" | "BOTTLE" | "CAN"
  >("CARTON");
  const [packSize, setPackSize] = useState("30 Pcs x 75g");
  const [unitsPerCarton, setUnitsPerCarton] = useState(30);

  // 3. Pricing & VAT
  const [wholesalePrice, setWholesalePrice] = useState<number | "">(650);
  const [cartonMrp, setCartonMrp] = useState<number | "">(750);
  const [taxCategory, setTaxCategory] = useState<"TAXABLE_13" | "VAT_EXEMPT">("TAXABLE_13");

  // 4. Inventory & Identifiers
  const [stockQuantity, setStockQuantity] = useState<number | "">(150);
  const [minOrderQty, setMinOrderQty] = useState<number | "">(2);
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");

  // 5. Product Image
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"
  );
  const [imageUploadType, setImageUploadType] = useState<"UPLOAD" | "URL">("UPLOAD");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 6. Optional Wholesale Scheme / Offer
  const [enableScheme, setEnableScheme] = useState(false);
  const [schemeType, setSchemeType] = useState<"FREE_ITEM" | "CASH_DISCOUNT">("FREE_ITEM");
  const [freeSchemeMinQty, setFreeSchemeMinQty] = useState<number>(5);
  const [freeItemQty, setFreeItemQty] = useState<number>(1);
  const [freeItemName, setFreeItemName] = useState("Same Product (1 Carton Free)");
  const [cashDiscountPercent, setCashDiscountPercent] = useState<number>(2.5);

  // Auto-generate SKU helper
  const handleAutoGenerateSku = () => {
    const prefix = companyName.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "FMC");
    const num = Math.floor(100 + Math.random() * 900);
    setSku(`${prefix}-${num}`);
  };

  // Handle local image file upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image under 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        setImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Retailer profit margin calculation
  const marginPercent =
    Number(cartonMrp) > 0 && Number(wholesalePrice) > 0
      ? Math.round(
          ((Number(cartonMrp) - Number(wholesalePrice)) / Number(cartonMrp)) * 100
        )
      : 0;

  // Selected Category Object
  const selectedCategory = categories.find((c) => c.id === categoryId);

  // Effective Company Name
  const effectiveCompany = isCustomCompany ? customCompanyName : companyName;

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Please enter a product title.");
      return;
    }

    if (!wholesalePrice || Number(wholesalePrice) <= 0) {
      setErrorMsg("Please enter a valid wholesale price.");
      return;
    }

    if (!cartonMrp || Number(cartonMrp) <= 0) {
      setErrorMsg("Please enter a valid carton MRP.");
      return;
    }

    if (Number(wholesalePrice) > Number(cartonMrp)) {
      setErrorMsg("Wholesale price cannot be greater than Carton MRP.");
      return;
    }

    setLoading(true);

    const generatedSku = sku.trim() || `SKU-${Date.now().toString().slice(-6)}`;
    const finalCompany = effectiveCompany.trim() || "Authorized FMCG Nepal";
    const finalBrand = brandName.trim() || finalCompany;

    const payload = {
      title: title.trim(),
      companyName: finalCompany,
      categoryId: categoryId || "cat_snack",
      categoryName: selectedCategory?.name || "General FMCG",
      brandId: "b_custom",
      customBrand: finalBrand,
      sku: generatedSku,
      barcode: barcode.trim() || "",
      description:
        description.trim() ||
        `${title.trim()} standard wholesale carton pack from ${finalCompany}.`,
      unitType,
      packSize: packSize.trim() || `${unitsPerCarton} Pcs/Carton`,
      unitsPerCarton: Number(unitsPerCarton) || 24,
      mrp:
        unitsPerCarton > 0
          ? Math.round(Number(cartonMrp) / Number(unitsPerCarton))
          : Number(cartonMrp),
      cartonMrp: Number(cartonMrp),
      wholesalePrice: Number(wholesalePrice),
      minOrderQty: Number(minOrderQty) || 1,
      stockQuantity: Number(stockQuantity) || 0,
      imageUrl: imageUrl.trim(),
      isFeatured: false,
      taxCategory,
      hasFreeScheme: enableScheme && schemeType === "FREE_ITEM",
      freeSchemeMinQty:
        enableScheme && schemeType === "FREE_ITEM" ? Number(freeSchemeMinQty) : undefined,
      freeItemName:
        enableScheme && schemeType === "FREE_ITEM" ? freeItemName.trim() : undefined,
      freeItemQty:
        enableScheme && schemeType === "FREE_ITEM" ? Number(freeItemQty) : undefined,
      freeSchemeType: "SAME_PRODUCT" as const,
      cashDiscountPercent:
        enableScheme && schemeType === "CASH_DISCOUNT"
          ? Number(cashDiscountPercent)
          : undefined,
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Fallback to store directly if local mock / unauthenticated session
        const slug =
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") + `-${Math.floor(100 + Math.random() * 900)}`;

        marketplaceStore.createProduct({
          id: `prod_${Date.now()}`,
          distributorId,
          distributorName: "Himalayan FMCG Distributors Pvt. Ltd.",
          companyName: finalCompany,
          categoryId,
          categoryName: selectedCategory?.name || "General FMCG",
          brandId: "b_custom",
          brandName: finalBrand,
          title: title.trim(),
          slug,
          sku: generatedSku,
          description: payload.description,
          unitType,
          packSize: payload.packSize,
          unitsPerCarton: Number(unitsPerCarton) || 24,
          mrp: payload.mrp,
          cartonMrp: Number(cartonMrp),
          wholesalePrice: Number(wholesalePrice),
          minOrderQty: Number(minOrderQty) || 1,
          stockQuantity: Number(stockQuantity) || 0,
          isAvailable: true,
          isFeatured: false,
          isApproved: true,
          barcode: barcode.trim(),
          images: [imageUrl.trim()],
          tierPricing: [
            {
              minQty: Number(minOrderQty) || 1,
              pricePerCarton: Number(wholesalePrice),
            },
          ],
          taxCategory,
          hasFreeScheme: payload.hasFreeScheme,
          freeSchemeMinQty: payload.freeSchemeMinQty,
          freeItemName: payload.freeItemName,
          freeItemQty: payload.freeItemQty,
          cashDiscountPercent: payload.cashDiscountPercent,
        });
      }

      router.push("/distributor/products");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to add product. Please check the values and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-3">
          <Link
            href="/distributor/products"
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
            title="Back to products list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-[#102C55]">Add New Product</h1>
            <p className="text-xs text-slate-500">
              Enter product details, wholesale rates, and inventory for your catalog
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/distributor/products">
            <Button variant="outline" size="sm" type="button" className="text-xs">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            form="new-product-form"
            variant="primary"
            size="sm"
            isLoading={loading}
            className="text-xs font-bold px-4"
          >
            Publish Product
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg("")}
            className="text-rose-500 hover:text-rose-800 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2-Column Layout: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Clean Form */}
        <div className="lg:col-span-2 space-y-6">
          <form id="new-product-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Card 1: Basic Information */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#0759C7] flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Basic Information</h2>
                  <p className="text-[11px] text-slate-400">
                    Product title, manufacturer company, and category
                  </p>
                </div>
              </div>

              {/* Product Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Wai Wai Chicken Instant Noodles 75g (Carton of 30)"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0759C7] font-medium"
                />
              </div>

              {/* Company & Brand Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Principal Company */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Principal Company
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCompany((prev) => !prev)}
                      className="text-[10px] text-[#0759C7] hover:underline font-semibold"
                    >
                      {isCustomCompany ? "Pick from list" : "+ Type other"}
                    </button>
                  </div>

                  {isCustomCompany ? (
                    <input
                      type="text"
                      value={customCompanyName}
                      onChange={(e) => setCustomCompanyName(e.target.value)}
                      placeholder="e.g. Dabur Nepal Pvt. Ltd."
                      className="w-full h-9 px-3 text-xs rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0759C7]"
                    />
                  ) : (
                    <select
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full h-9 px-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-1 focus:ring-[#0759C7]"
                    >
                      {distributorCompanies.length > 0 ? (
                        distributorCompanies.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Unilever Nepal Ltd.">Unilever Nepal Ltd.</option>
                          <option value="Dabur Nepal Pvt. Ltd.">Dabur Nepal Pvt. Ltd.</option>
                          <option value="CG Foods (Nepal) Pvt. Ltd.">CG Foods (Nepal) Pvt. Ltd.</option>
                        </>
                      )}
                    </select>
                  )}
                </div>

                {/* Brand Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Wai Wai, Lifebuoy, Real"
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-300 focus:ring-1 focus:ring-[#0759C7]"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-9 px-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-1 focus:ring-[#0759C7]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short notes about packing, batch freshness, or product details..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0759C7]"
                />
              </div>
            </div>

            {/* Card 2: Packaging & Pricing */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Packaging & Pricing</h2>
                  <p className="text-[11px] text-slate-400">
                    Carton packing details, wholesale rates, and VAT category
                  </p>
                </div>
              </div>

              {/* Packaging Specification */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Packaging Unit
                  </label>
                  <select
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value as any)}
                    className="w-full h-9 px-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-1 focus:ring-[#0759C7]"
                  >
                    <option value="CARTON">Carton (कार्टुन)</option>
                    <option value="BOX">Box (बाकस)</option>
                    <option value="PACK">Pack (प्याक)</option>
                    <option value="BAG">Bag / Sack (बोरा)</option>
                    <option value="BOTTLE">Crate of Bottles</option>
                    <option value="CAN">Tray of Cans</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Units per Carton
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={unitsPerCarton}
                    onChange={(e) => setUnitsPerCarton(parseInt(e.target.value, 10) || 1)}
                    placeholder="e.g. 30"
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pack Size / Weight
                  </label>
                  <input
                    type="text"
                    value={packSize}
                    onChange={(e) => setPackSize(e.target.value)}
                    placeholder="e.g. 30 Pcs x 75g"
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Rates & Taxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Wholesale Price (Rs.) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                      Rs.
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min={1}
                      value={wholesalePrice}
                      onChange={(e) =>
                        setWholesalePrice(e.target.value ? parseFloat(e.target.value) : "")
                      }
                      placeholder="650"
                      className="w-full h-9 pl-9 pr-3 text-xs font-mono font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0759C7] text-[#0759C7]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Rate charged to retailers</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Carton MRP (Rs.) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                      Rs.
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min={1}
                      value={cartonMrp}
                      onChange={(e) =>
                        setCartonMrp(e.target.value ? parseFloat(e.target.value) : "")
                      }
                      placeholder="750"
                      className="w-full h-9 pl-9 pr-3 text-xs font-mono font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0759C7]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Printed maximum retail price</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tax / VAT Status
                  </label>
                  <select
                    value={taxCategory}
                    onChange={(e) => setTaxCategory(e.target.value as any)}
                    className="w-full h-9 px-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-1 focus:ring-[#0759C7] font-semibold"
                  >
                    <option value="TAXABLE_13">13% Taxable (IRD VAT)</option>
                    <option value="VAT_EXEMPT">0% VAT Exempt (कर छुट)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">IRD tax invoice classification</p>
                </div>
              </div>
            </div>

            {/* Card 3: Inventory & Order Limits */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Inventory & SKU</h2>
                  <p className="text-[11px] text-slate-400">
                    Warehouse cartons available, minimum order quantity, and barcode
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Stock Quantity */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Available Stock (Cartons)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={stockQuantity}
                    onChange={(e) =>
                      setStockQuantity(e.target.value ? parseInt(e.target.value, 10) : "")
                    }
                    placeholder="150"
                    className="w-full h-9 px-3 text-xs font-mono font-bold rounded-xl border border-slate-300"
                  />
                </div>

                {/* Minimum Order Qty */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Min Order Qty (MOQ)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={minOrderQty}
                    onChange={(e) =>
                      setMinOrderQty(e.target.value ? parseInt(e.target.value, 10) : 1)
                    }
                    placeholder="2"
                    className="w-full h-9 px-3 text-xs font-mono font-bold rounded-xl border border-slate-300"
                  />
                </div>

                {/* SKU Code */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">SKU Code</label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateSku}
                      className="text-[10px] text-[#0759C7] hover:underline flex items-center gap-0.5"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Auto</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    placeholder="e.g. CG-WW-123"
                    className="w-full h-9 px-3 text-xs font-mono rounded-xl border border-slate-300"
                  />
                </div>

                {/* Barcode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Barcode (EAN-13)
                  </label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="e.g. 890123456789"
                    className="w-full h-9 px-3 text-xs font-mono rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Product Image */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Product Image</h2>
                  <p className="text-[11px] text-slate-400">
                    Upload a photo from your computer or paste an image URL
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Image Thumbnail Preview */}
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                {/* Upload Options */}
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImageUploadType("UPLOAD")}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                        imageUploadType === "UPLOAD"
                          ? "bg-[#0759C7] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadType("URL")}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                        imageUploadType === "URL"
                          ? "bg-[#0759C7] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      Enter Image URL
                    </button>
                  </div>

                  {imageUploadType === "UPLOAD" ? (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#0759C7]" />
                        <span>Choose image from device</span>
                      </button>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Supported formats: JPG, PNG, WEBP (Max 5 MB)
                      </p>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full h-9 px-3 text-xs rounded-xl border border-slate-300 font-mono text-slate-700"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card 5: Wholesale Scheme / Promotion (Optional Toggle) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center font-bold text-xs">
                    5
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Wholesale Scheme & Offers (Optional)
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Enable B2B wholesale incentive schemes like Buy X Get 1 Free or Cash Discounts
                    </p>
                  </div>
                </div>

                {/* Scheme Toggle Switch */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enableScheme}
                    onChange={(e) => setEnableScheme(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0759C7] focus:ring-1 focus:ring-[#0759C7]"
                  />
                  <span className="text-xs font-bold text-slate-700">Add Scheme</span>
                </label>
              </div>

              {enableScheme && (
                <div className="space-y-4 pt-1 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSchemeType("FREE_ITEM")}
                      className={cn(
                        "p-3 rounded-xl border text-left text-xs transition-all",
                        schemeType === "FREE_ITEM"
                          ? "border-[#0759C7] bg-blue-50/50 text-[#102C55] font-bold"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      )}
                    >
                      <Gift className="w-4 h-4 mb-1 text-[#0759C7]" />
                      <p>Buy X Cartons, Get Free Goods</p>
                      <span className="text-[10px] text-slate-400 font-normal">
                        e.g. Buy 5 cartons get 1 carton free
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSchemeType("CASH_DISCOUNT")}
                      className={cn(
                        "p-3 rounded-xl border text-left text-xs transition-all",
                        schemeType === "CASH_DISCOUNT"
                          ? "border-[#0759C7] bg-blue-50/50 text-[#102C55] font-bold"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      )}
                    >
                      <Percent className="w-4 h-4 mb-1 text-emerald-600" />
                      <p>Spot Cash Discount (%)</p>
                      <span className="text-[10px] text-slate-400 font-normal">
                        e.g. 2% or 3% instant cash discount on delivery
                      </span>
                    </button>
                  </div>

                  {schemeType === "FREE_ITEM" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Buy Min Quantity (Cartons)
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={freeSchemeMinQty}
                          onChange={(e) =>
                            setFreeSchemeMinQty(parseInt(e.target.value, 10) || 1)
                          }
                          className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Free Quantity (Cartons)
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={freeItemQty}
                          onChange={(e) =>
                            setFreeItemQty(parseInt(e.target.value, 10) || 1)
                          }
                          className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Free Item Details
                        </label>
                        <input
                          type="text"
                          value={freeItemName}
                          onChange={(e) => setFreeItemName(e.target.value)}
                          placeholder="e.g. Same Product (1 Ctn Free)"
                          className="w-full h-8 px-2.5 rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                      <label className="block font-bold text-slate-700 mb-1">
                        Cash Discount Percentage (%)
                      </label>
                      <div className="flex items-center gap-2 max-w-xs">
                        <input
                          type="number"
                          step="0.1"
                          min={0.1}
                          max={50}
                          value={cashDiscountPercent}
                          onChange={(e) =>
                            setCashDiscountPercent(parseFloat(e.target.value) || 0)
                          }
                          className="w-28 h-8 px-2.5 rounded-lg border border-slate-300 font-mono font-bold text-emerald-700"
                        />
                        <span className="text-xs text-slate-500 font-semibold">% off invoice</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Column (1 Col): Live Retailer Preview Card */}
        <div className="space-y-4">
          <div className="sticky top-20 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#0759C7]" />
                  <span>Retailer Store Preview</span>
                </h3>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live View
                </span>
              </div>

              {/* Mock Retailer Product Card */}
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                {/* Image */}
                <div className="h-44 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-slate-300" />
                  )}

                  {/* Scheme Badge on Image */}
                  {enableScheme && (
                    <div className="absolute top-2 left-2 bg-[#102C55] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-md">
                      {schemeType === "FREE_ITEM"
                        ? `Buy ${freeSchemeMinQty} +${freeItemQty} Free`
                        : `${cashDiscountPercent}% Spot CD`}
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-700 px-2 py-0.5 rounded">
                    MOQ: {minOrderQty || 1} ctn
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <p className="text-[10px] font-bold text-[#0759C7] uppercase tracking-wider truncate">
                      {effectiveCompany || "Authorized FMCG"}
                    </p>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                      {title || "Product Name (Enter above)"}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{packSize || "Standard pack"}</span>
                    <span>
                      {taxCategory === "VAT_EXEMPT" ? "0% VAT Exempt" : "13% VAT"}
                    </span>
                  </div>

                  {/* Pricing Box */}
                  <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Wholesale Rate</span>
                      <p className="text-base font-black text-[#0759C7] font-mono">
                        {wholesalePrice ? formatNPR(Number(wholesalePrice)) : "Rs. 0"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block line-through">
                        MRP: {cartonMrp ? formatNPR(Number(cartonMrp)) : "Rs. 0"}
                      </span>
                      {marginPercent > 0 && (
                        <span className="text-[10px] font-black text-emerald-700">
                          +{marginPercent}% margin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Summary Checklist */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                  Summary Checklist:
                </p>
                <div className="space-y-1 text-slate-600 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span>Category:</span>
                    <strong className="text-slate-800">
                      {selectedCategory?.name || "General"}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Warehouse Stock:</span>
                    <strong className="text-slate-800 font-mono">
                      {stockQuantity || 0} cartons
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SKU Code:</span>
                    <strong className="text-slate-800 font-mono">
                      {sku || "Auto-assigned"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Bottom Submit Action */}
              <Button
                type="submit"
                form="new-product-form"
                variant="primary"
                className="w-full font-bold text-xs h-10 shadow-md"
                isLoading={loading}
              >
                Publish Product to Catalog
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
