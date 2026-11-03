"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";

export default function DistributorOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState(marketplaceStore.getOrderById(params.id));
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [driverName, setDriverName] = useState("Ramesh Bogati");
  const [driverPhone, setDriverPhone] = useState("9841009988");
  const [vehicleNo, setVehicleNo] = useState("Ba 2 Kha 4490");
  const [updating, setUpdating] = useState(false);

  if (!order) {
    notFound();
  }

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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        setShowDriverModal(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div className="space-y-1">
          <Link
            href="/distributor/orders"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#0759C7] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-[#102C55] font-mono">{order.orderNumber}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-500">Retailer: {order.retailerShop}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/retailer/invoices/${order.id}`}>
            <Button variant="outline" size="sm" className="font-bold text-xs h-10 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#0759C7]" />
              <span>Tax Invoice</span>
            </Button>
          </Link>

          {order.status === "PENDING" && (
            <Button
              variant="primary"
              size="sm"
              isLoading={updating}
              onClick={() => handleUpdateStatus("CONFIRMED")}
              className="font-bold text-xs h-10"
            >
              Confirm Order
            </Button>
          )}

          {order.status === "CONFIRMED" && (
            <Button
              variant="primary"
              size="sm"
              isLoading={updating}
              onClick={() => handleUpdateStatus("PROCESSING")}
              className="font-bold text-xs h-10"
            >
              Start Packing (Processing)
            </Button>
          )}

          {(order.status === "PROCESSING" || order.status === "CONFIRMED") && (
            <Button
              variant="orange"
              size="sm"
              onClick={() => setShowDriverModal(true)}
              className="font-bold text-xs h-10 flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>Assign Driver & Dispatch</span>
            </Button>
          )}

          {order.status === "DISPATCHED" && (
            <Button
              variant="secondary"
              size="sm"
              isLoading={updating}
              onClick={() => handleUpdateStatus("DELIVERED")}
              className="font-bold text-xs h-10 bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Delivered & Paid</span>
            </Button>
          )}
        </div>
      </div>

      {/* Driver Info Banner if assigned */}
      {order.deliveryPerson && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0759C7] text-white flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#102C55]">Assigned Delivery Personnel</p>
              <p className="text-slate-700">
                {order.deliveryPerson.name} • Phone: <strong className="font-mono">{order.deliveryPerson.phone}</strong> • Vehicle:{" "}
                <strong className="font-mono">{order.deliveryPerson.vehicleNo}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDriverModal(true)}
            className="text-xs font-bold text-[#0759C7] hover:underline"
          >
            Reassign Driver
          </button>
        </div>
      )}

      {/* Destination & Payment Details */}
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
            Settlement & Earnings
          </p>
          <div className="text-slate-700 space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span>Gross Total:</span>
              <span className="font-mono font-bold text-slate-900">{formatNPR(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Commission ({order.commissionRate}%):</span>
              <span className="font-mono text-red-600">-{formatNPR(order.commissionAmount)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-black text-emerald-700">
              <span>Net Distributor Payout:</span>
              <span className="font-mono">{formatNPR(order.netDistributorEarnings)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-sm text-[#102C55]">Wholesale Cartons Ordered</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="py-3 px-4">Item Description</th>
                <th className="py-3 px-4 text-center">Packaging</th>
                <th className="py-3 px-4 text-center">Cartons</th>
                <th className="py-3 px-4 text-right">Carton Wholesale Rate</th>
                <th className="py-3 px-4 text-right">Taxable Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{item.productTitle}</p>
                    <p className="text-[10px] text-slate-400 font-mono">SKU: {item.productSku}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-slate-600">{item.unitType}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900 font-mono">{item.quantity}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700">{formatNPR(item.unitPrice)}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {formatNPR(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Assignment Modal */}
      {showDriverModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-black text-[#102C55] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#0759C7]" />
              Assign Delivery Personnel
            </h3>
            <p className="text-xs text-slate-500">
              The driver contact will be visible on the retailer's live tracking timeline.
            </p>

            <form onSubmit={handleAssignDriver} className="space-y-3 text-xs">
              <Input
                label="Driver / Delivery Person Name *"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Driver Name"
                required
              />
              <Input
                label="Driver Nepal Contact Phone *"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="98XXXXXXXX"
                required
              />
              <Input
                label="Delivery Vehicle Number *"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                placeholder="e.g. Ba 2 Kha 4490"
                required
              />

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowDriverModal(false)}>
                  Cancel
                </Button>
                <Button variant="orange" size="sm" type="submit" isLoading={updating} className="font-bold">
                  Confirm Dispatch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
