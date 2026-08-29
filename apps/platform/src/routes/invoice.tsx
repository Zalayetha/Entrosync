import { useState } from "react";
import { useTranslation } from "@repo/ui/i18n";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { toast } from "@repo/ui/components/sonner";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { PlatformAppShell } from "../modules/app-shell/app-shell";
import { meQueryOptions } from "../modules/auth/hooks/use-auth";
import { UnauthorizedError } from "../modules/auth/services";
import { mockInvoiceProjects, mockInvoices } from "../modules/invoice/mock-data";
import { InvoiceDetailSection } from "../modules/invoice/sections/invoice-detail-section";
import { InvoiceGeneratorSection } from "../modules/invoice/sections/invoice-generator-section";
import { InvoiceListSection } from "../modules/invoice/sections/invoice-list-section";
import type { Invoice, InvoiceSubView } from "../modules/invoice/types";

export const Route = createFileRoute("/invoice")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(meQueryOptions);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw redirect({ to: "/login" });
      }

      throw error;
    }
  },
  component: InvoiceRouteComponent,
});

function InvoiceRouteComponent() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [currentView, setCurrentView] = useState<InvoiceSubView>("list");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId) || null;

  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoiceId(invoice.id);
    setCurrentView("detail");
  };

  const handleCreateNew = () => {
    setCurrentView("generator");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedInvoiceId(null);
  };

  const handleToggleStatus = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const nextStatus = inv.status === "PAID" ? "PENDING" : "PAID";
          return {
            ...inv,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return inv;
      }),
    );
  };

  const handleInvoiceCreated = (newInvoice: Invoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
    setSelectedInvoiceId(newInvoice.id);
    setCurrentView("detail");
    toast.success(`Invoice #${newInvoice.id} created successfully.`);
  };

  return (
    <PlatformAppShell>
      {currentView === "list" ? (
        <InvoiceListSection
          invoices={invoices}
          onSelectInvoice={handleSelectInvoice}
          onCreateNew={handleCreateNew}
        />
      ) : null}

      {currentView === "detail" ? (
        selectedInvoice ? (
          <InvoiceDetailSection
            invoice={selectedInvoice}
            onBack={handleBackToList}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <FileQuestion className="size-12 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-lg font-semibold text-foreground">
                  {t("invoice.detail.notFound")}
                </p>
              </div>
              <Button type="button" variant="outline" onClick={handleBackToList}>
                <ArrowLeft className="size-4 mr-2" />
                {t("invoice.backToList")}
              </Button>
            </CardContent>
          </Card>
        )
      ) : null}

      {currentView === "generator" ? (
        <InvoiceGeneratorSection
          projects={mockInvoiceProjects}
          onCancel={handleBackToList}
          onInvoiceCreated={handleInvoiceCreated}
        />
      ) : null}
    </PlatformAppShell>
  );
}
