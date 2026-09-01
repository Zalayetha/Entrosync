import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { useTranslation } from "@repo/ui/i18n";
import { ProjectLogTimeline } from "../project-log-timeline";
import type { ProjectDetail } from "../../types";

interface ProjectActivityWidgetProps {
  project: ProjectDetail;
}

export function ProjectActivityWidget({ project }: ProjectActivityWidgetProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-0">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-sm font-semibold">
          {t("project.overview.recentActivity")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ProjectLogTimeline logs={project.logs.slice(0, 4)} />
      </CardContent>
    </Card>
  );
}
