import { useMemo, useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { toast } from "@repo/ui/components/sonner";
import { useTranslation } from "@repo/ui/i18n";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { PlatformAppShell } from "../modules/app-shell/app-shell";
import { meQueryOptions } from "../modules/auth/hooks/use-auth";
import { UnauthorizedError } from "../modules/auth/services";
import { mockProjects } from "../modules/project/mock-data";
import { ProjectDetailSection } from "../modules/project/sections/project-detail-section";
import { ProjectListSection } from "../modules/project/sections/project-list-section";
import type {
  AddResourceFormInput,
  CommentItem,
  CreateIssueFormInput,
  CreateMilestoneFormInput,
  CreateProjectFormInput,
  InviteClientFormInput,
  IssueStatus,
  InvoiceStatus,
  MilestoneItem,
  ProjectDetail,
  ProjectInviteItem,
  ProjectStatus,
  ProjectStatusFilter,
  ProjectSubView,
} from "../modules/project/types";
import { makeId, slugify } from "../modules/project/utils";

export const Route = createFileRoute("/project")({
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
  component: ProjectRouteComponent,
});

function ProjectRouteComponent() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<ProjectDetail[]>(mockProjects);
  const [currentView, setCurrentView] = useState<ProjectSubView>("list");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("ALL");

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesQuery =
        query.length === 0 ||
        project.title.toLowerCase().includes(query) ||
        project.clientName.toLowerCase().includes(query) ||
        (project.description || "").toLowerCase().includes(query);
      const matchesStatus = statusFilter === "ALL" || project.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  const selectedProject = projects.find((project) => project.id === selectedProjectId) || null;

  const updateSelectedProject = (updater: (project: ProjectDetail) => ProjectDetail) => {
    if (!selectedProjectId) return;
    setProjects((prev) =>
      prev.map((project) => (project.id === selectedProjectId ? updater(project) : project)),
    );
  };

  const appendLog = (
    project: ProjectDetail,
    action: string,
    description: string,
  ): ProjectDetail => {
    const timestamp = new Date().toISOString();
    return {
      ...project,
      updatedAt: timestamp,
      logs: [
        {
          id: makeId("log"),
          projectId: project.id,
          action,
          description,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        ...project.logs,
      ],
    };
  };

  const handleSelectProject = (project: ProjectDetail) => {
    setSelectedProjectId(project.id);
    setCurrentView("detail");
  };

  const handleBackToList = () => {
    setSelectedProjectId(null);
    setCurrentView("list");
  };

  const handleCreateProject = (input: CreateProjectFormInput) => {
    const timestamp = new Date().toISOString();
    const projectId = makeId("proj");
    const project: ProjectDetail = {
      id: projectId,
      userId: "user_01",
      slug: slugify(input.title),
      title: input.title,
      clientName: input.clientName,
      description: input.description || null,
      status: "BACKLOG",
      startDate: timestamp,
      targetDate: input.targetDate ? new Date(input.targetDate).toISOString() : null,
      createdAt: timestamp,
      updatedAt: timestamp,
      teams: [],
      milestones: [],
      invoices: [],
      feedbacks: [],
      resources: [],
      logs: [
        {
          id: makeId("log"),
          projectId,
          action: t("project.logs.created"),
          description: input.title,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      invites: [],
    };
    setProjects((prev) => [project, ...prev]);
    setSelectedProjectId(project.id);
    setCurrentView("detail");
    toast.success(t("project.toasts.projectCreated"));
  };

  const handleStatusChange = (status: ProjectStatus) => {
    updateSelectedProject((project) =>
      appendLog(
        { ...project, status },
        t("project.logs.statusChanged"),
        t(`project.status.${status}`),
      ),
    );
  };

  const handleUpdateDescription = (description: string) => {
    updateSelectedProject((project) =>
      appendLog(
        { ...project, description: description || null, updatedAt: new Date().toISOString() },
        t("project.logs.descriptionUpdated"),
        t("project.overview.briefTitle"),
      ),
    );
  };

  const handleCreateMilestone = (input: CreateMilestoneFormInput) => {
    updateSelectedProject((project) => {
      const timestamp = new Date().toISOString();
      const milestone: MilestoneItem = {
        id: makeId("ms"),
        projectId: project.id,
        title: input.title,
        description: input.description || null,
        progress: 0,
        startDate: timestamp,
        targetDate: input.targetDate ? new Date(input.targetDate).toISOString() : null,
        createdAt: timestamp,
        updatedAt: timestamp,
        issues: [],
      };

      return appendLog(
        { ...project, milestones: [...project.milestones, milestone] },
        t("project.logs.milestoneAdded"),
        input.title,
      );
    });
  };

  const handleCreateIssue = (input: CreateIssueFormInput) => {
    updateSelectedProject((project) => {
      const timestamp = new Date().toISOString();
      const milestones = project.milestones.map((milestone) => {
        if (milestone.id !== input.milestoneId) return milestone;

        return {
          ...milestone,
          updatedAt: timestamp,
          issues: [
            ...milestone.issues,
            {
              id: makeId("issue"),
              milestoneId: input.milestoneId,
              title: input.title,
              description: input.description || null,
              status: "TODO" as IssueStatus,
              startDate: timestamp,
              targetDate: input.targetDate ? new Date(input.targetDate).toISOString() : null,
              createdAt: timestamp,
              updatedAt: timestamp,
              comments: [],
            },
          ],
        };
      });

      return appendLog({ ...project, milestones }, t("project.logs.issueAdded"), input.title);
    });
  };

  const handleUpdateIssueStatus = (issueId: string, status: IssueStatus) => {
    updateSelectedProject((project) =>
      appendLog(
        {
          ...project,
          milestones: project.milestones.map((milestone) => ({
            ...milestone,
            issues: milestone.issues.map((issue) =>
              issue.id === issueId
                ? { ...issue, status, updatedAt: new Date().toISOString() }
                : issue,
            ),
          })),
        },
        t("project.logs.issueStatusChanged"),
        t(`project.issueStatus.${status}`),
      ),
    );
  };

  const handleMoveIssue = (issueId: string, milestoneId: string) => {
    updateSelectedProject((project) => {
      const issueToMove = project.milestones
        .flatMap((milestone) => milestone.issues)
        .find((issue) => issue.id === issueId);
      if (!issueToMove) return project;

      const timestamp = new Date().toISOString();
      const milestones = project.milestones.map((milestone) => ({
        ...milestone,
        issues:
          milestone.id === milestoneId
            ? [...milestone.issues, { ...issueToMove, milestoneId, updatedAt: timestamp }]
            : milestone.issues.filter((issue) => issue.id !== issueId),
      }));

      return appendLog({ ...project, milestones }, t("project.logs.issueMoved"), issueToMove.title);
    });
  };

  const handleComment = (issueId: string, parentId: string | null, content: string) => {
    updateSelectedProject((project) => {
      const timestamp = new Date().toISOString();
      const comment: CommentItem = {
        id: makeId("comment"),
        issueId,
        userId: "user_01",
        parentId,
        authorName: "Zaghy Zalayetha",
        authorRole: "Lead Engineer",
        content,
        createdAt: timestamp,
        updatedAt: timestamp,
        replies: [],
      };

      const milestones = project.milestones.map((milestone) => ({
        ...milestone,
        issues: milestone.issues.map((issue) => {
          if (issue.id !== issueId) return issue;
          return {
            ...issue,
            updatedAt: timestamp,
            comments: parentId
              ? issue.comments.map((existingComment) =>
                  addReply(existingComment, parentId, comment),
                )
              : [comment, ...issue.comments],
          };
        }),
      }));

      return appendLog({ ...project, milestones }, t("project.logs.commentAdded"), content);
    });
  };

  const handleToggleInvoiceStatus = (invoiceId: string) => {
    updateSelectedProject((project) => {
      const invoices = project.invoices.map((invoice) =>
        invoice.id === invoiceId
          ? {
              ...invoice,
              status: (invoice.status === "PAID" ? "PENDING" : "PAID") as InvoiceStatus,
              updatedAt: new Date().toISOString(),
            }
          : invoice,
      );

      return appendLog({ ...project, invoices }, t("project.logs.invoiceUpdated"), invoiceId);
    });
  };

  const handleAddResource = (input: AddResourceFormInput) => {
    updateSelectedProject((project) => {
      const timestamp = new Date().toISOString();
      return appendLog(
        {
          ...project,
          resources: [
            {
              id: makeId("res"),
              projectId: project.id,
              title: input.title,
              type: input.type,
              url: input.url || null,
              content: input.content || null,
              createdAt: timestamp,
              updatedAt: timestamp,
            },
            ...project.resources,
          ],
        },
        t("project.logs.resourceAdded"),
        input.title,
      );
    });
  };

  const handleInvite = (input: InviteClientFormInput): ProjectInviteItem => {
    const timestamp = new Date().toISOString();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const project = selectedProject;

    if (!project) {
      throw new Error("Cannot create invite without a selected project.");
    }

    const createdInvite: ProjectInviteItem = {
      id: makeId("invite"),
      token: `${project.slug}-${slugify(input.clientName)}-${Date.now().toString(36)}`,
      projectId: project.id,
      clientName: input.clientName,
      password: input.password,
      email: input.email,
      expiresAt: expiresAt.toISOString(),
      accessedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    updateSelectedProject((project) => {
      return appendLog(
        { ...project, invites: [createdInvite, ...project.invites] },
        t("project.logs.inviteCreated"),
        input.email,
      );
    });

    return createdInvite;
  };

  return (
    <PlatformAppShell>
      {currentView === "list" ? (
        <ProjectListSection
          projects={filteredProjects}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
          onSelectProject={handleSelectProject}
          onCreateProject={handleCreateProject}
        />
      ) : null}

      {currentView === "detail" ? (
        selectedProject ? (
          <ProjectDetailSection
            project={selectedProject}
            onBack={handleBackToList}
            onStatusChange={handleStatusChange}
            onCreateMilestone={handleCreateMilestone}
            onCreateIssue={handleCreateIssue}
            onUpdateIssueStatus={handleUpdateIssueStatus}
            onMoveIssue={handleMoveIssue}
            onComment={handleComment}
            onUpdateDescription={handleUpdateDescription}
            onToggleInvoiceStatus={handleToggleInvoiceStatus}
            onAddResource={handleAddResource}
            onInvite={handleInvite}
          />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <FileQuestion className="size-12 text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">{t("project.notFound")}</p>
              <Button type="button" variant="outline" onClick={handleBackToList}>
                <ArrowLeft className="size-4" />
                {t("project.actions.backToProjects")}
              </Button>
            </CardContent>
          </Card>
        )
      ) : null}
    </PlatformAppShell>
  );
}

function addReply(comment: CommentItem, parentId: string, reply: CommentItem): CommentItem {
  if (comment.id === parentId) {
    return { ...comment, replies: [...comment.replies, reply] };
  }

  return {
    ...comment,
    replies: comment.replies.map((child) => addReply(child, parentId, reply)),
  };
}
