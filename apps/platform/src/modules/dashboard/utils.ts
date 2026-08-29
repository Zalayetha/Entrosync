import type { Currency } from "./types";

export function formatCurrency(amount: number, currency: Currency = "IDR"): string {
  if (currency === "IDR") {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
}

export function formatPayoutDate(dateString?: string | null): { month: string; day: string } {
  if (!dateString) {
    return { month: "--", day: "--" };
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return { month: "--", day: "--" };
  }
  const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = String(date.getDate()).padStart(2, "0");
  return { month, day };
}
