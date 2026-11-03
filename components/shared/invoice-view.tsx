"use client";

import React, { useState } from "react";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { MockInvoice } from "@/lib/db/mock-data";
import marketplaceStore, {
  DistributorSystemSettings,
  InvoiceTemplateType,
} from "@/lib/db/store";
import { Button } from "../ui/button";
import {
  Printer,
  Download,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Truck,
  Building2,
  FileText,
  Receipt,
  LayoutTemplate,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface InvoiceViewProps {
  invoice: MockInvoice;
  backHref?: string;
  previewSettings?: DistributorSystemSettings;
  hideHeaderActions?: boolean;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({
  invoice,
  backHref = "/retailer/orders",
  previewSettings,
  hideHeaderActions = false,
}) => {
  const storeSettings = marketplaceStore.getDistributorSettings(invoice.distributorId);
  const activeSettings: DistributorSystemSettings = previewSettings || storeSettings;

  const [currentTemplate, setCurrentTemplate] = useState<InvoiceTemplateType>(
    activeSettings.invoiceTemplate || "IRD_STANDARD"
  );

  const handlePrint = () => {
    window.print();
  };

  const templateOptions: { id: InvoiceTemplateType; label: string; icon: any }[] = [
    { id: "IRD_STANDARD", label: "IRD Standard (कर बीजक)", icon: ShieldCheck },
    { id: "THERMAL_POS", label: "80mm Thermal POS", icon: Receipt },
    { id: "FMCG_MODERN", label: "Modern Wholesale", icon: LayoutTemplate },
    { id: "COMPACT_B2B", label: "Compact Dispatch", icon: Layers },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Action Bar (Hidden when printing) */}
      {!hideHeaderActions && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 no-print bg-white p-4 rounded-xl border border-slate-200 shadow-soft">
          <div className="flex items-center gap-3">
            <Link
              href={backHref}
              className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-[#0759C7] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Link>

            {/* Template Switcher Pills */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {templateOptions.map((opt) => {
                const Icon = opt.icon;
                const isSel = currentTemplate === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setCurrentTemplate(opt.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all",
                      isSel
                        ? "bg-white text-[#0759C7] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-2 text-xs font-bold"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-2 text-xs font-bold shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TEMPLATE 1: NEPAL IRD STANDARD TAX INVOICE (आधिकारिक कर बीजक)
          ========================================================================= */}
      {currentTemplate === "IRD_STANDARD" && (
        <div className="printable-invoice bg-white border border-slate-300 rounded-xl p-6 sm:p-10 shadow-card text-slate-900">
          {/* IRD Top Banner */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 text-center">
            {activeSettings.showIrdApprovalNote && (
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Government of Nepal • Ministry of Finance • Inland Revenue Department (IRD) Approved Billing System
              </p>
            )}
            <h1 className="text-xl sm:text-2xl font-black text-[#102C55] mt-1 tracking-tight">
              {activeSettings.invoiceTitle || "कर बीजक (TAX INVOICE)"}
            </h1>
            {activeSettings.showIrdApprovalNote && activeSettings.irdApprovalCode && (
              <p className="text-[11px] font-mono text-slate-600 mt-0.5">
                Machine Approval Code: <span className="font-bold">{activeSettings.irdApprovalCode}</span> • Fiscal Year:{" "}
                <span className="font-bold">{activeSettings.fiscalYear || "२०८१/०८२"}</span>
              </p>
            )}
          </div>

          {/* Seller & Invoice Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-slate-200 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-[#102C55]">{invoice.distributorName}</span>
                {activeSettings.showCompanyLogo && (
                  <span className="text-[9px] bg-blue-100 text-[#0759C7] font-bold px-1.5 py-0.5 rounded">
                    DISTRIBUTOR
                  </span>
                )}
              </div>
              <p className="text-slate-600 mt-0.5">{invoice.distributorAddress}</p>
              <p className="text-slate-600">Tel: {invoice.distributorPhone}</p>
              <div className="mt-2 p-2 bg-blue-50/70 rounded border border-blue-200 inline-block">
                <span className="font-semibold text-slate-700">विक्रेताको स्थायी लेखा नं (Seller PAN): </span>
                <span className="font-mono font-black text-sm text-[#0759C7] tracking-wider">
                  {invoice.distributorPan}
                </span>
              </div>
            </div>

            <div className="sm:text-right space-y-1">
              <div className="inline-block bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-left sm:text-right min-w-[200px]">
                <p className="text-[10px] text-slate-500 font-bold uppercase">बीजक नं. / Invoice No</p>
                <p className="text-sm font-black font-mono text-[#0759C7]">{invoice.invoiceNumber}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1.5">अर्डर नं. / Order Ref</p>
                <p className="font-mono font-bold text-slate-800">{invoice.orderNumber}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1.5">जारी मिति / Date of Issue</p>
                <p className="font-bold text-slate-700">{formatDate(invoice.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Buyer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 my-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <p className="font-black text-[#102C55] uppercase text-[11px] mb-1">खरिदकर्ताको विवरण (Buyer / Billed To):</p>
              <p className="font-bold text-sm text-slate-900">{invoice.retailerShop}</p>
              <p className="text-slate-600">सञ्चालक / Proprietor: {invoice.retailerName}</p>
              <p className="text-slate-600">ठेगाना / Address: {invoice.retailerAddress}</p>
              <p className="text-slate-600">सम्पर्क / Phone: {invoice.retailerPhone}</p>
              <div className="mt-1.5 inline-block">
                <span className="font-bold text-slate-800">खरिदकर्ताको PAN/VAT: </span>
                <span className="font-mono font-bold text-[#0759C7]">
                  {invoice.retailerPan || "दर्ता नभएको (Unregistered Retailer)"}
                </span>
              </div>
            </div>

            <div className="sm:text-right flex flex-col justify-between">
              <div>
                <p className="font-black text-[#102C55] uppercase text-[11px] mb-1">भुक्तानी स्थिति / Status:</p>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                    invoice.status === "PAID"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  )}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {invoice.status === "PAID" ? "पूर्ण भुक्तानी (PAID IN FULL)" : "नगद बुझाउन बाँकी (COD PENDING)"}
                </span>
              </div>

              {activeSettings.showDriverInfo && (
                <div className="mt-2 text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-[#102C55]">डेलिभरी विवरण: </span>
                  <span>गाडी नं: बा २ ख ४४९० • चालक: ९८४१००९९८८</span>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto my-4">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-900 text-slate-900 font-black text-[11px]">
                  <th className="py-2.5 px-2 text-center w-10 border-r border-slate-200">क्र.सं.</th>
                  <th className="py-2.5 px-2 border-r border-slate-200">विवरण (Description of Goods)</th>
                  {activeSettings.showHsnCodes && (
                    <th className="py-2.5 px-2 text-center border-r border-slate-200">HSN/Code</th>
                  )}
                  <th className="py-2.5 px-2 text-center border-r border-slate-200">एकाइ (Unit)</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-200">परिमाण (Qty)</th>
                  <th className="py-2.5 px-2 text-right border-r border-slate-200">दर (Rate)</th>
                  <th className="py-2.5 px-2 text-right">जम्मा (Total NPR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items
                  .filter((item) => !item.isCancelled)
                  .map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-2 text-center font-mono text-slate-500 border-r border-slate-200">
                        {index + 1}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-200">
                        <p className="font-bold text-slate-900">{item.productTitle}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          {activeSettings.showPrincipalCompany && item.companyName && (
                            <span className="text-[9px] font-bold bg-blue-50 text-blue-800 px-1 py-0.2 rounded border border-blue-200">
                              {item.companyName}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono">SKU: {item.productSku}</span>
                          {item.freeSchemeNote && activeSettings.showFreeAndOfferItems && (
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                              योजना: {item.freeSchemeNote}
                            </span>
                          )}
                        </div>
                      </td>
                      {activeSettings.showHsnCodes && (
                        <td className="py-2 px-2 text-center font-mono text-slate-600 border-r border-slate-200">
                          {item.isVatExempt ? "0402.10" : "1902.30"}
                        </td>
                      )}
                      <td className="py-2 px-2 text-center text-slate-700 font-medium border-r border-slate-200">
                        {item.unitType}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-slate-900 border-r border-slate-200">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-2 text-right font-mono border-r border-slate-200">
                        {formatNPR(item.unitPrice)}
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                        {formatNPR(item.totalPrice)}
                      </td>
                    </tr>
                  ))}

                {/* Free Items Row */}
                {activeSettings.showFreeAndOfferItems &&
                  invoice.freeItemsAwarded &&
                  invoice.freeItemsAwarded.map((freeItem, fIdx) => (
                    <tr key={`free_${fIdx}`} className="bg-emerald-50/60 text-emerald-900">
                      <td className="py-2 px-2 text-center font-mono text-emerald-700 border-r border-slate-200">
                        {invoice.items.length + fIdx + 1}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-200" colSpan={activeSettings.showHsnCodes ? 2 : 1}>
                        <p className="font-bold text-emerald-900">{freeItem.title}</p>
                        <p className="text-[10px] text-emerald-700">
                          व्यापारिक योजना निःशुल्क वस्तु (Trade Scheme 100% Discount Bonus)
                        </p>
                      </td>
                      <td className="py-2 px-2 text-center text-emerald-800 font-medium border-r border-slate-200">
                        {freeItem.unitType}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-emerald-900 border-r border-slate-200">
                        {freeItem.quantity}
                      </td>
                      <td className="py-2 px-2 text-right font-mono text-emerald-700 border-r border-slate-200">
                        रू ०.००
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-black text-emerald-800">
                        निःशुल्क (FREE)
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Calculations & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t-2 border-slate-900 text-xs">
            <div className="space-y-3">
              {/* Bank & Payment Instructions */}
              {activeSettings.showBankAndQR && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <p className="font-bold text-[#102C55] flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-[#0759C7]" />
                    <span>बैंक भुक्तानी तथा Fonepay QR विवरण:</span>
                  </p>
                  <p className="text-slate-700 font-medium">बैंक: {activeSettings.bankName || "NIC ASIA Bank Ltd"}</p>
                  <p className="text-slate-700">खातावाला: {activeSettings.accountName || invoice.distributorName}</p>
                  <p className="text-slate-900 font-mono font-bold">
                    खाता नं.: {activeSettings.accountNumber || "0123489120001"}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                    {activeSettings.paymentInstructions ||
                      "Fonepay मार्फत भुक्तानी गर्दा अर्डर नम्बर उल्लेख गर्नुहोला।"}
                  </p>
                </div>
              )}

              {/* Legal Terms & Conditions */}
              {activeSettings.termsAndConditions && (
                <div className="p-2.5 bg-slate-50/50 rounded border border-slate-200 text-[11px] text-slate-600 whitespace-pre-line">
                  <p className="font-bold text-slate-800 mb-0.5">नियम तथा सर्तहरू (Terms & Conditions):</p>
                  {activeSettings.termsAndConditions}
                </div>
              )}
            </div>

            {/* Financial Ledger */}
            <div className="space-y-2 border border-slate-200 p-3.5 rounded-lg bg-slate-50">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">करयोग्य रकम (Taxable Subtotal):</span>
                <span className="font-mono font-bold">{formatNPR(invoice.taxableAmount)}</span>
              </div>

              {Boolean(invoice.vatExemptAmount && invoice.vatExemptAmount > 0) && (
                <div className="flex justify-between py-1 border-b border-slate-200 text-amber-800">
                  <span>कर छुट रकम (VAT-Exempt):</span>
                  <span className="font-mono font-bold">{formatNPR(invoice.vatExemptAmount)}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">
                  मूल्य अभिवृद्धि कर ({activeSettings.vatRate || 13}% VAT):
                </span>
                <span className="font-mono font-bold">{formatNPR(invoice.vatAmount)}</span>
              </div>

              {Boolean(invoice.cashDiscountAmount && invoice.cashDiscountAmount > 0) && (
                <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700 font-bold">
                  <span>नगद छुट (Cash Discount):</span>
                  <span className="font-mono">-{formatNPR(invoice.cashDiscountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between py-2 text-sm font-black text-[#102C55] border-t-2 border-slate-900 bg-white px-2 rounded">
                <span>कुल जम्मा (Grand Total):</span>
                <span className="font-mono text-base text-[#0759C7]">{formatNPR(invoice.grandTotal)}</span>
              </div>

              <p className="text-[10px] text-slate-500 text-right pt-1">
                अक्षरेपी: नेपाली रुपैयाँ {Math.round(invoice.grandTotal).toLocaleString("ne-NP")} मात्र।
              </p>
            </div>
          </div>

          {/* Footer Note */}
          {activeSettings.footerNote && (
            <p className="text-center text-xs font-semibold text-slate-600 mt-6 pt-3 border-t border-slate-200">
              {activeSettings.footerNote}
            </p>
          )}

          {/* Dual Signatures */}
          {activeSettings.showSignatures && (
            <div className="mt-12 pt-6 border-t border-dashed border-slate-300 flex justify-between items-end text-xs text-slate-600">
              <div>
                <div className="h-10 w-36 border-b border-slate-400"></div>
                <p className="mt-1 font-bold text-slate-800">खरिदकर्ताको दस्तखत र छाप</p>
                <p className="text-[10px] text-slate-500">Receiver's Signature & Stamp</p>
              </div>

              <div className="text-right">
                <div className="h-10 w-36 border-b border-slate-400 ml-auto"></div>
                <p className="mt-1 font-bold text-slate-800">अधिकृत हस्ताक्षर (Authorized Signatory)</p>
                <p className="text-[10px] text-slate-500">For {invoice.distributorName}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TEMPLATE 2: 80MM THERMAL POS RECEIPT (डेलिभरी चालक रसिद)
          ========================================================================= */}
      {currentTemplate === "THERMAL_POS" && (
        <div className="printable-invoice bg-white border border-slate-300 rounded-xl p-5 max-w-[380px] mx-auto shadow-card text-slate-900 font-mono text-[11px] leading-relaxed">
          {/* Header */}
          <div className="text-center border-b border-dashed border-slate-400 pb-3 mb-3">
            <h2 className="text-sm font-black uppercase tracking-tight">{invoice.distributorName}</h2>
            <p className="text-[10px] text-slate-600">{invoice.distributorAddress}</p>
            <p className="text-[10px] text-slate-600">TEL: {invoice.distributorPhone}</p>
            <p className="text-[11px] font-bold mt-1">SELLER PAN: {invoice.distributorPan}</p>
            <div className="mt-1.5 py-0.5 bg-slate-100 rounded font-black text-xs uppercase">
              *** {activeSettings.invoiceTitle || "TAX INVOICE / कर बीजक"} ***
            </div>
          </div>

          {/* Metadata */}
          <div className="border-b border-dashed border-slate-400 pb-2 mb-2 space-y-0.5 text-[10px]">
            <div className="flex justify-between">
              <span>INV NO:</span>
              <span className="font-bold">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>ORDER:</span>
              <span>{invoice.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>DATE:</span>
              <span>{formatDate(invoice.createdAt)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>BUYER:</span>
              <span>{invoice.retailerShop}</span>
            </div>
            <div className="flex justify-between">
              <span>BUYER PAN:</span>
              <span>{invoice.retailerPan || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>STATUS:</span>
              <span className="font-bold">{invoice.status === "PAID" ? "PAID" : "COD PENDING"}</span>
            </div>
          </div>

          {/* Items */}
          <div className="border-b border-dashed border-slate-400 pb-2 mb-2">
            <div className="flex justify-between font-bold text-[10px] border-b border-slate-200 pb-1 mb-1">
              <span className="w-1/2">ITEM</span>
              <span className="w-1/4 text-center">QTY</span>
              <span className="w-1/4 text-right">TOTAL</span>
            </div>
            {invoice.items
              .filter((i) => !i.isCancelled)
              .map((item) => (
                <div key={item.id} className="py-0.5 text-[10px]">
                  <p className="font-bold truncate">{item.productTitle}</p>
                  <div className="flex justify-between text-slate-600">
                    <span>
                      {item.quantity} x {formatNPR(item.unitPrice)}
                    </span>
                    <span className="font-bold text-slate-900">{formatNPR(item.totalPrice)}</span>
                  </div>
                </div>
              ))}

            {/* Free items */}
            {activeSettings.showFreeAndOfferItems &&
              invoice.freeItemsAwarded &&
              invoice.freeItemsAwarded.map((freeItem, fIdx) => (
                <div key={`free_th_${fIdx}`} className="py-0.5 text-[10px] text-emerald-800">
                  <p className="font-bold truncate">[FREE] {freeItem.title}</p>
                  <div className="flex justify-between">
                    <span>{freeItem.quantity} units (Scheme)</span>
                    <span className="font-bold">Rs. 0.00</span>
                  </div>
                </div>
              ))}
          </div>

          {/* Totals */}
          <div className="border-b border-dashed border-slate-400 pb-2 mb-3 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>TAXABLE:</span>
              <span>{formatNPR(invoice.taxableAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (13%):</span>
              <span>{formatNPR(invoice.vatAmount)}</span>
            </div>
            <div className="flex justify-between text-xs font-black border-t border-slate-900 pt-1">
              <span>GRAND TOTAL:</span>
              <span>{formatNPR(invoice.grandTotal)}</span>
            </div>
          </div>

          {/* Bank & Payment QR */}
          {activeSettings.showBankAndQR && (
            <div className="text-center p-2 bg-slate-50 border border-slate-200 rounded mb-3 text-[10px]">
              <p className="font-bold">FONEPAY / BANK DEPOSIT</p>
              <p>{activeSettings.bankName}</p>
              <p className="font-mono font-bold">A/C: {activeSettings.accountNumber}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-[9px] text-slate-500 space-y-1">
            <p>*** THANK YOU FOR YOUR BUSINESS ***</p>
            {activeSettings.irdApprovalCode && <p>IRD POS: {activeSettings.irdApprovalCode}</p>}
            <p>Signature: ______________________</p>
          </div>
        </div>
      )}

      {/* =========================================================================
          TEMPLATE 3: MODERN FMCG WHOLESALE EXECUTIVE INVOICE
          ========================================================================= */}
      {currentTemplate === "FMCG_MODERN" && (
        <div className="printable-invoice bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-card text-slate-800">
          {/* Modern Header */}
          <div className="bg-linear-to-r from-[#102C55] to-[#0759C7] text-white p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight">{invoice.distributorName}</span>
                <span className="text-[10px] bg-[#F58220] font-black px-2 py-0.5 rounded text-white uppercase">
                  FMCG WHOLESALE
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-1">{invoice.distributorAddress}</p>
              <p className="text-xs text-blue-200">
                Seller PAN: <span className="font-mono font-bold">{invoice.distributorPan}</span> • Phone:{" "}
                {invoice.distributorPhone}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs bg-white/20 text-white font-bold px-3 py-1 rounded-full uppercase">
                {activeSettings.invoiceTitle || "TAX INVOICE"}
              </span>
              <p className="text-lg font-black font-mono text-white mt-2">{invoice.invoiceNumber}</p>
              <p className="text-xs text-blue-200">{formatDate(invoice.createdAt)}</p>
            </div>
          </div>

          {/* Modern Bill To Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Retailer Account:
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">{invoice.retailerShop}</h3>
              <p className="text-slate-600 mt-0.5">{invoice.retailerAddress}</p>
              <p className="text-slate-600">Contact: {invoice.retailerPhone}</p>
              <p className="font-bold text-[#0759C7] mt-1">PAN: {invoice.retailerPan || "Unregistered"}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Payment & Terms:
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "text-xs font-bold px-2.5 py-0.5 rounded-full",
                      invoice.status === "PAID"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {invoice.status === "PAID" ? "Settled (PAID)" : "Due Upon Delivery (COD)"}
                  </span>
                  <span className="text-slate-500 text-[11px]">Net {activeSettings.maxCreditDays || 15} Days</span>
                </div>
              </div>

              {activeSettings.showDriverInfo && (
                <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200 mt-2">
                  <span className="font-bold">Delivery Vehicle:</span> Ba 2 Kha 4490 (Driver: 9841009988)
                </div>
              )}
            </div>
          </div>

          {/* Modern Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="p-3 w-10 text-center">#</th>
                  <th className="p-3">Product / Principal Brand</th>
                  <th className="p-3 text-center">Unit</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Wholesale Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items
                  .filter((i) => !i.isCancelled)
                  .map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{item.productTitle}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {item.companyName && (
                            <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                              {item.companyName}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono">SKU: {item.productSku}</span>
                          {item.freeSchemeNote && (
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                              {item.freeSchemeNote}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center font-medium text-slate-600">{item.unitType}</td>
                      <td className="p-3 text-center font-bold text-slate-900">{item.quantity}</td>
                      <td className="p-3 text-right font-mono">{formatNPR(item.unitPrice)}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {formatNPR(item.totalPrice)}
                      </td>
                    </tr>
                  ))}

                {/* Free Items */}
                {activeSettings.showFreeAndOfferItems &&
                  invoice.freeItemsAwarded &&
                  invoice.freeItemsAwarded.map((freeItem, fIdx) => (
                    <tr key={`mod_free_${fIdx}`} className="bg-emerald-50 text-emerald-900 font-medium">
                      <td className="p-3 text-center font-mono text-emerald-600">
                        {invoice.items.length + fIdx + 1}
                      </td>
                      <td className="p-3" colSpan={2}>
                        <p className="font-bold">{freeItem.title}</p>
                        <span className="text-[10px] text-emerald-700">Trade Scheme Bonus</span>
                      </td>
                      <td className="p-3 text-center font-bold">{freeItem.quantity}</td>
                      <td className="p-3 text-right font-mono text-emerald-600">Rs. 0.00</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-800">FREE</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Modern Totals & Settlement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
            <div>
              {activeSettings.showBankAndQR && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                  <p className="font-bold text-[#0759C7] flex items-center gap-1.5">
                    <QrCode className="w-4 h-4" />
                    <span>Instant Fonepay Settlement:</span>
                  </p>
                  <p className="text-slate-800 font-medium">{activeSettings.bankName}</p>
                  <p className="text-slate-900 font-mono font-bold">A/C: {activeSettings.accountNumber}</p>
                  <p className="text-[10px] text-slate-500">{activeSettings.paymentInstructions}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount:</span>
                <span className="font-mono font-medium">{formatNPR(invoice.taxableAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT (13%):</span>
                <span className="font-mono font-medium">{formatNPR(invoice.vatAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#102C55] pt-2 border-t border-slate-200">
                <span>Total Payable:</span>
                <span className="font-mono text-[#0759C7]">{formatNPR(invoice.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TEMPLATE 4: COMPACT B2B DISPATCH SLIP (छोटो वितरण पुर्जी)
          ========================================================================= */}
      {currentTemplate === "COMPACT_B2B" && (
        <div className="printable-invoice bg-white border border-slate-300 rounded-xl p-5 sm:p-7 shadow-card text-slate-800 text-xs">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-3">
            <div>
              <h2 className="text-base font-black text-[#102C55]">{invoice.distributorName}</h2>
              <p className="text-[11px] text-slate-500">PAN: {invoice.distributorPan} • Dispatch Slip</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-black text-sm text-[#0759C7]">{invoice.invoiceNumber}</p>
              <p className="text-[10px] text-slate-500">{formatDate(invoice.createdAt)}</p>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-200 mb-3 flex justify-between items-center text-[11px]">
            <div>
              <span className="text-slate-400">Buyer: </span>
              <span className="font-bold text-slate-900">{invoice.retailerShop}</span>
              <span className="text-slate-500"> ({invoice.retailerPhone})</span>
            </div>
            <div>
              <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                {invoice.status}
              </span>
            </div>
          </div>

          <table className="w-full text-left text-[11px] border border-slate-200 mb-3">
            <thead className="bg-slate-100 font-bold border-b border-slate-300">
              <tr>
                <th className="p-2 w-8 text-center">#</th>
                <th className="p-2">Description</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items
                .filter((i) => !i.isCancelled)
                .map((item, idx) => (
                  <tr key={item.id}>
                    <td className="p-2 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-2 font-medium">{item.productTitle}</td>
                    <td className="p-2 text-center font-bold">
                      {item.quantity} {item.unitType}
                    </td>
                    <td className="p-2 text-right font-mono font-bold">{formatNPR(item.totalPrice)}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center pt-2 border-t border-slate-900 text-xs font-bold">
            <span className="text-slate-600">Net Grand Total:</span>
            <span className="font-mono text-sm text-[#0759C7]">{formatNPR(invoice.grandTotal)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
