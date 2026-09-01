import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";
import type { MilestoneDetailResponse, MilestoneListResponse } from "./types";

const mocks = vi.hoisted(() => ({
  authHandler: vi.fn(),
  createMilestone: vi.fn(),
  deleteMilestone: vi.fn(),
  findManyMilestone: vi.fn(),
  findUniqueMilestone: vi.fn(),
  getSession: vi.fn(),
  updateMilestone: vi.fn(),
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
    milestone: {
      create: mocks.createMilestone,
      delete: mocks.deleteMilestone,
      findMany: mocks.findManyMilestone,
      findUnique: mocks.findUniqueMilestone,
      update: mocks.updateMilestone,
    },
    projectLog: {
      create: vi.fn(),
    },
  },
}));

const baseDate = new Date("2026-07-03T00:00:00.000Z");

describe("milestones router", () => {
  beforeEach(() => {
    mocks.getSession.mockReset();
    mocks.findManyMilestone.mockReset();
    mocks.createMilestone.mockReset();
    mocks.updateMilestone.mockReset();
    mocks.deleteMilestone.mockReset();
    mocks.findUniqueMilestone.mockReset();

    mocks.getSession.mockResolvedValue({
      session: { id: "s1", userId: "u1" },
      user: { email: "user@example.com", id: "u1", name: "Test User", role: "user" },
    });
  });

  it("lists project milestones", async () => {
    mocks.findManyMilestone.mockResolvedValue([
      {
        createdAt: baseDate,
        description: "Initial discovery",
        id: "ms-1",
        issues: [],
        progress: 100,
        projectId: "p1",
        startDate: null,
        targetDate: null,
        title: "Discovery Phase",
        updatedAt: baseDate,
      },
    ]);

    const res = await app.request("/milestones/project/p1");
    expect(res.status).toBe(200);
    const data = (await res.json()) as MilestoneListResponse;
    expect(data.milestones).toHaveLength(1);
    expect(data.milestones[0]?.title).toBe("Discovery Phase");
  });

  it("creates a milestone", async () => {
    mocks.createMilestone.mockResolvedValue({
      createdAt: baseDate,
      description: "Core features",
      id: "ms-2",
      progress: 0,
      projectId: "p1",
      startDate: null,
      targetDate: null,
      title: "Core Backend",
      updatedAt: baseDate,
    });

    const res = await app.request("/milestones", {
      body: JSON.stringify({
        projectId: "p1",
        title: "Core Backend",
        description: "Core features",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    expect(res.status).toBe(201);
    const data = (await res.json()) as MilestoneDetailResponse;
    expect(data.title).toBe("Core Backend");
  });
});
