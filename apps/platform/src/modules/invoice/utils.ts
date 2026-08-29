import type { Currency, Invoice } from "./types";

export function formatInvoiceAmount(amount: number, currency: Currency): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function groupInvoiceTotalsByCurrency(invoices: Invoice[]): Record<Currency, number> {
  return invoices.reduce(
    (acc, inv) => {
      acc[inv.currency] = (acc[inv.currency] || 0) + Number(inv.amount || 0);
      return acc;
    },
    { IDR: 0, USD: 0 } as Record<Currency, number>,
  );
}

export function isInvoiceOverdue(invoice: Invoice): boolean {
  if (invoice.status !== "PENDING" || !invoice.dueDate) return false;
  return new Date(invoice.dueDate).getTime() < Date.now();
}

export function addDays(dateStr: string, days: number): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0]!;
}

export function formatInvoiceDate(
  dateStr?: string | null,
  locale = "id-ID",
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(locale, options).format(date);
}
