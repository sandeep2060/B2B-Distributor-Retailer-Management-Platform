"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import marketplaceStore from "@/lib/db/store";
import { MockProduct } from "@/lib/db/mock-data";
import { formatNPR } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  Package,
  Plus,
  Search,
  Upload,
  Download,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Filter,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  Tag,
  DollarSign,
  Building2,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

type SortColumn =
  | "title"
  | "category"
  | "brand"
  | "wholesalePrice"
  | "moq"
  | "stock"
  | "status";

type SortDirection = "asc" | "desc";

export default function DistributorProductsPage() {
  const distributorId = "dist_1";

  // Data Source from Marketplace Store
  const [products, setProducts] = useState<MockProduct[]>(() =>
    marketplaceStore.getProducts({ distributorId })
  );

  // Available metadata for dropdown filters
  const allCategories = useMemo(() => marketplaceStore.getCategories(), []);
  const allBrands = useMemo(() => marketplaceStore.getBrands(), []);
  const allCompanies = useMemo(
    () => marketplaceStore.getDistributorCompanies(distributorId),
    [distributorId]
  );

  // Notifications
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  };

  // =========================================================================
  // SEARCH & FILTER STATES (EVERY COLUMN HAS DEDICATED CONTROLS)
  // =========================================================================

  // Global search across all fields
  const [globalSearch, setGlobalSearch] = useState("");

  // Column 1: Product Title, SKU, Barcode
  const [colProductSearch, setColProductSearch] = useState("");

  // Column 2: Category, Brand, Principal Company
  const [colCategory, setColCategory] = useState("ALL");
  const [colBrand, setColBrand] = useState("ALL");
  const [colCompany, setColCompany] = useState("ALL");

  // Column 3: Packaging & Tax
  const [colTaxStatus, setColTaxStatus] = useState<"ALL" | "TAXABLE" | "VAT_EXEMPT">("ALL");
  const [colUnitType, setColUnitType] = useState<string>("ALL");

  // Column 4: Wholesale Rate & MRP Range
  const [colMinPrice, setColMinPrice] = useState("");
  const [colMaxPrice, setColMaxPrice] = useState("");

  // Column 5: Active Schemes & Promotional Offers
  const [colSchemeType, setColSchemeType] = useState<
    | "ALL"
    | "ANY_OFFER"
    | "BUY_GET_SAME"
    | "BUY_GET_ANOTHER"
    | "UNSELLING_CLEARANCE"
    | "CASH_DISCOUNT"
    | "TIER_PRICING"
    | "FESTIVAL_SPECIAL"
    | "NONE"
  >("ALL");

  // Column 6: MOQ
  const [colMoq, setColMoq] = useState<"ALL" | "1" | "2-4" | "5+" | "10+">("ALL");

  // Column 7: Warehouse Stock & Inventory Status
  const [colStockStatus, setColStockStatus] = useState<
    "ALL" | "IN_STOCK" | "LOW_STOCK" | "CRITICAL" | "OUT_OF_STOCK"
  >("ALL");
  const [colMinStock, setColMinStock] = useState("");
  const [colMaxStock, setColMaxStock] = useState("");

  // Column 8: Status & Availability
  const [colStatus, setColStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Quick Preset Chips
  const [activePreset, setActivePreset] = useState<
    | "ALL"
    | "LOW_STOCK"
    | "OUT_OF_STOCK"
    | "SCHEMES"
    | "VAT_EXEMPT"
    | "TAXABLE"
    | "ACTIVE_ONLY"
    | "INACTIVE_ONLY"
  >("ALL");

  // Toggle Column Filter Panel
  const [showColumnFilters, setShowColumnFilters] = useState(true);

  // Sorting State
  const [sortColumn, setSortColumn] = useState<SortColumn>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bulk Selection State
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Quick Edit Modal State
  const [quickEditProduct, setQuickEditProduct] = useState<MockProduct | null>(null);
  const [editWholesalePrice, setEditWholesalePrice] = useState<number>(0);
  const [editCartonMrp, setEditCartonMrp] = useState<number>(0);
  const [editStockQuantity, setEditStockQuantity] = useState<number>(0);
  const [editMinOrderQty, setEditMinOrderQty] = useState<number>(1);
  const [editIsAvailable, setEditIsAvailable] = useState<boolean>(true);

  // =========================================================================
  // RESET ALL FILTERS
  // =========================================================================
  const handleResetFilters = () => {
    setGlobalSearch("");
    setColProductSearch("");
    setColCategory("ALL");
    setColBrand("ALL");
    setColCompany("ALL");
    setColTaxStatus("ALL");
    setColUnitType("ALL");
    setColMinPrice("");
    setColMaxPrice("");
    setColSchemeType("ALL");
    setColMoq("ALL");
    setColStockStatus("ALL");
    setColMinStock("");
    setColMaxStock("");
    setColStatus("ALL");
    setActivePreset("ALL");
    setCurrentPage(1);
  };

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (globalSearch.trim()) count++;
    if (colProductSearch.trim()) count++;
    if (colCategory !== "ALL") count++;
    if (colBrand !== "ALL") count++;
    if (colCompany !== "ALL") count++;
    if (colTaxStatus !== "ALL") count++;
    if (colUnitType !== "ALL") count++;
    if (colMinPrice.trim()) count++;
    if (colMaxPrice.trim()) count++;
    if (colSchemeType !== "ALL") count++;
    if (colMoq !== "ALL") count++;
    if (colStockStatus !== "ALL") count++;
    if (colMinStock.trim()) count++;
    if (colMaxStock.trim()) count++;
    if (colStatus !== "ALL") count++;
    if (activePreset !== "ALL") count++;
    return count;
  }, [
    globalSearch,
    colProductSearch,
    colCategory,
    colBrand,
    colCompany,
    colTaxStatus,
    colUnitType,
    colMinPrice,
    colMaxPrice,
    colSchemeType,
    colMoq,
    colStockStatus,
    colMinStock,
    colMaxStock,
    colStatus,
    activePreset,
  ]);

  // Handle preset chip clicks
  const handleApplyPreset = (
    preset:
      | "ALL"
      | "LOW_STOCK"
      | "OUT_OF_STOCK"
      | "SCHEMES"
      | "VAT_EXEMPT"
      | "TAXABLE"
      | "ACTIVE_ONLY"
      | "INACTIVE_ONLY"
  ) => {
    setActivePreset(preset);
    setCurrentPage(1);
    if (preset === "ALL") {
      setColStockStatus("ALL");
      setColSchemeType("ALL");
      setColTaxStatus("ALL");
      setColStatus("ALL");
    } else if (preset === "LOW_STOCK") {
      setColStockStatus("LOW_STOCK");
    } else if (preset === "OUT_OF_STOCK") {
      setColStockStatus("OUT_OF_STOCK");
    } else if (preset === "SCHEMES") {
      setColSchemeType("ANY_OFFER");
    } else if (preset === "VAT_EXEMPT") {
      setColTaxStatus("VAT_EXEMPT");
    } else if (preset === "TAXABLE") {
      setColTaxStatus("TAXABLE");
    } else if (preset === "ACTIVE_ONLY") {
      setColStatus("ACTIVE");
    } else if (preset === "INACTIVE_ONLY") {
      setColStatus("INACTIVE");
    }
  };

  // =========================================================================
  // FILTERING LOGIC (MULTI-DIMENSIONAL ACROSS ALL COLUMNS)
  // =========================================================================
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Global Search
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchBarcode = p.barcode?.toLowerCase().includes(q);
        const matchBrand = p.brandName.toLowerCase().includes(q);
        const matchCategory = p.categoryName.toLowerCase().includes(q);
        const matchCompany = Boolean(p.companyName?.toLowerCase().includes(q));
        if (
          !matchTitle &&
          !matchSku &&
          !matchBarcode &&
          !matchBrand &&
          !matchCategory &&
          !matchCompany
        ) {
          return false;
        }
      }

      // 2. Column 1: Product / SKU / Barcode Filter
      if (colProductSearch.trim()) {
        const q = colProductSearch.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchBarcode = p.barcode?.toLowerCase().includes(q);
        if (!matchTitle && !matchSku && !matchBarcode) return false;
      }

      // 3. Column 2: Category Filter
      if (colCategory !== "ALL") {
        if (p.categoryId !== colCategory && p.categoryName !== colCategory) return false;
      }

      // 4. Column 2b: Brand Filter
      if (colBrand !== "ALL") {
        if (p.brandId !== colBrand && p.brandName !== colBrand) return false;
      }

      // 5. Column 2c: Principal Company Filter
      if (colCompany !== "ALL") {
        if (p.companyName !== colCompany) return false;
      }

      // 6. Column 3: Tax Status Filter
      if (colTaxStatus !== "ALL") {
        if (colTaxStatus === "VAT_EXEMPT" && p.taxCategory !== "VAT_EXEMPT") return false;
        if (colTaxStatus === "TAXABLE" && p.taxCategory === "VAT_EXEMPT") return false;
      }

      // 7. Column 3b: Packaging Unit Filter
      if (colUnitType !== "ALL") {
        if (p.unitType !== colUnitType) return false;
      }

      // 8. Column 4: Wholesale Rate Range
      if (colMinPrice.trim()) {
        const minP = parseFloat(colMinPrice);
        if (!isNaN(minP) && p.wholesalePrice < minP) return false;
      }
      if (colMaxPrice.trim()) {
        const maxP = parseFloat(colMaxPrice);
        if (!isNaN(maxP) && p.wholesalePrice > maxP) return false;
      }

      // 9. Column 5: Active Schemes & Offers Filter
      if (colSchemeType !== "ALL") {
        const hasAnyScheme =
          Boolean(p.hasFreeScheme) ||
          Boolean(p.hasUnsellingBonus) ||
          Boolean(p.cashDiscountPercent && p.cashDiscountPercent > 0) ||
          Boolean(p.tierPricing && p.tierPricing.length > 0) ||
          Boolean(p.festivalTag) ||
          Boolean(p.promotionalGift);

        if (colSchemeType === "ANY_OFFER" && !hasAnyScheme) return false;
        if (colSchemeType === "NONE" && hasAnyScheme) return false;
        if (
          colSchemeType === "BUY_GET_SAME" &&
          (!p.hasFreeScheme || p.freeSchemeType === "ANOTHER_PRODUCT" || p.freeSchemeType === "UNSELLING_ITEM")
        ) {
          return false;
        }
        if (
          colSchemeType === "BUY_GET_ANOTHER" &&
          (!p.hasFreeScheme || p.freeSchemeType !== "ANOTHER_PRODUCT")
        ) {
          return false;
        }
        if (
          colSchemeType === "UNSELLING_CLEARANCE" &&
          !p.hasUnsellingBonus &&
          p.freeSchemeType !== "UNSELLING_ITEM"
        ) {
          return false;
        }
        if (
          colSchemeType === "CASH_DISCOUNT" &&
          (!p.cashDiscountPercent || p.cashDiscountPercent <= 0)
        ) {
          return false;
        }
        if (
          colSchemeType === "TIER_PRICING" &&
          (!p.tierPricing || p.tierPricing.length === 0)
        ) {
          return false;
        }
        if (colSchemeType === "FESTIVAL_SPECIAL" && !p.festivalTag) return false;
      }

      // 10. Column 6: MOQ Filter
      if (colMoq !== "ALL") {
        if (colMoq === "1" && p.minOrderQty !== 1) return false;
        if (colMoq === "2-4" && (p.minOrderQty < 2 || p.minOrderQty > 4)) return false;
        if (colMoq === "5+" && p.minOrderQty < 5) return false;
        if (colMoq === "10+" && p.minOrderQty < 10) return false;
      }

      // 11. Column 7: Warehouse Stock Filter
      if (colStockStatus !== "ALL") {
        if (colStockStatus === "IN_STOCK" && p.stockQuantity <= 0) return false;
        if (colStockStatus === "LOW_STOCK" && (p.stockQuantity >= 50 || p.stockQuantity <= 0))
          return false;
        if (colStockStatus === "CRITICAL" && (p.stockQuantity >= 20 || p.stockQuantity <= 0))
          return false;
        if (colStockStatus === "OUT_OF_STOCK" && p.stockQuantity > 0) return false;
      }
      if (colMinStock.trim()) {
        const minS = parseInt(colMinStock, 10);
        if (!isNaN(minS) && p.stockQuantity < minS) return false;
      }
      if (colMaxStock.trim()) {
        const maxS = parseInt(colMaxStock, 10);
        if (!isNaN(maxS) && p.stockQuantity > maxS) return false;
      }

      // 12. Column 8: Status & Availability Filter
      if (colStatus !== "ALL") {
        if (colStatus === "ACTIVE" && !p.isAvailable) return false;
        if (colStatus === "INACTIVE" && p.isAvailable) return false;
      }

      return true;
    });
  }, [
    products,
    globalSearch,
    colProductSearch,
    colCategory,
    colBrand,
    colCompany,
    colTaxStatus,
    colUnitType,
    colMinPrice,
    colMaxPrice,
    colSchemeType,
    colMoq,
    colStockStatus,
    colMinStock,
    colMaxStock,
    colStatus,
  ]);

  // =========================================================================
  // SORTING LOGIC
  // =========================================================================
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    list.sort((a, b) => {
      let res = 0;
      if (sortColumn === "title") {
        res = a.title.localeCompare(b.title);
      } else if (sortColumn === "category") {
        res = a.categoryName.localeCompare(b.categoryName);
      } else if (sortColumn === "brand") {
        res = a.brandName.localeCompare(b.brandName);
      } else if (sortColumn === "wholesalePrice") {
        res = a.wholesalePrice - b.wholesalePrice;
      } else if (sortColumn === "moq") {
        res = a.minOrderQty - b.minOrderQty;
      } else if (sortColumn === "stock") {
        res = a.stockQuantity - b.stockQuantity;
      } else if (sortColumn === "status") {
        res = (a.isAvailable ? 1 : 0) - (b.isAvailable ? 1 : 0);
      }
      return sortDirection === "asc" ? res : -res;
    });
    return list;
  }, [filteredProducts, sortColumn, sortDirection]);

  // Handle Sort Click
  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  // =========================================================================
  // PAGINATION LOGIC
  // =========================================================================
  const totalPages = Math.ceil(sortedProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [sortedProducts, currentPage, pageSize]);

  // =========================================================================
  // KPI CALCULATIONS (SUMMARY STATS)
  // =========================================================================
  const stats = useMemo(() => {
    const total = products.length;
    const activeCount = products.filter((p) => p.isAvailable).length;
    const lowStockCount = products.filter((p) => p.stockQuantity < 50 && p.stockQuantity > 0).length;
    const outOfStockCount = products.filter((p) => p.stockQuantity === 0).length;
    const schemesCount = products.filter(
      (p) =>
        Boolean(p.hasFreeScheme) ||
        Boolean(p.hasUnsellingBonus) ||
        Boolean(p.cashDiscountPercent && p.cashDiscountPercent > 0) ||
        Boolean(p.tierPricing && p.tierPricing.length > 0)
    ).length;
    const vatExemptCount = products.filter((p) => p.taxCategory === "VAT_EXEMPT").length;
    const totalInventoryValue = products.reduce(
      (sum, p) => sum + p.stockQuantity * p.wholesalePrice,
      0
    );

    return {
      total,
      activeCount,
      lowStockCount,
      outOfStockCount,
      schemesCount,
      vatExemptCount,
      totalInventoryValue,
    };
  }, [products]);

  // =========================================================================
  // BULK SELECTION HANDLERS
  // =========================================================================
  const isAllPaginatedSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((p) => selectedProductIds.includes(p.id));

  const handleToggleSelectAll = () => {
    if (isAllPaginatedSelected) {
      setSelectedProductIds((prev) =>
        prev.filter((id) => !paginatedProducts.some((p) => p.id === id))
      );
    } else {
      const pageIds = paginatedProducts.map((p) => p.id);
      setSelectedProductIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSingleSelect = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleBulkChangeStatus = (newAvailable: boolean) => {
    selectedProductIds.forEach((id) => {
      marketplaceStore.updateProduct(id, { isAvailable: newAvailable });
    });
    setProducts(marketplaceStore.getProducts({ distributorId }));
    showToast(
      `✓ Updated ${selectedProductIds.length} products to ${
        newAvailable ? "Active" : "Inactive"
      }`
    );
    setSelectedProductIds([]);
  };

  const handleBulkAdjustStock = (addedQty: number) => {
    selectedProductIds.forEach((id) => {
      const current = marketplaceStore.getProductById(id);
      if (current) {
        marketplaceStore.updateProduct(id, {
          stockQuantity: Math.max(0, current.stockQuantity + addedQty),
        });
      }
    });
    setProducts(marketplaceStore.getProducts({ distributorId }));
    showToast(`✓ Added +${addedQty} cartons stock to ${selectedProductIds.length} products`);
    setSelectedProductIds([]);
  };

  const handleBulkDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete ${selectedProductIds.length} selected wholesale products?`
      )
    ) {
      selectedProductIds.forEach((id) => {
        marketplaceStore.deleteProduct(id);
      });
      setProducts(marketplaceStore.getProducts({ distributorId }));
      showToast(`✓ Deleted ${selectedProductIds.length} products from catalog.`);
      setSelectedProductIds([]);
    }
  };

  // =========================================================================
  // SINGLE PRODUCT ACTIONS
  // =========================================================================
  const handleToggleAvailability = (prod: MockProduct) => {
    const updated = marketplaceStore.updateProduct(prod.id, {
      isAvailable: !prod.isAvailable,
    });
    if (updated) {
      setProducts(marketplaceStore.getProducts({ distributorId }));
      showToast(
        `Product "${prod.title}" is now ${!prod.isAvailable ? "Active (Online)" : "Inactive (Hidden)"}`
      );
    }
  };

  const handleDeleteSingle = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete SKU "${title}"?`)) {
      marketplaceStore.deleteProduct(id);
      setProducts(marketplaceStore.getProducts({ distributorId }));
      showToast(`✓ Product "${title}" deleted.`);
    }
  };

  // Open Quick Edit Modal
  const openQuickEdit = (prod: MockProduct) => {
    setQuickEditProduct(prod);
    setEditWholesalePrice(prod.wholesalePrice);
    setEditCartonMrp(prod.cartonMrp);
    setEditStockQuantity(prod.stockQuantity);
    setEditMinOrderQty(prod.minOrderQty);
    setEditIsAvailable(prod.isAvailable);
  };

  const handleSaveQuickEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEditProduct) return;

    marketplaceStore.updateProduct(quickEditProduct.id, {
      wholesalePrice: Number(editWholesalePrice),
      cartonMrp: Number(editCartonMrp),
      stockQuantity: Number(editStockQuantity),
      minOrderQty: Number(editMinOrderQty),
      isAvailable: editIsAvailable,
    });

    setProducts(marketplaceStore.getProducts({ distributorId }));
    showToast(`✓ SKU "${quickEditProduct.sku}" updated successfully.`);
    setQuickEditProduct(null);
  };

  // =========================================================================
  // CSV IMPORT / EXPORT HANDLERS
  // =========================================================================
  const handleDownloadCsvTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,SKU,Category,Brand,Company,PackSize,UnitsPerCarton,UnitMRP,CartonMRP,WholesalePrice,MOQ,StockQuantity,Barcode,TaxCategory\n" +
      "Wai Wai 123 Chicken,CG-WW-123,Snacks & Confectionery,Wai Wai,CG Foods,30 Pcs x 75g,30,25,750,660,2,200,8901234567,TAXABLE_13\n" +
      "Amul Butter 500g,AML-BUT-500,Dairy & Bakery,Amul,Amul Nepal,20 Packs x 500g,20,450,9000,8100,1,50,8909876543,VAT_EXEMPT";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "b2b_deal_wholesale_product_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportFilteredCsv = () => {
    const headers = [
      "ID",
      "Title",
      "SKU",
      "Barcode",
      "Brand",
      "Company",
      "Category",
      "PackSize",
      "TaxCategory",
      "WholesalePriceNPR",
      "CartonMRPNPR",
      "MOQ",
      "WarehouseStock",
      "Status",
    ];

    const rows = sortedProducts.map((p) => [
      `"${p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.sku}"`,
      `"${p.barcode || ""}"`,
      `"${p.brandName}"`,
      `"${p.companyName || ""}"`,
      `"${p.categoryName}"`,
      `"${p.packSize || ""}"`,
      `"${p.taxCategory === "VAT_EXEMPT" ? "VAT_EXEMPT" : "TAXABLE_13"}"`,
      p.wholesalePrice,
      p.cartonMrp,
      p.minOrderQty,
      p.stockQuantity,
      p.isAvailable ? "ACTIVE" : "INACTIVE",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `distributor_products_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`✓ Exported ${sortedProducts.length} filtered products to CSV.`);
  };

  const handleSimulateCsvUpload = () => {
    marketplaceStore.createProduct({
      id: `prod_bulk_${Date.now()}`,
      distributorId,
      distributorName: "Himalayan FMCG Distributors Pvt. Ltd.",
      companyName: "CG Foods Nepal Pvt. Ltd.",
      categoryId: "cat_snack",
      categoryName: "Snacks & Confectionery",
      brandId: "b_waiwai",
      brandName: "Wai Wai (CG Foods)",
      title: "Wai Wai Quick Masala Noodles (Carton of 30)",
      slug: `wai-wai-quick-masala-carton-30-${Date.now()}`,
      sku: `CG-WW-QCK-${Math.floor(100 + Math.random() * 900)}`,
      description: "Quick Masala wholesale pack. Bulk imported directly from CG factory.",
      unitType: "CARTON",
      packSize: "30 Pcs x 70g",
      unitsPerCarton: 30,
      mrp: 20,
      cartonMrp: 600,
      wholesalePrice: 520,
      minOrderQty: 2,
      stockQuantity: 250,
      isAvailable: true,
      isFeatured: false,
      isApproved: true,
      barcode: "890123450882",
      images: ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"],
      tierPricing: [{ minQty: 2, pricePerCarton: 520 }],
      taxCategory: "TAXABLE_13",
    });

    setProducts(marketplaceStore.getProducts({ distributorId }));
    showToast("✓ CSV bulk import completed! Added new wholesale SKUs to your catalog.");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#102C55] text-white px-5 py-3 rounded-xl shadow-2xl border border-blue-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage("")}
            className="text-slate-300 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          EXECUTIVE KPI SUMMARY CARDS
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total SKUs */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              Total Catalog SKUs
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#102C55] font-mono">
                {stats.total}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {stats.activeCount} Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {stats.vatExemptCount} VAT Exempt • {stats.total - stats.vatExemptCount} Taxable
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0759C7] flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Inventory Value */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              Warehouse Valuation
            </p>
            <p className="text-xl font-black text-[#0759C7] font-mono mt-1">
              {formatNPR(stats.totalInventoryValue)}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Wholesale asset value in stock
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Stock Reorder Alerts */}
        <div
          onClick={() => handleApplyPreset("LOW_STOCK")}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between cursor-pointer hover:border-amber-400 hover:bg-amber-50/20 transition-all group"
          title="Click to filter low stock items"
        >
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider group-hover:text-amber-800">
              Low Stock & Critical
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-600 font-mono">
                {stats.lowStockCount + stats.outOfStockCount}
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {stats.outOfStockCount} Out of Stock
              </span>
            </div>
            <p className="text-[10px] text-amber-700 mt-1 font-semibold">
              Click to view {stats.lowStockCount} items below MOQ
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Active Schemes */}
        <div
          onClick={() => handleApplyPreset("SCHEMES")}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all group"
          title="Click to filter schemed items"
        >
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider group-hover:text-[#0759C7]">
              Schemes & Bonuses
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-purple-700 font-mono">
                {stats.schemesCount}
              </span>
              <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Promotional
              </span>
            </div>
            <p className="text-[10px] text-purple-700 mt-1 font-semibold">
              Buy 5 Get 1 Free, Clearance & Spot CD
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Tag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN HEADER & TOP ACTION TOOLBAR
          ========================================================================= */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#102C55]">
              Wholesale Product Catalog & Inventory Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive multi-column search, dynamic filters, live carton rates, MOQ rules, and bulk wholesale operations
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowColumnFilters((prev) => !prev)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border",
                showColumnFilters
                  ? "bg-blue-50 text-[#0759C7] border-blue-200"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Column Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-[#0759C7] text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button
              onClick={handleExportFilteredCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              title="Export current filtered view to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV ({sortedProducts.length})</span>
            </button>

            <button
              onClick={handleDownloadCsvTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              title="Download CSV format template"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>CSV Template</span>
            </button>

            <button
              onClick={handleSimulateCsvUpload}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
              title="Import wholesale SKUs in bulk"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Bulk CSV Import</span>
            </button>

            <Link href="/distributor/products/new">
              <Button
                variant="primary"
                size="sm"
                className="font-bold text-xs h-9 flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Global Instant Search Bar & Active Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Global Search: title, SKU, barcode, brand, category, company..."
              className="w-full h-9 pl-9 pr-8 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0759C7] font-medium"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Preset Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:inline">
              Presets:
            </span>

            {[
              { id: "ALL" as const, label: "All SKUs" },
              { id: "LOW_STOCK" as const, label: "⚠️ Low Stock (<50)" },
              { id: "OUT_OF_STOCK" as const, label: "🛑 Out of Stock" },
              { id: "SCHEMES" as const, label: "🎁 Schemes & Free Goods" },
              { id: "VAT_EXEMPT" as const, label: "0% VAT Exempt" },
              { id: "TAXABLE" as const, label: "13% Taxable" },
              { id: "ACTIVE_ONLY" as const, label: "Online (Active)" },
              { id: "INACTIVE_ONLY" as const, label: "Hidden (Inactive)" },
            ].map((p) => {
              const isSelected = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                    isSelected
                      ? "bg-[#102C55] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {p.label}
                </button>
              );
            })}

            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ml-1"
                title="Reset all active filters"
              >
                <X className="w-3 h-3" />
                <span>Reset All ({activeFilterCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            DEDICATED MULTI-COLUMN SEARCH & FILTER PANEL
            "make every colume searchable and filter able"
            ========================================================================= */}
        {showColumnFilters && (
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 text-xs">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0759C7]" />
                <span className="font-black text-slate-800 uppercase tracking-wider text-[11px]">
                  Column-by-Column Deep Filters (प्रत्येक स्तम्भ फिल्टर)
                </span>
                {activeFilterCount > 0 && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.2 rounded-full">
                    {activeFilterCount} active filters applied
                  </span>
                )}
              </div>

              <button
                onClick={handleResetFilters}
                className="text-[11px] text-slate-500 hover:text-rose-600 font-semibold underline"
              >
                Clear all filters
              </button>
            </div>

            {/* Grid of Column Specific Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              {/* Col 1: Product Title, SKU, Barcode */}
              <div>
                <label className="font-bold text-slate-700 block text-[11px] mb-1">
                  1. Product / SKU / Barcode
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={colProductSearch}
                    onChange={(e) => {
                      setColProductSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search SKU or title..."
                    className="w-full h-8 px-2.5 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#0759C7]"
                  />
                  {colProductSearch && (
                    <button
                      onClick={() => setColProductSearch("")}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Col 2a: Category */}
              <div>
                <label className="font-bold text-slate-700 block text-[11px] mb-1">
                  2. Category (विधा)
                </label>
                <select
                  value={colCategory}
                  onChange={(e) => {
                    setColCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-[#0759C7]"
                >
                  <option value="ALL">All Categories (सबै)</option>
                  {allCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Col 2b: Brand & Principal Company */}
              <div>
                <label className="font-bold text-slate-700 block text-[11px] mb-1">
                  3. Brand & Principal Company
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={colBrand}
                    onChange={(e) => {
                      setColBrand(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-[#0759C7] truncate"
                    title="Filter by Brand"
                  >
                    <option value="ALL">All Brands</option>
                    {allBrands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={colCompany}
                    onChange={(e) => {
                      setColCompany(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-[#0759C7] truncate"
                    title="Filter by Principal Company"
                  >
                    <option value="ALL">All Companies</option>
                    {allCompanies.map((comp) => (
                      <option key={comp.id} value={comp.name}>
                        {comp.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Col 3: Tax Status & Packaging Unit */}
              <div>
                <label className="font-bold text-slate-700 block text-[11px] mb-1">
                  4. Tax Category & Unit
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={colTaxStatus}
                    onChange={(e) => {
                      setColTaxStatus(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-[#0759C7]"
                  >
                    <option value="ALL">All Taxes</option>
                    <option value="TAXABLE">13% Taxable</option>
                    <option value="VAT_EXEMPT">0% VAT Exempt</option>
                  </select>

                  <select
                    value={colUnitType}
                    onChange={(e) => {
                      setColUnitType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-[#0759C7]"
                  >
                    <option value="ALL">All Units</option>
                    <option value="CARTON">Carton</option>
                    <option value="PACK">Pack</option>
                    <option value="BOX">Box</option>
                    <option value="BAG">Bag</option>
                    <option value="BOTTLE">Bottle</option>
                    <option value="CAN">Can</option>
                  </select>
                </div>
              </div>

              {/* Col 4: Wholesale Rate Range (NPR) */}
              <div>
                <label className="font-bold text-slate-700 block text-[11px] mb-1">
                  5. Wholesale Rate Range (NPR)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={colMinPrice}
                    onChange={(e) => {
                      setColMinPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Min Rs."
                    className="w-1/2 h-8 px-2 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                  <span className="text-slate-400 text-xs">—</span>
                  <input
                    type="number"
                    value={colMaxPrice}
                    onChange={(e) => {
                      setColMaxPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Max Rs."
                    className="w-1/2 h-8 px-2 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              {/* Col 5: Active Schemes & Promotional Offers */}
              <div>
                <label className="font-bold text-slate-700 block text-[11px] mb-1">
                  6. Schemes & Promotions
                </label>
                <select
                  value={colSchemeType}
                  onChange={(e) => {
                    setColSchemeType(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-[#0759C7]"
                >
                  <option value="ALL">All Products (सबै)</option>
                  <option value="ANY_OFFER">🎁 Any Active Scheme / Offer</option>
                  <option value="BUY_GET_SAME">Buy X Get Free (Same SKU)</option>
                  <option value="BUY_GET_ANOTHER">Buy 1 Get Another Free</option>
                  <option value="UNSELLING_CLEARANCE">📦 Clearance / Unselling Bonus</option>
                  <option value="CASH_DISCOUNT">⚡ Spot Cash Discount (%)</option>
                  <option value="TIER_PRICING">📊 Tier / Slab Pricing</option>
                  <option value="FESTIVAL_SPECIAL">🎉 Festival Tagged</option>
                  <option value="NONE">Standard Price (No Offers)</option>
                </select>
              </div>

              {/* Col 6: MOQ (Minimum Order Quantity) */}
              <div>
                <label className="font-bold text-slate-700 block text-[11px] mb-1">
                  7. Minimum Order Qty (MOQ)
                </label>
                <select
                  value={colMoq}
                  onChange={(e) => {
                    setColMoq(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-[#0759C7]"
                >
                  <option value="ALL">All MOQs (कुनै पनि)</option>
                  <option value="1">MOQ: 1 Carton</option>
                  <option value="2-4">MOQ: 2 - 4 Cartons</option>
                  <option value="5+">MOQ: 5+ Cartons</option>
                  <option value="10+">MOQ: 10+ Cartons</option>
                </select>
              </div>

              {/* Col 7: Warehouse Stock & Inventory Status */}
              <div>
                <label className="font-bold text-slate-700 block text-[11px] mb-1">
                  8. Warehouse Stock Status
                </label>
                <select
                  value={colStockStatus}
                  onChange={(e) => {
                    setColStockStatus(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-[#0759C7]"
                >
                  <option value="ALL">All Stock Levels</option>
                  <option value="IN_STOCK">🟢 In Stock (&gt; 0)</option>
                  <option value="LOW_STOCK">⚠️ Low Stock (&lt; 50 ctns)</option>
                  <option value="CRITICAL">🚨 Critical (&lt; 20 ctns)</option>
                  <option value="OUT_OF_STOCK">🛑 Out of Stock (0)</option>
                </select>
              </div>

              {/* Col 8: Catalog Status (Active / Inactive) */}
              <div>
                <label className="font-bold text-slate-700 block text-[11px] mb-1">
                  9. Storefront Visibility
                </label>
                <select
                  value={colStatus}
                  onChange={(e) => {
                    setColStatus(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full h-8 px-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-[#0759C7]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">✓ Active (Available to Retailers)</option>
                  <option value="INACTIVE">✕ Inactive (Hidden / Paused)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          BULK ACTIONS FLOATING TOOLBAR (WHEN ITEMS CHECKED)
          ========================================================================= */}
      {selectedProductIds.length > 0 && (
        <div className="sticky top-20 z-30 p-4 bg-gradient-to-r from-[#102C55] to-[#0759C7] text-white rounded-2xl shadow-xl border border-blue-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-sm">
              {selectedProductIds.length}
            </span>
            <div>
              <p className="font-bold text-sm">
                {selectedProductIds.length} Wholesale SKUs Selected
              </p>
              <p className="text-[11px] text-blue-200">
                Perform bulk inventory adjustments, toggle active status, or export selected
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBulkChangeStatus(true)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              ✓ Set Active
            </button>

            <button
              onClick={() => handleBulkChangeStatus(false)}
              className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
            >
              ✕ Set Inactive
            </button>

            <button
              onClick={() => handleBulkAdjustStock(50)}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
            >
              +50 Stock
            </button>

            <button
              onClick={handleBulkDelete}
              className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => setSelectedProductIds([])}
              className="text-xs text-blue-200 hover:text-white font-semibold underline px-2"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRODUCT CATALOG DATA TABLE
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {/* Table Top Controls & Results Info */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <span>
              Showing <strong className="text-slate-900">{paginatedProducts.length}</strong> of{" "}
              <strong className="text-slate-900">{sortedProducts.length}</strong> filtered products
              {sortedProducts.length !== products.length && (
                <span className="text-slate-400 ml-1">
                  (filtered from {products.length} total)
                </span>
              )}
            </span>

            {activeFilterCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-[#0759C7] font-bold text-[10px]">
                <Filter className="w-2.5 h-2.5" />
                <span>{activeFilterCount} active filters</span>
              </span>
            )}
          </div>

          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-7 px-2 text-xs rounded-lg border border-slate-300 bg-white font-bold"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                {/* Checkbox */}
                <th className="py-3 px-3 text-center w-10">
                  <span className="sr-only">Select All</span>
                  <input
                    type="checkbox"
                    checked={isAllPaginatedSelected}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded text-[#0759C7] focus:ring-1 focus:ring-[#0759C7]"
                    title="Select all products on this page"
                  />
                </th>

                {/* Col 1: Product / SKU */}
                <th className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-1 text-slate-700 hover:text-black font-bold uppercase tracking-wider"
                  >
                    <span>Product / SKU</span>
                    {sortColumn === "title" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="w-3.5 h-3.5 text-[#0759C7]" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-[#0759C7]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </th>

                {/* Col 2: Category & Brand / Company */}
                <th className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort("brand")}
                    className="flex items-center gap-1 text-slate-700 hover:text-black font-bold uppercase tracking-wider"
                  >
                    <span>Brand / Category</span>
                    {sortColumn === "brand" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="w-3.5 h-3.5 text-[#0759C7]" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-[#0759C7]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </th>

                {/* Col 3: Packaging & Tax */}
                <th className="py-3 px-4">Packaging & Tax</th>

                {/* Col 4: Wholesale Rate & MRP */}
                <th className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort("wholesalePrice")}
                    className="inline-flex items-center gap-1 text-slate-700 hover:text-black font-bold uppercase tracking-wider ml-auto"
                  >
                    <span>Wholesale Rate</span>
                    {sortColumn === "wholesalePrice" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="w-3.5 h-3.5 text-[#0759C7]" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-[#0759C7]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </th>

                {/* Col 5: Active Schemes & Offers */}
                <th className="py-3 px-4">Active Schemes & Offers</th>

                {/* Col 6: MOQ */}
                <th className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleSort("moq")}
                    className="inline-flex items-center gap-1 text-slate-700 hover:text-black font-bold uppercase tracking-wider mx-auto"
                  >
                    <span>MOQ</span>
                    {sortColumn === "moq" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="w-3.5 h-3.5 text-[#0759C7]" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-[#0759C7]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </th>

                {/* Col 7: Warehouse Stock */}
                <th className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleSort("stock")}
                    className="inline-flex items-center gap-1 text-slate-700 hover:text-black font-bold uppercase tracking-wider mx-auto"
                  >
                    <span>Warehouse Stock</span>
                    {sortColumn === "stock" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="w-3.5 h-3.5 text-[#0759C7]" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-[#0759C7]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </th>

                {/* Col 8: Status */}
                <th className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleSort("status")}
                    className="inline-flex items-center gap-1 text-slate-700 hover:text-black font-bold uppercase tracking-wider mx-auto"
                  >
                    <span>Status</span>
                    {sortColumn === "status" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="w-3.5 h-3.5 text-[#0759C7]" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-[#0759C7]" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </th>

                {/* Actions */}
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Package className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">
                        No wholesale products match your search/filter criteria
                      </h3>
                      <p className="text-xs text-slate-500">
                        Try adjusting your column filters, price range, or search keywords to find products.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        className="text-xs font-bold"
                      >
                        Reset All Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => {
                  const isSelected = selectedProductIds.includes(prod.id);
                  const isOutOfStock = prod.stockQuantity === 0;
                  const isLowStock = prod.stockQuantity > 0 && prod.stockQuantity < 50;
                  const retailerMarginPercent =
                    prod.cartonMrp > 0
                      ? Math.round(
                          ((prod.cartonMrp - prod.wholesalePrice) / prod.cartonMrp) * 100
                        )
                      : 0;

                  return (
                    <tr
                      key={prod.id}
                      className={cn(
                        "transition-colors",
                        isSelected
                          ? "bg-blue-50/50"
                          : isOutOfStock
                          ? "bg-rose-50/30 hover:bg-rose-50/50"
                          : isLowStock
                          ? "bg-amber-50/20 hover:bg-amber-50/40"
                          : "hover:bg-slate-50/80"
                      )}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSingleSelect(prod.id)}
                          className="w-4 h-4 rounded text-[#0759C7] focus:ring-1 focus:ring-[#0759C7]"
                        />
                      </td>

                      {/* Product / SKU / Barcode */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images?.[0] || "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"}
                            alt={prod.title}
                            className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
                          />
                          <div className="min-w-0 max-w-xs">
                            <Link
                              href={`/products/${prod.slug}`}
                              className="font-bold text-slate-900 hover:text-[#0759C7] transition-colors truncate block text-xs"
                              title={prod.title}
                            >
                              {prod.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                SKU: {prod.sku}
                              </span>
                              {prod.barcode && (
                                <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">
                                  ||| {prod.barcode}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Brand & Principal Company / Category */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{prod.brandName}</p>
                        {prod.companyName && (
                          <p
                            className="text-[10px] font-bold text-[#0759C7] truncate max-w-[140px] flex items-center gap-1"
                            title={prod.companyName}
                          >
                            <Building2 className="w-2.5 h-2.5 shrink-0" />
                            <span>{prod.companyName}</span>
                          </p>
                        )}
                        <span className="inline-block text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded mt-0.5">
                          {prod.categoryName}
                        </span>
                      </td>

                      {/* Packaging & Tax */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <p className="font-semibold text-slate-800">
                          {prod.packSize || `${prod.unitsPerCarton} Pcs/Carton`}
                        </p>
                        <div className="mt-0.5">
                          {prod.taxCategory === "VAT_EXEMPT" ? (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                              0% VAT Exempt
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                              13% Taxable
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Wholesale Rate & MRP */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="font-black text-[#0759C7] text-sm">
                          {formatNPR(prod.wholesalePrice)}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatNPR(prod.cartonMrp)}
                          </span>
                          {retailerMarginPercent > 0 && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                              +{retailerMarginPercent}%
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Active Schemes & Offers */}
                      <td className="py-3.5 px-4 max-w-[230px]">
                        <div className="flex flex-wrap gap-1">
                          {prod.hasFreeScheme && (
                            <span
                              className={cn(
                                "inline-block border text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs",
                                prod.freeSchemeType === "ANOTHER_PRODUCT"
                                  ? "bg-blue-50 text-blue-800 border-blue-200"
                                  : prod.freeSchemeType === "UNSELLING_ITEM"
                                  ? "bg-purple-50 text-purple-800 border-purple-200"
                                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
                              )}
                              title={prod.freeItemName || "Free Goods Scheme"}
                            >
                              {prod.freeSchemeType === "ANOTHER_PRODUCT"
                                ? `🎁 Buy ${prod.freeSchemeMinQty} +${prod.freeItemQty || 1} Free`
                                : prod.freeSchemeType === "UNSELLING_ITEM"
                                ? `📦 Free Clearance: ${
                                    prod.freeItemName
                                      ? prod.freeItemName.slice(0, 14) + "..."
                                      : "Item"
                                  }`
                                : `🎁 Buy ${prod.freeSchemeMinQty} +${prod.freeItemQty || 1} Free`}
                            </span>
                          )}

                          {prod.hasUnsellingBonus && (
                            <span
                              className="inline-block bg-orange-50 text-orange-800 border border-orange-200 text-[10px] font-bold px-1.5 py-0.5 rounded truncate max-w-[150px]"
                              title={`Free Unselling Item on ${prod.unsellingItemMinQty}+ ctns: ${prod.unsellingItemName}`}
                            >
                              📦 +Clearance: {prod.unsellingItemName ? prod.unsellingItemName.slice(0, 12) + ".." : "Gift"}
                            </span>
                          )}

                          {Boolean(prod.cashDiscountPercent && prod.cashDiscountPercent > 0) && (
                            <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              ⚡ {prod.cashDiscountPercent}% Spot CD
                            </span>
                          )}

                          {prod.tierPricing && prod.tierPricing.length > 0 && (
                            <span className="inline-block bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              📊 {prod.tierPricing.length} Slabs
                            </span>
                          )}

                          {prod.festivalTag && (
                            <span className="inline-block bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-black px-1.5 py-0.5 rounded">
                              🎉 {prod.festivalTag}
                            </span>
                          )}

                          {!prod.hasFreeScheme &&
                            !prod.hasUnsellingBonus &&
                            (!prod.cashDiscountPercent || prod.cashDiscountPercent <= 0) &&
                            (!prod.tierPricing || prod.tierPricing.length === 0) &&
                            !prod.festivalTag && (
                              <span className="text-[10px] text-slate-400 italic">
                                Standard Rate
                              </span>
                            )}
                        </div>
                      </td>

                      {/* MOQ */}
                      <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-800">
                        <span className="inline-block bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-xs">
                          {prod.minOrderQty} ctn
                        </span>
                      </td>

                      {/* Warehouse Stock */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            <span>0 Out</span>
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{prod.stockQuantity} ctns</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <span>{prod.stockQuantity} ctns</span>
                          </span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(prod)}
                          className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all shadow-2xs",
                            prod.isAvailable
                              ? "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                              : "bg-slate-200 text-slate-700 border border-slate-300 hover:bg-slate-300"
                          )}
                          title="Click to toggle availability"
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              prod.isAvailable ? "bg-green-600" : "bg-slate-500"
                            )}
                          />
                          <span>{prod.isAvailable ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openQuickEdit(prod)}
                            className="p-1.5 text-slate-500 hover:text-[#0759C7] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Quick edit rate and stock"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="View product storefront"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteSingle(prod.id, prod.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete SKU"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* =========================================================================
            PROFESSIONAL PAGINATION CONTROLS
            ========================================================================= */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Page <strong className="text-slate-800">{currentPage}</strong> of{" "}
            <strong className="text-slate-800">{totalPages}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title="First Page"
            >
              <ChevronsLeft className="w-3.5 h-3.5 text-slate-600" />
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
              <span>Prev</span>
            </button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((pageNum, idx, arr) => {
                const prev = arr[idx - 1];
                return (
                  <React.Fragment key={pageNum}>
                    {prev && pageNum - prev > 1 && (
                      <span className="px-1 text-slate-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-8 h-8 rounded-lg font-bold text-xs transition-colors",
                        currentPage === pageNum
                          ? "bg-[#0759C7] text-white shadow-xs"
                          : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      {pageNum}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Last Page"
            >
              <ChevronsRight className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          QUICK EDIT MODAL (RATE, STOCK, MOQ, AVAILABILITY)
          ========================================================================= */}
      {quickEditProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-black text-[#102C55]">
                  Quick Edit Wholesale Product
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update rates, warehouse inventory, and MOQ rules instantly
                </p>
              </div>
              <button
                onClick={() => setQuickEditProduct(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Read-only product summary */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
              <img
                src={quickEditProduct.images?.[0] || ""}
                alt={quickEditProduct.title}
                className="w-10 h-10 rounded-lg object-cover border border-slate-200"
              />
              <div className="min-w-0">
                <p className="font-bold text-xs text-slate-900 truncate">
                  {quickEditProduct.title}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  SKU: {quickEditProduct.sku} • {quickEditProduct.brandName} •{" "}
                  {quickEditProduct.packSize}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveQuickEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* Wholesale Price */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Wholesale Price (NPR per ctn)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editWholesalePrice}
                    onChange={(e) => setEditWholesalePrice(parseFloat(e.target.value) || 0)}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#0759C7]"
                  />
                </div>

                {/* Carton MRP */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Carton MRP (NPR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editCartonMrp}
                    onChange={(e) => setEditCartonMrp(parseFloat(e.target.value) || 0)}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#0759C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Stock Quantity */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Warehouse Stock (Cartons)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editStockQuantity}
                    onChange={(e) => setEditStockQuantity(parseInt(e.target.value, 10) || 0)}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#0759C7]"
                  />
                </div>

                {/* Minimum Order Qty */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Minimum Order Qty (MOQ)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editMinOrderQty}
                    onChange={(e) => setEditMinOrderQty(parseInt(e.target.value, 10) || 1)}
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#0759C7]"
                  />
                </div>
              </div>

              {/* Availability Status Toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Storefront Availability</p>
                  <p className="text-[10px] text-slate-500">
                    When inactive, retailers cannot add this SKU to cart
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditIsAvailable((prev) => !prev)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold transition-colors",
                    editIsAvailable
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-300 text-slate-700"
                  )}
                >
                  {editIsAvailable ? "Active (Online)" : "Inactive (Hidden)"}
                </button>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickEditProduct(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="font-bold">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
