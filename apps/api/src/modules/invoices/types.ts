import type { Currency, InvoiceStatus } from "@prisma/client";
import type { ProjectInvoiceItem } from "../projects/types";

export type { Currency, InvoiceStatus, ProjectInvoiceItem };

export type InvoiceProjectSummary = {
  clientName?: string;
  id: string;
  slug: string;
  title: string;
};

export type InvoiceDetail = ProjectInvoiceItem & {
  project: InvoiceProjectSummary;
};

export type InvoiceListResponse = {
  items: InvoiceDetail[];
  nextCursor: string | null;
};
