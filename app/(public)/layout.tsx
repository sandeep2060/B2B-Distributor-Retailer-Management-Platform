import React from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { MobileNav } from "@/components/shared/mobile-nav";
import marketplaceStore from "@/lib/db/store";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cart = marketplaceStore.getCart("usr_ret_1");

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar cartCount={cart.itemCount} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileNav cartCount={cart.itemCount} />
    </div>
  );
}
