import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import { useTranslation } from "@repo/ui/i18n";
import { CircleDot, FileText, ReceiptText } from "lucide-react";
import type { ProjectDetail, ProjectHealth } from "../../types";
import {
  calculateCompletedIssuesCount,
  calculateMilestoneProgress,
  calculateProjectHealth,
  calculateProjectProgress,
  calculateTotalIssuesCount,
  formatCurrencyAmount,
  formatProjectDate,
} from "../../utils";

interface ProjectOverviewTabProps {
  project: ProjectDetail;
}

const healthClassName: Record<ProjectHealth, string> = {
  ON_TRACK: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  AT_RISK: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  BEHIND: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

export function ProjectOverviewTab({ project }: ProjectOverviewTabProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "id" ? "id-ID" : "en-US";
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
    <div className="space-y-5">
      <Card className="border-primary/20 bg-primary/[0.03] p-0">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
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
          <div className="min-w-40 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t("project.metrics.progress")}</span>
              <span className="font-semibold text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      <Card className="p-0">
        <CardHeader className="p-5 pb-3">
          <CardTitle>{t("project.overview.briefTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 p-5 pt-0">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h3>{t("project.overview.scopeTitle")}</h3>
            <p>{project.description || t("project.overview.noBrief")}</p>
            <h3>{t("project.overview.goalsTitle")}</h3>
            <ul>
              <li>{t("project.overview.goalDelivery")}</li>
              <li>{t("project.overview.goalVisibility")}</li>
              <li>{t("project.overview.goalBilling")}</li>
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
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
          </div>
        </CardContent>
      </Card>

      <Card className="p-0">
        <CardHeader className="p-5 pb-3">
          <CardTitle>{t("project.overview.milestoneStatus")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 p-5 pt-0">
          {project.milestones.map((milestone) => {
            const milestoneProgress = calculateMilestoneProgress(milestone);

            return (
              <div key={milestone.id} className="grid gap-2 rounded-lg border p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">{milestone.title}</h3>
                    {milestone.description ? (
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    ) : null}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatProjectDate(milestone.targetDate, locale)}
                  </span>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {t("project.roadmap.issueCount", { count: milestone.issues.length })}
                    </span>
                    <span>{milestoneProgress}%</span>
                  </div>
                  <Progress value={milestoneProgress} />
                </div>
              </div>
            );
          })}
          {project.milestones.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("project.milestone.empty")}</p>
          ) : null}
        </CardContent>
      </Card>
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
    <div className="min-w-0 rounded-lg border bg-muted/30 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
