import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { useTranslation } from "@repo/ui/i18n";
import { MessageCircle } from "lucide-react";
import type { IssueItem } from "../types";
import { IssueStatusBadge } from "./issue-status-badge";

interface IssueCardProps {
  issue: IssueItem;
  onOpen: (issue: IssueItem) => void;
}

export function IssueCard({ issue, onOpen }: IssueCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-0">
      <CardContent className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h4 className="min-w-0 text-sm font-semibold text-foreground">{issue.title}</h4>
          <IssueStatusBadge status={issue.status} />
        </div>
        {issue.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{issue.description}</p>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MessageCircle className="size-3.5" />
            {t("project.comments.count", { count: countComments(issue) })}
          </span>
          <Button type="button" size="sm" variant="ghost" onClick={() => onOpen(issue)}>
            {t("project.actions.open")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function countComments(issue: IssueItem): number {
  const countReplies = (comments: IssueItem["comments"]): number =>
    comments.reduce((total, comment) => total + 1 + countReplies(comment.replies), 0);
  return countReplies(issue.comments);
}
