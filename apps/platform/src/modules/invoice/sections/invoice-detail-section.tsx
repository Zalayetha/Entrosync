import { useTranslation } from "@repo/ui/i18n";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  DollarSign,
  ExternalLink,
  FileText,
  RotateCcw,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";
import { Link } from "@tanstack/react-router";
import { InvoiceDownloadButton } from "../components/invoice-download-button";
import { InvoiceStatusBadge } from "../components/invoice-status-badge";
import type { Invoice } from "../types";
import { formatInvoiceAmount, formatInvoiceDate } from "../utils";

interface InvoiceDetailSectionProps {
  invoice: Invoice;
  onBack: () => void;
  onToggleStatus: (invoiceId: string) => void;
}

export function InvoiceDetailSection({
  invoice,
  onBack,
  onToggleStatus,
}: InvoiceDetailSectionProps) {
  const { t } = useTranslation();

  const isPaid = invoice.status === "PAID";

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">{t("nav.dashboard")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button type="button" onClick={onBack} className="hover:text-foreground">
                {t("nav.invoice")}
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{invoice.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Master Header Card */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-bold tracking-tight text-foreground">
                #{invoice.id}
              </span>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <CardDescription className="text-base font-medium text-foreground">
              {invoice.project.title}
            </CardDescription>
            {invoice.project.clientName ? (
              <p className="text-xs text-muted-foreground">Client: {invoice.project.clientName}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <InvoiceDownloadButton invoice={invoice} showText variant="outline" />
            {isPaid ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => onToggleStatus(invoice.id)}
                className="gap-2"
              >
                <RotateCcw className="size-4" />
                <span>{t("invoice.detail.markPending")}</span>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => onToggleStatus(invoice.id)}
                className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                <CheckCircle2 className="size-4" />
                <span>{t("invoice.detail.markPaid")}</span>
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Amount Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <DollarSign className="size-4 text-muted-foreground" />
              {t("invoice.detail.amount")}
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-foreground">
              {formatInvoiceAmount(invoice.amount, invoice.currency)}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Status Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <CheckCircle2 className="size-4 text-muted-foreground" />
              {t("invoice.detail.statusLabel")}
            </CardDescription>
            <div className="pt-1">
              <InvoiceStatusBadge status={invoice.status} className="text-sm px-3 py-1" />
            </div>
          </CardHeader>
        </Card>

        {/* Issued Date Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <Calendar className="size-4 text-muted-foreground" />
              {t("invoice.detail.issuedDate")}
            </CardDescription>
            <p className="text-base font-semibold text-foreground">
              {formatInvoiceDate(invoice.issuedDate, undefined, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </CardHeader>
        </Card>

        {/* Due Date Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <Calendar className="size-4 text-muted-foreground" />
              {t("invoice.detail.dueDate")}
            </CardDescription>
            <p className="text-base font-semibold text-foreground">
              {formatInvoiceDate(invoice.dueDate, undefined, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </CardHeader>
        </Card>

        {/* Description Card */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <FileText className="size-4 text-muted-foreground" />
              {t("invoice.detail.description")}
            </CardDescription>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {invoice.description || "-"}
            </p>
          </CardHeader>
        </Card>

        {/* Payment Method Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <CreditCard className="size-4 text-muted-foreground" />
              {t("invoice.detail.paymentMethod")}
            </CardDescription>
            <p className="text-sm font-medium text-foreground">{invoice.paymentMethod || "-"}</p>
          </CardHeader>
        </Card>

        {/* Payment Link Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <ExternalLink className="size-4 text-muted-foreground" />
              {t("invoice.detail.paymentLink")}
            </CardDescription>
            {invoice.paymentLink ? (
              <div className="pt-1">
                <a
                  href={invoice.paymentLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <span>{t("invoice.detail.payInvoice")}</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">-</p>
            )}
          </CardHeader>
        </Card>

        {/* Invoice Note Card */}
        {invoice.invoiceNote ? (
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                <FileText className="size-4 text-muted-foreground" />
                {t("invoice.detail.invoiceNote")}
              </CardDescription>
              <p className="text-sm italic text-muted-foreground">"{invoice.invoiceNote}"</p>
            </CardHeader>
          </Card>
        ) : null}
      </div>

      {/* Audit Footer Card */}
      <Card className="bg-muted/30">
        <CardContent className="flex flex-col gap-2 p-4 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>
            {t("invoice.detail.createdAt")} {new Date(invoice.createdAt).toLocaleString()}
          </span>
          <span>
            {t("invoice.detail.updatedAt")} {new Date(invoice.updatedAt).toLocaleString()}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
