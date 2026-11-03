import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import marketplaceStore from "@/lib/db/store";
import { ProductCard } from "@/components/retailer/product-card";
import { ArrowLeft } from "lucide-react";

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const category = marketplaceStore.getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  const products = marketplaceStore.getProducts({ categorySlug: category.slug });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-2">
        <Link
          href="/categories"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#0759C7]"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          All Categories
        </Link>
        <h1 className="text-2xl font-black text-[#102C55]">{category.name} Wholesale</h1>
        <p className="text-xs text-slate-500">{category.description}</p>
        <p className="text-[11px] font-bold text-[#0759C7] font-mono">{products.length} Products Available</p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
