# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm monorepo. Application code lives in `apps/`: `apps/api` is a Hono Node API, while `apps/platform` and `apps/admin` are React + Vite frontends using TanStack Router and Query. Shared source-only packages live in `packages/`, including `api-client`, `logger`, `storage`, `ui`, and `worker`. Prisma schema and migrations are under `apps/api/prisma`. Tests sit next to code as `*.test.ts` or `*.test.tsx`.

## Build, Test, and Development Commands

- `pnpm install`: install workspace dependencies.
- `cp .env.example .env`: create local configuration.
- `docker compose -f docker-compose.dev.yaml up -d`: start local Postgres and Redis.
- `pnpm dev`: run all apps in parallel.
- `pnpm --filter @repo/api dev`: run the API watcher.
- `pnpm --filter @repo/platform dev`: run the platform app on port 3000.
- `pnpm --filter @repo/admin dev`: run the admin app on port 4000.
- `pnpm build`: build frontend apps and type-check the API app.
- `pnpm test`: run all available Vitest suites.
- `pnpm typecheck`: type-check all workspaces.
- `pnpm check` / `pnpm check:fix`: run or apply Biome checks.
- `pnpm db:migrate`: apply Prisma migrations locally.

## Coding Style & Naming Conventions

Use TypeScript ES modules. Biome enforces 2-space indentation, double quotes, semicolons, trailing commas, and 100-character lines. Prefer named exports for shared package APIs. React components use PascalCase filenames only when the existing area does; most route and module files use kebab-case, such as `header-controls.tsx` and `use-auth.ts`.

## Testing Guidelines

Vitest is the test runner. Add focused tests beside the code they cover, following the existing `*.test.ts` convention. For API or worker changes, cover service logic and configuration edge cases. For frontend changes, cover routing, i18n, and hook behavior where practical. Run `pnpm test` and `pnpm typecheck` before submitting.

## Commit & Pull Request Guidelines

Recent history uses short imperative commits, including Conventional Commit style such as `chore: add initial db schema for entrosync`. Keep messages concise and scoped. Pull requests should describe the change, list verification commands, link related issues, and include screenshots for visible UI changes.

## Security & Configuration Tips

Never commit `.env` or secrets. Use `.env.example` for documented variables. Keep `BETTER_AUTH_SECRET` unique and at least 32 characters in non-local environments. When changing auth, API origins, storage, or telemetry, update the README and relevant environment examples.
