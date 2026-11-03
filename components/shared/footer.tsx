import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, CreditCard } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#102C55] text-white pt-12 pb-20 md:pb-12 border-t border-slate-800 no-print">
      {/* Platform Value Props */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 pb-10 border-b border-slate-700/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-[#0759C7]">
              <Truck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Direct Distributor Dispatch</p>
              <p className="text-xs text-slate-400 mt-0.5">Prompt delivery across all 7 provinces</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-orange-600/20 text-[#F58220]">
              <CreditCard className="w-5 h-5 text-[#F58220]" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Transparent Wholesale Rates</p>
              <p className="text-xs text-slate-400 mt-0.5">Tiered carton pricing & VAT invoices</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">100% Verified Sellers</p>
              <p className="text-xs text-slate-400 mt-0.5">Authentic FMCG with PAN/VAT verified</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
              <RefreshCw className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Simplified Reordering</p>
              <p className="text-xs text-slate-400 mt-0.5">1-click repeat orders for retail shops</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-5 gap-8 text-xs text-slate-400">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0759C7] flex items-center justify-center text-white font-black text-base">
              B2B
            </div>
            <div>
              <span className="text-lg font-black text-white">B2B Deal</span>
              <span className="text-[10px] text-[#F58220] ml-1 font-bold">NEPAL</span>
            </div>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
            Nepal's leading business-to-business wholesale marketplace platform connecting retail shops, kirana stores,
            hotels, and supermarkets directly with authorized wholesale distributors and FMCG manufacturers.
          </p>
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>Kuleshwor Wholesale Hub & New Road Commercial Center, Kathmandu</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>+977-01-4455667 / 9801234567 (Sun - Fri: 8 AM - 7 PM)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>support@b2bdeal.com.np</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Wholesale Categories</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/categories/beverages" className="hover:text-white transition-colors">
                Beverages & Cold Drinks
              </Link>
            </li>
            <li>
              <Link href="/categories/snacks" className="hover:text-white transition-colors">
                Noodles, Biscuits & Snacks
              </Link>
            </li>
            <li>
              <Link href="/categories/grocery" className="hover:text-white transition-colors">
                Rice, Oil, Flour & Staples
              </Link>
            </li>
            <li>
              <Link href="/categories/personal-care" className="hover:text-white transition-colors">
                Personal Care & Soaps
              </Link>
            </li>
            <li>
              <Link href="/categories/household" className="hover:text-white transition-colors">
                Detergents & Cleaning
              </Link>
            </li>
            <li>
              <Link href="/categories/dairy-bakery" className="hover:text-white transition-colors">
                Dairy & Bakery Bulk
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">For Businesses</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/distributor-register" className="hover:text-white transition-colors text-[#F58220] font-semibold">
                Apply as a Distributor
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-white transition-colors">
                Retailer Registration
              </Link>
            </li>
            <li>
              <Link href="/distributor/dashboard" className="hover:text-white transition-colors">
                Distributor Web Portal
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard" className="hover:text-white transition-colors">
                Super Admin Dashboard
              </Link>
            </li>
            <li>
              <Link href="/retailer/orders" className="hover:text-white transition-colors">
                Order Tracking & Invoices
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Supported Payments</h4>
          <p className="text-slate-400 mb-3 leading-relaxed">
            Multi-channel wholesale settlement supported across Nepal:
          </p>
          <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
            <span className="bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700">Cash on Delivery</span>
            <span className="bg-green-950 text-green-300 px-2 py-1 rounded border border-green-800">eSewa Ready</span>
            <span className="bg-purple-950 text-purple-300 px-2 py-1 rounded border border-purple-800">Khalti Ready</span>
            <span className="bg-red-950 text-red-300 px-2 py-1 rounded border border-red-800">Fonepay QR</span>
            <span className="bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700">Bank Transfer / Cheque</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 B2B Deal Nepal Pvt. Ltd. All rights reserved. Nepal VAT Reg: 602348912</p>
        <div className="flex items-center space-x-4">
          <Link href="/terms" className="hover:underline">
            Wholesale Terms
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/tax-compliance" className="hover:underline">
            IRD Tax Compliance
          </Link>
        </div>
      </div>
    </footer>
  );
};
