import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { useTranslation } from "@repo/ui/i18n";
import { PlusCircle } from "lucide-react";
import type { CreateProjectFormInput } from "../types";

interface CreateProjectDialogProps {
  onCreate: (input: CreateProjectFormInput) => void;
}

export function CreateProjectDialog({ onCreate }: CreateProjectDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const canSubmit = title.trim().length > 0 && clientName.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate({
      title: title.trim(),
      clientName: clientName.trim(),
      description: description.trim() || undefined,
      targetDate: targetDate || undefined,
    });
    setTitle("");
    setClientName("");
    setDescription("");
    setTargetDate("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="self-start transition-all active:scale-[0.98] sm:self-auto">
          <PlusCircle className="size-4" />
          {t("project.actions.newProject")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("project.create.title")}</DialogTitle>
          <DialogDescription>{t("project.create.description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="project-title">{t("project.fields.title")}</Label>
            <Input
              id="project-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-client">{t("project.fields.clientName")}</Label>
            <Input
              id="project-client"
              value={clientName}
              onChange={(event) => setClientName(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-target">{t("project.fields.targetDate")}</Label>
            <Input
              id="project-target"
              type="date"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">{t("project.fields.description")}</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {t("project.actions.cancel")}
          </Button>
          <Button type="button" disabled={!canSubmit} onClick={handleSubmit}>
            {t("project.actions.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
