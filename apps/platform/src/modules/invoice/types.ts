export type Currency = "IDR" | "USD";
export type InvoiceStatus = "PENDING" | "PAID";

export interface InvoiceProjectSummary {
  id: string;
  slug: string;
  title: string;
  clientName?: string;
  freelancerName?: string;
}

export interface Invoice {
  id: string;
  projectId: string;
  project: InvoiceProjectSummary;
  amount: number;
  currency: Currency;
  status: InvoiceStatus;
  description?: string | null;
  paymentMethod?: string | null;
  paymentLink?: string | null;
  invoiceNote?: string | null;
  issuedDate?: string | null; // ISO Date string
  dueDate?: string | null; // ISO Date string
  createdAt: string; // ISO Timestamp
  updatedAt: string; // ISO Timestamp
}

export interface CreateInvoiceFormInput {
  projectId: string;
  amount: number;
  currency: Currency;
  issuedDate: string;
  dueDate: string;
  description?: string;
  paymentMethod?: string;
  paymentLink?: string;
  invoiceNote?: string;
}

export type InvoiceSubView = "list" | "detail" | "generator";
