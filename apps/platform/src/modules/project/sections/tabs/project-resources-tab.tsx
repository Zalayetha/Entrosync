import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useTranslation } from "@repo/ui/i18n";
import { AddResourceDialog } from "../../components/add-resource-dialog";
import { ResourceItem } from "../../components/resource-item";
import type { AddResourceFormInput, ProjectDetail, ResourceTypeFilter } from "../../types";

interface ProjectResourcesTabProps {
  project: ProjectDetail;
  onAddResource: (input: AddResourceFormInput) => void;
}

export function ProjectResourcesTab({ project, onAddResource }: ProjectResourcesTabProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<ResourceTypeFilter>("ALL");
  const resources =
    filter === "ALL"
      ? project.resources
      : project.resources.filter((resource) => resource.type === filter);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select value={filter} onValueChange={(value) => setFilter(value as ResourceTypeFilter)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("project.resources.all")}</SelectItem>
            <SelectItem value="FILE">{t("project.resources.files")}</SelectItem>
            <SelectItem value="LINK">{t("project.resources.links")}</SelectItem>
          </SelectContent>
        </Select>
        <AddResourceDialog onAdd={onAddResource} />
      </div>
      <div className="grid gap-3">
        {resources.map((resource) => (
          <ResourceItem key={resource.id} resource={resource} />
        ))}
        {resources.length === 0 ? (
          <p className="rounded-lg border p-6 text-sm text-muted-foreground">
            {t("project.resources.empty")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
