export interface MockUser {
  id: string;
  email: string;
  passwordHash: string; // "Password123!"
  role: "SUPER_ADMIN" | "DISTRIBUTOR" | "RETAILER";
  status: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
  fullName: string;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface MockRetailerProfile {
  id: string;
  userId: string;
  shopName: string;
  panVatNumber: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  streetAddress: string;
  landmark: string;
  businessType: string;
  isVerified: boolean;
}

export interface MockDistributorProfile {
  id: string;
  userId: string;
  companyName: string;
  panVatNumber: string;
  registrationNumber: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  streetAddress: string;
  contactPerson: string;
  contactPhone: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  commissionRate: number; // e.g. 3.0 %
  isVerified: boolean;
  rating: number;
  minOrderAmount: number;
  deliveryZones: string[];
  logoUrl?: string;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  iconName: string;
  sortOrder: number;
  productCount?: number;
}

export interface MockBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
}

export interface MockDistributorCompany {
  id: string;
  distributorId: string;
  name: string; // e.g. "Unilever Nepal", "Dabur Nepal", "CG Foods"
  shortCode?: string; // e.g. "ULN"
  category?: string; // e.g. "Personal Care & Cleaning"
  agencyCode?: string; // e.g. "AGY-ULN-2026"
  contactPerson?: string;
  contactPhone?: string;
  logoUrl?: string;
  productCount?: number;
  isAuthorized: boolean;
  createdAt: string;
}

export interface MockProduct {
  id: string;
  distributorId: string;
  distributorName: string;
  companyName?: string; // Principal manufacturing company (e.g. "Unilever Nepal", "Dabur Nepal", "CG Foods")
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  unitType: "PIECE" | "PACK" | "CARTON" | "BOX" | "BAG" | "BOTTLE" | "CAN";
  packSize: string; // e.g. "30 Pcs x 75g"
  unitsPerCarton: number;
  mrp: number; // Single unit MRP in NPR
  cartonMrp: number;
  wholesalePrice: number; // Wholesale carton price in NPR
  minOrderQty: number; // Min cartons to order
  stockQuantity: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isApproved: boolean;
  barcode: string;
  images: string[];
  tierPricing: {
    minQty: number;
    maxQty?: number;
    pricePerCarton: number;
  }[];
  // Real-market wholesale schemes & offers
  hasFreeScheme?: boolean;
  freeSchemeMinQty?: number;
  freeItemName?: string;
  freeItemQty?: number;
  freeSchemeType?: "SAME_PRODUCT" | "ANOTHER_PRODUCT" | "UNSELLING_ITEM";
  freeProductId?: string;
  freeItemSku?: string;
  hasUnsellingBonus?: boolean;
  unsellingItemName?: string;
  unsellingItemMinQty?: number;
  unsellingItemQty?: number;
  unsellingItemTag?: string;
  cashDiscountPercent?: number; // Spot Cash / QR discount %
  promotionalGift?: string;
  festivalTag?: string;
  taxCategory?: "TAXABLE_13" | "VAT_EXEMPT";
  hsnCode?: string;
  batchNumber?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  shelfLife?: string;
  creditTerms?: string;
  returnPolicy?: string;
}

export interface MockCartItem {
  id: string;
  productId: string;
  quantity: number; // number of cartons/packs
  unitType: string;
  unitPrice: number;
  totalPrice: number;
}

export interface MockOrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productSku: string;
  companyName?: string; // Principal manufacturing company (e.g. Unilever, Dabur)
  unitType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isBonusItem?: boolean;
  freeSchemeNote?: string;
  spotDiscountPercent?: number;
  isVatExempt?: boolean;
  isCancelled?: boolean;
  cancelReason?: string;
  cancelledAt?: string;
  isInvoiced?: boolean;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  retailerId: string;
  retailerName: string;
  retailerShop: string;
  retailerPhone: string;
  distributorId: string;
  distributorName: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod: "CASH_ON_DELIVERY" | "ESEWA" | "KHALTI" | "FONEPAY" | "BANK_TRANSFER";
  subtotal: number;
  discountAmount: number;
  cashDiscountAmount?: number;
  freeItemsAwarded?: { title: string; quantity: number; unitType: string }[];
  taxCategoryBreakdown?: { taxable: number; vatExempt: number; vatAmount: number };
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netDistributorEarnings: number;
  deliveryAddress: {
    recipientName: string;
    phone: string;
    province: string;
    district: string;
    municipality: string;
    ward: string;
    streetAddress: string;
    landmark?: string;
  };
  deliveryPerson?: {
    name: string;
    phone: string;
    vehicleNo: string;
    assignedAt: string;
  };
  // Delivery Scheduling
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  // Invoicing and Confirmation Notice
  isInvoiced?: boolean;
  invoiceId?: string;
  invoiceNumber?: string;
  invoicedAt?: string;
  confirmationNotice?: {
    sentAt: string;
    message: string;
    recipientPhone: string;
  };
  dispatchedAt?: string;
  deliveredAt?: string;
  notes?: string;
  createdAt: string;
  items: MockOrderItem[];
}

