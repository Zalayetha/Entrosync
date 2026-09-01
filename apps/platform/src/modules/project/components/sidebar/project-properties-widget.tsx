import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { toast } from "@repo/ui/components/sonner";
import { useTranslation } from "@repo/ui/i18n";
import { Copy, ExternalLink } from "lucide-react";
import { useMemo } from "react";
import type { ProjectDetail, ProjectHealth, ProjectStatus } from "../../types";
import {
  calculateCompletedIssuesCount,
  calculateProjectHealth,
  calculateProjectProgress,
  calculateTotalIssuesCount,
  formatProjectDate,
  getRemainingDays,
} from "../../utils";

interface ProjectPropertiesWidgetProps {
  project: ProjectDetail;
  onStatusChange: (status: ProjectStatus) => void;
}

const projectStatuses: ProjectStatus[] = [
  "BACKLOG",
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const healthClassName: Record<ProjectHealth, string> = {
  ON_TRACK: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  AT_RISK: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  BEHIND: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

export function ProjectPropertiesWidget({ project, onStatusChange }: ProjectPropertiesWidgetProps) {
  const { t, i18n } = useTranslation();
  const progress = calculateProjectProgress(project);
  const completed = calculateCompletedIssuesCount(project);
  const total = calculateTotalIssuesCount(project);
  const health = calculateProjectHealth(project);
  const locale = i18n.language === "id" ? "id-ID" : "en-US";
  const remainingDays = getRemainingDays(project.targetDate);
  const lead = project.teams[0] || null;
  const latestInvite = project.invites[0] || null;
  const portalLink = useMemo(() => {
    const token = latestInvite?.token || project.slug;
    return `https://client.entrosync.com/p/${token}`;
  }, [latestInvite, project.slug]);
  const quickResources = project.resources.slice(0, 3);

  const handleCopyPortal = async () => {
    try {
      await navigator.clipboard.writeText(portalLink);
      toast.success(t("project.toasts.copied"));
    } catch {
      toast.error(t("project.toasts.copyFailed"));
    }
  };

  return (
    <Card className="min-w-0 p-0">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold">{t("project.sidebar.properties")}</CardTitle>
          <Badge variant="outline" className={healthClassName[health]}>
            {t(`project.health.${health}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid min-w-0 gap-4 p-4 pt-0 text-sm">
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">{t("project.metrics.progress")}</span>
            <span className="font-semibold tabular-nums">
              {progress}% · {completed}/{total}
            </span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="divide-y divide-border/50">
          <PropertyRow label={t("project.fields.clientName")}>{project.clientName}</PropertyRow>
          <PropertyRow label={t("project.sidebar.lead")}>{lead?.name || "-"}</PropertyRow>
          <PropertyRow label={t("project.fields.status")}>
            <Select
              value={project.status}
              onValueChange={(value) => onStatusChange(value as ProjectStatus)}
            >
              <SelectTrigger className="h-8 w-36 border-0 bg-muted px-2 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {projectStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(`project.status.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PropertyRow>
          <PropertyRow label={t("project.fields.targetDate")}>
            <span className="text-right">
              {formatProjectDate(project.targetDate, locale)}
              {remainingDays !== null ? (
                <span className="block text-xs text-muted-foreground">
                  {remainingDays < 0
                    ? t("project.list.overdue")
                    : t("project.list.daysLeft", { count: remainingDays })}
                </span>
              ) : null}
            </span>
          </PropertyRow>
          <PropertyRow label={t("project.sidebar.team")}>
            {project.teams.length > 0 ? (
              <AvatarGroup>
                {project.teams.slice(0, 4).map((member) => (
                  <Avatar key={member.id} size="sm">
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                ))}
                {project.teams.length > 4 ? (
                  <AvatarGroupCount className="size-6 text-xs">
                    +{project.teams.length - 4}
                  </AvatarGroupCount>
                ) : null}
              </AvatarGroup>
            ) : (
              <span className="text-xs text-muted-foreground">{t("project.sidebar.noTeam")}</span>
            )}
          </PropertyRow>
        </div>

        <div className="grid min-w-0 gap-2 rounded-lg border bg-muted/30 p-3">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            {t("project.invites.portalLink")}
          </span>
          <div className="flex min-w-0 items-center gap-2">
            <code className="block min-w-0 flex-1 truncate text-xs text-muted-foreground">
              {portalLink}
            </code>
            <Button type="button" size="icon-sm" variant="ghost" onClick={handleCopyPortal}>
              <Copy className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid min-w-0 gap-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            {t("project.sidebar.quickResources")}
          </p>
          {quickResources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url || undefined}
              target={resource.url ? "_blank" : undefined}
              rel={resource.url ? "noreferrer" : undefined}
              className="flex min-w-0 items-center justify-between gap-2 rounded-md border px-3 py-2 text-xs hover:bg-muted/60"
            >
              <span className="truncate font-medium">{resource.title}</span>
              {resource.url ? (
                <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
              ) : null}
            </a>
          ))}
          {quickResources.length === 0 ? (
            <p className="text-xs text-muted-foreground">{t("project.resources.empty")}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

interface PropertyRowProps {
  label: string;
  children: React.ReactNode;
}

function PropertyRow({ children, label }: PropertyRowProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex min-w-0 justify-end text-right font-medium">{children}</div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
