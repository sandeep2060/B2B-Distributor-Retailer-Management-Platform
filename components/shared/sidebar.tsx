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
  X,
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
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  type,
  userTitle,
  userName,
  isMobileOpen = false,
  onMobileClose,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
}) => {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const distributorNav: NavItem[] = [
    { label: "Dashboard", href: "/distributor/dashboard", icon: LayoutDashboard },
    { label: "Product Catalog", href: "/distributor/products", icon: Package },
    { label: "My Companies", href: "/distributor/companies", icon: Building2 },
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
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Sliding Aside */}
      <aside
        className={cn(
          // Base styles
          "bg-[#102C55] text-white flex flex-col justify-between h-screen sticky top-0 z-40 shadow-xl border-r border-slate-800/80 overflow-y-auto overflow-x-hidden transition-[width,transform] duration-300 ease-in-out select-none",
          // Desktop collapsing width
          isCollapsed ? "lg:w-20" : "lg:w-64",
          // Mobile Off-canvas sliding drawer
          "fixed inset-y-0 left-0 w-72 lg:static",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between min-h-[64px]">
            <Link
              href="/"
              onClick={onMobileClose}
              className="flex items-center gap-2 group min-w-0"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0759C7] flex items-center justify-center font-black text-white text-sm shadow-md shrink-0">
                B2B
              </div>
              <div
                className={cn(
                  "transition-all duration-300 overflow-hidden whitespace-nowrap",
                  isCollapsed ? "lg:opacity-0 lg:max-w-0" : "opacity-100 max-w-[180px]"
                )}
              >
                <span className="font-black text-white tracking-tight">B2B Deal</span>
                <span className={cn("text-[9px] font-bold text-white px-1.5 py-0.2 rounded ml-1.5", portalColor)}>
                  {type === "ADMIN" ? "ADMIN" : "PORTAL"}
                </span>
              </div>
            </Link>

            {/* Toggle Controls: Collapse on desktop / Close on mobile */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden lg:flex items-center justify-center"
                title={isCollapsed ? "Expand side menu" : "Collapse side menu"}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onMobileClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors lg:hidden"
                title="Close side menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Profile Card */}
          <div
            className={cn(
              "rounded-xl bg-slate-800/50 border border-slate-700/50 transition-all duration-300 overflow-hidden",
              isCollapsed ? "lg:p-2 lg:mx-2 lg:my-2" : "p-3 mx-3 my-3"
            )}
          >
            <div className={cn("flex items-center gap-2.5", isCollapsed && "lg:justify-center")}>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">
                {userName ? userName.charAt(0) : type === "ADMIN" ? "A" : "H"}
              </div>
              <div
                className={cn(
                  "transition-all duration-300 overflow-hidden whitespace-nowrap",
                  isCollapsed ? "lg:opacity-0 lg:max-w-0" : "opacity-100 max-w-[160px]"
                )}
              >
                <p className="text-xs font-bold text-white truncate">
                  {userName || (type === "ADMIN" ? "Super Admin" : "Himalayan FMCG")}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {userTitle || (type === "ADMIN" ? "Platform Control" : "Distributor: Kathmandu")}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/distributor/dashboard" &&
                  item.href !== "/admin/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group relative",
                    isActive
                      ? "bg-[#0759C7] text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                    isCollapsed && "lg:justify-center lg:px-2"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    )}
                  />

                  {/* Text label with smooth sliding fade */}
                  <span
                    className={cn(
                      "transition-all duration-300 overflow-hidden whitespace-nowrap flex-1",
                      isCollapsed ? "lg:opacity-0 lg:max-w-0" : "opacity-100 max-w-[160px]"
                    )}
                  >
                    {item.label}
                  </span>

                  {/* Badge */}
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F58220] text-white shrink-0 transition-all duration-300",
                        isCollapsed ? "lg:hidden" : "inline-block"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge && (
                    <span className="hidden lg:block absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F58220]" />
                  )}

                  {/* Desktop Hover Tooltip when Collapsed */}
                  {isCollapsed && (
                    <div className="hidden lg:group-hover:block absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-md shadow-2xl whitespace-nowrap z-50 pointer-events-none border border-slate-700 animate-in fade-in">
                      {item.label}
                    </div>
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
            onClick={onMobileClose}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors group relative",
              isCollapsed && "lg:justify-center lg:px-2"
            )}
            title="Back to Retailer Marketplace"
          >
            <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
            <span
              className={cn(
                "transition-all duration-300 overflow-hidden whitespace-nowrap",
                isCollapsed ? "lg:opacity-0 lg:max-w-0" : "opacity-100 max-w-[160px]"
              )}
            >
              View Marketplace
            </span>

            {isCollapsed && (
              <div className="hidden lg:group-hover:block absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-md shadow-2xl whitespace-nowrap z-50 pointer-events-none border border-slate-700 animate-in fade-in">
                View Marketplace
              </div>
            )}
          </Link>

          <Link
            href="/login"
            onClick={onMobileClose}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors group relative",
              isCollapsed && "lg:justify-center lg:px-2"
            )}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span
              className={cn(
                "transition-all duration-300 overflow-hidden whitespace-nowrap",
                isCollapsed ? "lg:opacity-0 lg:max-w-0" : "opacity-100 max-w-[160px]"
              )}
            >
              Sign Out
            </span>

            {isCollapsed && (
              <div className="hidden lg:group-hover:block absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-md shadow-2xl whitespace-nowrap z-50 pointer-events-none border border-slate-700 animate-in fade-in">
                Sign Out
              </div>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
};
