import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B2B Deal - Nepal's B2B Wholesale Marketplace Platform | Connect • Order • Grow",
  description:
    "Nepal's verified B2B wholesale marketplace connecting retailers, kirana stores, and supermarkets directly with authorized wholesale distributors and FMCG manufacturers.",
  keywords: [
    "B2B Nepal",
    "Wholesale Marketplace Nepal",
    "FMCG Wholesale Kathmandu",
    "Kirana Wholesale Nepal",
    "B2B Deal",
    "Bulk FMCG Nepal",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
