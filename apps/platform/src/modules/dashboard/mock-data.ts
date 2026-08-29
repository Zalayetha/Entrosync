import type { DashboardActivity, DashboardPayout, DashboardProject, DashboardStats } from "./types";

export const mockDashboardStats: DashboardStats = {
  totalRevenueYtd: 48500000,
  revenueGrowthPercent: 12.5,
  activeProjectsCount: 3,
  milestonesThisWeekCount: 2,
  pendingInvoicesCount: 4,
  pendingAmount: 18250000,
};

export const mockActiveProjects: DashboardProject[] = [
  {
    id: "proj_01",
    slug: "ecommerce-mobile-app",
    title: "E-Commerce Mobile App Redesign",
    description: "Revamp high-conversion mobile shop UI & checkout experience",
    clientName: "PT Global Retail Nusantara",
    status: "IN_PROGRESS",
    progress: 65,
    startDate: "2026-08-01T00:00:00.000Z",
    targetDate: "2026-09-15T00:00:00.000Z",
  },
  {
    id: "proj_02",
    slug: "ai-support-portal",
    title: "AI Customer Support Chatbot Portal",
    description: "LLM agent integration for 24/7 automated ticket resolution",
    clientName: "Zaghy Zalsoft Studio",
    status: "IN_PROGRESS",
    progress: 40,
    startDate: "2026-08-10T00:00:00.000Z",
    targetDate: "2026-09-28T00:00:00.000Z",
  },
  {
    id: "proj_03",
    slug: "corporate-brand-identity",
    title: "Corporate Brand Identity & Guidelines",
    description: "Design system tokens, logo suites, and branding assets",
    clientName: "Entropy Labs",
    status: "IN_PROGRESS",
    progress: 90,
    startDate: "2026-07-15T00:00:00.000Z",
    targetDate: "2026-09-05T00:00:00.000Z",
  },
];

export const mockPayoutSchedule: DashboardPayout[] = [
  {
    id: "inv_101",
    projectId: "proj_01",
    projectSlug: "ecommerce-mobile-app",
    projectTitle: "E-Commerce Mobile App Redesign",
    amount: 12500000,
    currency: "IDR",
    status: "PENDING",
    issuedDate: "2026-08-20T00:00:00.000Z",
    dueDate: "2026-09-02T00:00:00.000Z",
  },
  {
    id: "inv_102",
    projectId: "proj_02",
    projectSlug: "ai-support-portal",
    projectTitle: "AI Customer Support Chatbot Portal",
    amount: 5750000,
    currency: "IDR",
    status: "PENDING",
    issuedDate: "2026-08-25T00:00:00.000Z",
    dueDate: "2026-09-10T00:00:00.000Z",
  },
];

export const mockActivityFeed: DashboardActivity[] = [
  {
    id: "act_01",
    action: "MILESTONE_COMPLETED",
    title: "Milestone Selesai: Desain High-Fidelity UI",
    description: "Milestone pada proyek E-Commerce Mobile App telah disetujui klien.",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "act_02",
    action: "INVOICE_PAID",
    title: "Pembayaran Diterima",
    description: "Invoice #inv_100 sebesar Rp 15.000.000 telah lunas dibayar.",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: "act_03",
    action: "INVOICE_ISSUED",
    title: "Invoice Diterbitkan",
    description: "Invoice #inv_102 untuk Proyek AI Chatbot berhasil dikirim ke klien.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];
