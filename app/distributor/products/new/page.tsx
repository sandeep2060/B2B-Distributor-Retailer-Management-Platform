"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import marketplaceStore from "@/lib/db/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Package, Layers, Image as ImageIcon, AlertCircle } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const categories = marketplaceStore.getCategories();
  const brands = marketplaceStore.getBrands();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "cat_snack");
  const [brandId, setBrandId] = useState(brands[0]?.id || "b_waiwai");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [unitType, setUnitType] = useState("CARTON");
  const [packSize, setPackSize] = useState("30 Pcs x 75g");
  const [unitsPerCarton, setUnitsPerCarton] = useState(30);
  const [mrp, setMrp] = useState(25);
  const [cartonMrp, setCartonMrp] = useState(750);
  const [wholesalePrice, setWholesalePrice] = useState(650);
  const [minOrderQty, setMinOrderQty] = useState(2);
  const [stockQuantity, setStockQuantity] = useState(200);
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1542838132-92c53300491e?w=600");
  const [barcode, setBarcode] = useState("");

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
        description: description || "Freshly packed wholesale FMCG goods direct from manufacturer.",
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
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add product");
      }

      router.push("/distributor/products");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create product");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <Link
            href="/distributor/products"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#0759C7] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Products
          </Link>
          <h1 className="text-2xl font-black text-[#102C55]">Add New Wholesale Product SKU</h1>
          <p className="text-xs text-slate-500">Configure carton packaging, wholesale rates, and inventory stock</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6 text-xs">
        {/* Basic Identification */}
        <div className="space-y-4 pb-4 border-b border-slate-100">
          <h3 className="font-bold text-sm text-[#102C55] flex items-center gap-2">
            <Package className="w-4 h-4 text-[#0759C7]" />
            Basic Product Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Product Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Real Apple Juice 1L (Carton of 12)"
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
                label="Distributor SKU *"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. CC-500-PET-24"
                required
              />
            </div>

            <div>
              <Input
                label="Barcode / EAN (Optional)"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="890123456789"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#102C55] mb-1">Product Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description for retailers regarding packaging, batch validity, and usage..."
                rows={3}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0759C7] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Packaging & Pricing */}
        <div className="space-y-4 pb-4 border-b border-slate-100">
          <h3 className="font-bold text-sm text-[#102C55] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0759C7]" />
            Carton Packaging & Wholesale Rates (NPR)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Input
                label="Pack Size / Spec *"
                value={packSize}
                onChange={(e) => setPackSize(e.target.value)}
                placeholder="e.g. 24 Bottles x 250ml"
                required
              />
            </div>

            <div>
              <Input
                label="Units Per Carton *"
                type="number"
                value={unitsPerCarton}
                onChange={(e) => setUnitsPerCarton(Number(e.target.value))}
                placeholder="24"
                required
              />
            </div>

            <div>
              <Input
                label="Single Unit Retail MRP *"
                type="number"
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                placeholder="45"
                required
              />
            </div>

            <div>
              <Input
                label="Total Carton MRP (NPR) *"
                type="number"
                value={cartonMrp}
                onChange={(e) => setCartonMrp(Number(e.target.value))}
                placeholder="1080"
                required
              />
            </div>

            <div>
              <Input
                label="Wholesale Selling Rate (NPR) *"
                type="number"
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(Number(e.target.value))}
                placeholder="960"
                required
              />
            </div>

            <div>
              <Input
                label="Minimum Order Qty (MOQ Cartons) *"
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

            <div className="sm:col-span-2">
              <Input
                label="Product Image URL *"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/distributor/products">
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" size="md" isLoading={loading} className="font-bold px-6">
            Publish Wholesale Product
          </Button>
        </div>
      </form>
    </div>
  );
}
