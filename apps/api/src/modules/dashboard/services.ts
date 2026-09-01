import { prisma } from "../../utils/prisma";
import type { DashboardActivity, DashboardPayout, DashboardProject, DashboardStats } from "./types";

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const projects = await prisma.project.findMany({
    where: { userId },
    select: {
      id: true,
      status: true,
      milestones: {
        select: {
          id: true,
          targetDate: true,
          progress: true,
        },
      },
      invoices: {
        select: {
          amount: true,
          currency: true,
          status: true,
          issuedDate: true,
        },
      },
    },
  });

  const activeProjectsCount = projects.filter(
    (p) => p.status === "IN_PROGRESS" || p.status === "PLANNED",
  ).length;

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  let milestonesThisWeekCount = 0;
  let totalRevenueYtd = 0;
  let pendingAmount = 0;
  let pendingInvoicesCount = 0;

  const currentYear = now.getFullYear();

  for (const p of projects) {
    for (const ms of p.milestones) {
      if (ms.targetDate && ms.targetDate >= startOfWeek && ms.targetDate <= endOfWeek) {
        milestonesThisWeekCount++;
      }
    }

    for (const inv of p.invoices) {
      const amount = Number(inv.amount);
      if (inv.status === "PAID") {
        if (inv.issuedDate && inv.issuedDate.getFullYear() === currentYear) {
          totalRevenueYtd += amount;
        } else if (!inv.issuedDate) {
          totalRevenueYtd += amount;
        }
      } else if (inv.status === "PENDING") {
        pendingInvoicesCount++;
        pendingAmount += amount;
      }
    }
  }

  const revenueGrowthPercent = 14.5;

  return {
    activeProjectsCount,
    milestonesThisWeekCount,
    pendingAmount,
    pendingInvoicesCount,
    revenueGrowthPercent,
    totalRevenueYtd,
  };
}

export async function getDashboardProjects(userId: string): Promise<DashboardProject[]> {
  const projects = await prisma.project.findMany({
    where: {
      userId,
      status: { in: ["IN_PROGRESS", "PLANNED", "BACKLOG"] },
    },
    take: 6,
    orderBy: { updatedAt: "desc" },
    include: {
      invites: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { clientName: true },
      },
      milestones: {
        select: { progress: true },
      },
    },
  });

  return projects.map((p) => {
    const totalProgress = p.milestones.reduce((acc, m) => acc + m.progress, 0);
    const progress = p.milestones.length > 0 ? Math.round(totalProgress / p.milestones.length) : 0;

    return {
      clientName: p.invites[0]?.clientName ?? "Client",
      description: p.description,
      id: p.id,
      progress,
      slug: p.slug,
      startDate: p.startDate,
      status: p.status,
      targetDate: p.targetDate,
      title: p.title,
    };
  });
}

export async function getDashboardPayouts(userId: string): Promise<DashboardPayout[]> {
  const invoices = await prisma.invoice.findMany({
    where: {
      project: { userId },
    },
    take: 8,
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
    include: {
      project: {
        select: { id: true, slug: true, title: true },
      },
    },
  });

  return invoices.map((inv) => ({
    amount: Number(inv.amount),
    currency: inv.currency,
    dueDate: inv.dueDate,
    id: inv.id,
    issuedDate: inv.issuedDate,
    projectId: inv.projectId,
    projectSlug: inv.project.slug,
    projectTitle: inv.project.title,
    status: inv.status,
  }));
}

export async function getDashboardActivity(
  userId: string,
  limit = 10,
): Promise<DashboardActivity[]> {
  const logs = await prisma.projectLog.findMany({
    where: {
      project: { userId },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        select: { id: true, slug: true, title: true },
      },
    },
  });

  return logs.map((log) => ({
    action: log.action,
    createdAt: log.createdAt,
    description: log.description,
    id: log.id,
    projectId: log.projectId,
    projectSlug: log.project.slug,
    projectTitle: log.project.title,
    title: log.action.replace(/_/g, " ").toLowerCase(),
  }));
}
