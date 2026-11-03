import { NextResponse } from "next/server";
import marketplaceStore from "@/lib/db/store";
import { getServerSession } from "@/lib/auth/session";
import { productSchema } from "@/lib/validations/product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category") || undefined;
  const brandSlug = searchParams.get("brand") || undefined;
  const distributorId = searchParams.get("distributorId") || undefined;
  const search = searchParams.get("search") || undefined;
  const featured = searchParams.get("featured") === "true";

  const products = marketplaceStore.getProducts({
    categorySlug,
    brandSlug,
    distributorId,
    search,
    featuredOnly: featured,
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || (session.role !== "DISTRIBUTOR" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Only distributors and admins can add products" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation error", errors: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;
    const distributorId = session.role === "DISTRIBUTOR" ? session.distributorId || "dist_1" : body.distributorId || "dist_1";
    const dist = marketplaceStore.getDistributorById(distributorId);
    const category = marketplaceStore.getCategories().find((c) => c.id === data.categoryId);
    const brand = marketplaceStore.getBrands().find((b) => b.id === data.brandId);

    const categoryName = data.customCategory || category?.name || "General FMCG";
    const brandName = data.customBrand || brand?.name || data.companyName || "Authorized Agency";
    const companyName = data.companyName || (brand?.name ? `${brand.name} Agency` : "Principal FMCG");

    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Math.floor(100 + Math.random() * 900)}`;

    const customTiers = body.tierPricing && Array.isArray(body.tierPricing) && body.tierPricing.length > 0
      ? body.tierPricing
      : [
          { minQty: data.minOrderQty, maxQty: data.minOrderQty * 3, pricePerCarton: data.wholesalePrice },
          { minQty: data.minOrderQty * 3 + 1, pricePerCarton: Math.round(data.wholesalePrice * 0.96) },
        ];

    const newProduct = marketplaceStore.createProduct({
      id: `prod_${Date.now()}`,
      distributorId,
      distributorName: dist?.companyName || "Himalayan FMCG Distributors Pvt. Ltd.",
      companyName,
      categoryId: data.categoryId || "cat_custom",
      categoryName,
      brandId: data.brandId || "b_custom",
      brandName,
      title: data.title,
      slug,
      sku: data.sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
      description: data.description,
      unitType: data.unitType as any,
      packSize: data.packSize,
      unitsPerCarton: data.unitsPerCarton,
      mrp: data.mrp || (data.unitsPerCarton > 0 ? Math.round(data.cartonMrp / data.unitsPerCarton) : data.cartonMrp),
      cartonMrp: data.cartonMrp,
      wholesalePrice: data.wholesalePrice,
      minOrderQty: data.minOrderQty,
      stockQuantity: data.stockQuantity,
      isAvailable: true,
      isFeatured: data.isFeatured,
      isApproved: true,
      barcode: data.barcode || "",
      images: [data.imageUrl],
      tierPricing: customTiers,
      hasFreeScheme: data.hasFreeScheme,
      freeSchemeMinQty: data.freeSchemeMinQty,
      freeItemName: data.freeItemName,
      freeItemQty: data.freeItemQty,
      freeSchemeType: data.freeSchemeType,
      freeProductId: data.freeProductId,
      freeItemSku: data.freeItemSku,
      hasUnsellingBonus: data.hasUnsellingBonus,
      unsellingItemName: data.unsellingItemName,
      unsellingItemMinQty: data.unsellingItemMinQty,
      unsellingItemQty: data.unsellingItemQty,
      unsellingItemTag: data.unsellingItemTag,
      cashDiscountPercent: data.cashDiscountPercent,
      promotionalGift: data.promotionalGift,
      festivalTag: data.festivalTag,
      taxCategory: data.taxCategory,
      hsnCode: data.hsnCode,
      shelfLife: data.shelfLife,
      creditTerms: data.creditTerms,
      returnPolicy: data.returnPolicy,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
