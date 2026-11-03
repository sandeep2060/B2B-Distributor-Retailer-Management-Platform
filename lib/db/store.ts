import {
  INITIAL_USERS,
  INITIAL_DISTRIBUTORS,
  INITIAL_RETAILERS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_OFFERS,
  INITIAL_INVOICES,
  MockUser,
  MockDistributorProfile,
  MockRetailerProfile,
  MockCategory,
  MockBrand,
  MockProduct,
  MockOrder,
  MockOffer,
  MockInvoice,
} from "./mock-data";

// In-memory persistent state holder across server requests
class MarketplaceStore {
  private users: MockUser[] = [...INITIAL_USERS];
  private distributors: MockDistributorProfile[] = [...INITIAL_DISTRIBUTORS];
  private retailers: MockRetailerProfile[] = [...INITIAL_RETAILERS];
  private categories: MockCategory[] = [...INITIAL_CATEGORIES];
  private brands: MockBrand[] = [...INITIAL_BRANDS];
  private products: MockProduct[] = [...INITIAL_PRODUCTS];
  private orders: MockOrder[] = [...INITIAL_ORDERS];
  private offers: MockOffer[] = [...INITIAL_OFFERS];
  private invoices: MockInvoice[] = [...INITIAL_INVOICES];
  private carts: Map<string, { productId: string; quantity: number; unitType: string }[]> = new Map();

  constructor() {
    // Initialize default cart for retailer 1
    this.carts.set("usr_ret_1", [
      { productId: "prod_1", quantity: 3, unitType: "CARTON" },
      { productId: "prod_2", quantity: 2, unitType: "CARTON" },
    ]);
  }

  // --- USERS ---
  getUsers(): MockUser[] {
    return this.users;
  }

