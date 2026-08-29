import { useState } from "react";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Textarea } from "@repo/ui/components/textarea";
import { useTranslation } from "@repo/ui/i18n";
import type { CommentItem } from "../types";
import { formatProjectDate } from "../utils";

interface CommentThreadProps {
  comments: CommentItem[];
  onReply: (parentId: string, content: string) => void;
}

export function CommentThread({ comments, onReply }: CommentThreadProps) {
  const { t } = useTranslation();

  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("project.comments.empty")}</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentNode key={comment.id} comment={comment} depth={0} onReply={onReply} />
      ))}
    </div>
  );
}

interface CommentNodeProps {
  comment: CommentItem;
  depth: number;
  onReply: (parentId: string, content: string) => void;
}

function CommentNode({ comment, depth, onReply }: CommentNodeProps) {
  const { t, i18n } = useTranslation();
  const [isReplying, setIsReplying] = useState(false);
  const [content, setContent] = useState("");
  const canSubmit = content.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onReply(comment.id, content.trim());
    setContent("");
    setIsReplying(false);
  };

  return (
    <div className={depth > 0 ? "ml-6 border-l pl-4" : undefined}>
      <div className="flex gap-3">
        <Avatar size="sm">
          <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-semibold text-foreground">{comment.authorName}</span>
            <span className="text-xs text-muted-foreground">{comment.authorRole}</span>
            <span className="text-xs text-muted-foreground">
              {formatProjectDate(comment.createdAt, i18n.language === "id" ? "id-ID" : "en-US")}
            </span>
          </div>
          <p className="text-sm leading-6 text-foreground">{comment.content}</p>
          <Button
            type="button"
            size="xs"
            variant="ghost"
            onClick={() => setIsReplying((value) => !value)}
          >
            {t("project.comments.reply")}
          </Button>
          {isReplying ? (
            <div className="grid gap-2">
              <Textarea
                value={content}
                placeholder={t("project.comments.placeholder")}
                onChange={(event) => setContent(event.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsReplying(false)}
                >
                  {t("project.actions.cancel")}
                </Button>
                <Button type="button" size="sm" disabled={!canSubmit} onClick={handleSubmit}>
                  {t("project.comments.postReply")}
                </Button>
              </div>
            </div>
          ) : null}
          {comment.replies.length > 0 ? (
            <div className="space-y-4 pt-2">
              {comment.replies.map((reply) => (
                <CommentNode key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
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
