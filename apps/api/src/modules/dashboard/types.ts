import type { Currency, InvoiceStatus, ProjectStatus } from "@prisma/client";

export type DashboardStats = {
  activeProjectsCount: number;
  milestonesThisWeekCount: number;
  pendingAmount: number;
  pendingInvoicesCount: number;
  revenueGrowthPercent: number;
  totalRevenueYtd: number;
};

export type DashboardProject = {
  clientName: string;
  description?: string | null;
  id: string;
  progress: number;
  slug: string;
  startDate?: Date | null;
  status: ProjectStatus;
  targetDate?: Date | null;
  title: string;
};

export type DashboardPayout = {
  amount: number;
  currency: Currency;
  dueDate?: Date | null;
  id: string;
  issuedDate?: Date | null;
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  status: InvoiceStatus;
};

export type ActivityAction =
  | "MILESTONE_COMPLETED"
  | "MILESTONE_CREATED"
  | "INVOICE_PAID"
  | "INVOICE_ISSUED"
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "INVITE_CREATED"
  | "INVITE_ACCEPTED"
  | "RESOURCE_ADDED"
  | "FEEDBACK_SUBMITTED"
  | "ISSUE_CREATED"
  | string;

export type DashboardActivity = {
  action: ActivityAction;
  createdAt: Date;
  description?: string | null;
  id: string;
  projectId: string;
  projectSlug?: string;
  projectTitle?: string;
  title: string;
};
