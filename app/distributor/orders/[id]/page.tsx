"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  FileText,
  Building2,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Calendar,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Send,
  CheckSquare,
  Square,
  Receipt,
  UserCheck,
  CalendarClock,
  AlertCircle,
  Check,
} from "lucide-react";

export default function DistributorOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState(marketplaceStore.getOrderById(params.id));
  const [updating, setUpdating] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");

  // Today and Tomorrow string helpers
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split("T")[0];
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split("T")[0];

  // Invoicing Selection State: non-cancelled items
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
    order?.items.filter((i) => !i.isCancelled).map((i) => i.id) || []
  );

  // Cancellation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [itemToCancel, setItemToCancel] = useState<{ id: string; title: string; sku: string } | null>(null);
  const [cancelReasonPreset, setCancelReasonPreset] = useState("Stock Unavailable (स्टक उपलब्ध छैन)");
  const [customReasonText, setCustomReasonText] = useState("");

  // Delivery Scheduling Modal State
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(order?.deliveryDate || todayStr);
  const [timeSlot, setTimeSlot] = useState(order?.deliveryTimeSlot || "Morning (8:00 AM - 12:00 PM)");
  const [driverName, setDriverName] = useState(order?.deliveryPerson?.name || "Ramesh Bogati");
  const [driverPhone, setDriverPhone] = useState(order?.deliveryPerson?.phone || "9841009988");
  const [vehicleNo, setVehicleNo] = useState(order?.deliveryPerson?.vehicleNo || "Ba 2 Kha 4490");

  // Invoice Number State & Live Uniqueness Check
  const [invoiceNumberInput, setInvoiceNumberInput] = useState(
    order?.invoiceNumber || marketplaceStore.generateUniqueInvoiceNumber()
  );
  const [invoiceErrorMessage, setInvoiceErrorMessage] = useState("");

  const isInvoiceNumUnique = useMemo(() => {
    if (!invoiceNumberInput.trim()) return false;
    return marketplaceStore.isInvoiceNumberUnique(invoiceNumberInput.trim(), order?.id);
  }, [invoiceNumberInput, order?.id]);

  const handleAutoGenerateInvoiceNumber = () => {
    const generated = marketplaceStore.generateUniqueInvoiceNumber();
    setInvoiceNumberInput(generated);
    setInvoiceErrorMessage("");
  };

  // Pay Date & Payable Amount Filter State
  const [payDatePreset, setPayDatePreset] = useState<"TODAY" | "WEEK" | "15_DAYS" | "1_MONTH" | "CUSTOM">(() => {
    if (!order?.paymentDueDate) return "15_DAYS";
    if (order.paymentDueDate === todayStr) return "TODAY";
    return "CUSTOM";
  });
  const [paymentDueDateInput, setPaymentDueDateInput] = useState<string>(
    order?.paymentDueDate || "2026-11-01"
  );
  const [paymentStatusState, setPaymentStatusState] = useState<"PENDING" | "PAID" | "FAILED" | "REFUNDED">(
    order?.paymentStatus || "PENDING"
  );

  // Check if Pay Date is Out (Overdue)
  const isPayDateOut = useMemo(() => {
    if (paymentStatusState === "PAID") return false;
    if (!paymentDueDateInput) return false;
    return paymentDueDateInput < todayStr;
  }, [paymentDueDateInput, paymentStatusState, todayStr]);

  const daysDiff = useMemo(() => {
    if (!paymentDueDateInput) return 0;
    const due = new Date(paymentDueDateInput).getTime();
    const now = new Date(todayStr).getTime();
    return Math.round((due - now) / (1000 * 60 * 60 * 24));
  }, [paymentDueDateInput, todayStr]);

  const daysOverdue = Math.max(0, -daysDiff);

  const handleSelectPayDatePreset = (preset: "TODAY" | "WEEK" | "15_DAYS" | "1_MONTH" | "CUSTOM") => {
    setPayDatePreset(preset);
    if (preset === "CUSTOM") {
      return;
    }
    const targetDate = new Date();
    if (preset === "TODAY") {
      // today
    } else if (preset === "WEEK") {
      targetDate.setDate(targetDate.getDate() + 7);
    } else if (preset === "15_DAYS") {
      targetDate.setDate(targetDate.getDate() + 15);
    } else if (preset === "1_MONTH") {
      targetDate.setDate(targetDate.getDate() + 30);
    }
    const dateStr = targetDate.toISOString().split("T")[0];
    setPaymentDueDateInput(dateStr);
    handleUpdatePayment(dateStr, paymentStatusState);
  };

  const handleUpdatePayment = async (
    newDueDate: string,
    newStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
  ) => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PAYMENT",
          paymentDueDate: newDueDate,
          paymentStatus: newStatus,
          payableAmount: payableAmountValue,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder({ ...data.order });
        if (data.order.paymentDueDate) setPaymentDueDateInput(data.order.paymentDueDate);
        if (data.order.paymentStatus) setPaymentStatusState(data.order.paymentStatus);
        setActionSuccessMsg(`Payable status updated: Due date ${newDueDate} • Status ${newStatus}`);
        setTimeout(() => setActionSuccessMsg(""), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (!order) {
    notFound();
  }

  // Active (non-cancelled) and Cancelled items
  const activeItems = useMemo(() => order.items.filter((i) => !i.isCancelled), [order.items]);
  const cancelledItems = useMemo(() => order.items.filter((i) => i.isCancelled), [order.items]);

  // Payable Amount (calculated from active items + VAT or order.payableAmount)
  const payableAmountValue = useMemo(() => {
    if (order?.payableAmount) return order.payableAmount;
    const activeSub = activeItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const vat = Math.round(activeItems.filter((i) => !i.isVatExempt).reduce((sum, i) => sum + i.totalPrice, 0) * 0.13 * 100) / 100;
    return activeSub + vat;
  }, [order?.payableAmount, activeItems]);

  // Selected items calculation for invoice
  const selectedItems = useMemo(
    () => activeItems.filter((i) => selectedItemIds.includes(i.id)),
    [activeItems, selectedItemIds]
  );
  const selectedSubtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.totalPrice, 0),
    [selectedItems]
  );
  const selectedVat = useMemo(
    () => Math.round(selectedItems.filter((i) => !i.isVatExempt).reduce((sum, i) => sum + i.totalPrice, 0) * 0.13 * 100) / 100,
    [selectedItems]
  );
  const selectedInvoiceGrandTotal = selectedSubtotal + selectedVat;

  const isTodayDelivery = order.deliveryDate === todayStr;

  // Toggle single item selection for invoicing
  const toggleItemSelection = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const selectAllActive = () => {
    setSelectedItemIds(activeItems.map((i) => i.id));
  };

  const deselectAll = () => {
    setSelectedItemIds([]);
  };

  // Status transitions
  const handleUpdateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder({ ...data.order });
        setActionSuccessMsg(`Order status updated to ${newStatus}`);
        setTimeout(() => setActionSuccessMsg(""), 3500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  // 1. Cancel an individual item
  const openCancelModal = (item: { id: string; title: string; sku: string }) => {
    setItemToCancel(item);
    setCancelReasonPreset("Stock Unavailable (स्टक उपलब्ध छैन)");
    setCustomReasonText("");
    setShowCancelModal(true);
  };

  const handleConfirmCancelItem = async () => {
    if (!itemToCancel) return;
    setUpdating(true);
    const finalReason =
      cancelReasonPreset === "Other Custom Reason (अन्य कारण)"
        ? customReasonText.trim() || "Stock Unavailable"
        : cancelReasonPreset;

    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CANCEL_ITEM",
          itemId: itemToCancel.id,
          cancelReason: finalReason,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder({ ...data.order });
        // remove from selected for invoice
        setSelectedItemIds((prev) => prev.filter((id) => id !== itemToCancel.id));
        setShowCancelModal(false);
        setActionSuccessMsg(`Item "${itemToCancel.title}" cancelled: ${finalReason}`);
        setTimeout(() => setActionSuccessMsg(""), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  // 2. Undo item cancellation
  const handleUndoCancel = async (itemId: string, title: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UNCANCEL_ITEM",
          itemId,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder({ ...data.order });
        setSelectedItemIds((prev) => [...prev, itemId]);
        setActionSuccessMsg(`Item "${title}" restored to active order.`);
        setTimeout(() => setActionSuccessMsg(""), 3500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  // 3. Set Invoice for Selected Items & Send Notice
  const handleGenerateInvoice = async () => {
    if (selectedItemIds.length === 0) {
      setInvoiceErrorMessage("Please select at least 1 item to include in the tax invoice.");
      return;
    }

    const cleanInvNo = invoiceNumberInput.trim().toUpperCase();
    if (!cleanInvNo) {
      setInvoiceErrorMessage("Please enter or generate an invoice number.");
      return;
    }

    if (!marketplaceStore.isInvoiceNumberUnique(cleanInvNo, order.id)) {
      setInvoiceErrorMessage(
        `Invoice number "${cleanInvNo}" is already in use by another order. Please provide a unique invoice number.`
      );
      return;
    }

    setInvoiceErrorMessage("");
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SET_INVOICE",
          selectedItemIds,
          invoiceNumber: cleanInvNo,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setInvoiceErrorMessage(data.error || "Failed to generate invoice");
        return;
      }
      if (data.success && data.order) {
        setOrder({ ...data.order });
        setInvoiceNumberInput(data.order.invoiceNumber);
        setActionSuccessMsg(
          `Official Tax Invoice (${data.order.invoiceNumber}) issued! Confirmation notice delivered to ${order.retailerShop}.`
        );
        setTimeout(() => setActionSuccessMsg(""), 6000);
      }
    } catch (e: any) {
      setInvoiceErrorMessage(e.message || "Failed to communicate with server");
    } finally {
      setUpdating(false);
    }
  };

  // 4. Schedule Delivery & Assign Driver
  const handleScheduleDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SCHEDULE_DELIVERY",
          deliveryDate,
          timeSlot,
          deliveryPerson: {
            name: driverName,
            phone: driverPhone,
            vehicleNo,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder({ ...data.order });
        setShowDeliveryModal(false);
        const dayMsg =
          deliveryDate === todayStr ? "Dispatched for ON DELIVERY today!" : `Scheduled for delivery on ${deliveryDate}.`;
        setActionSuccessMsg(`Delivery schedule updated: ${dayMsg}`);
        setTimeout(() => setActionSuccessMsg(""), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Dynamic Success Notification Banner */}
      {actionSuccessMsg && (
        <div className="bg-emerald-600 text-white p-3.5 px-5 rounded-xl shadow-md flex items-center justify-between text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-100" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg("")} className="text-emerald-100 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div className="space-y-1">
          <Link
            href="/distributor/orders"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#0759C7] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Orders
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-[#102C55] font-mono">{order.orderNumber}</h1>
            <StatusBadge status={order.status} />

            {/* Delivery Date Tag */}
            {order.deliveryDate && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  isTodayDelivery
                    ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}
              >
                <Calendar className="w-3 h-3 text-[#0759C7]" />
                <span>
                  {isTodayDelivery ? "🚚 On Delivery Today (आज डेलिभरीमा)" : `Delivery: ${order.deliveryDate}`}
                </span>
              </span>
            )}

            {/* Invoice Tag */}
            {order.isInvoiced && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Receipt className="w-3 h-3" />
                <span>Invoiced ({order.invoiceNumber})</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Retailer Store: <strong className="text-slate-800">{order.retailerShop}</strong> ({order.retailerName}) •
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {order.isInvoiced ? (
            <Link href={`/retailer/invoices/${order.id}?from=distributor`}>
              <Button variant="outline" size="sm" className="font-bold text-xs h-9 flex items-center gap-1.5 border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>View Tax Invoice</span>
              </Button>
            </Link>
          ) : (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              Invoice Pending
            </span>
          )}

          {/* Schedule / Reassign Delivery button */}
          <Button
            variant="orange"
            size="sm"
            onClick={() => setShowDeliveryModal(true)}
            className="font-bold text-xs h-9 flex items-center gap-1.5 shadow-sm"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{order.deliveryPerson ? "Update Delivery / Driver" : "Assign Delivery & Date"}</span>
          </Button>

          {order.status === "DISPATCHED" && (
            <Button
              variant="secondary"
              size="sm"
              isLoading={updating}
              onClick={() => handleUpdateStatus("DELIVERED")}
              className="font-bold text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Delivered & Paid</span>
            </Button>
          )}
        </div>
      </div>

      {/* =========================================================================
          PAY DATE FILTER & PAYABLE AMOUNT STATUS SECTION
          ========================================================================= */}
      <div
        className={cn(
          "bg-white rounded-2xl border p-5 shadow-soft transition-all space-y-4",
          isPayDateOut
            ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-500/20"
            : "border-slate-200"
        )}
      >
        {/* Header with Title and Presets Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-xs",
                  isPayDateOut ? "bg-rose-600 animate-pulse" : "bg-[#0759C7]"
                )}
              >
                <CalendarClock className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-black text-sm text-[#102C55] flex items-center gap-2">
                  <span>Pay Date & Credit Filter (भुक्तानी म्याद र स्थिति)</span>
                  {isPayDateOut && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white animate-pulse shadow-xs">
                      <AlertTriangle className="w-3 h-3" />
                      <span>RED INDICATOR: PAY DATE OUT (म्याद नाघेको)</span>
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select payment maturity terms: Today, 7 days, 15 days, 1 month, or custom date
                </p>
              </div>
            </div>
          </div>

          {/* Timeframe Presets Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider hidden sm:inline-block">
              Filter:
            </span>

            {[
              { id: "TODAY" as const, label: "Today (आज)" },
              { id: "WEEK" as const, label: "Week (७ दिन)" },
              { id: "15_DAYS" as const, label: "15 Days (१५ दिन)" },
              { id: "1_MONTH" as const, label: "1 Month (१ महिना)" },
              { id: "CUSTOM" as const, label: "Custom Date (अनुकूलित)" },
            ].map((preset) => {
              const isSelected = payDatePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPayDatePreset(preset.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1",
                    isSelected
                      ? isPayDateOut
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-[#0759C7] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                  )}
                >
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Date Picker Bar (shown when CUSTOM is selected) */}
        {payDatePreset === "CUSTOM" && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <label className="font-bold text-slate-700">Set Custom Pay Date (भुक्तानी मिति):</label>
              <input
                type="date"
                value={paymentDueDateInput}
                onChange={(e) => {
                  setPaymentDueDateInput(e.target.value);
                  handleUpdatePayment(e.target.value, paymentStatusState);
                }}
                className="h-8 px-2.5 rounded-lg border border-slate-300 font-mono font-bold text-xs text-slate-800 focus:ring-2 focus:ring-[#0759C7]"
              />
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <span>Tip: Set a past date (e.g. 2026-10-31) to test the red overdue indicator</span>
            </div>
          </div>
        )}

        {/* Status & Payable Amount Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Payable Amount */}
          <div
            className={cn(
              "p-4 rounded-xl border transition-all flex flex-col justify-between",
              isPayDateOut
                ? "bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-400"
                : "bg-slate-50 border-slate-200 text-slate-900"
            )}
          >
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-500 block tracking-wider">
                Payable Amount (भुक्तानी योग्य रकम)
              </span>
              <p
                className={cn(
                  "text-2xl font-black font-mono tracking-tight mt-1",
                  isPayDateOut ? "text-rose-600" : "text-[#102C55]"
                )}
              >
                {formatNPR(payableAmountValue)}
              </p>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Active items total + 13% IRD VAT (Total order balance)
            </p>
          </div>

          {/* Card 2: Pay Date & Overdue Indicator */}
          <div
            className={cn(
              "p-4 rounded-xl border transition-all flex flex-col justify-between",
              isPayDateOut
                ? "bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-400"
                : "bg-slate-50 border-slate-200 text-slate-900"
            )}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                  Pay Date (म्याद मिति)
                </span>
                {isPayDateOut ? (
                  <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>RED: OUT OF DATE</span>
                  </span>
                ) : paymentStatusState === "PAID" ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    PAID
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0759C7]">
                    ACTIVE CREDIT
                  </span>
                )}
              </div>

              <p className="text-base font-bold font-mono text-slate-900 mt-1">
                {paymentDueDateInput || "Not Specified"}
              </p>
            </div>

            {/* Overdue / On-Schedule Status Line */}
            <div className="mt-2 text-xs">
              {paymentStatusState === "PAID" ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Invoice settled in full</span>
                </span>
              ) : isPayDateOut ? (
                <span className="text-rose-700 font-black flex items-center gap-1 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
                  <span>Overdue by {daysOverdue} {daysOverdue === 1 ? "day" : "days"}! (Pay date is OUT)</span>
                </span>
              ) : daysDiff === 0 ? (
                <span className="text-amber-800 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Payment due TODAY!</span>
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>On Schedule • {daysDiff} days remaining</span>
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Settlement Status & 1-Click Action */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-500 block tracking-wider">
                Payment Status (स्थिति)
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5",
                    paymentStatusState === "PAID"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : isPayDateOut
                      ? "bg-rose-100 text-rose-800 border border-rose-300 font-black"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      paymentStatusState === "PAID"
                        ? "bg-emerald-600"
                        : isPayDateOut
                        ? "bg-rose-600 animate-ping"
                        : "bg-amber-600"
                    )}
                  />
                  <span>
                    {paymentStatusState === "PAID"
                      ? "PAID IN FULL (चुक्ता)"
                      : isPayDateOut
                      ? "OVERDUE (म्याद नाघेको)"
                      : "PAYMENT PENDING (बाँकी)"}
                  </span>
                </span>
              </div>
            </div>

            {/* Quick 1-click Payment Status Toggle */}
            <div className="pt-2 flex items-center gap-2">
              {paymentStatusState === "PAID" ? (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleUpdatePayment(paymentDueDateInput, "PENDING")}
                  className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Revert to Pending
                </button>
              ) : (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleUpdatePayment(paymentDueDateInput, "PAID")}
                  className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark as Paid (रकम प्राप्त)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Red Alert Banner if Pay Date is Out */}
        {isPayDateOut && (
          <div className="p-3.5 rounded-xl bg-rose-100/90 border border-rose-300 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 font-bold">
                !
              </span>
              <div>
                <p className="font-bold text-rose-950">
                  RED ALERT: Pay Date Expired! Retailer credit term has passed by {daysOverdue} {daysOverdue === 1 ? "day" : "days"}.
                </p>
                <p className="text-[11px] text-rose-800">
                  Payable amount of <strong>{formatNPR(payableAmountValue)}</strong> is overdue. Please contact {order.retailerShop} ({order.deliveryAddress.phone}) for settlement.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${order.deliveryAddress.phone}`}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors flex items-center gap-1 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Retailer</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation & Notice Alert to Retailer (तपाईंको अर्डर स्वीकृत भयो र इनभ्वाइस जारी गरियो) */}
      {order.confirmationNotice ? (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Notice Sent to Retailer (अर्डर स्वीकृति तथा इनभ्वाइस सूचना जारी)
            </span>
            <span className="text-[11px] font-mono text-emerald-800 font-semibold">
              Sent at {formatDate(order.confirmationNotice.sentAt)}
            </span>
          </div>
          <p className="text-xs text-emerald-950 leading-relaxed font-medium">
            "{order.confirmationNotice.message}"
          </p>
          <div className="text-[11px] text-emerald-700 flex items-center gap-2 pt-0.5">
            <span>Recipient Mobile: <strong className="font-mono">{order.confirmationNotice.recipientPhone}</strong></span>
            <span>•</span>
            <span>Invoice Ref: <strong className="font-mono">{order.invoiceNumber}</strong></span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0759C7]" />
            <span>
              <strong>Step 1:</strong> Select individual items below to include in the tax invoice, or cancel unavailable items.
            </span>
          </div>
          <span className="text-[11px] text-blue-700 font-bold">Awaiting Invoicing</span>
        </div>
      )}

      {/* Scheduled Delivery Banner (Shows "On Delivery" on mention day) */}
      {order.deliveryPerson && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
            isTodayDelivery
              ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-200/60"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                isTodayDelivery ? "bg-amber-600 animate-pulse" : "bg-[#0759C7]"
              }`}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-black text-[#102C55] text-sm">
                  {isTodayDelivery ? "🚚 ON DELIVERY TODAY (आज डेलिभरीमा)" : "Scheduled Delivery Assigned"}
                </p>
                {order.deliveryDate && (
                  <span className="bg-white px-2 py-0.5 rounded font-bold text-[11px] text-slate-700 border border-slate-200">
                    Date: {order.deliveryDate} {order.deliveryTimeSlot ? `• ${order.deliveryTimeSlot}` : ""}
                  </span>
                )}
              </div>
              <p className="text-slate-700 mt-0.5">
                Driver: <strong className="text-slate-900">{order.deliveryPerson.name}</strong> • Phone:{" "}
                <strong className="font-mono text-slate-900">{order.deliveryPerson.phone}</strong> • Vehicle:{" "}
                <strong className="font-mono text-slate-900">{order.deliveryPerson.vehicleNo}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setShowDeliveryModal(true)}
              className="text-xs font-bold text-[#0759C7] hover:underline bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
            >
              Change Date / Driver
            </button>
          </div>
        </div>
      )}

      {/* Destination & Settlement Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft space-y-2 text-xs">
          <p className="font-bold text-sm text-[#102C55] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0759C7]" />
            Retailer Destination Address
          </p>
          <div className="text-slate-700 space-y-1 pt-1">
            <p className="font-bold text-slate-900">{order.retailerShop}</p>
            <p>Recipient: {order.deliveryAddress.recipientName}</p>
            <p>
              {order.deliveryAddress.streetAddress}, Ward {order.deliveryAddress.ward}
            </p>
            <p>
              {order.deliveryAddress.municipality}, {order.deliveryAddress.district}
            </p>
            <p className="font-mono font-bold text-slate-900">Phone: {order.deliveryAddress.phone}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft space-y-2 text-xs">
          <p className="font-bold text-sm text-[#102C55] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0759C7]" />
            Order Totals & Settlement
          </p>
          <div className="text-slate-700 space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span>Active Items Subtotal:</span>
              <span className="font-mono font-bold text-slate-900">{formatNPR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>13% VAT Tax:</span>
              <span className="font-mono font-bold text-slate-800">+{formatNPR(order.taxAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Commission ({order.commissionRate}%):</span>
              <span className="font-mono text-red-600">-{formatNPR(order.commissionAmount)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-black text-emerald-700">
              <span>Net Distributor Payout:</span>
              <span className="font-mono">{formatNPR(order.netDistributorEarnings)}</span>
            </div>

            <div
              className={cn(
                "flex justify-between items-center p-2 rounded-lg border mt-2",
                isPayDateOut
                  ? "bg-rose-50 border-rose-300 text-rose-900"
                  : "bg-slate-50 border-slate-200"
              )}
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Payable Amount (तिर्नुपर्ने रकम):
                </span>
                <span
                  className={cn(
                    "font-mono font-black text-sm",
                    isPayDateOut ? "text-rose-600" : "text-[#102C55]"
                  )}
                >
                  {formatNPR(payableAmountValue)}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full inline-block",
                    paymentStatusState === "PAID"
                      ? "bg-emerald-100 text-emerald-800"
                      : isPayDateOut
                      ? "bg-rose-600 text-white animate-pulse"
                      : "bg-amber-100 text-amber-800"
                  )}
                >
                  {paymentStatusState === "PAID"
                    ? "PAID"
                    : isPayDateOut
                    ? `🚨 OVERDUE (${daysOverdue}d)`
                    : "PENDING"}
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">
                  Due: {paymentDueDateInput}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Line Items Table & Invoicing Selection Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft space-y-0">
        {/* Invoicing Control Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-blue-50/40 border-b border-slate-200 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#102C55] flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#0759C7]" />
                Wholesale Cartons Ordered & Tax Invoice Builder
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Set a unique IRD invoice number, select individual items to invoice, or cancel out-of-stock items with reason.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {order.isInvoiced && (
                <Link href={`/retailer/invoices/${order.id}?from=distributor`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-bold text-xs h-9 flex items-center gap-1.5 border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    <span>View Current Invoice ({order.invoiceNumber})</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Invoice Number Input & Uniqueness Verification Box */}
          <div className="p-3.5 bg-white rounded-xl border border-blue-200/90 shadow-xs space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-[#102C55] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#0759C7]" />
                <span>IRD Tax Invoice Number (कर इनभ्वाइस नं.) *</span>
              </label>

              {/* Live Uniqueness Badge */}
              <div className="flex items-center gap-2">
                {invoiceNumberInput.trim() ? (
                  isInvoiceNumUnique ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>✓ Unique & Available (स्वीकृत)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>✕ Already in Use (दोहोरिएको नम्बर)</span>
                    </span>
                  )
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400">
                    Invoice number required
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={invoiceNumberInput}
                  onChange={(e) => {
                    setInvoiceNumberInput(e.target.value.toUpperCase());
                    setInvoiceErrorMessage("");
                  }}
                  placeholder="e.g. INV-2026-BAG-00915, DLR-KTM-080/81-0012, or serial bill no."
                  className={`w-full h-9 px-3 rounded-lg border font-mono font-bold text-xs uppercase tracking-wider focus:ring-2 focus:ring-[#0759C7] ${
                    isInvoiceNumUnique
                      ? "border-emerald-400 bg-emerald-50/20 text-slate-900"
                      : invoiceNumberInput.trim()
                      ? "border-rose-400 bg-rose-50/30 text-rose-950"
                      : "border-slate-300 bg-white"
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={handleAutoGenerateInvoiceNumber}
                className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center justify-center gap-1.5 transition-colors shrink-0"
                title="Auto-generate a guaranteed unique invoice number"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0759C7]" />
                <span>⚡ Auto-Generate Unique</span>
              </button>

              <Button
                variant="primary"
                size="sm"
                isLoading={updating}
                onClick={handleGenerateInvoice}
                disabled={selectedItemIds.length === 0 || !isInvoiceNumUnique}
                className="font-bold text-xs h-9 flex items-center justify-center gap-1.5 shadow-sm shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {order.isInvoiced
                    ? `Update Invoice (${selectedItems.length} Items)`
                    : `Confirm & Issue Invoice (${selectedItems.length} Items)`}
                </span>
              </Button>
            </div>

            {/* Error Message if duplicate or validation fails */}
            {invoiceErrorMessage && (
              <p className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{invoiceErrorMessage}</span>
              </p>
            )}

            <p className="text-[10px] text-slate-400">
              Unique Nepal IRD Invoice Number format. Must be unique across all marketplace orders (e.g., from physical tax invoice book or system series).
            </p>
          </div>

          {/* Quick Select / Deselect Bar */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[11px] text-slate-600">
              Check / uncheck individual items to include in this invoice ({selectedItems.length} of {activeItems.length} selected):
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAllActive}
                className="text-[11px] text-[#0759C7] hover:underline font-bold"
              >
                Select All ({activeItems.length})
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={deselectAll}
                className="text-[11px] text-slate-500 hover:text-red-600 font-semibold underline"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">
                  <span className="sr-only">Select</span>
                  Invoice
                </th>
                <th className="py-3 px-4">Wholesale Item Description</th>
                <th className="py-3 px-3 text-center">Packaging</th>
                <th className="py-3 px-3 text-center">Cartons</th>
                <th className="py-3 px-4 text-right">Wholesale Rate</th>
                <th className="py-3 px-4 text-right">Taxable Total</th>
                <th className="py-3 px-4 text-center">Item Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                const isCancelled = item.isCancelled;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isCancelled
                        ? "bg-rose-50/40 text-slate-400"
                        : isSelected
                        ? "bg-blue-50/20 hover:bg-blue-50/40"
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    {/* Invoicing Checkbox */}
                    <td className="py-3.5 px-3 text-center">
                      {!isCancelled ? (
                        <button
                          type="button"
                          onClick={() => toggleItemSelection(item.id)}
                          className="text-[#0759C7] hover:scale-110 transition-transform"
                          title={isSelected ? "Uncheck from invoice" : "Include in invoice"}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-[#0759C7]" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                          )}
                        </button>
                      ) : (
                        <span className="text-slate-300" title="Cancelled items cannot be invoiced">
                          ✕
                        </span>
                      )}
                    </td>

                    {/* Item Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <p
                          className={`font-bold ${
                            isCancelled ? "line-through text-slate-400" : "text-slate-900"
                          }`}
                        >
                          {item.productTitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-mono">SKU: {item.productSku}</span>

                          {/* Cancellation Reason Badge */}
                          {isCancelled && (
                            <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px] border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Cancelled: {item.cancelReason || "Stock Unavailable"}</span>
                            </span>
                          )}

                          {/* Invoiced Status Badge */}
                          {!isCancelled && item.isInvoiced && (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded text-[9px] border border-emerald-200">
                              ✓ Invoiced
                            </span>
                          )}

                          {/* VAT Status */}
                          {item.isVatExempt ? (
                            <span className="text-[9px] bg-amber-50 text-amber-800 font-semibold px-1.5 py-0.2 rounded border border-amber-200">
                              VAT Exempt
                            </span>
                          ) : (
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              13% VAT
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center font-medium text-slate-600">{item.unitType}</td>

                    <td className="py-3.5 px-3 text-center font-bold font-mono">
                      <span className={isCancelled ? "line-through text-slate-400" : "text-slate-900"}>
                        {item.quantity}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      <span className={isCancelled ? "line-through text-slate-400" : "text-slate-700"}>
                        {formatNPR(item.unitPrice)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={isCancelled ? "line-through text-slate-400" : "text-slate-900"}>
                        {formatNPR(item.totalPrice)}
                      </span>
                    </td>

                    {/* Action: Cancel Item or Undo */}
                    <td className="py-3.5 px-4 text-center">
                      {isCancelled ? (
                        <button
                          type="button"
                          onClick={() => handleUndoCancel(item.id, item.productTitle)}
                          disabled={updating}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          title="Restore item to active order"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Undo Cancel</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openCancelModal({ id: item.id, title: item.productTitle, sku: item.productSku })}
                          disabled={updating}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-1 rounded border border-rose-200 hover:bg-rose-100 transition-colors"
                          title="Cancel item with reason (e.g., stock unavailable)"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Cancel Item</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Items Summary Footer Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-3">
            <span>
              Selected for Invoicing: <strong className="text-slate-900">{selectedItems.length}</strong> of{" "}
              {activeItems.length} active items
            </span>
            {cancelledItems.length > 0 && (
              <span className="text-rose-600 font-semibold">
                • ({cancelledItems.length} item{cancelledItems.length > 1 ? "s" : ""} cancelled)
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-right font-mono">
            <span>Subtotal: <strong className="text-slate-900">{formatNPR(selectedSubtotal)}</strong></span>
            <span>+13% VAT: <strong className="text-slate-900">{formatNPR(selectedVat)}</strong></span>
            <span className="text-sm font-black text-[#0759C7]">
              Invoice Total: {formatNPR(selectedInvoiceGrandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* MODAL 1: Cancel Item with Reason */}
      {showCancelModal && itemToCancel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-base font-black text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  Cancel Item (सामान रद्ध गर्नुहोस्)
                </h3>
                <p className="text-xs text-slate-500">
                  Provide cancellation reason. The retailer will see this reason in their order invoice.
                </p>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Target Item Pill */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <p className="font-bold text-slate-900">{itemToCancel.title}</p>
              <p className="text-[10px] text-slate-400 font-mono">SKU: {itemToCancel.sku}</p>
            </div>

            {/* Reason Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#102C55]">
                Select Cancellation Reason (रद्ध गर्नुको कारण):
              </label>
              <div className="space-y-1.5">
                {[
                  "Stock Unavailable (स्टक उपलब्ध छैन)",
                  "Damaged / Defective Carton (सामान बिग्रेको / फुटेको)",
                  "Near Expiry / Expired Batch (म्याद सकिएको)",
                  "Customer / Retailer Requested Cancellation (पसलेले रद्ध गर्न अनुरोध गरेको)",
                  "Other Custom Reason (अन्य कारण)",
                ].map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer text-xs transition-all ${
                      cancelReasonPreset === reason
                        ? "border-rose-500 bg-rose-50/70 text-rose-950 font-bold"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      checked={cancelReasonPreset === reason}
                      onChange={() => setCancelReasonPreset(reason)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Free text custom reason input */}
            {cancelReasonPreset === "Other Custom Reason (अन्य कारण)" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Type Detailed Reason:
                </label>
                <Input
                  value={customReasonText}
                  onChange={(e) => setCustomReasonText(e.target.value)}
                  placeholder="e.g. Factory delivery delay or truck breakdown"
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" type="button" onClick={() => setShowCancelModal(false)}>
                Go Back
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={updating}
                onClick={handleConfirmCancelItem}
                className="font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Cancel Item
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Assign Delivery & Set Delivery Date */}
      {showDeliveryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#102C55] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#0759C7]" />
                  Schedule Delivery & Assign Driver
                </h3>
                <p className="text-xs text-slate-500">
                  Set the delivery date and assign driver. Retailer will see this scheduled date in real-time.
                </p>
              </div>
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleDelivery} className="space-y-3.5 text-xs">
              {/* Delivery Date Picker & Quick Chips */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#102C55]">
                  Expected Delivery Date (डेलिभरी मिति) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg border border-slate-300 font-mono text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0759C7]"
                    required
                  />
                  {deliveryDate === todayStr && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-1 rounded text-[11px] font-bold animate-pulse">
                      🚚 Today
                    </span>
                  )}
                </div>

                {/* Quick Date Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setDeliveryDate(todayStr)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                      deliveryDate === todayStr
                        ? "bg-[#0759C7] text-white border-blue-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                    }`}
                  >
                    Today (आजै)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryDate(tomorrowStr)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                      deliveryDate === tomorrowStr
                        ? "bg-[#0759C7] text-white border-blue-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                    }`}
                  >
                    Tomorrow (भोलि)
                  </button>
                </div>
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-xs font-bold text-[#102C55] mb-1">
                  Delivery Time Window (समय स्लट)
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-[#0759C7]"
                >
                  <option value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon (1:00 PM - 5:00 PM)</option>
                  <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                  <option value="Anytime during business hours">Anytime during business hours</option>
                </select>
              </div>

              {/* Driver Details */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="font-bold text-[#102C55] block text-xs">
                  Driver / Delivery Personnel Details:
                </span>

                {/* Fast Driver Presets */}
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
                        setDriverName(preset.name);
                        setDriverPhone(preset.phone);
                        setVehicleNo(preset.vehicle);
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                    >
                      {preset.name} ({preset.vehicle})
                    </button>
                  ))}
                </div>

                <Input
                  label="Driver Name *"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Driver Full Name"
                  required
                />
                <Input
                  label="Driver Phone Number *"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  required
                />
                <Input
                  label="Vehicle Registration Number *"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  placeholder="e.g. Ba 2 Kha 4490"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowDeliveryModal(false)}>
                  Cancel
                </Button>
                <Button variant="orange" size="sm" type="submit" isLoading={updating} className="font-bold shadow-md">
                  {deliveryDate === todayStr ? "Dispatch Now (On Delivery)" : "Schedule Delivery"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
