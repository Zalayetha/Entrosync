import { Tabs, TabsContent } from "@repo/ui/components/tabs";
import type {
  AddResourceFormInput,
  CreateIssueFormInput,
  CreateMilestoneFormInput,
  InviteClientFormInput,
  IssueStatus,
  ProjectDetail,
  ProjectInviteItem,
  ProjectStatus,
} from "../types";
import { ProjectHeader } from "../components/project-header";
import { ProjectFeedbackTab } from "./tabs/project-feedback-tab";
import { ProjectInvoicesTab } from "./tabs/project-invoices-tab";
import { ProjectLogsTab } from "./tabs/project-logs-tab";
import { ProjectOverviewTab } from "./tabs/project-overview-tab";
import { ProjectResourcesTab } from "./tabs/project-resources-tab";
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
  onAddResource,
  onInvite,
}: ProjectDetailSectionProps) {
  return (
    <Tabs defaultValue="overview" className="gap-6">
      <ProjectHeader
        project={project}
        onBack={onBack}
        onStatusChange={onStatusChange}
        onInvite={onInvite}
      />
      <TabsContent value="overview">
        <ProjectOverviewTab project={project} />
      </TabsContent>
      <TabsContent value="roadmap">
        <ProjectRoadmapTab
          project={project}
          onCreateMilestone={onCreateMilestone}
          onCreateIssue={onCreateIssue}
          onUpdateIssueStatus={onUpdateIssueStatus}
          onMoveIssue={onMoveIssue}
          onComment={onComment}
        />
      </TabsContent>
      <TabsContent value="invoices">
        <ProjectInvoicesTab project={project} onToggleStatus={onToggleInvoiceStatus} />
      </TabsContent>
      <TabsContent value="resources">
        <ProjectResourcesTab project={project} onAddResource={onAddResource} />
      </TabsContent>
      <TabsContent value="feedback">
        <ProjectFeedbackTab project={project} onInvite={onInvite} />
      </TabsContent>
      <TabsContent value="logs">
        <ProjectLogsTab project={project} />
      </TabsContent>
    </Tabs>
  );
}