  getUserById(id: string): MockUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): MockUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: MockUser): MockUser {
    this.users.push(user);
    return user;
  }

  updateUserStatus(userId: string, status: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED"): MockUser | null {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;
    user.status = status;
    return user;
  }

  // --- RETAILERS ---
  getRetailers(): MockRetailerProfile[] {
    return this.retailers;
  }

  getRetailerByUserId(userId: string): MockRetailerProfile | undefined {
    return this.retailers.find((r) => r.userId === userId);
  }

  createRetailerProfile(profile: MockRetailerProfile): MockRetailerProfile {
    this.retailers.push(profile);
    return profile;
  }

  verifyRetailer(retailerId: string, isVerified = true): MockRetailerProfile | null {
    const retailer = this.retailers.find((r) => r.id === retailerId || r.userId === retailerId);
    if (!retailer) return null;
    retailer.isVerified = isVerified;
    return retailer;
  }

  // --- DISTRIBUTORS ---
  getDistributors(): MockDistributorProfile[] {
    return this.distributors;
  }

  getDistributorById(id: string): MockDistributorProfile | undefined {
    return this.distributors.find((d) => d.id === id);
  }

  getDistributorByUserId(userId: string): MockDistributorProfile | undefined {
    return this.distributors.find((d) => d.userId === userId);
  }

  createDistributorProfile(profile: MockDistributorProfile): MockDistributorProfile {
    this.distributors.push(profile);
    return profile;
  }

  updateDistributor(id: string, updates: Partial<MockDistributorProfile>): MockDistributorProfile | null {
    const dist = this.distributors.find((d) => d.id === id);
    if (!dist) return null;
    Object.assign(dist, updates);
    return dist;
  }

  verifyDistributor(id: string, isVerified = true): MockDistributorProfile | null {
    return this.updateDistributor(id, { isVerified });
  }

  setDistributorCommission(id: string, commissionRate: number): MockDistributorProfile | null {
    return this.updateDistributor(id, { commissionRate });
  }

  // --- CATEGORIES & BRANDS ---
  getCategories(): MockCategory[] {
    return this.categories.map((c) => ({
      ...c,
      productCount: this.products.filter((p) => p.categoryId === c.id && p.isAvailable).length,
    }));
  }

  getCategoryBySlug(slug: string): MockCategory | undefined {
    return this.categories.find((c) => c.slug === slug);
  }

  getBrands(): MockBrand[] {
    return this.brands;
  }

  // --- PRODUCTS ---
  getProducts(filters?: {
    categorySlug?: string;
    distributorId?: string;
    brandSlug?: string;
    search?: string;
    featuredOnly?: boolean;
    inStockOnly?: boolean;
  }): MockProduct[] {
    let result = [...this.products];

    if (filters?.categorySlug) {
      const cat = this.categories.find((c) => c.slug === filters.categorySlug);
      if (cat) {
        result = result.filter((p) => p.categoryId === cat.id);
      }
    }

    if (filters?.distributorId) {
      result = result.filter((p) => p.distributorId === filters.distributorId);
    }

    if (filters?.brandSlug) {
      const brand = this.brands.find((b) => b.slug === filters.brandSlug);
      if (brand) {
        result = result.filter((p) => p.brandId === brand.id);
      }
    }

    if (filters?.featuredOnly) {
      result = result.filter((p) => p.isFeatured);
    }

    if (filters?.inStockOnly) {
      result = result.filter((p) => p.stockQuantity > 0 && p.isAvailable);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          p.distributorName.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    return result;
  }

  getProductById(id: string): MockProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  getProductBySlug(slug: string): MockProduct | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  createProduct(product: MockProduct): MockProduct {
    this.products.unshift(product);
    return product;
  }

  updateProduct(id: string, updates: Partial<MockProduct>): MockProduct | null {
    const prod = this.products.find((p) => p.id === id);
    if (!prod) return null;
    Object.assign(prod, updates);
    return prod;
  }

  deleteProduct(id: string): boolean {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  // --- CARTS ---
  getCart(userId: string) {
    const items = this.carts.get(userId) || [];
    const populated = items
      .map((item) => {
        const product = this.getProductById(item.productId);
        if (!product) return null;

        // Apply tier pricing if quantity matches
        let unitPrice = product.wholesalePrice;
        if (product.tierPricing && product.tierPricing.length > 0) {
          const matchedTier = product.tierPricing
            .slice()
            .reverse()
            .find((t) => item.quantity >= t.minQty && (!t.maxQty || item.quantity <= t.maxQty));
          if (matchedTier) {
            unitPrice = matchedTier.pricePerCarton;
          }
        }

        const totalPrice = unitPrice * item.quantity;
        return {
          productId: product.id,
          product,
          quantity: item.quantity,
          unitType: item.unitType,
          unitPrice,
          totalPrice,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    const subtotal = populated.reduce((acc, curr) => acc + (curr ? curr.totalPrice : 0), 0);
    const taxAmount = Math.round(subtotal * 0.13 * 100) / 100;
    const deliveryFee = subtotal >= 5000 ? 0 : 150;
    const totalAmount = subtotal + taxAmount + deliveryFee;

    return {
      items: populated,
      itemCount: populated.reduce((sum, item) => sum + (item ? item.quantity : 0), 0),
      subtotal,
      taxAmount,
      deliveryFee,
      totalAmount,
    };
  }

  addToCart(userId: string, productId: string, quantity = 1, unitType = "CARTON") {
    const cart = this.carts.get(userId) || [];
    const existing = cart.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity, unitType });
    }
    this.carts.set(userId, cart);
    return this.getCart(userId);
  }

  updateCartItem(userId: string, productId: string, quantity: number) {
    let cart = this.carts.get(userId) || [];
    if (quantity <= 0) {
      cart = cart.filter((i) => i.productId !== productId);
    } else {
      const existing = cart.find((i) => i.productId === productId);
      if (existing) {
        existing.quantity = quantity;
      }
    }
    this.carts.set(userId, cart);
    return this.getCart(userId);
  }

  clearCart(userId: string) {
    this.carts.delete(userId);
  }

  // --- ORDERS ---
  getOrders(filters?: { retailerId?: string; distributorId?: string; status?: string }): MockOrder[] {
    let res = [...this.orders];
    if (filters?.retailerId) {
      res = res.filter((o) => o.retailerId === filters.retailerId);
    }
    if (filters?.distributorId) {
      res = res.filter((o) => o.distributorId === filters.distributorId);
    }
    if (filters?.status) {
      res = res.filter((o) => o.status === filters.status);
    }
    return res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderById(id: string): MockOrder | undefined {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  createOrder(orderData: Omit<MockOrder, "id" | "orderNumber" | "createdAt">): MockOrder {
    const id = `ord_${Date.now()}`;
    const orderNumber = `B2B-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: MockOrder = {
      ...orderData,
      id,
      orderNumber,
      createdAt: new Date().toISOString(),
    };
    this.orders.unshift(newOrder);

    // Auto-generate tax invoice for the order
    const dist = this.getDistributorById(newOrder.distributorId);
    const ret = this.getRetailerByUserId(newOrder.retailerId);
    const invoiceNumber = `INV-2026-BAG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice: MockInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      distributorId: newOrder.distributorId,
      distributorName: newOrder.distributorName,
      distributorPan: dist?.panVatNumber || "601234567",
      distributorAddress: dist ? `${dist.municipality}-${dist.ward}, ${dist.district}` : "Kathmandu, Nepal",
      distributorPhone: dist?.contactPhone || "9851000000",
      retailerId: newOrder.retailerId,
      retailerShop: newOrder.retailerShop,
      retailerName: newOrder.retailerName,
      retailerPan: ret?.panVatNumber || "301234567",
      retailerAddress: `${newOrder.deliveryAddress.municipality}-${newOrder.deliveryAddress.ward}, ${newOrder.deliveryAddress.district}`,
      retailerPhone: newOrder.deliveryAddress.phone,
      taxableAmount: newOrder.subtotal - newOrder.discountAmount,
      vatAmount: newOrder.taxAmount,
      grandTotal: newOrder.totalAmount,
      status: newOrder.paymentStatus === "PAID" ? "PAID" : "PENDING",
      createdAt: new Date().toISOString(),
      items: newOrder.items,
    };
    this.invoices.unshift(newInvoice);

    // Reduce stock quantities
    newOrder.items.forEach((item) => {
      const p = this.getProductById(item.productId);
      if (p) {
        p.stockQuantity = Math.max(0, p.stockQuantity - item.quantity);
      }
    });

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: MockOrder["status"]): MockOrder | null {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;
    order.status = status;
    if (status === "DELIVERED") {
      order.paymentStatus = "PAID";
      const inv = this.invoices.find((i) => i.orderId === order.id);
      if (inv) inv.status = "PAID";
    }
    return order;
  }

  assignDeliveryPersonnel(
    orderId: string,
    personnel: { name: string; phone: string; vehicleNo: string }
  ): MockOrder | null {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;
    order.deliveryPerson = {
      ...personnel,
      assignedAt: new Date().toISOString(),
    };
    order.status = "DISPATCHED";
    return order;
  }

  // --- OFFERS ---
  getOffers(distributorId?: string): MockOffer[] {
    if (distributorId) {
      return this.offers.filter((o) => o.distributorId === distributorId);
    }
    return this.offers;
  }

  createOffer(offer: MockOffer): MockOffer {
    this.offers.unshift(offer);
    return offer;
  }

  toggleOfferActive(id: string): MockOffer | null {
    const off = this.offers.find((o) => o.id === id);
    if (!off) return null;
    off.isActive = !off.isActive;
    return off;
  }

  // --- INVOICES ---
  getInvoices(filters?: { retailerId?: string; distributorId?: string }): MockInvoice[] {
    let res = [...this.invoices];
    if (filters?.retailerId) {
      res = res.filter((i) => i.retailerId === filters.retailerId);
    }
    if (filters?.distributorId) {
      res = res.filter((i) => i.distributorId === filters.distributorId);
    }
    return res;
  }

  getInvoiceById(id: string): MockInvoice | undefined {
    return this.invoices.find((i) => i.id === id || i.invoiceNumber === id || i.orderId === id);
  }

  // --- ANALYTICS ---
  getPlatformStats() {
    const totalOrders = this.orders.length;
    const totalRevenue = this.orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalCommission = this.orders.reduce((sum, o) => sum + o.commissionAmount, 0);
    const totalRetailers = this.retailers.length;
    const totalDistributors = this.distributors.length;
    const totalProducts = this.products.length;

    return {
      totalOrders,
      totalRevenue,
      totalCommission,
      totalRetailers,
      totalDistributors,
      totalProducts,
      recentOrders: this.orders.slice(0, 5),
    };
  }

  getDistributorStats(distributorId: string) {
    const distOrders = this.orders.filter((o) => o.distributorId === distributorId);
    const totalSales = distOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = distOrders.filter((o) => o.status === "PENDING").length;
    const totalCommission = distOrders.reduce((sum, o) => sum + o.commissionAmount, 0);
    const netEarnings = distOrders.reduce((sum, o) => sum + o.netDistributorEarnings, 0);
    const totalProducts = this.products.filter((p) => p.distributorId === distributorId).length;

    return {
      totalSales,
      totalOrders: distOrders.length,
      pendingOrders,
      totalCommission,
      netEarnings,
      totalProducts,
      recentOrders: distOrders.slice(0, 5),
    };
  }
}

// Global Singleton
const globalForStore = global as unknown as { b2bDealStore: MarketplaceStore };
export const marketplaceStore = globalForStore.b2bDealStore || new MarketplaceStore();
if (process.env.NODE_ENV !== "production") {
  globalForStore.b2bDealStore = marketplaceStore;
}

export default marketplaceStore;
