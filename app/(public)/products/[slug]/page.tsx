"use client";

import React, { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { formatNPR } from "@/lib/utils/formatters";
import { ProductCard } from "@/components/retailer/product-card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  ShieldCheck,
  Building2,
  Layers,
  ArrowLeft,
  Truck,
  CheckCircle2,
  FileText,
  Star,
  Check,
} from "lucide-react";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const product = marketplaceStore.getProductBySlug(params.slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#102C55]">Product Not Found</h2>
        <p className="text-xs text-slate-500">The wholesale product you are looking for is unavailable.</p>
        <Link href="/products">
          <Button variant="primary" size="sm">
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(product.images[0] || "");
  const [qty, setQty] = useState(product.minOrderQty || 1);
  const [isAdded, setIsAdded] = useState(false);

  const dist = marketplaceStore.getDistributorById(product.distributorId);
  const relatedProducts = marketplaceStore
    .getProducts({ categorySlug: product.categoryName.toLowerCase() })
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // Live Tier Price Calculation based on selected quantity
  const activeTier = product.tierPricing
    ?.slice()
    .reverse()
    .find((t) => qty >= t.minQty && (!t.maxQty || qty <= t.maxQty));

  const effectiveCartonPrice = activeTier ? activeTier.pricePerCarton : product.wholesalePrice;
  const totalSubtotal = effectiveCartonPrice * qty;
  const singleUnitWholesalePrice = Math.round((effectiveCartonPrice / product.unitsPerCarton) * 100) / 100;
  const totalMarginNPR = (product.cartonMrp - effectiveCartonPrice) * qty;

  const handleAddToCart = async () => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: qty,
          unitType: product.unitType,
        }),
      });

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-[#0759C7]">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#0759C7]">
          Products
        </Link>
        <span>/</span>
        <span className="text-[#0759C7] font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200 relative">
              <img
                src={selectedImage || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#F58220] text-white text-xs font-black px-2.5 py-1 rounded shadow-sm">
                WHOLESALE CARTON
              </span>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === img ? "border-[#0759C7] ring-2 ring-blue-100" : "border-slate-200"
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Packaging Highlights Box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
              <p className="font-bold text-[#102C55] uppercase tracking-wider text-[11px]">Packaging Details</p>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Packaging Type:</span>
                  <span className="font-bold text-slate-800">{product.unitType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Pack Size:</span>
                  <span className="font-bold text-slate-800">{product.packSize}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Units per Master Carton:</span>
                  <span className="font-bold text-slate-800">{product.unitsPerCarton} Pieces</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Barcode (EAN):</span>
                  <span className="font-mono font-bold text-slate-800">{product.barcode || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Quantity & Order Card */}
          <div className="lg:col-span-7 space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0759C7] mb-1">
                <span>{product.brandName}</span>
                <span>•</span>
                <span className="text-slate-500 font-normal">SKU: {product.sku}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#102C55] leading-snug">{product.title}</h1>
              <p className="text-xs text-slate-500 mt-1">{product.description}</p>
            </div>

            {/* Distributor Badge Card */}
            {dist && (
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-[#0759C7]" />
                  <div>
                    <span className="font-bold text-slate-900 block">{dist.companyName}</span>
                    <span className="text-[11px] text-slate-500">
                      Dispatched from {dist.district} • Min Order: {formatNPR(dist.minOrderAmount)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PAN/VAT Verified</span>
                </div>
              </div>
            )}

            {/* Price Box */}
            <div className="p-4 bg-gradient-to-r from-blue-50 via-white to-blue-50/50 rounded-xl border border-blue-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-semibold">
                    Wholesale Price (Per Carton)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#0759C7] font-mono">
                      {formatNPR(effectiveCartonPrice)}
                    </span>
                    <span className="text-sm text-slate-400 line-through font-mono">
                      {formatNPR(product.cartonMrp)}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 block mt-1">
                    Unit Cost: {formatNPR(singleUnitWholesalePrice)} / piece (Retail MRP: {formatNPR(product.mrp)})
                  </span>
                </div>

                <div className="sm:border-l sm:border-blue-200 sm:pl-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Available Warehouse Stock:</span>
                    <span className="font-bold text-emerald-700 font-mono">{product.stockQuantity} Cartons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Minimum Order Qty (MOQ):</span>
                    <span className="font-bold text-[#102C55] font-mono">{product.minOrderQty} Cartons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Retail Margin:</span>
                    <span className="font-bold text-[#F58220] font-mono">
                      +{formatNPR(product.cartonMrp - effectiveCartonPrice)} per carton
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Volume Tier Pricing Table */}
            {product.tierPricing && product.tierPricing.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#102C55] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0759C7]" />
                  <span>Wholesale Volume Tier Discounts</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {product.tierPricing.map((tier, idx) => {
                    const isSelected = activeTier?.pricePerCarton === tier.pricePerCarton;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs transition-all ${
                          isSelected
                            ? "bg-blue-50 border-[#0759C7] ring-1 ring-[#0759C7]"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <p className="font-bold text-slate-800">
                          {tier.maxQty ? `${tier.minQty} - ${tier.maxQty} Cartons` : `${tier.minQty}+ Cartons`}
                        </p>
                        <p className="text-sm font-black text-[#0759C7] font-mono mt-0.5">
                          {formatNPR(tier.pricePerCarton)}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Save {formatNPR(product.cartonMrp - tier.pricePerCarton)}/ctn
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart Action */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Select Order Quantity (Cartons):</label>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden h-10 bg-white w-36">
                    <button
                      onClick={() => setQty(Math.max(product.minOrderQty, qty - 1))}
                      disabled={qty <= product.minOrderQty}
                      className="px-3 text-slate-600 hover:bg-slate-100 disabled:opacity-30 h-full font-bold text-sm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(Math.max(product.minOrderQty, parseInt(e.target.value) || 1))}
                      className="w-full text-center text-sm font-bold font-mono focus:outline-none"
                    />
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="px-3 text-slate-600 hover:bg-slate-100 h-full font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-slate-500 block">Calculated Total Subtotal:</span>
                  <span className="text-2xl font-black text-[#102C55] font-mono">{formatNPR(totalSubtotal)}</span>
                  <span className="text-[11px] text-emerald-700 block font-semibold">
                    Expected Retail Profit: +{formatNPR(totalMarginNPR)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant={isAdded ? "secondary" : "primary"}
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 font-bold text-sm flex items-center justify-center gap-2 h-12"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-400" />
                      <span>Added to Wholesale Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add {qty} Cartons to Cart</span>
                    </>
                  )}
                </Button>

                <Link href="/retailer/cart">
                  <Button variant="orange" size="lg" className="h-12 font-bold text-sm px-6">
                    Go to Cart
                  </Button>
                </Link>
              </div>
            </div>

            {/* Delivery & Tax Notice */}
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#0759C7]" />
                <span>24-48h Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>13% VAT Tax Invoice Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products from same category */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-[#102C55]">Related Wholesale FMCG Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
