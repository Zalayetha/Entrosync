import { createFileRoute } from "@tanstack/react-router";
import { PlatformAppShell } from "../modules/app-shell/app-shell";

export const Route = createFileRoute("/project")({
  component: ProjectPage,
});

function ProjectPage() {
  return (
    <PlatformAppShell>
      <section></section>
    </PlatformAppShell>
  );
}
