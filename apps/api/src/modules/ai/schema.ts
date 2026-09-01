import { z } from "zod";

export const generateBriefSchema = z.object({
  rawText: z.string().trim().min(10).max(30000),
});

export const milestoneScopeItemSchema = z.object({
  description: z.string().trim().optional(),
  suggestedDays: z.number().int().min(1).default(7),
  tasks: z.array(z.string().trim()).default([]),
  title: z.string().trim().min(1),
});

export const convertToProjectSchema = z.object({
  clientName: z.string().trim().min(1).default("Client"),
  description: z.string().trim().optional(),
  milestones: z.array(milestoneScopeItemSchema).min(1),
  proposal: z.string().trim().optional(),
  startDate: z.string().datetime().optional().nullable(),
  title: z.string().trim().min(1).max(200),
});

export type GenerateBriefInput = z.infer<typeof generateBriefSchema>;
export type MilestoneScopeItem = z.infer<typeof milestoneScopeItemSchema>;
export type ConvertToProjectInput = z.infer<typeof convertToProjectSchema>;
