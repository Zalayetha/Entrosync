import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "@repo/ui/i18n";
import { Skeleton } from "@repo/ui/components/skeleton";
import { PlatformAppShell } from "../modules/app-shell/app-shell";
import { meQueryOptions } from "../modules/auth/hooks/use-auth";
import { UnauthorizedError } from "../modules/auth/services";
import {
  mockActivityFeed,
  mockActiveProjects,
  mockDashboardStats,
  mockPayoutSchedule,
} from "../modules/dashboard/mock-data";
import { ActivityFeedSection } from "../modules/dashboard/sections/activity-feed-section";
import { ActiveProjectsSection } from "../modules/dashboard/sections/active-projects-section";
import { MetricsSection } from "../modules/dashboard/sections/metrics-section";
import { PayoutScheduleSection } from "../modules/dashboard/sections/payout-schedule-section";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(meQueryOptions);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw redirect({ to: "/login" });
      }

      throw error;
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useTranslation();
  const user = useQuery(meQueryOptions);

  if (!user.data) {
    return (
      <PlatformAppShell>
        <div className="flex flex-col gap-7">
          <Skeleton className="h-9 w-48" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </PlatformAppShell>
    );
  }

  return (
    <PlatformAppShell>
      <div className="flex flex-col gap-7">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-foreground">
            {t("dashboard.greeting", { name: user.data.name.split(" ")[0] })}
          </h1>
          <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <MetricsSection stats={mockDashboardStats} />
        <ActiveProjectsSection projects={mockActiveProjects} />
        <PayoutScheduleSection payouts={mockPayoutSchedule} />
        <ActivityFeedSection activities={mockActivityFeed} />
      </div>
    </PlatformAppShell>
  );
}
