import { z } from "zod";

export const issueStatusSchema = z.enum([
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
  "CANCELLED",
]);

export const createIssueSchema = z.object({
  description: z.string().trim().optional(),
  milestoneId: z.string().trim().min(1),
  startDate: z.string().datetime().optional().nullable(),
  status: issueStatusSchema.optional().default("BACKLOG"),
  targetDate: z.string().datetime().optional().nullable(),
  title: z.string().trim().min(1).max(200),
});

export const updateIssueSchema = z.object({
  description: z.string().trim().optional().nullable(),
  milestoneId: z.string().trim().min(1).optional(),
  startDate: z.string().datetime().optional().nullable(),
  status: issueStatusSchema.optional(),
  targetDate: z.string().datetime().optional().nullable(),
  title: z.string().trim().min(1).max(200).optional(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
