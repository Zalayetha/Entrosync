import { LanguageSwitcher, useTranslation } from "@repo/ui/i18n";
import { ThemeSelector } from "@repo/ui/components/theme-selector";
import { Button } from "@repo/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import { Settings } from "lucide-react";

export function HeaderControls() {
  const { t } = useTranslation();

  return (
    <>
      {/* Desktop */}
      <div className="hidden items-center gap-2 sm:flex">
        <ThemeSelector
          ariaLabel={t("theme.label")}
          labels={{
            dark: t("theme.options.dark"),
            light: t("theme.options.light"),
            system: t("theme.options.system"),
          }}
        />
        <LanguageSwitcher />
      </div>

      {/* Mobile */}
      <div className="flex sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t("settings.title")}>
              <Settings className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{t("settings.title")}</SheetTitle>
              <SheetDescription>{t("settings.description")}</SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 py-6">
              <div className="grid gap-2">
                <span className="text-sm font-medium">{t("theme.label")}</span>
                <ThemeSelector
                  ariaLabel={t("theme.label")}
                  labels={{
                    dark: t("theme.options.dark"),
                    light: t("theme.options.light"),
                    system: t("theme.options.system"),
                  }}
                />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">{t("language.label")}</span>
                <LanguageSwitcher />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
