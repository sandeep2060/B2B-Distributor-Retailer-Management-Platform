const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting B2B Deal database seeding...");

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("Password123!", salt);

  // 1. Create Super Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@b2bdeal.com.np" },
    update: {},
    create: {
      email: "admin@b2bdeal.com.np",
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      fullName: "B2B Deal Super Admin",
      phone: "9801234567",
    },
  });
  console.log("Super Admin seeded:", admin.email);

  // 2. Create Categories
  const categoriesData = [
    { name: "Beverages", slug: "beverages", description: "Juices, soft drinks, mineral water in wholesale cartons" },
    { name: "Snacks & Confectionery", slug: "snacks", description: "Instant noodles, biscuits, chocolates, wafers" },
    { name: "Grocery & Staples", slug: "grocery", description: "Rice, cooking oil, lentils, flour in bulk bags" },
    { name: "Personal Care", slug: "personal-care", description: "Bath soaps, shampoos, toothpastes, skincare" },
    { name: "Household & Cleaning", slug: "household", description: "Detergent powder, dishwash, cleaners" },
    { name: "Dairy & Bakery", slug: "dairy-bakery", description: "Pure cow ghee, butter, cheese, bakery bulk" },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });
  }
  console.log("Categories seeded");

  // 3. Create Brands
  const brandsData = [
    { name: "Wai Wai (CG Foods)", slug: "wai-wai" },
    { name: "Coca-Cola Nepal", slug: "coca-cola" },
    { name: "Dabur Nepal", slug: "dabur" },
    { name: "Unilever Nepal", slug: "unilever" },
    { name: "DDC (Dairy Dev Corp)", slug: "ddc" },
    { name: "Aarati Oil Mills", slug: "aarati" },
  ];

  for (const b of brandsData) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        name: b.name,
        slug: b.slug,
      },
    });
  }
  console.log("Brands seeded");

  console.log("B2B Deal database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
