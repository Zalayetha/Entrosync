import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Button } from "@repo/ui/components/button";
import { Spinner } from "@repo/ui/components/spinner";
import { useTranslation } from "@repo/ui/i18n";
import { AlertCircle } from "lucide-react";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
  errorComponent: RootError,
  pendingComponent: RootPending,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
}

function RootError() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <AlertCircle className="size-12 text-destructive" />
      <h1 className="text-2xl font-semibold">{t("error.title")}</h1>
      <p className="text-muted-foreground">{t("error.description")}</p>
      <Button onClick={() => window.location.reload()}>{t("error.reload")}</Button>
    </div>
  );
}

function RootPending() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner className="size-6" />
    </div>
  );
}
