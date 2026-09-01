import { z } from "zod";

export const projectStatusSchema = z.enum([
  "BACKLOG",
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const projectsQuerySchema = z.object({
  cursor: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  search: z.string().trim().optional(),
  status: z
    .union([projectStatusSchema, z.literal("ALL")])
    .optional()
    .default("ALL"),
});

export const createProjectSchema = z.object({
  clientName: z.string().trim().optional(),
  description: z.string().trim().optional(),
  slug: z.string().trim().min(2).max(100).optional(),
  startDate: z.string().datetime().optional().nullable(),
  status: projectStatusSchema.optional().default("BACKLOG"),
  targetDate: z.string().datetime().optional().nullable(),
  title: z.string().trim().min(1).max(200),
});

export const updateProjectSchema = z.object({
  clientName: z.string().trim().optional(),
  description: z.string().trim().optional().nullable(),
  slug: z.string().trim().min(2).max(100).optional(),
  startDate: z.string().datetime().optional().nullable(),
  status: projectStatusSchema.optional(),
  targetDate: z.string().datetime().optional().nullable(),
  title: z.string().trim().min(1).max(200).optional(),
});

export type ProjectsQuery = z.infer<typeof projectsQuerySchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
