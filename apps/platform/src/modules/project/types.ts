export type ProjectStatus = "BACKLOG" | "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type IssueStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "CANCELLED";
export type ProjectHealth = "ON_TRACK" | "AT_RISK" | "BEHIND";
export type InvoiceStatus = "PENDING" | "PAID";
export type Currency = "IDR" | "USD";
export type ResourceType = "FILE" | "LINK";

export interface TeamSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
}

export interface CommentItem {
  id: string;
  issueId: string;
  userId?: string | null;
  parentId?: string | null;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  replies: CommentItem[];
}

export interface IssueItem {
  id: string;
  milestoneId: string;
  title: string;
  description?: string | null;
  status: IssueStatus;
  startDate?: string | null;
  targetDate?: string | null;
  createdAt: string;
  updatedAt: string;
  comments: CommentItem[];
}

export interface MilestoneItem {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  progress: number;
  startDate?: string | null;
  targetDate?: string | null;
  createdAt: string;
  updatedAt: string;
  issues: IssueItem[];
}

export interface ProjectInvoiceItem {
  id: string;
  projectId: string;
  amount: number;
  currency: Currency;
  status: InvoiceStatus;
  description?: string | null;
  paymentMethod?: string | null;
  paymentLink?: string | null;
  invoiceNote?: string | null;
  issuedDate?: string | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackItem {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  rating?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceItem {
  id: string;
  projectId: string;
  title: string;
  type: ResourceType;
  url?: string | null;
  content?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectLogItem {
  id: string;
  projectId: string;
  action: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInviteItem {
  id: string;
  token: string;
  projectId: string;
  clientName: string;
  password: string;
  email: string;
  expiresAt: string;
  accessedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetail {
  id: string;
  userId: string;
  slug: string;
  title: string;
  description?: string | null;
  status: ProjectStatus;
  clientName: string;
  startDate?: string | null;
  targetDate?: string | null;
  createdAt: string;
  updatedAt: string;
  teams: TeamSummary[];
  milestones: MilestoneItem[];
  invoices: ProjectInvoiceItem[];
  feedbacks: FeedbackItem[];
  resources: ResourceItem[];
  logs: ProjectLogItem[];
  invites: ProjectInviteItem[];
}

export type ProjectSubView = "list" | "detail";
export type ProjectTabKey = "overview" | "roadmap" | "invoices" | "feedback" | "logs";
export type RoadmapViewMode = "milestones" | "kanban" | "list";
export type ProjectStatusFilter = "ALL" | ProjectStatus;
export type ResourceTypeFilter = "ALL" | ResourceType;

export interface CreateProjectFormInput {
  title: string;
  clientName: string;
  description?: string;
  targetDate?: string;
}

export interface CreateMilestoneFormInput {
  title: string;
  description?: string;
  targetDate?: string;
}

export interface CreateIssueFormInput {
  milestoneId: string;
  title: string;
  description?: string;
  targetDate?: string;
}

export interface AddResourceFormInput {
  title: string;
  type: ResourceType;
  url?: string;
  content?: string;
}

export interface InviteClientFormInput {
  clientName: string;
  email: string;
  password: string;
}
