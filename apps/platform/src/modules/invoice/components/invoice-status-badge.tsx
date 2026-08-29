import { useTranslation } from "@repo/ui/i18n";
import { Badge } from "@repo/ui/components/badge";
import { cn } from "@repo/ui/lib/utils";
import type { InvoiceStatus } from "../types";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const { t } = useTranslation();

  if (status === "PAID") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "border-emerald-500/30 bg-emerald-500/15 font-semibold text-emerald-700 dark:text-emerald-400",
          className,
        )}
      >
        {t("invoice.status.paid")}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-amber-500/30 bg-amber-500/15 font-semibold text-amber-700 dark:text-amber-400",
        className,
      )}
    >
      {t("invoice.status.pending")}
    </Badge>
  );
}
