import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Product title must be at least 3 characters"),
  categoryId: z.string().optional(),
  customCategory: z.string().optional(),
  brandId: z.string().optional(),
  companyName: z.string().optional(), // Principal company (e.g. Unilever Nepal, Dabur Nepal)
  customBrand: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().default("Distributor wholesale packaged goods with standard manufacturer warranty."),
  unitType: z.enum(["PIECE", "PACK", "CARTON", "BOX", "BAG", "BOTTLE", "CAN"]).default("CARTON"),
  packSize: z.string().default("Standard Carton Pack"),
  unitsPerCarton: z.coerce.number().min(1, "Must contain at least 1 unit").default(24),
  mrp: z.coerce.number().optional(),
  cartonMrp: z.coerce.number().min(1, "Carton MRP is required"),
  wholesalePrice: z.coerce.number().min(1, "Wholesale carton price is required"),
  minOrderQty: z.coerce.number().min(1, "Minimum order quantity in cartons"),
  stockQuantity: z.coerce.number().min(0, "Stock quantity cannot be negative"),
  imageUrl: z.string().min(5, "Product image is required (upload from device or URL)"),
  isFeatured: z.boolean().default(false),
  barcode: z.string().optional(),

  // Real-Market Offers & Discount Schemes
  hasFreeScheme: z.boolean().default(false),
  freeSchemeMinQty: z.coerce.number().optional(),
  freeItemName: z.string().optional(),
  freeItemQty: z.coerce.number().optional(),
  freeSchemeType: z.enum(["SAME_PRODUCT", "ANOTHER_PRODUCT", "UNSELLING_ITEM"]).default("SAME_PRODUCT"),
  freeProductId: z.string().optional(),
  freeItemSku: z.string().optional(),
  hasUnsellingBonus: z.boolean().default(false),
  unsellingItemName: z.string().optional(),
  unsellingItemMinQty: z.coerce.number().optional(),
  unsellingItemQty: z.coerce.number().optional(),
  unsellingItemTag: z.string().optional(),
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

