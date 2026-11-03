"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import Link from "next/link";
import { ShieldAlert, Bell, Globe, Menu, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sliding Side Menu (Drawer on Mobile / Collapsible on Desktop) */}
      <Sidebar
        type="ADMIN"
        userName="Super Admin"
        userTitle="Platform Root Control"
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Hamburger to slide open side menu */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none transition-colors"
              title="Open side menu"
            >
              <Menu className="w-5 h-5 text-[#102C55]" />
            </button>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 hidden lg:flex items-center gap-1.5 text-xs font-semibold transition-colors border border-slate-200"
              title={isCollapsed ? "Expand side menu" : "Collapse side menu"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span className="text-[11px]">{isCollapsed ? "Expand Menu" : "Collapse Menu"}</span>
            </button>

            <span className="font-bold text-sm text-[#102C55] hidden sm:inline-block">B2B Deal Super Admin Panel</span>
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
