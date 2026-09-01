import { Card, CardContent } from "@repo/ui/components/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/components/empty";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useTranslation } from "@repo/ui/i18n";
import { FolderOpen, Search } from "lucide-react";
import { CreateProjectDialog } from "../components/create-project-dialog";
import { ProjectCard } from "../components/project-card";
import type { CreateProjectFormInput, ProjectDetail, ProjectStatusFilter } from "../types";

interface ProjectListSectionProps {
  projects: ProjectDetail[];
  searchQuery: string;
  statusFilter: ProjectStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: ProjectStatusFilter) => void;
  onSelectProject: (project: ProjectDetail) => void;
  onCreateProject: (input: CreateProjectFormInput) => void;
}

const statusFilters: ProjectStatusFilter[] = [
  "ALL",
  "BACKLOG",
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export function ProjectListSection({
  projects,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onSelectProject,
  onCreateProject,
}: ProjectListSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-foreground">{t("project.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("project.subtitle")}</p>
        </div>
        <CreateProjectDialog onCreate={onCreateProject} />
      </div>

      <div className="p-0">
        <div className="grid gap-3 p-4 md:grid-cols-[1fr_220px] bg-transparent">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              value={searchQuery}
              placeholder={t("project.list.search")}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => onStatusFilterChange(value as ProjectStatusFilter)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "ALL" ? t("project.list.allStatuses") : t(`project.status.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={onSelectProject} />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyMedia variant="icon">
            <FolderOpen className="size-5" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>{t("project.list.empty")}</EmptyTitle>
            <EmptyDescription>{t("project.list.emptyHelper")}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
