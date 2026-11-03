"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import marketplaceStore from "@/lib/db/store";
import { ProductCard } from "@/components/retailer/product-card";
import { Filter, SlidersHorizontal, Search, ArrowUpDown, X } from "lucide-react";

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialDistributor = searchParams.get("distributorId") || "";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDistributor, setSelectedDistributor] = useState(initialDistributor);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "discount">("featured");

  const categories = marketplaceStore.getCategories();
  const distributors = marketplaceStore.getDistributors();
  const allProducts = marketplaceStore.getProducts();

  const filteredProducts = useMemo(() => {
    let list = marketplaceStore.getProducts({
      categorySlug: selectedCategory || undefined,
      distributorId: selectedDistributor || undefined,
      search: searchQuery || undefined,
    });

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.wholesalePrice - b.wholesalePrice);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.wholesalePrice - a.wholesalePrice);
    } else if (sortBy === "discount") {
      list.sort((a, b) => {
        const discA = ((a.cartonMrp - a.wholesalePrice) / a.cartonMrp) * 100;
        const discB = ((b.cartonMrp - b.wholesalePrice) / b.cartonMrp) * 100;
        return discB - discA;
      });
    }

    return list;
  }, [selectedCategory, selectedDistributor, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedDistributor("");
    setSearchQuery("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-soft">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#102C55] tracking-tight">Wholesale Product Catalog</h1>
          <p className="text-xs text-slate-500">
            Showing {filteredProducts.length} wholesale carton products available for instant order
          </p>
        </div>

        {/* Search within catalog */}
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by product, SKU, or brand..."
              className="w-full h-9 pl-9 pr-8 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0759C7]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 px-2.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0759C7]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Highest Margin %</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 bg-white p-5 rounded-xl border border-slate-200 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-[#102C55]">
              <Filter className="w-4 h-4 text-[#0759C7]" />
              <span>Catalog Filters</span>
            </div>
            {(selectedCategory || selectedDistributor || searchQuery) && (
              <button onClick={clearFilters} className="text-xs text-[#F58220] hover:underline font-bold">
                Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Categories
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  !selectedCategory ? "bg-blue-50 text-[#0759C7] font-bold" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>All Categories</span>
                <span className="text-[11px] text-slate-400 font-mono">{allProducts.length}</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === c.slug
                      ? "bg-blue-50 text-[#0759C7] font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{c.productCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Distributor Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Distributor Hub
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedDistributor("")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  !selectedDistributor ? "bg-blue-50 text-[#0759C7] font-bold" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>All Distributors</span>
              </button>
              {distributors.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDistributor(d.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedDistributor === d.id
                      ? "bg-blue-50 text-[#0759C7] font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate max-w-[150px]">{d.companyName}</span>
                  <span className="text-[10px] text-slate-400">{d.district}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3 shadow-soft">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0759C7] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#102C55]">No wholesale products match your search</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try selecting a different category or clearing filters to see all available wholesale stocks.
              </p>
              <button
                onClick={clearFilters}
                className="mt-2 px-4 py-2 bg-[#0759C7] text-white rounded-lg text-xs font-bold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-[#0759C7] border-t-transparent rounded-full mx-auto" />
          <p className="text-xs text-slate-500">Loading catalog...</p>
        </div>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}

