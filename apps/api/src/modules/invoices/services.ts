import type { Prisma } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import type { CreateInvoiceInput, InvoicesQuery, UpdateInvoiceInput } from "./schema";
import type { InvoiceDetail, InvoiceListResponse } from "./types";

export class InvoiceNotFoundError extends Error {
  constructor() {
    super("Invoice not found");
    this.name = "InvoiceNotFoundError";
  }
}

export async function listInvoices(
  userId: string,
  query: InvoicesQuery,
): Promise<InvoiceListResponse> {
  const whereClause: Prisma.InvoiceWhereInput = {
    project: {
      userId,
    },
    ...(query.projectId ? { projectId: query.projectId } : {}),
    ...(query.status && query.status !== "ALL" ? { status: query.status } : {}),
  };

  const invoices = await prisma.invoice.findMany({
    where: whereClause,
    take: query.limit + 1,
    ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    include: {
      project: {
        select: {
          id: true,
          slug: true,
          title: true,
          invites: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: { clientName: true },
          },
        },
      },
    },
  });

  let nextCursor: string | null = null;
  if (invoices.length > query.limit) {
    const nextItem = invoices.pop();
    nextCursor = nextItem ? nextItem.id : null;
  }

  const items: InvoiceDetail[] = invoices.map((inv) => ({
    amount: Number(inv.amount),
    createdAt: inv.createdAt,
    currency: inv.currency,
    description: inv.description,
    dueDate: inv.dueDate,
    id: inv.id,
    invoiceNote: inv.invoiceNote,
    issuedDate: inv.issuedDate,
    paymentLink: inv.paymentLink,
    paymentMethod: inv.paymentMethod,
    project: {
      clientName: inv.project.invites[0]?.clientName ?? "Client",
      id: inv.project.id,
      slug: inv.project.slug,
      title: inv.project.title,
    },
    projectId: inv.projectId,
    status: inv.status,
    updatedAt: inv.updatedAt,
  }));

  return { items, nextCursor };
}

export async function getInvoiceById(id: string, userId: string): Promise<InvoiceDetail> {
  const inv = await prisma.invoice.findFirst({
    where: {
      id,
      project: { userId },
    },
    include: {
      project: {
        select: {
          id: true,
          slug: true,
          title: true,
          invites: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: { clientName: true },
          },
        },
      },
    },
  });

  if (!inv) {
    throw new InvoiceNotFoundError();
  }

  return {
    amount: Number(inv.amount),
    createdAt: inv.createdAt,
    currency: inv.currency,
    description: inv.description,
    dueDate: inv.dueDate,
    id: inv.id,
    invoiceNote: inv.invoiceNote,
    issuedDate: inv.issuedDate,
    paymentLink: inv.paymentLink,
    paymentMethod: inv.paymentMethod,
    project: {
      clientName: inv.project.invites[0]?.clientName ?? "Client",
      id: inv.project.id,
      slug: inv.project.slug,
      title: inv.project.title,
    },
    projectId: inv.projectId,
    status: inv.status,
    updatedAt: inv.updatedAt,
  };
}

export async function createInvoice(
  userId: string,
  input: CreateInvoiceInput,
): Promise<InvoiceDetail> {
  const project = await prisma.project.findFirst({
    where: { id: input.projectId, userId },
  });

  if (!project) {
    throw new InvoiceNotFoundError();
  }

  const invoice = await prisma.invoice.create({
    data: {
      amount: input.amount,
      currency: input.currency,
      description: input.description,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      invoiceNote: input.invoiceNote,
      issuedDate: input.issuedDate ? new Date(input.issuedDate) : null,
      paymentLink: input.paymentLink,
      paymentMethod: input.paymentMethod,
      projectId: input.projectId,
      status: input.status,
    },
    include: {
      project: {
        select: {
          id: true,
          slug: true,
          title: true,
          invites: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: { clientName: true },
          },
        },
      },
    },
  });

  await prisma.projectLog.create({
    data: {
      action: "INVOICE_ISSUED",
      description: `Invoice for ${input.currency} ${input.amount.toLocaleString()} issued.`,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId: input.projectId,
    },
  });

  return {
    amount: Number(invoice.amount),
    createdAt: invoice.createdAt,
    currency: invoice.currency,
    description: invoice.description,
    dueDate: invoice.dueDate,
    id: invoice.id,
    invoiceNote: invoice.invoiceNote,
    issuedDate: invoice.issuedDate,
    paymentLink: invoice.paymentLink,
    paymentMethod: invoice.paymentMethod,
    project: {
      clientName: invoice.project.invites[0]?.clientName ?? "Client",
      id: invoice.project.id,
      slug: invoice.project.slug,
      title: invoice.project.title,
    },
    projectId: invoice.projectId,
    status: invoice.status,
    updatedAt: invoice.updatedAt,
  };
}

export async function updateInvoice(
  id: string,
  userId: string,
  input: UpdateInvoiceInput,
): Promise<InvoiceDetail> {
  const existing = await prisma.invoice.findFirst({
    where: { id, project: { userId } },
    include: { project: true },
  });

  if (!existing) {
    throw new InvoiceNotFoundError();
  }

  const updated = await prisma.invoice.update({
    where: { id },
    data: {
      ...(input.amount !== undefined ? { amount: input.amount } : {}),
      ...(input.currency !== undefined ? { currency: input.currency } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.paymentMethod !== undefined ? { paymentMethod: input.paymentMethod } : {}),
      ...(input.paymentLink !== undefined ? { paymentLink: input.paymentLink } : {}),
      ...(input.invoiceNote !== undefined ? { invoiceNote: input.invoiceNote } : {}),
      ...(input.issuedDate !== undefined
        ? { issuedDate: input.issuedDate ? new Date(input.issuedDate) : null }
        : {}),
      ...(input.dueDate !== undefined
        ? { dueDate: input.dueDate ? new Date(input.dueDate) : null }
        : {}),
    },
    include: {
      project: {
        select: {
          id: true,
          slug: true,
          title: true,
          invites: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: { clientName: true },
          },
        },
      },
    },
  });

  if (input.status === "PAID" && existing.status !== "PAID") {
    await prisma.projectLog.create({
      data: {
        action: "INVOICE_PAID",
        description: `Invoice for ${updated.currency} ${Number(updated.amount).toLocaleString()} marked as paid.`,
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        projectId: existing.projectId,
      },
    });
  }

  return {
    amount: Number(updated.amount),
    createdAt: updated.createdAt,
    currency: updated.currency,
    description: updated.description,
    dueDate: updated.dueDate,
    id: updated.id,
    invoiceNote: updated.invoiceNote,
    issuedDate: updated.issuedDate,
    paymentLink: updated.paymentLink,
    paymentMethod: updated.paymentMethod,
    project: {
      clientName: updated.project.invites[0]?.clientName ?? "Client",
      id: updated.project.id,
      slug: updated.project.slug,
      title: updated.project.title,
    },
    projectId: updated.projectId,
    status: updated.status,
    updatedAt: updated.updatedAt,
  };
}

export async function deleteInvoice(
  id: string,
  userId: string,
): Promise<{ success: boolean; id: string }> {
  const existing = await prisma.invoice.findFirst({
    where: { id, project: { userId } },
  });

  if (!existing) {
    throw new InvoiceNotFoundError();
  }

  await prisma.invoice.delete({
    where: { id },
  });

  return { id, success: true };
}
