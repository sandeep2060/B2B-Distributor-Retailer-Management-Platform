"use client";

import React, { useState } from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { MockDistributorCompany } from "@/lib/db/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Plus,
  Trash2,
  Package,
  ShieldCheck,
  Search,
  ExternalLink,
  Phone,
  User,
  Sparkles,
  CheckCircle2,
  X,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function DistributorCompaniesPage() {
  const distributorId = "dist_1";
  const [companies, setCompanies] = useState<MockDistributorCompany[]>(
    marketplaceStore.getDistributorCompanies(distributorId)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Add Company Form State
  const [companyName, setCompanyName] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [category, setCategory] = useState("FMCG Goods & Packaged Products");
  const [agencyCode, setAgencyCode] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.agencyCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    const newCompany: MockDistributorCompany = {
      id: `comp_${Date.now()}`,
      distributorId,
      name: companyName.trim(),
      shortCode: shortCode.trim().toUpperCase() || companyName.slice(0, 4).toUpperCase(),
      category: category.trim() || "General FMCG",
      agencyCode: agencyCode.trim() || `DLR-${Math.floor(1000 + Math.random() * 9000)}`,
      contactPerson: contactPerson.trim() || "Territory Sales Officer",
      contactPhone: contactPhone.trim() || "9851000000",
      isAuthorized: true,
      createdAt: new Date().toISOString(),
    };

    marketplaceStore.createDistributorCompany(newCompany);
    setCompanies([...marketplaceStore.getDistributorCompanies(distributorId)]);
    setShowAddModal(false);

    // Reset form
    setCompanyName("");
    setShortCode("");
    setAgencyCode("");
    setContactPerson("");
    setContactPhone("");

    setSuccessMsg(`"${newCompany.name}" added successfully to your authorized principal companies!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleQuickAddPreset = (presetName: string, presetCat: string) => {
    const existing = companies.find((c) => c.name.toLowerCase() === presetName.toLowerCase());
    if (existing) {
      alert(`"${presetName}" is already listed in your companies!`);
      return;
    }

    const newCompany: MockDistributorCompany = {
      id: `comp_${Date.now()}`,
      distributorId,
      name: presetName,
      shortCode: presetName.split(" ")[0].toUpperCase(),
      category: presetCat,
      agencyCode: `AGY-${presetName.slice(0, 3).toUpperCase()}-2026`,
      contactPerson: "Territory Sales Manager",
      contactPhone: "9851000000",
      isAuthorized: true,
      createdAt: new Date().toISOString(),
    };

    marketplaceStore.createDistributorCompany(newCompany);
    setCompanies([...marketplaceStore.getDistributorCompanies(distributorId)]);
    setSuccessMsg(`"${presetName}" added to your represented companies!`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDeleteCompany = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from your represented companies?`)) {
      marketplaceStore.deleteDistributorCompany(id);
      setCompanies([...marketplaceStore.getDistributorCompanies(distributorId)]);
    }
  };

  const popularPresets = [
    { name: "Unilever Nepal Ltd.", cat: "Soaps, Shampoos & Cleaning" },
    { name: "Dabur Nepal Pvt. Ltd.", cat: "Juices, Health & Ayurvedic" },
    { name: "CG Foods Nepal (Wai Wai)", cat: "Instant Noodles & Snacks" },
    { name: "Coca-Cola Beverages Nepal", cat: "Carbonated Drinks & Water" },
    { name: "Nestlé Nepal", cat: "Infant Nutrition, Coffee & Dairy" },
    { name: "Britannia Nepal", cat: "Biscuits, Cakes & Cookies" },
    { name: "Patanjali Ayurved Nepal", cat: "Natural Foods & Personal Care" },
    { name: "Amul Nepal (Dairy)", cat: "Butter, Cheese & Milk Products" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#102C55]">My Principal Companies & Agencies</h1>
            <span className="bg-blue-100 text-[#0759C7] text-xs font-bold px-2 py-0.5 rounded-full">
              {companies.length} Companies
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage the manufacturers and brand agencies whose distributorship you hold (e.g., Unilever, Dabur, CG Foods, Coke)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/distributor/products/new">
            <Button variant="outline" size="sm" className="text-xs font-bold flex items-center gap-1.5">
              <Package className="w-4 h-4" />
              <span>Add Product</span>
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="font-bold text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Principal Company</span>
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Quick 1-Click Preset Suggestions */}
      <div className="bg-gradient-to-r from-blue-50/70 via-white to-orange-50/50 p-4 rounded-xl border border-blue-200 space-y-2">
        <span className="text-xs font-bold text-[#102C55] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#F58220]" />
          Quick Add Major FMCG Companies (एक-क्लिकमा कम्पनी थप्नुहोस्):
        </span>
        <div className="flex flex-wrap gap-2 pt-1">
          {popularPresets.map((preset) => {
            const isAdded = companies.some((c) => c.name.toLowerCase().includes(preset.name.split(" ")[0].toLowerCase()));
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleQuickAddPreset(preset.name, preset.cat)}
                disabled={isAdded}
                className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all flex items-center gap-1 ${
                  isAdded
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-default"
                    : "bg-white text-slate-700 border-slate-300 hover:border-[#0759C7] hover:text-[#0759C7]"
                }`}
              >
                <span>{isAdded ? "✓" : "+"}</span>
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-soft flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name, agency code, or category..."
            className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0759C7]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredCompanies.length}</strong> Dealerships
        </span>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((comp) => (
          <div
            key={comp.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0759C7] flex items-center justify-center font-black text-sm border border-blue-100">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#102C55] line-clamp-1">{comp.name}</h3>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {comp.agencyCode || comp.shortCode || "AGENCY"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCompany(comp.id, comp.name)}
                  className="p-1.5 text-slate-300 hover:text-red-600 rounded-lg transition-colors"
                  title="Remove agency"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400 text-[11px]">Primary Category:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[170px]">{comp.category}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400 text-[11px]">Authorized Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Authorized Dealership
                  </span>
                </div>
                {comp.contactPerson && (
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400 text-[11px]">Area Manager:</span>
                    <span className="font-medium text-slate-800">{comp.contactPerson}</span>
                  </div>
                )}
                {comp.contactPhone && (
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400 text-[11px]">Contact Phone:</span>
                    <span className="font-mono text-slate-700">{comp.contactPhone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-600 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-[#0759C7]" />
                <span>
                  <strong>{comp.productCount || 0}</strong> SKUs in Catalog
                </span>
              </div>

              <Link href={`/distributor/products/new?company=${encodeURIComponent(comp.name)}`}>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-[#0759C7] hover:text-[#0759C7] hover:bg-blue-50 font-bold flex items-center gap-1">
                  <span>+ Add Product</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-base text-[#102C55]">No Companies Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add the manufacturing companies or brand agencies you distribute for to link products under their names.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add First Company
          </Button>
        </div>
      )}

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0759C7]" />
                <h3 className="font-bold text-base text-[#102C55]">Add Principal FMCG Company</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCompany} className="space-y-4 text-xs">
              <div>
                <Input
                  label="Company Name * (e.g. Unilever Nepal, Dabur Nepal, Patanjali)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Unilever Nepal Ltd."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    label="Agency / Dealer Code"
                    value={agencyCode}
                    onChange={(e) => setAgencyCode(e.target.value)}
                    placeholder="e.g. AGY-ULN-8091"
                  />
                </div>
                <div>
                  <Input
                    label="Short Code / Initials"
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value)}
                    placeholder="e.g. UNILEVER"
                  />
                </div>
              </div>

              <div>
                <Input
                  label="Product Category Handled *"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Soaps, Detergents, Shampoos & Skin Care"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    label="Company Sales Officer Name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Sunil Shakya"
                  />
                </div>
                <div>
                  <Input
                    label="Officer Contact Number"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. 9851088881"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="font-bold">
                  Save Principal Company
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}