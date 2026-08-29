import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { useTranslation } from "@repo/ui/i18n";
import { FeedbackCard } from "../../components/feedback-card";
import { InviteClientDialog } from "../../components/invite-client-dialog";
import type { InviteClientFormInput, ProjectDetail, ProjectInviteItem } from "../../types";
import { formatProjectDate } from "../../utils";

interface ProjectFeedbackTabProps {
  project: ProjectDetail;
  onInvite: (input: InviteClientFormInput) => ProjectInviteItem;
}

export function ProjectFeedbackTab({ project, onInvite }: ProjectFeedbackTabProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <Card className="p-0">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>{t("project.invites.title")}</CardTitle>
            <InviteClientDialog
              projectSlug={project.slug}
              invites={project.invites}
              onInvite={onInvite}
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {project.invites.map((invite) => (
            <div key={invite.id} className="rounded-lg border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground">{invite.clientName}</h3>
                  <p className="truncate text-sm text-muted-foreground">{invite.email}</p>
                </div>
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                  {invite.accessedAt ? t("project.invites.accessed") : t("project.invites.pending")}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {t("project.invites.expires")}{" "}
                {formatProjectDate(invite.expiresAt, i18n.language === "id" ? "id-ID" : "en-US")}
              </p>
            </div>
          ))}
          {project.invites.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("project.invites.empty")}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="p-0">
        <CardHeader>
          <CardTitle>{t("project.feedback.title")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {project.feedbacks.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
          {project.feedbacks.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("project.feedback.empty")}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
