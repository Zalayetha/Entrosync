import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";
import type { InviteListResponse, VerifyInviteResponse } from "./types";

const mocks = vi.hoisted(() => ({
  authHandler: vi.fn(),
  createInvite: vi.fn(),
  deleteInvite: vi.fn(),
  findFirstInvite: vi.fn(),
  findManyInvite: vi.fn(),
  findUniqueInvite: vi.fn(),
  getSession: vi.fn(),
  updateInvite: vi.fn(),
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
    projectInvite: {
      create: mocks.createInvite,
      delete: mocks.deleteInvite,
      findFirst: mocks.findFirstInvite,
      findMany: mocks.findManyInvite,
      findUnique: mocks.findUniqueInvite,
      update: mocks.updateInvite,
    },
    projectLog: {
      create: vi.fn(),
    },
  },
}));

const baseDate = new Date("2026-07-03T00:00:00.000Z");

describe("invites router", () => {
  beforeEach(() => {
    mocks.getSession.mockReset();
    mocks.findManyInvite.mockReset();
    mocks.createInvite.mockReset();
    mocks.findUniqueInvite.mockReset();
    mocks.updateInvite.mockReset();
    mocks.deleteInvite.mockReset();

    mocks.getSession.mockResolvedValue({
      session: { id: "s1", userId: "u1" },
      user: { email: "user@example.com", id: "u1", name: "Test User", role: "user" },
    });
  });

  it("lists project invites", async () => {
    mocks.findManyInvite.mockResolvedValue([
      {
        accessedAt: null,
        clientName: "John Doe",
        createdAt: baseDate,
        email: "john@example.com",
        expiresAt: new Date(Date.now() + 1000000),
        id: "inv-1",
        password: "secretpassword",
        projectId: "p1",
        token: "tok-123",
        updatedAt: baseDate,
      },
    ]);

    const res = await app.request("/invites/project/p1");
    expect(res.status).toBe(200);
    const data = (await res.json()) as InviteListResponse;
    expect(data.invites).toHaveLength(1);
    expect(data.invites[0]?.clientName).toBe("John Doe");
  });

  it("verifies valid invite token and password", async () => {
    mocks.findUniqueInvite.mockResolvedValue({
      clientName: "John Doe",
      expiresAt: new Date(Date.now() + 1000000),
      id: "inv-1",
      password: "correctpassword",
      project: { id: "p1", slug: "p1-slug", title: "Project Alpha" },
      projectId: "p1",
      token: "valid-token",
    });
    mocks.updateInvite.mockResolvedValue({});

    const res = await app.request("/invites/verify", {
      body: JSON.stringify({
        password: "correctpassword",
        token: "valid-token",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as VerifyInviteResponse;
    expect(data.valid).toBe(true);
    expect(data.projectSlug).toBe("p1-slug");
  });
});
