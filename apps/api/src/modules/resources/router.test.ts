import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";
import type { ResourceListResponse, UploadUrlResponse } from "./types";

const mocks = vi.hoisted(() => ({
  authHandler: vi.fn(),
  createResource: vi.fn(),
  deleteResource: vi.fn(),
  findManyResource: vi.fn(),
  findUniqueResource: vi.fn(),
  getSession: vi.fn(),
  getSignedPutObjectUrl: vi.fn(),
}));

vi.mock("../../modules/auth/auth", () => ({
  auth: {
    api: {
      getSession: mocks.getSession,
    },
    handler: mocks.authHandler,
  },
}));

vi.mock("../../utils/storage", () => ({
  storage: {
    getObjectUrl: vi.fn().mockReturnValue("https://s3.example.com/file.png"),
    getSignedPutObjectUrl: mocks.getSignedPutObjectUrl,
  },
}));

vi.mock("../../utils/prisma", () => ({
  prisma: {
    projectLog: {
      create: vi.fn(),
    },
    resource: {
      create: mocks.createResource,
      delete: mocks.deleteResource,
      findMany: mocks.findManyResource,
      findUnique: mocks.findUniqueResource,
    },
  },
}));

const baseDate = new Date("2026-07-03T00:00:00.000Z");

describe("resources router", () => {
  beforeEach(() => {
    mocks.getSession.mockReset();
    mocks.findManyResource.mockReset();
    mocks.createResource.mockReset();
    mocks.findUniqueResource.mockReset();
    mocks.deleteResource.mockReset();
    mocks.getSignedPutObjectUrl.mockReset();

    mocks.getSession.mockResolvedValue({
      session: { id: "s1", userId: "u1" },
      user: { email: "user@example.com", id: "u1", name: "Test User", role: "user" },
    });
  });

  it("lists project resources", async () => {
    mocks.findManyResource.mockResolvedValue([
      {
        content: null,
        createdAt: baseDate,
        id: "res-1",
        projectId: "p1",
        title: "Figma Link",
        type: "LINK",
        updatedAt: baseDate,
        url: "https://figma.com/file/123",
      },
    ]);

    const res = await app.request("/resources/project/p1");
    expect(res.status).toBe(200);
    const data = (await res.json()) as ResourceListResponse;
    expect(data.resources).toHaveLength(1);
    expect(data.resources[0]?.title).toBe("Figma Link");
  });

  it("generates presigned upload url", async () => {
    mocks.getSignedPutObjectUrl.mockResolvedValue("https://s3.example.com/upload?sig=abc");

    const res = await app.request("/resources/upload-url", {
      body: JSON.stringify({
        contentType: "image/png",
        filename: "logo.png",
        projectId: "p1",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as UploadUrlResponse;
    expect(data.uploadUrl).toContain("https://s3.example.com/upload");
    expect(data.fileUrl).toBeTruthy();
  });
});