export interface MockOffer {
  id: string;
  distributorId: string;
  title: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minCartonQty: number;
  minOrderAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface MockInvoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  distributorId: string;
  distributorName: string;
  distributorPan: string;
  distributorAddress: string;
  distributorPhone: string;
  retailerId: string;
  retailerShop: string;
  retailerName: string;
  retailerPan: string;
  retailerAddress: string;
  retailerPhone: string;
  taxableAmount: number;
  vatAmount: number; // 13%
  vatExemptAmount?: number;
  cashDiscountAmount?: number;
  freeItemsAwarded?: { title: string; quantity: number; unitType: string }[];
  grandTotal: number;
  status: "PAID" | "PENDING";
  createdAt: string;
  items: MockOrderItem[];
}

// Pre-hashed Bcrypt for "Password123!"
// Hash: "$2a$10$wN6Y9uF2m9fK9vIqVpYveOI9fM7w6.sW0GkR1rFj2r1/rY0aG0gW."
const DEFAULT_PASSWORD_HASH = "$2a$10$wN6Y9uF2m9fK9vIqVpYveOI9fM7w6.sW0GkR1rFj2r1/rY0aG0gW.";

export const INITIAL_USERS: MockUser[] = [
  {
    id: "usr_admin_1",
    email: "admin@b2bdeal.com.np",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    fullName: "B2B Deal Super Admin",
    phone: "9801234567",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr_dist_1",
    email: "distributor@himalayan.com.np",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "DISTRIBUTOR",
    status: "ACTIVE",
    fullName: "Rajesh Shrestha",
    phone: "9851023456",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "usr_dist_2",
    email: "everest@beverages.com.np",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "DISTRIBUTOR",
    status: "ACTIVE",
    fullName: "Binod Chaudhary",
    phone: "9851098765",
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "usr_dist_3",
    email: "annapurna@dairy.com.np",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "DISTRIBUTOR",
    status: "ACTIVE",
    fullName: "Prakash Adhikari",
    phone: "9846011223",
    createdAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "usr_ret_1",
    email: "retailer@kalankimart.com.np",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "RETAILER",
    status: "ACTIVE",
    fullName: "Suman Thapa",
    phone: "9841556677",
    createdAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "usr_ret_2",
    email: "pokharamart@gmail.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "RETAILER",
    status: "ACTIVE",
    fullName: "Deepak Gurung",
    phone: "9846123456",
    createdAt: "2026-02-05T00:00:00Z",
  },
];

export const INITIAL_DISTRIBUTORS: MockDistributorProfile[] = [
  {
    id: "dist_1",
    userId: "usr_dist_1",
    companyName: "Himalayan FMCG Distributors Pvt. Ltd.",
    panVatNumber: "602348912",
    registrationNumber: "REG-23849/078",
    province: "Bagmati Province",
    district: "Kathmandu",
    municipality: "Kathmandu Metropolitan City",
    ward: "14",
    streetAddress: "Kuleshwor Wholesale Hub, Kathmandu",
    contactPerson: "Rajesh Shrestha",
    contactPhone: "9851023456",
    bankName: "Nabil Bank Ltd.",
    bankAccountName: "Himalayan FMCG Distributors Pvt. Ltd.",
    bankAccountNumber: "01001017500123",
    commissionRate: 3.0,
    isVerified: true,
    rating: 4.9,
    minOrderAmount: 2500,
    deliveryZones: ["Kathmandu Valley", "Chitwan", "Kavre"],
    logoUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "dist_2",
    userId: "usr_dist_2",
    companyName: "Everest Beverages & Snacks Wholesalers",
    panVatNumber: "609812345",
    registrationNumber: "REG-99120/079",
    province: "Bagmati Province",
    district: "Lalitpur",
    municipality: "Lalitpur Metropolitan City",
    ward: "4",
    streetAddress: "Lagankhel Industrial Estate, Lalitpur",
    contactPerson: "Binod Chaudhary",
    contactPhone: "9851098765",
    bankName: "Global IME Bank",
    bankAccountName: "Everest Beverages Wholesalers",
    bankAccountNumber: "02301010029341",
    commissionRate: 3.5,
    isVerified: true,
    rating: 4.8,
    minOrderAmount: 3000,
    deliveryZones: ["Kathmandu", "Lalitpur", "Bhaktapur", "Hetauda"],
    logoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "dist_3",
    userId: "usr_dist_3",
    companyName: "Annapurna Dairy & Bakery Supply",
    panVatNumber: "601122334",
    registrationNumber: "REG-44332/077",
    province: "Gandaki Province",
    district: "Kaski",
    municipality: "Pokhara Metropolitan City",
    ward: "8",
    streetAddress: "Srijana Chowk, Pokhara",
    contactPerson: "Prakash Adhikari",
    contactPhone: "9846011223",
    bankName: "NIC Asia Bank",
    bankAccountName: "Annapurna Dairy & Bakery",
    bankAccountNumber: "05501002394821",
    commissionRate: 2.8,
    isVerified: true,
    rating: 4.7,
    minOrderAmount: 2000,
    deliveryZones: ["Pokhara", "Tanahun", "Syangja"],
    logoUrl: "https://images.unsplash.com/photo-1528795259021-d8c86e14354c?w=200&auto=format&fit=crop&q=80",
  },
];

