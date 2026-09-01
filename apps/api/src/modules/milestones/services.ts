import { prisma } from "../../utils/prisma";
import type { CreateMilestoneInput, UpdateMilestoneInput } from "./schema";
import type { MilestoneItem } from "./types";

export class MilestoneNotFoundError extends Error {
  constructor() {
    super("Milestone not found");
    this.name = "MilestoneNotFoundError";
  }
}

export async function listProjectMilestones(projectId: string): Promise<MilestoneItem[]> {
  const milestones = await prisma.milestone.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    include: {
      issues: {
        orderBy: { createdAt: "asc" },
        include: {
          comments: {
            orderBy: { createdAt: "asc" },
            include: {
              user: {
                select: { id: true, name: true, role: true, image: true },
              },
            },
          },
        },
      },
    },
  });

  return milestones.map((ms) => ({
    createdAt: ms.createdAt,
    description: ms.description,
    id: ms.id,
    issues: ms.issues.map((iss) => ({
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
    })),
    progress: ms.progress,
    projectId: ms.projectId,
    startDate: ms.startDate,
    targetDate: ms.targetDate,
    title: ms.title,
    updatedAt: ms.updatedAt,
  }));
}

export async function createMilestone(input: CreateMilestoneInput): Promise<MilestoneItem> {
  const milestone = await prisma.milestone.create({
    data: {
      description: input.description,
      id: `ms_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      progress: 0,
      projectId: input.projectId,
      startDate: input.startDate ? new Date(input.startDate) : null,
      targetDate: input.targetDate ? new Date(input.targetDate) : null,
      title: input.title,
    },
  });

  await prisma.projectLog.create({
    data: {
      action: "MILESTONE_CREATED",
      description: `Milestone "${input.title}" added to project.`,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId: input.projectId,
    },
  });

  return {
    createdAt: milestone.createdAt,
    description: milestone.description,
    id: milestone.id,
    issues: [],
    progress: milestone.progress,
    projectId: milestone.projectId,
    startDate: milestone.startDate,
    targetDate: milestone.targetDate,
    title: milestone.title,
    updatedAt: milestone.updatedAt,
  };
}

export async function updateMilestone(
  id: string,
  input: UpdateMilestoneInput,
): Promise<MilestoneItem> {
  const existing = await prisma.milestone.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new MilestoneNotFoundError();
  }

  const updated = await prisma.milestone.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.progress !== undefined ? { progress: input.progress } : {}),
      ...(input.startDate !== undefined
        ? { startDate: input.startDate ? new Date(input.startDate) : null }
        : {}),
      ...(input.targetDate !== undefined
        ? { targetDate: input.targetDate ? new Date(input.targetDate) : null }
        : {}),
    },
    include: {
      issues: {
        include: {
          comments: {
            include: {
              user: { select: { id: true, name: true, role: true, image: true } },
            },
          },
        },
      },
    },
  });

  if (input.progress === 100 && existing.progress !== 100) {
    await prisma.projectLog.create({
      data: {
        action: "MILESTONE_COMPLETED",
        description: `Milestone "${updated.title}" marked 100% complete.`,
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        projectId: updated.projectId,
      },
    });
  }

  return {
    createdAt: updated.createdAt,
    description: updated.description,
    id: updated.id,
    issues: updated.issues.map((iss) => ({
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
    })),
    progress: updated.progress,
    projectId: updated.projectId,
    startDate: updated.startDate,
    targetDate: updated.targetDate,
    title: updated.title,
    updatedAt: updated.updatedAt,
  };
}

export async function deleteMilestone(id: string): Promise<{ success: boolean; id: string }> {
  const existing = await prisma.milestone.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new MilestoneNotFoundError();
  }

  await prisma.milestone.delete({
    where: { id },
  });

  return { id, success: true };
}
