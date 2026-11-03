"use client";

import React from "react";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { MockInvoice } from "@/lib/db/mock-data";
import { Button } from "../ui/button";
import { Printer, Download, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface InvoiceViewProps {
  invoice: MockInvoice;
  backHref?: string;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ invoice, backHref = "/retailer/orders" }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Action Bar (Hidden when printing) */}
      <div className="flex items-center justify-between no-print bg-white p-4 rounded-xl border border-slate-200 shadow-soft">
        <Link
          href={backHref}
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-[#0759C7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print Tax Invoice
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Tax Invoice Document */}
      <div className="printable-invoice bg-white border border-slate-200 rounded-xl p-8 sm:p-12 shadow-card text-slate-800">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[#102C55] tracking-tight">B2B Deal</span>
                <span className="text-xs bg-blue-100 text-[#0759C7] font-bold px-2 py-0.5 rounded">TAX INVOICE</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Nepal's B2B Wholesale Marketplace Platform</p>
              <div className="mt-4 text-xs space-y-0.5 text-slate-600">
                <p className="font-bold text-[#102C55] text-sm">{invoice.distributorName}</p>
                <p>{invoice.distributorAddress}</p>
                <p>Phone: {invoice.distributorPhone}</p>
                <p className="font-bold text-slate-900">
                  Seller PAN/VAT: <span className="font-mono text-sm tracking-wider">{invoice.distributorPan}</span>
                </p>
              </div>
            </div>

            <div className="sm:text-right space-y-1 text-xs">
              <div className="inline-block bg-slate-50 border border-slate-200 rounded-lg p-3 text-left sm:text-right">
                <p className="text-slate-500 font-semibold">INVOICE NUMBER</p>
                <p className="text-base font-black font-mono text-[#0759C7]">{invoice.invoiceNumber}</p>
                <p className="text-slate-500 mt-2 font-semibold">ORDER REFERENCE</p>
                <p className="font-mono font-bold text-slate-700">{invoice.orderNumber}</p>
                <p className="text-slate-500 mt-2 font-semibold">DATE OF ISSUE</p>
                <p className="font-medium text-slate-800">{formatDate(invoice.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To / Buyer Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-lg bg-slate-50 border border-slate-100 mb-8 text-xs">
          <div>
            <p className="font-bold text-[#102C55] uppercase tracking-wider mb-1">Billed To (Buyer):</p>
            <p className="font-bold text-sm text-slate-900">{invoice.retailerShop}</p>
            <p className="text-slate-600">Proprietor: {invoice.retailerName}</p>
            <p className="text-slate-600">{invoice.retailerAddress}</p>
            <p className="text-slate-600">Phone: {invoice.retailerPhone}</p>
            <p className="font-bold text-slate-900 mt-1">
              Buyer PAN/VAT:{" "}
              <span className="font-mono text-slate-800">{invoice.retailerPan || "Unregistered Retailer"}</span>
            </p>
          </div>
          <div className="sm:text-right flex flex-col justify-between">
            <div>
              <p className="font-bold text-[#102C55] uppercase tracking-wider mb-1">Invoice Status:</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {invoice.status === "PAID" ? "PAID IN FULL" : "PAYMENT DUE (COD)"}
              </div>
            </div>
            <p className="text-slate-500 text-[11px] mt-4">
              Jurisdiction: Government of Nepal, Inland Revenue Department (IRD) Standards
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-y-2 border-slate-900 text-slate-900 uppercase font-black tracking-wider text-[11px]">
                <th className="py-3 px-2 text-center w-10">SN</th>
                <th className="py-3 px-2">Description of Goods</th>
                <th className="py-3 px-2 text-center">Unit / Packaging</th>
                <th className="py-3 px-2 text-center">Qty</th>
                <th className="py-3 px-2 text-right">Wholesale Rate (NPR)</th>
                <th className="py-3 px-2 text-right">Taxable Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.items.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-2 text-center font-mono text-slate-500">{index + 1}</td>
                  <td className="py-3 px-2">
                    <p className="font-bold text-slate-900">{item.productTitle}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-500 font-mono">SKU: {item.productSku}</span>
                      {item.isVatExempt ? (
                        <span className="text-[9px] font-bold bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                          VAT Exempt (Sched 1)
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          13% Taxable
                        </span>
                      )}
                      {item.freeSchemeNote && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                          Scheme: {item.freeSchemeNote}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center text-slate-600 font-medium">{item.unitType}</td>
                  <td className="py-3 px-2 text-center font-bold text-slate-900">{item.quantity}</td>
                  <td className="py-3 px-2 text-right font-mono">{formatNPR(item.unitPrice)}</td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-slate-900">
                    {formatNPR(item.totalPrice)}
                  </td>
                </tr>
              ))}

              {/* Free Trade Scheme Items (Compliant IRD Zero-Rate Trade Incentive) */}
              {invoice.freeItemsAwarded && invoice.freeItemsAwarded.length > 0 && (
                invoice.freeItemsAwarded.map((freeItem, fIdx) => (
                  <tr key={`free_${fIdx}`} className="bg-emerald-50/50 text-emerald-900">
                    <td className="py-3 px-2 text-center font-mono text-emerald-700">{invoice.items.length + fIdx + 1}</td>
                    <td className="py-3 px-2">
                      <p className="font-bold text-emerald-900">{freeItem.title}</p>
                      <p className="text-[10px] text-emerald-700">Trade Scheme Bonus / Free Promotion Goods (Zero Rated)</p>
                    </td>
                    <td className="py-3 px-2 text-center text-emerald-800 font-medium">{freeItem.unitType}</td>
                    <td className="py-3 px-2 text-center font-bold text-emerald-900">{freeItem.quantity}</td>
                    <td className="py-3 px-2 text-right font-mono text-emerald-700">Rs. 0.00</td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-emerald-800">Rs. 0.00 (FREE)</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t-2 border-slate-900 pt-6">
          <div className="text-xs space-y-2 max-w-sm text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified B2B Wholesale Electronic Invoice</span>
            </div>
            <p>
              Prepared in compliance with Inland Revenue Department (IRD) Nepal standards. Goods once delivered in sealed manufacturer packaging are covered by warranty against transit damage.
            </p>
            <p className="font-medium text-slate-700">Thank you for partnering with B2B Deal Nepal!</p>
          </div>

          <div className="w-full sm:w-80 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Taxable Goods Subtotal:</span>
              <span className="font-mono font-medium">{formatNPR(invoice.taxableAmount)}</span>
            </div>

            {Boolean(invoice.vatExemptAmount && invoice.vatExemptAmount > 0) && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">VAT-Exempt Goods Subtotal:</span>
                <span className="font-mono font-medium">{formatNPR(invoice.vatExemptAmount)}</span>
              </div>
            )}

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">VAT (13% Standard):</span>
              <span className="font-mono font-medium">{formatNPR(invoice.vatAmount)}</span>
            </div>

            {Boolean(invoice.cashDiscountAmount && invoice.cashDiscountAmount > 0) && (
              <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700 font-bold">
                <span>Spot Cash Discount (CD):</span>
                <span className="font-mono">-{formatNPR(invoice.cashDiscountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between py-2 text-sm font-black text-[#102C55] border-t-2 border-slate-900">
              <span>Grand Total:</span>
              <span className="font-mono text-base text-[#0759C7]">{formatNPR(invoice.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Signature & Seal Block */}
        <div className="mt-16 pt-8 border-t border-dashed border-slate-300 flex justify-between items-end text-xs text-slate-500">
          <div>
            <div className="h-12 w-32 border-b border-slate-400"></div>
            <p className="mt-1 font-semibold text-slate-700">Receiver's Signature & Stamp</p>
          </div>
          <div className="text-right">
            <div className="h-12 w-32 border-b border-slate-400 ml-auto"></div>
            <p className="mt-1 font-semibold text-slate-700">Authorized Signatory</p>
            <p className="text-[10px] text-slate-400">For {invoice.distributorName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
