import React from "react";
import { Sidebar } from "@/components/shared/sidebar";
import Link from "next/link";
import { ShieldAlert, Bell, Globe } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar type="ADMIN" userName="Super Admin" userTitle="Platform Root Control" />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-sm text-[#102C55]">B2B Deal Super Admin Panel</span>
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              <ShieldAlert className="w-3.5 h-3.5" />
              All-Nepal Oversight
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <Link
              href="/"
              className="text-[#0759C7] hover:underline font-semibold flex items-center gap-1 hidden sm:inline-flex"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Marketplace</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#102C55] text-white flex items-center justify-center font-bold">
                A
              </div>
              <span className="font-bold text-slate-800 hidden sm:inline-block">Platform Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
