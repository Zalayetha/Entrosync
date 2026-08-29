import { useState, useId, type FormEvent } from "react";
import { useTranslation } from "@repo/ui/i18n";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";
import { ArrowLeft } from "lucide-react";
import { InvoiceLivePreview } from "../components/invoice-live-preview";
import type { CreateInvoiceFormInput, Currency, Invoice, InvoiceProjectSummary } from "../types";
import { addDays } from "../utils";

interface InvoiceGeneratorSectionProps {
  projects: InvoiceProjectSummary[];
  onCancel: () => void;
  onInvoiceCreated: (invoice: Invoice) => void;
}

export function InvoiceGeneratorSection({
  projects,
  onCancel,
  onInvoiceCreated,
}: InvoiceGeneratorSectionProps) {
  const { t } = useTranslation();
  const formId = useId();

  const todayStr = new Date().toISOString().split("T")[0]!;
  const defaultDueStr = addDays(todayStr, 14);

  const [projectId, setProjectId] = useState<string>(projects[0]?.id || "");
  const [currency, setCurrency] = useState<Currency>("IDR");
  const [amount, setAmount] = useState<string>("");
  const [issuedDate, setIssuedDate] = useState<string>(todayStr);
  const [dueDate, setDueDate] = useState<string>(defaultDueStr);
  const [description, setDescription] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentLink, setPaymentLink] = useState<string>("");
  const [invoiceNote, setInvoiceNote] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProject = projects.find((p) => p.id === projectId) || null;

  const numericAmount = Number.parseFloat(amount) || 0;

  const formData: CreateInvoiceFormInput = {
    projectId,
    amount: numericAmount,
    currency,
    issuedDate,
    dueDate,
    description: description.trim() || undefined,
    paymentMethod: paymentMethod.trim() || undefined,
    paymentLink: paymentLink.trim() || undefined,
    invoiceNote: invoiceNote.trim() || undefined,
  };

  const handleIssuedDateChange = (newIssued: string) => {
    setIssuedDate(newIssued);
    if (newIssued) {
      setDueDate(addDays(newIssued, 14));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!projectId) {
      newErrors.projectId = t("invoice.generator.validation.projectRequired");
    }

    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      newErrors.amount = t("invoice.generator.validation.amountInvalid");
    }

    if (!issuedDate) {
      newErrors.issuedDate = t("invoice.generator.validation.issuedDateRequired");
    }

    if (!dueDate) {
      newErrors.dueDate = t("invoice.generator.validation.dueDateRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!selectedProject) {
      return;
    }

    setIsSubmitting(true);

    const now = new Date().toISOString();
    const invoiceId = `inv_${Date.now().toString(36)}`;

    const newInvoice: Invoice = {
      id: invoiceId,
      projectId: selectedProject.id,
      project: selectedProject,
      amount: numericAmount,
      currency,
      status: "PENDING",
      description: formData.description || null,
      paymentMethod: formData.paymentMethod || null,
      paymentLink: formData.paymentLink || null,
      invoiceNote: formData.invoiceNote || null,
      issuedDate: new Date(issuedDate).toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      createdAt: now,
      updatedAt: now,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onInvoiceCreated(newInvoice);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="gap-2 px-0 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span>{t("invoice.backToList")}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-xl">{t("invoice.generator.title")}</CardTitle>
                <CardDescription>{t("invoice.generator.subtitle")}</CardDescription>
              </CardHeader>

              <CardContent className="grid gap-5">
                <Field>
                  <FieldLabel htmlFor={`${formId}-project`}>
                    {t("invoice.generator.fields.project")}
                  </FieldLabel>
                  <Select
                    value={projectId}
                    onValueChange={(val) => {
                      setProjectId(val);
                      if (errors.projectId) {
                        setErrors((prev) => ({ ...prev, projectId: "" }));
                      }
                    }}
                  >
                    <SelectTrigger id={`${formId}-project`} className="w-full">
                      <SelectValue placeholder={t("invoice.generator.fields.selectProject")} />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.title} ({p.clientName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.projectId ? (
                    <FieldError errors={[{ message: errors.projectId }]} />
                  ) : null}
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field className="sm:col-span-1">
                    <FieldLabel htmlFor={`${formId}-currency`}>
                      {t("invoice.generator.fields.currency")}
                    </FieldLabel>
                    <Select value={currency} onValueChange={(val) => setCurrency(val as Currency)}>
                      <SelectTrigger id={`${formId}-currency`} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDR">IDR (Rp)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor={`${formId}-amount`}>
                      {t("invoice.generator.fields.amount")}
                    </FieldLabel>
                    <Input
                      id={`${formId}-amount`}
                      type="number"
                      step="any"
                      min="0.01"
                      placeholder={currency === "IDR" ? "15000000" : "1200"}
                      value={amount}
                      aria-invalid={Boolean(errors.amount)}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (errors.amount) {
                          setErrors((prev) => ({ ...prev, amount: "" }));
                        }
                      }}
                    />
                    {errors.amount ? <FieldError errors={[{ message: errors.amount }]} /> : null}
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor={`${formId}-issuedDate`}>
                      {t("invoice.generator.fields.issuedDate")}
                    </FieldLabel>
                    <Input
                      id={`${formId}-issuedDate`}
                      type="date"
                      value={issuedDate}
                      aria-invalid={Boolean(errors.issuedDate)}
                      onChange={(e) => handleIssuedDateChange(e.target.value)}
                    />
                    {errors.issuedDate ? (
                      <FieldError errors={[{ message: errors.issuedDate }]} />
                    ) : null}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={`${formId}-dueDate`}>
                      {t("invoice.generator.fields.dueDate")}
                    </FieldLabel>
                    <Input
                      id={`${formId}-dueDate`}
                      type="date"
                      value={dueDate}
                      aria-invalid={Boolean(errors.dueDate)}
                      onChange={(e) => {
                        setDueDate(e.target.value);
                        if (errors.dueDate) {
                          setErrors((prev) => ({ ...prev, dueDate: "" }));
                        }
                      }}
                    />
                    {errors.dueDate ? <FieldError errors={[{ message: errors.dueDate }]} /> : null}
                  </Field>
                </div>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={`${formId}-description`}>
                      {t("invoice.generator.fields.description")}
                    </FieldLabel>
                    <span className="text-xs text-muted-foreground">
                      {t("invoice.generator.fields.optional")}
                    </span>
                  </div>
                  <Textarea
                    id={`${formId}-description`}
                    placeholder={t("invoice.generator.fields.descriptionPlaceholder")}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={`${formId}-paymentMethod`}>
                      {t("invoice.generator.fields.paymentMethod")}
                    </FieldLabel>
                    <span className="text-xs text-muted-foreground">
                      {t("invoice.generator.fields.optional")}
                    </span>
                  </div>
                  <Input
                    id={`${formId}-paymentMethod`}
                    placeholder={t("invoice.generator.fields.paymentMethodPlaceholder")}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={`${formId}-paymentLink`}>
                      {t("invoice.generator.fields.paymentLink")}
                    </FieldLabel>
                    <span className="text-xs text-muted-foreground">
                      {t("invoice.generator.fields.optional")}
                    </span>
                  </div>
                  <Input
                    id={`${formId}-paymentLink`}
                    type="url"
                    placeholder="https://pay.entrosync.com/link..."
                    value={paymentLink}
                    onChange={(e) => setPaymentLink(e.target.value)}
                  />
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={`${formId}-invoiceNote`}>
                      {t("invoice.generator.fields.invoiceNote")}
                    </FieldLabel>
                    <span className="text-xs text-muted-foreground">
                      {t("invoice.generator.fields.optional")}
                    </span>
                  </div>
                  <Textarea
                    id={`${formId}-invoiceNote`}
                    placeholder="Thank you for your business..."
                    rows={2}
                    value={invoiceNote}
                    onChange={(e) => setInvoiceNote(e.target.value)}
                  />
                  <FieldDescription>
                    Add notes or payment terms to appear at the bottom of the invoice.
                  </FieldDescription>
                </Field>
              </CardContent>

              <CardFooter className="mt-4 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                  {t("invoice.generator.actions.cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? t("invoice.generator.actions.submitting")
                    : t("invoice.generator.actions.submit")}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("invoice.generator.livePreview")}
          </div>
          <InvoiceLivePreview formData={formData} project={selectedProject} />
        </div>
      </div>
    </div>
  );
}
