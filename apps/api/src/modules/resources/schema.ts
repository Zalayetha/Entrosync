import { z } from "zod";

export const resourceTypeSchema = z.enum(["FILE", "LINK"]);

export const createResourceSchema = z.object({
  content: z.string().trim().optional().nullable(),
  projectId: z.string().trim().min(1),
  title: z.string().trim().min(1).max(200),
  type: resourceTypeSchema,
  url: z.string().trim().url().optional().nullable(),
});

export const requestUploadUrlSchema = z.object({
  contentType: z.string().trim().min(1),
  filename: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type RequestUploadUrlInput = z.infer<typeof requestUploadUrlSchema>;
