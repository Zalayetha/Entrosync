import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import { useTranslation } from "@repo/ui/i18n";
import { CalendarDays, CheckCircle2, ListTodo } from "lucide-react";
import type { ProjectDetail } from "../types";
import {
  calculateCompletedIssuesCount,
  calculateProjectProgress,
  calculateTotalIssuesCount,
  formatProjectDate,
  getRemainingDays,
} from "../utils";
import { ProjectStatusBadge } from "./project-status-badge";

interface ProjectCardProps {
  project: ProjectDetail;
  onSelect: (project: ProjectDetail) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const { t, i18n } = useTranslation();
  const progress = calculateProjectProgress(project);
  const completed = calculateCompletedIssuesCount(project);
  const total = calculateTotalIssuesCount(project);
  const remainingDays = getRemainingDays(project.targetDate);

  return (
    <Card className="p-0 transition-colors hover:border-primary/30">
      <CardContent className="grid gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h2 className="truncate text-base font-semibold text-foreground">{project.title}</h2>
            <p className="truncate text-sm font-medium text-muted-foreground">
              {project.clientName}
            </p>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>

        {project.description ? (
          <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
            {project.description}
          </p>
        ) : null}

        <div className="grid gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">
              {t("project.metrics.progress")}
            </span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <span className="inline-flex items-center gap-2">
            <ListTodo className="size-4" />
            {t("project.list.tasksCount", { completed, total })}
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4" />
            {formatProjectDate(project.targetDate, i18n.language === "id" ? "id-ID" : "en-US")}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <AvatarGroup>
            {project.teams.slice(0, 3).map((member) => (
              <Avatar key={member.id} size="sm">
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
            ))}
            {project.teams.length > 3 ? (
              <AvatarGroupCount className="size-6 text-xs">
                +{project.teams.length - 3}
              </AvatarGroupCount>
            ) : null}
          </AvatarGroup>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <CheckCircle2 className="size-4" />
            {remainingDays === null
              ? t("project.list.noDeadline")
              : remainingDays < 0
                ? t("project.list.overdue")
                : t("project.list.daysLeft", { count: remainingDays })}
          </div>
        </div>

        <Button type="button" variant="outline" onClick={() => onSelect(project)}>
          {t("project.list.openProject")}
        </Button>
      </CardContent>
    </Card>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
