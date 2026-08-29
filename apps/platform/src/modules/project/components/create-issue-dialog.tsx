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
import type { CreateIssueFormInput, MilestoneItem } from "../types";

interface CreateIssueDialogProps {
  milestones: MilestoneItem[];
  onCreate: (input: CreateIssueFormInput) => void;
}

export function CreateIssueDialog({ milestones, onCreate }: CreateIssueDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [milestoneId, setMilestoneId] = useState(milestones[0]?.id || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const canSubmit = title.trim().length > 0 && milestoneId.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate({
      milestoneId,
      title: title.trim(),
      description: description.trim() || undefined,
      targetDate: targetDate || undefined,
    });
    setTitle("");
    setDescription("");
    setTargetDate("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <PlusCircle className="size-4" />
          {t("project.actions.addIssue")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("project.issue.createTitle")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>{t("project.fields.milestone")}</Label>
            <Select value={milestoneId} onValueChange={setMilestoneId}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {milestones.map((milestone) => (
                  <SelectItem key={milestone.id} value={milestone.id}>
                    {milestone.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="issue-title">{t("project.fields.title")}</Label>
            <Input
              id="issue-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="issue-target">{t("project.fields.targetDate")}</Label>
            <Input
              id="issue-target"
              type="date"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="issue-description">{t("project.fields.description")}</Label>
            <Textarea
              id="issue-description"
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
