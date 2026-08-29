import { useTranslation } from "@repo/ui/i18n";
import { Button } from "@repo/ui/components/button";
import { PlusCircle } from "lucide-react";
import { InvoiceSummaryCards } from "../components/invoice-summary-cards";
import { InvoiceTable } from "../components/invoice-table";
import type { Invoice } from "../types";

interface InvoiceListSectionProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onCreateNew: () => void;
}

export function InvoiceListSection({
  invoices,
  onSelectInvoice,
  onCreateNew,
}: InvoiceListSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-foreground">{t("invoice.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("invoice.subtitle")}</p>
        </div>
        <Button onClick={onCreateNew} className="gap-2 self-start sm:self-auto">
          <PlusCircle className="size-4" />
          <span>{t("invoice.newInvoice")}</span>
        </Button>
      </div>

      <InvoiceSummaryCards invoices={invoices} />

      <div className="space-y-3">
        <InvoiceTable invoices={invoices} onSelectInvoice={onSelectInvoice} />
      </div>
    </div>
  );
}
