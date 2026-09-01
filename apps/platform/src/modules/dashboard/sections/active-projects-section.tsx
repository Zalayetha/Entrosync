import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@repo/ui/components/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { useTranslation } from "@repo/ui/i18n";
import { cn } from "@repo/ui/lib/utils";
import { BarChart3 } from "lucide-react";
import { SectionHeader } from "../components/section-header";
import type { DashboardProject, ProjectStatus } from "../types";

interface ActiveProjectsSectionProps {
  projects: DashboardProject[];
}

export function ActiveProjectsSection({ projects }: ActiveProjectsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-3">
      <SectionHeader
        actionHref="/project"
        actionLabel={t("dashboard.viewAll")}
        icon={BarChart3}
        title={t("dashboard.activeProjects.title")}
      />

      {projects.length > 0 ? (
        <>
          <Card className="hidden overflow-hidden p-0 md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>{t("dashboard.activeProjects.table.project")}</TableHead>
                  <TableHead>{t("dashboard.activeProjects.table.client")}</TableHead>
                  <TableHead className="w-[220px]">
                    {t("dashboard.activeProjects.completion")}
                  </TableHead>
                  <TableHead className="w-[140px]">
                    {t("dashboard.activeProjects.table.status")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const badgeConfig = getStatusBadgeConfig(project.status, t);

                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="grid gap-0.5">
                          <span className="font-medium text-foreground">{project.title}</span>
                          {project.description ? (
                            <span className="max-w-[28rem] truncate text-xs text-muted-foreground">
                              {project.description}
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{project.clientName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress
                            className="w-auto min-w-0 flex-1 basis-0"
                            value={project.progress}
                          />
                          <span className="w-9 text-right text-xs font-medium text-muted-foreground tabular-nums">
                            {project.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("shrink-0", badgeConfig.className)} variant="outline">
                          {badgeConfig.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          <Card className="overflow-hidden p-0 md:hidden">
            <CardContent className="divide-y p-0">
              {projects.map((project) => {
                const badgeConfig = getStatusBadgeConfig(project.status, t);

                return (
                  <div key={project.id} className="grid gap-4 p-5">
                    <div className="grid gap-2">
                      <div className="grid min-w-0 gap-1">
                        <span className="font-medium text-foreground">{project.title}</span>
                        <span className="truncate text-sm text-muted-foreground">
                          {project.clientName}
                        </span>
                      </div>
                      <Badge className={cn("shrink-0", badgeConfig.className)} variant="outline">
                        {badgeConfig.label}
                      </Badge>
                    </div>
                    <div className="grid gap-2">
                      <Progress className="w-full" value={project.progress} />
                      <span className="text-xs font-medium text-muted-foreground tabular-nums">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </>
      ) : (
        <Empty>
          <EmptyMedia variant="icon">
            <BarChart3 className="size-5" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>{t("dashboard.activeProjects.empty")}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  );
}

function getStatusBadgeConfig(status: ProjectStatus, t: (key: string) => string) {
  switch (status) {
    case "BACKLOG":
      return {
        label: t("dashboard.activeProjects.status.backlog"),
        className: "uppercase text-[11px] font-semibold tracking-wide",
      };
    case "PLANNED":
      return {
        label: t("dashboard.activeProjects.status.planned"),
        className: "uppercase text-[11px] font-semibold tracking-wide",
      };
    case "IN_PROGRESS":
      return {
        label: t("dashboard.activeProjects.status.inProgress"),
        className:
          "border-transparent bg-emerald-500/10 text-emerald-700 uppercase text-[11px] font-semibold tracking-wide dark:text-emerald-400",
      };
    case "COMPLETED":
      return {
        label: t("dashboard.activeProjects.status.completed"),
        className:
          "border-transparent bg-sky-500/10 text-sky-700 uppercase text-[11px] font-semibold tracking-wide dark:text-sky-400",
      };
    case "CANCELLED":
      return {
        label: t("dashboard.activeProjects.status.cancelled"),
        className:
          "border-transparent bg-red-500/10 text-red-700 uppercase text-[11px] font-semibold tracking-wide dark:text-red-400",
      };
    default:
      return {
        label: status,
        className: "uppercase text-[11px] font-semibold tracking-wide",
      };
  }
}
