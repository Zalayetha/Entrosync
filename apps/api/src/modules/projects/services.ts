import type { Prisma } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import { generateSlug } from "../../utils/slug";
import type { CreateProjectInput, ProjectsQuery, UpdateProjectInput } from "./schema";
import type {
  CommentItem,
  FeedbackItem,
  IssueItem,
  MilestoneItem,
  ProjectDetailResponse,
  ProjectInvoiceItem,
  ProjectListItem,
  ProjectListResponse,
  ProjectLogItem,
  ResourceItem,
  TeamSummary,
} from "./types";

export class ProjectNotFoundError extends Error {
  constructor() {
    super("Project not found");
    this.name = "ProjectNotFoundError";
  }
}

export class ProjectSlugConflictError extends Error {
  constructor() {
    super("Project slug already in use");
    this.name = "ProjectSlugConflictError";
  }
}

export async function listProjects(
  userId: string,
  query: ProjectsQuery,
): Promise<ProjectListResponse> {
  const whereClause: Prisma.ProjectWhereInput = {
    userId,
    ...(query.status && query.status !== "ALL" ? { status: query.status } : {}),
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { slug: { contains: query.search, mode: "insensitive" } },
            {
              invites: {
                some: { clientName: { contains: query.search, mode: "insensitive" } },
              },
            },
          ],
        }
      : {}),
  };

  const projects = await prisma.project.findMany({
    where: whereClause,
    take: query.limit + 1,
    ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    include: {
      invites: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
      milestones: {
        include: {
          issues: {
            select: { id: true, status: true },
          },
        },
      },
    },
  });

  let nextCursor: string | null = null;
  if (projects.length > query.limit) {
    const nextItem = projects.pop();
    nextCursor = nextItem ? nextItem.id : null;
  }

  const items: ProjectListItem[] = projects.map((p) => {
    const clientName = p.invites[0]?.clientName ?? "Client";
    const milestonesCount = p.milestones.length;
    let issuesCount = 0;
    let totalProgress = 0;

    for (const ms of p.milestones) {
      issuesCount += ms.issues.length;
      totalProgress += ms.progress;
    }

    const progress = milestonesCount > 0 ? Math.round(totalProgress / milestonesCount) : 0;

    return {
      clientName,
      createdAt: p.createdAt,
      description: p.description,
      id: p.id,
      issuesCount,
      milestonesCount,
      progress,
      slug: p.slug,
      startDate: p.startDate,
      status: p.status,
      targetDate: p.targetDate,
      title: p.title,
      updatedAt: p.updatedAt,
      userId: p.userId,
    };
  });

  return { items, nextCursor };
}

