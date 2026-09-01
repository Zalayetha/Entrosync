import { prisma } from "../../utils/prisma";
import type { CreateCommentInput, UpdateCommentInput } from "./schema";
import type { CommentItem } from "./types";

export class CommentNotFoundError extends Error {
  constructor() {
    super("Comment not found");
    this.name = "CommentNotFoundError";
  }
}

export class CommentForbiddenError extends Error {
  constructor() {
    super("Comment forbidden");
    this.name = "CommentForbiddenError";
  }
}

export async function listIssueComments(issueId: string): Promise<CommentItem[]> {
  const comments = await prisma.comment.findMany({
    where: { issueId },
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
  });

  const map = new Map<string, CommentItem>();
  const topLevelComments: CommentItem[] = [];

  for (const c of comments) {
    const item: CommentItem = {
      authorName: c.user?.name ?? "Guest User",
      authorRole: c.user?.role ?? "Client",
      content: c.content,
      createdAt: c.createdAt,
      id: c.id,
      issueId: c.issueId,
      parentId: c.parentId,
      replies: [],
      updatedAt: c.updatedAt,
      userId: c.userId,
    };
    map.set(c.id, item);
  }

  for (const c of comments) {
    const item = map.get(c.id);
    if (!item) continue;
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)?.replies.push(item);
    } else {
      topLevelComments.push(item);
    }
  }

  return topLevelComments;
}

export async function createComment(
  userId: string | null,
  input: CreateCommentInput,
): Promise<CommentItem> {
  const comment = await prisma.comment.create({
    data: {
      content: input.content,
      id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      issueId: input.issueId,
      parentId: input.parentId,
      userId: userId ?? undefined,
    },
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
  });

  return {
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
}

export async function updateComment(
  id: string,
  userId: string,
  input: UpdateCommentInput,
): Promise<CommentItem> {
  const existing = await prisma.comment.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new CommentNotFoundError();
  }

  if (existing.userId !== userId) {
    throw new CommentForbiddenError();
  }

  const comment = await prisma.comment.update({
    where: { id },
    data: {
      content: input.content,
    },
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
  });

  return {
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
}

export async function deleteComment(
  id: string,
  userId: string,
): Promise<{ success: boolean; id: string }> {
  const existing = await prisma.comment.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new CommentNotFoundError();
  }

  if (existing.userId !== userId) {
    throw new CommentForbiddenError();
  }

  await prisma.comment.delete({
    where: { id },
  });

  return { id, success: true };
}
