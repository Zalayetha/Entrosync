import { useTranslation } from "@repo/ui/i18n";
import { Clock3, FileText, FolderOpen, Rocket, TrendingUp, Wallet } from "lucide-react";
import { StatCard, StatCardSkeleton } from "../components/stat-card";
import type { DashboardStats } from "../types";
import { formatCurrency } from "../utils";

interface MetricsSectionProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

export function MetricsSection({ isLoading = false, stats }: MetricsSectionProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <section
        aria-label="Dashboard Metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
      >
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </section>
    );
  }

  const formattedRevenue = formatCurrency(stats.totalRevenueYtd);
  const formattedPendingAmount = formatCurrency(stats.pendingAmount);
  const formattedPendingCount = String(stats.pendingInvoicesCount).padStart(2, "0");

  return (
    <section
      aria-label="Dashboard Metrics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
    >
      <StatCard
        label={t("dashboard.metrics.revenue.label")}
        value={formattedRevenue}
        helper={t("dashboard.metrics.revenue.helper", {
          percent: stats.revenueGrowthPercent,
        })}
        helperIcon={TrendingUp}
        helperIconClassName="text-emerald-500"
        watermarkIcon={Wallet}
      />

      <StatCard
        label={t("dashboard.metrics.activeProjects.label")}
        value={stats.activeProjectsCount}
        helper={t("dashboard.metrics.activeProjects.helper", {
          count: stats.milestonesThisWeekCount,
        })}
        helperIcon={Rocket}
        helperIconClassName="text-sky-500"
        watermarkIcon={FolderOpen}
      />

      <StatCard
        label={t("dashboard.metrics.pendingInvoices.label")}
        value={
          <span className="text-emerald-600 dark:text-emerald-400">{formattedPendingCount}</span>
        }
        helper={t("dashboard.metrics.pendingInvoices.helper", {
          amount: formattedPendingAmount,
        })}
        helperIcon={Clock3}
        helperIconClassName="text-amber-500"
        watermarkIcon={FileText}
      />
    </section>
  );
}
