import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(5000),
  issueId: z.string().trim().min(1),
  parentId: z.string().trim().min(1).optional().nullable(),
});

export const updateCommentSchema = z.object({
  content: z.string().trim().min(1).max(5000),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
