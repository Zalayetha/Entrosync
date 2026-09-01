import { useState } from "react";
import type {
  AddResourceFormInput,
  CreateIssueFormInput,
  CreateMilestoneFormInput,
  InviteClientFormInput,
  IssueStatus,
  ProjectDetail,
  ProjectInviteItem,
  ProjectStatus,
  ProjectTabKey,
} from "../types";
import { ProjectHeader } from "../components/project-header";
import { ProjectActivityWidget } from "../components/sidebar/project-activity-widget";
import { ProjectResourcesWidget } from "../components/sidebar/project-resources-widget";
import { ProjectInvoicesWidget } from "../components/sidebar/project-invoices-widget";
import { ProjectPropertiesWidget } from "../components/sidebar/project-properties-widget";
import { ProjectFeedbackTab } from "./tabs/project-feedback-tab";
import { ProjectInvoicesTab } from "./tabs/project-invoices-tab";
import { ProjectLogsTab } from "./tabs/project-logs-tab";
import { ProjectOverviewTab } from "./tabs/project-overview-tab";
import { ProjectRoadmapTab } from "./tabs/project-roadmap-tab";

interface ProjectDetailSectionProps {
  project: ProjectDetail;
  onBack: () => void;
  onStatusChange: (status: ProjectStatus) => void;
  onCreateMilestone: (input: CreateMilestoneFormInput) => void;
  onCreateIssue: (input: CreateIssueFormInput) => void;
  onUpdateIssueStatus: (issueId: string, status: IssueStatus) => void;
  onMoveIssue: (issueId: string, milestoneId: string) => void;
  onComment: (issueId: string, parentId: string | null, content: string) => void;
  onToggleInvoiceStatus: (invoiceId: string) => void;
  onUpdateDescription: (description: string) => void;
  onAddResource: (input: AddResourceFormInput) => void;
  onInvite: (input: InviteClientFormInput) => ProjectInviteItem;
}

export function ProjectDetailSection({
  project,
  onBack,
  onStatusChange,
  onCreateMilestone,
  onCreateIssue,
  onUpdateIssueStatus,
  onMoveIssue,
  onComment,
  onToggleInvoiceStatus,
  onUpdateDescription,
  onAddResource,
  onInvite,
}: ProjectDetailSectionProps) {
  const [currentTab, setCurrentTab] = useState<ProjectTabKey>("overview");

  return (
    <div className="space-y-6">
      <ProjectHeader
        project={project}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onBack={onBack}
        onCreateMilestone={onCreateMilestone}
        onCreateIssue={onCreateIssue}
        onInvite={onInvite}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
        <main className="min-w-0">{renderProjectTab()}</main>

        <aside className="grid min-w-0 grid-cols-1 content-start gap-4 lg:sticky lg:top-20">
          <ProjectPropertiesWidget project={project} onStatusChange={onStatusChange} />
          <ProjectInvoicesWidget project={project} onToggleStatus={onToggleInvoiceStatus} />
          <ProjectResourcesWidget project={project} onAddResource={onAddResource} />
          <ProjectActivityWidget project={project} />
        </aside>
      </div>
    </div>
  );

  function renderProjectTab() {
    switch (currentTab) {
      case "overview":
        return <ProjectOverviewTab project={project} onUpdateDescription={onUpdateDescription} />;
      case "roadmap":
        return (
          <ProjectRoadmapTab
            project={project}
            onUpdateIssueStatus={onUpdateIssueStatus}
            onMoveIssue={onMoveIssue}
            onComment={onComment}
          />
        );
      case "invoices":
        return <ProjectInvoicesTab project={project} onToggleStatus={onToggleInvoiceStatus} />;
      case "feedback":
        return <ProjectFeedbackTab project={project} onInvite={onInvite} />;
      case "logs":
        return <ProjectLogsTab project={project} />;
    }
  }
}
