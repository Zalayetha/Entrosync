import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";
import { useTranslation } from "@repo/ui/i18n";
import { PlusCircle } from "lucide-react";
import type { AddResourceFormInput, ResourceType } from "../types";

interface AddResourceDialogProps {
  onAdd: (input: AddResourceFormInput) => void;
}

export function AddResourceDialog({ onAdd }: AddResourceDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ResourceType>("FILE");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const canSubmit = title.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onAdd({
      title: title.trim(),
      type,
      url: url.trim() || undefined,
      content: content.trim() || undefined,
    });
    setTitle("");
    setUrl("");
    setContent("");
    setType("FILE");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <PlusCircle className="size-4" />
          {t("project.actions.addResource")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("project.resources.addTitle")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="resource-title">{t("project.fields.title")}</Label>
            <Input
              id="resource-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>{t("project.fields.type")}</Label>
            <Select value={type} onValueChange={(value) => setType(value as ResourceType)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FILE">{t("project.resourceType.FILE")}</SelectItem>
                <SelectItem value="LINK">{t("project.resourceType.LINK")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="resource-url">{t("project.fields.url")}</Label>
            <Input id="resource-url" value={url} onChange={(event) => setUrl(event.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="resource-content">{t("project.fields.description")}</Label>
            <Textarea
              id="resource-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {t("project.actions.cancel")}
          </Button>
          <Button type="button" disabled={!canSubmit} onClick={handleSubmit}>
            {t("project.actions.add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
