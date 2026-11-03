"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Building2, ShieldAlert, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("retailer@kalankimart.com.np");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push(data.redirectTo || "/retailer/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to login");
      setLoading(false);
    }
  };

  const setDemoCredentials = (role: "RETAILER" | "DISTRIBUTOR" | "SUPER_ADMIN") => {
    if (role === "SUPER_ADMIN") {
      setEmail("admin@b2bdeal.com.np");
      setPassword("Password123!");
    } else if (role === "DISTRIBUTOR") {
      setEmail("distributor@himalayan.com.np");
      setPassword("Password123!");
    } else {
      setEmail("retailer@kalankimart.com.np");
      setPassword("Password123!");
    }
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#102C55] via-[#0759C7] to-[#102C55] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-50 p-6 text-center border-b border-slate-200">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#0759C7] flex items-center justify-center font-black text-white text-lg shadow-md">
              B2B
            </div>
            <span className="text-xl font-black text-[#102C55]">B2B Deal</span>
          </Link>
          <h2 className="text-base font-bold text-[#102C55]">Nepal's B2B Wholesale Marketplace</h2>
          <p className="text-xs text-slate-500 mt-0.5">Secure Sign In to Your Portal</p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Quick 1-Click Role Switcher Demo Buttons */}
          <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-100 space-y-2">
            <p className="text-[10px] font-bold text-[#0759C7] uppercase tracking-wider text-center">
              1-Click Demo Account Login
            </p>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setDemoCredentials("RETAILER")}
                className={`p-2 rounded-lg font-bold border transition-all flex flex-col items-center gap-1 ${
                  email.includes("retailer")
                    ? "bg-white text-[#0759C7] border-[#0759C7] shadow-xs"
                    : "bg-white/60 text-slate-700 border-slate-200 hover:bg-white"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Retailer</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials("DISTRIBUTOR")}
                className={`p-2 rounded-lg font-bold border transition-all flex flex-col items-center gap-1 ${
                  email.includes("distributor")
                    ? "bg-white text-[#0759C7] border-[#0759C7] shadow-xs"
                    : "bg-white/60 text-slate-700 border-slate-200 hover:bg-white"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Distributor</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials("SUPER_ADMIN")}
                className={`p-2 rounded-lg font-bold border transition-all flex flex-col items-center gap-1 ${
                  email.includes("admin")
                    ? "bg-white text-[#0759C7] border-[#0759C7] shadow-xs"
                    : "bg-white/60 text-slate-700 border-slate-200 hover:bg-white"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#F58220]" />
                <span>Super Admin</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Business Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@shop.com.np"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full font-bold text-sm h-11"
            >
              Sign In to Platform
            </Button>
          </form>

          {/* Links */}
          <div className="pt-2 text-center space-y-2 text-xs text-slate-500 border-t border-slate-100">
            <p>
              New retailer?{" "}
              <Link href="/register" className="text-[#0759C7] font-bold hover:underline">
                Create Retailer Account
              </Link>
            </p>
            <p>
              Wholesale distributor?{" "}
              <Link href="/distributor-register" className="text-[#F58220] font-bold hover:underline">
                Apply as a Distributor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
