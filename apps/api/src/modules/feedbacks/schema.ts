import { z } from "zod";

export const createFeedbackSchema = z.object({
  description: z.string().trim().optional(),
  projectId: z.string().trim().min(1),
  rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
  title: z.string().trim().min(1).max(200),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
