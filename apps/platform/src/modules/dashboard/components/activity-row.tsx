import { cn } from "@repo/ui/lib/utils";
import { CheckCircle2, FileText, History, Wallet, type LucideIcon } from "lucide-react";
import type { ActivityAction, DashboardActivity } from "../types";
import { formatRelativeTime } from "../utils";

interface ActivityRowProps {
  activity: DashboardActivity;
  className?: string;
}

interface ActionBadgeConfig {
  icon: LucideIcon;
  badgeClassName: string;
}

function getActivityBadgeConfig(action: ActivityAction): ActionBadgeConfig {
  switch (action) {
    case "MILESTONE_COMPLETED":
      return {
        icon: CheckCircle2,
        badgeClassName: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      };
    case "INVOICE_PAID":
      return {
        icon: Wallet,
        badgeClassName: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
      };
    case "INVOICE_ISSUED":
      return {
        icon: FileText,
        badgeClassName: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
      };
    default:
      return {
        icon: History,
        badgeClassName: "bg-muted text-muted-foreground",
      };
  }
}

export function ActivityRow({ activity, className }: ActivityRowProps) {
  const { badgeClassName, icon: Icon } = getActivityBadgeConfig(activity.action);

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3.5">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            badgeClassName,
          )}
        >
          <Icon className="size-4 shrink-0" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-sm font-medium text-foreground">{activity.title}</p>
          {activity.description ? (
            <p className="line-clamp-1 text-xs text-muted-foreground">{activity.description}</p>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {formatRelativeTime(activity.createdAt)}
        </span>
      </div>
    </div>
  );
}
