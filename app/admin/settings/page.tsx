"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, ShieldCheck, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("B2B Deal");
  const [tagline, setTagline] = useState("Connect • Order • Grow");
  const [currency, setCurrency] = useState("NPR (Rs.)");
  const [vatRate, setVatRate] = useState(13);
  const [supportPhone, setSupportPhone] = useState("+977-01-4455667 / 9801234567");
  const [supportEmail, setSupportEmail] = useState("support@b2bdeal.com.np");
  const [headquarters, setHeadquarters] = useState("Kuleshwor Wholesale Hub & New Road, Kathmandu");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <h1 className="text-2xl font-black text-[#102C55]">Platform Master Configuration</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure Nepal nationwide parameters, VAT taxation rules, currency display, and customer desk info
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#0759C7]" />
              General Platform Identity & Nepal Taxation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Marketplace Brand Name"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                required
              />
              <Input
                label="Tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                required
              />
              <Input
                label="Currency Code"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              />
              <Input
                label="Nepal Inland Revenue VAT Rate (%)"
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(Number(e.target.value))}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Corporate Headquarters & Support Desk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Customer Service Hotline"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                required
              />
              <Input
                label="Official Support Email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                required
              />
              <div className="sm:col-span-2">
                <Input
                  label="Registered Corporate Address in Nepal"
                  value={headquarters}
                  onChange={(e) => setHeadquarters(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end">
          <Button type="submit" variant="primary" size="md" className="font-bold text-xs h-10 px-6">
            {saved ? (
              <span className="flex items-center gap-1.5 text-white">
                <Check className="w-4 h-4" />
                Settings Saved!
              </span>
            ) : (
              "Save Platform Settings"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
