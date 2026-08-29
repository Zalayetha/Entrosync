import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
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
  const user = useQuery(meQueryOptions);

  if (!user.data) {
    return null;
  }

  return (
    <PlatformAppShell>
      <div className="flex flex-col gap-8">
        <MetricsSection stats={mockDashboardStats} />
        <ActiveProjectsSection projects={mockActiveProjects} />
        <PayoutScheduleSection payouts={mockPayoutSchedule} />
        <ActivityFeedSection activities={mockActivityFeed} />
      </div>
    </PlatformAppShell>
  );
}
