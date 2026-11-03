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
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search & quick bar */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 space-y-3 pb-2">
            <div className="flex items-center justify-between text-xs font-semibold px-1">
              <span className="text-slate-500">Location:</span>
              <span className="text-[#0759C7]">{selectedLocation}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/distributor/dashboard"
                className="flex items-center justify-center gap-1.5 p-2 bg-blue-50 text-[#0759C7] rounded-lg font-bold"
              >
                <Building2 className="w-4 h-4" />
                Distributor Portal
              </Link>
              <Link
                href="/admin/dashboard"
                className="flex items-center justify-center gap-1.5 p-2 bg-slate-100 text-slate-800 rounded-lg font-bold"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Dashboard
              </Link>
            </div>
          </div>
        )}
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
