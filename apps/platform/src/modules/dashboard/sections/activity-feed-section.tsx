import { Card, CardContent } from "@repo/ui/components/card";
import { useTranslation } from "@repo/ui/i18n";
import { History } from "lucide-react";
import { ActivityRow } from "../components/activity-row";
import { SectionHeader } from "../components/section-header";
import type { DashboardActivity } from "../types";

interface ActivityFeedSectionProps {
  activities: DashboardActivity[];
}

export function ActivityFeedSection({ activities }: ActivityFeedSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <SectionHeader icon={History} title={t("dashboard.activityFeed.title")} />

      <Card className="rounded-2xl border bg-card p-0 shadow-sm">
        <CardContent className="p-6">
          {activities.length > 0 ? (
            <div className="divide-y divide-border">
              {activities.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">
              {t("dashboard.activityFeed.empty")}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
