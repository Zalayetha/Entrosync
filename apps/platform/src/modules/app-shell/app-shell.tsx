import { useTranslation } from "@repo/ui/i18n";
import { Spinner } from "@repo/ui/components/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@repo/ui/components/sidebar";
import { toast } from "@repo/ui/components/sonner";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { Folder, LayoutDashboardIcon, LogOutIcon, ReceiptText, UserRoundIcon } from "lucide-react";
import type { ReactNode } from "react";
import { meQueryOptions, useLogoutMutation } from "../auth/hooks/use-auth";
import { HeaderControls } from "./header-controls";
import { PageTransition } from "./page-transition";

export function PlatformAppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useQuery(meQueryOptions);
  const logoutMutation = useLogoutMutation();

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onError: (error) => {
        const message = error instanceof Error ? error.message : t("dashboard.logoutFallbackError");
        toast.error(message);
      },
    });
  }

  if (!user.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="size-6" />
      </div>
    );
  }

  const navItems = [
    { icon: LayoutDashboardIcon, label: t("nav.dashboard"), to: "/" },
    { icon: Folder, label: t("nav.projects"), to: "/project" },
    { icon: ReceiptText, label: t("nav.invoice"), to: "/invoice" },
    { icon: UserRoundIcon, label: t("nav.profile"), to: "/profile" },
  ] as const;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild tooltip={t("nav.brand")}>
                <Link to="/">
                  <img src="/images/favicon.svg" alt="logo" className="size-7" />
                  <span className="font-semibold group-data-[collapsible=icon]:hidden">
                    {t("nav.brand")}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t("sidebar.workspace")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.to}
                      tooltip={item.label}
                    >
                      <Link to={item.to}>
                        <item.icon className="size-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip={t("nav.profile")}>
                <Link to="/profile">
                  <Avatar className="shrink-0 rounded-md">
                    {user.data.image ? (
                      <AvatarImage src={user.data.image} alt={`${user.data.name} avatar`} />
                    ) : null}
                    <AvatarFallback className="rounded-md">
                      {getInitials(user.data.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-medium">{user.data.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.data.email}
                    </span>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                type="button"
                variant="ghost"
                disabled={logoutMutation.isPending}
              >
                <LogOutIcon className="size-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  {logoutMutation.isPending ? t("dashboard.logoutPending") : t("dashboard.logout")}
                </span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("dashboard.logoutConfirm.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("dashboard.logoutConfirm.description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("dashboard.logoutConfirm.cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>
                  {t("dashboard.logoutConfirm.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background/95 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <span className="text-sm font-medium text-muted-foreground">{t("nav.brand")}</span>
          </div>
          <HeaderControls />
        </header>
        <PageTransition>
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-7 px-5 py-7 sm:px-6 lg:px-8">
            {children}
          </div>
        </PageTransition>
      </SidebarInset>
    </SidebarProvider>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
