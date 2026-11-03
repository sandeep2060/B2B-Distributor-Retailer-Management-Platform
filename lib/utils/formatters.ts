/**
 * Format currency in Nepalese Rupees (NPR)
 */
export function formatNPR(amount: number | string | null | undefined, includeDecimals = true): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "Rs. 0";
  }

  const num = Number(amount);
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(num);

  return `Rs. ${formatted}`;
}

/**
 * Format currency with Nepali symbol 'रू'
 */
export function formatNepaliRupee(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "रू ०";
  }
  return `रू ${new Intl.NumberFormat("en-IN").format(Number(amount))}`;
}

/**
 * Format Date to readable format
 */
export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format Date with time
 */
export function formatDateTime(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Validate Nepal Mobile Number (e.g. 9841234567 or 9741234567)
 */
export function isValidNepalPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  // Nepal mobile numbers start with 97 or 98 and are 10 digits; or 01 landline (8 digits)
  return /^((98|97)\d{8}|01\d{6,7})$/.test(cleaned);
}

/**
 * Validate Nepal 9-digit PAN/VAT number
 */
export function isValidNepalPan(pan: string): boolean {
  const cleaned = pan.replace(/\D/g, "");
  return /^\d{9}$/.test(cleaned);
}

/**
 * Calculate VAT (13%)
 */
export function calculateVat(taxableAmount: number, vatRate = 0.13): {
  taxable: number;
  vat: number;
  total: number;
} {
  const taxable = Math.round(taxableAmount * 100) / 100;
  const vat = Math.round(taxable * vatRate * 100) / 100;
  const total = Math.round((taxable + vat) * 100) / 100;
  return { taxable, vat, total };
}