export const INITIAL_RETAILERS: MockRetailerProfile[] = [
  {
    id: "ret_1",
    userId: "usr_ret_1",
    shopName: "Kalanki Kirana & Department Store",
    panVatNumber: "304561289",
    province: "Bagmati Province",
    district: "Kathmandu",
    municipality: "Kathmandu Metropolitan City",
    ward: "14",
    streetAddress: "Kalanki Chowk (Near Ring Road Bridge)",
    landmark: "Opposite to NIC Asia Bank Branch",
    businessType: "Grocery & General Store",
    isVerified: true,
  },
  {
    id: "ret_2",
    userId: "usr_ret_2",
    shopName: "New Pokhara Super Mart",
    panVatNumber: "305678912",
    province: "Gandaki Province",
    district: "Kaski",
    municipality: "Pokhara Metropolitan City",
    ward: "6",
    streetAddress: "Lakeside Center, Pokhara",
    landmark: "Near Barahi Temple Chowk",
    businessType: "Mini Supermarket",
    isVerified: true,
  },
];

export const INITIAL_CATEGORIES: MockCategory[] = [
  {
    id: "cat_bev",
    name: "Beverages",
    slug: "beverages",
    description: "Soft drinks, mineral water, juices, tea, coffee, energy drinks in wholesale cartons.",
    imageUrl: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&auto=format&fit=crop&q=80",
    iconName: "Wine",
    sortOrder: 1,
  },
  {
    id: "cat_snack",
    name: "Snacks & Confectionery",
    slug: "snacks",
    description: "Biscuits, instant noodles, potato chips, chocolates, and cookies.",
    imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500&auto=format&fit=crop&q=80",
    iconName: "Cookie",
    sortOrder: 2,
  },
  {
    id: "cat_groc",
    name: "Grocery & Staples",
    slug: "grocery",
    description: "Basmati rice, cooking oil, lentils, flour, sugar, and salt in bulk sacks.",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80",
    iconName: "ShoppingBag",
    sortOrder: 3,
  },
  {
    id: "cat_care",
    name: "Personal Care",
    slug: "personal-care",
    description: "Bath soaps, shampoos, toothpastes, skincare, and hair oils.",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
    iconName: "Sparkles",
    sortOrder: 4,
  },
  {
    id: "cat_house",
    name: "Household & Cleaning",
    slug: "household",
    description: "Detergent powder, dishwashing bars, floor cleaners, and disinfectants.",
    imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80",
    iconName: "Home",
    sortOrder: 5,
  },
  {
    id: "cat_dairy",
    name: "Dairy & Bakery",
    slug: "dairy-bakery",
    description: "Packaged ghee, butter, cheese, sliced breads, and rusks.",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80",
    iconName: "Milk",
    sortOrder: 6,
  },
];

export const INITIAL_BRANDS: MockBrand[] = [
  { id: "b_waiwai", name: "Wai Wai (CG Foods)", slug: "wai-wai", logoUrl: "" },
  { id: "b_coke", name: "Coca-Cola Nepal", slug: "coca-cola", logoUrl: "" },
  { id: "b_dabur", name: "Dabur Nepal", slug: "dabur", logoUrl: "" },
  { id: "b_unilever", name: "Unilever Nepal", slug: "unilever", logoUrl: "" },
  { id: "b_ddc", name: "DDC (Dairy Dev Corp)", slug: "ddc", logoUrl: "" },
  { id: "b_parle", name: "Parle Nepal", slug: "parle", logoUrl: "" },
  { id: "b_aarati", name: "Aarati Oil Mills", slug: "aarati", logoUrl: "" },
];

export const INITIAL_DISTRIBUTOR_COMPANIES: MockDistributorCompany[] = [
  {
    id: "comp_1",
    distributorId: "dist_1",
    name: "Unilever Nepal Ltd.",
    shortCode: "UNILEVER",
    category: "Personal Care, Soaps & Hygiene",
    agencyCode: "AGY-ULN-8091",
    contactPerson: "Sunil Shakya",
    contactPhone: "9851088881",
    logoUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200",
    isAuthorized: true,
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "comp_2",
    distributorId: "dist_1",
    name: "Dabur Nepal Pvt. Ltd.",
    shortCode: "DABUR",
    category: "Fruit Juices, Health & Ayurvedic",
    agencyCode: "AGY-DBR-4421",
    contactPerson: "Bikash Rathi",
    contactPhone: "9851088882",
    logoUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200",
    isAuthorized: true,
    createdAt: "2026-01-16T00:00:00Z",
  },
  {
    id: "comp_3",
    distributorId: "dist_1",
    name: "CG Foods Nepal (Wai Wai)",
    shortCode: "CG_FOODS",
    category: "Instant Noodles & Confectionery",
    agencyCode: "AGY-CGF-1092",
    contactPerson: "Mahesh Thapa",
    contactPhone: "9851088883",
    logoUrl: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=200",
    isAuthorized: true,
    createdAt: "2026-01-17T00:00:00Z",
  },
  {
    id: "comp_4",
    distributorId: "dist_1",
    name: "Coca-Cola Beverages Nepal",
    shortCode: "COCA_COLA",
    category: "Carbonated Beverages & Packaged Water",
    agencyCode: "AGY-COKE-9901",
    contactPerson: "Prashant Giri",
    contactPhone: "9851088884",
    logoUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200",
    isAuthorized: true,
    createdAt: "2026-01-18T00:00:00Z",
  },
  {
    id: "comp_5",
    distributorId: "dist_1",
    name: "Parle Products Nepal",
    shortCode: "PARLE",
    category: "Biscuits, Cookies & Confectionery",
    agencyCode: "AGY-PRL-3341",
    contactPerson: "Anil Kedia",
    contactPhone: "9851088885",
    logoUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200",
    isAuthorized: true,
    createdAt: "2026-01-19T00:00:00Z",
  },
];

