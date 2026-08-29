import { Card, CardContent } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  helper?: ReactNode;
  helperIcon?: LucideIcon;
  helperIconClassName?: string;
  watermarkIcon: LucideIcon;
  className?: string;
}

export function StatCard({
  className,
  helper,
  helperIcon: HelperIcon,
  helperIconClassName,
  label,
  value,
  watermarkIcon: WatermarkIcon,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative min-h-36 overflow-hidden rounded-2xl border bg-card p-0 shadow-sm",
        className,
      )}
    >
      <CardContent className="relative flex h-full flex-col justify-between gap-6 p-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <div className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {value}
          </div>
        </div>

        {helper ? (
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            {HelperIcon ? (
              <HelperIcon className={cn("size-4 shrink-0", helperIconClassName)} />
            ) : null}
            <span>{helper}</span>
          </div>
        ) : null}

        <WatermarkIcon
          aria-hidden="true"
          className="pointer-events-none absolute right-4 bottom-4 size-14 text-muted-foreground/15"
        />
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return <Skeleton className="h-36 w-full rounded-2xl" />;
}
