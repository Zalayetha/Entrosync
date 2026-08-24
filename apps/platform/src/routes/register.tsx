import { useTranslation } from "@repo/ui/i18n";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { toast } from "@repo/ui/components/sonner";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { HeaderControls } from "../modules/app-shell/header-controls";
import { useRegisterMutation } from "../modules/auth/hooks/use-auth";
import { Copyright } from "lucide-react";

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    <div className="flex min-h-screen flex-col">
      {/*Header*/}
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex gap-2 items-center">
          <img
            alt={t("auth.register.logoAlt")}
            src="/images/favicon.svg"
            className="h-8 w-auto" />
          <Link to="/" className="font-semibold">
            {t("nav.brand")}
          </Link>
        </div>
        <HeaderControls />
      </header>
      {/*End Header*/}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        {/*Left Side*/}
        <div className="flex-1 flex flex-col justify-between gap-12 p-8 lg:p-16">
          <div className="flex flex-col justify-center h-full items-start text-left">

           	<div className="max-w-md">
      				<h1 className="text-4xl font-bold mb-4">{t("auth.register.heroTitle")}</h1>
      				<p className="text-gray-400 text-lg leading-relaxed">{t("auth.register.heroDescription")}</p>
            </div>
            {/* Copyright */}
       			<div
        				className={`flex items-center gap-1 text-sm text-gray-500 flex-row-reverse`}
       			>
        				<Copyright size={12} />
              <span>2026 {t("nav.brand")}</span>
       			</div>
          </div>
        </div>
        {/*End Left Side*/}

        {/*Right Side*/}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-16">
          <Card className="w-full max-w-md bg-background border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl text-center">{t("auth.register.title")}</CardTitle>
              <CardDescription className="text-center">{t("auth.register.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="name">{t("auth.register.name")}</Label>
                  <Input
                    id="name"
                    autoComplete="name"
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
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">{t("auth.register.confirmPassword")}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="confirm-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <Button type="submit" disabled={registerMutation.isPending}>
                  {registerMutation.isPending
                    ? t("auth.register.pending")
                    : t("auth.register.submit")}
                </Button>
                <Button asChild type="button" variant="link">
                  <Link to="/login">{t("auth.register.loginLink")}</Link>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        {/*End Right Side*/}
      </main>
    </div>
  );
}
