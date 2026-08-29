import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/sheet";
import { Textarea } from "@repo/ui/components/textarea";
import { useTranslation } from "@repo/ui/i18n";
import type { IssueItem, IssueStatus, MilestoneItem } from "../types";
import { CommentThread } from "./comment-thread";
import { IssueStatusBadge } from "./issue-status-badge";

interface IssueDetailSheetProps {
  issue: IssueItem | null;
  milestones: MilestoneItem[];
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (issueId: string, status: IssueStatus) => void;
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

export function IssueDetailSheet({
  issue,
  milestones,
  onOpenChange,
  onUpdateStatus,
  onMoveIssue,
  onComment,
}: IssueDetailSheetProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const open = Boolean(issue);

  const handlePost = () => {
    if (!issue || content.trim().length === 0) return;
    onComment(issue.id, null, content.trim());
    setContent("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {issue ? (
          <>
            <SheetHeader className="pr-10">
              <SheetTitle>{issue.title}</SheetTitle>
              <SheetDescription>
                {issue.description || t("project.issue.noDescription")}
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 px-4 pb-6">
              <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    {t("project.fields.status")}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <IssueStatusBadge status={issue.status} />
                    <Select
                      value={issue.status}
                      onValueChange={(value) => onUpdateStatus(issue.id, value as IssueStatus)}
                    >
                      <SelectTrigger size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {issueStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {t(`project.issueStatus.${status}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    {t("project.fields.milestone")}
                  </span>
                  <Select
                    value={issue.milestoneId}
                    onValueChange={(value) => onMoveIssue(issue.id, value)}
                  >
                    <SelectTrigger size="sm" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {milestones.map((milestone) => (
                        <SelectItem key={milestone.id} value={milestone.id}>
                          {milestone.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-3">
                <h3 className="font-semibold text-foreground">{t("project.comments.title")}</h3>
                <div className="grid gap-2">
                  <Textarea
                    value={content}
                    placeholder={t("project.comments.placeholder")}
                    onChange={(event) => setContent(event.target.value)}
                  />
                  <Button
                    type="button"
                    className="justify-self-end"
                    disabled={content.trim().length === 0}
                    onClick={handlePost}
                  >
                    {t("project.comments.post")}
                  </Button>
                </div>
                <CommentThread
                  comments={issue.comments}
                  onReply={(parentId, replyContent) => onComment(issue.id, parentId, replyContent)}
                />
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
