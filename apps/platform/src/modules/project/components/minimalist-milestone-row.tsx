import { Progress } from "@repo/ui/components/progress";
import { useTranslation } from "@repo/ui/i18n";
import type { MilestoneItem } from "../types";
import { calculateMilestoneProgress, formatProjectDate } from "../utils";

interface MinimalistMilestoneRowProps {
  milestone: MilestoneItem;
}

export function MinimalistMilestoneRow({ milestone }: MinimalistMilestoneRowProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "id" ? "id-ID" : "en-US";
  const progress = calculateMilestoneProgress(milestone);
  const completedIssues = milestone.issues.filter((issue) => issue.status === "DONE").length;

  return (
    <div className="grid gap-3 py-5 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h3 className="font-medium text-foreground">{milestone.title}</h3>
          {milestone.description ? (
            <p className="text-sm leading-6 text-muted-foreground">{milestone.description}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2 py-1 font-medium">
            {formatProjectDate(milestone.targetDate, locale)}
          </span>
          <span>
            {t("project.overview.taskFraction", {
              completed: completedIssues,
              total: milestone.issues.length,
            })}
          </span>
          <span className="font-medium text-foreground">{progress}%</span>
        </div>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
}
