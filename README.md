<p align="center">
    <picture>
        <source srcset="./assets/logo.svg" width="140" />
        <img alt="Entrosync logo" src="./assets/logo.svg" width="140" />
    </picture>
</p>

<p align="center">
  <a href="#license"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/pnpm/pnpm"><img src="https://img.shields.io/badge/pnpm-v10-orange.svg" alt="pnpm"></a>
  <a href="https://hono.dev"><img src="https://img.shields.io/badge/API-Hono-E36002.svg" alt="Hono"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg" alt="React"></a>
  <a href="https://tanstack.com/router"><img src="https://img.shields.io/badge/Router-TanStack%20Router-FF4154.svg" alt="TanStack Router"></a>
</p>

<h1 align="center">Entrosync</h1>

<p align="center">
  <a href="#features"><b>Features</b></a> ·
  <a href="#workspace-structure"><b>Structure</b></a> ·
  <a href="#quick-start"><b>Quick Start</b></a> ·
  <a href="#modules--integrations"><b>Modules</b></a> ·
  <a href="#deployment"><b>Deployment</b></a>
</p>

<p align="center">
  <strong>Your projects and clients, perfectly in sync.</strong><br>
  Entrosync is an open-source client portal and project collaboration platform designed for modern teams, agencies, and builders.
</p>

---

Entrosync unites project tracking, milestone delivery, client feedback, invoices, and shared resources in one unified, high-performance monorepo. It gives clients a transparent portal to track deliverables while giving your team a clean command center to manage work.

---

## ✨ Features

- 🎯 **Project & Milestone Delivery** — Organize work into projects, milestones, and issues with status tracking, estimates, and hierarchical comment threads.
- 🤝 **Client Portals & Token Invites** — Share secure, guest-accessible project views with clients without friction or complex onboarding.
- 💳 **Invoicing & Payments** — Track billables, payment statuses, and currency formatting (USD, IDR) with direct payment links and notes.
- 💬 **Real-time Feedback & Activity Logs** — Collect client reviews, track ratings, and maintain an immutable project audit log.
- 📦 **Centralized Resource Hub** — Store project documentation links and file assets with S3-compatible cloud storage.
- ⚡ **End-to-End Type Safety** — Zero-cost Hono RPC typing across API and frontend clients with `@repo/api-client`.
- 🔐 **Modern Auth & RBAC** — Powered by Better Auth with session management, role-based access control, and admin CLI tools.
- 🛠️ **Production-Ready Observability** — Structured Pino logging with OpenTelemetry tracing across services and background workers.

---

## 🏗️ Workspace Structure

Entrosync is organized as a modular pnpm monorepo:

### Applications (`apps/`)

| App | Description | Tech Stack |
| :--- | :--- | :--- |
| [`apps/api`](./apps/api) | High-performance backend API & RPC endpoints | Hono, Node.js, Prisma ORM, PostgreSQL, Redis |
| [`apps/platform`](./apps/platform) | Main client and workspace management portal | React 19, Vite, TanStack Router & Query, Tailwind CSS |
| [`apps/admin`](./apps/admin) | Administration dashboard and system control | React 19, Vite, TanStack Router & Query, Shadcn UI |

### Packages (`packages/`)

| Package | Description |
| :--- | :--- |
| [`packages/api-client`](./packages/api-client) | Typed Hono RPC client shared across frontend applications |
| [`packages/logger`](./packages/logger) | Pino structured logging and OpenTelemetry tracing SDK setup |
| [`packages/storage`](./packages/storage) | S3-compatible object storage primitives (AWS S3, Cloudflare R2, MinIO) |
| [`packages/ui`](./packages/ui) | Shared UI components (Shadcn/Radix), Tailwind primitives, and i18next setup |
| [`packages/worker`](./packages/worker) | Redis + BullMQ background job processing primitives |