export const INITIAL_PRODUCTS: MockProduct[] = [
  {
    id: "prod_1",
    distributorId: "dist_1",
    distributorName: "Himalayan FMCG Distributors Pvt. Ltd.",
    categoryId: "cat_snack",
    categoryName: "Snacks & Confectionery",
    brandId: "b_waiwai",
    brandName: "Wai Wai (CG Foods)",
    title: "Wai Wai Quick Chicken Instant Noodles (Carton of 30)",
    slug: "wai-wai-chicken-instant-noodles-carton-30",
    sku: "CG-WW-CHK-30",
    description: "Nepal's favorite instant noodle with authentic taste and roasted chicken flavor. Ready to eat dry or cooked with soup. Standard wholesale packaging of 30 packets per carton.",
    unitType: "CARTON",
    packSize: "30 Pcs x 75g",
    unitsPerCarton: 30,
    mrp: 25,
    cartonMrp: 750,
    wholesalePrice: 660, // Rs. 22/packet
    minOrderQty: 2,
    stockQuantity: 450,
    isAvailable: true,
    isFeatured: true,
    isApproved: true,
    barcode: "890123000101",
    images: [
      "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    ],
    tierPricing: [
      { minQty: 2, maxQty: 9, pricePerCarton: 660 },
      { minQty: 10, maxQty: 29, pricePerCarton: 645 },
      { minQty: 30, pricePerCarton: 630 },
    ],
    hasFreeScheme: true,
    freeSchemeType: "SAME_PRODUCT",
    freeSchemeMinQty: 5,
    freeItemName: "Carton of Wai Wai Quick Chicken (30 Pcs)",
    freeItemQty: 1,
    cashDiscountPercent: 2.0,
    promotionalGift: "Free CG Branded Apron & Metal Display Board on 15+ Cartons",
    festivalTag: "Buy 5 Get 1 Free Mega Deal",
    taxCategory: "TAXABLE_13",
    hsnCode: "1902.30.00",
    batchNumber: "CG-WW-2026/10A",
    shelfLife: "9 Months from Mfg Date",
    creditTerms: "Cash / Fonepay QR (2% CD) or 7-Day Credit for Registered Stores",
    returnPolicy: "48-Hour Damage Claim & Sealed Carton Replacement Guarantee",
  },
  {
    id: "prod_2",
    distributorId: "dist_2",
    distributorName: "Everest Beverages & Snacks Wholesalers",
    categoryId: "cat_bev",
    categoryName: "Beverages",
    brandId: "b_coke",
    brandName: "Coca-Cola Nepal",
    title: "Coca-Cola Pet Bottle 250ml (Carton of 24)",
    slug: "coca-cola-pet-bottle-250ml-carton-24",
    sku: "CC-250-PET-24",
    description: "Original Taste Coca-Cola in 250ml single-serve PET bottles. Fast-selling retail beverage for corner stores, schools, and restaurants. Wholesale pack containing 24 chilled bottles.",
    unitType: "CARTON",
    packSize: "24 Bottles x 250ml",
    unitsPerCarton: 24,
    mrp: 45,
    cartonMrp: 1080,
    wholesalePrice: 960, // Rs. 40/bottle
    minOrderQty: 2,
    stockQuantity: 320,
    isAvailable: true,
    isFeatured: true,
    isApproved: true,
    barcode: "890123000102",
    images: [
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&auto=format&fit=crop&q=80",
    ],
    tierPricing: [
      { minQty: 2, maxQty: 4, pricePerCarton: 960 },
      { minQty: 5, maxQty: 19, pricePerCarton: 935 },
      { minQty: 20, pricePerCarton: 910 },
    ],
    hasFreeScheme: true,
    freeSchemeType: "ANOTHER_PRODUCT",
    freeSchemeMinQty: 1,
    freeProductId: "prod_3",
    freeItemSku: "DB-REAL-MF-12",
    freeItemName: "Real Mixed Fruit Juice 1 Liter (Carton of 12)",
    freeItemQty: 1,
    cashDiscountPercent: 2.5,
    promotionalGift: "Free Coca-Cola Official Wall Clock on 10+ Cartons",
    festivalTag: "Buy 1 Get Another Free Deal",
    taxCategory: "TAXABLE_13",
    hsnCode: "2202.10.00",
    batchNumber: "CC-LAL-2026/09",
    shelfLife: "6 Months from Mfg",
    creditTerms: "Cash on Delivery or Instant Fonepay QR",
    returnPolicy: "Transit Leakage Replacement on Delivery Inspection",
  },
  {
    id: "prod_3",
    distributorId: "dist_2",
    distributorName: "Everest Beverages & Snacks Wholesalers",
    categoryId: "cat_bev",
    categoryName: "Beverages",
    brandId: "b_dabur",
    brandName: "Dabur Nepal",
    title: "Real Mixed Fruit Juice 1 Liter (Carton of 12)",
    slug: "real-mixed-fruit-juice-1l-carton-12",
    sku: "DB-REAL-MF-12",
    description: "Premium fruit juice made from real fruit pulp. Top retail seller for family gatherings and festive seasons. Wholesale master carton of 12 Tetra Pak 1L bricks.",
    unitType: "CARTON",
    packSize: "12 Packs x 1000ml",
    unitsPerCarton: 12,
    mrp: 290,
    cartonMrp: 3480,
    wholesalePrice: 3060, // Rs. 255/pack
    minOrderQty: 1,
    stockQuantity: 180,
    isAvailable: true,
    isFeatured: true,
    isApproved: true,
    barcode: "890123000103",
    images: [
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80",
    ],
    tierPricing: [
      { minQty: 1, maxQty: 4, pricePerCarton: 3060 },
      { minQty: 5, maxQty: 14, pricePerCarton: 2980 },
      { minQty: 15, pricePerCarton: 2900 },
    ],
    hasFreeScheme: true,
    freeSchemeType: "UNSELLING_ITEM",
    freeSchemeMinQty: 2,
    freeItemName: "Unsold Strawberry Glucose Biscuits (Carton of 24) [Clearance Stock]",
    freeItemQty: 1,
    unsellingItemTag: "Slow-Moving Clearance Stock",
    hasUnsellingBonus: true,
    unsellingItemName: "Clearance Promo Apron & Display Board",
    unsellingItemMinQty: 3,
    unsellingItemQty: 1,
    cashDiscountPercent: 3.0,
    promotionalGift: "Free Dabur Countertop Dispenser on 12+ Cartons",
    festivalTag: "Clearance Dead-Stock Freebie Scheme",
    taxCategory: "TAXABLE_13",
    hsnCode: "2009.90.00",
    shelfLife: "12 Months from Mfg",
    creditTerms: "Cash / Fonepay QR or 15-Day Authorized Credit",
    returnPolicy: "48-Hour Damage Claim & Replacement",
  },
  {
    id: "prod_4",
    distributorId: "dist_1",
    distributorName: "Himalayan FMCG Distributors Pvt. Ltd.",
    categoryId: "cat_groc",
    categoryName: "Grocery & Staples",
    brandId: "b_aarati",
    brandName: "Aarati Oil Mills",
    title: "Aarati Pure Mustard Oil Pouch 1L (Carton of 10)",
    slug: "aarati-pure-mustard-oil-pouch-1l-carton-10",
    sku: "AOM-MUST-10",
    description: "Cold-pressed pungent kacchi ghani mustard oil for authentic Nepalese cooking and deep frying. High shelf turnover item in every grocery store.",
    unitType: "CARTON",
    packSize: "10 Pouches x 1L",
    unitsPerCarton: 10,
    mrp: 275,
    cartonMrp: 2750,
    wholesalePrice: 2420,
    minOrderQty: 2,
    stockQuantity: 210,
    isAvailable: true,
    isFeatured: true,
    isApproved: true,
    barcode: "890123000104",
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
    ],
    tierPricing: [
      { minQty: 2, maxQty: 4, pricePerCarton: 2420 },
      { minQty: 5, maxQty: 9, pricePerCarton: 2370 },
      { minQty: 10, pricePerCarton: 2320 },
    ],
    hasFreeScheme: false,
    cashDiscountPercent: 1.5,
    promotionalGift: "Free 1L Oil Dispenser Jug on 5+ Cartons",
    festivalTag: "Daily Kitchen Staple",
    taxCategory: "VAT_EXEMPT",
    hsnCode: "1514.91.00",
    shelfLife: "12 Months",
    creditTerms: "Cash on Delivery / Spot QR (1.5% Off)",
    returnPolicy: "48-Hour Leakage Transit Warranty",
  },
  {
    id: "prod_5",
    distributorId: "dist_1",
    distributorName: "Himalayan FMCG Distributors Pvt. Ltd.",
    categoryId: "cat_care",
    categoryName: "Personal Care",
    brandId: "b_unilever",
    brandName: "Unilever Nepal",
    title: "Lifebuoy Total Soap Bar 125g (Carton of 48)",
    slug: "lifebuoy-total-soap-bar-125g-carton-48",
    sku: "UL-LB-125-48",
    description: "Antibacterial germ protection soap trusted across Nepal. Bulk carton of 48 individual bars with barcode packaging.",
    unitType: "CARTON",
    packSize: "48 Bars x 125g",
    unitsPerCarton: 48,
    mrp: 65,
    cartonMrp: 3120,
    wholesalePrice: 2680,
    minOrderQty: 1,
    stockQuantity: 150,
    isAvailable: true,
    isFeatured: false,
    isApproved: true,
    barcode: "890123000105",
    images: [
      "https://images.unsplash.com/photo-1607006314592-8ca0665fec8e?w=600&auto=format&fit=crop&q=80",
    ],
    tierPricing: [
      { minQty: 1, maxQty: 4, pricePerCarton: 2680 },
      { minQty: 5, pricePerCarton: 2590 },
    ],
    hasFreeScheme: true,
    freeSchemeMinQty: 4,
    freeItemName: "Lifebuoy Handwash 190ml Refill (Pack of 3)",
    freeItemQty: 1,
    cashDiscountPercent: 2.0,
    promotionalGift: "Free Countertop Metal Soap Display Stand on 5+ Cartons",
    festivalTag: "Hygiene Bulk Deal",
    taxCategory: "TAXABLE_13",
    hsnCode: "3401.11.00",
    shelfLife: "24 Months",
    creditTerms: "Spot Cash / QR or 7-Day Credit",
    returnPolicy: "Sealed Carton Transit Warranty",
  },
  {
    id: "prod_6",
    distributorId: "dist_3",
    distributorName: "Annapurna Dairy & Bakery Supply",
    categoryId: "cat_dairy",
    categoryName: "Dairy & Bakery",
    brandId: "b_ddc",
    brandName: "DDC (Dairy Dev Corp)",
    title: "DDC Pure Cow Ghee 1kg Tin (Carton of 12)",
    slug: "ddc-pure-cow-ghee-1kg-tin-carton-12",
    sku: "DDC-GHEE-12",
    description: "Official DDC pure clarified cow butter ghee. Traditional aroma and quality test passed, high festive and daily retail demand.",
    unitType: "CARTON",
    packSize: "12 Tins x 1kg",
    unitsPerCarton: 12,
    mrp: 1350,
    cartonMrp: 16200,
    wholesalePrice: 14700,
    minOrderQty: 1,
    stockQuantity: 85,
    isAvailable: true,
    isFeatured: true,
    isApproved: true,
    barcode: "890123000106",
    images: [
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80",
    ],
    tierPricing: [
      { minQty: 1, maxQty: 2, pricePerCarton: 14700 },
      { minQty: 3, pricePerCarton: 14400 },
    ],
    hasFreeScheme: true,
    freeSchemeMinQty: 2,
    freeItemName: "DDC Pure Cow Butter 200g (Pack of 2)",
    freeItemQty: 1,
    cashDiscountPercent: 2.0,
    promotionalGift: "Free DDC Official Quality Certificate & Brass Diya for Store",
    festivalTag: "Tihar Bhai Tika Special Ghee Scheme",
    taxCategory: "VAT_EXEMPT",
    hsnCode: "0405.90.00",
    shelfLife: "18 Months from Mfg",
    creditTerms: "Cash on Delivery / Direct Bank Transfer",
    returnPolicy: "Factory Sealed Seal Verification",
  },
  {
    id: "prod_7",
    distributorId: "dist_1",
    distributorName: "Himalayan FMCG Distributors Pvt. Ltd.",
    categoryId: "cat_snack",
    categoryName: "Snacks & Confectionery",
    brandId: "b_parle",
    brandName: "Parle Nepal",
    title: "Parle-G Glucose Biscuits Master Carton (Carton of 60)",
    slug: "parle-g-glucose-biscuits-carton-60",
    sku: "PRL-G-60",
    description: "World's bestselling glucose biscuit. High velocity tea-time staple for every tea stall and retail shop in Nepal.",
    unitType: "CARTON",
    packSize: "60 Pcs x 80g",
    unitsPerCarton: 60,
    mrp: 20,
    cartonMrp: 1200,
    wholesalePrice: 1040,
    minOrderQty: 2,
    stockQuantity: 400,
    isAvailable: true,
    isFeatured: false,
    isApproved: true,
    barcode: "890123000107",
    images: [
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
    ],
    tierPricing: [
      { minQty: 2, maxQty: 9, pricePerCarton: 1040 },
      { minQty: 10, pricePerCarton: 990 },
    ],
    hasFreeScheme: true,
    freeSchemeMinQty: 10,
    freeItemName: "Carton of Parle-G (60 Pcs)",
    freeItemQty: 1,
    cashDiscountPercent: 2.0,
    promotionalGift: "Free Parle-G Tea Stall Acrylic Display Jar Set",
    festivalTag: "Tea Stall Bulk Scheme",
    taxCategory: "TAXABLE_13",
    hsnCode: "1905.31.00",
    shelfLife: "9 Months from Mfg",
    creditTerms: "Cash / Fonepay or 7-Day Credit",
    returnPolicy: "48-Hour Sealed Damage Claim",
  },
  {
    id: "prod_8",
    distributorId: "dist_1",
    distributorName: "Himalayan FMCG Distributors Pvt. Ltd.",
    categoryId: "cat_house",
    categoryName: "Household & Cleaning",
    brandId: "b_unilever",
    brandName: "Unilever Nepal",
    title: "Surf Excel Quick Wash Detergent 1kg (Carton of 18)",
    slug: "surf-excel-quick-wash-1kg-carton-18",
    sku: "UL-SURF-18",
    description: "Tough stain removal in 1 wash. Fast-moving household FMCG with guaranteed retail customer loyalty.",
    unitType: "CARTON",
    packSize: "18 Packs x 1kg",
    unitsPerCarton: 18,
    mrp: 260,
    cartonMrp: 4680,
    wholesalePrice: 4100,
    minOrderQty: 1,
    stockQuantity: 110,
    isAvailable: true,
    isFeatured: true,
    isApproved: true,
    barcode: "890123000108",
    images: [
      "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80",
    ],
    tierPricing: [
      { minQty: 1, maxQty: 3, pricePerCarton: 4100 },
      { minQty: 4, pricePerCarton: 3990 },
    ],
    hasFreeScheme: true,
    freeSchemeMinQty: 3,
    freeItemName: "Surf Excel Detergent Bar (Pack of 6)",
    freeItemQty: 1,
    cashDiscountPercent: 2.5,
    promotionalGift: "Free Heavy Duty 16L Plastic Washing Bucket on 4+ Cartons",
    festivalTag: "Household Mega Deal",
    taxCategory: "TAXABLE_13",
    hsnCode: "3402.20.00",
    shelfLife: "24 Months",
    creditTerms: "Spot Cash (2.5% Off) or 15-Day Authorized Store Credit",
    returnPolicy: "Damage Claim on Dispatch",
  },
];

