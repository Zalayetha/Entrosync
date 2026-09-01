import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { createProjectLogSchema, projectLogsQuerySchema } from "./schema";
import { createProjectLog, listProjectLogs } from "./services";

export const projectLogsRouter = new Hono<{ Variables: AuthVariables }>()
  .get("/project/:projectId", zValidator("query", projectLogsQuerySchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await listProjectLogs(c.req.param("projectId"), c.req.valid("query"));
    return c.json({ logs: result }, 200);
  })
  .post("/", zValidator("json", createProjectLogSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await createProjectLog(c.req.valid("json"));
    return c.json(result, 201);
  });
