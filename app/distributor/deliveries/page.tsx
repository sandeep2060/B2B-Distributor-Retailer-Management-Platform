import React from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { formatNPR, formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Truck, Phone, MapPin, CheckCircle2 } from "lucide-react";

export default function DistributorDeliveriesPage() {
  const distributorId = "dist_1";
  const orders = marketplaceStore.getOrders({ distributorId });
  const activeDispatches = orders.filter((o) => o.deliveryPerson || o.status === "DISPATCHED" || o.status === "DELIVERED");

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <h1 className="text-2xl font-black text-[#102C55]">Wholesale Delivery & Dispatch Logs</h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor assigned dispatch drivers, vehicle logistics, and live shop delivery fulfillment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeDispatches.map((o) => (
          <div
            key={o.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-[#0759C7]">{o.orderNumber}</span>
                <StatusBadge status={o.status} />
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-[#0759C7]" />
                  <div>
                    <p className="font-bold text-slate-900">{o.deliveryPerson?.name || "Driver Assigned"}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Vehicle: {o.deliveryPerson?.vehicleNo || "Ba 2 Kha 4490"}
                    </p>
                  </div>
                </div>
                {o.deliveryPerson?.phone && (
                  <a
                    href={`tel:${o.deliveryPerson.phone}`}
                    className="flex items-center gap-1 font-bold text-[#0759C7] bg-white px-2.5 py-1 rounded-lg border border-blue-200"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{o.deliveryPerson.phone}</span>
                  </a>
                )}
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">{o.retailerShop}</p>
                <p className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {o.deliveryAddress.streetAddress}, {o.deliveryAddress.district}
                  </span>
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Volume: {o.items.reduce((s, i) => s + i.quantity, 0)} Cartons • Value: {formatNPR(o.totalAmount)}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Placed: {formatDate(o.createdAt)}</span>
              <Link href={`/distributor/orders/${o.id}`}>
                <Button variant="outline" size="sm" className="text-xs font-bold">
                  View Dispatch Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
