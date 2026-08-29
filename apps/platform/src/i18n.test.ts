import { describe, expect, it } from "vitest";
import { i18n } from "./i18n";

describe("platform i18n", () => {
  it("loads base translations", () => {
    expect(i18n.t("nav.brand", { lng: "en" })).toBe("Entrosync");
    expect(i18n.t("nav.dashboard", { lng: "id" })).toBe("Dasbor");
  });

  it("loads dashboard translations with interpolation", () => {
    expect(i18n.t("dashboard.metrics.revenue.label", { lng: "en" })).toBe("Total Revenue (YTD)");
    expect(
      i18n.t("dashboard.metrics.revenue.helper", {
        lng: "en",
        percent: 12.5,
      }),
    ).toBe("+12.5% from last month");

    expect(i18n.t("dashboard.metrics.revenue.label", { lng: "id" })).toBe("Total Revenue (YTD)");
    expect(
      i18n.t("dashboard.metrics.revenue.helper", {
        lng: "id",
        percent: 12.5,
      }),
    ).toBe("+12.5% dari bulan lalu");

    expect(i18n.t("dashboard.activeProjects.status.inProgress", { lng: "en" })).toBe("In Progress");
    expect(i18n.t("dashboard.activeProjects.status.inProgress", { lng: "id" })).toBe(
      "Sedang Berjalan",
    );
  });
});
