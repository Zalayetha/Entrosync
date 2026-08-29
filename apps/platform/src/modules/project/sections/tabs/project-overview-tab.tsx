import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { useTranslation } from "@repo/ui/i18n";
import { MilestoneCard } from "../../components/milestone-card";
import { ProjectLogTimeline } from "../../components/project-log-timeline";
import { ResourceItem } from "../../components/resource-item";
import type { ProjectDetail } from "../../types";

interface ProjectOverviewTabProps {
  project: ProjectDetail;
}

export function ProjectOverviewTab({ project }: ProjectOverviewTabProps) {
  const { t } = useTranslation();
  const activeMilestone =
    project.milestones.find((milestone) => milestone.progress < 100) ||
    project.milestones[0] ||
    null;

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5">
        <Card className="p-0">
          <CardHeader>
            <CardTitle>{t("project.overview.activeMilestone")}</CardTitle>
          </CardHeader>
          <CardContent>
            {activeMilestone ? (
              <MilestoneCard milestone={activeMilestone} />
            ) : (
              <p className="text-sm text-muted-foreground">{t("project.milestone.empty")}</p>
            )}
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardHeader>
            <CardTitle>{t("project.overview.recentResources")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {project.resources.slice(0, 3).map((resource) => (
              <ResourceItem key={resource.id} resource={resource} />
            ))}
            {project.resources.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("project.resources.empty")}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-5">
        <Card className="p-0">
          <CardHeader>
            <CardTitle>{t("project.overview.clientPortal")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-semibold text-foreground">{project.invites.length}</p>
            <p className="text-sm text-muted-foreground">
              {t("project.overview.portalDescription")}
            </p>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardHeader>
            <CardTitle>{t("project.overview.recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectLogTimeline logs={project.logs.slice(0, 4)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
