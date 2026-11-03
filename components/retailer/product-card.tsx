"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MockProduct } from "@/lib/db/mock-data";
import { formatNPR } from "@/lib/utils/formatters";
import { Button } from "../ui/button";
import { ShoppingCart, Check, ShieldCheck, Building2, Layers } from "lucide-react";

interface ProductCardProps {
  product: MockProduct;
  onAddToCart?: (productId: string, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [qty, setQty] = useState(product.minOrderQty || 1);
  const [isAdded, setIsAdded] = useState(false);

  // Discount calculation
  const discountPercent = Math.round(((product.cartonMrp - product.wholesalePrice) / product.cartonMrp) * 100);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product.id, qty);
    } else {
      // Dispatch custom event for cart update
      const event = new CustomEvent("b2b_add_to_cart", {
        detail: { productId: product.id, quantity: qty },
      });
      window.dispatchEvent(event);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 hover:border-[#0759C7]/40 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Product Image & Badges */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-slate-50 overflow-hidden">
          <img
            src={product.images[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Savings Badge */}
          {discountPercent > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-[#F58220] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
              SAVE {discountPercent}%
            </span>
          )}

          {/* MOQ Badge */}
          <span className="absolute top-2.5 right-2.5 bg-[#102C55]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
            MOQ: {product.minOrderQty} {product.unitType === "CARTON" ? "Cartons" : "Units"}
          </span>

          {/* Units per Carton info bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-2 pt-4 text-white text-[11px] font-medium flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-300" />
              {product.packSize || `${product.unitsPerCarton} Pcs/Carton`}
            </span>
            <span className="text-[10px] font-mono text-slate-200">SKU: {product.sku}</span>
          </div>
        </Link>

        {/* Product Details */}
        <div className="p-3.5 sm:p-4 space-y-2">
          {/* Brand & Distributor */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-bold text-[#0759C7] truncate max-w-[120px]">{product.brandName}</span>
            <span className="flex items-center gap-1 truncate max-w-[130px]" title={product.distributorName}>
              <Building2 className="w-3 h-3 text-slate-400" />
              {product.distributorName.split(" ")[0]} Dist.
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-xs sm:text-sm text-[#102C55] line-clamp-2 hover:text-[#0759C7] transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Pricing Box */}
          <div className="pt-1 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/80 space-y-1">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">
                  Wholesale Carton
                </span>
                <span className="text-base sm:text-lg font-black text-[#0759C7] font-mono">
                  {formatNPR(product.wholesalePrice)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block line-through font-mono">
                  {formatNPR(product.cartonMrp)}
                </span>
                <span className="text-[11px] font-bold text-emerald-700">
                  Unit: {formatNPR(product.wholesalePrice / product.unitsPerCarton)}
                </span>
              </div>
            </div>

            {/* Retail Profit Margin highlight */}
            <div className="text-[10px] text-slate-600 flex justify-between border-t border-blue-200/50 pt-1">
              <span>Retail Margin:</span>
              <span className="font-bold text-emerald-700 font-mono">
                +{formatNPR(product.cartonMrp - product.wholesalePrice)}/ctn
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Control Bottom */}
      <div className="p-3.5 sm:p-4 pt-0">
        <div className="flex items-center gap-2">
          {/* Quantity selector */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden h-9 bg-slate-50">
            <button
              onClick={() => setQty(Math.max(product.minOrderQty, qty - 1))}
              disabled={qty <= product.minOrderQty}
              className="px-2 text-slate-600 hover:bg-slate-200 disabled:opacity-30 h-full font-bold text-xs transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-bold font-mono text-[#102C55]">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="px-2 text-slate-600 hover:bg-slate-200 h-full font-bold text-xs transition-colors"
            >
              +
            </button>
          </div>

          {/* Add Button */}
          <Button
            variant={isAdded ? "secondary" : "primary"}
            size="sm"
            onClick={handleAdd}
            className="flex-1 h-9 text-xs flex items-center justify-center gap-1.5 font-bold"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add ({qty})</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
