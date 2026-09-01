import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";
import type { CommentItem, CommentListResponse } from "./types";

const mocks = vi.hoisted(() => ({
  authHandler: vi.fn(),
  createComment: vi.fn(),
  deleteComment: vi.fn(),
  findManyComment: vi.fn(),
  findUniqueComment: vi.fn(),
  getSession: vi.fn(),
  updateComment: vi.fn(),
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
    comment: {
      create: mocks.createComment,
      delete: mocks.deleteComment,
      findMany: mocks.findManyComment,
      findUnique: mocks.findUniqueComment,
      update: mocks.updateComment,
    },
  },
}));

const baseDate = new Date("2026-07-03T00:00:00.000Z");

describe("comments router", () => {
  beforeEach(() => {
    mocks.getSession.mockReset();
    mocks.findManyComment.mockReset();
    mocks.createComment.mockReset();
    mocks.findUniqueComment.mockReset();
    mocks.updateComment.mockReset();
    mocks.deleteComment.mockReset();

    mocks.getSession.mockResolvedValue({
      session: { id: "s1", userId: "u1" },
      user: { email: "user@example.com", id: "u1", name: "Test User", role: "user" },
    });
  });

  it("lists hierarchical comments for an issue", async () => {
    mocks.findManyComment.mockResolvedValue([
      {
        content: "Top comment",
        createdAt: baseDate,
        id: "c1",
        issueId: "i1",
        parentId: null,
        updatedAt: baseDate,
        user: { id: "u1", image: null, name: "Alice", role: "user" },
        userId: "u1",
      },
      {
        content: "Reply to top",
        createdAt: baseDate,
        id: "c2",
        issueId: "i1",
        parentId: "c1",
        updatedAt: baseDate,
        user: { id: "u2", image: null, name: "Bob", role: "user" },
        userId: "u2",
      },
    ]);

    const res = await app.request("/comments/issue/i1");
    expect(res.status).toBe(200);
    const data = (await res.json()) as CommentListResponse;
    expect(data.comments).toHaveLength(1);
    expect(data.comments[0]?.replies).toHaveLength(1);
    expect(data.comments[0]?.replies[0]?.content).toBe("Reply to top");
  });

  it("creates a comment", async () => {
    mocks.createComment.mockResolvedValue({
      content: "Nice work",
      createdAt: baseDate,
      id: "c-new",
      issueId: "i1",
      parentId: null,
      updatedAt: baseDate,
      user: { id: "u1", image: null, name: "Test User", role: "user" },
      userId: "u1",
    });

    const res = await app.request("/comments", {
      body: JSON.stringify({
        content: "Nice work",
        issueId: "i1",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    expect(res.status).toBe(201);
    const data = (await res.json()) as CommentItem;
    expect(data.content).toBe("Nice work");
  });

  it("returns forbidden when updating another user's comment", async () => {
    mocks.findUniqueComment.mockResolvedValue({
      content: "Someone else's comment",
      createdAt: baseDate,
      id: "c-other",
      issueId: "i1",
      parentId: null,
      updatedAt: baseDate,
      userId: "u2",
    });

    const res = await app.request("/comments/c-other", {
      body: JSON.stringify({ content: "Updated" }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "forbidden" });
    expect(mocks.updateComment).not.toHaveBeenCalled();
  });

  it("returns forbidden when deleting another user's comment", async () => {
    mocks.findUniqueComment.mockResolvedValue({
      content: "Someone else's comment",
      createdAt: baseDate,
      id: "c-other",
      issueId: "i1",
      parentId: null,
      updatedAt: baseDate,
      userId: "u2",
    });

    const res = await app.request("/comments/c-other", {
      method: "DELETE",
    });

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "forbidden" });
    expect(mocks.deleteComment).not.toHaveBeenCalled();
  });
});
