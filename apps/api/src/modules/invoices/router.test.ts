import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";
import type { InvoiceDetail, InvoiceListResponse } from "./types";

const mocks = vi.hoisted(() => ({
  authHandler: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
  findFirst: vi.fn(),
  findMany: vi.fn(),
  findUnique: vi.fn(),
  getSession: vi.fn(),
  update: vi.fn(),
}));

vi.mock("../../modules/auth/auth", () => ({
  auth: {
    api: {
      getSession: mocks.getSession,
    },
    handler: mocks.authHandler,
  },
}));

vi.mock("../../utils/prisma", () => ({
  prisma: {
    invoice: {
      create: mocks.create,
      delete: mocks.delete,
      findFirst: mocks.findFirst,
      findMany: mocks.findMany,
      findUnique: mocks.findUnique,
      update: mocks.update,
    },
    project: {
      findFirst: mocks.findFirst,
    },
    projectLog: {
      create: vi.fn(),
    },
  },
}));

const baseDate = new Date("2026-07-03T00:00:00.000Z");

describe("invoices router", () => {
  beforeEach(() => {
    mocks.getSession.mockReset();
    mocks.findMany.mockReset();
    mocks.findFirst.mockReset();
    mocks.create.mockReset();
    mocks.update.mockReset();
    mocks.delete.mockReset();

    mocks.getSession.mockResolvedValue({
      session: { id: "s1", userId: "u1" },
      user: { email: "user@example.com", id: "u1", name: "Test User", role: "user" },
    });
  });

  it("lists invoices for user projects", async () => {
    mocks.findMany.mockResolvedValue([
      {
        amount: 5000000,
        createdAt: baseDate,
        currency: "IDR",
        description: "Sprint 1",
        dueDate: null,
        id: "inv-1",
        invoiceNote: null,
        issuedDate: null,
        paymentLink: null,
        paymentMethod: null,
        project: { id: "p1", invites: [{ clientName: "Acme" }], slug: "acme", title: "Acme Web" },
        projectId: "p1",
        status: "PENDING",
        updatedAt: baseDate,
      },
    ]);

    const res = await app.request("/invoices");
    expect(res.status).toBe(200);
    const data = (await res.json()) as InvoiceListResponse;
    expect(data.items).toHaveLength(1);
    expect(data.items[0]?.amount).toBe(5000000);
    expect(data.items[0]?.project.clientName).toBe("Acme");
  });

  it("creates an invoice", async () => {
    mocks.findFirst.mockResolvedValue({ id: "p1", userId: "u1" });
    mocks.create.mockResolvedValue({
      amount: 2500000,
      createdAt: baseDate,
      currency: "IDR",
      description: "Down payment",
      dueDate: null,
      id: "inv-2",
      invoiceNote: null,
      issuedDate: null,
      paymentLink: null,
      paymentMethod: null,
      project: { id: "p1", invites: [], slug: "p1", title: "P1" },
      projectId: "p1",
      status: "PENDING",
      updatedAt: baseDate,
    });

    const res = await app.request("/invoices", {
      body: JSON.stringify({
        amount: 2500000,
        currency: "IDR",
        description: "Down payment",
        projectId: "p1",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    expect(res.status).toBe(201);
    const data = (await res.json()) as InvoiceDetail;
    expect(data.amount).toBe(2500000);
  });
});
