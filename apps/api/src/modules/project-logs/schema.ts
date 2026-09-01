import { z } from "zod";

export const projectLogsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const createProjectLogSchema = z.object({
  action: z.string().trim().min(1).max(100),
  description: z.string().trim().optional().nullable(),
  projectId: z.string().trim().min(1),
});

export type ProjectLogsQuery = z.infer<typeof projectLogsQuerySchema>;
export type CreateProjectLogInput = z.infer<typeof createProjectLogSchema>;
