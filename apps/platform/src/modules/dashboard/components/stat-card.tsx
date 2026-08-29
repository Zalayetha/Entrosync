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
        "relative min-h-32 overflow-hidden p-0 transition-colors hover:border-primary/30",
        className,
      )}
    >
      <CardContent className="relative flex h-full flex-col justify-between gap-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <div className="text-2xl font-semibold text-foreground tabular-nums sm:text-3xl">
              {value}
            </div>
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
            <WatermarkIcon className="size-4" />
          </span>
        </div>

        {helper ? (
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            {HelperIcon ? (
              <HelperIcon className={cn("size-4 shrink-0", helperIconClassName)} />
            ) : null}
            <span>{helper}</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return <Skeleton className="h-32 w-full rounded-lg" />;
}
