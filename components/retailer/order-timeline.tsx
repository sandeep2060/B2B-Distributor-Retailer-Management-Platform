import React from "react";
import { CheckCircle2, Clock, Truck, Package, ShieldCheck, Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MockOrder } from "@/lib/db/mock-data";

interface OrderTimelineProps {
  order: MockOrder;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const steps = [
    { key: "PENDING", label: "Order Placed", desc: "Awaiting distributor confirmation", icon: Clock },
    { key: "CONFIRMED", label: "Confirmed", desc: "Accepted by distributor", icon: CheckCircle2 },
    { key: "PROCESSING", label: "Packing & Invoicing", desc: "Preparing wholesale cartons", icon: Package },
    { key: "DISPATCHED", label: "Dispatched", desc: "Out for retail delivery", icon: Truck },
    { key: "DELIVERED", label: "Delivered", desc: "Received & verified at shop", icon: ShieldCheck },
  ];

  const getStepStatus = (stepKey: string) => {
    const orderProgression = ["PENDING", "CONFIRMED", "PROCESSING", "DISPATCHED", "DELIVERED"];
    const currentIndex = orderProgression.indexOf(order.status);
    const stepIndex = orderProgression.indexOf(stepKey);

    if (order.status === "CANCELLED") {
      return "cancelled";
    }

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-bold text-sm text-[#102C55]">Wholesale Delivery Timeline</h4>
          <p className="text-xs text-slate-500">Order Ref: {order.orderNumber}</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
          <span className="text-xs font-black text-[#0759C7]">{order.status}</span>
        </div>
      </div>

      {/* Stepper horizontal on desktop / vertical on mobile */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const status = getStepStatus(step.key);
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 relative">
                {/* Connector line on desktop */}
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "hidden sm:block absolute top-4 left-1/2 w-full h-0.5 -z-0",
                      status === "completed" ? "bg-[#0759C7]" : "bg-slate-200"
                    )}
                  />
                )}

                {/* Node icon */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors shadow-xs",
                    status === "completed" && "bg-[#0759C7] text-white",
                    status === "current" && "bg-[#F58220] text-white ring-4 ring-orange-100",
                    status === "upcoming" && "bg-slate-100 text-slate-400 border border-slate-200"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Text details */}
                <div className="sm:mt-1">
                  <p
                    className={cn(
                      "text-xs font-bold leading-tight",
                      status === "current" && "text-[#F58220]",
                      status === "completed" && "text-[#102C55]",
                      status === "upcoming" && "text-slate-400"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-500 hidden sm:block mt-0.5 max-w-[120px] mx-auto">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduled Delivery Indicator */}
      {order.deliveryDate && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
            order.deliveryDate === new Date().toISOString().split("T")[0]
              ? "bg-amber-50 border-amber-300 text-amber-950 ring-2 ring-amber-200"
              : "bg-blue-50 border-blue-200 text-blue-950"
          }`}
        >
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#0759C7]" />
            <span className="font-bold">
              {order.deliveryDate === new Date().toISOString().split("T")[0]
                ? "🚚 On Delivery Today (आज डेलिभरी हुँदैछ)"
                : `📅 Scheduled Delivery Date: ${order.deliveryDate}`}
            </span>
            {order.deliveryTimeSlot && (
              <span className="text-slate-600 font-normal">• Slot: {order.deliveryTimeSlot}</span>
            )}
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
            {order.deliveryDate === new Date().toISOString().split("T")[0] ? "Out for Delivery" : "Confirmed Schedule"}
          </span>
        </div>
      )}

      {/* Delivery personnel card if dispatched */}
      {order.deliveryPerson && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#0759C7] text-white flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#102C55]">Assigned Delivery Driver</p>
              <p className="text-slate-700">
                {order.deliveryPerson.name} • Vehicle:{" "}
                <span className="font-bold font-mono">{order.deliveryPerson.vehicleNo}</span>
              </p>
            </div>
          </div>
          <a
            href={`tel:${order.deliveryPerson.phone}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-[#0759C7] text-[#0759C7] hover:bg-[#0759C7] hover:text-white rounded-lg font-bold transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Driver ({order.deliveryPerson.phone})</span>
          </a>
        </div>
      )}
    </div>
  );
};
