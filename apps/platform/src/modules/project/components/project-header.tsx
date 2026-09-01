import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";
import { Badge } from "@repo/ui/components/badge";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { useTranslation } from "@repo/ui/i18n";
import { Link } from "@tanstack/react-router";
import type {
  CreateIssueFormInput,
  CreateMilestoneFormInput,
  InviteClientFormInput,
  ProjectDetail,
  ProjectHealth,
  ProjectInviteItem,
  ProjectTabKey,
} from "../types";
import { calculateProjectHealth } from "../utils";
import { CreateIssueDialog } from "./create-issue-dialog";
import { CreateMilestoneDialog } from "./create-milestone-dialog";
import { InviteClientDialog } from "./invite-client-dialog";
import { ProjectStatusBadge } from "./project-status-badge";

interface ProjectHeaderProps {
  project: ProjectDetail;
  currentTab: ProjectTabKey;
  onTabChange: (tab: ProjectTabKey) => void;
  onBack: () => void;
  onCreateMilestone: (input: CreateMilestoneFormInput) => void;
  onCreateIssue: (input: CreateIssueFormInput) => void;
  onInvite: (input: InviteClientFormInput) => ProjectInviteItem;
}

const projectTabs: ProjectTabKey[] = ["overview", "roadmap", "invoices", "feedback", "logs"];

const healthClassName: Record<ProjectHealth, string> = {
  ON_TRACK: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  AT_RISK: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  BEHIND: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

export function ProjectHeader({
  project,
  currentTab,
  onTabChange,
  onBack,
  onCreateMilestone,
  onCreateIssue,
  onInvite,
}: ProjectHeaderProps) {
  const { t } = useTranslation();
  const health = calculateProjectHealth(project);

  return (
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">{t("nav.dashboard")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button type="button" onClick={onBack} className="hover:text-foreground">
                {t("nav.projects")}
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold text-foreground">{project.title}</h1>
            <ProjectStatusBadge status={project.status} />
            <Badge variant="outline" className={healthClassName[health]}>
              {t(`project.health.${health}`)}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{project.clientName}</Badge>
            {project.description ? (
              <span className="line-clamp-1">{project.description}</span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CreateMilestoneDialog onCreate={onCreateMilestone} />
          <CreateIssueDialog milestones={project.milestones} onCreate={onCreateIssue} />
          <InviteClientDialog
            projectSlug={project.slug}
            invites={project.invites}
            onInvite={onInvite}
          />
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={(value) => onTabChange(value as ProjectTabKey)}>
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-none border-b bg-transparent p-0">
          {projectTabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-none border-b-2 border-transparent bg-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {t(`project.tabs.${tab}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
