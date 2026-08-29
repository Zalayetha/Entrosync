import { useTranslation } from "@repo/ui/i18n";
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
import { useLoginMutation } from "../modules/auth/hooks/use-auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onError: (error) => {
          const message = error instanceof Error ? error.message : t("auth.login.fallbackError");
          toast.error(message);
        },
      },
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between border-b px-5 sm:px-6 lg:border-transparent">
        <div className="flex items-center gap-2">
          <img alt={t("auth.login.logoAlt")} src="/images/favicon.svg" className="h-8 w-auto" />
          <Link to="/" className="font-semibold">
            {t("nav.brand")}
          </Link>
        </div>
        <HeaderControls />
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_28rem] lg:px-8">
        <section className="max-w-xl">
          <h1 className="text-4xl font-semibold leading-tight text-foreground text-balance">
            {t("auth.login.heroTitle")}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            {t("auth.login.heroDescription")}
          </p>
        </section>

        <section className="w-full">
          <Card className="w-full p-0">
            <CardHeader className="p-6 pb-4 text-left">
              <CardTitle className="text-xl">{t("auth.login.title")}</CardTitle>
              <CardDescription>{t("auth.login.description")}</CardDescription>
              {/*
              <Button
                onClick={() => console.log("Login with google")}
                type="button"
                className="mt-3 w-full"
                variant="outline"
              >
                {t("auth.login.googleSubmit")}
              </Button>
              */}
            </CardHeader>

            {/*
            <div className="relative flex items-center justify-center px-6">
              <div className="absolute inset-x-6 flex items-center">
                <div className="w-full border-t" />
              </div>
              <span className="relative bg-card px-3 text-xs font-medium text-muted-foreground">
                {t("auth.login.divider")}
              </span>
            </div>
            */}

            <CardContent className="p-6">
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("auth.login.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t("auth.login.password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? t("auth.login.pending") : t("auth.login.submit")}
                </Button>
                <Button asChild type="button" variant="link">
                  <Link to="/register">{t("auth.login.createAccount")}</Link>
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
