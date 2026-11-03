"use client";

import React, { useState, useEffect } from "react";
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
  Sliders,
  Store,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
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

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen && onMobileClose) {
        onMobileClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onMobileClose]);

  const distributorNav: NavItem[] = [
    { label: "Dashboard", href: "/distributor/dashboard", icon: LayoutDashboard },
    { label: "Product Catalog", href: "/distributor/products", icon: Package },
    { label: "My Companies", href: "/distributor/companies", icon: Building2 },
    { label: "Wholesale Offers", href: "/distributor/offers", icon: Percent },
    { label: "Orders Received", href: "/distributor/orders", icon: ShoppingCart, badge: "2 New" },
    { label: "Delivery Tracking", href: "/distributor/deliveries", icon: Truck },
    { label: "Commissions", href: "/distributor/commissions", icon: BarChart3 },
    { label: "System Settings", href: "/distributor/system-settings", icon: Sliders },
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

      {/* Main Sliding Aside Panel */}
      <aside
        className={cn(
          // Base styles
          "bg-[#102C55] text-white flex flex-col justify-between shadow-xl border-r border-slate-800/80 overflow-y-auto overflow-x-hidden transition-[width,transform] duration-300 ease-in-out select-none",
          // Mobile Off-canvas sliding drawer
          "fixed inset-y-0 left-0 z-50 w-72 h-screen",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop pinned sticky sidebar (Sticky to viewport top, stays firmly in view when page scrolls)
          "lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:z-30 lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div>
          {/* Brand Header */}
          <div
            className={cn(
              "border-b border-slate-800/80 flex items-center min-h-[64px] transition-all",
              isCollapsed ? "lg:px-2 lg:py-4 lg:justify-center" : "px-4 py-4 justify-between"
            )}
          >
            <Link
              href="/"
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-2.5 group min-w-0",
                isCollapsed && "lg:justify-center"
              )}
              title={isCollapsed ? "B2B Deal Portal (Click to visit marketplace)" : undefined}
            >
              <div className="w-8 h-8 rounded-lg bg-[#0759C7] flex items-center justify-center font-black text-white text-sm shadow-md shrink-0 group-hover:scale-105 transition-transform">
                B2B
              </div>
              <div
                className={cn(
                  "transition-all duration-300 overflow-hidden whitespace-nowrap",
                  isCollapsed ? "lg:opacity-0 lg:max-w-0 lg:w-0" : "opacity-100 max-w-[180px]"
                )}
              >
                <span className="font-black text-white tracking-tight">B2B Deal</span>
                <span className={cn("text-[9px] font-bold text-white px-1.5 py-0.5 rounded ml-1.5", portalColor)}>
                  {type === "ADMIN" ? "ADMIN" : "PORTAL"}
                </span>
              </div>
            </Link>

            {/* Header Toggle Controls */}
            <div className={cn("flex items-center gap-1", isCollapsed && "lg:hidden")}>
              <button
                type="button"
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden lg:flex items-center justify-center"
                title="Collapse side menu"
              >
                <ChevronLeft className="w-4 h-4" />
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
            title={isCollapsed ? `${userName || (type === "ADMIN" ? "Super Admin" : "Himalayan FMCG")} • ${userTitle || (type === "ADMIN" ? "Platform Control" : "Distributor: Kathmandu")}` : undefined}
          >
            <div
              className={cn(
                "flex items-center transition-all",
                isCollapsed ? "lg:justify-center lg:gap-0" : "gap-2.5"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">
                {userName ? userName.charAt(0) : type === "ADMIN" ? "A" : "H"}
              </div>
              <div
                className={cn(
                  "transition-all duration-300 overflow-hidden whitespace-nowrap",
                  isCollapsed ? "lg:opacity-0 lg:max-w-0 lg:w-0" : "opacity-100 max-w-[160px]"
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
                    "flex items-center rounded-lg text-xs font-semibold transition-all group relative",
                    isActive
                      ? "bg-[#0759C7] text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                    isCollapsed
                      ? "lg:justify-center lg:px-2 lg:py-2.5 lg:gap-0"
                      : "gap-3 px-3 py-2.5"
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
                      isCollapsed ? "lg:opacity-0 lg:max-w-0 lg:w-0" : "opacity-100 max-w-[160px]"
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
                    <span className="hidden lg:block absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F58220] ring-2 ring-[#102C55]" />
                  )}

                  {/* Desktop Hover Tooltip when Collapsed */}
                  {isCollapsed && (
                    <div className="hidden lg:group-hover:flex items-center gap-2 absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xl whitespace-nowrap z-50 pointer-events-none border border-slate-700 animate-in fade-in">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-[#F58220] text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer controls: Back to Retailer platform, Logout & Dedicated Collapse Toggle */}
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          <Link
            href="/"
            onClick={onMobileClose}
            className={cn(
              "flex items-center rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors group relative",
              isCollapsed
                ? "lg:justify-center lg:px-2 lg:py-2 lg:gap-0"
                : "gap-2.5 px-3 py-2"
            )}
            title="Back to Retailer Marketplace"
          >
            <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
            <span
              className={cn(
                "transition-all duration-300 overflow-hidden whitespace-nowrap",
                isCollapsed ? "lg:opacity-0 lg:max-w-0 lg:w-0" : "opacity-100 max-w-[160px]"
              )}
            >
              View Marketplace
            </span>

            {isCollapsed && (
              <div className="hidden lg:group-hover:block absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xl whitespace-nowrap z-50 pointer-events-none border border-slate-700 animate-in fade-in">
                View Marketplace
              </div>
            )}
          </Link>

          <Link
            href="/login"
            onClick={onMobileClose}
            className={cn(
              "flex items-center rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors group relative",
              isCollapsed
                ? "lg:justify-center lg:px-2 lg:py-2 lg:gap-0"
                : "gap-2.5 px-3 py-2"
            )}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span
              className={cn(
                "transition-all duration-300 overflow-hidden whitespace-nowrap",
                isCollapsed ? "lg:opacity-0 lg:max-w-0 lg:w-0" : "opacity-100 max-w-[160px]"
              )}
            >
              Sign Out
            </span>

            {isCollapsed && (
              <div className="hidden lg:group-hover:block absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xl whitespace-nowrap z-50 pointer-events-none border border-slate-700 animate-in fade-in">
                Sign Out
              </div>
            )}
          </Link>

          {/* Desktop Dedicated Toggle Bar */}
          <div className="pt-2 mt-1 border-t border-slate-800/60 hidden lg:block">
            <button
              type="button"
              onClick={toggleCollapse}
              className={cn(
                "w-full flex items-center py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/90 transition-all group relative",
                isCollapsed ? "justify-center gap-0" : "justify-between"
              )}
              title={isCollapsed ? "Expand side menu" : "Collapse side menu"}
            >
              <div className={cn("flex items-center gap-2", isCollapsed && "gap-0")}>
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-blue-400 shrink-0 group-hover:scale-115 transition-transform" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-blue-400 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                )}
                <span
                  className={cn(
                    "transition-all duration-300 overflow-hidden whitespace-nowrap text-slate-300 group-hover:text-white",
                    isCollapsed ? "opacity-0 max-w-0 w-0" : "opacity-100 max-w-[120px]"
                  )}
                >
                  Collapse Menu
                </span>
              </div>

              {!isCollapsed && (
                <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                  sidebar
                </span>
              )}

              {isCollapsed && (
                <div className="hidden lg:group-hover:block absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xl whitespace-nowrap z-50 pointer-events-none border border-slate-700 animate-in fade-in">
                  Expand Side Menu
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
