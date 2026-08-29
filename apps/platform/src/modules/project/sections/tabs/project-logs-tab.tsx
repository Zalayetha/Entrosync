import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { useTranslation } from "@repo/ui/i18n";
import { ProjectLogTimeline } from "../../components/project-log-timeline";
import type { ProjectDetail } from "../../types";

interface ProjectLogsTabProps {
  project: ProjectDetail;
}

export function ProjectLogsTab({ project }: ProjectLogsTabProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-0">
      <CardHeader>
        <CardTitle>{t("project.logs.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ProjectLogTimeline logs={project.logs} />
      </CardContent>
    </Card>
  );
}
