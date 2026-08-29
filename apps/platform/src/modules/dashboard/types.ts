export type ProjectStatus = "BACKLOG" | "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type InvoiceStatus = "PENDING" | "PAID";
export type Currency = "IDR" | "USD";

export interface DashboardStats {
  totalRevenueYtd: number;
  revenueGrowthPercent: number;
  activeProjectsCount: number;
  milestonesThisWeekCount: number;
  pendingInvoicesCount: number;
  pendingAmount: number;
}

export interface DashboardProject {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  clientName: string;
  status: ProjectStatus;
  progress: number; // 0 - 100 integer matching Milestone / aggregate progress
  startDate?: string | null;
  targetDate?: string | null;
}

export interface DashboardPayout {
  id: string;
  projectId: string;
  projectTitle: string;
  projectSlug: string;
  amount: number;
  currency: Currency;
  status: InvoiceStatus;
  issuedDate?: string | null;
  dueDate?: string | null;
}

export type ActivityAction =
  | "MILESTONE_COMPLETED"
  | "INVOICE_PAID"
  | "INVOICE_ISSUED"
  | "PROJECT_CREATED"
  | "INVITE_ACCEPTED"
  | "DOCUMENT_UPLOADED";

export interface DashboardActivity {
  id: string;
  projectId?: string;
  action: ActivityAction;
  title: string;
  description?: string | null;
  createdAt: string; // ISO date string
}
