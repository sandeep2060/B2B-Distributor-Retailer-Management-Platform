"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Percent,
  BarChart3,
  Settings,
  Users,
  Store,
  Building2,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface SidebarProps {
  type: "DISTRIBUTOR" | "ADMIN";
  userTitle?: string;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ type, userTitle, userName }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const distributorNav: NavItem[] = [
    { label: "Dashboard", href: "/distributor/dashboard", icon: LayoutDashboard },
    { label: "Product Catalog", href: "/distributor/products", icon: Package },
    { label: "Wholesale Offers", href: "/distributor/offers", icon: Percent },
    { label: "Orders Received", href: "/distributor/orders", icon: ShoppingCart, badge: "2 New" },
    { label: "Delivery Tracking", href: "/distributor/deliveries", icon: Truck },
    { label: "Commissions", href: "/distributor/commissions", icon: BarChart3 },
    { label: "Business Profile", href: "/distributor/settings", icon: Settings },
  ];

  const adminNav: NavItem[] = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Distributors", href: "/admin/distributors", icon: Building2, badge: "3" },
    { label: "Retailers", href: "/admin/retailers", icon: Store },
    { label: "All Products", href: "/admin/products", icon: Package },
    { label: "Platform Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Commission Ledger", href: "/admin/commissions", icon: Percent },
    { label: "Analytics & Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Platform Settings", href: "/admin/settings", icon: Settings },
  ];

  const navItems = type === "ADMIN" ? adminNav : distributorNav;
  const portalName = type === "ADMIN" ? "Super Admin" : "Distributor Portal";
  const portalColor = type === "ADMIN" ? "bg-amber-600" : "bg-[#0759C7]";

  return (
    <aside
      className={cn(
        "bg-[#102C55] text-white flex flex-col justify-between transition-all duration-300 min-h-screen sticky top-0 z-30 shadow-xl border-r border-slate-800",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#0759C7] flex items-center justify-center font-black text-white text-sm shadow-md">
                B2B
              </div>
              <div>
                <span className="font-black text-white tracking-tight">B2B Deal</span>
                <span className={cn("text-[9px] font-bold text-white px-1.5 py-0.2 rounded ml-1.5", portalColor)}>
                  {type === "ADMIN" ? "ADMIN" : "PORTAL"}
                </span>
              </div>
            </Link>
          )}

          {isCollapsed && (
            <div className="w-8 h-8 mx-auto rounded-lg bg-[#0759C7] flex items-center justify-center font-black text-white text-xs">
              B2B
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden lg:block"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Card */}
        {!isCollapsed && (
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-xs">
                {userName ? userName.charAt(0) : type === "ADMIN" ? "A" : "H"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">
                  {userName || (type === "ADMIN" ? "Super Admin" : "Himalayan FMCG")}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {userTitle || (type === "ADMIN" ? "Platform Control" : "Distributor: Kathmandu")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/distributor/dashboard" && item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group relative",
                  isActive
                    ? "bg-[#0759C7] text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                {!isCollapsed && item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F58220] text-white">
                    {item.badge}
                  </span>
                )}
                {isCollapsed && item.badge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F58220]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls: Back to Retailer platform & Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors",
            isCollapsed && "justify-center"
          )}
          title="Back to Retailer Marketplace"
        >
          <ExternalLink className="w-4 h-4 text-blue-400" />
          {!isCollapsed && <span>View Marketplace</span>}
        </Link>
        <Link
          href="/login"
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors",
            isCollapsed && "justify-center"
          )}
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Sign Out</span>}
        </Link>
      </div>
    </aside>
  );
};
