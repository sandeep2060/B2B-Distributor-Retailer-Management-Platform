"use client";

import React, { useState, useEffect } from "react";
import marketplaceStore, {
  DistributorSystemSettings,
  InvoiceTemplateType,
} from "@/lib/db/store";
import { MockInvoice } from "@/lib/db/mock-data";
import { InvoiceView } from "@/components/shared/invoice-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Settings,
  FileText,
  ShieldCheck,
  Receipt,
  LayoutTemplate,
  Layers,
  Save,
  RotateCcw,
  CheckCircle2,
  Eye,
  EyeOff,
  Building2,
  Percent,
  Truck,
  Bell,
  QrCode,
  DollarSign,
  Printer,
  Sparkles,
  Sliders,
  Store,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export default function DistributorSystemSettingsPage() {
  const distributorId = "dist_1";

  const [settings, setSettings] = useState<DistributorSystemSettings>(() =>
    marketplaceStore.getDistributorSettings(distributorId)
  );

  const [activeTab, setActiveTab] = useState<
    "INVOICE" | "FISCAL" | "AUTOMATION" | "NOTIFICATIONS"
  >("INVOICE");

  const [showLivePreview, setShowLivePreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Fetch persisted settings from API on mount
  useEffect(() => {
    fetch("/api/distributor/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error("Error loading settings:", err));
  }, []);

  const handleUpdate = <K extends keyof DistributorSystemSettings>(
    key: K,
    value: DistributorSystemSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/distributor/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        "Are you sure you want to reset all system & invoice settings to IRD recommended factory defaults?"
      )
    ) {
      const defaults = marketplaceStore.getDistributorSettings("default_reset");
      setSettings(defaults);
      handleSave();
    }
  };

  // Sample Mock Invoice for Real-Time Interactive Live Preview
  const sampleInvoice: MockInvoice = {
    id: "sample_inv_preview",
    invoiceNumber: `${settings.invoicePrefix || "INV-2026-BAG"}-1003`,
    orderId: "ord_1003",
    orderNumber: "ORD-2026-1003",
    distributorId: distributorId,
    distributorName: "Himalayan FMCG Distributors Pvt. Ltd.",
    distributorPan: "602348912",
    distributorAddress: "Kuleshwor Wholesale Hub, Ward 14, Kathmandu, Nepal",
    distributorPhone: "+977-01-4455667 / 9841009988",
    retailerId: "ret_1",
    retailerName: "Suman Thapa",
    retailerShop: "Kalanki Wholesale Mart",
    retailerPan: "301489234",
    retailerAddress: "Kalanki Chowk, Ring Road, Kathmandu",
    retailerPhone: "+977-9801234567",
    taxableAmount: 42500,
    vatAmount: 5525,
    vatExemptAmount: 0,
    cashDiscountAmount: 500,
    grandTotal: 47525,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    items: [
      {
        id: "item_p1",
        productId: "prod_1",
        productTitle: "Wai Wai Quick Instant Chicken Noodles (75g x 30 Pcs)",
        productSku: "WAI-CHK-75G",
        unitType: "CARTON",
        quantity: 15,
        unitPrice: 1350,
        totalPrice: 20250,
        companyName: "CG Foods Nepal",
        isVatExempt: false,
        isInvoiced: true,
      },
      {
        id: "item_p2",
        productId: "prod_2",
        productTitle: "Real Fruit Power Mixed Fruit Juice (1L x 12 Pcs)",
        productSku: "REAL-MIX-1L",
        unitType: "CARTON",
        quantity: 10,
        unitPrice: 2225,
        totalPrice: 22250,
        companyName: "Dabur Nepal",
        isVatExempt: false,
        isInvoiced: true,
      },
    ],
    freeItemsAwarded: [
      {
        title: "Wai Wai Quick Instant Noodles (Promotional Scheme Pack)",
        unitType: "CARTON",
        quantity: 1,
      },
    ],
  };

  const templateCards: {
    id: InvoiceTemplateType;
    title: string;
    nepali: string;
    desc: string;
    icon: any;
    tag: string;
  }[] = [
    {
      id: "IRD_STANDARD",
      title: "Nepal IRD Standard Tax Invoice",
      nepali: "आधिकारिक कर बीजक",
      desc: "Bilingual IRD-compliant format with PAN/VAT breakdown, machine code, HSN codes, and legal declaration.",
      icon: ShieldCheck,
      tag: "IRD COMPLIANT",
    },
    {
      id: "THERMAL_POS",
      title: "80mm Thermal POS Receipt",
      nepali: "८० मिमि डेलिभरी रसिद",
      desc: "Compact receipt roll format for delivery drivers, handheld Bluetooth printers, and van handoffs.",
      icon: Receipt,
      tag: "VAN DELIVERY",
    },
    {
      id: "FMCG_MODERN",
      title: "Modern FMCG Wholesale Executive",
      nepali: "आधुनिक थोक बीजक",
      desc: "Contemporary branded layout with principal manufacturer badges, discount slabs, and instant Fonepay QR.",
      icon: LayoutTemplate,
      tag: "RECOMMENDED",
    },
    {
      id: "COMPACT_B2B",
      title: "Compact B2B Dispatch Slip",
      nepali: "छोटो वितरण पुर्जी",
      desc: "Clean, streamlined voucher for quick warehouse collection, loading checks, and gate passes.",
      icon: Layers,
      tag: "QUICK SLIP",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner with Navigation Tabs */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0759C7] text-white flex items-center justify-center font-black shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#102C55]">
                System & Operations Settings (प्रणाली सेटिङ)
              </h1>
              <p className="text-xs text-slate-500">
                Configure dynamic invoice print templates, taxation, wholesale automation rules, and delivery alerts
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
          <Link
            href="/distributor/settings"
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#0759C7] hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Business Profile</span>
          </Link>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="text-xs font-bold flex items-center gap-1.5 border-slate-300"
          >
            {showLivePreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#0759C7]" />}
            <span>{showLivePreview ? "Hide Live Preview" : "Live Invoice Preview"}</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSave()}
            isLoading={saving}
            className="text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="bg-emerald-600 text-white p-3.5 px-5 rounded-xl shadow-md flex items-center justify-between text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              System & Invoice Settings saved successfully! All order invoicing and printable invoices are now using your updated parameters.
            </span>
          </div>
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded font-mono">LIVE APPLIED</span>
        </div>
      )}

      {/* System Settings Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("INVOICE")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap",
            activeTab === "INVOICE"
              ? "border-[#0759C7] text-[#0759C7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          <FileText className="w-4 h-4" />
          <span>Invoice Print Template (बीजक ढाँचा)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("FISCAL")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap",
            activeTab === "FISCAL"
              ? "border-[#0759C7] text-[#0759C7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          <Percent className="w-4 h-4" />
          <span>Fiscal & Taxation (कर तथा राजस्व)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("AUTOMATION")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap",
            activeTab === "AUTOMATION"
              ? "border-[#0759C7] text-[#0759C7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          <Truck className="w-4 h-4" />
          <span>Wholesale Order Rules (अर्डर नियम)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("NOTIFICATIONS")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap",
            activeTab === "NOTIFICATIONS"
              ? "border-[#0759C7] text-[#0759C7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts & Notifications (सूचना)</span>
        </button>
      </div>

      {/* Main Grid: Form Controls (Left) & Optional Live Preview (Right or Full) */}
      <div className={cn("grid gap-6", showLivePreview ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1")}>
        {/* Settings Form Column */}
        <div className={cn("space-y-6", showLivePreview ? "lg:col-span-6 xl:col-span-5" : "max-w-4xl")}>
          {/* =========================================================================
              TAB 1: INVOICE PRINT TEMPLATE SETTINGS
              ========================================================================= */}
          {activeTab === "INVOICE" && (
            <div className="space-y-6">
              {/* Template Style Selection Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <LayoutTemplate className="w-4 h-4 text-[#0759C7]" />
                      <span>1. Select Invoice Print Template (ढाँचा छनोट)</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">4 Formats Available</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {templateCards.map((card) => {
                      const Icon = card.icon;
                      const isSelected = settings.invoiceTemplate === card.id;

                      return (
                        <div
                          key={card.id}
                          onClick={() => handleUpdate("invoiceTemplate", card.id)}
                          className={cn(
                            "p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 relative",
                            isSelected
                              ? "border-[#0759C7] bg-blue-50/50 shadow-sm"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          )}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span
                                className={cn(
                                  "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs",
                                  isSelected ? "bg-[#0759C7] text-white" : "bg-slate-100 text-slate-600"
                                )}
                              >
                                <Icon className="w-4 h-4" />
                              </span>
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider bg-slate-200 text-slate-700">
                                {card.tag}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-[#102C55] mt-2">{card.title}</h4>
                            <p className="text-[11px] font-semibold text-[#0759C7]">{card.nepali}</p>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">{card.desc}</p>
                          </div>

                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Status:</span>
                            <span className={cn("font-bold", isSelected ? "text-[#0759C7]" : "text-slate-500")}>
                              {isSelected ? "✓ Active Template" : "Click to Select"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Dynamic Print Elements Toggles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-600" />
                    <span>2. Dynamic Print Elements (बीजकमा के के देखाउने?)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        key: "showCompanyLogo" as const,
                        label: "Show Company Logo & Badge",
                        desc: "Display distributor brand badge on invoice",
                      },
                      {
                        key: "showPrincipalCompany" as const,
                        label: "Show Principal Company / Brand",
                        desc: "E.g. Unilever Nepal, Dabur Nepal tags per item",
                      },
                      {
                        key: "showFreeAndOfferItems" as const,
                        label: "Show Free Promotional Scheme Items",
                        desc: "Display 100% discount bonus goods in ledger",
                      },
                      {
                        key: "showBankAndQR" as const,
                        label: "Show Bank Details & Fonepay QR",
                        desc: "Print settlement bank account & QR code box",
                      },
                      {
                        key: "showDriverInfo" as const,
                        label: "Show Delivery Vehicle & Driver",
                        desc: "Print dispatch van plate & driver phone",
                      },
                      {
                        key: "showSignatures" as const,
                        label: "Show Dual Signature Blocks",
                        desc: "Print Authorized Signatory & Receiver Stamp lines",
                      },
                      {
                        key: "showHsnCodes" as const,
                        label: "Show HSN / Commodity Codes",
                        desc: "Print Nepal customs / IRD harmonized codes",
                      },
                      {
                        key: "showIrdApprovalNote" as const,
                        label: "Show IRD Approval & Machine Code",
                        desc: "Print official fiscal approval disclosure",
                      },
                    ].map((toggle) => (
                      <label
                        key={toggle.key}
                        className={cn(
                          "flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all",
                          settings[toggle.key]
                            ? "bg-blue-50/60 border-blue-200 text-[#102C55]"
                            : "bg-slate-50 border-slate-200 text-slate-500"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(settings[toggle.key])}
                          onChange={(e) => handleUpdate(toggle.key, e.target.checked)}
                          className="mt-0.5 rounded text-[#0759C7] focus:ring-[#0759C7]"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-xs">{toggle.label}</p>
                          <p className="text-[10px] text-slate-500">{toggle.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Titles, Prefixes & IRD Codes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>3. Invoice Identity & Official Numbering</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Invoice Document Title</label>
                      <input
                        type="text"
                        value={settings.invoiceTitle}
                        onChange={(e) => handleUpdate("invoiceTitle", e.target.value)}
                        placeholder="कर बीजक (TAX INVOICE)"
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 font-bold text-xs focus:ring-2 focus:ring-[#0759C7]"
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">Printed at the very top of each invoice</p>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Invoice Numbering Prefix</label>
                      <input
                        type="text"
                        value={settings.invoicePrefix}
                        onChange={(e) => handleUpdate("invoicePrefix", e.target.value.toUpperCase())}
                        placeholder="INV-2026-BAG"
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 font-mono font-bold text-xs text-[#0759C7] focus:ring-2 focus:ring-[#0759C7]"
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">E.g., INV-2026-BAG, KTM-FMCG</p>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">IRD Machine Approval Code</label>
                      <input
                        type="text"
                        value={settings.irdApprovalCode}
                        onChange={(e) => handleUpdate("irdApprovalCode", e.target.value)}
                        placeholder="IRD-KTM-2081/82-4912"
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-[#0759C7]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Fiscal Year (आर्थिक वर्ष)</label>
                      <input
                        type="text"
                        value={settings.fiscalYear}
                        onChange={(e) => handleUpdate("fiscalYear", e.target.value)}
                        placeholder="२०८१/०८२ (2024/25)"
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#0759C7]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Settlement Bank & QR Box Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#0759C7]" />
                    <span>4. Bank Account & Fonepay QR Printed on Invoice</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={settings.bankName}
                        onChange={(e) => handleUpdate("bankName", e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#0759C7]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Account Holder Legal Name</label>
                      <input
                        type="text"
                        value={settings.accountName}
                        onChange={(e) => handleUpdate("accountName", e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#0759C7]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Account Number</label>
                      <input
                        type="text"
                        value={settings.accountNumber}
                        onChange={(e) => handleUpdate("accountNumber", e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 font-mono font-bold text-xs text-[#0759C7] focus:ring-2 focus:ring-[#0759C7]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Branch Location</label>
                      <input
                        type="text"
                        value={settings.branchName}
                        onChange={(e) => handleUpdate("branchName", e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#0759C7]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">
                        Fonepay / Payment Note Printed on Invoice
                      </label>
                      <input
                        type="text"
                        value={settings.paymentInstructions}
                        onChange={(e) => handleUpdate("paymentInstructions", e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#0759C7]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Terms & Conditions and Footer Greeting */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-700" />
                    <span>5. Legal Terms & Conditions and Footer Greeting</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Terms & Conditions (नियम तथा सर्तहरू)
                    </label>
                    <textarea
                      rows={4}
                      value={settings.termsAndConditions}
                      onChange={(e) => handleUpdate("termsAndConditions", e.target.value)}
                      className="w-full p-3 rounded-lg border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-[#0759C7]"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Printed at the bottom of the tax invoice for legal compliance
                    </p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Footer Thank You Note / Customer Greeting
                    </label>
                    <input
                      type="text"
                      value={settings.footerNote}
                      onChange={(e) => handleUpdate("footerNote", e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#0759C7]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* =========================================================================
              TAB 2: FISCAL & TAXATION SETTINGS
              ========================================================================= */}
          {activeTab === "FISCAL" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Percent className="w-4 h-4 text-[#0759C7]" />
                  <span>Nepal Fiscal, Tax & Currency Rules</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Standard VAT Rate (%)</label>
                    <input
                      type="number"
                      value={settings.vatRate}
                      onChange={(e) => handleUpdate("vatRate", Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 font-bold text-xs focus:ring-2 focus:ring-[#0759C7]"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Nepal IRD standard is 13% VAT</p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Currency Symbol Display</label>
                    <select
                      value={settings.currencySymbol}
                      onChange={(e) => handleUpdate("currencySymbol", e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 font-bold text-xs focus:ring-2 focus:ring-[#0759C7]"
                    >
                      <option value="रू">रू (Nepali Rupee Symbol)</option>
                      <option value="Rs.">Rs. (Standard)</option>
                      <option value="NPR">NPR (ISO Code)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={settings.enableVatExemption}
                        onChange={(e) => handleUpdate("enableVatExemption", e.target.checked)}
                        className="rounded text-[#0759C7] focus:ring-[#0759C7]"
                      />
                      <span>Enable Schedule 1 VAT-Exempt Goods (कृषि तथा प्राथमिक खाद्य वस्तु कर छुट)</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-1 pl-6">
                      Allows agricultural staples, fresh milk, and exempted items to be billed at 0% VAT while retaining 13% on standard taxable goods in the same invoice.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* =========================================================================
              TAB 3: WHOLESALE ORDER & AUTOMATION RULES
              ========================================================================= */}
          {activeTab === "AUTOMATION" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Wholesale Order Thresholds & Automation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Minimum Wholesale Order Amount (रू)
                    </label>
                    <input
                      type="number"
                      value={settings.minOrderAmount}
                      onChange={(e) => handleUpdate("minOrderAmount", Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 font-mono font-bold text-xs text-[#0759C7] focus:ring-2 focus:ring-[#0759C7]"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Retailers cannot checkout below this threshold
                    </p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Maximum Credit Period for Retailers (Days)
                    </label>
                    <input
                      type="number"
                      value={settings.maxCreditDays}
                      onChange={(e) => handleUpdate("maxCreditDays", Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 font-bold text-xs focus:ring-2 focus:ring-[#0759C7]"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Net payment settlement deadline</p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Default Delivery Grace Window (Hours)
                    </label>
                    <select
                      value={settings.defaultDeliveryGraceHours}
                      onChange={(e) => handleUpdate("defaultDeliveryGraceHours", Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 font-bold text-xs focus:ring-2 focus:ring-[#0759C7]"
                    >
                      <option value={12}>Same Day Dispatch (12 Hours)</option>
                      <option value={24}>Next Day Morning (24 Hours)</option>
                      <option value={48}>Within 48 Hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Stock Hold Timeout (Hours)
                    </label>
                    <input
                      type="number"
                      value={settings.stockHoldTimeoutHours}
                      onChange={(e) => handleUpdate("stockHoldTimeoutHours", Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 font-bold text-xs focus:ring-2 focus:ring-[#0759C7]"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Auto-releases reserved inventory if unconfirmed
                    </p>
                  </div>

                  <div className="sm:col-span-2 space-y-2 pt-2 border-t border-slate-200">
                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={settings.autoConfirmOrders}
                        onChange={(e) => handleUpdate("autoConfirmOrders", e.target.checked)}
                        className="rounded text-[#0759C7] focus:ring-[#0759C7]"
                      />
                      <span>Auto-Confirm Orders from Verified Retailers (स्वतः अर्डर स्वीकृति)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={settings.allowPartialCancellation}
                        onChange={(e) => handleUpdate("allowPartialCancellation", e.target.checked)}
                        className="rounded text-[#0759C7] focus:ring-[#0759C7]"
                      />
                      <span>Allow Item Cancellation with Reason during Invoicing</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* =========================================================================
              TAB 4: NOTIFICATIONS & ALERTS
              ========================================================================= */}
          {activeTab === "NOTIFICATIONS" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span>Automated Invoicing & Delivery Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Notification SMS / Viber Number</label>
                    <input
                      type="text"
                      value={settings.notificationPhone}
                      onChange={(e) => handleUpdate("notificationPhone", e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-[#0759C7]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Notification Email</label>
                    <input
                      type="email"
                      value={settings.notificationEmail}
                      onChange={(e) => handleUpdate("notificationEmail", e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#0759C7]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-2 pt-2 border-t border-slate-200">
                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={settings.notifyOnInvoice}
                        onChange={(e) => handleUpdate("notifyOnInvoice", e.target.checked)}
                        className="rounded text-[#0759C7] focus:ring-[#0759C7]"
                      />
                      <span>
                        Send instant confirmation notice upon Tax Invoice generation (कर बीजक जारी हुँदा सूचना पठाउने)
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={settings.notifyOnDispatch}
                        onChange={(e) => handleUpdate("notifyOnDispatch", e.target.checked)}
                        className="rounded text-[#0759C7] focus:ring-[#0759C7]"
                      />
                      <span>
                        Send dispatch notice with vehicle and driver contact when goods leave warehouse
                      </span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bottom Save & Reset Controls */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-soft flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="text-xs font-semibold text-slate-600 border-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to IRD Defaults</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => handleSave()}
              isLoading={saving}
              className="text-xs font-bold px-6 shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </Button>
          </div>
        </div>

        {/* =========================================================================
            LIVE INTERACTIVE INVOICE PREVIEW COLUMN (OPTIONAL / TOGGLEABLE)
            ========================================================================= */}
        {showLivePreview && (
          <div className="lg:col-span-6 xl:col-span-7 space-y-3">
            <div className="bg-slate-900 text-white p-3.5 px-5 rounded-xl shadow-md flex items-center justify-between text-xs sticky top-16 z-10">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Live Interactive Invoice Preview (प्रत्यक्ष बीजक पूर्वावलोकन)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                  {settings.invoiceTemplate}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.print()}
                  className="text-xs h-7 px-2.5 text-white border-slate-700 hover:bg-slate-800 font-bold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Sample</span>
                </Button>
              </div>
            </div>

            <div className="bg-slate-100 p-2 sm:p-4 rounded-2xl border border-slate-300 overflow-hidden">
              <InvoiceView
                invoice={sampleInvoice}
                previewSettings={settings}
                hideHeaderActions={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
