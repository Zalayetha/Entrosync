import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { useTranslation } from "@repo/ui/i18n";
import type { InvoiceStatus, ProjectDetail } from "../../types";
import { formatCurrencyAmount } from "../../utils";

interface ProjectInvoicesWidgetProps {
  project: ProjectDetail;
  onToggleStatus: (invoiceId: string) => void;
}

export function ProjectInvoicesWidget({ project, onToggleStatus }: ProjectInvoicesWidgetProps) {
  const { t } = useTranslation();
  const paidTotals = project.invoices.reduce(
    (acc, invoice) => {
      if (invoice.status === "PAID") {
        acc[invoice.currency] += invoice.amount;
      }
      return acc;
    },
    { IDR: 0, USD: 0 },
  );
  const latestInvoices = project.invoices.slice(0, 3);

  return (
    <Card className="p-0">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-sm font-semibold">{t("project.invoices.title")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 p-4 pt-0">
        <div className="grid grid-cols-2 gap-2">
          <BillingTotal label="IDR" value={formatCurrencyAmount(paidTotals.IDR, "IDR")} />
          <BillingTotal label="USD" value={formatCurrencyAmount(paidTotals.USD, "USD")} />
        </div>

        <div className="grid gap-2">
          {latestInvoices.map((invoice) => (
            <div key={invoice.id} className="grid gap-2 rounded-lg border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {invoice.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrencyAmount(invoice.amount, invoice.currency)}
                  </p>
                </div>
                <Badge variant="outline">
                  {t(`project.invoiceStatus.${invoice.status as InvoiceStatus}`)}
                </Badge>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 justify-self-start"
                onClick={() => onToggleStatus(invoice.id)}
              >
                {invoice.status === "PAID"
                  ? t("project.invoices.markPending")
                  : t("project.invoices.markPaid")}
              </Button>
            </div>
          ))}
          {latestInvoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("project.sidebar.noInvoices")}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function BillingTotal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
