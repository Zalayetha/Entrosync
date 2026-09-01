import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { useTranslation } from "@repo/ui/i18n";
import { ExternalLink, FileText, Link2 } from "lucide-react";
import { AddResourceDialog } from "../add-resource-dialog";
import type { AddResourceFormInput, ProjectDetail } from "../../types";

interface ProjectResourcesWidgetProps {
  project: ProjectDetail;
  onAddResource: (input: AddResourceFormInput) => void;
}

export function ProjectResourcesWidget({ project, onAddResource }: ProjectResourcesWidgetProps) {
  const { t } = useTranslation();
  const latestResources = project.resources.slice(0, 4);

  return (
    <Card className="p-0">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold">
            {t("project.overview.recentResources")}
          </CardTitle>
          <AddResourceDialog onAdd={onAddResource} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 pt-0">
        {latestResources.map((resource) => {
          const Icon = resource.type === "FILE" ? FileText : Link2;

          return (
            <div key={resource.id} className="flex items-start gap-3 rounded-lg border p-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{resource.title}</p>
                <p className="text-xs text-muted-foreground">
                  {t(`project.resourceType.${resource.type}`)}
                </p>
              </div>
              {resource.url ? (
                <Button type="button" size="icon-sm" variant="ghost" asChild>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t("project.actions.open")}
                  >
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              ) : null}
            </div>
          );
        })}
        {latestResources.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("project.resources.empty")}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
