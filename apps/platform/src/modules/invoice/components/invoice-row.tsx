import { TableCell, TableRow } from "@repo/ui/components/table";
import type { Invoice } from "../types";
import { formatInvoiceAmount, formatInvoiceDate, isInvoiceOverdue } from "../utils";
import { InvoiceDownloadButton } from "./invoice-download-button";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface InvoiceRowProps {
  invoice: Invoice;
  onSelect: (invoice: Invoice) => void;
}

export function InvoiceRow({ invoice, onSelect }: InvoiceRowProps) {
  const isOverdue = isInvoiceOverdue(invoice);

  return (
    <TableRow
      className="cursor-pointer transition-colors hover:bg-muted/50"
      onClick={() => onSelect(invoice)}
    >
      <TableCell className="font-mono text-xs font-semibold text-foreground">
        #{invoice.id}
      </TableCell>
      <TableCell className="max-w-[200px] truncate font-medium text-foreground">
        {invoice.project.title}
      </TableCell>
      <TableCell className="font-semibold text-foreground">
        {formatInvoiceAmount(invoice.amount, invoice.currency)}
      </TableCell>
      <TableCell>
        <InvoiceStatusBadge status={invoice.status} />
      </TableCell>
      <TableCell className="text-muted-foreground text-xs">
        {formatInvoiceDate(invoice.issuedDate)}
      </TableCell>
      <TableCell
        className={`text-xs ${
          isOverdue ? "font-semibold text-red-600 dark:text-red-400" : "text-muted-foreground"
        }`}
      >
        {formatInvoiceDate(invoice.dueDate)}
        {isOverdue ? " (Overdue)" : ""}
      </TableCell>
      <TableCell className="text-right">
        <InvoiceDownloadButton invoice={invoice} />
      </TableCell>
    </TableRow>
  );
}