export async function getProjectByIdOrSlug(
  idOrSlug: string,
  userId?: string,
): Promise<ProjectDetailResponse> {
  const project = await prisma.project.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      ...(userId ? { userId } : {}),
    },
    include: {
      feedbacks: {
        orderBy: { createdAt: "desc" },
      },
      invites: {
        orderBy: { createdAt: "desc" },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
      },
      logs: {
        orderBy: { createdAt: "desc" },
      },
      milestones: {
        orderBy: { createdAt: "asc" },
        include: {
          issues: {
            orderBy: { createdAt: "asc" },
            include: {
              comments: {
                orderBy: { createdAt: "asc" },
                include: {
                  user: {
                    select: {
                      id: true,
                      image: true,
                      name: true,
                      role: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      resources: {
        orderBy: { createdAt: "desc" },
      },
      teams: {
        include: {
          members: {
            select: {
              email: true,
              id: true,
              image: true,
              name: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    throw new ProjectNotFoundError();
  }

  const clientName = project.invites[0]?.clientName ?? "Client";
  const milestonesCount = project.milestones.length;
  let totalProgress = 0;

  const milestones: MilestoneItem[] = project.milestones.map((ms) => {
    totalProgress += ms.progress;

    const issues: IssueItem[] = ms.issues.map((iss) => {
      const topLevelComments: CommentItem[] = [];
      const commentMap = new Map<string, CommentItem>();

      for (const comment of iss.comments) {
        const item: CommentItem = {
          authorName: comment.user?.name ?? "Guest User",
          authorRole: comment.user?.role ?? "Client",
          content: comment.content,
          createdAt: comment.createdAt,
          id: comment.id,
          issueId: comment.issueId,
          parentId: comment.parentId,
          replies: [],
          updatedAt: comment.updatedAt,
          userId: comment.userId,
        };
        commentMap.set(comment.id, item);
      }

      for (const comment of iss.comments) {
        const item = commentMap.get(comment.id);
        if (!item) continue;
        if (comment.parentId && commentMap.has(comment.parentId)) {
          commentMap.get(comment.parentId)?.replies.push(item);
        } else {
          topLevelComments.push(item);
        }
      }

      return {
        comments: topLevelComments,
        createdAt: iss.createdAt,
        description: iss.description,
        id: iss.id,
        milestoneId: iss.milestoneId,
        startDate: iss.startDate,
        status: iss.status,
        targetDate: iss.targetDate,
        title: iss.title,
        updatedAt: iss.updatedAt,
      };
    });

    return {
      createdAt: ms.createdAt,
      description: ms.description,
      id: ms.id,
      issues,
      progress: ms.progress,
      projectId: ms.projectId,
      startDate: ms.startDate,
      targetDate: ms.targetDate,
      title: ms.title,
      updatedAt: ms.updatedAt,
    };
  });

  const progress = milestonesCount > 0 ? Math.round(totalProgress / milestonesCount) : 0;

  const invoices: ProjectInvoiceItem[] = project.invoices.map((inv) => ({
    amount: Number(inv.amount),
    createdAt: inv.createdAt,
    currency: inv.currency,
    description: inv.description,
    dueDate: inv.dueDate,
    id: inv.id,
    invoiceNote: inv.invoiceNote,
    issuedDate: inv.issuedDate,
    paymentLink: inv.paymentLink,
    paymentMethod: inv.paymentMethod,
    projectId: inv.projectId,
    status: inv.status,
    updatedAt: inv.updatedAt,
  }));

  const feedbacks: FeedbackItem[] = project.feedbacks.map((fb) => ({
    createdAt: fb.createdAt,
    description: fb.description,
    id: fb.id,
    projectId: fb.projectId,
    rating: fb.rating,
    title: fb.title,
    updatedAt: fb.updatedAt,
  }));

  const resources: ResourceItem[] = project.resources.map((res) => ({
    content: res.content,
    createdAt: res.createdAt,
    id: res.id,
    projectId: res.projectId,
    title: res.title,
    type: res.type,
    updatedAt: res.updatedAt,
    url: res.url,
  }));

  const logs: ProjectLogItem[] = project.logs.map((lg) => ({
    action: lg.action,
    createdAt: lg.createdAt,
    description: lg.description,
    id: lg.id,
    projectId: lg.projectId,
    updatedAt: lg.updatedAt,
  }));

  const teams: TeamSummary[] = project.teams.flatMap((t) =>
    t.members.map((m) => ({
      avatarUrl: m.image,
      email: m.email,
      id: m.id,
      name: m.name,
      role: m.role ?? "Member",
    })),
  );

  return {
    clientName,
    createdAt: project.createdAt,
    description: project.description,
    feedbacks,
    id: project.id,
    invites: project.invites,
    invoices,
    logs,
    milestones,
    progress,
    resources,
    slug: project.slug,
    startDate: project.startDate,
    status: project.status,
    targetDate: project.targetDate,
    teams,
    title: project.title,
    updatedAt: project.updatedAt,
    userId: project.userId,
  };
}

export async function createProject(
  userId: string,
  input: CreateProjectInput,
): Promise<ProjectDetailResponse> {
  const baseSlug = input.slug ? generateSlug(input.slug) : generateSlug(input.title);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const project = await prisma.project.create({
    data: {
      description: input.description,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      slug,
      startDate: input.startDate ? new Date(input.startDate) : null,
      status: input.status,
      targetDate: input.targetDate ? new Date(input.targetDate) : null,
      title: input.title,
      userId,
      logs: {
        create: {
          action: "PROJECT_CREATED",
          description: `Project "${input.title}" initialized.`,
          id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        },
      },
      ...(input.clientName
        ? {
            invites: {
              create: {
                clientName: input.clientName,
                email: `${slug}-client@example.com`,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                id: `invite_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                password: `pass-${Math.random().toString(36).substring(2, 8)}`,
                token: `${slug}-invite-${Math.random().toString(36).substring(2, 8)}`,
              },
            },
          }
        : {}),
    },
  });

  return getProjectByIdOrSlug(project.id, userId);
}

export async function updateProject(
  id: string,
  userId: string,
  input: UpdateProjectInput,
): Promise<ProjectDetailResponse> {
  const existing = await prisma.project.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new ProjectNotFoundError();
  }

  if (input.slug && input.slug !== existing.slug) {
    const slugExists = await prisma.project.findUnique({
      where: { slug: input.slug },
    });
    if (slugExists) {
      throw new ProjectSlugConflictError();
    }
  }

  await prisma.project.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.startDate !== undefined
        ? { startDate: input.startDate ? new Date(input.startDate) : null }
        : {}),
      ...(input.targetDate !== undefined
        ? { targetDate: input.targetDate ? new Date(input.targetDate) : null }
        : {}),
      logs: {
        create: {
          action: "PROJECT_UPDATED",
          description: "Project details updated.",
          id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        },
      },
    },
  });

  return getProjectByIdOrSlug(id, userId);
}

export async function deleteProject(
  id: string,
  userId: string,
): Promise<{ success: boolean; id: string }> {
  const existing = await prisma.project.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new ProjectNotFoundError();
  }

  await prisma.project.delete({
    where: { id },
  });

  return { id, success: true };
}
