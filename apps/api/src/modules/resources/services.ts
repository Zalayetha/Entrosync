import { prisma } from "../../utils/prisma";
import { storage } from "../../utils/storage";
import type { CreateResourceInput, RequestUploadUrlInput } from "./schema";
import type { ResourceItem, UploadUrlResponse } from "./types";

export class ResourceNotFoundError extends Error {
  constructor() {
    super("Resource not found");
    this.name = "ResourceNotFoundError";
  }
}

export async function listProjectResources(projectId: string): Promise<ResourceItem[]> {
  const resources = await prisma.resource.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });

  return resources.map((res) => ({
    content: res.content,
    createdAt: res.createdAt,
    id: res.id,
    projectId: res.projectId,
    title: res.title,
    type: res.type,
    updatedAt: res.updatedAt,
    url: res.url,
  }));
}

export async function createResource(input: CreateResourceInput): Promise<ResourceItem> {
  const resource = await prisma.resource.create({
    data: {
      content: input.content,
      id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId: input.projectId,
      title: input.title,
      type: input.type,
      url: input.url,
    },
  });

  await prisma.projectLog.create({
    data: {
      action: "RESOURCE_ADDED",
      description: `Resource "${input.title}" (${input.type}) added to project.`,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId: input.projectId,
    },
  });

  return {
    content: resource.content,
    createdAt: resource.createdAt,
    id: resource.id,
    projectId: resource.projectId,
    title: resource.title,
    type: resource.type,
    updatedAt: resource.updatedAt,
    url: resource.url,
  };
}

export async function deleteResource(id: string): Promise<{ success: boolean; id: string }> {
  const existing = await prisma.resource.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new ResourceNotFoundError();
  }

  await prisma.resource.delete({
    where: { id },
  });

  return { id, success: true };
}

export async function generatePresignedUploadUrl(
  input: RequestUploadUrlInput,
): Promise<UploadUrlResponse> {
  const sanitizedFilename = input.filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `projects/${input.projectId}/assets/${Date.now()}-${sanitizedFilename}`;

  const uploadUrl = await storage.getSignedPutObjectUrl({
    contentType: input.contentType,
    expiresIn: 300,
    key,
  });

  const fileUrl = storage.getObjectUrl(key) ?? uploadUrl.split("?")[0] ?? uploadUrl;

  return {
    fileUrl,
    key,
    uploadUrl,
  };
}
