import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { useTranslation } from "@repo/ui/i18n";
import { CreateIssueDialog } from "../../components/create-issue-dialog";
import { CreateMilestoneDialog } from "../../components/create-milestone-dialog";
import { IssueCard } from "../../components/issue-card";
import { IssueDetailSheet } from "../../components/issue-detail-sheet";
import { MilestoneCard } from "../../components/milestone-card";
import type {
  CreateIssueFormInput,
  CreateMilestoneFormInput,
  IssueItem,
  IssueStatus,
  ProjectDetail,
  RoadmapViewMode,
} from "../../types";
import { flattenIssues } from "../../utils";

interface ProjectRoadmapTabProps {
  project: ProjectDetail;
  onCreateMilestone: (input: CreateMilestoneFormInput) => void;
  onCreateIssue: (input: CreateIssueFormInput) => void;
  onUpdateIssueStatus: (issueId: string, status: IssueStatus) => void;
  onMoveIssue: (issueId: string, milestoneId: string) => void;
  onComment: (issueId: string, parentId: string | null, content: string) => void;
}

const issueStatuses: IssueStatus[] = [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
  "CANCELLED",
];

export function ProjectRoadmapTab({
  project,
  onCreateMilestone,
  onCreateIssue,
  onUpdateIssueStatus,
  onMoveIssue,
  onComment,
}: ProjectRoadmapTabProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<RoadmapViewMode>("milestones");
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(null);
  const issues = flattenIssues(project);
  const selectedIssueFresh = selectedIssue
    ? issues.find((issue) => issue.id === selectedIssue.id) || null
    : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={mode} onValueChange={(value) => setMode(value as RoadmapViewMode)}>
          <TabsList>
            <TabsTrigger value="milestones">{t("project.roadmap.modes.milestones")}</TabsTrigger>
            <TabsTrigger value="kanban">{t("project.roadmap.modes.kanban")}</TabsTrigger>
            <TabsTrigger value="list">{t("project.roadmap.modes.list")}</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap gap-2">
          <CreateMilestoneDialog onCreate={onCreateMilestone} />
          <CreateIssueDialog milestones={project.milestones} onCreate={onCreateIssue} />
        </div>
      </div>

      {mode === "milestones" ? (
        <Accordion
          type="multiple"
          defaultValue={project.milestones.map((milestone) => milestone.id)}
          className="rounded-lg border"
        >
          {project.milestones.map((milestone) => (
            <AccordionItem key={milestone.id} value={milestone.id} className="px-4">
              <AccordionTrigger>
                <MilestoneCard milestone={milestone} />
              </AccordionTrigger>
              <AccordionContent className="grid gap-3">
                {milestone.issues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} onOpen={setSelectedIssue} />
                ))}
                {milestone.issues.length === 0 ? (
                  <p className="px-1 text-sm text-muted-foreground">{t("project.issue.empty")}</p>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : null}

      {mode === "kanban" ? (
        <div className="grid gap-3 xl:grid-cols-6">
          {issueStatuses.map((status) => (
            <Card key={status} className="min-h-80 p-0">
              <CardHeader>
                <CardTitle className="text-sm">{t(`project.issueStatus.${status}`)}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {issues
                  .filter((issue) => issue.status === status)
                  .map((issue) => (
                    <IssueCard key={issue.id} issue={issue} onOpen={setSelectedIssue} />
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {mode === "list" ? (
        <Card className="p-0">
          <CardContent className="divide-y p-0">
            {issues.map((issue) => (
              <div key={issue.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">{issue.title}</h3>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                </div>
                <Button type="button" variant="outline" onClick={() => setSelectedIssue(issue)}>
                  {t("project.actions.open")}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <IssueDetailSheet
        issue={selectedIssueFresh}
        milestones={project.milestones}
        onOpenChange={(open) => {
          if (!open) setSelectedIssue(null);
        }}
        onUpdateStatus={onUpdateIssueStatus}
        onMoveIssue={onMoveIssue}
        onComment={onComment}
      />
    </div>
  );
}
