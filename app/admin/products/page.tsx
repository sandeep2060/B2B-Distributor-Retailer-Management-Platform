"use client";

import React, { useState } from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { formatNPR } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, XCircle } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(marketplaceStore.getProducts());

  const handleToggleFeatured = (id: string, current: boolean) => {
    marketplaceStore.updateProduct(id, { isFeatured: !current });
    setProducts([...marketplaceStore.getProducts()]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <h1 className="text-2xl font-black text-[#102C55]">Platform Master Product Catalog</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit wholesale catalog items across all FMCG distributors in Nepal and control homepage features
          </p>
        </div>

        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          Total Products: <span className="text-[#0759C7] font-mono">{products.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Product Title</th>
                <th className="py-3 px-4">Distributor</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Wholesale Rate</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Featured on Home</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{p.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{p.distributorName}</td>
                  <td className="py-3.5 px-4 text-slate-600">{p.categoryName}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#0759C7]">
                    {formatNPR(p.wholesalePrice)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">{p.stockQuantity} ctns</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(p.id, p.isFeatured)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                        p.isFeatured
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Star className={`w-3 h-3 ${p.isFeatured ? "fill-amber-400 text-amber-500" : ""}`} />
                      <span>{p.isFeatured ? "Featured" : "Regular"}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/products/${p.slug}`}>
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        View Live
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
