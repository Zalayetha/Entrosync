import { prisma } from "../../utils/prisma";
import type { ProjectDetailResponse } from "../projects/types";
import { getProjectByIdOrSlug } from "../projects/services";
import { InviteExpiredError, InviteNotFoundError } from "../invites/services";

export async function getGuestProject(token: string): Promise<ProjectDetailResponse> {
  const invite = await prisma.projectInvite.findUnique({
    where: { token },
  });

  if (!invite) {
    throw new InviteNotFoundError();
  }

  if (new Date() > invite.expiresAt) {
    throw new InviteExpiredError();
  }

  return getProjectByIdOrSlug(invite.projectId);
}
