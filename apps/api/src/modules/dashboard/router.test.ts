import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";
import type { DashboardStats } from "./types";

const mocks = vi.hoisted(() => ({
  authHandler: vi.fn(),
  findManyInvoice: vi.fn(),
  findManyLog: vi.fn(),
  findManyProject: vi.fn(),
  getSession: vi.fn(),
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
      findMany: mocks.findManyInvoice,
    },
    project: {
      findMany: mocks.findManyProject,
    },
    projectLog: {
      findMany: mocks.findManyLog,
    },
  },
}));

describe("dashboard router", () => {
  beforeEach(() => {
    mocks.getSession.mockReset();
    mocks.findManyProject.mockReset();
    mocks.findManyInvoice.mockReset();
    mocks.findManyLog.mockReset();

    mocks.getSession.mockResolvedValue({
      session: { id: "s1", userId: "u1" },
      user: { email: "user@example.com", id: "u1", name: "Test User", role: "user" },
    });
  });

  it("returns dashboard stats", async () => {
    mocks.findManyProject.mockResolvedValue([
      {
        id: "p1",
        invoices: [{ amount: 1000000, currency: "IDR", issuedDate: new Date(), status: "PAID" }],
        milestones: [{ id: "m1", progress: 100, targetDate: new Date() }],
        status: "IN_PROGRESS",
      },
    ]);

    const res = await app.request("/dashboard/stats");
    expect(res.status).toBe(200);
    const data = (await res.json()) as DashboardStats;
    expect(data.activeProjectsCount).toBe(1);
    expect(data.totalRevenueYtd).toBe(1000000);
  });
});
