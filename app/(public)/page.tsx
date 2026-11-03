import React from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { ProductCard } from "@/components/retailer/product-card";
import { formatNPR } from "@/lib/utils/formatters";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  Package,
  Layers,
  ChevronRight,
  Wine,
  Cookie,
  ShoppingBag,
  Sparkles as SparklesIcon,
  Home as HomeIcon,
  Milk,
  CheckCircle2,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const categories = marketplaceStore.getCategories();
  const featuredProducts = marketplaceStore.getProducts({ featuredOnly: true });
  const allProducts = marketplaceStore.getProducts();
  const distributors = marketplaceStore.getDistributors();
  const offers = marketplaceStore.getOffers();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Wine":
        return <Wine className="w-6 h-6 text-[#0759C7]" />;
      case "Cookie":
        return <Cookie className="w-6 h-6 text-amber-600" />;
      case "ShoppingBag":
        return <ShoppingBag className="w-6 h-6 text-emerald-600" />;
      case "Sparkles":
        return <SparklesIcon className="w-6 h-6 text-purple-600" />;
      case "Home":
        return <HomeIcon className="w-6 h-6 text-blue-500" />;
      case "Milk":
        return <Milk className="w-6 h-6 text-sky-600" />;
      default:
        return <Package className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Wholesale Promotional Banner */}
      <section className="bg-gradient-to-r from-[#102C55] via-[#0759C7] to-[#0A4192] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-100 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-[#F58220]" />
                <span>Nepal's Official B2B Wholesale Marketplace</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Order Direct from Verified Wholesale Distributors
              </h1>

              <p className="text-sm sm:text-base text-blue-100 max-w-xl leading-relaxed">
                Connect your retail shop with top FMCG distributors in Kathmandu, Pokhara, and across Nepal.
                Enjoy guaranteed wholesale carton rates, tiered volume savings, and official tax invoices.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/products">
                  <Button variant="orange" size="lg" className="font-bold flex items-center gap-2">
                    <span>Browse Wholesale Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/deals">
                  <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-bold">
                    <span>Volume Deals ({offers.length})</span>
                  </Button>
                </Link>
              </div>

              {/* Quick Stat Badges */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 text-xs">
                <div>
                  <p className="text-xl sm:text-2xl font-black font-mono text-white">500+</p>
                  <p className="text-blue-200 text-[11px]">Wholesale FMCG SKUs</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black font-mono text-[#F58220]">100%</p>
                  <p className="text-blue-200 text-[11px]">PAN/VAT Verified Sellers</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black font-mono text-white">24-48h</p>
                  <p className="text-blue-200 text-[11px]">Doorstep Shop Delivery</p>
                </div>
              </div>
            </div>

            {/* Hero Quick Order / Promotion Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 text-slate-800 shadow-xl border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#F58220] text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  TODAY'S TOP VOLUME DEAL
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-[#0759C7] uppercase tracking-wider mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>High Turnover Retailer Pick</span>
                </div>

                <h3 className="text-lg font-black text-[#102C55] leading-snug">
                  Wai Wai Chicken Noodles (Carton of 30)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Himalayan FMCG Distributors • In Stock (450 ctns)</p>

                <div className="mt-4 p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Wholesale Rate</span>
                    <span className="text-2xl font-black text-[#0759C7] font-mono">Rs. 660</span>
                    <span className="text-xs text-slate-400 line-through ml-2 font-mono">Rs. 750</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Rs. 22.00 / packet
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1">Retail MRP: Rs. 25.00</span>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Tier 1 (2 - 9 Cartons):</span>
                    <span className="font-bold text-slate-800 font-mono">Rs. 660 / ctn</span>
                  </div>
                  <div className="flex items-center justify-between text-[#0759C7] font-bold">
                    <span>Tier 2 (10 - 29 Cartons):</span>
                    <span className="font-mono">Rs. 645 / ctn (Save extra 2.3%)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#F58220] font-black">
                    <span>Tier 3 (30+ Cartons):</span>
                    <span className="font-mono">Rs. 630 / ctn (Save extra 4.5%)</span>
                  </div>
                </div>

                <div className="mt-5">
                  <Link href="/products/wai-wai-chicken-instant-noodles-carton-30">
                    <Button variant="primary" className="w-full font-bold text-xs h-10">
                      Order Wholesale Cartons Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Wholesale Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#102C55] tracking-tight">Wholesale Categories</h2>
            <p className="text-xs text-slate-500">Order by carton, pack, or master sack directly from stock</p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-bold text-[#0759C7] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group p-4 bg-white rounded-xl border border-slate-200/80 hover:border-[#0759C7] hover:shadow-card transition-all text-center flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                {getCategoryIcon(cat.iconName)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-[#0759C7] transition-colors leading-tight">
                  {cat.name}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{cat.productCount || 8} Products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Distributors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0759C7]" />
              <h2 className="text-lg sm:text-xl font-black text-[#102C55] tracking-tight">
                Verified Wholesale Distributors
              </h2>
            </div>
            <p className="text-xs text-slate-500">Official FMCG suppliers with direct delivery to your store</p>
          </div>
          <Link
            href="/distributors"
            className="text-xs font-bold text-[#0759C7] hover:underline flex items-center gap-1"
          >
            <span>All Distributors</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {distributors.map((dist) => (
            <div
              key={dist.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-soft hover:shadow-card transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={dist.logoUrl || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=100"}
                      alt={dist.companyName}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#102C55] leading-snug">{dist.companyName}</h4>
                      <p className="text-xs text-slate-500">{dist.district}, {dist.province}</p>
                    </div>
                  </div>
                  {dist.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-semibold">Min Wholesale Order:</span>
                    <span className="font-bold text-slate-800 font-mono">{formatNPR(dist.minOrderAmount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Seller Rating:</span>
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {dist.rating} / 5.0
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block font-semibold">Delivery Coverage:</span>
                    <span className="text-slate-700 font-medium truncate block">
                      {dist.deliveryZones.join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              <Link href={`/products?distributorId=${dist.id}`}>
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  View Catalog & Pricing
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Wholesale Deals & Recommended Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F58220]" />
              <h2 className="text-lg sm:text-xl font-black text-[#102C55] tracking-tight">
                Recommended Wholesale Deals
              </h2>
            </div>
            <p className="text-xs text-slate-500">Fastest-selling retail FMCG products at special bulk prices</p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-[#0759C7] hover:underline flex items-center gap-1"
          >
            <span>See All Products ({allProducts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Fast Reorder & Kirana Business Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-r from-[#102C55] to-[#1B3B6F] text-white p-6 sm:p-10 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="bg-[#F58220] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                Retailer Empowerment Program
              </span>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Never Run Out of Stock at Your Kirana or Department Store
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Save hours negotiating prices with middlemen. On B2B Deal, manage all your distributor orders, download
                official IRD VAT invoices, track assigned delivery vehicles, and repeat past orders in 1 click.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/register">
                  <Button variant="orange" size="md" className="font-bold text-xs">
                    Register Your Retail Store
                  </Button>
                </Link>
                <Link href="/retailer/orders">
                  <Button variant="outline" size="md" className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-bold text-xs">
                    View Past Orders & Reorder
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-xl p-5 text-xs space-y-3">
              <p className="font-bold text-white text-sm">Why 2,400+ Retailers Trust B2B Deal:</p>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Transparent wholesale rates without hidden costs</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>13% VAT tax invoices compliant with Nepal IRD</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Flexible payment: Cash on Delivery or Bank QR</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
