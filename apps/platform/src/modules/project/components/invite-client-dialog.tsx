import { useMemo, useState } from "react";
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
import { toast } from "@repo/ui/components/sonner";
import { useTranslation } from "@repo/ui/i18n";
import { Copy, Share2 } from "lucide-react";
import type { InviteClientFormInput, ProjectInviteItem } from "../types";

interface InviteClientDialogProps {
  projectSlug: string;
  invites: ProjectInviteItem[];
  onInvite: (input: InviteClientFormInput) => ProjectInviteItem;
}

export function InviteClientDialog({ projectSlug, invites, onInvite }: InviteClientDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const canSubmit = clientName.trim().length > 0 && email.trim().length > 0 && password.length > 0;
  const latestInvite = invites[0] || null;
  const portalLink = useMemo(() => {
    const token = latestInvite?.token || projectSlug;
    return `https://client.entrosync.com/p/${token}`;
  }, [latestInvite, projectSlug]);

  const handleInvite = () => {
    if (!canSubmit) return;
    onInvite({
      clientName: clientName.trim(),
      email: email.trim(),
      password,
    });
    setClientName("");
    setEmail("");
    setPassword("");
    toast.success(t("project.toasts.inviteCreated"));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portalLink);
      toast.success(t("project.toasts.copied"));
    } catch {
      toast.error(t("project.toasts.copyFailed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Share2 className="size-4" />
          {t("project.actions.sharePortal")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("project.invites.title")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-5">
          <div className="grid gap-2 rounded-lg border p-3">
            <Label htmlFor="portal-link">{t("project.invites.portalLink")}</Label>
            <div className="flex gap-2">
              <Input id="portal-link" readOnly value={portalLink} />
              <Button type="button" size="icon" variant="outline" onClick={handleCopy}>
                <Copy className="size-4" />
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="invite-name">{t("project.fields.clientName")}</Label>
              <Input
                id="invite-name"
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invite-email">{t("project.fields.email")}</Label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invite-password">{t("project.fields.password")}</Label>
              <Input
                id="invite-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {t("project.actions.close")}
          </Button>
          <Button type="button" disabled={!canSubmit} onClick={handleInvite}>
            {t("project.actions.createInvite")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
