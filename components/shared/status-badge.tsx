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
