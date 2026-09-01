import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";
import type { ProjectDetailResponse } from "../projects/types";

const mocks = vi.hoisted(() => ({
  authHandler: vi.fn(),
  findFirstProject: vi.fn(),
  findUniqueInvite: vi.fn(),
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
    project: {
      findFirst: mocks.findFirstProject,
    },
    projectInvite: {
      findUnique: mocks.findUniqueInvite,
    },
  },
}));

const baseDate = new Date("2026-07-03T00:00:00.000Z");

describe("guest router", () => {
  beforeEach(() => {
    mocks.getSession.mockReset();
    mocks.findUniqueInvite.mockReset();
    mocks.findFirstProject.mockReset();

    mocks.getSession.mockResolvedValue(null);
  });

  it("returns project details for guest with valid invite token", async () => {
    mocks.findUniqueInvite.mockResolvedValue({
      clientName: "Guest Client",
      expiresAt: new Date(Date.now() + 1000000),
      id: "inv-1",
      projectId: "p1",
      token: "valid-tok",
    });
    mocks.findFirstProject.mockResolvedValue({
      createdAt: baseDate,
      description: "Guest view",
      feedbacks: [],
      id: "p1",
      invites: [{ clientName: "Guest Client" }],
      invoices: [],
      logs: [],
      milestones: [],
      resources: [],
      slug: "guest-project",
      startDate: null,
      status: "IN_PROGRESS",
      targetDate: null,
      teams: [],
      title: "Guest Project",
      updatedAt: baseDate,
      userId: "u1",
    });

    const res = await app.request("/guest/projects/valid-tok");
    expect(res.status).toBe(200);
    const data = (await res.json()) as ProjectDetailResponse;
    expect(data.title).toBe("Guest Project");
    expect(data.clientName).toBe("Guest Client");
  });

  it("returns 404 for invalid invite token", async () => {
    mocks.findUniqueInvite.mockResolvedValue(null);
    const res = await app.request("/guest/projects/invalid-tok");
    expect(res.status).toBe(404);
  });
});
