import { z } from "zod";

export const currencySchema = z.enum(["IDR", "USD"]);
export const invoiceStatusSchema = z.enum(["PENDING", "PAID"]);

export const invoicesQuerySchema = z.object({
  cursor: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  projectId: z.string().trim().optional(),
  status: z
    .union([invoiceStatusSchema, z.literal("ALL")])
    .optional()
    .default("ALL"),
});

export const createInvoiceSchema = z.object({
  amount: z.coerce.number().positive(),
  currency: currencySchema.optional().default("IDR"),
  description: z.string().trim().optional(),
  dueDate: z.string().datetime().optional().nullable(),
  invoiceNote: z.string().trim().optional(),
  issuedDate: z.string().datetime().optional().nullable(),
  paymentLink: z.string().trim().url().optional().nullable(),
  paymentMethod: z.string().trim().optional(),
  projectId: z.string().trim().min(1),
  status: invoiceStatusSchema.optional().default("PENDING"),
});

export const updateInvoiceSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  currency: currencySchema.optional(),
  description: z.string().trim().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  invoiceNote: z.string().trim().optional().nullable(),
  issuedDate: z.string().datetime().optional().nullable(),
  paymentLink: z.string().trim().url().optional().nullable(),
  paymentMethod: z.string().trim().optional().nullable(),
  status: invoiceStatusSchema.optional(),
});

export type InvoicesQuery = z.infer<typeof invoicesQuerySchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
