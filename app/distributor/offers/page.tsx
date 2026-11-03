"use client";

import React, { useState } from "react";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Percent, Plus, Tag, Check, Calendar, Power } from "lucide-react";

export default function DistributorOffersPage() {
  const distributorId = "dist_1";
  const [offers, setOffers] = useState(marketplaceStore.getOffers(distributorId));
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState(5);
  const [minCartonQty, setMinCartonQty] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(10000);
  const [description, setDescription] = useState("");

  const handleToggle = (id: string) => {
    marketplaceStore.toggleOfferActive(id);
    setOffers([...marketplaceStore.getOffers(distributorId)]);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    marketplaceStore.createOffer({
      id: `off_${Date.now()}`,
      distributorId,
      title,
      code: code.toUpperCase() || `DEAL${Math.floor(100 + Math.random() * 900)}`,
      description,
      discountType,
      discountValue: Number(discountValue),
      minCartonQty: Number(minCartonQty),
      minOrderAmount: Number(minOrderAmount),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    });

    setOffers([...marketplaceStore.getOffers(distributorId)]);
    setShowCreateModal(false);
    setTitle("");
    setCode("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <h1 className="text-2xl font-black text-[#102C55]">Wholesale Promotional Deals</h1>
          <p className="text-xs text-slate-500">
            Create volume deals, festive percentage discounts, and voucher codes for retailers
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreateModal(true)}
          className="font-bold text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Wholesale Offer</span>
        </Button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`bg-white rounded-2xl border-2 p-6 shadow-soft space-y-4 transition-all ${
              offer.isActive ? "border-blue-200" : "border-slate-200 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold bg-blue-50 text-[#0759C7] px-2 py-0.5 rounded">
                  {offer.code}
                </span>
                <h3 className="text-base font-bold text-[#102C55] mt-2">{offer.title}</h3>
              </div>
              <button
                onClick={() => handleToggle(offer.id)}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  offer.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                }`}
                title="Toggle Active"
              >
                <Power className="w-3.5 h-3.5" />
                <span>{offer.isActive ? "ACTIVE" : "PAUSED"}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600">{offer.description}</p>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">Discount:</span>
                <span className="font-bold text-[#F58220]">
                  {offer.discountType === "PERCENTAGE" ? `${offer.discountValue}% Extra` : `Rs. ${offer.discountValue}`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Min Cartons:</span>
                <span className="font-bold text-slate-800 font-mono">{offer.minCartonQty} Cartons</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Min Order Amount:</span>
                <span className="font-bold text-slate-800 font-mono">{formatNPR(offer.minOrderAmount)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Valid Until:</span>
                <span className="font-medium text-slate-800">{formatDate(offer.endDate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-[#102C55]">Create Wholesale Deal</h3>
            <form onSubmit={handleCreateOffer} className="space-y-3 text-xs">
              <Input
                label="Offer Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dashain FMCG Volume Discount"
                required
              />
              <Input
                label="Promo Code *"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. DASHAIN5"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102C55] mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full h-10 px-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Cash (NPR)</option>
                  </select>
                </div>
                <Input
                  label="Discount Value *"
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Min Cartons"
                  type="number"
                  value={minCartonQty}
                  onChange={(e) => setMinCartonQty(Number(e.target.value))}
                  required
                />
                <Input
                  label="Min Order Amount"
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  required
                />
              </div>
              <Input
                label="Offer Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of offer..."
              />

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" className="font-bold">
                  Save Offer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
