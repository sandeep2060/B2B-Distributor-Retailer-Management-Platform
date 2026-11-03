"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  MapPin,
  ChevronDown,
  Building2,
  Store,
  ShieldAlert,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  Package,
} from "lucide-react";
import { Button } from "../ui/button";
import { POPULAR_LOCATIONS } from "@/lib/services/nepal-data";
import { cn } from "@/lib/utils/cn";

interface NavbarProps {
  currentRole?: string;
  cartCount?: number;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole = "RETAILER", cartCount = 2, userName }) => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(POPULAR_LOCATIONS[0]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSwitchRole = (role: string) => {
    // Demo switcher sets demo cookie / redirect
    if (role === "SUPER_ADMIN") {
      router.push("/admin/dashboard");
    } else if (role === "DISTRIBUTOR") {
      router.push("/distributor/dashboard");
    } else {
      router.push("/retailer/dashboard");
    }
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top micro-bar for B2B announcements */}
      <div className="bg-[#102C55] text-white text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-[#F58220] font-black px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
              Wholesale Only
            </span>
            <span>Nepal's #1 Verified B2B Wholesale Marketplace • Bulk Pricing Guaranteed</span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-slate-300">
            <span>Customer Desk: +977-01-4455667 / 9801234567</span>
            <span>•</span>
            <Link href="/deals" className="hover:text-white transition-colors">
              Wholesale Deals
            </Link>
            <span>•</span>
            <Link href="/distributor-register" className="text-[#F58220] hover:underline font-semibold">
              Become a Distributor
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-[#0759C7] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              B2B
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-[#102C55] tracking-tight">B2B Deal</span>
                <span className="text-[10px] font-bold text-[#F58220] uppercase tracking-wider">Nepal</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight">Connect • Order • Grow</p>
            </div>
          </Link>

          {/* Location Selector (Desktop) */}
          <div className="relative hidden lg:block flex-shrink-0">
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0759C7]" />
              <span className="max-w-[140px] truncate">{selectedLocation}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLocationOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-dropdown z-50 p-2 py-1">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select Delivery Zone
                </div>
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                      selectedLocation === loc
                        ? "bg-blue-50 text-[#0759C7] font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{loc}</span>
                    {selectedLocation === loc && <span className="w-1.5 h-1.5 rounded-full bg-[#0759C7]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, FMCG cartons, brands, distributors..."
                className="w-full h-10 pl-10 pr-20 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0759C7] focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-[#0759C7] hover:bg-[#0648a3] text-white rounded-md text-xs font-semibold transition-colors flex items-center"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Portal Switcher Pills */}
            <div className="hidden md:flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg text-xs">
              <Link
                href="/distributor/dashboard"
                className="px-2.5 py-1 rounded-md text-slate-700 hover:text-[#0759C7] hover:bg-white font-medium transition-all flex items-center gap-1"
                title="Distributor Web Portal"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Distributor</span>
              </Link>
              <Link
                href="/admin/dashboard"
                className="px-2.5 py-1 rounded-md text-slate-700 hover:text-[#0759C7] hover:bg-white font-medium transition-all flex items-center gap-1"
                title="Super Admin Dashboard"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            </div>

            {/* Shopping Cart Button */}
            <Link
              href="/retailer/cart"
              className="relative p-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-[#0759C7] transition-colors"
              title="Wholesale Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F58220] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0759C7] flex items-center justify-center font-bold text-xs">
                  {userName ? userName.charAt(0) : "S"}
                </div>
                <span className="hidden sm:inline-block max-w-[90px] truncate">
                  {userName || "Suman (Retailer)"}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-dropdown z-50 p-2 py-1">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-[#102C55]">{userName || "Suman Thapa"}</p>
                    <p className="text-[11px] text-slate-500">Kalanki Kirana Store</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0759C7]">
                      RETAILER ACCOUNT
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/retailer/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      <Store className="w-3.5 h-3.5 text-slate-400" />
                      Retailer Dashboard
                    </Link>
                    <Link
                      href="/retailer/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      My Wholesale Orders
                    </Link>
                    <Link
                      href="/retailer/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Business Profile & PAN
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role Portal
                    </div>
                    <button
                      onClick={() => handleSwitchRole("DISTRIBUTOR")}
                      className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#0759C7]" />
                      Distributor Portal
                    </button>
                    <button
                      onClick={() => handleSwitchRole("SUPER_ADMIN")}
                      className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-[#F58220]" />
                      Super Admin Panel
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <Link
                      href="/login"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Toggle sliding side menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sliding Mobile Side Menu Drawer & Backdrop */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden"
            aria-hidden="true"
          />
        )}

        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out md:hidden",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4 space-y-4">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0759C7] flex items-center justify-center text-white font-black text-sm shadow-md">
                  B2B
                </div>
                <div>
                  <span className="font-black text-[#102C55]">B2B Deal</span>
                  <span className="text-[10px] font-bold text-[#F58220] uppercase ml-1">Nepal</span>
                </div>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Location Selector */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Delivery Hub Location:
              </span>
              <div className="flex items-center gap-1.5 text-[#0759C7] font-bold">
                <MapPin className="w-4 h-4 text-[#0759C7]" />
                <span>{selectedLocation}</span>
              </div>
            </div>

            {/* Portal Switcher */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block px-1 tracking-wider">
                Portals & Role Control
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/distributor/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-blue-50 text-[#0759C7] rounded-xl font-bold border border-blue-100 shadow-xs hover:bg-blue-100 transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Distributor</span>
                </Link>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-100 text-slate-800 rounded-xl font-bold border border-slate-200 shadow-xs hover:bg-slate-200 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Admin</span>
                </Link>
              </div>
            </div>

            {/* Navigation Categories */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block px-1 tracking-wider">
                Wholesale Categories
              </span>
              <div className="space-y-0.5 text-xs font-semibold text-slate-700">
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-[#0759C7] font-bold"
                >
                  <span>All Wholesale Products</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/deals"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-50 text-[#F58220] font-black"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Volume Deals & Schemes</span>
                  </span>
                  <span className="text-[10px] bg-[#F58220] text-white px-1.5 py-0.2 rounded font-bold">HOT</span>
                </Link>
                <Link
                  href="/categories/beverages"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg hover:bg-slate-50 hover:text-[#0759C7]"
                >
                  Beverages (Cold Drinks, Water)
                </Link>
                <Link
                  href="/categories/snacks"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg hover:bg-slate-50 hover:text-[#0759C7]"
                >
                  Snacks & Confectionery (Wai Wai, Biscuits)
                </Link>
                <Link
                  href="/categories/grocery"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg hover:bg-slate-50 hover:text-[#0759C7]"
                >
                  Grocery & Staples (Rice, Oil)
                </Link>
                <Link
                  href="/categories/personal-care"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg hover:bg-slate-50 hover:text-[#0759C7]"
                >
                  Personal Care (Soaps, Shampoos)
                </Link>
                <Link
                  href="/categories/household"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg hover:bg-slate-50 hover:text-[#0759C7]"
                >
                  Household & Detergents (Surf Excel)
                </Link>
                <Link
                  href="/categories/dairy-bakery"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg hover:bg-slate-50 hover:text-[#0759C7]"
                >
                  Dairy & Bakery (Ghee, Butter)
                </Link>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-xs space-y-2">
            <Link
              href="/retailer/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-[#102C55] font-bold shadow-xs"
            >
              <span className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#0759C7]" />
                <span>Retailer Portal</span>
              </span>
              <span className="text-[11px] text-slate-400">Kalanki Mart</span>
            </Link>
            <p className="text-[10px] text-slate-500 text-center">
              Wholesale Desk: +977-01-4455667 / 9801234567
            </p>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <nav className="bg-slate-50 border-t border-slate-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-semibold text-slate-700 overflow-x-auto">
          <div className="flex items-center space-x-6">
            <Link href="/products" className="text-[#0759C7] hover:underline flex items-center gap-1 font-bold">
              <span>All Wholesale Products</span>
            </Link>
            <Link href="/categories/beverages" className="hover:text-[#0759C7] transition-colors">
              Beverages
            </Link>
            <Link href="/categories/snacks" className="hover:text-[#0759C7] transition-colors">
              Snacks & Confectionery
            </Link>
            <Link href="/categories/grocery" className="hover:text-[#0759C7] transition-colors">
              Grocery & Staples
            </Link>
            <Link href="/categories/personal-care" className="hover:text-[#0759C7] transition-colors">
              Personal Care
            </Link>
            <Link href="/categories/household" className="hover:text-[#0759C7] transition-colors">
              Household & Cleaning
            </Link>
            <Link href="/categories/dairy-bakery" className="hover:text-[#0759C7] transition-colors">
              Dairy & Bakery
            </Link>
          </div>
          <Link
            href="/deals"
            className="flex items-center gap-1 text-[#F58220] hover:text-[#e07114] font-black uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Volume Deals</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};
