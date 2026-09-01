import { prisma } from "../../utils/prisma";
import type { CreateIssueInput, UpdateIssueInput } from "./schema";
import type { IssueItem } from "./types";

export class IssueNotFoundError extends Error {
  constructor() {
    super("Issue not found");
    this.name = "IssueNotFoundError";
  }
}

async function syncMilestoneProgress(milestoneId: string) {
  const issues = await prisma.issue.findMany({
    where: { milestoneId },
    select: { status: true },
  });

  if (issues.length === 0) {
    return;
  }

  const doneCount = issues.filter((iss) => iss.status === "DONE").length;
  const progress = Math.round((doneCount / issues.length) * 100);

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { progress },
  });
}

export async function listMilestoneIssues(milestoneId: string): Promise<IssueItem[]> {
  const issues = await prisma.issue.findMany({
    where: { milestoneId },
    orderBy: { createdAt: "asc" },
    include: {
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { id: true, name: true, role: true, image: true } },
        },
      },
    },
  });

  return issues.map((iss) => ({
    comments: iss.comments.map((c) => ({
      authorName: c.user?.name ?? "User",
      authorRole: c.user?.role ?? "Member",
      content: c.content,
      createdAt: c.createdAt,
      id: c.id,
      issueId: c.issueId,
      parentId: c.parentId,
      replies: [],
      updatedAt: c.updatedAt,
      userId: c.userId,
    })),
    createdAt: iss.createdAt,
    description: iss.description,
    id: iss.id,
    milestoneId: iss.milestoneId,
    startDate: iss.startDate,
    status: iss.status,
    targetDate: iss.targetDate,
    title: iss.title,
    updatedAt: iss.updatedAt,
  }));
}

export async function createIssue(input: CreateIssueInput): Promise<IssueItem> {
  const milestone = await prisma.milestone.findUnique({
    where: { id: input.milestoneId },
    select: { projectId: true },
  });

  const issue = await prisma.issue.create({
    data: {
      description: input.description,
      id: `issue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      milestoneId: input.milestoneId,
      startDate: input.startDate ? new Date(input.startDate) : null,
      status: input.status,
      targetDate: input.targetDate ? new Date(input.targetDate) : null,
      title: input.title,
    },
  });

  if (milestone) {
    await prisma.projectLog.create({
      data: {
        action: "ISSUE_CREATED",
        description: `Issue "${input.title}" created.`,
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        projectId: milestone.projectId,
      },
    });
  }

  await syncMilestoneProgress(input.milestoneId);

  return {
    comments: [],
    createdAt: issue.createdAt,
    description: issue.description,
    id: issue.id,
    milestoneId: issue.milestoneId,
    startDate: issue.startDate,
    status: issue.status,
    targetDate: issue.targetDate,
    title: issue.title,
    updatedAt: issue.updatedAt,
  };
}

export async function updateIssue(id: string, input: UpdateIssueInput): Promise<IssueItem> {
  const existing = await prisma.issue.findUnique({
    where: { id },
    include: { milestone: { select: { projectId: true } } },
  });

  if (!existing) {
    throw new IssueNotFoundError();
  }

  const updated = await prisma.issue.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.milestoneId !== undefined ? { milestoneId: input.milestoneId } : {}),
      ...(input.startDate !== undefined
        ? { startDate: input.startDate ? new Date(input.startDate) : null }
        : {}),
      ...(input.targetDate !== undefined
        ? { targetDate: input.targetDate ? new Date(input.targetDate) : null }
        : {}),
    },
    include: {
      comments: {
        include: {
          user: { select: { id: true, name: true, role: true, image: true } },
        },
      },
    },
  });

  if (input.status && input.status !== existing.status) {
    await prisma.projectLog.create({
      data: {
        action: `ISSUE_${input.status}`,
        description: `Issue "${updated.title}" status changed to ${input.status}.`,
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        projectId: existing.milestone.projectId,
      },
    });
  }

  await syncMilestoneProgress(updated.milestoneId);
  if (input.milestoneId && input.milestoneId !== existing.milestoneId) {
    await syncMilestoneProgress(existing.milestoneId);
  }

  return {
    comments: updated.comments.map((c) => ({
      authorName: c.user?.name ?? "User",
      authorRole: c.user?.role ?? "Member",
      content: c.content,
      createdAt: c.createdAt,
      id: c.id,
      issueId: c.issueId,
      parentId: c.parentId,
      replies: [],
      updatedAt: c.updatedAt,
      userId: c.userId,
    })),
    createdAt: updated.createdAt,
    description: updated.description,
    id: updated.id,
    milestoneId: updated.milestoneId,
    startDate: updated.startDate,
    status: updated.status,
    targetDate: updated.targetDate,
    title: updated.title,
    updatedAt: updated.updatedAt,
  };
}

export async function deleteIssue(id: string): Promise<{ success: boolean; id: string }> {
  const existing = await prisma.issue.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new IssueNotFoundError();
  }

  await prisma.issue.delete({
    where: { id },
  });

  await syncMilestoneProgress(existing.milestoneId);

  return { id, success: true };
}
