"use client";

import React, { useState } from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import {
  ShoppingCart,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  Calendar,
  CheckSquare,
  Square,
  Send,
  X,
  Receipt,
  Sparkles,
  AlertCircle,
  CalendarClock,
  AlertTriangle,
  Filter,
} from "lucide-react";

export default function DistributorOrdersPage() {
  const distributorId = "dist_1";
  const [activeTab, setActiveTab] = useState("ALL");
  const [orders, setOrders] = useState(marketplaceStore.getOrders({ distributorId }));
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState("");

  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split("T")[0];
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split("T")[0];

  // Bulk Dispatch Form State
  const [bulkDeliveryDate, setBulkDeliveryDate] = useState(todayStr);
  const [bulkTimeSlot, setBulkTimeSlot] = useState("Morning (8:00 AM - 12:00 PM)");
  const [bulkDriverName, setBulkDriverName] = useState("Ramesh Bogati");
  const [bulkDriverPhone, setBulkDriverPhone] = useState("9841009988");
  const [bulkVehicleNo, setBulkVehicleNo] = useState("Ba 2 Kha 4490");

  // Date & Pay Date Filter State
  const [dateFilterPreset, setDateFilterPreset] = useState<
    "ALL" | "TODAY" | "WEEK" | "15_DAYS" | "1_MONTH" | "CUSTOM" | "OVERDUE_ONLY"
  >("ALL");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const tabs = [
    { id: "ALL", label: "All Orders", count: orders.length },
    { id: "PENDING", label: "Pending", count: orders.filter((o) => o.status === "PENDING").length },
    {
      id: "PROCESSING",
      label: "Confirmed / Packing",
      count: orders.filter((o) => o.status === "CONFIRMED" || o.status === "PROCESSING").length,
    },
    {
      id: "ON_DELIVERY",
      label: "🚚 On Delivery (Today)",
      count: orders.filter((o) => o.status === "DISPATCHED" && o.deliveryDate === todayStr).length,
    },
    {
      id: "DISPATCHED",
      label: "Dispatched",
      count: orders.filter((o) => o.status === "DISPATCHED").length,
    },
    { id: "DELIVERED", label: "Delivered", count: orders.filter((o) => o.status === "DELIVERED").length },
  ];

  const filtered = orders.filter((o) => {
    // Status tab filter
    if (activeTab === "PROCESSING" && o.status !== "CONFIRMED" && o.status !== "PROCESSING") return false;
    if (activeTab === "ON_DELIVERY" && (o.status !== "DISPATCHED" || o.deliveryDate !== todayStr)) return false;
    if (activeTab !== "ALL" && activeTab !== "PROCESSING" && activeTab !== "ON_DELIVERY" && o.status !== activeTab) return false;

    // Date & Pay Date Preset filter
    const isPayDateOut = Boolean(o.paymentDueDate && o.paymentDueDate < todayStr && o.paymentStatus !== "PAID");
    if (dateFilterPreset === "OVERDUE_ONLY") return isPayDateOut;

    if (dateFilterPreset === "TODAY") {
      const orderDate = o.createdAt.split("T")[0];
      return orderDate === todayStr || o.deliveryDate === todayStr || o.paymentDueDate === todayStr;
    }
    if (dateFilterPreset === "WEEK") {
      const pastWeek = new Date();
      pastWeek.setDate(pastWeek.getDate() - 7);
      const pastWeekStr = pastWeek.toISOString().split("T")[0];
      return o.createdAt >= pastWeekStr || (Boolean(o.deliveryDate) && o.deliveryDate! >= pastWeekStr);
    }
    if (dateFilterPreset === "15_DAYS") {
      const past15 = new Date();
      past15.setDate(past15.getDate() - 15);
      const past15Str = past15.toISOString().split("T")[0];
      return o.createdAt >= past15Str || (Boolean(o.deliveryDate) && o.deliveryDate! >= past15Str);
    }
    if (dateFilterPreset === "1_MONTH") {
      const pastMonth = new Date();
      pastMonth.setDate(pastMonth.getDate() - 30);
      const pastMonthStr = pastMonth.toISOString().split("T")[0];
      return o.createdAt >= pastMonthStr || (Boolean(o.deliveryDate) && o.deliveryDate! >= pastMonthStr);
    }
    if (dateFilterPreset === "CUSTOM") {
      if (customStartDate && o.createdAt.split("T")[0] < customStartDate) return false;
      if (customEndDate && o.createdAt.split("T")[0] > customEndDate) return false;
    }

    return true;
  });

  // Toggle selection
  const toggleOrderSelection = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((oId) => oId !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    const dispatchable = filtered
      .filter((o) => o.status !== "CANCELLED" && o.status !== "DELIVERED")
      .map((o) => o.id);
    setSelectedOrderIds(dispatchable);
  };

  const clearSelection = () => {
    setSelectedOrderIds([]);
  };

  // Execute Bulk Dispatch
  const handleBulkDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrderIds.length === 0) return;
    setBulkUpdating(true);

    try {
      const res = await fetch("/api/orders/bulk-dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: selectedOrderIds,
          deliveryDate: bulkDeliveryDate,
          timeSlot: bulkTimeSlot,
          deliveryPerson: {
            name: bulkDriverName,
            phone: bulkDriverPhone,
            vehicleNo: bulkVehicleNo,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Refresh orders from store
        setOrders([...marketplaceStore.getOrders({ distributorId })]);
        setShowBulkModal(false);
        const dayMsg =
          bulkDeliveryDate === todayStr
            ? "Dispatched for ON DELIVERY today!"
            : `Scheduled for delivery on ${bulkDeliveryDate}.`;
        setBulkSuccessMsg(
          `🚀 ${data.count} wholesale orders dispatched successfully! ${dayMsg} Driver: ${bulkDriverName} (${bulkVehicleNo})`
        );
        setSelectedOrderIds([]);
        setTimeout(() => setBulkSuccessMsg(""), 6000);
      } else {
        alert(data.error || "Failed to dispatch orders in bulk");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBulkUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {bulkSuccessMsg && (
        <div className="bg-emerald-600 text-white p-3.5 px-5 rounded-xl shadow-md flex items-center justify-between text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-100" />
            <span>{bulkSuccessMsg}</span>
          </div>
          <button onClick={() => setBulkSuccessMsg("")} className="text-emerald-100 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header and Filter Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-[#102C55]">Retailer Orders Received</h1>
            <p className="text-xs text-slate-500 mt-1">
              Review purchase orders, set delivery dates, generate tax invoices, cancel items with reasons, and bulk dispatch wholesale cartons
            </p>
          </div>

          {/* Quick Stats or actions */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-blue-50 text-[#0759C7] px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>
                {orders.filter((o) => o.status === "DISPATCHED" && o.deliveryDate === todayStr).length} Today's Deliveries
              </span>
            </span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-[#0759C7] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-white text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Date & Pay Date Preset Filter Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <CalendarClock className="w-3.5 h-3.5 text-[#0759C7]" />
              <span>Date / Pay Filter:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "ALL" as const, label: "All" },
                { id: "TODAY" as const, label: "Today (आज)" },
                { id: "WEEK" as const, label: "Week (७ दिन)" },
                { id: "15_DAYS" as const, label: "15 Days (१५ दिन)" },
                { id: "1_MONTH" as const, label: "1 Month (१ महिना)" },
                { id: "CUSTOM" as const, label: "Custom Date" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setDateFilterPreset(p.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                    dateFilterPreset === p.id
                      ? "bg-[#102C55] text-white shadow-xs font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {p.label}
                </button>
              ))}

              {/* Red indicator quick filter button for overdue orders */}
              {orders.some((o) => Boolean(o.paymentDueDate && o.paymentDueDate < todayStr && o.paymentStatus !== "PAID")) && (
                <button
                  onClick={() => setDateFilterPreset(dateFilterPreset === "OVERDUE_ONLY" ? "ALL" : "OVERDUE_ONLY")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ml-1",
                    dateFilterPreset === "OVERDUE_ONLY"
                      ? "bg-rose-600 text-white shadow-xs animate-pulse ring-2 ring-rose-400"
                      : "bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100"
                  )}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>🚨 Pay Date Out ({orders.filter((o) => Boolean(o.paymentDueDate && o.paymentDueDate < todayStr && o.paymentStatus !== "PAID")).length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Custom Date Pickers */}
          {dateFilterPreset === "CUSTOM" && (
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 px-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="h-7 px-2 rounded border border-slate-300 font-mono text-[11px]"
              />
              <span className="text-[11px] font-bold text-slate-500">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="h-7 px-2 rounded border border-slate-300 font-mono text-[11px]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating / Sticky Bulk Dispatch Action Bar (when orders selected) */}
      {selectedOrderIds.length > 0 && (
        <div className="sticky top-20 z-30 p-4 bg-gradient-to-r from-[#102C55] to-[#0759C7] text-white rounded-2xl shadow-xl border border-blue-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-sm">
              {selectedOrderIds.length}
            </span>
            <div>
              <p className="font-bold text-sm">
                {selectedOrderIds.length} Wholesale Orders Selected
              </p>
              <p className="text-[11px] text-blue-200">
                Set single delivery date, assign delivery driver, and dispatch all selected orders in bulk!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearSelection}
              className="text-xs text-blue-200 hover:text-white font-semibold underline px-2"
            >
              Clear Selection
            </button>
            <Button
              variant="orange"
              size="sm"
              onClick={() => setShowBulkModal(true)}
              className="font-bold text-xs h-9 flex items-center gap-1.5 shadow-md"
            >
              <Truck className="w-4 h-4" />
              <span>Bulk Dispatch Selected ({selectedOrderIds.length})</span>
            </Button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-10">
                  <span className="sr-only">Select</span>
                  <input
                    type="checkbox"
                    checked={
                      selectedOrderIds.length > 0 &&
                      selectedOrderIds.length ===
                        filtered.filter((o) => o.status !== "CANCELLED" && o.status !== "DELIVERED").length
                    }
                    onChange={(e) => (e.target.checked ? selectAllFiltered() : clearSelection())}
                    className="w-4 h-4 rounded text-[#0759C7]"
                    title="Select all dispatchable orders"
                  />
                </th>
                <th className="py-3 px-4">Order Ref & Invoice</th>
                <th className="py-3 px-4">Retailer Store</th>
                <th className="py-3 px-4">Delivery Date / Status</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Payable Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Process</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((o) => {
                const isSelected = selectedOrderIds.includes(o.id);
                const isToday = o.deliveryDate === todayStr;
                const isCancelled = o.status === "CANCELLED";
                const isDelivered = o.status === "DELIVERED";
                const isPayDateOut = Boolean(
                  o.paymentDueDate && o.paymentDueDate < todayStr && o.paymentStatus !== "PAID"
                );

                return (
                  <tr
                    key={o.id}
                    className={`transition-colors ${
                      isPayDateOut
                        ? "bg-rose-50/50 hover:bg-rose-50"
                        : isSelected
                        ? "bg-blue-50/40"
                        : "hover:bg-slate-50/70"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-3 text-center">
                      {!isCancelled && !isDelivered ? (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOrderSelection(o.id)}
                          className="w-4 h-4 rounded text-[#0759C7]"
                        />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Order Ref & Invoice */}
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-[#0759C7]">{o.orderNumber}</p>
                      {o.isInvoiced ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          ✓ {o.invoiceNumber}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          Pending Invoice
                        </span>
                      )}
                    </td>

                    {/* Retailer Store */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{o.retailerShop}</p>
                      <p className="text-[10px] text-slate-500">
                        {o.deliveryAddress.streetAddress}, {o.deliveryAddress.district}
                      </p>
                    </td>

                    {/* Delivery Date & "On Delivery" Indicator */}
                    <td className="py-3.5 px-4">
                      {o.deliveryDate ? (
                        <div>
                          {isToday && o.status === "DISPATCHED" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                              🚚 On Delivery Today
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
                              <Calendar className="w-3 h-3 text-[#0759C7]" />
                              <span>{o.deliveryDate}</span>
                            </span>
                          )}
                          {o.deliveryPerson && (
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {o.deliveryPerson.name} ({o.deliveryPerson.vehicleNo})
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Not Scheduled</span>
                      )}
                    </td>

                    {/* Order Date */}
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(o.createdAt)}</td>

                    {/* Payable Amount & Red Indicator */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <div className={cn(isPayDateOut && "text-rose-600 font-black")}>
                        {formatNPR(o.payableAmount || o.totalAmount)}
                      </div>
                      {isPayDateOut ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white mt-1 shadow-xs animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-white" />
                          <span>OUT: {o.paymentDueDate}</span>
                        </span>
                      ) : o.paymentStatus === "PAID" ? (
                        <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 mt-0.5">
                          ✓ Paid
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] text-slate-400 font-normal mt-0.5">
                          Due: {o.paymentDueDate || "15 Days"}
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={o.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/distributor/orders/${o.id}`}>
                        <Button variant="primary" size="sm" className="text-xs h-8 font-bold">
                          Process Order
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Bulk Dispatch Selected Orders */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#102C55] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#0759C7]" />
                  Bulk Dispatch {selectedOrderIds.length} Wholesale Orders
                </h3>
                <p className="text-xs text-slate-500">
                  Assign a unified delivery date and driver for all selected retailer orders simultaneously.
                </p>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBulkDispatch} className="space-y-3.5 text-xs">
              {/* Delivery Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#102C55]">
                  Select Unified Delivery Date (एकमुष्ट डेलिभरी मिति) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={bulkDeliveryDate}
                    onChange={(e) => setBulkDeliveryDate(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg border border-slate-300 font-mono text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0759C7]"
                    required
                  />
                  {bulkDeliveryDate === todayStr && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-1 rounded text-[11px] font-bold animate-pulse">
                      🚚 Today
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setBulkDeliveryDate(todayStr)}
                    className={`px-3 py-1 rounded text-xs font-bold border ${
                      bulkDeliveryDate === todayStr
                        ? "bg-[#0759C7] text-white border-blue-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                    }`}
                  >
                    Today (आजै - {todayStr})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkDeliveryDate(tomorrowStr)}
                    className={`px-3 py-1 rounded text-xs font-bold border ${
                      bulkDeliveryDate === tomorrowStr
                        ? "bg-[#0759C7] text-white border-blue-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                    }`}
                  >
                    Tomorrow (भोलि - {tomorrowStr})
                  </button>
                </div>
              </div>

              {/* Time slot */}
              <div>
                <label className="block text-xs font-bold text-[#102C55] mb-1">
                  Delivery Time Window (समय स्लट)
                </label>
                <select
                  value={bulkTimeSlot}
                  onChange={(e) => setBulkTimeSlot(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-[#0759C7]"
                >
                  <option value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon (1:00 PM - 5:00 PM)</option>
                  <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                  <option value="Full Day Dispatch Route">Full Day Dispatch Route</option>
                </select>
              </div>

              {/* Driver Details */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="font-bold text-[#102C55] block text-xs">
                  Assigned Route Driver & Vehicle:
                </span>

                <div className="flex flex-wrap gap-1.5 pb-1">
                  {[
                    { name: "Ramesh Bogati", phone: "9841009988", vehicle: "Ba 2 Kha 4490" },
                    { name: "Hari Shrestha", phone: "9851022334", vehicle: "Ba 1 Cha 8920" },
                    { name: "Bikram Tamang", phone: "9860112233", vehicle: "Ba 3 Kha 1120" },
                  ].map((preset) => (
                    <button
                      key={preset.phone}
                      type="button"
                      onClick={() => {
                        setBulkDriverName(preset.name);
                        setBulkDriverPhone(preset.phone);
                        setBulkVehicleNo(preset.vehicle);
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                    >
                      {preset.name} ({preset.vehicle})
                    </button>
                  ))}
                </div>

                <Input
                  label="Driver Full Name *"
                  value={bulkDriverName}
                  onChange={(e) => setBulkDriverName(e.target.value)}
                  required
                />
                <Input
                  label="Driver Nepal Phone *"
                  value={bulkDriverPhone}
                  onChange={(e) => setBulkDriverPhone(e.target.value)}
                  required
                />
                <Input
                  label="Dispatch Vehicle Number *"
                  value={bulkVehicleNo}
                  onChange={(e) => setBulkVehicleNo(e.target.value)}
                  placeholder="e.g. Ba 2 Kha 4490"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowBulkModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="orange"
                  size="sm"
                  type="submit"
                  isLoading={bulkUpdating}
                  className="font-bold shadow-md"
                >
                  Confirm Bulk Dispatch ({selectedOrderIds.length} Orders)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
