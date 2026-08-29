import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { useTranslation } from "@repo/ui/i18n";
import type { InvoiceStatus, ProjectDetail } from "../../types";
import { formatCurrencyAmount, formatProjectDate } from "../../utils";

interface ProjectInvoicesTabProps {
  project: ProjectDetail;
  onToggleStatus: (invoiceId: string) => void;
}

export function ProjectInvoicesTab({ project, onToggleStatus }: ProjectInvoicesTabProps) {
  const { t, i18n } = useTranslation();
  const totals = project.invoices.reduce(
    (acc, invoice) => {
      acc[invoice.currency] += invoice.amount;
      return acc;
    },
    { IDR: 0, USD: 0 },
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <SummaryCard label="IDR" value={formatCurrencyAmount(totals.IDR, "IDR")} />
        <SummaryCard label="USD" value={formatCurrencyAmount(totals.USD, "USD")} />
      </div>
      <Card className="p-0">
        <CardHeader>
          <CardTitle>{t("project.invoices.title")}</CardTitle>
        </CardHeader>
        <CardContent className="divide-y p-0">
          {project.invoices.map((invoice) => (
            <div key={invoice.id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1 space-y-1">
                <h3 className="font-semibold text-foreground">{invoice.description}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatProjectDate(
                    invoice.issuedDate,
                    i18n.language === "id" ? "id-ID" : "en-US",
                  )}{" "}
                  - {formatProjectDate(invoice.dueDate, i18n.language === "id" ? "id-ID" : "en-US")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-foreground">
                  {formatCurrencyAmount(invoice.amount, invoice.currency)}
                </span>
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                  {t(`project.invoiceStatus.${invoice.status as InvoiceStatus}`)}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleStatus(invoice.id)}
                >
                  {invoice.status === "PAID"
                    ? t("project.invoices.markPending")
                    : t("project.invoices.markPaid")}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-0">
      <CardContent className="p-4">
        <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}