export const INITIAL_ORDERS: MockOrder[] = [
  {
    id: "ord_1001",
    orderNumber: "B2B-2026-00891",
    retailerId: "usr_ret_1",
    retailerName: "Suman Thapa",
    retailerShop: "Kalanki Kirana & Department Store",
    retailerPhone: "9841556677",
    distributorId: "dist_1",
    distributorName: "Himalayan FMCG Distributors Pvt. Ltd.",
    status: "DELIVERED",
    paymentStatus: "PAID",
    paymentMethod: "CASH_ON_DELIVERY",
    subtotal: 7860,
    discountAmount: 200,
    deliveryFee: 0,
    taxAmount: 995.8,
    totalAmount: 8655.8,
    commissionRate: 3.0,
    commissionAmount: 235.8,
    netDistributorEarnings: 7424.2,
    deliveryAddress: {
      recipientName: "Suman Thapa",
      phone: "9841556677",
      province: "Bagmati Province",
      district: "Kathmandu",
      municipality: "Kathmandu Metropolitan City",
      ward: "14",
      streetAddress: "Kalanki Chowk (Near Ring Road Bridge)",
      landmark: "Opposite to NIC Asia Bank Branch",
    },
    deliveryPerson: {
      name: "Ramesh Bogati",
      phone: "9841009988",
      vehicleNo: "Ba 2 Kha 4490",
      assignedAt: "2026-10-28T09:00:00Z",
    },
    notes: "Please deliver before 11:00 AM before store rush hours.",
    createdAt: "2026-10-27T14:30:00Z",
    items: [
      {
        id: "item_1",
        productId: "prod_1",
        productTitle: "Wai Wai Quick Chicken Instant Noodles (Carton of 30)",
        productSku: "CG-WW-CHK-30",
        unitType: "CARTON",
        quantity: 5,
        unitPrice: 660,
        totalPrice: 3300,
      },
      {
        id: "item_2",
        productId: "prod_4",
        productTitle: "Aarati Pure Mustard Oil Pouch 1L (Carton of 10)",
        productSku: "AOM-MUST-10",
        unitType: "CARTON",
        quantity: 2,
        unitPrice: 2420,
        totalPrice: 4840,
      },
    ],
  },
  {
    id: "ord_1002",
    orderNumber: "B2B-2026-00902",
    retailerId: "usr_ret_1",
    retailerName: "Suman Thapa",
    retailerShop: "Kalanki Kirana & Department Store",
    retailerPhone: "9841556677",
    distributorId: "dist_2",
    distributorName: "Everest Beverages & Snacks Wholesalers",
    status: "DISPATCHED",
    paymentStatus: "PENDING",
    paymentMethod: "CASH_ON_DELIVERY",
    subtotal: 6000,
    discountAmount: 150,
    deliveryFee: 100,
    taxAmount: 760.5,
    totalAmount: 6710.5,
    commissionRate: 3.5,
    commissionAmount: 204.75,
    netDistributorEarnings: 5645.25,
    deliveryAddress: {
      recipientName: "Suman Thapa",
      phone: "9841556677",
      province: "Bagmati Province",
      district: "Kathmandu",
      municipality: "Kathmandu Metropolitan City",
      ward: "14",
      streetAddress: "Kalanki Chowk",
      landmark: "Opposite to NIC Asia Bank Branch",
    },
    deliveryPerson: {
      name: "Sunil Shrestha",
      phone: "9860114422",
      vehicleNo: "Ba 3 Cha 9012",
      assignedAt: "2026-11-02T10:00:00Z",
    },
    notes: "Handle juice cartons gently to prevent leakage.",
    createdAt: "2026-11-01T11:15:00Z",
    items: [
      {
        id: "item_3",
        productId: "prod_2",
        productTitle: "Coca-Cola Pet Bottle 250ml (Carton of 24)",
        productSku: "CC-250-PET-24",
        unitType: "CARTON",
        quantity: 3,
        unitPrice: 960,
        totalPrice: 2880,
      },
      {
        id: "item_4",
        productId: "prod_3",
        productTitle: "Real Mixed Fruit Juice 1 Liter (Carton of 12)",
        productSku: "DB-REAL-MF-12",
        unitType: "CARTON",
        quantity: 1,
        unitPrice: 3060,
        totalPrice: 3060,
      },
    ],
  },
  {
    id: "ord_1003",
    orderNumber: "B2B-2026-00915",
    retailerId: "usr_ret_2",
    retailerName: "Deepak Gurung",
    retailerShop: "New Pokhara Super Mart",
    retailerPhone: "9846123456",
    distributorId: "dist_1",
    distributorName: "Himalayan FMCG Distributors Pvt. Ltd.",
    status: "PROCESSING",
    paymentStatus: "PENDING",
    paymentMethod: "BANK_TRANSFER",
    subtotal: 16860,
    discountAmount: 300,
    deliveryFee: 0,
    taxAmount: 2152.8,
    totalAmount: 18712.8,
    commissionRate: 3.0,
    commissionAmount: 505.8,
    netDistributorEarnings: 16054.2,
    deliveryAddress: {
      recipientName: "Deepak Gurung",
      phone: "9846123456",
      province: "Gandaki Province",
      district: "Kaski",
      municipality: "Pokhara Metropolitan City",
      ward: "6",
      streetAddress: "Lakeside Center, Pokhara",
      landmark: "Near Barahi Temple Chowk",
    },
    notes: "Requires dispatch via Pokhara night truck.",
    createdAt: "2026-11-02T16:45:00Z",
    items: [
      {
        id: "item_5",
        productId: "prod_1",
        productTitle: "Wai Wai Quick Chicken Instant Noodles (Carton of 30)",
        productSku: "CG-WW-CHK-30",
        unitType: "CARTON",
        quantity: 10,
        unitPrice: 645, // Tier 2 pricing
        totalPrice: 6450,
      },
      {
        id: "item_6",
        productId: "prod_8",
        productTitle: "Surf Excel Quick Wash Detergent 1kg (Carton of 18)",
        productSku: "UL-SURF-18",
        unitType: "CARTON",
        quantity: 1,
        unitPrice: 4100,
        totalPrice: 4100,
      },
      {
        id: "item_7_juice",
        productId: "prod_3",
        productTitle: "Real Mixed Fruit Juice 1 Liter (Carton of 12)",
        productSku: "DB-REAL-MF-12",
        unitType: "CARTON",
        quantity: 2,
        unitPrice: 3155,
        totalPrice: 6310,
      },
    ],
  },
  {
    id: "ord_1004",
    orderNumber: "B2B-2026-00924",
    retailerId: "usr_ret_1",
    retailerName: "Suman Thapa",
    retailerShop: "Kalanki Kirana & Department Store",
    retailerPhone: "9841556677",
    distributorId: "dist_3",
    distributorName: "Annapurna Dairy & Bakery Supply",
    status: "PENDING",
    paymentStatus: "PENDING",
    paymentMethod: "CASH_ON_DELIVERY",
    subtotal: 14700,
    discountAmount: 0,
    deliveryFee: 150,
    taxAmount: 1911.0,
    totalAmount: 16761.0,
    commissionRate: 2.8,
    commissionAmount: 411.6,
    netDistributorEarnings: 14288.4,
    deliveryAddress: {
      recipientName: "Suman Thapa",
      phone: "9841556677",
      province: "Bagmati Province",
      district: "Kathmandu",
      municipality: "Kathmandu Metropolitan City",
      ward: "14",
      streetAddress: "Kalanki Chowk",
    },
    notes: "High value cow ghee - please check batch expiry before packing.",
    createdAt: "2026-11-03T05:30:00Z",
    items: [
      {
        id: "item_7",
        productId: "prod_6",
        productTitle: "DDC Pure Cow Ghee 1kg Tin (Carton of 12)",
        productSku: "DDC-GHEE-12",
        unitType: "CARTON",
        quantity: 1,
        unitPrice: 14700,
        totalPrice: 14700,
      },
    ],
  },
];

