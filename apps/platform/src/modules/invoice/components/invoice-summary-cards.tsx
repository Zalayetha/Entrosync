import { useTranslation } from "@repo/ui/i18n";
import { Card, CardContent } from "@repo/ui/components/card";
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import type { Invoice } from "../types";
import { formatInvoiceAmount, groupInvoiceTotalsByCurrency, isInvoiceOverdue } from "../utils";

interface InvoiceSummaryCardsProps {
  invoices: Invoice[];
}

export function InvoiceSummaryCards({ invoices }: InvoiceSummaryCardsProps) {
  const { t } = useTranslation();

  const pendingInvoices = invoices.filter((inv) => inv.status === "PENDING");
  const paidInvoices = invoices.filter((inv) => inv.status === "PAID");
  const overdueInvoices = invoices.filter(isInvoiceOverdue);

  const pendingTotals = groupInvoiceTotalsByCurrency(pendingInvoices);
  const paidTotals = groupInvoiceTotalsByCurrency(paidInvoices);

  const pendingPercent =
    invoices.length > 0 ? Math.round((pendingInvoices.length / invoices.length) * 100) : 0;

  const renderTotals = (totals: Record<"IDR" | "USD", number>) => {
    const hasIdr = totals.IDR > 0;
    const hasUsd = totals.USD > 0;

    if (!hasIdr && !hasUsd) {
      return <p className="text-3xl font-semibold leading-none">Rp 0</p>;
    }

    return (
      <div className="flex flex-col gap-1">
        {hasIdr ? (
          <p className="text-2xl sm:text-3xl font-semibold leading-tight">
            {formatInvoiceAmount(totals.IDR, "IDR")}
          </p>
        ) : null}
        {hasUsd ? (
          <p className="text-xl sm:text-2xl font-medium leading-tight text-muted-foreground">
            {formatInvoiceAmount(totals.USD, "USD")}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Card 1: Outstanding */}
      <Card className="min-h-40 overflow-hidden">
        <CardContent className="relative flex h-full flex-col justify-between gap-4 p-6">
          <div className="grid gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("invoice.summary.totalOutstanding")}
            </p>
            {renderTotals(pendingTotals)}
          </div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="size-4" />
            <span>{pendingPercent}% outstanding</span>
          </p>
          <Clock className="absolute bottom-4 right-4 size-12 text-muted-foreground/10" />
        </CardContent>
      </Card>

      {/* Card 2: Paid This Month */}
      <Card className="min-h-40 overflow-hidden">
        <CardContent className="relative flex h-full flex-col justify-between gap-4 p-6">
          <div className="grid gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("invoice.summary.paidThisMonth")}
            </p>
            {renderTotals(paidTotals)}
          </div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>{paidInvoices.length} paid</span>
          </p>
          <CheckCircle2 className="absolute bottom-4 right-4 size-12 text-muted-foreground/10" />
        </CardContent>
      </Card>

      {/* Card 3: Overdue */}
      <Card className="min-h-40 overflow-hidden">
        <CardContent className="relative flex h-full flex-col justify-between gap-4 p-6">
          <div className="grid gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("invoice.summary.overdueCount")}
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-4xl font-bold leading-none ${
                  overdueInvoices.length > 0 ? "text-red-600 dark:text-red-500" : "text-foreground"
                }`}
              >
                {overdueInvoices.length}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {t("invoice.summary.invoicesLabel")}
              </span>
            </div>
          </div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <AlertCircle
              className={`size-4 ${
                overdueInvoices.length > 0 ? "text-red-500" : "text-muted-foreground"
              }`}
            />
            <span>
              {overdueInvoices.length > 0 ? "Requires immediate attention" : "No overdue invoices"}
            </span>
          </p>
          <AlertCircle className="absolute bottom-4 right-4 size-12 text-muted-foreground/10" />
        </CardContent>
      </Card>
    </div>
  );
}
