import React from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { Sparkles, Tag, ArrowRight, Building2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DealsPage() {
  const offers = marketplaceStore.getOffers();
  const distributors = marketplaceStore.getDistributors();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-gradient-to-r from-[#102C55] via-[#0759C7] to-[#102C55] text-white p-8 rounded-2xl shadow-card space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-[#F58220] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Wholesale Volume Deals & Promos</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">Active Wholesale Deals for Retailers</h1>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
          Save on bulk inventory orders directly from authorized FMCG manufacturers and distributors across Nepal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => {
          const dist = distributors.find((d) => d.id === offer.distributorId);

          return (
            <div
              key={offer.id}
              className="bg-white rounded-2xl border-2 border-orange-200/80 p-6 shadow-soft hover:shadow-card transition-shadow flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-[#F58220] text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                {offer.discountType === "PERCENTAGE" ? `${offer.discountValue}% OFF` : `Rs. ${offer.discountValue} OFF`}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Building2 className="w-4 h-4 text-[#0759C7]" />
                  <span className="font-bold text-[#102C55]">{dist?.companyName}</span>
                </div>

                <h3 className="text-lg font-black text-[#102C55] leading-snug">{offer.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{offer.description}</p>

                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Minimum Order Quantity:</span>
                    <span className="font-bold text-slate-900 font-mono">{offer.minCartonQty} Cartons</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Minimum Order Amount:</span>
                    <span className="font-bold text-slate-900 font-mono">{formatNPR(offer.minOrderAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Valid Until:</span>
                    <span className="font-medium text-slate-900">{formatDate(offer.endDate)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#F58220]" />
                  <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                    {offer.code}
                  </span>
                </div>

                <Link href={`/products?distributorId=${offer.distributorId}`}>
                  <Button variant="orange" size="sm" className="font-bold text-xs flex items-center gap-1.5">
                    <span>Order Stock</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
