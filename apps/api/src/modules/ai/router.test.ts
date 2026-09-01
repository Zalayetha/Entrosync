import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";

const mocks = vi.hoisted(() => ({
  authHandler: vi.fn(),
  createMilestone: vi.fn(),
  createProject: vi.fn(),
  findFirstProject: vi.fn(),
  findUniqueProject: vi.fn(),
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
    milestone: {
      create: mocks.createMilestone,
    },
    project: {
      create: mocks.createProject,
      findFirst: mocks.findFirstProject,
      findUnique: mocks.findUniqueProject,
    },
  },
}));

describe("ai router", () => {
  beforeEach(() => {
    mocks.getSession.mockReset();
    mocks.findUniqueProject.mockReset();
    mocks.createProject.mockReset();
    mocks.createMilestone.mockReset();
    mocks.findFirstProject.mockReset();

    mocks.getSession.mockResolvedValue({
      session: { id: "s1", userId: "u1" },
      user: { email: "user@example.com", id: "u1", name: "Test User", role: "user" },
    });
  });

  it("generates structured brief proposal from raw chat text", async () => {
    const rawText = "Client needs a customer portal web app with invoicing and auth";
    const res = await app.request("/ai/generate-brief", {
      body: JSON.stringify({ rawText }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as { scopeOfWork: unknown[]; title: string };
    expect(data.scopeOfWork).toHaveLength(3);
    expect(data.title).toBeTruthy();
  });
});
