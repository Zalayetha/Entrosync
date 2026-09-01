import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";
import type { ProjectLogListResponse } from "./types";

const mocks = vi.hoisted(() => ({
  authHandler: vi.fn(),
  createLog: vi.fn(),
  findManyLog: vi.fn(),
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
    projectLog: {
      create: mocks.createLog,
      findMany: mocks.findManyLog,
    },
  },
}));

const baseDate = new Date("2026-07-03T00:00:00.000Z");

describe("project logs router", () => {
  beforeEach(() => {
    mocks.getSession.mockReset();
    mocks.findManyLog.mockReset();
    mocks.createLog.mockReset();

    mocks.getSession.mockResolvedValue({
      session: { id: "s1", userId: "u1" },
      user: { email: "user@example.com", id: "u1", name: "Test User", role: "user" },
    });
  });

  it("lists project logs", async () => {
    mocks.findManyLog.mockResolvedValue([
      {
        action: "PROJECT_CREATED",
        createdAt: baseDate,
        description: "Project initialized",
        id: "l1",
        projectId: "p1",
        updatedAt: baseDate,
      },
    ]);

    const res = await app.request("/project-logs/project/p1");
    expect(res.status).toBe(200);
    const data = (await res.json()) as ProjectLogListResponse;
    expect(data.logs).toHaveLength(1);
    expect(data.logs[0]?.action).toBe("PROJECT_CREATED");
  });
});
