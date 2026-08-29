import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { useTranslation } from "@repo/ui/i18n";
import { ExternalLink, FileText, Link2 } from "lucide-react";
import type { ResourceItem as Resource } from "../types";
import { formatProjectDate } from "../utils";

interface ResourceItemProps {
  resource: Resource;
}

export function ResourceItem({ resource }: ResourceItemProps) {
  const { t, i18n } = useTranslation();
  const Icon = resource.type === "FILE" ? FileText : Link2;

  return (
    <Card className="p-0">
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{resource.title}</h3>
            <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
              {t(`project.resourceType.${resource.type}`)}
            </span>
          </div>
          {resource.content ? (
            <p className="text-sm text-muted-foreground">{resource.content}</p>
          ) : null}
          <p className="text-xs font-medium text-muted-foreground">
            {formatProjectDate(resource.createdAt, i18n.language === "id" ? "id-ID" : "en-US")}
          </p>
        </div>
        {resource.url ? (
          <Button type="button" size="icon-sm" variant="ghost" asChild>
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              aria-label={t("project.actions.open")}
            >
              <ExternalLink className="size-4" />
            </a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
