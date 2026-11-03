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

    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct = marketplaceStore.createProduct({
      id: `prod_${Date.now()}`,
      distributorId,
      distributorName: dist?.companyName || "Himalayan FMCG Distributors Pvt. Ltd.",
      categoryId: data.categoryId,
      categoryName: category?.name || "General FMCG",
      brandId: data.brandId,
      brandName: brand?.name || "Local Brand",
      title: data.title,
      slug,
      sku: data.sku,
      description: data.description,
      unitType: data.unitType as any,
      packSize: data.packSize,
      unitsPerCarton: data.unitsPerCarton,
      mrp: data.mrp,
      cartonMrp: data.cartonMrp,
      wholesalePrice: data.wholesalePrice,
      minOrderQty: data.minOrderQty,
      stockQuantity: data.stockQuantity,
      isAvailable: true,
      isFeatured: data.isFeatured,
      isApproved: true,
      barcode: data.barcode || "",
      images: [data.imageUrl],
      tierPricing: [
        { minQty: data.minOrderQty, maxQty: data.minOrderQty * 3, pricePerCarton: data.wholesalePrice },
        { minQty: data.minOrderQty * 3 + 1, pricePerCarton: Math.round(data.wholesalePrice * 0.96) },
      ],
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
