import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid business email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const retailerRegisterSchema = z.object({
  fullName: z.string().min(2, "Owner name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid 10-digit mobile number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  shopName: z.string().min(2, "Retail Shop name is required"),
  panVatNumber: z.string().optional(),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  municipality: z.string().min(1, "Municipality is required"),
  ward: z.string().min(1, "Ward number is required"),
  streetAddress: z.string().min(3, "Street address is required"),
  landmark: z.string().optional(),
  businessType: z.string().default("Grocery & Kirana"),
});

export const distributorRegisterSchema = z.object({
  fullName: z.string().min(2, "Owner/Director name is required"),
  email: z.string().email("Valid corporate email required"),
  phone: z.string().min(10, "Valid 10-digit mobile number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  companyName: z.string().min(3, "Registered Company name is required"),
  panVatNumber: z.string().min(9, "9-digit PAN/VAT number is required"),
  registrationNumber: z.string().optional(),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  municipality: z.string().min(1, "Municipality is required"),
  ward: z.string().min(1, "Ward number is required"),
  streetAddress: z.string().min(3, "Warehouse/Office address is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  contactPhone: z.string().min(10, "Contact phone is required"),
  bankName: z.string().min(2, "Bank name is required"),
  bankAccountName: z.string().min(2, "Bank account holder name is required"),
  bankAccountNumber: z.string().min(6, "Bank account number is required"),
  minOrderAmount: z.coerce.number().min(500, "Minimum wholesale order must be at least Rs. 500"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RetailerRegisterInput = z.infer<typeof retailerRegisterSchema>;
export type DistributorRegisterInput = z.infer<typeof distributorRegisterSchema>;
