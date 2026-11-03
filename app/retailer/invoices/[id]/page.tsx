import React from "react";
import { notFound } from "next/navigation";
import marketplaceStore from "@/lib/db/store";
import { InvoiceView } from "@/components/shared/invoice-view";

export default function InvoicePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { from?: string };
}) {
  const invoice =
    marketplaceStore.getInvoiceById(params.id) ||
    marketplaceStore.getInvoices().find((i) => i.orderId === params.id);

  if (!invoice) {
    notFound();
  }

  const defaultBackHref =
    searchParams?.from === "distributor"
      ? `/distributor/orders/${invoice.orderId}`
      : "/retailer/orders";

  return (
    <div className="py-8 px-4">
      <InvoiceView invoice={invoice} backHref={defaultBackHref} />
    </div>
  );
}
