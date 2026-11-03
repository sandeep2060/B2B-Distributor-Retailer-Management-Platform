import React from "react";
import { Badge } from "../ui/badge";

export interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const norm = status.toUpperCase();

  switch (norm) {
    case "DELIVERED":
    case "PAID":
    case "ACTIVE":
    case "VERIFIED":
    case "APPROVED":
      return <Badge variant="success">{status}</Badge>;

    case "ON_DELIVERY":
    case "OUT_FOR_DELIVERY":
    case "ON DELIVERY":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs animate-pulse">
          🚚 On Delivery
        </span>
      );

    case "DISPATCHED":
    case "PROCESSING":
    case "CONFIRMED":
      return <Badge variant="primary">{status}</Badge>;

    case "PENDING":
    case "PENDING_VERIFICATION":
      return <Badge variant="warning">{status}</Badge>;

    case "CANCELLED":
    case "FAILED":
    case "SUSPENDED":
    case "REJECTED":
      return <Badge variant="danger">{status}</Badge>;

    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};
