import type { ProjectInviteItem } from "../projects/types";

export type { ProjectInviteItem };

export type VerifyInviteResponse = {
  clientName: string;
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  token: string;
  valid: boolean;
};

export type InviteListResponse = {
  invites: ProjectInviteItem[];
};
