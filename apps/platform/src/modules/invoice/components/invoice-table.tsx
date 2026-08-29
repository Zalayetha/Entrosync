import { useTranslation } from "@repo/ui/i18n";
import { Card } from "@repo/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { FileText } from "lucide-react";
import type { Invoice } from "../types";
import { InvoiceRow } from "./invoice-row";

interface InvoiceTableProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
}

export function InvoiceTable({ invoices, onSelectInvoice }: InvoiceTableProps) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden border p-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[140px] text-xs font-semibold uppercase tracking-wider">
              {t("invoice.table.id")}
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider">
              {t("invoice.table.project")}
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider">
              {t("invoice.table.amount")}
            </TableHead>
            <TableHead className="w-[120px] text-xs font-semibold uppercase tracking-wider">
              {t("invoice.table.status")}
            </TableHead>
            <TableHead className="w-[130px] text-xs font-semibold uppercase tracking-wider">
              {t("invoice.table.issued")}
            </TableHead>
            <TableHead className="w-[140px] text-xs font-semibold uppercase tracking-wider">
              {t("invoice.table.due")}
            </TableHead>
            <TableHead className="w-[60px] text-right text-xs font-semibold uppercase tracking-wider" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <FileText className="size-10 text-muted-foreground/40" />
                  <p className="font-medium text-foreground">{t("invoice.table.empty")}</p>
                  <p className="text-sm text-muted-foreground">{t("invoice.table.emptyHelper")}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <InvoiceRow key={invoice.id} invoice={invoice} onSelect={onSelectInvoice} />
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
