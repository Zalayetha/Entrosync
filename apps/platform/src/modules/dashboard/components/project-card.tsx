import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import { useTranslation } from "@repo/ui/i18n";
import { cn } from "@repo/ui/lib/utils";
import type { DashboardProject, ProjectStatus } from "../types";

interface ProjectCardProps {
  project: DashboardProject;
}

function getStatusBadgeConfig(status: ProjectStatus, t: (key: string) => string) {
  switch (status) {
    case "BACKLOG":
      return {
        label: t("dashboard.activeProjects.status.backlog"),
        variant: "outline" as const,
        className: "uppercase text-[11px] font-semibold tracking-wider",
      };
    case "PLANNED":
      return {
        label: t("dashboard.activeProjects.status.planned"),
        variant: "secondary" as const,
        className: "uppercase text-[11px] font-semibold tracking-wider",
      };
    case "IN_PROGRESS":
      return {
        label: t("dashboard.activeProjects.status.inProgress"),
        variant: "default" as const,
        className:
          "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 uppercase text-[11px] font-semibold tracking-wider hover:bg-emerald-500/20",
      };
    case "COMPLETED":
      return {
        label: t("dashboard.activeProjects.status.completed"),
        variant: "default" as const,
        className:
          "border-transparent bg-sky-500/15 text-sky-600 dark:text-sky-400 uppercase text-[11px] font-semibold tracking-wider hover:bg-sky-500/20",
      };
    case "CANCELLED":
      return {
        label: t("dashboard.activeProjects.status.cancelled"),
        variant: "destructive" as const,
        className:
          "border-transparent bg-red-500/15 text-red-600 dark:text-red-400 uppercase text-[11px] font-semibold tracking-wider hover:bg-red-500/20",
      };
    default:
      return {
        label: status,
        variant: "outline" as const,
        className: "uppercase text-[11px] font-semibold tracking-wider",
      };
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useTranslation();
  const badgeConfig = getStatusBadgeConfig(project.status, t);

  return (
    <Card className="rounded-2xl border bg-card p-0 shadow-sm transition-all hover:border-primary/30">
      <CardContent className="grid gap-6 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="grid min-w-0 gap-1.5">
            <h3 className="truncate text-base font-semibold leading-snug text-foreground">
              {project.title}
            </h3>
            <p className="truncate text-sm font-medium text-muted-foreground">
              {project.clientName}
            </p>
          </div>
          <Badge className={cn("shrink-0", badgeConfig.className)} variant={badgeConfig.variant}>
            {badgeConfig.label}
          </Badge>
        </div>

        <div className="grid gap-2.5">
          <div className="flex items-center justify-between gap-4 text-sm font-medium">
            <span className="text-muted-foreground">
              {t("dashboard.activeProjects.completion")}
            </span>
            <span className="font-semibold text-foreground">{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>
      </CardContent>
    </Card>
  );
}
