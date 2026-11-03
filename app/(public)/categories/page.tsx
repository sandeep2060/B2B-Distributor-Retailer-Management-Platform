import React from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { Grid, ChevronRight, Package } from "lucide-react";

export default function CategoriesPage() {
  const categories = marketplaceStore.getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <h1 className="text-2xl font-black text-[#102C55]">Wholesale Product Categories</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore wholesale FMCG supplies organized by category for retail shops and grocery marts in Nepal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft hover:shadow-card hover:border-[#0759C7] transition-all flex flex-col justify-between"
          >
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 right-3 bg-[#102C55]/90 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded">
                {cat.productCount || 0} Products
              </span>
            </div>

            <div className="p-5 space-y-2">
              <h3 className="text-base font-bold text-[#102C55] group-hover:text-[#0759C7] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{cat.description}</p>
              <div className="pt-3 flex items-center justify-between text-xs font-bold text-[#0759C7]">
                <span>Browse Products</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
