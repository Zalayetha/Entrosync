import { Card, CardContent } from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import { useTranslation } from "@repo/ui/i18n";
import { CalendarDays } from "lucide-react";
import type { MilestoneItem } from "../types";
import { calculateMilestoneProgress, formatProjectDate } from "../utils";

interface MilestoneCardProps {
  milestone: MilestoneItem;
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const { t, i18n } = useTranslation();
  const progress = calculateMilestoneProgress(milestone);

  return (
    <Card className="p-0">
      <CardContent className="grid gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h3 className="font-semibold text-foreground">{milestone.title}</h3>
            {milestone.description ? (
              <p className="text-sm text-muted-foreground">{milestone.description}</p>
            ) : null}
          </div>
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
            {progress}%
          </span>
        </div>
        <Progress value={progress} />
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {formatProjectDate(milestone.targetDate, i18n.language === "id" ? "id-ID" : "en-US")}
          </span>
          <span>{t("project.roadmap.issueCount", { count: milestone.issues.length })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
