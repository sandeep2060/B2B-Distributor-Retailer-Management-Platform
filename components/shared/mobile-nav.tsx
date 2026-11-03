"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Sparkles, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const MobileNav: React.FC<{ cartCount?: number }> = ({ cartCount = 2 }) => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Categories", href: "/categories", icon: Grid },
    { label: "Deals", href: "/deals", icon: Sparkles, highlight: true },
    { label: "Cart", href: "/retailer/cart", icon: ShoppingCart, hasBadge: true },
    { label: "Account", href: "/retailer/dashboard", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-dropdown px-2 py-1.5 no-print">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-lg relative transition-colors",
                isActive ? "text-[#0759C7]" : "text-slate-500 hover:text-slate-800",
                item.highlight && !isActive && "text-[#F58220]"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                {item.hasBadge && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#F58220] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className={cn("text-[10px] mt-0.5 font-medium", isActive && "font-bold text-[#0759C7]")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
