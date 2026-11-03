import {
  INITIAL_USERS,
  INITIAL_DISTRIBUTORS,
  INITIAL_RETAILERS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_DISTRIBUTOR_COMPANIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_OFFERS,
  INITIAL_INVOICES,
  MockUser,
  MockDistributorProfile,
  MockRetailerProfile,
  MockCategory,
  MockBrand,
  MockDistributorCompany,
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
  private companies: MockDistributorCompany[] = [...INITIAL_DISTRIBUTOR_COMPANIES];
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

  // --- DISTRIBUTOR PRINCIPAL COMPANIES / AGENCIES ---
  getDistributorCompanies(distributorId?: string): MockDistributorCompany[] {
    let list = this.companies;
    if (distributorId) {
      list = list.filter((c) => c.distributorId === distributorId);
    }
    return list.map((c) => ({
      ...c,
      productCount: this.products.filter(
        (p) =>
          (!distributorId || p.distributorId === distributorId) &&
          (p.companyName?.toLowerCase() === c.name.toLowerCase() ||
            p.brandName.toLowerCase().includes(c.name.toLowerCase()) ||
            c.name.toLowerCase().includes(p.brandName.toLowerCase()))
      ).length,
    }));
  }

  getDistributorCompanyById(id: string): MockDistributorCompany | undefined {
    return this.companies.find((c) => c.id === id);
  }

  createDistributorCompany(company: MockDistributorCompany): MockDistributorCompany {
    this.companies.unshift(company);
    return company;
  }

  deleteDistributorCompany(id: string): boolean {
    const idx = this.companies.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.companies.splice(idx, 1);
    return true;
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
        let appliedTierDiscount = 0;
        if (product.tierPricing && product.tierPricing.length > 0) {
          const matchedTier = product.tierPricing
            .slice()
            .reverse()
            .find((t) => item.quantity >= t.minQty && (!t.maxQty || item.quantity <= t.maxQty));
          if (matchedTier) {
            unitPrice = matchedTier.pricePerCarton;
            appliedTierDiscount = product.wholesalePrice - unitPrice;
          }
        }

        // Buy X Get Y Free Scheme calculation
        let earnedFreeQty = 0;
        let earnedFreeItem = product.freeItemName || `${product.title} (Bonus Scheme)`;
        if (product.hasFreeScheme && product.freeSchemeMinQty && product.freeSchemeMinQty > 0) {
          if (item.quantity >= product.freeSchemeMinQty) {
            const ratio = Math.floor(item.quantity / product.freeSchemeMinQty);
            earnedFreeQty = ratio * (product.freeItemQty || 1);
            if (product.freeSchemeType === "SAME_PRODUCT") {
              earnedFreeItem = `${product.title} (Buy ${product.freeSchemeMinQty} Get ${product.freeItemQty || 1} Free)`;
            } else if (product.freeSchemeType === "ANOTHER_PRODUCT") {
              earnedFreeItem = `${product.freeItemName || "Free Bonus Item"} (Cross-Product Scheme)`;
            } else if (product.freeSchemeType === "UNSELLING_ITEM") {
              earnedFreeItem = `${product.freeItemName || "Clearance Stock"} [Unselling Stock Freebie]`;
            }
          }
        }

        // Additional Unselling / Surplus Stock Bonus calculation
        let earnedUnsellingQty = 0;
        let earnedUnsellingItem = product.unsellingItemName || "Clearance Surplus Stock";
        if (product.hasUnsellingBonus && product.unsellingItemMinQty && product.unsellingItemMinQty > 0) {
          if (item.quantity >= product.unsellingItemMinQty) {
            const ratio = Math.floor(item.quantity / product.unsellingItemMinQty);
            earnedUnsellingQty = ratio * (product.unsellingItemQty || 1);
          }
        }

        // Spot Cash Discount calculation (e.g. 2% for COD or instant bank QR)
        const cashDiscountRate = product.cashDiscountPercent || 0;
        const lineTotal = unitPrice * item.quantity;
        const cashDiscountAmount = Math.round(((lineTotal * cashDiscountRate) / 100) * 100) / 100;
        const isVatExempt = product.taxCategory === "VAT_EXEMPT";

        return {
          productId: product.id,
          product,
          quantity: item.quantity,
          unitType: item.unitType,
          unitPrice,
          totalPrice: lineTotal,
          appliedTierDiscount,
          earnedFreeQty,
          earnedFreeItem,
          earnedUnsellingQty,
          earnedUnsellingItem,
          cashDiscountRate,
          cashDiscountAmount,
          isVatExempt,
          promotionalGift: product.promotionalGift,
          festivalTag: product.festivalTag,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    const subtotal = populated.reduce((acc, curr) => acc + (curr ? curr.totalPrice : 0), 0);
    
    // Taxable subtotal (exclude VAT-exempt items like unrefined oil, rice, pulses)
    const taxableSubtotal = populated
      .filter((i) => !i.isVatExempt)
      .reduce((acc, curr) => acc + curr.totalPrice, 0);
    const vatExemptSubtotal = populated
      .filter((i) => i.isVatExempt)
      .reduce((acc, curr) => acc + curr.totalPrice, 0);

    const taxAmount = Math.round(taxableSubtotal * 0.13 * 100) / 100;
    const deliveryFee = subtotal >= 5000 ? 0 : 150;
    
    // Total potential spot cash discount across all products in cart
    const totalCashDiscount = populated.reduce((acc, curr) => acc + (curr.cashDiscountAmount || 0), 0);

    // Total free bonus cartons / items awarded
    const totalFreeUnits = populated.reduce(
      (acc, curr) => acc + (curr.earnedFreeQty || 0) + (curr.earnedUnsellingQty || 0),
      0
    );

    // List of earned free schemes
    const freeSchemeAwards: {
      productId: string;
      title: string;
      quantity: number;
      unitType: string;
      sourceProduct: string;
      schemeType?: string;
      isUnsellingBonus?: boolean;
      tag?: string;
    }[] = [];

    populated.forEach((i) => {
      if (i.earnedFreeQty > 0) {
        freeSchemeAwards.push({
          productId: i.productId,
          title: i.earnedFreeItem,
          quantity: i.earnedFreeQty,
          unitType: i.unitType,
          sourceProduct: i.product.title,
          schemeType: i.product.freeSchemeType || "SAME_PRODUCT",
        });
      }
      if (i.earnedUnsellingQty > 0) {
        freeSchemeAwards.push({
          productId: i.productId,
          title: i.earnedUnsellingItem,
          quantity: i.earnedUnsellingQty,
          unitType: "UNIT",
          sourceProduct: i.product.title,
          schemeType: "UNSELLING_ITEM",
          isUnsellingBonus: true,
          tag: i.product.unsellingItemTag || "Clearance Stock Freebie",
        });
      }
    });

    // List of earned promotional merchandise gifts
    const giftsAwarded = populated
      .filter((i) => Boolean(i.promotionalGift))
      .map((i) => i.promotionalGift as string);

    const totalAmount = subtotal + taxAmount + deliveryFee;

    return {
      items: populated,
      itemCount: populated.reduce((sum, item) => sum + (item ? item.quantity : 0), 0),
      subtotal,
      taxableSubtotal,
      vatExemptSubtotal,
      taxAmount,
      deliveryFee,
      totalCashDiscount,
      totalFreeUnits,
      freeSchemeAwards,
      giftsAwarded,
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
      taxableAmount: newOrder.taxCategoryBreakdown?.taxable ?? (newOrder.subtotal - newOrder.discountAmount),
      vatAmount: newOrder.taxAmount,
      vatExemptAmount: newOrder.taxCategoryBreakdown?.vatExempt ?? 0,
      cashDiscountAmount: newOrder.cashDiscountAmount ?? 0,
      freeItemsAwarded: newOrder.freeItemsAwarded ?? [],
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
    order.dispatchedAt = new Date().toISOString();
    return order;
  }

  cancelOrderItem(orderId: string, itemId: string, cancelReason: string): MockOrder | null {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    const item = order.items.find((i) => i.id === itemId);
    if (!item) return null;

    item.isCancelled = true;
    item.cancelReason = cancelReason || "Stock Unavailable";
    item.cancelledAt = new Date().toISOString();
    item.isInvoiced = false;

    // Recalculate order totals for active items
    const activeItems = order.items.filter((i) => !i.isCancelled);
    const newSubtotal = activeItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const taxableItems = activeItems.filter((i) => !i.isVatExempt);
    const taxableSubtotal = taxableItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const vatExemptSubtotal = activeItems.filter((i) => i.isVatExempt).reduce((sum, i) => sum + i.totalPrice, 0);
    const newTaxAmount = Math.round(taxableSubtotal * 0.13 * 100) / 100;
    const newTotalAmount = newSubtotal + newTaxAmount + (activeItems.length > 0 ? order.deliveryFee : 0);
    const newCommission = Math.round(newTotalAmount * (order.commissionRate / 100) * 100) / 100;

    order.subtotal = newSubtotal;
    order.taxAmount = newTaxAmount;
    order.totalAmount = newTotalAmount;
    order.commissionAmount = newCommission;
    order.netDistributorEarnings = Math.round((newTotalAmount - newCommission) * 100) / 100;
    if (order.taxCategoryBreakdown) {
      order.taxCategoryBreakdown = {
        taxable: taxableSubtotal,
        vatExempt: vatExemptSubtotal,
        vatAmount: newTaxAmount,
      };
    }

    if (activeItems.length === 0) {
      order.status = "CANCELLED";
    }

    return order;
  }

  uncancelOrderItem(orderId: string, itemId: string): MockOrder | null {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    const item = order.items.find((i) => i.id === itemId);
    if (!item) return null;

    item.isCancelled = false;
    delete item.cancelReason;
    delete item.cancelledAt;

    const activeItems = order.items.filter((i) => !i.isCancelled);
    const newSubtotal = activeItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const taxableItems = activeItems.filter((i) => !i.isVatExempt);
    const taxableSubtotal = taxableItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const vatExemptSubtotal = activeItems.filter((i) => i.isVatExempt).reduce((sum, i) => sum + i.totalPrice, 0);
    const newTaxAmount = Math.round(taxableSubtotal * 0.13 * 100) / 100;
    const newTotalAmount = newSubtotal + newTaxAmount + order.deliveryFee;
    const newCommission = Math.round(newTotalAmount * (order.commissionRate / 100) * 100) / 100;

    order.subtotal = newSubtotal;
    order.taxAmount = newTaxAmount;
    order.totalAmount = newTotalAmount;
    order.commissionAmount = newCommission;
    order.netDistributorEarnings = Math.round((newTotalAmount - newCommission) * 100) / 100;
    if (order.status === "CANCELLED" && activeItems.length > 0) {
      order.status = "PROCESSING";
    }

    return order;
  }

  isInvoiceNumberUnique(invoiceNumber: string, currentOrderId?: string): boolean {
    if (!invoiceNumber || !invoiceNumber.trim()) return false;
    const clean = invoiceNumber.trim().toUpperCase();
    return !this.invoices.some(
      (inv) =>
        inv.invoiceNumber.toUpperCase() === clean &&
        (!currentOrderId || (inv.orderId !== currentOrderId && inv.id !== currentOrderId))
    );
  }

  generateUniqueInvoiceNumber(prefix = "INV-2026-BAG"): string {
    let num = Math.floor(1000 + Math.random() * 9000);
    let candidate = `${prefix}-${num}`;
    let attempts = 0;
    while (!this.isInvoiceNumberUnique(candidate) && attempts < 100) {
      num = Math.floor(1000 + Math.random() * 9000);
      candidate = `${prefix}-${num}`;
      attempts++;
    }
    return candidate;
  }

  setOrderInvoice(
    orderId: string,
    selectedItemIds: string[],
    customInvoiceNumber?: string
  ): { order: MockOrder; invoice: MockInvoice; notice: any } | { error: string } | null {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    let finalInvNum: string;
    if (customInvoiceNumber && customInvoiceNumber.trim()) {
      const cleanInvNum = customInvoiceNumber.trim().toUpperCase();
      if (!this.isInvoiceNumberUnique(cleanInvNum, order.id)) {
        const conflict = this.invoices.find(
          (i) => i.invoiceNumber.toUpperCase() === cleanInvNum && i.orderId !== order.id
        );
        return {
          error: `Invoice number "${cleanInvNum}" is already in use by order ${
            conflict?.orderNumber || "another order"
          }. Please provide a unique invoice number.`,
        };
      }
      finalInvNum = cleanInvNum;
    } else {
      let existingInv = this.invoices.find((i) => i.orderId === order.id);
      finalInvNum = existingInv?.invoiceNumber || this.generateUniqueInvoiceNumber();
    }

    order.items.forEach((item) => {
      item.isInvoiced = !item.isCancelled && selectedItemIds.includes(item.id);
    });

    const invoicedItems = order.items.filter((i) => i.isInvoiced);
    const invSubtotal = invoicedItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const taxableItems = invoicedItems.filter((i) => !i.isVatExempt);
    const taxableSubtotal = taxableItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const vatExemptSubtotal = invoicedItems.filter((i) => i.isVatExempt).reduce((sum, i) => sum + i.totalPrice, 0);
    const vatAmount = Math.round(taxableSubtotal * 0.13 * 100) / 100;
    const grandTotal = invSubtotal + vatAmount;

    let invoice = this.invoices.find((i) => i.orderId === order.id);
    const dist = this.getDistributorById(order.distributorId);
    const ret = this.getRetailerByUserId(order.retailerId);

    if (invoice) {
      invoice.invoiceNumber = finalInvNum;
      invoice.items = invoicedItems;
      invoice.taxableAmount = taxableSubtotal;
      invoice.vatAmount = vatAmount;
      invoice.vatExemptAmount = vatExemptSubtotal;
      invoice.grandTotal = grandTotal;
      invoice.status = order.paymentStatus === "PAID" ? "PAID" : "PENDING";
    } else {
      invoice = {
        id: `inv_${Date.now()}`,
        invoiceNumber: finalInvNum,
        orderId: order.id,
        orderNumber: order.orderNumber,
        distributorId: order.distributorId,
        distributorName: order.distributorName,
        distributorPan: dist?.panVatNumber || "601234567",
        distributorAddress: dist ? `${dist.municipality}-${dist.ward}, ${dist.district}` : "Kathmandu, Nepal",
        distributorPhone: dist?.contactPhone || "9851000000",
        retailerId: order.retailerId,
        retailerShop: order.retailerShop,
        retailerName: order.retailerName,
        retailerPan: ret?.panVatNumber || "301234567",
        retailerAddress: `${order.deliveryAddress.municipality}-${order.deliveryAddress.ward}, ${order.deliveryAddress.district}`,
        retailerPhone: order.deliveryAddress.phone,
        taxableAmount: taxableSubtotal,
        vatAmount,
        vatExemptAmount: vatExemptSubtotal,
        cashDiscountAmount: order.cashDiscountAmount ?? 0,
        freeItemsAwarded: order.freeItemsAwarded ?? [],
        grandTotal,
        status: order.paymentStatus === "PAID" ? "PAID" : "PENDING",
        createdAt: new Date().toISOString(),
        items: invoicedItems,
      };
      this.invoices.unshift(invoice);
    }

    order.isInvoiced = true;
    order.invoiceId = invoice.id;
    order.invoiceNumber = finalInvNum;
    order.invoicedAt = new Date().toISOString();

    if (order.status === "PENDING") {
      order.status = "CONFIRMED";
    }

    const notice = {
      sentAt: new Date().toISOString(),
      message: `तपाईंको अर्डर (${order.orderNumber}) स्वीकृत भएको छ र आधिकारिक कर इनभ्वाइस (${finalInvNum}) जारी भएको छ। कुल रकम: रु. ${grandTotal.toLocaleString("ne-NP")}`,
      recipientPhone: order.deliveryAddress.phone,
    };
    order.confirmationNotice = notice;

    return { order, invoice, notice };
  }

  scheduleOrderDelivery(
    orderId: string,
    deliveryDate: string,
    timeSlot?: string,
    personnel?: { name: string; phone: string; vehicleNo: string }
  ): MockOrder | null {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    order.deliveryDate = deliveryDate;
    if (timeSlot) order.deliveryTimeSlot = timeSlot;

    if (personnel && personnel.name) {
      order.deliveryPerson = {
        ...personnel,
        assignedAt: new Date().toISOString(),
      };
      order.status = "DISPATCHED";
      order.dispatchedAt = new Date().toISOString();
    }

    return order;
  }

  bulkDispatchOrders(
    orderIds: string[],
    deliveryDate: string,
    deliveryPerson: { name: string; phone: string; vehicleNo: string },
    timeSlot?: string
  ): MockOrder[] {
    const updated: MockOrder[] = [];
    orderIds.forEach((id) => {
      const order = this.orders.find((o) => o.id === id || o.orderNumber === id);
      if (order && order.status !== "CANCELLED" && order.status !== "DELIVERED") {
        order.deliveryDate = deliveryDate;
        if (timeSlot) order.deliveryTimeSlot = timeSlot;
        order.deliveryPerson = {
          ...deliveryPerson,
          assignedAt: new Date().toISOString(),
        };
        order.status = "DISPATCHED";
        order.dispatchedAt = new Date().toISOString();
        updated.push(order);
      }
    });
    return updated;
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
