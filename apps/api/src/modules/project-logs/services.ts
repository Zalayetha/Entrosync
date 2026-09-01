import { prisma } from "../../utils/prisma";
import type { CreateProjectLogInput, ProjectLogsQuery } from "./schema";
import type { ProjectLogItem } from "./types";

export async function listProjectLogs(
  projectId: string,
  query: ProjectLogsQuery,
): Promise<ProjectLogItem[]> {
  const logs = await prisma.projectLog.findMany({
    where: { projectId },
    take: query.limit,
    orderBy: { createdAt: "desc" },
  });

  return logs.map((l) => ({
    action: l.action,
    createdAt: l.createdAt,
    description: l.description,
    id: l.id,
    projectId: l.projectId,
    updatedAt: l.updatedAt,
  }));
}

export async function createProjectLog(input: CreateProjectLogInput): Promise<ProjectLogItem> {
  const log = await prisma.projectLog.create({
    data: {
      action: input.action,
      description: input.description,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId: input.projectId,
    },
  });

  return {
    action: log.action,
    createdAt: log.createdAt,
    description: log.description,
    id: log.id,
    projectId: log.projectId,
    updatedAt: log.updatedAt,
  };
}
