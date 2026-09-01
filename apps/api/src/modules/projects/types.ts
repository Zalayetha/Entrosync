import type {
  Currency,
  Feedback,
  Invoice,
  InvoiceStatus,
  Issue,
  IssueStatus,
  Milestone,
  Project,
  ProjectInvite,
  ProjectLog,
  ProjectStatus,
  Resource,
  ResourceType,
  Team,
  User,
} from "@prisma/client";

export type {
  Currency,
  Feedback,
  Invoice,
  InvoiceStatus,
  Issue,
  IssueStatus,
  Milestone,
  Project,
  ProjectInvite,
  ProjectLog,
  ProjectStatus,
  Resource,
  ResourceType,
  Team,
  User,
};

export type ProjectListItem = {
  clientName: string;
  createdAt: Date;
  description: string | null;
  id: string;
  issuesCount: number;
  milestonesCount: number;
  progress: number;
  slug: string;
  startDate: Date | null;
  status: ProjectStatus;
  targetDate: Date | null;
  title: string;
  updatedAt: Date;
  userId: string;
};

export type ProjectListResponse = {
  items: ProjectListItem[];
  nextCursor: string | null;
};

export type TeamSummary = {
  avatarUrl?: string | null;
  email: string;
  id: string;
  name: string;
  role: string;
};

export type CommentItem = {
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: Date;
  id: string;
  issueId: string;
  parentId?: string | null;
  replies: CommentItem[];
  updatedAt: Date;
  userId?: string | null;
};

export type IssueItem = {
  comments: CommentItem[];
  createdAt: Date;
  description?: string | null;
  id: string;
  milestoneId: string;
  startDate?: Date | null;
  status: IssueStatus;
  targetDate?: Date | null;
  title: string;
  updatedAt: Date;
};

export type MilestoneItem = {
  createdAt: Date;
  description?: string | null;
  id: string;
  issues: IssueItem[];
  progress: number;
  projectId: string;
  startDate?: Date | null;
  targetDate?: Date | null;
  title: string;
  updatedAt: Date;
};

export type ProjectInvoiceItem = {
  amount: number;
  createdAt: Date;
  currency: Currency;
  description?: string | null;
  dueDate?: Date | null;
  id: string;
  invoiceNote?: string | null;
  issuedDate?: Date | null;
  paymentLink?: string | null;
  paymentMethod?: string | null;
  projectId: string;
  status: InvoiceStatus;
  updatedAt: Date;
};

export type FeedbackItem = {
  createdAt: Date;
  description?: string | null;
  id: string;
  projectId: string;
  rating?: number | null;
  title: string;
  updatedAt: Date;
};

export type ResourceItem = {
  content?: string | null;
  createdAt: Date;
  id: string;
  projectId: string;
  title: string;
  type: ResourceType;
  updatedAt: Date;
  url?: string | null;
};

export type ProjectLogItem = {
  action: string;
  createdAt: Date;
  description?: string | null;
  id: string;
  projectId: string;
  updatedAt: Date;
};

export type ProjectInviteItem = {
  accessedAt?: Date | null;
  clientName: string;
  createdAt: Date;
  email: string;
  expiresAt: Date;
  id: string;
  password: string;
  projectId: string;
  token: string;
  updatedAt: Date;
};

export type ProjectDetailResponse = {
  clientName: string;
  createdAt: Date;
  description?: string | null;
  feedbacks: FeedbackItem[];
  id: string;
  invites: ProjectInviteItem[];
  invoices: ProjectInvoiceItem[];
  logs: ProjectLogItem[];
  milestones: MilestoneItem[];
  progress: number;
  resources: ResourceItem[];
  slug: string;
  startDate?: Date | null;
  status: ProjectStatus;
  targetDate?: Date | null;
  teams: TeamSummary[];
  title: string;
  updatedAt: Date;
  userId: string;
};
