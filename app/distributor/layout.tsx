import React from "react";
import { Sidebar } from "@/components/shared/sidebar";
import marketplaceStore from "@/lib/db/store";
import Link from "next/link";
import { ShieldCheck, Bell } from "lucide-react";

export default function DistributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dist = marketplaceStore.getDistributorById("dist_1");

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar
        type="DISTRIBUTOR"
        userName={dist?.companyName || "Himalayan FMCG Distributors"}
        userTitle={`${dist?.district || "Kathmandu"} • PAN: ${dist?.panVatNumber || "602348912"}`}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-sm text-[#102C55]">Distributor Control Center</span>
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Distributor
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <Link
              href="/"
              className="text-[#0759C7] hover:underline font-semibold hidden sm:inline-block"
            >
              Retailer View
            </Link>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#0759C7] text-white flex items-center justify-center font-bold">
                H
              </div>
              <span className="font-bold text-slate-800 hidden sm:inline-block">Himalayan FMCG</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
