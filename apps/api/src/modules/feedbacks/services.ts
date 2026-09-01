import { prisma } from "../../utils/prisma";
import type { CreateFeedbackInput } from "./schema";
import type { FeedbackItem } from "./types";

export class FeedbackNotFoundError extends Error {
  constructor() {
    super("Feedback not found");
    this.name = "FeedbackNotFoundError";
  }
}

export async function listProjectFeedbacks(projectId: string): Promise<FeedbackItem[]> {
  const feedbacks = await prisma.feedback.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });

  return feedbacks.map((fb) => ({
    createdAt: fb.createdAt,
    description: fb.description,
    id: fb.id,
    projectId: fb.projectId,
    rating: fb.rating,
    title: fb.title,
    updatedAt: fb.updatedAt,
  }));
}

export async function createFeedback(input: CreateFeedbackInput): Promise<FeedbackItem> {
  const feedback = await prisma.feedback.create({
    data: {
      description: input.description,
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId: input.projectId,
      rating: input.rating,
      title: input.title,
    },
  });

  await prisma.projectLog.create({
    data: {
      action: "FEEDBACK_SUBMITTED",
      description: `Client feedback "${input.title}" added (${input.rating ? `${input.rating} stars` : "no rating"}).`,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId: input.projectId,
    },
  });

  return {
    createdAt: feedback.createdAt,
    description: feedback.description,
    id: feedback.id,
    projectId: feedback.projectId,
    rating: feedback.rating,
    title: feedback.title,
    updatedAt: feedback.updatedAt,
  };
}

export async function deleteFeedback(id: string): Promise<{ success: boolean; id: string }> {
  const existing = await prisma.feedback.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new FeedbackNotFoundError();
  }

  await prisma.feedback.delete({
    where: { id },
  });

  return { id, success: true };
}
