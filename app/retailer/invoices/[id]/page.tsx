import React from "react";
import { notFound } from "next/navigation";
import marketplaceStore from "@/lib/db/store";
import { InvoiceView } from "@/components/shared/invoice-view";

export default function InvoicePage({ params }: { params: { id: string } }) {
  const invoice = marketplaceStore.getInvoiceById(params.id);

  if (!invoice) {
    // If invoice not found by ID, check if param matches order ID
    const invByOrder = marketplaceStore.getInvoices().find((i) => i.orderId === params.id);
    if (!invByOrder) {
      notFound();
    }
    return (
      <div className="py-8 px-4">
        <InvoiceView invoice={invByOrder} backHref="/retailer/orders" />
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <InvoiceView invoice={invoice} backHref="/retailer/orders" />
    </div>
  );
}
