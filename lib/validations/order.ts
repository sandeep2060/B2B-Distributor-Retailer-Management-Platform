import { z } from "zod";

export const checkoutSchema = z.object({
  recipientName: z.string().min(2, "Contact person name is required"),
  phone: z.string().min(10, "Valid 10-digit mobile number required"),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  municipality: z.string().min(1, "Municipality is required"),
  ward: z.string().min(1, "Ward number is required"),
  streetAddress: z.string().min(3, "Detailed shop/delivery street address"),
  landmark: z.string().optional(),
  panVatNumber: z.string().optional(),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "ESEWA", "KHALTI", "FONEPAY", "BANK_TRANSFER"]).default("CASH_ON_DELIVERY"),
  specialInstructions: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