> All workspace packages are source-only: they export `.ts`/`.tsx` files directly with zero build overhead.

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 20.x)
- [pnpm](https://pnpm.io/) (>= 10.x)
- [Docker](https://www.docker.com/) & Docker Compose

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Zalayetha/Entrosync.git
cd Entrosync
pnpm install
```

### 2. Configure Environment

Copy the example environment configuration:

```bash
cp .env.example .env
```

Generate a secure authentication secret:

```bash
# Set BETTER_AUTH_SECRET in .env
openssl rand -base64 32
```

### 3. Start Local Infrastructure

Launch PostgreSQL and Redis using Docker Compose:

```bash
docker compose -f docker-compose.dev.yaml up -d
```

- **PostgreSQL**: `localhost:15432`
- **Redis**: `localhost:16379`

### 4. Setup Database

Generate Prisma client and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

### 5. Run Development Servers

Start all applications concurrently:

```bash
pnpm dev
```

Or run individual apps independently:

```bash
# API Server (http://localhost:8000)
pnpm --filter @repo/api dev

# Platform App (http://localhost:3000)
pnpm --filter @repo/platform dev

# Admin Dashboard (http://localhost:4000)
pnpm --filter @repo/admin dev

# Background Worker
pnpm --filter @repo/worker dev
```

### 6. Create Admin User

Create or promote a superuser account:

```bash
pnpm createsuperuser
```

---

## 🧪 Testing & Code Quality

Run tests across all workspaces:

```bash
# Run Vitest test suites
pnpm test

# Type-check TypeScript across all packages
pnpm typecheck

# Check and fix formatting / linting with Biome
pnpm check
pnpm check:fix
```

---

## 🔌 Modules & Integrations

### Authentication (`Better Auth`)

Better Auth handles sessions, cookies, and RBAC mounted at `/api/auth/*`.

- Configure `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `CLIENT_ORIGINS` in `.env`.
- Frontend apps utilize the typed client SDK for authentication and `@repo/api-client` for domain resources.

### Object Storage (`packages/storage`)

Compatible with AWS S3, Cloudflare R2, MinIO, and DigitalOcean Spaces:

```ts
import { createStorage } from "@repo/storage";

const storage = createStorage({
  accessKeyId: process.env.S3_ACCESS_KEY_ID!,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  bucket: process.env.S3_BUCKET!,
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_ENDPOINT,
});

await storage.putObject({
  key: "uploads/project-spec.pdf",
  body: fileBuffer,
  contentType: "application/pdf",
});
```

### Observability & Tracing (`packages/logger`)

Structured JSON logging with OpenTelemetry trace correlation:

```ts
import { createLogger } from "@repo/logger";

const logger = createLogger({ service: "api" });
logger.info({ projectId: "proj_123" }, "Milestone completed");
```

Enable distributed tracing in `.env`:

```env
ENABLE_TELEMETRY=true
TELEMETRY_EXPORTER=otlp
TELEMETRY_EXPORTER_OTLP_ENDPOINT="https://collector.example.com/v1/traces"
TELEMETRY_API_KEY="..."
```

---

## 🐳 Deployment

### Production Docker API

To run the API and PostgreSQL in production Docker containers:

```bash
docker compose up --build -d
```

The container automatically deploys database migrations via `pnpm db:deploy` on boot. The API is exposed at `http://localhost:8000`.

### Cloudflare Frontend Workers

`apps/platform` and `apps/admin` deploy as high-performance Cloudflare Workers with SPA fallback and immutable asset caching.

```bash
# Authenticate Wrangler
pnpm --filter @repo/platform exec wrangler login

# Preview builds locally
pnpm --filter @repo/platform preview:cloudflare
pnpm --filter @repo/admin preview:cloudflare

# Deploy to Cloudflare
VITE_API_URL="https://api.yourdomain.com" pnpm deploy:platform
VITE_API_URL="https://api.yourdomain.com" pnpm deploy:admin
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository and create your feature branch: `git checkout -b feature/amazing-feature`.
2. Ensure all tests and lint checks pass: `pnpm test && pnpm check`.
3. Commit changes using Conventional Commits: `git commit -m 'feat: add project timeline view'`.
4. Open a Pull Request with a clear summary of your changes.

---

## 📄 License

Distributed under the [MIT License](./LICENSE). See `LICENSE` for more information.