export const INITIAL_OFFERS: MockOffer[] = [
  {
    id: "off_1",
    distributorId: "dist_1",
    title: "Diwali & Chhath Wholesale Dhamaka",
    code: "DHAMAKA26",
    description: "Get flat 5% extra discount on orders above 10 cartons of Wai Wai and Aarati Oil.",
    discountType: "PERCENTAGE",
    discountValue: 5,
    minCartonQty: 10,
    minOrderAmount: 10000,
    startDate: "2026-10-15T00:00:00Z",
    endDate: "2026-11-30T23:59:59Z",
    isActive: true,
  },
  {
    id: "off_2",
    distributorId: "dist_2",
    title: "Everest Beverage Bulk Stock-Up",
    code: "EVEREST500",
    description: "Save Rs. 500 flat on every combined beverage order exceeding Rs. 15,000.",
    discountType: "FIXED_AMOUNT",
    discountValue: 500,
    minCartonQty: 5,
    minOrderAmount: 15000,
    startDate: "2026-10-01T00:00:00Z",
    endDate: "2026-12-15T23:59:59Z",
    isActive: true,
  },
];

export const INITIAL_INVOICES: MockInvoice[] = [
  {
    id: "inv_101",
    invoiceNumber: "INV-2026-BAG-00441",
    orderId: "ord_1001",
    orderNumber: "B2B-2026-00891",
    distributorId: "dist_1",
    distributorName: "Himalayan FMCG Distributors Pvt. Ltd.",
    distributorPan: "602348912",
    distributorAddress: "Kuleshwor-14, Kathmandu, Bagmati Province",
    distributorPhone: "9851023456",
    retailerId: "usr_ret_1",
    retailerShop: "Kalanki Kirana & Department Store",
    retailerName: "Suman Thapa",
    retailerPan: "304561289",
    retailerAddress: "Kalanki-14, Kathmandu",
    retailerPhone: "9841556677",
    taxableAmount: 7660,
    vatAmount: 995.8,
    grandTotal: 8655.8,
    status: "PAID",
    createdAt: "2026-10-28T11:00:00Z",
    items: [
      {
        id: "item_1",
        productId: "prod_1",
        productTitle: "Wai Wai Quick Chicken Instant Noodles (Carton of 30)",
        productSku: "CG-WW-CHK-30",
        unitType: "CARTON",
        quantity: 5,
        unitPrice: 660,
        totalPrice: 3300,
      },
      {
        id: "item_2",
        productId: "prod_4",
        productTitle: "Aarati Pure Mustard Oil Pouch 1L (Carton of 10)",
        productSku: "AOM-MUST-10",
        unitType: "CARTON",
        quantity: 2,
        unitPrice: 2420,
        totalPrice: 4840,
      },
    ],
  },
];
