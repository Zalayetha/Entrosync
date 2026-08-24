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
import { useLoginMutation } from "../modules/auth/hooks/use-auth";
import { Copyright } from "lucide-react";

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
    <div className="flex min-h-screen flex-col">

      {/*Header*/}
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex gap-2 items-center">
          <img
            alt={t("auth.login.logoAlt")}
            src="/images/favicon.svg"
            className="h-8 w-auto" />
          <Link to="/" className="font-semibold">
            {t("nav.brand")}
          </Link>
        </div>
        <HeaderControls />
      </header>
      {/*End Header*/}

      {/*Main*/}
      <main className="min-h-screen flex flex-col lg:flex-row">
        {/*Left Side*/}
        <div className="flex-1 flex flex-col justify-between gap-12 p-8 lg:p-16">
          <div className="flex flex-col justify-center h-full items-start text-left">

           	<div className="max-w-md">
      				<h1 className="text-4xl font-bold mb-4">{t("auth.login.heroTitle")}</h1>
      				<p className="text-gray-400 text-lg leading-relaxed">{t("auth.login.heroDescription")}</p>
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
              <CardTitle className="text-2xl text-center">{t("auth.login.title")}</CardTitle>
              <CardDescription className="text-center">{t("auth.login.description")}</CardDescription>
              <Button
        				onClick={() => console.log("Login with google")}
        				type="button"
        				className="w-full rounded-full my-2"
              >
                {t("auth.login.googleSubmit")}
              </Button>
            </CardHeader>

           	{/* Divider */}
           	<div className="relative flex items-center justify-center">
             	<div className="absolute inset-0 flex items-center">
              		<div className="w-full border-t border-neutral-800" />
             	</div>
             	<span className="relative bg-black px-3 text-xs text-gray-500">
            		{t("auth.login.divider")}
             	</span>
            </div>

            <CardContent>
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
        </div>
        {/*End Right Side*/}
      </main>
    </div>
  );
}
