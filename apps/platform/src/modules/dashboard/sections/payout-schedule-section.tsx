import { Card, CardContent } from "@repo/ui/components/card";
import { useTranslation } from "@repo/ui/i18n";
import { BarChart3 } from "lucide-react";
import { PayoutRow } from "../components/payout-row";
import { SectionHeader } from "../components/section-header";
import type { DashboardPayout } from "../types";

interface PayoutScheduleSectionProps {
  payouts: DashboardPayout[];
}

export function PayoutScheduleSection({ payouts }: PayoutScheduleSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <SectionHeader
        actionHref="/invoice"
        actionLabel={t("dashboard.viewAll")}
        icon={BarChart3}
        title={t("dashboard.payoutSchedule.title")}
      />

      <Card className="rounded-2xl border bg-card p-0 shadow-sm">
        <CardContent className="p-6">
          {payouts.length > 0 ? (
            <div className="divide-y divide-border">
              {payouts.map((payout) => (
                <PayoutRow key={payout.id} payout={payout} />
              ))}
            </div>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">
              {t("dashboard.payoutSchedule.empty")}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
