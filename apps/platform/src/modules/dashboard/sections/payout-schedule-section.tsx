import { Card, CardContent } from "@repo/ui/components/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@repo/ui/components/empty";
import { useTranslation } from "@repo/ui/i18n";
import { BarChart3, Wallet } from "lucide-react";
import { PayoutRow } from "../components/payout-row";
import { SectionHeader } from "../components/section-header";
import type { DashboardPayout } from "../types";

interface PayoutScheduleSectionProps {
  payouts: DashboardPayout[];
}

export function PayoutScheduleSection({ payouts }: PayoutScheduleSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-3">
      <SectionHeader
        actionHref="/invoice"
        actionLabel={t("dashboard.viewAll")}
        icon={BarChart3}
        title={t("dashboard.payoutSchedule.title")}
      />

      <Card className="p-0">
        <CardContent className="p-5">
          {payouts.length > 0 ? (
            <div className="divide-y divide-border">
              {payouts.map((payout) => (
                <PayoutRow key={payout.id} payout={payout} />
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <Wallet className="size-5" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>{t("dashboard.payoutSchedule.empty")}</EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
