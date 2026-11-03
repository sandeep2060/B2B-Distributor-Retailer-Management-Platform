"use client";

import React, { useState } from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { formatNPR } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import {
  Package,
  Plus,
  Search,
  Upload,
  Download,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react";

export default function DistributorProductsPage() {
  const distributorId = "dist_1";
  const [products, setProducts] = useState(marketplaceStore.getProducts({ distributorId }));
  const [searchQuery, setSearchQuery] = useState("");
  const [csvUploadSuccess, setCsvUploadSuccess] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadCsvTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,SKU,Category,Brand,PackSize,UnitsPerCarton,UnitMRP,CartonMRP,WholesalePrice,MOQ,StockQuantity,Barcode\n" +
      "Wai Wai 123 Chicken,CG-WW-123,Snacks,Wai Wai,30 Pcs x 75g,30,25,750,660,2,200,8901234567\n" +
      "Amul Butter 500g,AML-BUT-500,Dairy,Amul,20 Packs x 500g,20,450,9000,8100,1,50,8909876543";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "b2b_deal_wholesale_product_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateCsvUpload = () => {
    // Add sample imported bulk product
    const importedProd = marketplaceStore.createProduct({
      id: `prod_bulk_${Date.now()}`,
      distributorId,
      distributorName: "Himalayan FMCG Distributors Pvt. Ltd.",
      categoryId: "cat_snack",
      categoryName: "Snacks & Confectionery",
      brandId: "b_waiwai",
      brandName: "Wai Wai (CG Foods)",
      title: "Wai Wai 123 Noodles Vegetarian (Carton of 30)",
      slug: `wai-wai-123-veg-carton-30-${Date.now()}`,
      sku: `CG-WW-VEG-${Math.floor(100 + Math.random() * 900)}`,
      description: "Bulk imported wholesale vegetarian noodles. Instant ready to cook.",
      unitType: "CARTON",
      packSize: "30 Pcs x 75g",
      unitsPerCarton: 30,
      mrp: 25,
      cartonMrp: 750,
      wholesalePrice: 650,
      minOrderQty: 2,
      stockQuantity: 300,
      isAvailable: true,
      isFeatured: false,
      isApproved: true,
      barcode: "890123450099",
      images: ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"],
      tierPricing: [
        { minQty: 2, maxQty: 9, pricePerCarton: 650 },
        { minQty: 10, pricePerCarton: 630 },
      ],
    });

    setProducts(marketplaceStore.getProducts({ distributorId }));
    setCsvUploadSuccess(true);
    setTimeout(() => setCsvUploadSuccess(false), 4000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product SKU?")) {
      marketplaceStore.deleteProduct(id);
      setProducts(marketplaceStore.getProducts({ distributorId }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <h1 className="text-2xl font-black text-[#102C55]">Wholesale Product Catalog</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage carton rates, MOQ, inventory availability, and bulk pricing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadCsvTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            title="Download CSV Template"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Template</span>
          </button>

          <button
            onClick={handleSimulateCsvUpload}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
            title="Bulk upload items from CSV"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk CSV Import</span>
          </button>

          <Link href="/distributor/products/new">
            <Button variant="primary" size="sm" className="font-bold text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Button>
          </Link>
        </div>
      </div>

      {csvUploadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>CSV bulk import completed successfully! New wholesale SKUs added to your catalog.</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-soft flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, product name, or brand..."
            className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0759C7]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-800">{filtered.length}</strong> SKUs
        </div>
      </div>

      {/* Product Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Product / SKU</th>
                <th className="py-3 px-4">Category & Brand</th>
                <th className="py-3 px-4">Packaging</th>
                <th className="py-3 px-4 text-right">Wholesale Price (Carton)</th>
                <th className="py-3 px-4 text-center">MOQ</th>
                <th className="py-3 px-4 text-center">Warehouse Stock</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prod) => {
                const isLowStock = prod.stockQuantity < 50;

                return (
                  <tr key={prod.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="truncate max-w-xs">
                          <p className="font-bold text-slate-900 truncate">{prod.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">SKU: {prod.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{prod.brandName}</p>
                      <p className="text-[10px] text-slate-400">{prod.categoryName}</p>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {prod.packSize || `${prod.unitsPerCarton} Pcs/Ctn`}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#0759C7]">
                      {formatNPR(prod.wholesalePrice)}
                      <span className="block text-[10px] text-slate-400 line-through">
                        {formatNPR(prod.cartonMrp)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-800 font-mono">
                      {prod.minOrderQty}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          isLowStock
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isLowStock && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {prod.stockQuantity} ctns
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      <Link href={`/products/${prod.slug}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-600">
                          View
                        </Button>
                      </Link>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
