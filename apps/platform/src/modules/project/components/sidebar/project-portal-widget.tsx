import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { toast } from "@repo/ui/components/sonner";
import { useTranslation } from "@repo/ui/i18n";
import { Copy, MessageSquareText } from "lucide-react";
import { useMemo } from "react";
import { InviteClientDialog } from "../invite-client-dialog";
import type { InviteClientFormInput, ProjectDetail, ProjectInviteItem } from "../../types";

interface ProjectPortalWidgetProps {
  project: ProjectDetail;
  onInvite: (input: InviteClientFormInput) => ProjectInviteItem;
}

export function ProjectPortalWidget({ project, onInvite }: ProjectPortalWidgetProps) {
  const { t } = useTranslation();
  const latestInvite = project.invites[0] || null;
  const portalLink = useMemo(() => {
    const token = latestInvite?.token || project.slug;
    return `https://client.entrosync.com/p/${token}`;
  }, [latestInvite, project.slug]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portalLink);
      toast.success(t("project.toasts.copied"));
    } catch {
      toast.error(t("project.toasts.copyFailed"));
    }
  };

  return (
    <Card className="min-w-0 p-0">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold">
            {t("project.overview.clientPortal")}
          </CardTitle>
          <Badge variant="outline">
            {latestInvite?.accessedAt
              ? t("project.invites.accessed")
              : t("project.invites.pending")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid min-w-0 gap-4 p-4 pt-0">
        <div className="grid min-w-0 gap-2 rounded-lg border bg-muted/30 p-3">
          <span className="text-xs font-medium uppercase text-muted-foreground">
            {t("project.invites.portalLink")}
          </span>
          <div className="flex min-w-0 items-center gap-2">
            <code className="block min-w-0 flex-1 truncate text-xs text-muted-foreground">
              {portalLink}
            </code>
            <Button type="button" size="icon-sm" variant="ghost" onClick={handleCopy}>
              <Copy className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <MessageSquareText className="size-4" />
            {t("project.feedback.title")}
          </span>
          <span className="font-medium tabular-nums">
            {t("project.sidebar.feedbackCount", { count: project.feedbacks.length })}
          </span>
        </div>

        <InviteClientDialog
          projectSlug={project.slug}
          invites={project.invites}
          onInvite={onInvite}
        />
      </CardContent>
    </Card>
  );
}
