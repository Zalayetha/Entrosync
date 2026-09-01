import { prisma } from "../../utils/prisma";
import type { CreateInviteInput, VerifyInviteInput } from "./schema";
import type { ProjectInviteItem, VerifyInviteResponse } from "./types";

export class InviteNotFoundError extends Error {
  constructor() {
    super("Invite not found");
    this.name = "InviteNotFoundError";
  }
}

export class InvalidInviteCredentialsError extends Error {
  constructor() {
    super("Invalid invite token or password");
    this.name = "InvalidInviteCredentialsError";
  }
}

export class InviteExpiredError extends Error {
  constructor() {
    super("Invite link has expired");
    this.name = "InviteExpiredError";
  }
}

export async function listProjectInvites(projectId: string): Promise<ProjectInviteItem[]> {
  const invites = await prisma.projectInvite.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });

  return invites.map((inv) => ({
    accessedAt: inv.accessedAt,
    clientName: inv.clientName,
    createdAt: inv.createdAt,
    email: inv.email,
    expiresAt: inv.expiresAt,
    id: inv.id,
    password: inv.password,
    projectId: inv.projectId,
    token: inv.token,
    updatedAt: inv.updatedAt,
  }));
}

export async function createInvite(input: CreateInviteInput): Promise<ProjectInviteItem> {
  const token = `inv_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
  const expiresAt = new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000);

  const invite = await prisma.projectInvite.create({
    data: {
      clientName: input.clientName,
      email: input.email,
      expiresAt,
      id: `invite_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      password: input.password,
      projectId: input.projectId,
      token,
    },
  });

  await prisma.projectLog.create({
    data: {
      action: "INVITE_CREATED",
      description: `Client invite created for ${input.clientName} (${input.email}).`,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId: input.projectId,
    },
  });

  return {
    accessedAt: invite.accessedAt,
    clientName: invite.clientName,
    createdAt: invite.createdAt,
    email: invite.email,
    expiresAt: invite.expiresAt,
    id: invite.id,
    password: invite.password,
    projectId: invite.projectId,
    token: invite.token,
    updatedAt: invite.updatedAt,
  };
}

export async function verifyInvite(input: VerifyInviteInput): Promise<VerifyInviteResponse> {
  const invite = await prisma.projectInvite.findUnique({
    where: { token: input.token },
    include: { project: { select: { id: true, slug: true, title: true } } },
  });

  if (!invite) {
    throw new InviteNotFoundError();
  }

  if (invite.password !== input.password) {
    throw new InvalidInviteCredentialsError();
  }

  if (new Date() > invite.expiresAt) {
    throw new InviteExpiredError();
  }

  await prisma.projectInvite.update({
    where: { id: invite.id },
    data: { accessedAt: new Date() },
  });

  await prisma.projectLog.create({
    data: {
      action: "INVITE_ACCEPTED",
      description: `Client "${invite.clientName}" accessed the project portal.`,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId: invite.projectId,
    },
  });

  return {
    clientName: invite.clientName,
    projectId: invite.project.id,
    projectSlug: invite.project.slug,
    projectTitle: invite.project.title,
    token: invite.token,
    valid: true,
  };
}

export async function deleteInvite(id: string): Promise<{ success: boolean; id: string }> {
  const existing = await prisma.projectInvite.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new InviteNotFoundError();
  }

  await prisma.projectInvite.delete({
    where: { id },
  });

  return { id, success: true };
}
