import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Product title must be at least 3 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  brandId: z.string().min(1, "Please select a brand"),
  sku: z.string().min(2, "SKU is required"),
  description: z.string().min(10, "Please provide a detailed product description"),
  unitType: z.enum(["PIECE", "PACK", "CARTON", "BOX", "BAG", "BOTTLE", "CAN"]).default("CARTON"),
  packSize: z.string().min(1, "Pack size specification (e.g., 24 Pcs x 250ml)"),
  unitsPerCarton: z.coerce.number().min(1, "Must contain at least 1 unit"),
  mrp: z.coerce.number().min(1, "Unit MRP is required"),
  cartonMrp: z.coerce.number().min(1, "Carton MRP is required"),
  wholesalePrice: z.coerce.number().min(1, "Wholesale carton price is required"),
  minOrderQty: z.coerce.number().min(1, "Minimum order quantity in cartons"),
  stockQuantity: z.coerce.number().min(0, "Stock quantity cannot be negative"),
  imageUrl: z.string().url("Valid image URL required"),
  isFeatured: z.boolean().default(false),
  barcode: z.string().optional(),

  // Real-Market Offers & Discount Schemes
  hasFreeScheme: z.boolean().default(false),
  freeSchemeMinQty: z.coerce.number().optional(),
  freeItemName: z.string().optional(),
  freeItemQty: z.coerce.number().optional(),
  cashDiscountPercent: z.coerce.number().min(0).max(50).default(2.0),
  promotionalGift: z.string().optional(),
  festivalTag: z.string().optional(),
  taxCategory: z.enum(["TAXABLE_13", "VAT_EXEMPT"]).default("TAXABLE_13"),
  hsnCode: z.string().optional(),
  shelfLife: z.string().optional(),
  creditTerms: z.string().optional(),
  returnPolicy: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

