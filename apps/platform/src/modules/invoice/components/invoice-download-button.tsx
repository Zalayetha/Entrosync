import type { ComponentProps } from "react";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import { Download } from "lucide-react";
import { useTranslation } from "@repo/ui/i18n";
import type { Invoice } from "../types";

interface InvoiceDownloadButtonProps extends Omit<ComponentProps<typeof Button>, "onClick"> {
  invoice: Invoice;
  showText?: boolean;
}

export function InvoiceDownloadButton({
  invoice,
  showText = false,
  variant = "ghost",
  size = "icon",
  className,
  ...props
}: InvoiceDownloadButtonProps) {
  const { t } = useTranslation();

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toast.success(`PDF invoice #${invoice.id} ready for download.`);
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={showText ? "default" : size}
      className={className}
      onClick={handleDownload}
      title={t("invoice.detail.downloadPdf")}
      aria-label={t("invoice.detail.downloadPdf")}
      {...props}
    >
      <Download className="size-4" />
      {showText ? <span>{t("invoice.detail.downloadPdf")}</span> : null}
    </Button>
  );
}
