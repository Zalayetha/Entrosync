import { useTranslation } from "@repo/ui/i18n";
import type { ProjectLogItem } from "../types";
import { formatProjectDate } from "../utils";

interface ProjectLogTimelineProps {
  logs: ProjectLogItem[];
}

export function ProjectLogTimeline({ logs }: ProjectLogTimelineProps) {
  const { t, i18n } = useTranslation();

  if (logs.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("project.logs.empty")}</p>;
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="grid grid-cols-[1rem_1fr] gap-3">
          <span className="mt-1 size-2 rounded-full bg-primary ring-4 ring-primary/10" />
          <div className="space-y-1 border-b pb-4 last:border-b-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">{log.action}</h3>
              <span className="text-xs font-medium text-muted-foreground">
                {formatProjectDate(log.createdAt, i18n.language === "id" ? "id-ID" : "en-US")}
              </span>
            </div>
            {log.description ? (
              <p className="text-sm text-muted-foreground">{log.description}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
