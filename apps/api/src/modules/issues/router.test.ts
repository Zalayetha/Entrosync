import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";
import type { IssueDetailResponse, IssueListResponse } from "./types";

const mocks = vi.hoisted(() => ({
  authHandler: vi.fn(),
  createIssue: vi.fn(),
  deleteIssue: vi.fn(),
  findManyIssue: vi.fn(),
  findUniqueIssue: vi.fn(),
  findUniqueMilestone: vi.fn(),
  getSession: vi.fn(),
  updateIssue: vi.fn(),
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
    issue: {
      create: mocks.createIssue,
      delete: mocks.deleteIssue,
      findMany: mocks.findManyIssue,
      findUnique: mocks.findUniqueIssue,
      update: mocks.updateIssue,
    },
    milestone: {
      findUnique: mocks.findUniqueMilestone,
      update: mocks.updateMilestone,
    },
    projectLog: {
      create: vi.fn(),
    },
  },
}));

const baseDate = new Date("2026-07-03T00:00:00.000Z");

describe("issues router", () => {
  beforeEach(() => {
    mocks.getSession.mockReset();
    mocks.findManyIssue.mockReset();
    mocks.createIssue.mockReset();
    mocks.updateIssue.mockReset();
    mocks.deleteIssue.mockReset();
    mocks.findUniqueIssue.mockReset();
    mocks.findUniqueMilestone.mockReset();

    mocks.getSession.mockResolvedValue({
      session: { id: "s1", userId: "u1" },
      user: { email: "user@example.com", id: "u1", name: "Test User", role: "user" },
    });
  });

  it("lists milestone issues", async () => {
    mocks.findManyIssue.mockResolvedValue([
      {
        comments: [],
        createdAt: baseDate,
        description: null,
        id: "i1",
        milestoneId: "m1",
        startDate: null,
        status: "TODO",
        targetDate: null,
        title: "Setup DB",
        updatedAt: baseDate,
      },
    ]);

    const res = await app.request("/issues/milestone/m1");
    expect(res.status).toBe(200);
    const data = (await res.json()) as IssueListResponse;
    expect(data.issues).toHaveLength(1);
    expect(data.issues[0]?.title).toBe("Setup DB");
  });

  it("creates an issue", async () => {
    mocks.findUniqueMilestone.mockResolvedValue({ projectId: "p1" });
    mocks.createIssue.mockResolvedValue({
      createdAt: baseDate,
      description: null,
      id: "i-new",
      milestoneId: "m1",
      startDate: null,
      status: "TODO",
      targetDate: null,
      title: "Write schemas",
      updatedAt: baseDate,
    });
    mocks.findManyIssue.mockResolvedValue([{ status: "TODO" }]);

    const res = await app.request("/issues", {
      body: JSON.stringify({
        milestoneId: "m1",
        status: "TODO",
        title: "Write schemas",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    expect(res.status).toBe(201);
    const data = (await res.json()) as IssueDetailResponse;
    expect(data.title).toBe("Write schemas");
  });
});
