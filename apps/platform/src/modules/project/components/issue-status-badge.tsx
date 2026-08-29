import { Badge } from "@repo/ui/components/badge";
import { useTranslation } from "@repo/ui/i18n";
import { cn } from "@repo/ui/lib/utils";
import type { IssueStatus } from "../types";

interface IssueStatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

const statusClassNames: Record<IssueStatus, string> = {
  BACKLOG: "border-muted-foreground/20 bg-muted text-muted-foreground",
  TODO: "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  IN_PROGRESS: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  IN_REVIEW: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  DONE: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  CANCELLED: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
};

export function IssueStatusBadge({ status, className }: IssueStatusBadgeProps) {
  const { t } = useTranslation();

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-semibold uppercase tracking-wide",
        statusClassNames[status],
        className,
      )}
    >
      {t(`project.issueStatus.${status}`)}
    </Badge>
  );
}
