import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";
import type { ProjectDetailResponse, ProjectListResponse } from "./types";

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
    project: {
      create: mocks.create,
      delete: mocks.delete,
      findFirst: mocks.findFirst,
      findMany: mocks.findMany,
      findUnique: mocks.findUnique,
      update: mocks.update,
    },
    projectLog: {
      create: vi.fn(),
    },
  },
}));

const baseDate = new Date("2026-07-03T00:00:00.000Z");

describe("projects router", () => {
  beforeEach(() => {
    mocks.getSession.mockReset();
    mocks.findMany.mockReset();
    mocks.findFirst.mockReset();
    mocks.findUnique.mockReset();
    mocks.create.mockReset();
    mocks.update.mockReset();
    mocks.delete.mockReset();

    mocks.getSession.mockResolvedValue({
      session: { id: "s1", userId: "u1" },
      user: { email: "user@example.com", id: "u1", name: "Test User", role: "user" },
    });
  });

  it("returns unauthorized without session", async () => {
    mocks.getSession.mockResolvedValue(null);
    const res = await app.request("/projects");
    expect(res.status).toBe(401);
  });

  it("lists projects for current user", async () => {
    mocks.findMany.mockResolvedValue([
      {
        createdAt: baseDate,
        description: "Test desc",
        id: "p1",
        invites: [{ clientName: "Client A" }],
        milestones: [{ progress: 50, issues: [{ id: "i1", status: "DONE" }] }],
        slug: "test-proj",
        startDate: null,
        status: "IN_PROGRESS",
        targetDate: null,
        title: "Test Proj",
        updatedAt: baseDate,
        userId: "u1",
      },
    ]);

    const res = await app.request("/projects");
    expect(res.status).toBe(200);
    const data = (await res.json()) as ProjectListResponse;
    expect(data.items).toHaveLength(1);
    expect(data.items[0]?.clientName).toBe("Client A");
    expect(data.items[0]?.progress).toBe(50);
  });

  it("creates a new project", async () => {
    mocks.findUnique.mockResolvedValue(null);
    mocks.create.mockResolvedValue({ id: "p-new" });
    mocks.findFirst.mockResolvedValue({
      createdAt: baseDate,
      description: "A cool project",
      feedbacks: [],
      id: "p-new",
      invites: [],
      invoices: [],
      logs: [],
      milestones: [],
      resources: [],
      slug: "new-client-project",
      startDate: null,
      status: "BACKLOG",
      targetDate: null,
      teams: [],
      title: "New Client Project",
      updatedAt: baseDate,
      userId: "u1",
    });

    const res = await app.request("/projects", {
      body: JSON.stringify({
        title: "New Client Project",
        description: "A cool project",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    expect(res.status).toBe(201);
    const data = (await res.json()) as ProjectDetailResponse;
    expect(data.title).toBe("New Client Project");
  });

  it("returns 404 for missing project detail", async () => {
    mocks.findFirst.mockResolvedValue(null);
    const res = await app.request("/projects/missing-slug");
    expect(res.status).toBe(404);
  });

  it("deletes a project", async () => {
    mocks.findFirst.mockResolvedValue({ id: "p1", userId: "u1" });
    mocks.delete.mockResolvedValue({ id: "p1" });

    const res = await app.request("/projects/p1", { method: "DELETE" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: "p1", success: true });
  });
});
