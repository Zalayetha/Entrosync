import { useTranslation } from "@repo/ui/i18n";
import { ExternalLink } from "lucide-react";
import type { CreateInvoiceFormInput, InvoiceProjectSummary } from "../types";
import { formatInvoiceAmount, formatInvoiceDate } from "../utils";

interface InvoiceLivePreviewProps {
  formData: CreateInvoiceFormInput;
  project?: InvoiceProjectSummary | null;
}

export function InvoiceLivePreview({ formData, project }: InvoiceLivePreviewProps) {
  const { t } = useTranslation();

  const formattedAmount = formatInvoiceAmount(formData.amount || 0, formData.currency || "IDR");

  return (
    <div className="sticky top-6 flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl min-h-[640px]">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded bg-zinc-950 font-bold text-xs text-white">
                E
              </span>
              <span className="font-bold text-lg tracking-tight text-zinc-950">ENTROSYNC</span>
            </div>
            <p className="text-xs text-zinc-500">Invoice & Milestone System</p>
          </div>
          <div className="text-right">
            <span className="inline-block rounded bg-amber-100 px-2 py-0.5 font-semibold text-amber-800 text-xs uppercase tracking-wider">
              {t("invoice.status.pending")}
            </span>
            <p className="mt-1 font-mono text-xs text-zinc-400">#INV-DRAFT</p>
          </div>
        </div>

        {/* Client & Project Details */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-semibold text-zinc-400 uppercase tracking-wider">Billed To</p>
            <p className="font-semibold text-sm text-zinc-900">
              {project?.clientName || "Client / Company"}
            </p>
            <p className="text-zinc-600">{project?.title || "Select a project"}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="font-semibold text-zinc-400 uppercase tracking-wider">Dates</p>
            <p className="text-zinc-600">
              <span className="font-medium text-zinc-800">Issued: </span>
              {formData.issuedDate ? formatInvoiceDate(formData.issuedDate) : "Select date"}
            </p>
            <p className="text-zinc-600">
              <span className="font-medium text-zinc-800">Due: </span>
              {formData.dueDate ? formatInvoiceDate(formData.dueDate) : "Select date"}
            </p>
          </div>
        </div>

        {/* Item Table */}
        <div className="rounded-lg border border-zinc-100 overflow-hidden">
          <div className="bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider flex justify-between">
            <span>Description</span>
            <span>Amount</span>
          </div>
          <div className="p-3 flex justify-between items-start text-xs border-b border-zinc-100 min-h-[50px]">
            <span className="text-zinc-800 font-medium max-w-[240px] leading-relaxed">
              {formData.description || "Project Milestone & Services"}
            </span>
            <span className="font-semibold text-zinc-950 font-mono">{formattedAmount}</span>
          </div>
          <div className="bg-zinc-50/50 p-3 flex justify-between items-center text-sm font-bold text-zinc-950">
            <span>Total</span>
            <span className="font-mono text-base">{formattedAmount}</span>
          </div>
        </div>

        {/* Payment instructions / Link */}
        {formData.paymentMethod || formData.paymentLink ? (
          <div className="space-y-2 rounded-lg bg-zinc-50 p-3 text-xs">
            <p className="font-semibold text-zinc-700 uppercase tracking-wider text-[11px]">
              Payment Instructions
            </p>
            {formData.paymentMethod ? (
              <p className="text-zinc-700">{formData.paymentMethod}</p>
            ) : null}
            {formData.paymentLink ? (
              <a
                href={formData.paymentLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline"
              >
                <span>{formData.paymentLink}</span>
                <ExternalLink className="size-3" />
              </a>
            ) : null}
          </div>
        ) : null}

        {/* Notes */}
        {formData.invoiceNote ? (
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-zinc-500 uppercase tracking-wider text-[11px]">
              Notes
            </p>
            <p className="text-zinc-600 italic">{formData.invoiceNote}</p>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-zinc-100 pt-4 text-center text-xs text-zinc-400">
        Generated with Entrosync • Freelance Workflow Platform
      </div>
    </div>
  );
}
