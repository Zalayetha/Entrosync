import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { useTranslation } from "@repo/ui/i18n";
import { ArrowLeft, CheckCircle2, CreditCard, Globe2, TrendingUp } from "lucide-react";
import type { ComponentType } from "react";
import type {
  InviteClientFormInput,
  ProjectDetail,
  ProjectInviteItem,
  ProjectStatus,
  ProjectTabKey,
} from "../types";
import {
  calculateCompletedIssuesCount,
  calculateProjectProgress,
  calculateTotalIssuesCount,
  formatCurrencyAmount,
} from "../utils";
import { InviteClientDialog } from "./invite-client-dialog";
import { ProjectStatusBadge } from "./project-status-badge";

interface ProjectHeaderProps {
  project: ProjectDetail;
  onBack: () => void;
  onStatusChange: (status: ProjectStatus) => void;
  onInvite: (input: InviteClientFormInput) => ProjectInviteItem;
}

const projectStatuses: ProjectStatus[] = [
  "BACKLOG",
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const tabs: ProjectTabKey[] = ["overview", "roadmap", "invoices", "resources", "feedback", "logs"];

export function ProjectHeader({ project, onBack, onStatusChange, onInvite }: ProjectHeaderProps) {
  const { t } = useTranslation();
  const progress = calculateProjectProgress(project);
  const completed = calculateCompletedIssuesCount(project);
  const total = calculateTotalIssuesCount(project);
  const paidTotal = project.invoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidCurrency =
    project.invoices.find((invoice) => invoice.status === "PAID")?.currency || "IDR";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <Button type="button" variant="ghost" className="w-fit px-0" onClick={onBack}>
            <ArrowLeft className="size-4" />
            {t("project.actions.backToProjects")}
          </Button>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold text-foreground">{project.title}</h1>
              <ProjectStatusBadge status={project.status} />
            </div>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {project.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{project.clientName}</span>
              <AvatarGroup>
                {project.teams.slice(0, 4).map((member) => (
                  <Avatar key={member.id} size="sm">
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                ))}
                {project.teams.length > 4 ? (
                  <AvatarGroupCount className="size-6 text-xs">
                    +{project.teams.length - 4}
                  </AvatarGroupCount>
                ) : null}
              </AvatarGroup>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={project.status}
            onValueChange={(value) => onStatusChange(value as ProjectStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {projectStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`project.status.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <InviteClientDialog
            projectSlug={project.slug}
            invites={project.invites}
            onInvite={onInvite}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={TrendingUp}
          label={t("project.metrics.progress")}
          value={`${progress}%`}
          helper={t("project.metrics.overallHelper")}
        />
        <KpiCard
          icon={CheckCircle2}
          label={t("project.metrics.completedTasks")}
          value={`${completed}/${total}`}
          helper={t("project.metrics.completedHelper")}
        />
        <KpiCard
          icon={CreditCard}
          label={t("project.metrics.totalInvoiced")}
          value={formatCurrencyAmount(paidTotal, paidCurrency)}
          helper={t("project.metrics.paidInvoices")}
        />
        <KpiCard
          icon={Globe2}
          label={t("project.metrics.clientPortal")}
          value={project.invites.length.toString()}
          helper={t("project.metrics.portalHelper")}
        />
      </div>

      <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-none border-b bg-transparent p-0">
        {tabs.map((tab) => (
          <TabsTrigger key={tab} value={tab} className="h-10 flex-none rounded-none">
            {t(`project.tabs.${tab}`)}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}

interface KpiCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  helper: string;
}

function KpiCard({ icon: Icon, label, value, helper }: KpiCardProps) {
  return (
    <Card className="p-0">
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
          <p className="truncate text-xl font-semibold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{helper}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
