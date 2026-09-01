import { z } from "zod";

export const createInviteSchema = z.object({
  clientName: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  expiresInDays: z.coerce.number().int().min(1).max(365).default(30),
  password: z.string().trim().min(4).max(100),
  projectId: z.string().trim().min(1),
});

export const verifyInviteSchema = z.object({
  password: z.string().trim().min(1),
  token: z.string().trim().min(1),
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;
export type VerifyInviteInput = z.infer<typeof verifyInviteSchema>;
