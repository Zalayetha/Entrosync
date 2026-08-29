import { Card, CardContent } from "@repo/ui/components/card";
import { useTranslation } from "@repo/ui/i18n";
import { BarChart3 } from "lucide-react";
import { ProjectCard } from "../components/project-card";
import { SectionHeader } from "../components/section-header";
import type { DashboardProject } from "../types";

interface ActiveProjectsSectionProps {
  projects: DashboardProject[];
}

export function ActiveProjectsSection({ projects }: ActiveProjectsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <SectionHeader
        actionHref="/project"
        actionLabel={t("dashboard.viewAll")}
        icon={BarChart3}
        title={t("dashboard.activeProjects.title")}
      />

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border bg-card p-0 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">
              {t("dashboard.activeProjects.empty")}
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
