import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";
import type { FeedbackItem, FeedbackListResponse } from "./types";

const mocks = vi.hoisted(() => ({
  authHandler: vi.fn(),
  createFeedback: vi.fn(),
  deleteFeedback: vi.fn(),
  findManyFeedback: vi.fn(),
  findUniqueFeedback: vi.fn(),
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
    feedback: {
      create: mocks.createFeedback,
      delete: mocks.deleteFeedback,
      findMany: mocks.findManyFeedback,
      findUnique: mocks.findUniqueFeedback,
    },
    projectLog: {
      create: vi.fn(),
    },
  },
}));

const baseDate = new Date("2026-07-03T00:00:00.000Z");

describe("feedbacks router", () => {
  beforeEach(() => {
    mocks.getSession.mockReset();
    mocks.findManyFeedback.mockReset();
    mocks.createFeedback.mockReset();
    mocks.findUniqueFeedback.mockReset();
    mocks.deleteFeedback.mockReset();

    mocks.getSession.mockResolvedValue({
      session: { id: "s1", userId: "u1" },
      user: { email: "user@example.com", id: "u1", name: "Test User", role: "user" },
    });
  });

  it("lists project feedbacks", async () => {
    mocks.findManyFeedback.mockResolvedValue([
      {
        createdAt: baseDate,
        description: "Great pace",
        id: "fb-1",
        projectId: "p1",
        rating: 5,
        title: "Sprint 1 Review",
        updatedAt: baseDate,
      },
    ]);

    const res = await app.request("/feedbacks/project/p1");
    expect(res.status).toBe(200);
    const data = (await res.json()) as FeedbackListResponse;
    expect(data.feedbacks).toHaveLength(1);
    expect(data.feedbacks[0]?.rating).toBe(5);
  });

  it("creates a feedback", async () => {
    mocks.createFeedback.mockResolvedValue({
      createdAt: baseDate,
      description: "Looks clean",
      id: "fb-2",
      projectId: "p1",
      rating: 5,
      title: "UI Look",
      updatedAt: baseDate,
    });

    const res = await app.request("/feedbacks", {
      body: JSON.stringify({
        projectId: "p1",
        rating: 5,
        title: "UI Look",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    expect(res.status).toBe(201);
    const data = (await res.json()) as FeedbackItem;
    expect(data.title).toBe("UI Look");
  });
});
