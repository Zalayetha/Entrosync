import { prisma } from "../../utils/prisma";
import { generateSlug } from "../../utils/slug";
import { getProjectByIdOrSlug } from "../projects/services";
import type { ProjectDetailResponse } from "../projects/types";
import type { ConvertToProjectInput, GeneratedBriefResponse } from "./types";

export async function generateBriefFromRawText(rawText: string): Promise<GeneratedBriefResponse> {
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const titleCandidate = lines[0]?.replace(/^#+\s*/, "").slice(0, 80) || "New Client Initiative";

  return {
    clientName: "Valued Client",
    proposal: `Draft project scope synthesized from intake brief:\n\n${rawText.slice(0, 500)}...`,
    scopeOfWork: [
      {
        description: "Discovery, initial requirements validation, and UX mapping.",
        suggestedDays: 7,
        tasks: [
          "Requirements specification breakdown",
          "Architecture and user flow diagramming",
          "Client review and signoff",
        ],
        title: "Phase 1: Discovery & Architecture",
      },
      {
        description: "Core features, API integration, and MVP staging environment.",
        suggestedDays: 14,
        tasks: [
          "Database models and backend services",
          "Interactive client dashboard screens",
          "Authentication and role-based permissions",
        ],
        title: "Phase 2: Core Development & MVP",
      },
      {
        description: "Quality assurance, polish, invoicing, and client handoff.",
        suggestedDays: 7,
        tasks: [
          "End-to-end user testing & issue remediation",
          "Production deployment & final walkthrough",
          "Final delivery invoice handoff",
        ],
        title: "Phase 3: Final Delivery & Launch",
      },
    ],
    summary:
      "Structured proposal and scope of work generated from client brief with 3 core delivery milestones.",
    title: titleCandidate,
  };
}

export async function convertBriefToProject(
  userId: string,
  input: ConvertToProjectInput,
): Promise<ProjectDetailResponse> {
  const baseSlug = generateSlug(input.title);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const startDate = input.startDate ? new Date(input.startDate) : new Date();
  let cumulativeDays = 0;

  for (const m of input.milestones) {
    cumulativeDays += m.suggestedDays || 7;
  }

  const targetDate = new Date(startDate.getTime() + cumulativeDays * 24 * 60 * 60 * 1000);
  const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  await prisma.project.create({
    data: {
      description: input.description ?? input.proposal,
      id: projectId,
      slug,
      startDate,
      status: "IN_PROGRESS",
      targetDate,
      title: input.title,
      userId,
      invites: {
        create: {
          clientName: input.clientName,
          email: `${slug}-client@example.com`,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          id: `invite_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          password: `pass-${Math.random().toString(36).substring(2, 8)}`,
          token: `${slug}-invite-${Math.random().toString(36).substring(2, 8)}`,
        },
      },
      logs: {
        create: {
          action: "PROJECT_CREATED",
          description: `Project "${input.title}" created via Smart AI Brief with ${input.milestones.length} milestones.`,
          id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        },
      },
      ...(input.proposal
        ? {
            resources: {
              create: {
                content: input.proposal,
                id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                title: "AI Proposal Draft",
                type: "FILE",
              },
            },
          }
        : {}),
    },
  });

  let currentMilestoneStart = new Date(startDate);

  for (const [index, m] of input.milestones.entries()) {
    const days = m.suggestedDays || 7;
    const milestoneTarget = new Date(currentMilestoneStart.getTime() + days * 24 * 60 * 60 * 1000);
    const milestoneId = `ms_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 7)}`;

    await prisma.milestone.create({
      data: {
        description: m.description,
        id: milestoneId,
        progress: 0,
        projectId,
        startDate: currentMilestoneStart,
        targetDate: milestoneTarget,
        title: m.title,
        issues: {
          create: (m.tasks || []).map((t: string, taskIdx: number) => ({
            id: `iss_${Date.now()}_${index}_${taskIdx}_${Math.random().toString(36).substring(2, 7)}`,
            status: "TODO",
            title: t,
          })),
        },
      },
    });

    currentMilestoneStart = new Date(milestoneTarget);
  }

  return getProjectByIdOrSlug(projectId, userId);
}
