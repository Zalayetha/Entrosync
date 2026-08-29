import { cn } from "@repo/ui/lib/utils";
import type { DashboardPayout } from "../types";
import { formatCurrency, formatPayoutDate } from "../utils";

interface PayoutRowProps {
  payout: DashboardPayout;
  className?: string;
}

export function PayoutRow({ className, payout }: PayoutRowProps) {
  const { day, month } = formatPayoutDate(payout.dueDate ?? payout.issuedDate);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-muted text-center">
          <span className="text-[10px] font-semibold uppercase leading-none tracking-wider text-muted-foreground">
            {month}
          </span>
          <span className="text-sm font-bold leading-tight text-foreground">{day}</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{payout.projectTitle}</p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(payout.amount, payout.currency)}
        </span>
      </div>
    </div>
  );
}
