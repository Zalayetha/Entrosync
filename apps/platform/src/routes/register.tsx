import { useTranslation } from "@repo/ui/i18n";
import { Spinner } from "@repo/ui/components/spinner";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { toast } from "@repo/ui/components/sonner";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { HeaderControls } from "../modules/app-shell/header-controls";
import { useRegisterMutation } from "../modules/auth/hooks/use-auth";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const registerMutation = useRegisterMutation();
  const passwordsDoNotMatch = confirmPassword.length > 0 && confirmPassword !== password;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwordsDoNotMatch) {
      return;
    }

    registerMutation.mutate(
      { name, email, password },
      {
        onError: (error) => {
          const message = error instanceof Error ? error.message : t("auth.register.fallbackError");
          toast.error(message);
        },
      },
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between border-b px-5 sm:px-6 lg:border-transparent">
        <div className="flex items-center gap-2">
          <img alt={t("auth.register.logoAlt")} src="/images/favicon.svg" className="h-8 w-auto" />
          <Link to="/" className="font-semibold">
            {t("nav.brand")}
          </Link>
        </div>
        <HeaderControls />
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_28rem] lg:px-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <section className="max-w-xl">
          <h1 className="text-4xl font-semibold leading-tight text-foreground text-balance">
            {t("auth.register.heroTitle")}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            {t("auth.register.heroDescription")}
          </p>
        </section>

        <section className="w-full">
          <Card className="w-full p-0">
            <CardHeader className="p-6 pb-4 text-left">
              <CardTitle className="text-xl">{t("auth.register.title")}</CardTitle>
              <CardDescription>{t("auth.register.description")}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="name">{t("auth.register.name")}</Label>
                  <Input
                    id="name"
                    autoComplete="name"
                    autoFocus
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("auth.register.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t("auth.register.password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">{t("auth.register.passwordHint")}</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">{t("auth.register.confirmPassword")}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="confirm-password"
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                  {passwordsDoNotMatch ? (
                    <p className="text-xs text-destructive" role="alert" aria-live="polite">
                      {t("auth.register.passwordMismatch")}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="submit"
                  disabled={registerMutation.isPending || passwordsDoNotMatch}
                  className="transition-all active:scale-[0.98]"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Spinner className="size-4" />
                      {t("auth.register.pending")}
                    </>
                  ) : (
                    t("auth.register.submit")
                  )}
                </Button>
                <Button asChild type="button" variant="link">
                  <Link to="/login">{t("auth.register.loginLink")}</Link>
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
