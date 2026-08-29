import { Button } from "@repo/ui/components/button";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function SectionHeader({
  actionHref,
  actionLabel,
  icon: Icon,
  onAction,
  title,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <h2 className="truncate text-base font-semibold">{title}</h2>
      </div>
      {actionLabel && actionHref ? (
        <Button
          asChild
          className="shrink-0 px-0 text-muted-foreground hover:text-foreground"
          type="button"
          variant="link"
        >
          <Link to={actionHref}>{actionLabel}</Link>
        </Button>
      ) : actionLabel && onAction ? (
        <Button
          className="shrink-0 px-0 text-muted-foreground hover:text-foreground"
          onClick={onAction}
          type="button"
          variant="link"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
