import { Badge } from "@repo/ui/components/badge";
import { Progress } from "@repo/ui/components/progress";
import { useTranslation } from "@repo/ui/i18n";
import { CircleDot, FileText, ReceiptText } from "lucide-react";
import { MinimalistMilestoneRow } from "../../components/minimalist-milestone-row";
import { ProjectBriefEditor } from "../../components/project-brief-editor";
import type { ProjectDetail, ProjectHealth } from "../../types";
import {
  calculateCompletedIssuesCount,
  calculateProjectHealth,
  calculateProjectProgress,
  calculateTotalIssuesCount,
  formatCurrencyAmount,
} from "../../utils";

interface ProjectOverviewTabProps {
  project: ProjectDetail;
  onUpdateDescription: (description: string) => void;
}

const healthClassName: Record<ProjectHealth, string> = {
  ON_TRACK: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  AT_RISK: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  BEHIND: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

export function ProjectOverviewTab({ project, onUpdateDescription }: ProjectOverviewTabProps) {
  const { t } = useTranslation();
  const health = calculateProjectHealth(project);
  const progress = calculateProjectProgress(project);
  const completed = calculateCompletedIssuesCount(project);
  const total = calculateTotalIssuesCount(project);
  const activeMilestone =
    project.milestones.find((milestone) => milestone.progress < 100) ||
    project.milestones[0] ||
    null;
  const latestInvoice = project.invoices[0] || null;
  const latestResource = project.resources[0] || null;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-center">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={healthClassName[health]}>
              {t(`project.health.${health}`)}
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">
              {t("project.overview.latestUpdate")}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {activeMilestone
              ? t("project.overview.updateWithMilestone", { milestone: activeMilestone.title })
              : t("project.overview.updateWithoutMilestone")}
          </p>
        </div>
        <div className="min-w-0 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("project.metrics.progress")}</span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("project.overview.briefEyebrow")}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {t("project.overview.briefTitle")}
          </h2>
        </div>
        <ProjectBriefEditor description={project.description} onSave={onUpdateDescription} />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryTile
          icon={CircleDot}
          label={t("project.overview.deliverables")}
          value={t("project.list.tasksCount", { completed, total })}
        />
        <SummaryTile
          icon={FileText}
          label={t("project.overview.latestResource")}
          value={latestResource?.title || t("project.resources.empty")}
        />
        <SummaryTile
          icon={ReceiptText}
          label={t("project.overview.latestInvoice")}
          value={
            latestInvoice
              ? formatCurrencyAmount(latestInvoice.amount, latestInvoice.currency)
              : t("project.sidebar.noInvoices")
          }
        />
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("project.overview.deliveryEyebrow")}
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {t("project.overview.milestoneStatus")}
          </h2>
        </div>
        <div className="divide-y divide-border/30">
          {project.milestones.map((milestone) => (
            <MinimalistMilestoneRow key={milestone.id} milestone={milestone} />
          ))}
        </div>
        {project.milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("project.milestone.empty")}</p>
        ) : null}
      </section>
    </div>
  );
}

interface SummaryTileProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function SummaryTile({ icon: Icon, label, value }: SummaryTileProps) {
  return (
    <div className="min-w-0 space-y-2 py-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
