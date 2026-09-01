import { z } from "zod";

export const createMilestoneSchema = z.object({
  description: z.string().trim().optional(),
  projectId: z.string().trim().min(1),
  startDate: z.string().datetime().optional().nullable(),
  targetDate: z.string().datetime().optional().nullable(),
  title: z.string().trim().min(1).max(200),
});

export const updateMilestoneSchema = z.object({
  description: z.string().trim().optional().nullable(),
  progress: z.number().int().min(0).max(100).optional(),
  startDate: z.string().datetime().optional().nullable(),
  targetDate: z.string().datetime().optional().nullable(),
  title: z.string().trim().min(1).max(200).optional(),
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
