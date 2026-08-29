import { Badge } from "@repo/ui/components/badge";
import { useTranslation } from "@repo/ui/i18n";
import { cn } from "@repo/ui/lib/utils";
import type { ProjectStatus } from "../types";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const statusClassNames: Record<ProjectStatus, string> = {
  BACKLOG: "border-muted-foreground/20 bg-muted text-muted-foreground",
  PLANNED: "border-indigo-500/20 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  IN_PROGRESS: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  COMPLETED: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  CANCELLED: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
};

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  const { t } = useTranslation();

  return (
    <Badge
      variant="outline"
      className={cn(
        "shrink-0 text-[11px] font-semibold uppercase tracking-wide",
        statusClassNames[status],
        className,
      )}
    >
      {t(`project.status.${status}`)}
    </Badge>
  );
}
