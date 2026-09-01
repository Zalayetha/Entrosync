import type { Currency, IssueItem, MilestoneItem, ProjectDetail, ProjectHealth } from "./types";

export function calculateCompletedIssuesCount(project: ProjectDetail): number {
  return project.milestones.reduce(
    (count, milestone) =>
      count + milestone.issues.filter((issue) => issue.status === "DONE").length,
    0,
  );
}

export function calculateTotalIssuesCount(project: ProjectDetail): number {
  return project.milestones.reduce((count, milestone) => count + milestone.issues.length, 0);
}

export function calculateProjectProgress(project: ProjectDetail): number {
  const totalIssues = calculateTotalIssuesCount(project);
  if (totalIssues === 0) return 0;
  return Math.round((calculateCompletedIssuesCount(project) / totalIssues) * 100);
}

export function calculateMilestoneProgress(milestone: MilestoneItem): number {
  if (milestone.issues.length === 0) return milestone.progress;
  const completed = milestone.issues.filter((issue) => issue.status === "DONE").length;
  return Math.round((completed / milestone.issues.length) * 100);
}

export function flattenIssues(project: ProjectDetail): IssueItem[] {
  return project.milestones.flatMap((milestone) => milestone.issues);
}

export function formatCurrencyAmount(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(amount);
}

export function formatProjectDate(dateStr?: string | null, locale = "en-US"): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function calculateProjectHealth(project: ProjectDetail): ProjectHealth {
  if (project.status === "COMPLETED") return "ON_TRACK";

  const progress = calculateProjectProgress(project);
  const remainingDays = getRemainingDays(project.targetDate);
  if (remainingDays === null) return progress >= 50 ? "ON_TRACK" : "AT_RISK";
  if (remainingDays < 0 && progress < 100) return "BEHIND";
  if (remainingDays <= 7 && progress < 80) return "AT_RISK";
  if (remainingDays <= 14 && progress < 50) return "AT_RISK";
  return "ON_TRACK";
}

export function getRemainingDays(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
